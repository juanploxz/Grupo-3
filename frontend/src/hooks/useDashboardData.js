import { useEffect, useState } from "react";
import {
  createApplication,
  deleteApplication,
  getDashboardData,
  updateApplication,
  updateProfile,
} from "../services/api";

export function useDashboardData(candidateId) {
  const [state, setState] = useState({
    profile: null,
    matches: [],
    applications: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const data = await getDashboardData(candidateId);
        if (active) {
          setState({ ...data, loading: false, error: null });
        }
      } catch (error) {
        if (active) {
          setState((current) => ({ ...current, loading: false, error: error.message }));
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [candidateId]);

  async function saveProfile(updates) {
    const profile = await updateProfile(candidateId, updates);
    setState((current) => ({ ...current, profile }));
  }

  async function applyToVacancy(payload) {
    const application = await createApplication({
      candidate_id: candidateId,
      vacancy_id: payload.vacancy_id,
      cover_letter: payload.cover_letter,
      availability: payload.availability,
      expected_salary: payload.expected_salary,
      status: "submitted",
    });
    setState((current) => ({
      ...current,
      applications: [...current.applications, application],
    }));
    return application;
  }

  async function editApplication(applicationId, updates) {
    const application = await updateApplication(applicationId, updates);
    setState((current) => ({
      ...current,
      applications: current.applications.map((item) =>
        item.id === applicationId ? { ...item, ...application } : item
      ),
    }));
    return application;
  }

  async function removeApplication(applicationId) {
    await deleteApplication(applicationId);
    setState((current) => ({
      ...current,
      applications: current.applications.filter((application) => application.id !== applicationId),
    }));
  }

  return {
    ...state,
    saveProfile,
    applyToVacancy,
    editApplication,
    removeApplication,
  };
}
