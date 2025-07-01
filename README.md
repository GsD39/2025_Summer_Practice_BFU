# 2025_Summer_Practice_BFU
Just a little piece of code for so-called "educational purposes"


## Structure of the project:
```txt
├── backend/          
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── schedule/
│   │   ├── static/               
│   │   ├── utils/
│   │   └── config.py
│   ├── migrations/
│   ├── requirements.txt
│   ├── .env
│   └── wsgi.py
├── frontend/                     
│   ├── public/
│   ├── src/
│   │   ├── api/                  
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   └── schedule.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ScheduleWeek.vue
│   │   │   ├── ScheduleDate.vue
│   │   │   └── Auth/
│   │   │       ├── LoginForm.vue
│   │   │       └── RegisterForm.vue
│   │   ├── router/               
│   │   ├── store/                
│   │   ├── views/
│   │   │   ├── AuthView.vue
│   │   │   ├── ScheduleView.vue
│   │   │   └── AdminView.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vue.config.js
├── docker-compose.yml            
└── README.md
```



# Frontend part setup

## Project Setup

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
