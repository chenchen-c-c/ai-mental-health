from flask import jsonify

def success(data=None, msg='操作成功'):
    return jsonify({
        'code': 200,
        'data': data,
        'msg': msg
    })

def error(msg='操作失败', code=400):
    return jsonify({
        'code': code,
        'data': None,
        'msg': msg
    })

def unauthorized(msg='未授权访问'):
    return jsonify({
        'code': 401,
        'data': None,
        'msg': msg
    })

def forbidden(msg='权限不足'):
    return jsonify({
        'code': 403,
        'data': None,
        'msg': msg
    })

def not_found(msg='资源不存在'):
    return jsonify({
        'code': 404,
        'data': None,
        'msg': msg
    })