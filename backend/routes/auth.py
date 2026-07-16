from flask import Blueprint, request
from models import User
from extensions import db
from utils.response import success, error, unauthorized
from utils.jwt import generate_token
import hashlib

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return error('用户名和密码不能为空')
    
    user = User.query.filter_by(username=username).first()
    
    if not user or user.password_hash != hash_password(password):
        return error('账号或密码错误')
    
    token = generate_token(user.id, user.username, user.role)
    
    return success({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'nickname': user.nickname,
            'role': user.role,
        }
    }, '登录成功')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    nickname = data.get('nickname')
    phone = data.get('phone')
    
    if not username or not password or not confirm_password:
        return error('用户名、密码和确认密码不能为空')
    
    if password != confirm_password:
        return error('两次输入的密码不一致')
    
    if User.query.filter_by(username=username).first():
        return error('用户名已存在')
    
    if email and User.query.filter_by(email=email).first():
        return error('邮箱已被注册')
    
    new_user = User(
        username=username,
        email=email,
        nickname=nickname,
        phone=phone,
        password_hash=hash_password(password),
        role='user'
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    token = generate_token(new_user.id, new_user.username, new_user.role)
    
    return success({
        'token': token,
        'user': {
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email,
            'nickname': new_user.nickname,
            'role': new_user.role,
        }
    }, '注册成功')

@auth_bp.route('/info', methods=['GET'])
def get_user_info():
    token = request.headers.get('Authorization')
    if not token:
        return unauthorized('请先登录')
    
    if token.startswith('Bearer '):
        token = token[7:]
    
    from utils.jwt import decode_token
    payload = decode_token(token)
    
    if not payload:
        return unauthorized('登录已过期，请重新登录')
    
    user = User.query.get(payload['user_id'])
    if not user:
        return unauthorized('用户不存在')
    
    return success(user.to_dict())