# 29692-actividad3-ederandrade-freddycisneros

## Descripción del proyecto

Sistema editorial basado en **arquitectura de microservicios** para la gestión de **Autores** y **Publicaciones**, desarrollado como parte de la asignatura **Arquitectura de Software**.

El sistema permite:

- Registrar y consultar autores  
- Crear y listar publicaciones  
- Validar autores desde otro microservicio  
- Gestionar estados editoriales (workflow)  
- Simular el proceso BPMN con Token Simulation en Camunda  
- Ejecutar todo el sistema con Docker Compose  

La solución está compuesta por:

- Microservicio **Authors Service**
- Microservicio **Publications Service**
- **Frontend web SPA**
- **MySQL independiente por servicio**
- **Modelo BPMN + Token Simulation**
- **Docker Desktop + Compose**

---

# Arquitectura

```
Frontend (React)
      |
      | HTTP REST
      v
+-------------------+      +------------------------+
|  Authors Service  | <--> | Publications Service   |
+-------------------+      +------------------------+
        |                          |
        v                          v
      MySQL                      MySQL
```

Cada microservicio tiene:
- Base de datos propia
- ORM
- API REST independiente

NO existe dependencia circular.

---

# Tecnologías utilizadas

## Backend
- Node.js
- TypeScript
- Express
- TypeORM
- MySQL 8
- Docker

## Frontend
- React
- Vite
- TypeScript
- Material UI
- Axios
- React Router
- Nginx

## Modelado
- BPMN 2.0
- Camunda Modeler
- Token Simulation

## DevOps
- Docker Desktop
- Docker Compose

---

# Instrucciones de despliegue y ejecución

## Requisitos previos

Instalar:

- Docker Desktop
- Node 20+
- Camunda Modeler (para simulación BPMN)

---

## 1. Clonar proyecto

```bash
git clone https://github.com/EderJAndrade/29692-actividad3-ederandrade-freddycisneros.git
cd 29692-actividad3-ederandrade-freddycisneros
```

---

## 🔹 2. Configurar variables

Crear `.env` o usar `.env.example`

---

## 3. Construir contenedores

```bash
docker compose up --build
```

---

## 4. Verificar estado

```bash
docker compose ps
```

Todos deben estar:
Up (healthy)

---

# URLs del sistema

Frontend:
http://localhost:8080

Authors API:
http://localhost:3001

Publications API:
http://localhost:3002

Health checks:
http://localhost:3001/health
http://localhost:3002/health

---

# Endpoints principales (ejemplos Postman)

## Authors Service

### Crear autor
POST http://localhost:3001/authors

Body:
```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "penName": "JP"
}
```

---

### Listar autores
GET http://localhost:3001/authors

---

### Obtener autor por id
GET http://localhost:3001/authors/1

---

## Publications Service

### Crear publicación
POST http://localhost:3002/publications

```json
{
  "title": "Mi libro",
  "content": "Contenido...",
  "authorId": 1,
  "type": "BOOK",
  "isbn": "123456",
  "genre": "Tecnología"
}
```

---

### Listar publicaciones
GET http://localhost:3002/publications

---

### Obtener detalle (enriquecido con autor)
GET http://localhost:3002/publications/1

---

### Cambiar estado editorial
PATCH http://localhost:3002/publications/1/status

```json
{
  "status": "IN_REVIEW"
}
```

Estados permitidos:
- DRAFT
- IN_REVIEW
- APPROVED
- REJECTED
- PUBLISHED

Transiciones:
DRAFT → IN_REVIEW → (APPROVED | REJECTED) → PUBLISHED

---

# Simulación BPMN (Token Simulation)

1. Abrir `bpmn/publication-process.bpmn` en Camunda Modeler
2. Activar Token Simulation
3. Ejecutar 3 escenarios:
   - Aprobación directa → publicado
   - Rechazo
   - Requiere cambios → aprobación

---

# Comandos útiles

Detener:
```bash
docker compose down
```

Rebuild limpio:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

Logs:
```bash
docker compose logs -f
```

---

Mas detalles en **docs**

---

# Autores

Andrade Alvarado Eder Jonathan  
Cisneros Cárdenas Freddy Gabriel
Arquitectura de Software - 29692  
Universidad de las Fuerzas Armadas - ESPE
