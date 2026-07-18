import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'ai-mental-health-secret-key')
    
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', '3306'))
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '123456')
    MYSQL_DB = os.getenv('MYSQL_DB', 'ai_mental_health')
    
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_EXPIRE_HOURS = int(os.getenv('JWT_EXPIRE_HOURS', '24'))
    
    AI_API_KEY = os.getenv('AI_API_KEY', '')
    AI_API_SECRET = os.getenv('AI_API_SECRET', '')
    AI_APPID = os.getenv('AI_APPID', '')
    AI_BASE_URL = os.getenv('AI_BASE_URL', 'https://api.deepseek.com/v1')
    AI_MODEL = os.getenv('AI_MODEL', 'deepseek-chat')
    AI_MAX_HISTORY = int(os.getenv('AI_MAX_HISTORY', '10'))