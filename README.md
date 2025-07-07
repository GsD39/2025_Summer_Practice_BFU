# 2025_Summer_Practice_BFU

Just a little piece of code for so-called "educational purposes"

## Structure of the project:

```txt
├── backend/          
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── routes.py
│   │   │   ├── services.py
│   │   │   └── utils.py
│   │   ├── admin/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── schedule/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── routes.py
│   │   │   ├── utils.py
│   │   │   └── validators.py
│   │   └── config.py
│   ├── migrations/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env
│   └── wsgi.py
├── frontend/                     
│   ├── public/
│   │   ├── favicon.ico
│   ├── src/
│   │   ├── api/                  
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   └── schedule.js
│   │   ├── assets/
│   │   │   ├── base.css
│   │   │   ├── logo.svg
│   │   │   ├── main.css
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── schedule/
│   │   │   │   ├── LectureForm.vue
│   │   │   │   ├── ScheduleEditor.vue
│   │   │   │   └── UserManagement.vue
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.vue
│   │   │   ├── icons/
│   │   │   │   └── IconCommunity.vue
│   │   │   ├── schedule/
│   │   │   │   ├── ScheduleFilter.vue
│   │   │   │   ├── ScheduleTable.vue
│   │   │   └── └── ScheduleItem.vue
│   │   ├── router/
│   │   │   └── index.js             
│   │   ├── store/
│   │   │   ├── modules/
│   │   │   │   ├── admin.js
│   │   │   │   ├── auth.js
│   │   │   │   └── schedule.js
│   │   │   └── index.js             
│   │   ├── views/
│   │   │   ├── AuthView.vue
│   │   │   ├── ScheduleView.vue
│   │   │   ├── NotFound.vue
│   │   │   └── AdminView.vue
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vue.config.js
├── docker-compose.yml            
└── README.md
```



# Backend part setup
=======


## Project Setup

You should run this commands from the root directory of the project:

```sh
docker-compose up -d --build
docker-compose exec web flask db init
docker-compose exec web flask db migrate -m "update"
docker-compose exec web flask db upgrade
```

It is important to send a POST request to 'api/auth/startup' endpoint right after the first start.



# Frontend part setup
=======


## Project Setup

### Changing working directory to frontend part

```sh
cd frontend
```

### Installing dependencies

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```


## [Description](frontend/DESCRIPTION.md)
