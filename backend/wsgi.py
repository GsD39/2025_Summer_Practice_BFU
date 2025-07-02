import os
from dotenv import load_dotenv
from app import create_app

# Загружаем переменные окружения из .env файла
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = create_app()

if __name__ == "__main__":
    try:
        port = int(os.environ.get('PORT', 5000))
        debug = os.environ.get('FLASK_DEBUG', 'False') == 'True'

        app.run(
            host=os.environ.get('HOST', '0.0.0.0'),
            port=port,
            debug=debug,
            use_reloader=debug
        )
    except Exception as e:
        print(f"Failed to start application: {str(e)}")
        raise