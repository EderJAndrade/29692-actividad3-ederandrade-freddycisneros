# BPMN en Camunda (modelado y simulación)

La actividad pide modelar el **proceso editorial** y simularlo con **Token Simulation** (3 escenarios) sin integrarlo con microservicios.

## 1) Instalar herramientas

- Instalar **Camunda Modeler**.
- Dentro de Camunda Modeler, habilitar/usar el plugin **Token Simulation**.

## 2) Abrir el modelo

El modelo se encuentra en:
- `bpmn/publication-process.bpmn`

## 3) Requisitos BPMN a cumplir

- 1 evento de inicio (creación de borrador por Autor)
- Al menos tareas humanas (User Tasks)
- 1 gateway exclusivo (XOR) para aprobar/rechazar (y opcional cambios)
- 2 eventos de fin: **Publicado** y **Rechazado**
- Pools/Lanes: Autor, Editor, Revisor/Comité
- Flujos completos (sin elementos desconectados)
- Variables para simulación:
  - `aprobado` = true/false
  - `requiereCambios` = true/false

## 4) Configurar Token Simulation (paso a paso)

1. Abrir el `.bpmn`.
2. Abrir el panel de **Token Simulation**.
3. Define variables iniciales:
   - `aprobado` (boolean)
   - `requiereCambios` (boolean, opcional)
4. Para el gateway XOR:
   - Configurar condiciones en los flujos salientes:
     - Flujo "Aprobado": `${aprobado == true}`
     - Flujo "Rechazado": `${aprobado == false}`
     - (Opcional) Flujo "Requiere cambios": `${requiereCambios == true}`

## 5) Evidenciar 3 escenarios

Ejecutar la simulación:

1) **Aprobación directa** hasta fin "Publicado"
- `aprobado=true`, `requiereCambios=false`

2) **Rechazo**
- `aprobado=false`

3) **Requiere cambios y luego aprobación**
- Primera corrida: `requiereCambios=true`
- Luego simula reenvío y segunda aprobación: `aprobado=true`
