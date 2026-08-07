# AI_RULES - Proyecto: Finix (Plataforma Web de Finanzas Personales)

## 1. Arquitectura y Stack Tecnológico
Este proyecto se divide estrictamente en dos directorios principales: `/finix-frontend` y `/backend`. Los agentes deben respetar las fronteras de cada entorno y operar dentro de ellas.

### Backend (`/backend`)
* **Tecnologías Core:** Python y MySQL.
* **Reglas de Desarrollo:**
  * Todos los scripts de conexión, manipulación de datos y lógica de negocio deben vivir exclusivamente en esta carpeta.
  * Se requiere la creación e integración de scripts automatizados para el respaldo y restauración de la base de datos MySQL.
  * Aplicar principios estrictos de administración de seguridad en todas las consultas, así como en la gestión de usuarios y roles, para evitar vulnerabilidades.

### Frontend (`/finix-frontend`)
* **Estructura Visual:** La anatomía principal de las páginas (comenzando por el homepage) debe mantener un diseño semántico que incluya siempre:
  1. `Header` (navegación clara).
  2. `Hero Section` (propuesta de valor principal).
  3. `Footer` (información de contacto y enlaces secundarios).
* **Reglas de Desarrollo:** Mantener un código limpio, modularizado y responsivo. Los componentes visuales deben conectarse limpiamente con la lógica y los datos generados en el `/backend`.

## 2. Metodología de Trabajo y Flujo Ágil
* **Sistema de Gestión:** El desarrollo autónomo se guiará mediante la metodología Kanban.
* **Instrucción Operativa para el Agente:** 1. Antes de iniciar cualquier tarea de desarrollo, lee el estado actual del proyecto en el tablero.
  2. Identifica la siguiente tarea prioritaria a desarrollar.
  3. Ejecuta el código necesario, prueba su funcionamiento, e informa cuando la tarea esté completada para avanzar a la siguiente fase.

## 3. Límites y Restricciones (Autonomía Controlada)
* **Permisos:** Tienes autorización para escribir código, crear componentes, refactorizar archivos dentro de `/finix-frontend` y `/backend`, y utilizar la extensión del navegador para verificar visualmente los cambios en la interfaz.
* **Restricciones Críticas:** Tienes ESTRICTAMENTE PROHIBIDO ejecutar comandos destructivos en las bases de datos (como `DROP TABLE` o `DROP DATABASE`) o modificar configuraciones de seguridad del entorno sin la confirmación humana y explícita del desarrollador.