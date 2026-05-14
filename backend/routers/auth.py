from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from backend.models.auth import UserCreate, UserResponse, Token, UserInDB, RoleEnum
from backend.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_active_user,
    get_current_admin
)
from backend.database.mock_db import users_db
from backend.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Pre-populate an admin user for initial testing
admin_username = "admin"
users_db[admin_username] = UserInDB(
    username=admin_username,
    email="admin@pharmai.com",
    hashed_password=get_password_hash("admin123"),
    role=RoleEnum.ADMIN
)

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    # Check email duplicate
    for u in users_db.values():
        if u.email == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
            
    hashed_password = get_password_hash(user.password)
    # Automatically assign ADMIN if they use admin token/secret, or just standard role
    new_user = UserInDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=RoleEnum.USER
    )
    users_db[user.username] = new_user
    logger.info(f"Registered new user: {user.username}")
    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role.value},
        expires_delta=access_token_expires
    )
    logger.info(f"User logged in: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserInDB = Depends(get_current_active_user)):
    return current_user

@router.get("/admin-only", response_model=dict)
async def admin_only_test(current_user: UserInDB = Depends(get_current_admin)):
    return {"message": f"Welcome Admin {current_user.username}"}
