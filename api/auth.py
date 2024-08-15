from fastapi import Depends, HTTPException
from fastapi_users import FastAPIUsers, schemas
from fastapi_users.authentication import JWTStrategy, AuthenticationBackend, BearerTransport
from fastapi_users.manager import BaseUserManager, UUIDIDMixin
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from typing import Optional
from api.database import get_user_db, User
import uuid

SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTc1MTAxMDExMTIiLCJuYW1lIjoiVGFkYXNoaSBLYW5kYSIsImlhdCI6MTU"

# Password hashing setup
password_hasher = PasswordHash([Argon2Hasher()])

# User Manager
class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    def __init__(self, user_db):
        super().__init__(user_db)
        self.password_hasher = password_hasher

    async def on_after_register(self, user: User, request: Optional = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(self, user: User, token: str, request: Optional = None):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(self, user: User, token: str, request: Optional = None):
        print(f"Verification requested for user {user.id}. Verification token: {token}")

    async def verify_password(self, password: str, hashed_password: str) -> bool:
        return self.password_hasher.verify(password, hashed_password)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

# JWT Strategy and Auth Backend
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])
current_active_user = fastapi_users.current_user(active=True)
