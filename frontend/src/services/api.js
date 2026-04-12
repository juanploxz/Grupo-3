import { mockApplications, mockMatches, mockProfile } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

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
  try {
    return await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    return {
      message: "Demo login",
      candidate_id: mockProfile.id,
      email: mockProfile.email,
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
    return {
      profile: mockProfile,
      matches: mockMatches,
      applications: mockApplications,
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
    return { ...mockProfile, ...updates };
  }
}

export async function createApplication(payload) {
  try {
    return await request("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return {
      id: `application-${Date.now()}`,
      ...payload,
    };
  }
}
