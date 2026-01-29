# 📄 REQUERIMIENTOS TÉCNICOS - BACKEND TERRA CANADA

Este documento detalla los requerimientos y la arquitectura técnica para la implementación del sistema de gestión de pagos de **Terra Canada**.

## 1. Contexto del Proyecto
El sistema está diseñado para controlar pagos a proveedores turísticos, gestionar múltiples medios de pago (tarjetas y cuentas) y automatizar la verificación mediante integración con N8N.

## 2. Stack Tecnológico Requerido
- **Base de Datos**: PostgreSQL 14+
- **Entorno**: Node.js / NestJS (Recomendado)
- **Automatización**: N8N (Webhooks externos)

## 3. Arquitectura de Datos (Reglas Críticas)
Para mantener la consistencia con el frontend y los procesos de automatización existentes, se deben seguir estas reglas:

- **IDs**: Usar `BIGSERIAL` (Autoincrementables) en lugar de UUID para mayor legibilidad y compatibilidad con el sistema de búsqueda.
- **Estados**: No usar ENUMs para estados de flujo; usar campos `BOOLEAN`:
  - `pagado`: Indica si el pago ha sido procesado.
  - `verificado`: Indica si el pago ha sido validado contra un extracto bancario.
  - `gmail_enviado`: Indica si la notificación al proveedor fue enviada.
- **Soft Delete**: Todas las tablas principales deben incluir un campo `activo: boolean` predeterminado en `true`.
- **Timezone**: Configurar la base de datos y la aplicación en `Europe/Paris`.

## 4. Lógica de Negocio en Base de Datos (SQL Functions)
La lógica crítica (validación de saldos, descuentos automáticos de tarjetas, reseteos mensuales) está encapsulada en la base de datos mediante **48 funciones SQL** predefinidas.

> [!IMPORTANT]
> El Backend debe invocar estas funciones mediante llamadas directas a procedimientos almacenados (`CALL` o `SELECT function_name(...)`) usando el pool de conexiones nativo de la base de datos (ej. `pg`, `slonik`). Esto asegura que la integridad del negocio se mantenga centralizada en la DB.

## 5. Entidades Principales

### 5.1 Pagos (Tabla Core)
Un pago vincula:
- 1 Proveedor (que puede tener hasta 4 correos).
- N Clientes (Hoteles/Empresas).
- 1 Medio de Pago (Tarjeta O Cuenta Bancaria).
- 1 Usuario (el que registra).

### 5.2 Medios de Pago
- **Tarjetas de Crédito**: Requieren control de saldo. Al crear un pago, se debe invocar la función de validación de saldo. Tienen un proceso de **Reset Mensual** (Día 1 de cada mes).
- **Cuentas Bancarias**: Actúan solo como etiqueta/referencia; no controlan saldo.

## 6. Integraciones (Webhooks N8N)
El backend debe interactuar con N8N en tres puntos clave:

1. **Subida de Documentos**: Al subir un PDF (Factura o Extracto), se debe disparar un webhook hacia N8N con el `documento_id` y `url`.
2. **Envío de Gmail**: Al confirmar el envío de un correo desde la interfaz, el backend debe enviar los datos al webhook de Gmail de N8N.
3. **Verificación Automática**: N8N invocará endpoints del backend (o funciones SQL directamente) para marcar pagos como `pagado = true` o `verificado = true` tras procesar los PDFs.

## 7. Flujo de Trabajo (Workflow)
1. **Registro**: Un pago se crea con `pagado = false`, `verificado = false`.
2. **Confirmación**: N8N (vía Factura) o un Admin manual cambia `pagado = true`.
3. **Notificación**: Se genera un borrador de correo. Al enviarse, `gmail_enviado = true`.
4. **Verificación**: N8N (vía Extracto Bancario) cambia `verificado = true`.

---
**Nota para el equipo**: Toda la estructura DDL se encuentra documentada en el archivo `03_DDL_COMPLETO.sql`. Al no utilizar un ORM como Prisma, es fundamental que el equipo backend mapee manualmente los tipos de datos de PostgreSQL (especialmente `BIGINT` y `DECIMAL`) a los tipos correspondientes en el lenguaje de programación elegido.
