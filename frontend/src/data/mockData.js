export const mockProfiles = {
  "candidate-1": {
    id: "candidate-1",
    email: "juan@example.com",
    full_name: "Juan Pablo Parra El Masri",
    headline: "Backend developer with product mindset",
    location: "Medellín, Colombia",
    summary:
      "Desarrollador backend con experiencia en APIs, datos y automatización de procesos de empleabilidad.",
    skills: ["Python", "FastAPI", "Neo4j", "Docker", "React", "SQL"],
    experience_years: 3,
    preferred_roles: ["Backend Developer", "Data Engineer"],
    preferred_locations: ["Remote", "Medellín"],
    salary_expectation: 6500000,
    profile_completion: 88,
  },
  "candidate-2": {
    id: "candidate-2",
    email: "mateo@example.com",
    full_name: "Mateo Gomez Giraldo",
    headline: "Frontend developer focused on product experience",
    location: "Bogotá, Colombia",
    summary:
      "Desarrollador frontend con experiencia en interfaces web, sistemas de componentes y experiencia de usuario.",
    skills: ["React", "JavaScript", "CSS", "Testing", "Docker"],
    experience_years: 2,
    preferred_roles: ["Frontend Developer", "UI Engineer"],
    preferred_locations: ["Remote", "Bogotá"],
    salary_expectation: 5500000,
    profile_completion: 84,
  },
  "candidate-3": {
    id: "candidate-3",
    email: "juandiego@example.com",
    full_name: "Juan Diego Cortes",
    headline: "Data and backend profile with graph interest",
    location: "Medellín, Colombia",
    summary:
      "Perfil orientado a datos y backend con interés en automatización, SQL y motores de recomendación.",
    skills: ["Python", "SQL", "Docker", "Neo4j"],
    experience_years: 2,
    preferred_roles: ["Data Engineer", "Backend Developer"],
    preferred_locations: ["Remote", "Medellín"],
    salary_expectation: 6000000,
    profile_completion: 79,
  },
};

export const mockProfilesByEmail = Object.values(mockProfiles).reduce((accumulator, profile) => {
  accumulator[profile.email] = profile;
  return accumulator;
}, {});

export const mockMatchesByCandidate = {
  "candidate-1": [
    {
      vacancy_id: "vacancy-1",
      title: "Backend Developer",
      company: "Magneto Labs",
      location: "Remote",
      score: 90,
      explanation: {
        matched_skills: ["Python", "FastAPI", "Docker", "SQL", "Neo4j"],
        missing_skills: [],
        strengths: [
          "Coincidencia directa con habilidades obligatorias",
          "Disponibilidad alineada con Remote",
        ],
      },
    },
    {
      vacancy_id: "vacancy-2",
      title: "Data Engineer",
      company: "Graph Talent",
      location: "Medellín",
      score: 85,
      explanation: {
        matched_skills: ["Python", "SQL", "Docker", "Neo4j", "FastAPI"],
        missing_skills: [],
        strengths: [
          "Buen encaje técnico para el stack de datos",
          "Disponibilidad alineada con Medellín",
        ],
      },
    },
    {
      vacancy_id: "vacancy-3",
      title: "Frontend React Developer",
      company: "HireFlow",
      location: "Bogotá",
      score: 35,
      explanation: {
        matched_skills: ["React"],
        missing_skills: ["JavaScript", "CSS"],
        strengths: [
          "Tiene base frontend para crecer en el rol",
          "La brecha de skills es visible y explicable",
        ],
      },
    },
  ],
  "candidate-2": [
    {
      vacancy_id: "vacancy-3",
      title: "Frontend React Developer",
      company: "HireFlow",
      location: "Bogotá",
      score: 80,
      explanation: {
        matched_skills: ["React", "JavaScript", "CSS", "Testing"],
        missing_skills: [],
        strengths: [
          "Coincidencia fuerte con el stack frontend",
          "Disponibilidad alineada con Bogotá",
        ],
      },
    },
    {
      vacancy_id: "vacancy-1",
      title: "Backend Developer",
      company: "Magneto Labs",
      location: "Remote",
      score: 20,
      explanation: {
        matched_skills: ["Docker"],
        missing_skills: ["Python", "FastAPI", "SQL"],
        strengths: [
          "Tiene habilidades transferibles para entornos de desarrollo",
          "Necesita reforzar conocimientos backend",
        ],
      },
    },
    {
      vacancy_id: "vacancy-2",
      title: "Data Engineer",
      company: "Graph Talent",
      location: "Medellín",
      score: 10,
      explanation: {
        matched_skills: ["Docker"],
        missing_skills: ["Python", "SQL", "Neo4j"],
        strengths: [
          "Tiene base técnica reutilizable",
          "La brecha de skills es clara para esta vacante",
        ],
      },
    },
  ],
  "candidate-3": [
    {
      vacancy_id: "vacancy-2",
      title: "Data Engineer",
      company: "Graph Talent",
      location: "Medellín",
      score: 85,
      explanation: {
        matched_skills: ["Python", "SQL", "Docker", "Neo4j"],
        missing_skills: [],
        strengths: [
          "Coincidencia fuerte con el perfil de datos",
          "Disponibilidad alineada con Medellín",
        ],
      },
    },
    {
      vacancy_id: "vacancy-1",
      title: "Backend Developer",
      company: "Magneto Labs",
      location: "Remote",
      score: 55,
      explanation: {
        matched_skills: ["Python", "Docker", "SQL", "Neo4j"],
        missing_skills: ["FastAPI"],
        strengths: [
          "Buen encaje para backend con enfoque de datos",
          "Solo falta reforzar una habilidad principal",
        ],
      },
    },
    {
      vacancy_id: "vacancy-3",
      title: "Frontend React Developer",
      company: "HireFlow",
      location: "Bogotá",
      score: 0,
      explanation: {
        matched_skills: [],
        missing_skills: ["React", "JavaScript", "CSS"],
        strengths: [
          "El perfil actual no está orientado a frontend",
          "Conviene priorizar vacantes de datos o backend",
        ],
      },
    },
  ],
};

export const mockApplicationsByCandidate = {
  "candidate-1": [
    {
      id: "application-1",
      candidate_id: "candidate-1",
      vacancy_id: "vacancy-1",
      cover_letter: "Estoy interesado en esta vacante por mi experiencia en APIs y matching laboral.",
      availability: "Inmediata",
      expected_salary: 6500000,
      status: "submitted",
    },
  ],
  "candidate-2": [
    {
      id: "application-2",
      candidate_id: "candidate-2",
      vacancy_id: "vacancy-3",
      cover_letter: "Tengo experiencia construyendo interfaces y sistemas de componentes en React.",
      availability: "Dos semanas",
      expected_salary: 5500000,
      status: "review",
    },
  ],
  "candidate-3": [
    {
      id: "application-3",
      candidate_id: "candidate-3",
      vacancy_id: "vacancy-2",
      cover_letter: "Mi perfil encaja con el enfoque de datos y automatización de procesos.",
      availability: "Inmediata",
      expected_salary: 6000000,
      status: "submitted",
    },
  ],
};

export function buildLocalProfile({ id, email, full_name, password }) {
  return {
    id,
    email,
    full_name,
    password,
    headline: "Nuevo candidato en TheFinder",
    location: "Por definir",
    summary: "Perfil recién creado. Completa tu información para recibir recomendaciones más precisas.",
    skills: [],
    experience_years: 0,
    preferred_roles: [],
    preferred_locations: [],
    salary_expectation: 0,
    profile_completion: 20,
  };
}
