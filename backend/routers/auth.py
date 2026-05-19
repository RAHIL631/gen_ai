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

from backend.database.config import get_db
from backend.database.models import User as DBUser
from sqlalchemy.orm import Session

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

# Seed admin into the persistent DB on router import if not present
from backend.database.config import SessionLocal
db_seed = SessionLocal()
try:
    existing_admin = db_seed.query(DBUser).filter(DBUser.username == admin_username).first()
    if not existing_admin:
        new_admin = DBUser(
            username=admin_username,
            email="admin@pharmai.com",
            hashed_password=get_password_hash("admin123"),
            age=35,
            health_conditions=[]
        )
        db_seed.add(new_admin)
        db_seed.commit()
        logger.info("Admin seeded successfully into persistent database.")
except Exception as e:
    logger.error(f"Error seeding admin into DB: {e}")
finally:
    db_seed.close()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check DB persistent
    db_existing = db.query(DBUser).filter((DBUser.username == user.username) | (DBUser.email == user.email)).first()
    if db_existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
        
    # Check mock fallback
    if user.username in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
            
    hashed_password = get_password_hash(user.password)
    
    # Save to persistent database
    new_db_user = DBUser(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        age=30, # Default placeholder
        health_conditions=[]
    )
    db.add(new_db_user)
    db.commit()
    db.refresh(new_db_user)

    # Save to mock database for compatibility
    new_user = UserInDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=RoleEnum.USER
    )
    users_db[user.username] = new_user
    logger.info(f"Registered new user: {user.username} in database.")
    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Try finding in persistent DB
    db_user = db.query(DBUser).filter(DBUser.username == form_data.username).first()
    
    user = None
    if db_user:
        user = UserInDB(
            username=db_user.username,
            email=db_user.email,
            hashed_password=db_user.hashed_password,
            role=RoleEnum.ADMIN if db_user.username == "admin" else RoleEnum.USER,
            age=db_user.age,
            health_conditions=db_user.health_conditions or []
        )
    else:
        # Fallback to mock DB
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

