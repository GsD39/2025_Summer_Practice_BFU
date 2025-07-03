FROM python:3.9-slim

WORKDIR /app

# Устанавливаем зависимости сначала для кэширования
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем только нужные файлы
COPY ./app .
COPY wsgi.py .
COPY .env .

ENV FLASK_APP=wsgi.py
ENV FLASK_ENV=production

# Явно указываем путь к wsgi.py
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]