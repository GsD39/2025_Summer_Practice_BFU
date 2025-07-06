# Description

## Structure

```
frontend/                               
├── public/
│   └── favicon.ico                 
├── src/
│   ├── api/                  
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── schedule.js
│   ├── assets/
│   ├── components/
│   │   ├── __tests__/
│   │   ├── admin/
|   │   |    ├── ScheduleEditor.vue
│   │   |    ├── ScheduleEditor.vue
│   │   |    └── UserManagement.vue
│   │   ├── auth/
│   │   |   ├── LoginForm.vue
│   │   |   └── RegisterForm.vue
|   |   ├── icons/
│   │   └── schedule/
│   │       ├── ScheduleFilter.vue
│   │       ├── ScheduleItem.vue
│   │       └── ScheduleTable.vue
│   ├── router/
|   |   └── index.js           
│   ├── store/         
|   |   ├── modules/
│   │   │   ├── auth.js
│   │   │   └── schedule.js
│   │   └── index.js       
│   ├── views/
│   │   ├── AdminView.vue
│   │   ├── AuthView.vue
│   │   ├── NotFound.vue
│   │   └── ScheduleView.vue
│   ├── App.vue
│   └── main.js
├── .gitattributes
├── .gitignore
├── .prettierrc.json
├── DESCRIPTION.md
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── vue.config.js
└── vitest.config.js
```