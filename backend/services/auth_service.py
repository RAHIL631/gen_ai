import os
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from backend.models.auth import TokenData, RoleEnum
from backend.database.mock_db import users_db
from backend.utils.logger import get_logger

logger = get_logger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=role)
    except JWTError:
        raise credentials_exception
        
    from backend.database.config import SessionLocal
    from backend.database.models import User as DBUser
    from backend.models.auth import UserInDB, RoleEnum
    
    db = SessionLocal()
    try:
        db_user = db.query(DBUser).filter(DBUser.username == token_data.username).first()
        if db_user is None:
            # Check if there is an in-memory database user (e.g. for fallback/testing)
            from backend.database.mock_db import users_db
            user = users_db.get(token_data.username)
            if user is None:
                raise credentials_exception
            return user
            
        user = UserInDB(
            username=db_user.username,
            email=db_user.email,
            hashed_password=db_user.hashed_password,
            role=RoleEnum(role) if role else RoleEnum.USER,
            age=db_user.age,
            health_conditions=db_user.health_conditions or []
        )
        return user
    finally:
        db.close()

async def get_current_active_user(current_user = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin(current_user = Depends(get_current_active_user)):
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return current_user

