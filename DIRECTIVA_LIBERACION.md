# Directiva de Liberación del Proyecto (Release Directive)

Este documento establece las políticas y normativas que rigen el despliegue a producción de la plataforma **Finix**, asegurando calidad, mantenibilidad y cumplimiento legal.

## 1. Políticas de Versionamiento (Git/SemVer)

El proyecto adopta el **Versionamiento Semántico (SemVer)** con el formato `MAYOR.MENOR.PARCHE` (ej. `v1.0.0-release`).

*   **MAYOR (Major):** Cambios incompatibles en la API o arquitectura base.
*   **MENOR (Minor):** Nuevas funcionalidades (features) retrocompatibles.
*   **PARCHE (Patch):** Corrección de errores (bugfixes) retrocompatibles.

### Reglas de Etiquetado (Tags) para Producción
1. Antes de cualquier despliegue, el código en la rama `main` debe ser etiquetado.
2. Formato del tag: `vX.Y.Z-release`.
3. Comando: `git tag -a v1.0.0-release -m "Versión estable inicial"` seguido de `git push origin v1.0.0-release`.

---

## 2. Protocolo de Rollback (Plan de Reversión)

Si una nueva versión del contenedor en producción presenta fallas críticas (ej. error 500 generalizado, caída de base de datos), el ingeniero DevOps de guardia debe ejecutar el siguiente protocolo de rollback en la terminal del VPS:

1. **Detener el entorno actual defectuoso:**
   ```bash
   docker compose down
   ```
2. **Revertir el código / Cambiar al tag estable anterior:**
   ```bash
   git fetch --tags
   git checkout tags/v<VERSION_ANTERIOR>-release
   ```
3. **Reconstruir y levantar los contenedores con la versión estable:**
   ```bash
   docker compose up -d --build
   ```
4. **Verificar estado:**
   Ejecutar `docker compose ps` y confirmar mediante *curl* o navegador que la aplicación responde correctamente con código 200.

---

## 3. Cumplimiento Normativo (LFPDPPP / GDPR)

Como plataforma financiera, la protección de los datos de nuestros usuarios es prioritaria.

### 3.1 Manejo de Datos de Usuarios (CVs, Nombres, Correos, Balances)
*   **Consentimiento Explícito:** Ningún dato se recolectará sin el consentimiento previo del usuario, solicitado mediante casillas de verificación (checkboxes) en los formularios de registro.
*   **Encriptación en Tránsito y Reposo:** Todos los datos se envían a través de **HTTPS (TLS 1.2/1.3)** asegurado por Nginx. Los datos sensibles en Firebase están protegidos por las reglas de seguridad de Firestore.
*   **Derechos ARCO / GDPR:** Los usuarios tienen el derecho de Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos a través del panel de su cuenta.

### 3.2 Mecanismos de Aviso de Privacidad en la Interfaz Web
*   Se ha implementado un componente de **Aviso de Privacidad (`PrivacyNotice`)** persistente que se muestra a los nuevos visitantes hasta que sea aceptado explícitamente.
*   El texto completo de Términos y Condiciones estará disponible permanentemente en el pie de página (footer) de la plataforma.
