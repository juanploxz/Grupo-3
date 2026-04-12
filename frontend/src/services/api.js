import {
  buildDemoProfile,
  mockApplicationsByCandidate,
  mockMatchesByCandidate,
  mockProfiles,
  mockProfilesByEmail,
} from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const DEMO_ACCOUNTS_KEY = "thefinder-demo-accounts";

function readDemoAccounts() {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(DEMO_ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeDemoAccounts(accounts) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getAllDemoProfiles() {
  const storedProfiles = Object.values(readDemoAccounts()).reduce((accumulator, account) => {
    accumulator[account.profile.id] = account.profile;
    return accumulator;
  }, {});

  return {
    ...mockProfiles,
    ...storedProfiles,
  };
}

function getAllDemoProfilesByEmail() {
  const builtin = { ...mockProfilesByEmail };
  const storedAccounts = readDemoAccounts();

  Object.values(storedAccounts).forEach((account) => {
    builtin[account.profile.email] = account.profile;
  });

  return builtin;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function login(credentials) {
  if (!credentials.email?.trim() || !credentials.password?.trim()) {
    throw new Error("Debes ingresar email y contrasena.");
  }

  try {
    return await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    const profile = getAllDemoProfilesByEmail()[credentials.email?.trim().toLowerCase()];
    if (!profile || credentials.password !== (profile.password || "password123")) {
      throw new Error("Credenciales invalidas.");
    }
    return {
      message: "Demo login",
      candidate_id: profile.id,
      email: profile.email,
    };
  }
}

export async function register(payload) {
  if (!payload.full_name?.trim() || !payload.email?.trim() || !payload.password?.trim()) {
    throw new Error("Completa nombre, email y contrasena.");
  }

  try {
    return await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const allProfilesByEmail = getAllDemoProfilesByEmail();
    if (allProfilesByEmail[normalizedEmail]) {
      throw new Error("El email ya existe.");
    }

    const candidateId = `demo-${Date.now()}`;
    const accounts = readDemoAccounts();
    const profile = buildDemoProfile({
      id: candidateId,
      email: normalizedEmail,
      full_name: payload.full_name.trim(),
      password: payload.password,
    });
    accounts[normalizedEmail] = {
      password: payload.password,
      profile,
      applications: [],
    };
    writeDemoAccounts(accounts);

    return {
      message: "Cuenta creada correctamente",
      candidate_id: candidateId,
      email: normalizedEmail,
    };
  }
}

export async function getDashboardData(candidateId) {
  try {
    const [profile, matches, applications] = await Promise.all([
      request(`/profiles/${candidateId}`),
      request(`/matching/${candidateId}`),
      request(`/applications/${candidateId}`),
    ]);
    return { profile, matches, applications };
  } catch (error) {
    const allProfiles = getAllDemoProfiles();
    const demoAccounts = readDemoAccounts();
    const matchedAccount = Object.values(demoAccounts).find((account) => account.profile.id === candidateId);

    return {
      profile: allProfiles[candidateId] || allProfiles["candidate-1"],
      matches: mockMatchesByCandidate[candidateId] || [],
      applications: matchedAccount?.applications || mockApplicationsByCandidate[candidateId] || [],
    };
  }
}

export async function updateProfile(candidateId, updates) {
  try {
    return await request(`/profiles/${candidateId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  } catch (error) {
    const demoAccounts = readDemoAccounts();
    const matchedEntry = Object.entries(demoAccounts).find(([, account]) => account.profile.id === candidateId);
    if (matchedEntry) {
      const [email, account] = matchedEntry;
      demoAccounts[email] = {
        ...account,
        profile: {
          ...account.profile,
          ...updates,
        },
      };
      writeDemoAccounts(demoAccounts);
      return demoAccounts[email].profile;
    }

    return { ...(mockProfiles[candidateId] || mockProfiles["candidate-1"]), ...updates };
  }
}

export async function createApplication(payload) {
  try {
    return await request("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const application = {
      id: `application-${Date.now()}`,
      ...payload,
      status: payload.status || "submitted",
    };
    const demoAccounts = readDemoAccounts();
    const matchedEntry = Object.entries(demoAccounts).find(([, account]) => account.profile.id === payload.candidate_id);
    if (matchedEntry) {
      const [email, account] = matchedEntry;
      demoAccounts[email] = {
        ...account,
        applications: [...account.applications, application],
      };
      writeDemoAccounts(demoAccounts);
    }
    return application;
  }
}
