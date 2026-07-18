from config import Config
import requests
import logging
import time
import base64
import hashlib
import urllib.parse

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """你是一位专业、温暖、富有同理心的心理健康AI助手。你的职责是倾听用户的倾诉，给予理解和支持。

核心原则：
1. 共情倾听：先理解，再回应。让用户感受到被听见、被接纳。
2. 非评判性：不批评、不指责，尊重每一种情绪的存在。
3. 温暖支持：给予积极正向的鼓励和支持。
4. 引导反思：帮助用户自我觉察和思考。
5. 安全边界：对于严重的心理危机（如自杀倾向、自伤行为），请温和地建议寻求专业心理咨询师或医生的帮助。
6. 适度简洁：回复不宜过长，保持自然流畅，像是在与人对话。

回应风格：
- 使用温暖、关怀的语言
- 避免专业术语，用通俗易懂的表达
- 保持耐心和包容
- 可以适当使用表情符号增加亲切感

示例回应方式：
- 用户表达难过时："我很理解你现在的感受，难过的时候确实需要有人陪伴。"
- 用户表达焦虑时："焦虑的感觉确实不好受，我们可以一起试着慢慢放松下来。"
- 用户分享开心事时："听到你这么开心，我也为你感到高兴！"

重要提示：
- 如果用户提到自杀、自伤或伤害他人的想法，请立即建议他们联系专业心理机构或拨打心理援助热线。
- 你的角色是陪伴和支持，不能替代专业的心理治疗。
"""

def get_ai_response(messages):
    print(f"\n=== AI Request ===")
    print(f"Messages count: {len(messages)}")
    
    if not Config.AI_API_KEY:
        print("ERROR: AI_API_KEY is empty!")
        return get_fallback_response(messages)
    
    print(f"API URL: {Config.AI_BASE_URL}")
    print(f"Model: {Config.AI_MODEL}")
    
    try:
        if 'xf-yun.com' in Config.AI_BASE_URL:
            return call_xunfei_api(messages)
        else:
            return call_openai_compatible_api(messages)
    
    except Exception as e:
        print(f"EXCEPTION! Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return get_fallback_response(messages)

def call_openai_compatible_api(messages):
    history_messages = [
        {'role': 'user' if m['type'] == 'user' else 'assistant', 'content': m['content']}
        for m in messages
    ]
    
    payload = {
        'model': Config.AI_MODEL,
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            *history_messages,
        ],
        'temperature': 0.8,
        'max_tokens': 500,
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {Config.AI_API_KEY}',
    }
    
    print(f"Sending request...")
    
    response = requests.post(
        f"{Config.AI_BASE_URL}/chat/completions",
        json=payload,
        headers=headers,
        timeout=30,
    )
    
    print(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        ai_content = result['choices'][0]['message']['content'].strip()
        print(f"SUCCESS! Response length: {len(ai_content)}")
        print(f"Response: {ai_content[:100]}...")
        return ai_content
    else:
        print(f"FAILED! Status: {response.status_code}")
        print(f"Error: {response.text}")
        return get_fallback_response(messages)

def call_xunfei_api(messages):
    api_key = Config.AI_API_KEY
    api_secret = Config.AI_API_SECRET or api_key
    appid = Config.AI_APPID or 'default'
    
    host = 'spark-api.xf-yun.com'
    endpoint = '/v3.5/chat'
    url = f'https://{host}{endpoint}'
    
    timestamp = str(int(time.time()))
    signature_origin = f"host: {host}\ndate: {timestamp}\nGET {endpoint} HTTP/1.1"
    signature_sha = hashlib.sha256(signature_origin.encode('utf-8')).digest()
    signature_base64 = base64.b64encode(signature_sha).decode('utf-8')
    
    authorization_origin = f'api_key="{api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_base64}"'
    authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode('utf-8')
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': authorization,
        'Host': host,
        'Date': timestamp,
    }
    
    xunfei_messages = [
        {'role': 'user' if m['type'] == 'user' else 'assistant', 'content': m['content']}
        for m in messages
    ]
    
    payload = {
        'header': {
            'app_id': appid,
        },
        'parameter': {
            'chat': {
                'domain': 'generalv3.5',
                'temperature': 0.8,
                'max_tokens': 500,
            }
        },
        'payload': {
            'message': {
                'text': [
                    {'role': 'system', 'content': SYSTEM_PROMPT},
                    *xunfei_messages,
                ]
            }
        }
    }
    
    print(f"Sending request to Xunfei...")
    
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    
    print(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        if 'payload' in result and 'choices' in result['payload']:
            ai_content = result['payload']['choices']['text'][0]['content'].strip()
            print(f"SUCCESS! Response length: {len(ai_content)}")
            print(f"Response: {ai_content[:100]}...")
            return ai_content
        else:
            print(f"FAILED! Unexpected response format: {result}")
            return get_fallback_response(messages)
    else:
        print(f"FAILED! Status: {response.status_code}")
        print(f"Error: {response.text}")
        return get_fallback_response(messages)

def get_fallback_response(messages):
    print("Using fallback (local) response")
    
    if not messages:
        return "你好！我是你的心理健康AI助手，有什么想聊的吗？"
    
    last_message = messages[-1]['content'] if messages else ""
    last_message_lower = last_message.lower()
    
    if any(keyword in last_message_lower for keyword in ['难过', '伤心', '悲伤', '想哭', '不开心']):
        return "我很抱歉听到你现在感到难过。悲伤是一种正常的情绪，给自己一些时间和空间去感受它。我在这里陪着你。"
    
    if any(keyword in last_message_lower for keyword in ['焦虑', '担心', '害怕', '不安', '紧张']):
        return "焦虑就像一个警报器，提醒我们有些事情需要关注。让我们一起深呼吸，慢慢放松下来。我在这里支持你。"
    
    if any(keyword in last_message_lower for keyword in ['生气', '愤怒', '烦', '讨厌', '恨']):
        return "生气是一种很有力量的情绪，它在告诉我们有些东西需要改变。允许自己感受愤怒，但不要被它控制。"
    
    if any(keyword in last_message_lower for keyword in ['开心', '高兴', '快乐', '幸福']):
        return "听到你感到开心，我也很为你高兴！快乐是很珍贵的礼物，好好享受当下的美好时刻。"
    
    return "谢谢你愿意和我分享这些，我在这里认真倾听。你的感受很重要，每一种情绪都值得被看见和理解。"

def init_ai_client():
    print("AI client initialized (using requests library)")
    return True