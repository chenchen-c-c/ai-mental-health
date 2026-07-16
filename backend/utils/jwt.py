import jwt
import time
import functools
from flask import request
from config import Config
from utils.response import unauthorized
from models import User

def generate_token(user_id, username, role):
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'exp': time.time() + Config.JWT_EXPIRE_HOURS * 3600
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def auth_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return unauthorized('请先登录')
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = decode_token(token)
        if not payload:
            return unauthorized('登录已过期，请重新登录')
        
        user = User.query.get(payload['user_id'])
        if not user:
            return unauthorized('用户不存在')
        
        request.user = user
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return unauthorized('请先登录')
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = decode_token(token)
        if not payload:
            return unauthorized('登录已过期，请重新登录')
        
        if payload['role'] != 'admin':
            return unauthorized('权限不足，仅管理员可访问')
        
        user = User.query.get(payload['user_id'])
        if not user:
            return unauthorized('用户不存在')
        
        request.user = user
        return f(*args, **kwargs)
    return decorated