# EduVault Backend (Spring Boot)

## Run steps
1. Create MySQL database:
   ```sql
   create database eduvault_db;
   ```
2. Update `src/main/resources/application.properties` with your MySQL username and password.
3. Run:
   ```bash
   mvn spring-boot:run
   ```

Backend base URL:
```text
http://localhost:8080/api
```

## Important frontend change
In your React project, change the base URL from json-server to Spring Boot.

### `src/api/api.js`
```js
const BASE_URL = 'http://localhost:8080/api';
```

### `src/components/LandingPage.jsx`
```js
const BASE_URL = 'http://localhost:8080/api';
```

## Main endpoints
- `GET /api/students`
- `GET /api/students/{id}`
- `DELETE /api/students/{id}`
- `GET /api/admins`
- `GET /api/admins/{id}`
- `GET /api/resources`
- `GET /api/resources/{id}`
- `POST /api/resources`
- `PUT /api/resources/{id}`
- `PATCH /api/resources/{id}`
- `DELETE /api/resources/{id}`
- `GET /api/departments`
- `GET /api/stats/1`
- `PATCH /api/stats/1`
- `POST /api/auth/student/login`
- `POST /api/auth/admin/login`

## Sample login
### Admin
- email: `admin@eduvault.com`
- password: `admin123`

### Student
- email: `lokesh@student.com`
- password: `1234`
