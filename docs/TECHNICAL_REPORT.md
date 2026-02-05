# Documento técnico (resumen)

## 1. Arquitectura

- **authors-service**: gestiona Autores (registro y consulta). No consulta a Publications (evita dependencia circular).
- **publications-service**: gestiona Publicaciones y estados. Al crear/consultar, **consulta Authors** para validar/enriquecer.
- **frontend:** web para operaciones básicas. fileciteturn0file0
- **MySQL por microservicio:** db-authors y db-publications.
- **Comunicación:** HTTP REST sincrónica.

Diagrama en PlantUML: `docs/architecture.puml`.

## 2. Capas y SOLID (evidencia)

- **Controller (routes)** → `src/controllers/*`
- **Service (casos de uso)** → `src/services/*`
- **Repository (persistencia ORM)** → `src/repositories/*`
- **Entity/Model (dominio)** → `src/domain/entities/*`
- **DTOs** → `src/dto/*` (entrada/salida; no se expone entidades directamente)
- **Validación** → `validateDto.ts` (class-validator)
- **Errores consistentes** → `AppError` + `errorHandler`

## 3. Patrones de diseño (mínimo 3)

1) **Repository Pattern**
- `AuthorsRepository`, `PublicationsRepository` usan TypeORM para aislar persistencia.

2) **Factory Method**
- `PublicationFactory` crea `BookPublication` o `ArticlePublication` a partir de `CreatePublicationDto`.

3) **Strategy**
- `StatusTransitionStrategy` + `DefaultStatusTransitionStrategy` + `PublicationStatusMachine`.
- Se usa en `updateStatus` para validar transiciones sin acoplar reglas al controlador.

4) **Adapter**
- `AuthorsHttpClient` encapsula llamadas HTTP a Authors Service y normaliza errores (404, timeout, etc.).

## 4. Endpoints y ejemplos

Ver `requests.http` en cada microservicio.

### Authors
- POST `/authors`
- GET `/authors/:id`
- GET `/authors`

### Publications
- POST `/publications` (valida autor)
- GET `/publications/:id` (enriquecida con autor)
- GET `/publications`
- PATCH `/publications/:id/status`

## 5. Despliegue

Ver `README.md` y `docker-compose.yml` en la raíz (incluye redes, variables, volúmenes y healthchecks).
