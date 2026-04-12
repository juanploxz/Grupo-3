from __future__ import annotations

import uuid

from fastapi import HTTPException, status

from app.core.security import hash_password, verify_password
from app.repositories.candidate_repo import CandidateRepository
from app.repositories.graph_repo import GraphRepository
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest


class AuthService:
    def __init__(self) -> None:
        self.repository = CandidateRepository()
        self.graph_repository = GraphRepository()

    def register(self, payload: RegisterRequest) -> AuthResponse:
        if self.repository.get_by_email(payload.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya existe")

        candidate = {
            "id": f"candidate-{uuid.uuid4().hex[:8]}",
            "email": payload.email,
            "password_hash": hash_password(payload.password),
            "full_name": payload.full_name,
            "headline": "Nuevo candidato en TheFinder",
            "location": "Por definir",
            "summary": "Perfil recien creado. Completa la informacion para mejorar el matching.",
            "skills": [],
            "experience_years": 0,
            "preferred_roles": [],
            "preferred_locations": [],
            "salary_expectation": 0,
            "cv_filename": None,
            "profile_completion": 20,
        }
        self.repository.create(candidate)
        self.graph_repository.upsert_candidate(candidate)
        return AuthResponse(message="Cuenta creada correctamente", candidate_id=candidate["id"], email=candidate["email"])

    def login(self, payload: LoginRequest) -> AuthResponse:
        candidate = self.repository.get_by_email(payload.email)
        if not candidate or not verify_password(payload.password, candidate["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas")
        return AuthResponse(message="Inicio de sesion exitoso", candidate_id=candidate["id"], email=candidate["email"])
