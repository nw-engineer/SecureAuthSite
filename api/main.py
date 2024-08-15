from fastapi_users import schemas
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.auth import fastapi_users, auth_backend, current_active_user, get_user_manager, get_jwt_strategy
from api.schemas import TOTPRequest, TfaRequest
from api.database import engine, Base
import uuid
import pyotp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/auth/check-totp")
async def check_totp(user=Depends(current_active_user)):
    if not user.totp_secret:
        return {"totp_setup_required": True}
    return {"totp_required": True}

@app.get("/auth/totp-setup")
async def totp_setup(user=Depends(current_active_user), user_manager=Depends(get_user_manager)):
    if not user.totp_secret:
        user.totp_secret = pyotp.random_base32()
        update_dict = {"totp_secret": user.totp_secret}
        await user_manager.user_db.update(user, update_dict)

    totp_uri = pyotp.TOTP(user.totp_secret).provisioning_uri(user.email, issuer_name="DemoSite")
    return {"totp_uri": totp_uri}

@app.post("/auth/setup-totp")
async def setup_totp(request: TOTPRequest, user=Depends(current_active_user), user_manager=Depends(get_user_manager)):
    totp = pyotp.TOTP(user.totp_secret)
    if totp.verify(request.otp):
        return {"success": True}
    else:
        return {"success": False, "detail": "Invalid TOTP code"}

@app.post("/auth/login-tfa")
async def login_tfa(request: TfaRequest, user_manager=Depends(get_user_manager)):
    user = await user_manager.get_by_email(request.username)
    if not user or not await user_manager.verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    totp = pyotp.TOTP(user.totp_secret)
    if not totp.verify(request.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    jwt_strategy = get_jwt_strategy()
    token = await jwt_strategy.write_token(user)
    return {"token": token}

app.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
app.include_router(fastapi_users.get_register_router(schemas.BaseUser[uuid.UUID], schemas.BaseUserCreate), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_verify_router(schemas.BaseUser[uuid.UUID]), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_users_router(schemas.BaseUser[uuid.UUID], schemas.BaseUserUpdate), prefix="/users", tags=["users"])
