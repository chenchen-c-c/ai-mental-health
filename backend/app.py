from flask import Flask
from config import Config
from extensions import db, cors
from utils.response import error
from utils.ai import init_ai_client, get_ai_response
import os
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)

print(f"=== AI Configuration ===")
print(f"AI_API_KEY: {Config.AI_API_KEY[:5]}... (exists: {bool(Config.AI_API_KEY)})")
print(f"AI_BASE_URL: {Config.AI_BASE_URL}")
print(f"AI_MODEL: {Config.AI_MODEL}")
print(f"AI_MAX_HISTORY: {Config.AI_MAX_HISTORY}")
print(f"=======================")

init_ai_client()

db.init_app(app)
cors.init_app(app, resources={r'/api/*': {'origins': '*', 'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 'allow_headers': ['Content-Type', 'Authorization']}})

from routes.auth import auth_bp
from routes.journal import journal_bp
from routes.chat import chat_bp
from routes.knowledge import knowledge_bp
from routes.dashboard import dashboard_bp

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(journal_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(knowledge_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp, url_prefix='/api')

@app.route('/api/test-auth')
def test_auth():
    return {'code': 200, 'data': 'Auth route test', 'msg': 'OK'}

@app.route('/api/health')
def health():
    return {'code': 200, 'data': 'OK', 'msg': '健康检查通过'}

@app.errorhandler(400)
def bad_request(e):
    return error('请求参数错误', 400)

@app.errorhandler(404)
def page_not_found(e):
    return error('接口不存在', 404)

@app.errorhandler(500)
def internal_server_error(e):
    return error('服务器内部错误', 500)

@app.errorhandler(Exception)
def handle_exception(e):
    return error(str(e), 500)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        from models import User, KnowledgeCategory
        import hashlib
        
        if not User.query.filter_by(username='admin').first():
            admin_user = User(
                username='admin',
                password_hash=hashlib.sha256('123456'.encode()).hexdigest(),
                role=1
            )
            db.session.add(admin_user)
        
        if not User.query.filter_by(username='user').first():
            normal_user = User(
                username='user',
                password_hash=hashlib.sha256('123456'.encode()).hexdigest(),
                role=0
            )
            db.session.add(normal_user)
        
        categories = [
            {'name': '情绪管理', 'color': '#fbbf24'},
            {'name': '压力缓解', 'color': '#ef4444'},
            {'name': '人际关系', 'color': '#60a5fa'},
            {'name': '心理健康基础', 'color': '#22c55e'},
        ]
        for cat in categories:
            if not KnowledgeCategory.query.filter_by(name=cat['name']).first():
                category = KnowledgeCategory(name=cat['name'], color=cat['color'])
                db.session.add(category)
        
        db.session.commit()
    
    app.run(host='0.0.0.0', port=5000, debug=True)