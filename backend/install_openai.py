import subprocess
import sys

def install_package(package):
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
        print(f"✅ 安装成功: {package}")
    except subprocess.CalledProcessError as e:
        print(f"❌ 安装失败: {package}")
        print(f"错误信息: {e}")
    except Exception as e:
        print(f"❌ 安装异常: {package}")
        print(f"错误信息: {e}")

if __name__ == '__main__':
    print("开始安装 openai...")
    install_package("openai==1.14.0")