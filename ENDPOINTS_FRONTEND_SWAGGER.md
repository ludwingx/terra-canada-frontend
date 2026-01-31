# Endpoints Frontend (basado en `swagger.json`)

## Base URL
- `{{base_url}} = https://terra-canada-control-pagos.vamw1k.easypanel.host/api/v1`

## Autenticación
Según Swagger: **todos los endpoints requieren JWT** excepto `POST /auth/login`.

### Headers estándar (autenticadas)
```http
Authorization: Bearer {{jwt_token}}
Content-Type: application/json
```

### Token simulado
```text
{{jwt_token}} = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SIMULATED_PAYLOAD.SIMULATED_SIGNATURE
```

---

# Módulo: Autenticación

## Login (Página Login)
### POST `{{base_url}}/auth/login`
- **Auth**: NO (security: [])
- **Body (application/json)**
```json
{
  "username": "admin",
  "password": "password123"
}
```

## Sesión actual (Sidebar / bootstrap sesión)
### GET `{{base_url}}/auth/me`
- **Auth**: Bearer
- **Body**: (sin body)

---

# Módulo: Análisis

## Dashboard
### GET `{{base_url}}/analisis/dashboard`
- **Auth**: Bearer

## Reporte pagos
### GET `{{base_url}}/analisis/reportes/pagos`
- **Auth**: Bearer
- **Query params (swagger)**
```text
proveedor_id?: integer
estado?: string
fecha_inicio?: string (date)
fecha_fin?: string (date)
```

---

# Módulo: Clientes

## Listar clientes (Página Clientes)
### GET `{{base_url}}/clientes`
- **Auth**: Bearer

## Crear cliente (Modal Crear Cliente)
### POST `{{base_url}}/clientes`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan.perez@example.com",
  "telefono": "+1234567890",
  "direccion": "123 Main St, Toronto ON",
  "notas": "Cliente frecuente",
  "usuario_id": 2
}
```

---

# Módulo: Proveedores

## Listar proveedores (Página Proveedores)
### GET `{{base_url}}/proveedores`
- **Auth**: Bearer

## Crear proveedor (Modal Crear Proveedor)
### POST `{{base_url}}/proveedores`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre": "Air Canada",
  "lenguaje": "English",
  "correo1": "billing@aircanada.com",
  "correo2": "",
  "correo3": "",
  "correo4": "",
  "usuario_id": 2
}
```

## Actualizar proveedor (Modal Editar Proveedor)
### PUT `{{base_url}}/proveedores/{{id}}`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre": "Air Canada",
  "lenguaje": "English",
  "correo1": "billing@aircanada.com",
  "correo2": "",
  "correo3": "",
  "correo4": "",
  "usuario_id": 2
}
```

---

# Módulo: Roles

## Listar roles (Combos / módulo Roles)
### GET `{{base_url}}/roles`
- **Auth**: Bearer

## Crear rol
### POST `{{base_url}}/roles`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre": "CONTADOR",
  "descripcion": "Rol para personal de contabilidad",
  "usuario_id": 2
}
```

---

# Módulo: Usuarios

## Listar usuarios (Página Usuarios)
### GET `{{base_url}}/usuarios`
- **Auth**: Bearer

## Crear usuario (Modal Crear Usuario)
### POST `{{base_url}}/usuarios`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre_usuario": "jdoe",
  "password": "Password123!",
  "nombre_completo": "John Doe",
  "email": "john@example.com",
  "rol_id": 1,
  "usuario_id": 3
}
```

## Actualizar usuario (Modal Editar Usuario)
### PUT `{{base_url}}/usuarios/{{id}}`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre_usuario": "jdoe",
  "password": "Password123!",
  "nombre_completo": "John Doe",
  "email": "john@example.com",
  "rol_id": 1,
  "usuario_id": 3
}
```

---

# Módulo: Cuentas Bancarias

## Listar cuentas
### GET `{{base_url}}/cuentas`
- **Auth**: Bearer

## Crear cuenta
### POST `{{base_url}}/cuentas`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre_banco": "TD Canada Trust",
  "nombre_cuenta": "Business Checking Account",
  "ultimos_4_digitos": "5678",
  "moneda": "CAD",
  "activo": true,
  "usuario_id": 2
}
```

---

# Módulo: Tarjetas

## Listar tarjetas
### GET `{{base_url}}/tarjetas`
- **Auth**: Bearer

## Crear tarjeta
### POST `{{base_url}}/tarjetas`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "nombre_titular": "Juan Pérez",
  "ultimos_4_digitos": "1234",
  "moneda": "USD",
  "limite_mensual": 5000,
  "tipo_tarjeta": "Visa",
  "activo": true,
  "usuario_id": 2
}
```

---

# Módulo: Pagos

## Listar pagos (Página Pagos)
### GET `{{base_url}}/pagos`
- **Auth**: Bearer
- **Query params (swagger)**
```text
proveedor_id?: integer
estado?: "PENDIENTE" | "COMPLETADO" | "CANCELADO"
fecha_desde?: string (date)
fecha_hasta?: string (date)
```

## Crear pago (Modal Crear Pago)
### POST `{{base_url}}/pagos`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "proveedor_id": 2,
  "usuario_id": 2,
  "codigo_reserva": "RES-2026-004",
  "monto": 500,
  "moneda": "USD",
  "tipo_medio_pago": "TARJETA",
  "tarjeta_id": 1,
  "cuenta_bancaria_id": null,
  "clientes_ids": [1, 2],
  "descripcion": "Pago de servicio de guía turística",
  "fecha_esperada_debito": "2026-02-15"
}
```

## Actualizar pago
### PUT `{{base_url}}/pagos/{{id}}`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "monto": 600,
  "descripcion": "Descripción actualizada",
  "fecha_esperada_debito": "2026-02-15"
}
```

---

# Módulo: Correos

## Listar correos
### GET `{{base_url}}/correos`
- **Auth**: Bearer
- **Query params (swagger)**
```text
estado?: "BORRADOR" | "ENVIADO"
proveedor_id?: integer
fecha_desde?: string (date-time)
fecha_hasta?: string (date-time)
```

## Crear correo manual
### POST `{{base_url}}/correos`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "proveedor_id": 1,
  "correo_seleccionado": "billing@aircanada.com",
  "asunto": "Pago de reservas",
  "cuerpo": "Adjuntamos detalle de pagos.",
  "pago_ids": [10, 11, 12]
}
```

## Correos pendientes
### GET `{{base_url}}/correos/pendientes`
- **Auth**: Bearer

## Generar correos
### POST `{{base_url}}/correos/generar`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "proveedor_id": 1
}
```

---

# Módulo: Documentos

## Listar documentos
### GET `{{base_url}}/documentos`
- **Auth**: Bearer

## Crear documento (registrar metadatos)
### POST `{{base_url}}/documentos`
- **Auth**: Bearer
- **Body (application/json)**
```json
{
  "tipo_documento": "FACTURA",
  "nombre_archivo": "factura_RES-2026-001.pdf",
  "url_documento": "https://storage.terracanada.com/facturas/2026/01/factura.pdf",
  "usuario_id": 2,
  "pago_id": 10
}
```

---

# Módulo: Eventos (Auditoría)

## Consultar eventos
### GET `{{base_url}}/eventos`
- **Auth**: Bearer
- **Query params (swagger)**
```text
tabla?: string
tipo_evento?: string
usuario_id?: integer
limit?: integer (default 100)
offset?: integer (default 0)
```

---

## Nota
Este archivo está basado en las definiciones visibles en `swagger.json` (OpenAPI 3.0). Si me indicas qué páginas/modales exactos tienes en el UI (y si existe módulo de "Servicios" en frontend), lo ajusto para mapear 1:1 cada pantalla -> endpoints.
