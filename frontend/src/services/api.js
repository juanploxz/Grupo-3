import {
  buildLocalProfile,
  mockApplicationsByCandidate,
  mockMatchesByCandidate,
  mockProfiles,
  mockProfilesByEmail,
} from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const LOCAL_ACCOUNTS_KEY = "thefinder-local-accounts";

function readLocalAccounts() {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(LOCAL_ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeLocalAccounts(accounts) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getAllProfiles() {
  const storedProfiles = Object.values(readLocalAccounts()).reduce((accumulator, account) => {
    accumulator[account.profile.id] = account.profile;
    return accumulator;
  }, {});

  return {
    ...mockProfiles,
    ...storedProfiles,
  };
}

function getAllProfilesByEmail() {
  const builtin = { ...mockProfilesByEmail };
  const storedAccounts = readLocalAccounts();

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
    throw new Error("Debes ingresar correo electrónico y contraseña.");
  }

  try {
    return await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    const profile = getAllProfilesByEmail()[credentials.email?.trim().toLowerCase()];
    if (!profile || credentials.password !== (profile.password || "password123")) {
      throw new Error("Credenciales inválidas.");
    }
    return {
      message: "Inicio de sesión exitoso",
      candidate_id: profile.id,
      email: profile.email,
    };
  }
}

export async function register(payload) {
  if (!payload.full_name?.trim() || !payload.email?.trim() || !payload.password?.trim()) {
    throw new Error("Completa nombre, correo electrónico y contraseña.");
  }

  try {
    return await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const allProfilesByEmail = getAllProfilesByEmail();
    if (allProfilesByEmail[normalizedEmail]) {
      throw new Error("El email ya existe.");
    }

    const candidateId = `candidate-${Date.now()}`;
    const accounts = readLocalAccounts();
    const profile = buildLocalProfile({
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
    writeLocalAccounts(accounts);

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
    const allProfiles = getAllProfiles();
    const localAccounts = readLocalAccounts();
    const matchedAccount = Object.values(localAccounts).find((account) => account.profile.id === candidateId);

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
    const localAccounts = readLocalAccounts();
    const matchedEntry = Object.entries(localAccounts).find(([, account]) => account.profile.id === candidateId);
    if (matchedEntry) {
      const [email, account] = matchedEntry;
      localAccounts[email] = {
        ...account,
        profile: {
          ...account.profile,
          ...updates,
        },
      };
      writeLocalAccounts(localAccounts);
      return localAccounts[email].profile;
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
    const localAccounts = readLocalAccounts();
    const matchedEntry = Object.entries(localAccounts).find(([, account]) => account.profile.id === payload.candidate_id);
    if (matchedEntry) {
      const [email, account] = matchedEntry;
      localAccounts[email] = {
        ...account,
        applications: [...account.applications, application],
      };
      writeLocalAccounts(localAccounts);
    }
    return application;
  }
}

export async function updateApplication(applicationId, updates) {
  try {
    return await request(`/applications/${applicationId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  } catch (error) {
    const localAccounts = readLocalAccounts();
    const matchedEntry = Object.entries(localAccounts).find(([, account]) =>
      account.applications?.some((application) => application.id === applicationId)
    );

    if (matchedEntry) {
      const [email, account] = matchedEntry;
      const application = account.applications.find((item) => item.id === applicationId);
      const updatedApplication = { ...application, ...updates };
      localAccounts[email] = {
        ...account,
        applications: account.applications.map((item) =>
          item.id === applicationId ? updatedApplication : item
        ),
      };
      writeLocalAccounts(localAccounts);
      return updatedApplication;
    }

    return { id: applicationId, ...updates };
  }
}

export async function deleteApplication(applicationId) {
  try {
    return await request(`/applications/${applicationId}`, {
      method: "DELETE",
    });
  } catch (error) {
    const localAccounts = readLocalAccounts();
    const matchedEntry = Object.entries(localAccounts).find(([, account]) =>
      account.applications?.some((application) => application.id === applicationId)
    );

    if (matchedEntry) {
      const [email, account] = matchedEntry;
      localAccounts[email] = {
        ...account,
        applications: account.applications.filter((application) => application.id !== applicationId),
      };
      writeLocalAccounts(localAccounts);
    }

    return { id: applicationId, deleted: true };
  }
}
