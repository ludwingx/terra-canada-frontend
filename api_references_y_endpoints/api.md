---
title: API Terra Canada - Sistema de Gestión de Pagos v1.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2
---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos">API Terra Canada - Sistema de Gestión de Pagos v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API RESTful para gestionar pagos a proveedores de servicios turísticos.

## Características principales:

- Autenticación JWT con control de roles (ADMIN, SUPERVISOR, EQUIPO)
- Gestión de pagos con tarjetas de crédito y cuentas bancarias
- Control automático de saldo de tarjetas
- Procesamiento de documentos (facturas y extractos)
- Integración con N8N para automatización
- Sistema de auditoría completo
- Análisis y reportes de negocio

## Autenticación:

Todos los endpoints requieren autenticación JWT, excepto /auth/login.
Incluir el token en el header: Authorization: Bearer {token}

Base URLs:

- <a href="http://localhost:3000/api/v1">http://localhost:3000/api/v1</a>

- <a href="https://api.terracanada.com/api/v1">https://api.terracanada.com/api/v1</a>

Email: <a href="mailto:tech@terracanada.com">Terra Canada</a>
License: <a href="https://terracanada.com">Privado</a>

# Authentication

- HTTP Authentication, scheme: bearer JWT Token de autenticación

* API Key (n8nToken)
  - Parameter Name: **x-n8n-token**, in: header. Token de autenticación para webhooks de N8N

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-autenticaci-n">Autenticación</h1>

Endpoints de autenticación y autorización

## post\_\_auth_login

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST http://localhost:3000/api/v1/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "username": "admin",
  "password": "password123"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/api/v1/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post 'http://localhost:3000/api/v1/auth/login',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('http://localhost:3000/api/v1/auth/login', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/auth/login', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/auth/login");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/auth/login", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth/login`

_Iniciar sesión_

> Body parameter

```json
{
  "username": "admin",
  "password": "password123"
}
```

<h3 id="post__auth_login-parameters">Parameters</h3>

| Name       | In   | Type             | Required | Description                            |
| ---------- | ---- | ---------------- | -------- | -------------------------------------- |
| body       | body | object           | true     | none                                   |
| » username | body | string           | true     | Nombre de usuario o correo electrónico |
| » password | body | string(password) | true     | Contraseña del usuario                 |

> Example responses

> 200 Response

```json
{
  "code": 200,
  "estado": true,
  "message": "Login exitoso",
  "data": {
    "token": "string",
    "user": {
      "id": 0,
      "nombre_usuario": "string",
      "nombre_completo": "string",
      "correo": "string",
      "rol": {
        "id": 0,
        "nombre": "string"
      }
    }
  }
}
```

> 401 Response

```json
{
  "code": 401,
  "estado": false,
  "message": "No autorizado: Token no proporcionado",
  "data": null
}
```

<h3 id="post__auth_login-responses">Responses</h3>

| Status | Meaning                                                         | Description                                | Schema                |
| ------ | --------------------------------------------------------------- | ------------------------------------------ | --------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Login exitoso                              | Inline                |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Token de autenticación faltante o inválido | [Error](#schemaerror) |

<h3 id="post__auth_login-responseschema">Response Schema</h3>

Status Code **200**

| Name                | Type    | Required | Restrictions | Description                |
| ------------------- | ------- | -------- | ------------ | -------------------------- |
| » code              | integer | false    | none         | none                       |
| » estado            | boolean | false    | none         | none                       |
| » message           | string  | false    | none         | none                       |
| » data              | object  | false    | none         | none                       |
| »» token            | string  | false    | none         | JWT token de autenticación |
| »» user             | object  | false    | none         | none                       |
| »»» id              | integer | false    | none         | none                       |
| »»» nombre_usuario  | string  | false    | none         | none                       |
| »»» nombre_completo | string  | false    | none         | none                       |
| »»» correo          | string  | false    | none         | none                       |
| »»» rol             | object  | false    | none         | none                       |
| »»»» id             | integer | false    | none         | none                       |
| »»»» nombre         | string  | false    | none         | none                       |

<aside class="success">
This operation does not require authentication
</aside>

## get\_\_auth_me

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/auth/me HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/auth/me', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/auth/me',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/auth/me', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/auth/me', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/auth/me");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/auth/me", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /auth/me`

_Obtener información del usuario autenticado_

> Example responses

> 401 Response

```json
{
  "code": 401,
  "estado": false,
  "message": "No autorizado: Token no proporcionado",
  "data": null
}
```

<h3 id="get__auth_me-responses">Responses</h3>

| Status | Meaning                                                         | Description                                | Schema                |
| ------ | --------------------------------------------------------------- | ------------------------------------------ | --------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Usuario obtenido exitosamente              | None                  |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Token de autenticación faltante o inválido | [Error](#schemaerror) |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-usuarios">Usuarios</h1>

Gestión de usuarios del sistema

## get\_\_usuarios

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/usuarios \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/usuarios HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/usuarios', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/usuarios',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/usuarios', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/usuarios', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/usuarios");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/usuarios", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /usuarios`

_Listar todos los usuarios_

Obtiene una lista de todos los usuarios del sistema

<h3 id="get__usuarios-responses">Responses</h3>

| Status | Meaning                                                         | Description                             | Schema |
| ------ | --------------------------------------------------------------- | --------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Lista de usuarios obtenida exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                          | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos                            | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_usuarios

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/usuarios \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/usuarios HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre_usuario": "jdoe",
  "contrasena": "Password123!",
  "nombre_completo": "John Doe",
  "correo": "john@example.com",
  "rol_id": 1,
  "usuario_id": 3
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/usuarios',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/usuarios',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/usuarios', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/usuarios', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/usuarios");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/usuarios", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /usuarios`

_Crear un nuevo usuario_

Crea un nuevo usuario en el sistema con contraseña hasheada

> Body parameter

```json
{
  "nombre_usuario": "jdoe",
  "contrasena": "Password123!",
  "nombre_completo": "John Doe",
  "correo": "john@example.com",
  "rol_id": 1,
  "usuario_id": 3
}
```

<h3 id="post__usuarios-parameters">Parameters</h3>

| Name              | In   | Type          | Required | Description                       |
| ----------------- | ---- | ------------- | -------- | --------------------------------- |
| body              | body | object        | true     | none                              |
| » nombre_usuario  | body | string        | true     | none                              |
| » contrasena      | body | string        | true     | none                              |
| » nombre_completo | body | string        | true     | none                              |
| » correo          | body | string(email) | false    | none                              |
| » rol_id          | body | integer       | true     | none                              |
| » usuario_id      | body | integer       | false    | ID del usuario auditor (opcional) |

<h3 id="post__usuarios-responses">Responses</h3>

| Status | Meaning                                                          | Description                 | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Usuario creado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos             | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado              | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (solo ADMIN)   | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__usuarios_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/usuarios/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/usuarios/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/usuarios/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/usuarios/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/usuarios/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/usuarios/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/usuarios/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/usuarios/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /usuarios/{id}`

_Obtener un usuario por ID_

Obtiene la información detallada de un usuario específico

<h3 id="get__usuarios_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description    |
| ---- | ---- | ------- | -------- | -------------- |
| id   | path | integer | true     | ID del usuario |

<h3 id="get__usuarios_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description           | Schema |
| ------ | --------------------------------------------------------------- | --------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Usuario encontrado    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado        | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos          | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Usuario no encontrado | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__usuarios_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/usuarios/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/usuarios/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre_usuario": "string",
  "contrasena": "string",
  "nombre_completo": "string",
  "correo": "user@example.com",
  "rol_id": 0,
  "usuario_id": 3
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/usuarios/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/usuarios/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/usuarios/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/usuarios/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/usuarios/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/usuarios/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /usuarios/{id}`

_Actualizar un usuario existente_

Actualiza la información de un usuario. Si se proporciona password, se hashea automáticamente

> Body parameter

```json
{
  "nombre_usuario": "string",
  "contrasena": "string",
  "nombre_completo": "string",
  "correo": "user@example.com",
  "rol_id": 0,
  "usuario_id": 3
}
```

<h3 id="put__usuarios_{id}-parameters">Parameters</h3>

| Name              | In   | Type          | Required | Description                                    |
| ----------------- | ---- | ------------- | -------- | ---------------------------------------------- |
| id                | path | integer       | true     | ID del usuario a actualizar                    |
| body              | body | object        | true     | none                                           |
| » nombre_usuario  | body | string        | false    | none                                           |
| » contrasena      | body | string        | false    | Nueva contraseña (se hasheará automáticamente) |
| » nombre_completo | body | string        | false    | none                                           |
| » correo          | body | string(email) | false    | none                                           |
| » rol_id          | body | integer       | false    | none                                           |
| » usuario_id      | body | integer       | false    | ID del usuario auditor (opcional)              |

<h3 id="put__usuarios_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                      | Schema |
| ------ | ---------------------------------------------------------------- | -------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Usuario actualizado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                  | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                   | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (solo ADMIN)        | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Usuario no encontrado            | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__usuarios_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/usuarios/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/usuarios/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/usuarios/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/usuarios/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/usuarios/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/usuarios/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/usuarios/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/usuarios/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /usuarios/{id}`

_Eliminar un usuario (soft delete)_

Desactiva un usuario marcándolo como inactivo (no se elimina físicamente)

<h3 id="delete__usuarios_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | ID del usuario a eliminar         |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

<h3 id="delete__usuarios_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description                                  | Schema |
| ------ | --------------------------------------------------------------- | -------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Usuario eliminado (desactivado) exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                               | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (solo ADMIN)                    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Usuario no encontrado                        | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-roles">Roles</h1>

Gestión de roles y permisos

## get\_\_roles

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/roles \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/roles HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/roles', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/roles',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/roles', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/roles', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/roles");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/roles", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /roles`

_Listar todos los roles_

> Example responses

> 401 Response

```json
{
  "code": 401,
  "estado": false,
  "message": "No autorizado: Token no proporcionado",
  "data": null
}
```

<h3 id="get__roles-responses">Responses</h3>

| Status | Meaning                                                         | Description                                | Schema                |
| ------ | --------------------------------------------------------------- | ------------------------------------------ | --------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Lista de roles                             | None                  |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | Token de autenticación faltante o inválido | [Error](#schemaerror) |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_roles

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/roles \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/roles HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre": "CONTADOR",
  "descripcion": "Rol para personal de contabilidad",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/roles',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/roles',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/roles', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/roles', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/roles");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/roles", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /roles`

_Crear un nuevo rol_

> Body parameter

```json
{
  "nombre": "CONTADOR",
  "descripcion": "Rol para personal de contabilidad",
  "usuario_id": 2
}
```

<h3 id="post__roles-parameters">Parameters</h3>

| Name          | In   | Type    | Required | Description                       |
| ------------- | ---- | ------- | -------- | --------------------------------- |
| body          | body | object  | true     | none                              |
| » nombre      | body | string  | true     | none                              |
| » descripcion | body | string  | false    | none                              |
| » usuario_id  | body | integer | false    | ID del usuario auditor (opcional) |

<h3 id="post__roles-responses">Responses</h3>

| Status | Meaning                                                       | Description   | Schema |
| ------ | ------------------------------------------------------------- | ------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)  | Rol creado    | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8) | Rol ya existe | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__roles_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/roles/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/roles/{id} HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/roles/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/roles/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/roles/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/roles/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/roles/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/roles/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /roles/{id}`

_Obtener un rol por ID_

<h3 id="get__roles_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| id   | path | integer | true     | ID del rol  |

> Example responses

> 404 Response

```json
{
  "code": 404,
  "estado": false,
  "message": "Recurso no encontrado",
  "data": null
}
```

<h3 id="get__roles_{id}-responses">Responses</h3>

| Status | Meaning                                                        | Description           | Schema                |
| ------ | -------------------------------------------------------------- | --------------------- | --------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | Rol encontrado        | None                  |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Recurso no encontrado | [Error](#schemaerror) |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__roles_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/roles/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/roles/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "nombre": "string",
  "descripcion": "string",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/roles/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/roles/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/roles/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/roles/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/roles/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/roles/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /roles/{id}`

_Actualizar un rol_

> Body parameter

```json
{
  "nombre": "string",
  "descripcion": "string",
  "usuario_id": 2
}
```

<h3 id="put__roles_{id}-parameters">Parameters</h3>

| Name          | In   | Type    | Required | Description                       |
| ------------- | ---- | ------- | -------- | --------------------------------- |
| id            | path | integer | true     | none                              |
| body          | body | object  | true     | none                              |
| » nombre      | body | string  | false    | none                              |
| » descripcion | body | string  | false    | none                              |
| » usuario_id  | body | integer | false    | ID del usuario auditor (opcional) |

> Example responses

> 404 Response

```json
{
  "code": 404,
  "estado": false,
  "message": "Recurso no encontrado",
  "data": null
}
```

<h3 id="put__roles_{id}-responses">Responses</h3>

| Status | Meaning                                                        | Description           | Schema                |
| ------ | -------------------------------------------------------------- | --------------------- | --------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | Rol actualizado       | None                  |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Recurso no encontrado | [Error](#schemaerror) |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__roles_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/roles/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/roles/{id} HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/roles/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/roles/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/roles/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/roles/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/roles/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/roles/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /roles/{id}`

_Eliminar un rol_

<h3 id="delete__roles_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | none                              |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

> Example responses

> 404 Response

```json
{
  "code": 404,
  "estado": false,
  "message": "Recurso no encontrado",
  "data": null
}
```

<h3 id="delete__roles_{id}-responses">Responses</h3>

| Status | Meaning                                                        | Description                  | Schema                |
| ------ | -------------------------------------------------------------- | ---------------------------- | --------------------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | Rol eliminado                | None                  |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Recurso no encontrado        | [Error](#schemaerror) |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)  | Rol tiene usuarios asociados | None                  |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-servicios">Servicios</h1>

Catálogo de servicios turísticos

## get\_\_servicios

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/servicios \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/servicios HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/servicios', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/servicios',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/servicios', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/servicios', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/servicios");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/servicios", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /servicios`

_Listar todos los servicios_

Obtiene una lista de todos los servicios disponibles

<h3 id="get__servicios-responses">Responses</h3>

| Status | Meaning                                                         | Description                              | Schema |
| ------ | --------------------------------------------------------------- | ---------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Lista de servicios obtenida exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                           | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_servicios

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/servicios \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/servicios HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre": "Hospedaje",
  "descripcion": "Servicio de alojamiento hotelero",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/servicios',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/servicios',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/servicios', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/servicios', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/servicios");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/servicios", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /servicios`

_Crear un nuevo servicio_

Crea un nuevo servicio en el sistema

> Body parameter

```json
{
  "nombre": "Hospedaje",
  "descripcion": "Servicio de alojamiento hotelero",
  "usuario_id": 2
}
```

<h3 id="post__servicios-parameters">Parameters</h3>

| Name          | In   | Type    | Required | Description                       |
| ------------- | ---- | ------- | -------- | --------------------------------- |
| body          | body | object  | true     | none                              |
| » nombre      | body | string  | true     | none                              |
| » descripcion | body | string  | false    | none                              |
| » usuario_id  | body | integer | false    | ID del usuario auditor (opcional) |

<h3 id="post__servicios-responses">Responses</h3>

| Status | Meaning                                                          | Description                       | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Servicio creado exitosamente      | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR) | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__servicios_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/servicios/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/servicios/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/servicios/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/servicios/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/servicios/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/servicios/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/servicios/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/servicios/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /servicios/{id}`

_Obtener un servicio por ID_

Obtiene la información detallada de un servicio específico

<h3 id="get__servicios_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description     |
| ---- | ---- | ------- | -------- | --------------- |
| id   | path | integer | true     | ID del servicio |

<h3 id="get__servicios_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description            | Schema |
| ------ | --------------------------------------------------------------- | ---------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Servicio encontrado    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado         | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Servicio no encontrado | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__servicios_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/servicios/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/servicios/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre": "string",
  "descripcion": "string",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/servicios/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/servicios/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/servicios/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/servicios/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/servicios/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/servicios/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /servicios/{id}`

_Actualizar un servicio existente_

Actualiza la información de un servicio

> Body parameter

```json
{
  "nombre": "string",
  "descripcion": "string",
  "usuario_id": 2
}
```

<h3 id="put__servicios_{id}-parameters">Parameters</h3>

| Name          | In   | Type    | Required | Description                       |
| ------------- | ---- | ------- | -------- | --------------------------------- |
| id            | path | integer | true     | ID del servicio                   |
| body          | body | object  | true     | none                              |
| » nombre      | body | string  | false    | none                              |
| » descripcion | body | string  | false    | none                              |
| » usuario_id  | body | integer | false    | ID del usuario auditor (opcional) |

<h3 id="put__servicios_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                       | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Servicio actualizado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR) | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Servicio no encontrado            | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__servicios_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/servicios/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/servicios/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/servicios/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/servicios/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/servicios/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/servicios/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/servicios/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/servicios/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /servicios/{id}`

_Eliminar un servicio_

Elimina un servicio del sistema

<h3 id="delete__servicios_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | ID del servicio                   |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

<h3 id="delete__servicios_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description                     | Schema |
| ------ | --------------------------------------------------------------- | ------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Servicio eliminado exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                  | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (solo ADMIN)       | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Servicio no encontrado          | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-proveedores">Proveedores</h1>

Gestión de proveedores de servicios

## get\_\_proveedores

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/proveedores \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/proveedores HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/proveedores', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/proveedores',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/proveedores', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/proveedores', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/proveedores");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/proveedores", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /proveedores`

_Listar todos los proveedores_

Obtiene una lista de todos los proveedores con sus correos asociados

<h3 id="get__proveedores-responses">Responses</h3>

| Status | Meaning                                                         | Description                                | Schema |
| ------ | --------------------------------------------------------------- | ------------------------------------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Lista de proveedores obtenida exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                             | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_proveedores

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/proveedores \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/proveedores HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre": "Air Canada",
  "lenguaje": "English",
  "correo1": "billing@aircanada.com",
  "correo2": "user@example.com",
  "correo3": "user@example.com",
  "correo4": "user@example.com",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/proveedores',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/proveedores',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/proveedores', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/proveedores', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/proveedores");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/proveedores", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /proveedores`

_Crear un nuevo proveedor_

Crea un nuevo proveedor con hasta 4 correos electrónicos

> Body parameter

```json
{
  "nombre": "Air Canada",
  "lenguaje": "English",
  "correo1": "billing@aircanada.com",
  "correo2": "user@example.com",
  "correo3": "user@example.com",
  "correo4": "user@example.com",
  "usuario_id": 2
}
```

<h3 id="post__proveedores-parameters">Parameters</h3>

| Name         | In   | Type          | Required | Description                       |
| ------------ | ---- | ------------- | -------- | --------------------------------- |
| body         | body | object        | true     | none                              |
| » nombre     | body | string        | true     | none                              |
| » lenguaje   | body | string        | true     | none                              |
| » correo1    | body | string(email) | false    | none                              |
| » correo2    | body | string(email) | false    | none                              |
| » correo3    | body | string(email) | false    | none                              |
| » correo4    | body | string(email) | false    | none                              |
| » usuario_id | body | integer       | false    | ID del usuario auditor (opcional) |

#### Enumerated Values

| Parameter  | Value    |
| ---------- | -------- |
| » lenguaje | Español  |
| » lenguaje | English  |
| » lenguaje | Français |

<h3 id="post__proveedores-responses">Responses</h3>

| Status | Meaning                                                          | Description                       | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Proveedor creado exitosamente     | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR) | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__proveedores_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/proveedores/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/proveedores/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/proveedores/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/proveedores/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/proveedores/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/proveedores/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/proveedores/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/proveedores/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /proveedores/{id}`

_Obtener un proveedor por ID_

Obtiene la información detallada de un proveedor específico incluyendo sus correos

<h3 id="get__proveedores_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description      |
| ---- | ---- | ------- | -------- | ---------------- |
| id   | path | integer | true     | ID del proveedor |

<h3 id="get__proveedores_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description             | Schema |
| ------ | --------------------------------------------------------------- | ----------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Proveedor encontrado    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado          | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Proveedor no encontrado | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__proveedores_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/proveedores/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/proveedores/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre": "string",
  "lenguaje": "Español",
  "correo1": "user@example.com",
  "correo2": "user@example.com",
  "correo3": "user@example.com",
  "correo4": "user@example.com",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/proveedores/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/proveedores/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/proveedores/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/proveedores/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/proveedores/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/proveedores/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /proveedores/{id}`

_Actualizar un proveedor existente_

Actualiza información de un proveedor

> Body parameter

```json
{
  "nombre": "string",
  "lenguaje": "Español",
  "correo1": "user@example.com",
  "correo2": "user@example.com",
  "correo3": "user@example.com",
  "correo4": "user@example.com",
  "usuario_id": 2
}
```

<h3 id="put__proveedores_{id}-parameters">Parameters</h3>

| Name         | In   | Type          | Required | Description                       |
| ------------ | ---- | ------------- | -------- | --------------------------------- |
| id           | path | integer       | true     | ID del proveedor                  |
| body         | body | object        | true     | none                              |
| » nombre     | body | string        | false    | none                              |
| » lenguaje   | body | string        | false    | none                              |
| » correo1    | body | string(email) | false    | none                              |
| » correo2    | body | string(email) | false    | none                              |
| » correo3    | body | string(email) | false    | none                              |
| » correo4    | body | string(email) | false    | none                              |
| » usuario_id | body | integer       | false    | ID del usuario auditor (opcional) |

#### Enumerated Values

| Parameter  | Value    |
| ---------- | -------- |
| » lenguaje | Español  |
| » lenguaje | English  |
| » lenguaje | Français |

<h3 id="put__proveedores_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                        | Schema |
| ------ | ---------------------------------------------------------------- | ---------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Proveedor actualizado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                     | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR)  | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Proveedor no encontrado            | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__proveedores_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/proveedores/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/proveedores/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/proveedores/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/proveedores/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/proveedores/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/proveedores/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/proveedores/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/proveedores/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /proveedores/{id}`

_Eliminar un proveedor_

Elimina un proveedor del sistema

<h3 id="delete__proveedores_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | ID del proveedor                  |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

<h3 id="delete__proveedores_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description                      | Schema |
| ------ | --------------------------------------------------------------- | -------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Proveedor eliminado exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                   | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (solo ADMIN)        | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Proveedor no encontrado          | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\__proveedores_{id}\_correos

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/proveedores/{id}/correos \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/proveedores/{id}/correos HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "correo": "payments@provider.com",
  "principal": true,
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/proveedores/{id}/correos',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/proveedores/{id}/correos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/proveedores/{id}/correos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/proveedores/{id}/correos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/proveedores/{id}/correos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/proveedores/{id}/correos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /proveedores/{id}/correos`

_Agregar correo electrónico a un proveedor_

Agrega un nuevo correo electrónico a un proveedor existente (máximo 4 correos)

> Body parameter

```json
{
  "correo": "payments@provider.com",
  "principal": true,
  "usuario_id": 2
}
```

<h3 id="post__proveedores_{id}_correos-parameters">Parameters</h3>

| Name         | In   | Type          | Required | Description                           |
| ------------ | ---- | ------------- | -------- | ------------------------------------- |
| id           | path | integer       | true     | ID del proveedor                      |
| body         | body | object        | true     | none                                  |
| » correo     | body | string(email) | true     | none                                  |
| » principal  | body | boolean       | true     | Indica si este es el correo principal |
| » usuario_id | body | integer       | false    | ID del usuario auditor (opcional)     |

<h3 id="post__proveedores_{id}_correos-responses">Responses</h3>

| Status | Meaning                                                          | Description                                   | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Correo agregado exitosamente                  | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos o máximo de correos alcanzado | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                                | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR)             | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Proveedor no encontrado                       | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-clientes">Clientes</h1>

Gestión de clientes (hoteles)

## get\_\_clientes

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/clientes \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/clientes HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/clientes', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/clientes',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/clientes', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/clientes', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/clientes");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/clientes", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /clientes`

_Listar todos los clientes_

Obtiene una lista de todos los clientes registrados

<h3 id="get__clientes-responses">Responses</h3>

| Status | Meaning                                                         | Description                             | Schema |
| ------ | --------------------------------------------------------------- | --------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Lista de clientes obtenida exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                          | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos                            | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_clientes

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/clientes \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/clientes HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@example.com",
  "telefono": "+1234567890",
  "ubicacion": "123 Main St, Toronto ON",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/clientes',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/clientes',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/clientes', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/clientes', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/clientes");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/clientes", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /clientes`

_Crear un nuevo cliente_

Registra un nuevo cliente en el sistema

> Body parameter

```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@example.com",
  "telefono": "+1234567890",
  "ubicacion": "123 Main St, Toronto ON",
  "usuario_id": 2
}
```

<h3 id="post__clientes-parameters">Parameters</h3>

| Name         | In   | Type          | Required | Description                                              |
| ------------ | ---- | ------------- | -------- | -------------------------------------------------------- |
| body         | body | object        | true     | none                                                     |
| » nombre     | body | string        | true     | none                                                     |
| » correo     | body | string(email) | false    | none                                                     |
| » telefono   | body | string        | false    | none                                                     |
| » ubicacion  | body | string        | false    | none                                                     |
| » usuario_id | body | integer       | false    | ID del usuario auditor (opcional, por defecto usa token) |

<h3 id="post__clientes-responses">Responses</h3>

| Status | Meaning                                                          | Description                 | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Cliente creado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos             | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado              | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos                | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__clientes_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/clientes/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/clientes/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/clientes/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/clientes/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/clientes/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/clientes/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/clientes/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/clientes/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /clientes/{id}`

_Obtener un cliente por ID_

Obtiene la información detallada de un cliente específico

<h3 id="get__clientes_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description    |
| ---- | ---- | ------- | -------- | -------------- |
| id   | path | integer | true     | ID del cliente |

<h3 id="get__clientes_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description           | Schema |
| ------ | --------------------------------------------------------------- | --------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Cliente encontrado    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado        | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos          | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Cliente no encontrado | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__clientes_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/clientes/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/clientes/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre": "string",
  "correo": "user@example.com",
  "telefono": "string",
  "ubicacion": "string",
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/clientes/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/clientes/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/clientes/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/clientes/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/clientes/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/clientes/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /clientes/{id}`

_Actualizar un cliente existente_

Actualiza la información de un cliente

> Body parameter

```json
{
  "nombre": "string",
  "correo": "user@example.com",
  "telefono": "string",
  "ubicacion": "string",
  "usuario_id": 2
}
```

<h3 id="put__clientes_{id}-parameters">Parameters</h3>

| Name         | In   | Type          | Required | Description                                              |
| ------------ | ---- | ------------- | -------- | -------------------------------------------------------- |
| id           | path | integer       | true     | ID del cliente                                           |
| body         | body | object        | true     | none                                                     |
| » nombre     | body | string        | false    | none                                                     |
| » correo     | body | string(email) | false    | none                                                     |
| » telefono   | body | string        | false    | none                                                     |
| » ubicacion  | body | string        | false    | none                                                     |
| » usuario_id | body | integer       | false    | ID del usuario auditor (opcional, por defecto usa token) |

<h3 id="put__clientes_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                      | Schema |
| ------ | ---------------------------------------------------------------- | -------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Cliente actualizado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                  | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                   | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos                     | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Cliente no encontrado            | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__clientes_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/clientes/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/clientes/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/clientes/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/clientes/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/clientes/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/clientes/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/clientes/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/clientes/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /clientes/{id}`

_Eliminar un cliente_

Elimina un cliente del sistema

<h3 id="delete__clientes_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                                              |
| ---------- | ----- | ------- | -------- | -------------------------------------------------------- |
| id         | path  | integer | true     | ID del cliente                                           |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional, por defecto usa token) |

<h3 id="delete__clientes_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description                       | Schema |
| ------ | --------------------------------------------------------------- | --------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Cliente eliminado exitosamente    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (ADMIN o SUPERVISOR) | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Cliente no encontrado             | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-tarjetas">Tarjetas</h1>

Gestión de tarjetas de crédito

## get\_\_tarjetas

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/tarjetas \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/tarjetas HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/tarjetas', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/tarjetas',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/tarjetas', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/tarjetas', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/tarjetas");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/tarjetas", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tarjetas`

_Listar todas las tarjetas de crédito_

Obtiene una lista de todas las tarjetas de crédito registradas

<h3 id="get__tarjetas-responses">Responses</h3>

| Status | Meaning                                                         | Description                             | Schema |
| ------ | --------------------------------------------------------------- | --------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Lista de tarjetas obtenida exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                          | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (ADMIN o SUPERVISOR)       | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_tarjetas

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/tarjetas \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/tarjetas HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "nombre_titular": "Juan Pérez",
  "ultimos_4_digitos": "1234",
  "moneda": "USD",
  "limite_mensual": 5000,
  "tipo_tarjeta": "Visa",
  "activo": true,
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/tarjetas',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/tarjetas',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/tarjetas', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/tarjetas', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/tarjetas");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/tarjetas", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /tarjetas`

_Crear una nueva tarjeta de crédito_

Registra una nueva tarjeta de crédito usando funciones PostgreSQL

> Body parameter

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

<h3 id="post__tarjetas-parameters">Parameters</h3>

| Name                | In   | Type    | Required | Description                                             |
| ------------------- | ---- | ------- | -------- | ------------------------------------------------------- |
| body                | body | object  | true     | none                                                    |
| » nombre_titular    | body | string  | true     | Nombre completo del titular de la tarjeta               |
| » ultimos_4_digitos | body | string  | true     | Últimos 4 dígitos de la tarjeta (exactamente 4 números) |
| » moneda            | body | string  | true     | Moneda de la tarjeta                                    |
| » limite_mensual    | body | number  | true     | Límite mensual de crédito                               |
| » tipo_tarjeta      | body | string  | false    | Tipo de tarjeta (Visa, Mastercard, etc.)                |
| » activo            | body | boolean | false    | Estado activo de la tarjeta                             |
| » usuario_id        | body | integer | false    | ID del usuario auditor (opcional)                       |

#### Enumerated Values

| Parameter | Value |
| --------- | ----- |
| » moneda  | USD   |
| » moneda  | CAD   |

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Tarjeta creada",
  "data": {
    "id": 1,
    "nombre_titular": "Juan Pérez",
    "ultimos_4_digitos": "1234",
    "moneda": "USD",
    "limite_mensual": 5000,
    "saldo_disponible": 5000,
    "tipo_tarjeta": "Visa",
    "activo": true
  }
}
```

<h3 id="post__tarjetas-responses">Responses</h3>

| Status | Meaning                                                          | Description                       | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Tarjeta creada exitosamente       | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR) | None   |

<h3 id="post__tarjetas-responseschema">Response Schema</h3>

Status Code **201**

| Name                 | Type    | Required | Restrictions | Description |
| -------------------- | ------- | -------- | ------------ | ----------- |
| » success            | boolean | false    | none         | none        |
| » message            | string  | false    | none         | none        |
| » data               | object  | false    | none         | none        |
| »» id                | integer | false    | none         | none        |
| »» nombre_titular    | string  | false    | none         | none        |
| »» ultimos_4_digitos | string  | false    | none         | none        |
| »» moneda            | string  | false    | none         | none        |
| »» limite_mensual    | number  | false    | none         | none        |
| »» saldo_disponible  | number  | false    | none         | none        |
| »» tipo_tarjeta      | string  | false    | none         | none        |
| »» activo            | boolean | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__tarjetas_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/tarjetas/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/tarjetas/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/tarjetas/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/tarjetas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/tarjetas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/tarjetas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/tarjetas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/tarjetas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tarjetas/{id}`

_Obtener una tarjeta por ID_

Obtiene la información detallada de una tarjeta específica

<h3 id="get__tarjetas_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description      |
| ---- | ---- | ------- | -------- | ---------------- |
| id   | path | integer | true     | ID de la tarjeta |

<h3 id="get__tarjetas_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description           | Schema |
| ------ | --------------------------------------------------------------- | --------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Tarjeta encontrada    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado        | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos          | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Tarjeta no encontrada | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__tarjetas_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/tarjetas/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/tarjetas/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre_titular": "Juan Carlos Pérez",
  "limite_mensual": 6000,
  "tipo_tarjeta": "Visa Platinum",
  "activo": true,
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/tarjetas/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/tarjetas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/tarjetas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/tarjetas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/tarjetas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/tarjetas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /tarjetas/{id}`

_Actualizar una tarjeta existente_

Actualiza la información de una tarjeta de crédito usando funciones PostgreSQL

> Body parameter

```json
{
  "nombre_titular": "Juan Carlos Pérez",
  "limite_mensual": 6000,
  "tipo_tarjeta": "Visa Platinum",
  "activo": true,
  "usuario_id": 2
}
```

<h3 id="put__tarjetas_{id}-parameters">Parameters</h3>

| Name             | In   | Type    | Required | Description                                           |
| ---------------- | ---- | ------- | -------- | ----------------------------------------------------- |
| id               | path | integer | true     | ID de la tarjeta                                      |
| body             | body | object  | true     | none                                                  |
| » nombre_titular | body | string  | false    | Nombre completo del titular                           |
| » limite_mensual | body | number  | false    | Nuevo límite mensual (ajusta saldo proporcionalmente) |
| » tipo_tarjeta   | body | string  | false    | Tipo de tarjeta                                       |
| » activo         | body | boolean | false    | Estado activo                                         |
| » usuario_id     | body | integer | false    | ID del usuario auditor (opcional)                     |

<h3 id="put__tarjetas_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                       | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Tarjeta actualizada exitosamente  | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR) | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Tarjeta no encontrada             | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__tarjetas_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/tarjetas/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/tarjetas/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/tarjetas/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/tarjetas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/tarjetas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/tarjetas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/tarjetas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/tarjetas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /tarjetas/{id}`

_Eliminar tarjeta (soft delete)_

Desactiva una tarjeta marcándola como inactiva

<h3 id="delete__tarjetas_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | ID de la tarjeta                  |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

<h3 id="delete__tarjetas_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description                                  | Schema |
| ------ | --------------------------------------------------------------- | -------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Tarjeta eliminada (desactivada) exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                               | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (solo ADMIN)                    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Tarjeta no encontrada                        | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-cuentas-bancarias">Cuentas Bancarias</h1>

Gestión de cuentas bancarias

## get\_\_cuentas

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/cuentas \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/cuentas HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/cuentas', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/cuentas',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/cuentas', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/cuentas', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/cuentas");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/cuentas", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /cuentas`

_Listar todas las cuentas bancarias_

Obtiene una lista de todas las cuentas bancarias registradas

<h3 id="get__cuentas-responses">Responses</h3>

| Status | Meaning                                                         | Description                            | Schema |
| ------ | --------------------------------------------------------------- | -------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Lista de cuentas obtenida exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                         | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (ADMIN o SUPERVISOR)      | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_cuentas

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/cuentas \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/cuentas HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre_banco": "TD Canada Trust",
  "nombre_cuenta": "Business Checking Account",
  "ultimos_4_digitos": "5678",
  "moneda": "CAD",
  "activo": true,
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/cuentas',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/cuentas',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/cuentas', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/cuentas', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/cuentas");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/cuentas", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /cuentas`

_Crear una nueva cuenta bancaria_

Registra una nueva cuenta bancaria usando funciones PostgreSQL

> Body parameter

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

<h3 id="post__cuentas-parameters">Parameters</h3>

| Name                | In   | Type    | Required | Description                                            |
| ------------------- | ---- | ------- | -------- | ------------------------------------------------------ |
| body                | body | object  | true     | none                                                   |
| » nombre_banco      | body | string  | true     | Nombre del banco                                       |
| » nombre_cuenta     | body | string  | true     | Descripción o nombre de la cuenta                      |
| » ultimos_4_digitos | body | string  | true     | Últimos 4 dígitos de la cuenta (exactamente 4 números) |
| » moneda            | body | string  | true     | Moneda de la cuenta                                    |
| » activo            | body | boolean | false    | Estado activo de la cuenta                             |
| » usuario_id        | body | integer | false    | ID del usuario auditor (opcional)                      |

#### Enumerated Values

| Parameter | Value |
| --------- | ----- |
| » moneda  | USD   |
| » moneda  | CAD   |

<h3 id="post__cuentas-responses">Responses</h3>

| Status | Meaning                                                          | Description                       | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Cuenta creada exitosamente        | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR) | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__cuentas_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/cuentas/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/cuentas/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/cuentas/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/cuentas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/cuentas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/cuentas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/cuentas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/cuentas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /cuentas/{id}`

_Obtener una cuenta bancaria por ID_

Obtiene la información detallada de una cuenta bancaria específica

<h3 id="get__cuentas_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description     |
| ---- | ---- | ------- | -------- | --------------- |
| id   | path | integer | true     | ID de la cuenta |

<h3 id="get__cuentas_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description          | Schema |
| ------ | --------------------------------------------------------------- | -------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Cuenta encontrada    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado       | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos         | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Cuenta no encontrada | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__cuentas_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/cuentas/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/cuentas/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre_banco": "Banco Nacional de Canadá",
  "nombre_cuenta": "Premium Business Account",
  "activo": true,
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/cuentas/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/cuentas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/cuentas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/cuentas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/cuentas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/cuentas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /cuentas/{id}`

_Actualizar una cuenta bancaria existente_

Actualiza la información de una cuenta bancaria usando funciones PostgreSQL

> Body parameter

```json
{
  "nombre_banco": "Banco Nacional de Canadá",
  "nombre_cuenta": "Premium Business Account",
  "activo": true,
  "usuario_id": 2
}
```

<h3 id="put__cuentas_{id}-parameters">Parameters</h3>

| Name            | In   | Type    | Required | Description                       |
| --------------- | ---- | ------- | -------- | --------------------------------- |
| id              | path | integer | true     | ID de la cuenta                   |
| body            | body | object  | true     | none                              |
| » nombre_banco  | body | string  | false    | Nombre del banco                  |
| » nombre_cuenta | body | string  | false    | Descripción de la cuenta          |
| » activo        | body | boolean | false    | Estado activo                     |
| » usuario_id    | body | integer | false    | ID del usuario auditor (opcional) |

<h3 id="put__cuentas_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                       | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Cuenta actualizada exitosamente   | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                   | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                    | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR) | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Cuenta no encontrada              | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__cuentas_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/cuentas/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/cuentas/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/cuentas/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/cuentas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/cuentas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/cuentas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/cuentas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/cuentas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /cuentas/{id}`

_Eliminar cuenta bancaria (soft delete)_

Desactiva una cuenta bancaria marcándola como inactiva

<h3 id="delete__cuentas_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | ID de la cuenta                   |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

<h3 id="delete__cuentas_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description                                 | Schema |
| ------ | --------------------------------------------------------------- | ------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Cuenta eliminada (desactivada) exitosamente | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                              | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (solo ADMIN)                   | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Cuenta no encontrada                        | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-pagos">Pagos</h1>

Gestión de pagos (CORE del sistema)

## get\_\_pagos

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/pagos \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/pagos HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/pagos', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/pagos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/pagos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/pagos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/pagos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /pagos`

_Listar pagos con filtros_

<h3 id="get__pagos-parameters">Parameters</h3>

| Name         | In    | Type         | Required | Description |
| ------------ | ----- | ------------ | -------- | ----------- |
| proveedor_id | query | integer      | false    | none        |
| estado       | query | string       | false    | none        |
| fecha_desde  | query | string(date) | false    | none        |
| fecha_hasta  | query | string(date) | false    | none        |

#### Enumerated Values

| Parameter | Value      |
| --------- | ---------- |
| estado    | PENDIENTE  |
| estado    | COMPLETADO |
| estado    | CANCELADO  |

<h3 id="get__pagos-responses">Responses</h3>

| Status | Meaning                                                 | Description    | Schema |
| ------ | ------------------------------------------------------- | -------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Lista de pagos | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_pagos

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/pagos \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/pagos HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "proveedor_id": 2,
  "usuario_id": 2,
  "codigo_reserva": "RES-2026-004",
  "monto": 500,
  "moneda": "USD",
  "tipo_medio_pago": "TARJETA",
  "tarjeta_id": 1,
  "cuenta_bancaria_id": 1,
  "clientes_ids": [
    1,
    2
  ],
  "descripcion": "Pago de servicio de guía turística",
  "fecha_esperada_debito": "2026-02-15"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/pagos',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/pagos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/pagos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/pagos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/pagos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /pagos`

_Crear nuevo pago_

Crea un pago usando funciones PostgreSQL. Descuenta automáticamente el saldo si es TARJETA.

> Body parameter

```json
{
  "proveedor_id": 2,
  "usuario_id": 2,
  "codigo_reserva": "RES-2026-004",
  "monto": 500,
  "moneda": "USD",
  "tipo_medio_pago": "TARJETA",
  "tarjeta_id": 1,
  "cuenta_bancaria_id": 1,
  "clientes_ids": [1, 2],
  "descripcion": "Pago de servicio de guía turística",
  "fecha_esperada_debito": "2026-02-15"
}
```

<h3 id="post__pagos-parameters">Parameters</h3>

| Name                    | In   | Type              | Required | Description                                                              |
| ----------------------- | ---- | ----------------- | -------- | ------------------------------------------------------------------------ |
| body                    | body | object            | true     | none                                                                     |
| » proveedor_id          | body | integer           | true     | ID del proveedor activo                                                  |
| » usuario_id            | body | integer           | true     | ID del usuario activo (opcional, por defecto el del token)               |
| » codigo_reserva        | body | string            | true     | Código único de reserva (1-50 caracteres)                                |
| » monto                 | body | number            | true     | Monto del pago (mayor a 0)                                               |
| » moneda                | body | string            | true     | Moneda del pago                                                          |
| » tipo_medio_pago       | body | string            | true     | Tipo de medio de pago                                                    |
| » tarjeta_id            | body | integer¦null      | false    | ID de tarjeta (obligatorio si tipo_medio_pago = TARJETA)                 |
| » cuenta_bancaria_id    | body | integer¦null      | false    | ID de cuenta bancaria (obligatorio si tipo_medio_pago = CUENTA_BANCARIA) |
| » clientes_ids          | body | [integer]         | false    | Array de IDs de clientes asociados                                       |
| » descripcion           | body | string¦null       | false    | none                                                                     |
| » fecha_esperada_debito | body | string(date)¦null | false    | Fecha esperada de débito (YYYY-MM-DD)                                    |

#### Enumerated Values

| Parameter         | Value           |
| ----------------- | --------------- |
| » moneda          | USD             |
| » moneda          | CAD             |
| » tipo_medio_pago | TARJETA         |
| » tipo_medio_pago | CUENTA_BANCARIA |

<h3 id="post__pagos-responses">Responses</h3>

| Status | Meaning                                                          | Description                                         | Schema |
| ------ | ---------------------------------------------------------------- | --------------------------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Pago creado exitosamente                            | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos o campo obligatorio faltante        | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Proveedor, usuario, tarjeta o cuenta no encontrados | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)    | Código de reserva duplicado o saldo insuficiente    | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__pagos_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/pagos/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/pagos/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/pagos/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/pagos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/pagos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/pagos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/pagos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /pagos/{id}`

_Obtener un pago por ID_

Obtiene la información detallada de un pago específico con relaciones

<h3 id="get__pagos_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| id   | path | integer | true     | ID del pago |

<h3 id="get__pagos_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description        | Schema |
| ------ | --------------------------------------------------------------- | ------------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Pago encontrado    | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado     | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Pago no encontrado | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__pagos_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/pagos/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/pagos/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "monto": 600,
  "descripcion": "Descripción actualizada",
  "fecha_esperada_debito": "2026-03-01",
  "pagado": true,
  "verificado": true,
  "gmail_enviado": false,
  "activo": true,
  "usuario_id": 2
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/pagos/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/pagos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/pagos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/pagos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/pagos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /pagos/{id}`

_Actualizar un pago existente_

Actualiza un pago usando funciones PostgreSQL. No se puede editar si ya está verificado.

> Body parameter

```json
{
  "monto": 600,
  "descripcion": "Descripción actualizada",
  "fecha_esperada_debito": "2026-03-01",
  "pagado": true,
  "verificado": true,
  "gmail_enviado": false,
  "activo": true,
  "usuario_id": 2
}
```

<h3 id="put__pagos_{id}-parameters">Parameters</h3>

| Name                    | In   | Type              | Required | Description                                              |
| ----------------------- | ---- | ----------------- | -------- | -------------------------------------------------------- |
| id                      | path | integer           | true     | ID del pago                                              |
| body                    | body | object            | true     | none                                                     |
| » monto                 | body | number            | false    | Nuevo monto (NO se puede cambiar si es pago con tarjeta) |
| » descripcion           | body | string¦null       | false    | none                                                     |
| » fecha_esperada_debito | body | string(date)¦null | false    | none                                                     |
| » pagado                | body | boolean           | false    | Marcar como pagado                                       |
| » verificado            | body | boolean           | false    | Marcar como verificado (auto-marca pagado = true)        |
| » gmail_enviado         | body | boolean           | false    | none                                                     |
| » activo                | body | boolean           | false    | none                                                     |
| » usuario_id            | body | integer           | false    | ID del usuario auditor (opcional)                        |

<h3 id="put__pagos_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                                                               | Schema |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Pago actualizado exitosamente                                             | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos                                                           | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)  | No autenticado                                                            | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)   | Sin permisos (ADMIN o SUPERVISOR)                                         | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Pago no encontrado                                                        | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)    | No se puede editar (ya verificado o intento de cambiar monto con tarjeta) | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__pagos_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/pagos/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/pagos/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/pagos/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/pagos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/pagos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/pagos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/pagos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /pagos/{id}`

_Cancelar un pago_

Cambia el estado del pago a CANCELADO (no se elimina físicamente)

<h3 id="delete__pagos_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | ID del pago                       |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

<h3 id="delete__pagos_{id}-responses">Responses</h3>

| Status | Meaning                                                         | Description                                | Schema |
| ------ | --------------------------------------------------------------- | ------------------------------------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Pago cancelado exitosamente                | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                             | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (ADMIN o SUPERVISOR)          | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Pago no encontrado                         | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)   | No se puede cancelar un pago ya completado | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch\__pagos_{id}\_desactivar

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:3000/api/v1/pagos/{id}/desactivar \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:3000/api/v1/pagos/{id}/desactivar HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "usuario_id": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/pagos/{id}/desactivar',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:3000/api/v1/pagos/{id}/desactivar',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:3000/api/v1/pagos/{id}/desactivar', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:3000/api/v1/pagos/{id}/desactivar', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos/{id}/desactivar");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:3000/api/v1/pagos/{id}/desactivar", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /pagos/{id}/desactivar`

_Desactivar un pago_

Cambia el estado activo del pago a false (soft delete). El pago no se elimina, solo se desactiva.

> Body parameter

```json
{
  "usuario_id": 0
}
```

<h3 id="patch__pagos_{id}_desactivar-parameters">Parameters</h3>

| Name         | In   | Type    | Required | Description                       |
| ------------ | ---- | ------- | -------- | --------------------------------- |
| id           | path | integer | true     | ID del pago a desactivar          |
| body         | body | object  | false    | none                              |
| » usuario_id | body | integer | false    | ID del usuario auditor (opcional) |

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Pago desactivado exitosamente",
  "data": {
    "id": 0,
    "estados": {
      "activo": false
    }
  }
}
```

<h3 id="patch__pagos_{id}_desactivar-responses">Responses</h3>

| Status | Meaning                                                         | Description                            | Schema |
| ------ | --------------------------------------------------------------- | -------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Pago desactivado exitosamente          | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                         | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (ADMIN o SUPERVISOR)      | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Pago no encontrado                     | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)   | No se puede desactivar (ya verificado) | None   |

<h3 id="patch__pagos_{id}_desactivar-responseschema">Response Schema</h3>

Status Code **200**

| Name       | Type    | Required | Restrictions | Description |
| ---------- | ------- | -------- | ------------ | ----------- |
| » success  | boolean | false    | none         | none        |
| » message  | string  | false    | none         | none        |
| » data     | object  | false    | none         | none        |
| »» id      | integer | false    | none         | none        |
| »» estados | object  | false    | none         | none        |
| »»» activo | boolean | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## patch\__pagos_{id}\_activar

> Code samples

```shell
# You can also use wget
curl -X PATCH http://localhost:3000/api/v1/pagos/{id}/activar \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PATCH http://localhost:3000/api/v1/pagos/{id}/activar HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "usuario_id": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/pagos/{id}/activar',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.patch 'http://localhost:3000/api/v1/pagos/{id}/activar',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.patch('http://localhost:3000/api/v1/pagos/{id}/activar', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','http://localhost:3000/api/v1/pagos/{id}/activar', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos/{id}/activar");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "http://localhost:3000/api/v1/pagos/{id}/activar", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /pagos/{id}/activar`

_Activar un pago_

Cambia el estado activo del pago a true. Reactiva un pago previamente desactivado.

> Body parameter

```json
{
  "usuario_id": 0
}
```

<h3 id="patch__pagos_{id}_activar-parameters">Parameters</h3>

| Name         | In   | Type    | Required | Description                       |
| ------------ | ---- | ------- | -------- | --------------------------------- |
| id           | path | integer | true     | ID del pago a activar             |
| body         | body | object  | false    | none                              |
| » usuario_id | body | integer | false    | ID del usuario auditor (opcional) |

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Pago activado exitosamente",
  "data": {
    "id": 0,
    "estados": {
      "activo": true
    }
  }
}
```

<h3 id="patch__pagos_{id}_activar-responses">Responses</h3>

| Status | Meaning                                                         | Description                         | Schema |
| ------ | --------------------------------------------------------------- | ----------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Pago activado exitosamente          | Inline |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No autenticado                      | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)  | Sin permisos (ADMIN o SUPERVISOR)   | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | Pago no encontrado                  | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)   | No se puede activar (ya verificado) | None   |

<h3 id="patch__pagos_{id}_activar-responseschema">Response Schema</h3>

Status Code **200**

| Name       | Type    | Required | Restrictions | Description |
| ---------- | ------- | -------- | ------------ | ----------- |
| » success  | boolean | false    | none         | none        |
| » message  | string  | false    | none         | none        |
| » data     | object  | false    | none         | none        |
| »» id      | integer | false    | none         | none        |
| »» estados | object  | false    | none         | none        |
| »»» activo | boolean | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__pagos_{id}\_con-pdf

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/pagos/{id}/con-pdf \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/pagos/{id}/con-pdf HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "estado": "PENDIENTE",
  "verificado": true,
  "archivo": {
    "nombre": "comprobante_123.pdf",
    "tipo": "application/pdf",
    "base64": "string"
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/pagos/{id}/con-pdf',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/pagos/{id}/con-pdf',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/pagos/{id}/con-pdf', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/pagos/{id}/con-pdf', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos/{id}/con-pdf");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/pagos/{id}/con-pdf", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /pagos/{id}/con-pdf`

_Actualizar estado/verificado de un pago con PDF adjunto_

Solo para ADMIN. Permite editar estado y verificado de un pago adjuntando un PDF.
El PDF se envía a N8N para procesamiento/almacenamiento.
La actualización en BD solo ocurre si N8N responde exitosamente.

> Body parameter

```json
{
  "estado": "PENDIENTE",
  "verificado": true,
  "archivo": {
    "nombre": "comprobante_123.pdf",
    "tipo": "application/pdf",
    "base64": "string"
  }
}
```

<h3 id="put__pagos_{id}_con-pdf-parameters">Parameters</h3>

| Name         | In   | Type    | Required | Description                 |
| ------------ | ---- | ------- | -------- | --------------------------- |
| id           | path | integer | true     | none                        |
| body         | body | object  | true     | none                        |
| » estado     | body | string  | false    | none                        |
| » verificado | body | boolean | false    | none                        |
| » archivo    | body | object  | true     | none                        |
| »» nombre    | body | string  | true     | none                        |
| »» tipo      | body | string  | true     | none                        |
| »» base64    | body | string  | true     | Contenido del PDF en base64 |

#### Enumerated Values

| Parameter | Value     |
| --------- | --------- |
| » estado  | PENDIENTE |
| » estado  | PAGADO    |
| » estado  | CANCELADO |

<h3 id="put__pagos_{id}_con-pdf-responses">Responses</h3>

| Status | Meaning                                                                  | Description                             | Schema |
| ------ | ------------------------------------------------------------------------ | --------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Pago actualizado exitosamente           | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)         | Datos inválidos o error del servicio    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)           | Pago no encontrado                      | None   |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Servicio de procesamiento no disponible | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-documentos">Documentos</h1>

Gestión de documentos (facturas y extractos)

## get\_\_documentos

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/documentos \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/documentos HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/documentos', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/documentos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/documentos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/documentos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/documentos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/documentos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /documentos`

_Obtener todos los documentos_

Retorna lista de todos los documentos con información del usuario que los subió
y la cantidad de pagos vinculados.

## 🗄️ FUNCIÓN PostgreSQL

```sql
SELECT documentos_get();
```

> Example responses

> 200 Response

```json
{
  "success": true,
  "code": 200,
  "message": "Documentos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "tipo_documento": "FACTURA",
      "nombre_archivo": "factura_RES-2026-001.pdf",
      "url_documento": "https://storage.terracanada.com/facturas/2026/01/factura.pdf",
      "usuario_subida": {
        "id": 2,
        "nombre_completo": "Juan Pérez"
      },
      "pagos_vinculados": 3,
      "fecha_subida": "2019-08-24T14:15:22Z"
    }
  ]
}
```

<h3 id="get__documentos-responses">Responses</h3>

| Status | Meaning                                                 | Description         | Schema |
| ------ | ------------------------------------------------------- | ------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Lista de documentos | Inline |

<h3 id="get__documentos-responseschema">Response Schema</h3>

Status Code **200**

| Name                | Type              | Required | Restrictions | Description |
| ------------------- | ----------------- | -------- | ------------ | ----------- |
| » success           | boolean           | false    | none         | none        |
| » code              | integer           | false    | none         | none        |
| » message           | string            | false    | none         | none        |
| » data              | [object]          | false    | none         | none        |
| »» id               | integer           | false    | none         | none        |
| »» tipo_documento   | string            | false    | none         | none        |
| »» nombre_archivo   | string            | false    | none         | none        |
| »» url_documento    | string            | false    | none         | none        |
| »» usuario_subida   | object            | false    | none         | none        |
| »»» id              | integer           | false    | none         | none        |
| »»» nombre_completo | string            | false    | none         | none        |
| »» pagos_vinculados | integer           | false    | none         | none        |
| »» fecha_subida     | string(date-time) | false    | none         | none        |

#### Enumerated Values

| Property       | Value           |
| -------------- | --------------- |
| tipo_documento | FACTURA         |
| tipo_documento | DOCUMENTO_BANCO |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_documentos

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/documentos \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/documentos HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "tipo_documento": "FACTURA",
  "nombre_archivo": "factura_RES-2026-001.pdf",
  "url_documento": "https://storage.terracanada.com/facturas/factura.pdf",
  "usuario_id": 2,
  "pago_id": 10
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/documentos',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/documentos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/documentos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/documentos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/documentos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/documentos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /documentos`

_Crear un nuevo documento_

Crea un nuevo documento en el sistema. Si se proporciona `pago_id`,
se vincula automáticamente al pago especificado.

## 🗄️ FUNCIÓN PostgreSQL

```sql
SELECT documentos_post(
  'FACTURA',
  'factura_RES-2026-001.pdf',
  'https://storage.terracanada.com/facturas/2026/01/factura.pdf',
  2,   -- usuario_id
  10   -- pago_id (opcional)
);
```

## ⚠️ VALIDACIONES

- El usuario debe existir
- Si se proporciona pago_id, el pago debe existir

> Body parameter

```json
{
  "tipo_documento": "FACTURA",
  "nombre_archivo": "factura_RES-2026-001.pdf",
  "url_documento": "https://storage.terracanada.com/facturas/factura.pdf",
  "usuario_id": 2,
  "pago_id": 10
}
```

<h3 id="post__documentos-parameters">Parameters</h3>

| Name             | In   | Type    | Required | Description                                             |
| ---------------- | ---- | ------- | -------- | ------------------------------------------------------- |
| body             | body | object  | true     | none                                                    |
| » tipo_documento | body | string  | true     | Tipo de documento                                       |
| » nombre_archivo | body | string  | true     | Nombre del archivo                                      |
| » url_documento  | body | string  | true     | URL donde está almacenado el documento                  |
| » usuario_id     | body | integer | false    | ID del usuario que sube el documento/auditor (opcional) |
| » pago_id        | body | integer | false    | ID del pago a vincular (opcional)                       |

#### Enumerated Values

| Parameter        | Value           |
| ---------------- | --------------- |
| » tipo_documento | FACTURA         |
| » tipo_documento | DOCUMENTO_BANCO |

<h3 id="post__documentos-responses">Responses</h3>

| Status | Meaning                                                          | Description                   | Schema |
| ------ | ---------------------------------------------------------------- | ----------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Documento creado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos               | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Usuario o pago no encontrado  | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\__documentos_{id}

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/documentos/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/documentos/{id} HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/documentos/{id}', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/documentos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/documentos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/documentos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/documentos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/documentos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /documentos/{id}`

_Obtener un documento específico_

Retorna un documento con información completa incluyendo los pagos vinculados.

## 🗄️ FUNCIÓN PostgreSQL

```sql
SELECT documentos_get(1);
```

<h3 id="get__documentos_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description      |
| ---- | ---- | ------- | -------- | ---------------- |
| id   | path | integer | true     | ID del documento |

> Example responses

> 200 Response

```json
{
  "success": true,
  "code": 200,
  "message": "Documento obtenido exitosamente",
  "data": {
    "id": 1,
    "tipo_documento": "FACTURA",
    "nombre_archivo": "factura_RES-2026-001.pdf",
    "url_documento": "https://storage.terracanada.com/facturas/2026/01/factura.pdf",
    "usuario_subida": {
      "id": 0,
      "nombre_completo": "string"
    },
    "pagos_vinculados": [
      {
        "id": 0,
        "codigo_reserva": "string",
        "monto": 0,
        "pagado": true,
        "verificado": true
      }
    ],
    "fecha_subida": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get__documentos_{id}-responses">Responses</h3>

| Status | Meaning                                                        | Description             | Schema |
| ------ | -------------------------------------------------------------- | ----------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | Documento encontrado    | Inline |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Documento no encontrado | None   |

<h3 id="get__documentos_{id}-responseschema">Response Schema</h3>

Status Code **200**

| Name                | Type              | Required | Restrictions | Description |
| ------------------- | ----------------- | -------- | ------------ | ----------- |
| » success           | boolean           | false    | none         | none        |
| » code              | integer           | false    | none         | none        |
| » message           | string            | false    | none         | none        |
| » data              | object            | false    | none         | none        |
| »» id               | integer           | false    | none         | none        |
| »» tipo_documento   | string            | false    | none         | none        |
| »» nombre_archivo   | string            | false    | none         | none        |
| »» url_documento    | string            | false    | none         | none        |
| »» usuario_subida   | object            | false    | none         | none        |
| »»» id              | integer           | false    | none         | none        |
| »»» nombre_completo | string            | false    | none         | none        |
| »» pagos_vinculados | [object]          | false    | none         | none        |
| »»» id              | integer           | false    | none         | none        |
| »»» codigo_reserva  | string            | false    | none         | none        |
| »»» monto           | number            | false    | none         | none        |
| »»» pagado          | boolean           | false    | none         | none        |
| »»» verificado      | boolean           | false    | none         | none        |
| »» fecha_subida     | string(date-time) | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__documentos_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/documentos/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/documentos/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "nombre_archivo": "factura_corregida.pdf"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/documentos/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/documentos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/documentos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/documentos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/documentos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/documentos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /documentos/{id}`

_Actualizar un documento_

Actualiza el nombre o URL de un documento existente.
Solo se actualizan los campos proporcionados.

## 🗄️ FUNCIÓN PostgreSQL

```sql
SELECT documentos_put(
  1,                      -- id
  'nuevo_nombre.pdf',     -- nombre_archivo (opcional)
  'https://nueva.url/...' -- url_documento (opcional)
);
```

> Body parameter

```json
{
  "nombre_archivo": "factura_corregida.pdf"
}
```

<h3 id="put__documentos_{id}-parameters">Parameters</h3>

| Name             | In   | Type    | Required | Description                       |
| ---------------- | ---- | ------- | -------- | --------------------------------- |
| id               | path | integer | true     | ID del documento                  |
| body             | body | object  | true     | none                              |
| » nombre_archivo | body | string  | false    | Nuevo nombre del archivo          |
| » url_documento  | body | string  | false    | Nueva URL del documento           |
| » usuario_id     | body | integer | false    | ID del usuario auditor (opcional) |

<h3 id="put__documentos_{id}-responses">Responses</h3>

| Status | Meaning                                                          | Description                         | Schema |
| ------ | ---------------------------------------------------------------- | ----------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Documento actualizado exitosamente  | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Debe proporcionar al menos un campo | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Documento no encontrado             | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__documentos_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/documentos/{id} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/documentos/{id} HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/documentos/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/documentos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/documentos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/documentos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/documentos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/documentos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /documentos/{id}`

_Eliminar un documento_

Elimina un documento y sus vinculaciones con pagos.

## 🗄️ FUNCIÓN PostgreSQL

```sql
SELECT documentos_delete(1);
```

## ⚠️ RESTRICCIONES

- No se puede eliminar si tiene pagos VERIFICADOS vinculados
- Se eliminan automáticamente las vinculaciones con pagos no verificados

<h3 id="delete__documentos_{id}-parameters">Parameters</h3>

| Name       | In    | Type    | Required | Description                       |
| ---------- | ----- | ------- | -------- | --------------------------------- |
| id         | path  | integer | true     | ID del documento                  |
| usuario_id | query | integer | false    | ID del usuario auditor (opcional) |

> Example responses

> 200 Response

```json
{
  "success": true,
  "code": 200,
  "message": "Documento eliminado exitosamente",
  "data": {
    "nombre_archivo": "factura_eliminada.pdf"
  }
}
```

<h3 id="delete__documentos_{id}-responses">Responses</h3>

| Status | Meaning                                                        | Description                                              | Schema |
| ------ | -------------------------------------------------------------- | -------------------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | Documento eliminado exitosamente                         | Inline |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Documento no encontrado                                  | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)  | No se puede eliminar, tiene pagos verificados vinculados | None   |

<h3 id="delete__documentos_{id}-responseschema">Response Schema</h3>

Status Code **200**

| Name              | Type    | Required | Restrictions | Description |
| ----------------- | ------- | -------- | ------------ | ----------- |
| » success         | boolean | false    | none         | none        |
| » code            | integer | false    | none         | none        |
| » message         | string  | false    | none         | none        |
| » data            | object  | false    | none         | none        |
| »» nombre_archivo | string  | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-correos">Correos</h1>

Gestión y envío de correos a proveedores

## get\_\_correos

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/correos \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/correos HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/correos', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/correos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/correos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/correos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/correos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/correos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /correos`

_Listar correos con filtros opcionales_

<h3 id="get__correos-parameters">Parameters</h3>

| Name         | In    | Type              | Required | Description |
| ------------ | ----- | ----------------- | -------- | ----------- |
| estado       | query | string            | false    | none        |
| proveedor_id | query | integer           | false    | none        |
| fecha_desde  | query | string(date-time) | false    | none        |
| fecha_hasta  | query | string(date-time) | false    | none        |

#### Enumerated Values

| Parameter | Value    |
| --------- | -------- |
| estado    | BORRADOR |
| estado    | ENVIADO  |

<h3 id="get__correos-responses">Responses</h3>

| Status | Meaning                                                 | Description      | Schema |
| ------ | ------------------------------------------------------- | ---------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Lista de correos | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_correos

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/correos \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/correos HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "proveedor_id": 0,
  "correo_seleccionado": "user@example.com",
  "asunto": "string",
  "cuerpo": "string",
  "pago_ids": [
    0
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/correos',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/correos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/correos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/correos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/correos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/correos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /correos`

_Crear un correo manualmente_

Permite crear un correo seleccionando manualmente los pagos a incluir

> Body parameter

```json
{
  "proveedor_id": 0,
  "correo_seleccionado": "user@example.com",
  "asunto": "string",
  "cuerpo": "string",
  "pago_ids": [0]
}
```

<h3 id="post__correos-parameters">Parameters</h3>

| Name                  | In   | Type          | Required | Description                      |
| --------------------- | ---- | ------------- | -------- | -------------------------------- |
| body                  | body | object        | true     | none                             |
| » proveedor_id        | body | integer       | true     | none                             |
| » correo_seleccionado | body | string(email) | true     | Uno de los correos del proveedor |
| » asunto              | body | string        | true     | none                             |
| » cuerpo              | body | string        | true     | none                             |
| » pago_ids            | body | [integer]     | true     | none                             |

<h3 id="post__correos-responses">Responses</h3>

| Status | Meaning                                                          | Description                | Schema |
| ------ | ---------------------------------------------------------------- | -------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)     | Correo creado exitosamente | None   |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Datos inválidos            | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\_\_correos_pendientes

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/correos/pendientes \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/correos/pendientes HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/correos/pendientes', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/correos/pendientes',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/correos/pendientes', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/correos/pendientes', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/correos/pendientes");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/correos/pendientes", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /correos/pendientes`

_Obtener correos pendientes de envío (BORRADOR)_

<h3 id="get__correos_pendientes-responses">Responses</h3>

| Status | Meaning                                                 | Description                 | Schema |
| ------ | ------------------------------------------------------- | --------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Lista de correos pendientes | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\_\_correos_generar

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/correos/generar \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/correos/generar HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "proveedor_id": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/correos/generar',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/correos/generar',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/correos/generar', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/correos/generar', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/correos/generar");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/correos/generar", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /correos/generar`

_Generar correos automáticamente para pagos pendientes_

Busca todos los pagos con pagado=TRUE y gmail_enviado=FALSE,
los agrupa por proveedor y genera un borrador de correo por cada proveedor.

> Body parameter

```json
{
  "proveedor_id": 0
}
```

<h3 id="post__correos_generar-parameters">Parameters</h3>

| Name           | In   | Type    | Required | Description                                       |
| -------------- | ---- | ------- | -------- | ------------------------------------------------- |
| body           | body | object  | false    | none                                              |
| » proveedor_id | body | integer | false    | Opcionalmente filtrar por un proveedor específico |

<h3 id="post__correos_generar-responses">Responses</h3>

| Status | Meaning                                                      | Description                      | Schema |
| ------ | ------------------------------------------------------------ | -------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)      | No hay pagos pendientes de envío | None   |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2) | Correos generados exitosamente   | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put\__correos_{id}

> Code samples

```shell
# You can also use wget
curl -X PUT http://localhost:3000/api/v1/correos/{id} \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
PUT http://localhost:3000/api/v1/correos/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "correo_seleccionado": "user@example.com",
  "asunto": "string",
  "cuerpo": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/correos/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.put 'http://localhost:3000/api/v1/correos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.put('http://localhost:3000/api/v1/correos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PUT','http://localhost:3000/api/v1/correos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/correos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PUT");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PUT", "http://localhost:3000/api/v1/correos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PUT /correos/{id}`

_Actualizar un borrador de correo_

Solo se pueden editar correos en estado BORRADOR

> Body parameter

```json
{
  "correo_seleccionado": "user@example.com",
  "asunto": "string",
  "cuerpo": "string"
}
```

<h3 id="put__correos_{id}-parameters">Parameters</h3>

| Name                  | In   | Type          | Required | Description |
| --------------------- | ---- | ------------- | -------- | ----------- |
| id                    | path | integer       | true     | none        |
| body                  | body | object        | true     | none        |
| » correo_seleccionado | body | string(email) | false    | none        |
| » asunto              | body | string        | false    | none        |
| » cuerpo              | body | string        | false    | none        |

<h3 id="put__correos_{id}-responses">Responses</h3>

| Status | Meaning                                                        | Description                     | Schema |
| ------ | -------------------------------------------------------------- | ------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | Correo actualizado exitosamente | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Correo no encontrado            | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)  | El correo ya fue enviado        | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete\__correos_{id}

> Code samples

```shell
# You can also use wget
curl -X DELETE http://localhost:3000/api/v1/correos/{id} \
  -H 'Authorization: Bearer {access-token}'

```

```http
DELETE http://localhost:3000/api/v1/correos/{id} HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/correos/{id}', {
  method: 'DELETE',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.delete 'http://localhost:3000/api/v1/correos/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.delete('http://localhost:3000/api/v1/correos/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','http://localhost:3000/api/v1/correos/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/correos/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "http://localhost:3000/api/v1/correos/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /correos/{id}`

_Eliminar un borrador de correo_

Solo se pueden eliminar correos en estado BORRADOR

<h3 id="delete__correos_{id}-parameters">Parameters</h3>

| Name | In   | Type    | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| id   | path | integer | true     | none        |

<h3 id="delete__correos_{id}-responses">Responses</h3>

| Status | Meaning                                                        | Description                            | Schema |
| ------ | -------------------------------------------------------------- | -------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)        | Correo eliminado exitosamente          | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4) | Correo no encontrado                   | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)  | No se pueden eliminar correos enviados | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post\__correos_{id}\_enviar

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/correos/{id}/enviar \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/correos/{id}/enviar HTTP/1.1
Host: localhost:3000
Content-Type: application/json

```

```javascript
const inputBody = '{
  "asunto": "string",
  "cuerpo": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/correos/{id}/enviar',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/correos/{id}/enviar',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/correos/{id}/enviar', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/correos/{id}/enviar', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/correos/{id}/enviar");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/correos/{id}/enviar", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /correos/{id}/enviar`

_Enviar un correo_

Cambia el estado del correo a ENVIADO, envía el correo via N8N
y actualiza gmail_enviado=TRUE en todos los pagos incluidos.

> Body parameter

```json
{
  "asunto": "string",
  "cuerpo": "string"
}
```

<h3 id="post__correos_{id}_enviar-parameters">Parameters</h3>

| Name     | In   | Type    | Required | Description                          |
| -------- | ---- | ------- | -------- | ------------------------------------ |
| id       | path | integer | true     | none                                 |
| body     | body | object  | false    | none                                 |
| » asunto | body | string  | false    | Edición de último momento del asunto |
| » cuerpo | body | string  | false    | Edición de último momento del cuerpo |

<h3 id="post__correos_{id}_enviar-responses">Responses</h3>

| Status | Meaning                                                                  | Description                                    | Schema |
| ------ | ------------------------------------------------------------------------ | ---------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Correo enviado exitosamente                    | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)           | Correo no encontrado                           | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)            | El correo ya fue enviado                       | None   |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Error al comunicarse con el servicio de correo | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-an-lisis">Análisis</h1>

Análisis, reportes y dashboards

## get\_\_analisis_dashboard

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/analisis/dashboard \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/analisis/dashboard HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/analisis/dashboard', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/analisis/dashboard',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/analisis/dashboard', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/analisis/dashboard', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/analisis/dashboard");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/analisis/dashboard", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /analisis/dashboard`

_Obtener dashboard con estadísticas generales_

<h3 id="get__analisis_dashboard-responses">Responses</h3>

| Status | Meaning                                                 | Description                | Schema |
| ------ | ------------------------------------------------------- | -------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Dashboard con estadísticas | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get\_\_analisis_reportes_pagos

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/analisis/reportes/pagos \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/analisis/reportes/pagos HTTP/1.1
Host: localhost:3000

```

```javascript
const headers = {
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/analisis/reportes/pagos', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/analisis/reportes/pagos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/analisis/reportes/pagos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/analisis/reportes/pagos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/analisis/reportes/pagos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/analisis/reportes/pagos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /analisis/reportes/pagos`

_Generar reporte de pagos_

<h3 id="get__analisis_reportes_pagos-parameters">Parameters</h3>

| Name         | In    | Type         | Required | Description |
| ------------ | ----- | ------------ | -------- | ----------- |
| fecha_desde  | query | string(date) | false    | none        |
| fecha_hasta  | query | string(date) | false    | none        |
| proveedor_id | query | integer      | false    | none        |

<h3 id="get__analisis_reportes_pagos-responses">Responses</h3>

| Status | Meaning                                                 | Description      | Schema |
| ------ | ------------------------------------------------------- | ---------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Reporte generado | None   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-eventos">Eventos</h1>

Auditoría de eventos del sistema

## get\_\_eventos

> Code samples

```shell
# You can also use wget
curl -X GET http://localhost:3000/api/v1/eventos \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET http://localhost:3000/api/v1/eventos HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript
const headers = {
  Accept: 'application/json',
  Authorization: 'Bearer {access-token}',
};

fetch('http://localhost:3000/api/v1/eventos', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get 'http://localhost:3000/api/v1/eventos',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('http://localhost:3000/api/v1/eventos', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','http://localhost:3000/api/v1/eventos', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/eventos");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "http://localhost:3000/api/v1/eventos", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /eventos`

_Consultar auditoría/eventos del sistema_

Obtiene eventos de auditoría usando la función eventos_get de PostgreSQL con paginación

<h3 id="get__eventos-parameters">Parameters</h3>

| Name        | In    | Type    | Required | Description                                                            |
| ----------- | ----- | ------- | -------- | ---------------------------------------------------------------------- |
| tabla       | query | string  | false    | Filtrar por tabla (actualmente no implementado en función PG)          |
| tipo_evento | query | string  | false    | Filtrar por tipo de evento (actualmente no implementado en función PG) |
| usuario_id  | query | integer | false    | Filtrar por ID de usuario (actualmente no implementado en función PG)  |
| limit       | query | integer | false    | Número máximo de eventos a retornar                                    |
| offset      | query | integer | false    | Número de eventos a saltar (para paginación)                           |

> Example responses

> 200 Response

```json
{
  "code": 200,
  "estado": true,
  "message": "Eventos obtenidos exitosamente",
  "total": 150,
  "limite": 100,
  "offset": 0,
  "data": [{}]
}
```

<h3 id="get__eventos-responses">Responses</h3>

| Status | Meaning                                                 | Description                                    | Schema |
| ------ | ------------------------------------------------------- | ---------------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Lista de eventos con información de paginación | Inline |

<h3 id="get__eventos-responseschema">Response Schema</h3>

Status Code **200**

| Name      | Type     | Required | Restrictions | Description |
| --------- | -------- | -------- | ------------ | ----------- |
| » code    | integer  | false    | none         | none        |
| » estado  | boolean  | false    | none         | none        |
| » message | string   | false    | none         | none        |
| » total   | integer  | false    | none         | none        |
| » limite  | integer  | false    | none         | none        |
| » offset  | integer  | false    | none         | none        |
| » data    | [object] | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-webhooks">Webhooks</h1>

Webhooks para integración con N8N

## post\_\_webhooks_n8n_documento-procesado

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/webhooks/n8n/documento-procesado \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'x-n8n-token: string' \
  -H 'x-n8n-token: API_KEY'

```

```http
POST http://localhost:3000/api/v1/webhooks/n8n/documento-procesado HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json
x-n8n-token: string

```

```javascript
const inputBody = '{
  "documento_id": 123,
  "tipo_procesamiento": "FACTURA",
  "exito": true,
  "mensaje": "OCR completado exitosamente",
  "codigos_encontrados": [
    {
      "codigo_reserva": "AC12345",
      "encontrado": true,
      "pago_id": 501,
      "observaciones": "Código encontrado en línea 5"
    }
  ],
  "codigos_no_encontrados": [
    "XYZ999",
    "ABC000"
  ],
  "timestamp": "2026-01-30T04:30:15.234Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'x-n8n-token':'string',
  'x-n8n-token':'API_KEY'
};

fetch('http://localhost:3000/api/v1/webhooks/n8n/documento-procesado',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'x-n8n-token' => 'string',
  'x-n8n-token' => 'API_KEY'
}

result = RestClient.post 'http://localhost:3000/api/v1/webhooks/n8n/documento-procesado',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'x-n8n-token': 'string',
  'x-n8n-token': 'API_KEY'
}

r = requests.post('http://localhost:3000/api/v1/webhooks/n8n/documento-procesado', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'x-n8n-token' => 'string',
    'x-n8n-token' => 'API_KEY',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/webhooks/n8n/documento-procesado', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/webhooks/n8n/documento-procesado");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "x-n8n-token": []string{"string"},
        "x-n8n-token": []string{"API_KEY"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/webhooks/n8n/documento-procesado", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /webhooks/n8n/documento-procesado`

_Recibir notificación de N8N tras procesar documento_

Endpoint para que N8N notifique cuando termina de procesar un documento.

- OCR extrae códigos de reserva del PDF
- Actualiza automáticamente los pagos encontrados (estado=PAGADO, verificado=TRUE)
- Vincula el documento con los pagos
- Registra códigos no encontrados para revisión manual

> Body parameter

```json
{
  "documento_id": 123,
  "tipo_procesamiento": "FACTURA",
  "exito": true,
  "mensaje": "OCR completado exitosamente",
  "codigos_encontrados": [
    {
      "codigo_reserva": "AC12345",
      "encontrado": true,
      "pago_id": 501,
      "observaciones": "Código encontrado en línea 5"
    }
  ],
  "codigos_no_encontrados": ["XYZ999", "ABC000"],
  "timestamp": "2026-01-30T04:30:15.234Z"
}
```

<h3 id="post__webhooks_n8n_documento-procesado-parameters">Parameters</h3>

| Name                     | In     | Type              | Required | Description                                         |
| ------------------------ | ------ | ----------------- | -------- | --------------------------------------------------- |
| x-n8n-token              | header | string            | true     | Token de autenticación N8N (configurado en .env)    |
| body                     | body   | object            | true     | none                                                |
| » documento_id           | body   | integer           | true     | ID del documento procesado                          |
| » tipo_procesamiento     | body   | string            | true     | none                                                |
| » exito                  | body   | boolean           | true     | Si el procesamiento OCR fue exitoso                 |
| » mensaje                | body   | string            | false    | Mensaje informativo del procesamiento               |
| » codigos_encontrados    | body   | [object]          | false    | Lista de códigos de reserva extraídos del documento |
| »» codigo_reserva        | body   | string            | false    | none                                                |
| »» encontrado            | body   | boolean           | false    | none                                                |
| »» pago_id               | body   | integer           | false    | ID del pago encontrado (opcional)                   |
| »» observaciones         | body   | string            | false    | none                                                |
| » codigos_no_encontrados | body   | [string]          | false    | Códigos extraídos que no coinciden con ningún pago  |
| » timestamp              | body   | string(date-time) | true     | Fecha/hora del procesamiento                        |

#### Enumerated Values

| Parameter            | Value           |
| -------------------- | --------------- |
| » tipo_procesamiento | FACTURA         |
| » tipo_procesamiento | DOCUMENTO_BANCO |

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Webhook procesado exitosamente",
  "data": {
    "pagos_actualizados": 3,
    "pagos_encontrados": [501, 502, 503],
    "codigos_no_encontrados": ["XYZ999"],
    "errores": []
  }
}
```

<h3 id="post__webhooks_n8n_documento-procesado-responses">Responses</h3>

| Status | Meaning                                                                    | Description                    | Schema |
| ------ | -------------------------------------------------------------------------- | ------------------------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                    | Webhook procesado exitosamente | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)           | Datos inválidos en el webhook  | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)            | Token N8N no proporcionado     | None   |
| 403    | [Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)             | Token N8N inválido             | None   |
| 500    | [Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1) | Error al procesar webhook      | None   |

<h3 id="post__webhooks_n8n_documento-procesado-responseschema">Response Schema</h3>

Status Code **200**

| Name                      | Type      | Required | Restrictions | Description                            |
| ------------------------- | --------- | -------- | ------------ | -------------------------------------- |
| » success                 | boolean   | false    | none         | none                                   |
| » message                 | string    | false    | none         | none                                   |
| » data                    | object    | false    | none         | none                                   |
| »» pagos_actualizados     | integer   | false    | none         | Cantidad de pagos actualizados         |
| »» pagos_encontrados      | [integer] | false    | none         | IDs de los pagos actualizados          |
| »» codigos_no_encontrados | [string]  | false    | none         | Códigos que no se encontraron en la BD |
| »» errores                | [string]  | false    | none         | none                                   |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
n8nToken
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-documentos-pago">Documentos Pago</h1>

Endpoints para procesar documentos (PDFs) con webhooks de N8N.

## 📋 FLUJO GENERAL

1. El Frontend envía un PDF (base64) al endpoint
2. El Backend obtiene los datos necesarios y los envía al webhook de N8N
3. N8N procesa el documento y responde con código 200 o 400
4. El Backend retorna la respuesta del webhook al Frontend
5. El Frontend usa pagos_put() para actualizar el estado (si aplica)

## 🔗 WEBHOOKS

- documento_pago: https://n8n.salazargroup.cloud/webhook/documento_pago
- docu (facturas/banco): https://n8n.salazargroup.cloud/webhook/docu

## post\__pagos_{id}\_documento-estado

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/pagos/{id}/documento-estado \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/pagos/{id}/documento-estado HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "pdf": "JVBERi0xLjQK...",
  "cambiar_pagado": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/pagos/{id}/documento-estado',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/pagos/{id}/documento-estado',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/pagos/{id}/documento-estado', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/pagos/{id}/documento-estado', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/pagos/{id}/documento-estado");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/pagos/{id}/documento-estado", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /pagos/{id}/documento-estado`

_Enviar documento para cambiar estado de pago_

## 📋 FLUJO

1. Front envía: id_pago, pdf (base64), y qué estado cambiar
2. Back obtiene TODOS los datos del pago
3. Back envía al webhook: `https://n8n.salazargroup.cloud/webhook/documento_pago`
4. Webhook responde 200 o 400 con data adicional
5. Back retorna esa respuesta EXACTA al front
6. El webhook de N8N es quien usa `pagos_put()` para cambiar el estado

## ⚠️ VALIDACIONES

- No se puede verificar si el pago NO está marcado como pagado
- Solo se puede especificar UNO: cambiar_pagado O cambiar_verificado

## 📤 PAYLOAD QUE RECIBE EL WEBHOOK

```json
{
  "pago": { ...todos los datos del pago... },
  "pdf": "base64...",
  "accion": "MARCAR_PAGADO" | "MARCAR_VERIFICADO",
  "cambiar_pagado": true/false,
  "cambiar_verificado": true/false,
  "timestamp": "2026-01-30T21:00:00Z"
}
```

> Body parameter

```json
{
  "pdf": "JVBERi0xLjQK...",
  "cambiar_pagado": true
}
```

<h3 id="post__pagos_{id}_documento-estado-parameters">Parameters</h3>

| Name                 | In   | Type    | Required | Description                                                               |
| -------------------- | ---- | ------- | -------- | ------------------------------------------------------------------------- |
| id                   | path | integer | true     | ID del pago                                                               |
| body                 | body | object  | true     | none                                                                      |
| » pdf                | body | string  | true     | PDF del documento en base64                                               |
| » cambiar_pagado     | body | boolean | false    | Si se quiere marcar el pago como PAGADO                                   |
| » cambiar_verificado | body | boolean | false    | Si se quiere marcar el pago como VERIFICADO (requiere que ya esté pagado) |

> Example responses

> 200 Response

```json
{
  "success": true,
  "code": 200,
  "mensaje": "Documento procesado correctamente",
  "codigo_generado": "DOC-2026-ABC123",
  "data": {}
}
```

<h3 id="post__pagos_{id}_documento-estado-responses">Responses</h3>

| Status | Meaning                                                          | Description                                      | Schema |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)          | Webhook procesó correctamente el documento       | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1) | Error del webhook al procesar el documento       | Inline |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)   | Pago no encontrado                               | None   |
| 409    | [Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)    | No se puede verificar un pago que no está pagado | None   |

<h3 id="post__pagos_{id}_documento-estado-responseschema">Response Schema</h3>

Status Code **200**

| Name              | Type    | Required | Restrictions | Description                |
| ----------------- | ------- | -------- | ------------ | -------------------------- |
| » success         | boolean | false    | none         | none                       |
| » code            | integer | false    | none         | none                       |
| » mensaje         | string  | false    | none         | none                       |
| » codigo_generado | string  | false    | none         | none                       |
| » data            | object  | false    | none         | Data adicional del webhook |

Status Code **400**

| Name      | Type    | Required | Restrictions | Description |
| --------- | ------- | -------- | ------------ | ----------- |
| » success | boolean | false    | none         | none        |
| » code    | integer | false    | none         | none        |
| » mensaje | string  | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="api-terra-canada-sistema-de-gesti-n-de-pagos-facturas">Facturas</h1>

## post\_\_facturas_procesar

> Code samples

```shell
# You can also use wget
curl -X POST http://localhost:3000/api/v1/facturas/procesar \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST http://localhost:3000/api/v1/facturas/procesar HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "archivos": [
    {
      "nombre": "NA - 39331961285.2025-01-31.pdf",
      "tipo": "application/pdf",
      "base64": "string"
    }
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/api/v1/facturas/procesar',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post 'http://localhost:3000/api/v1/facturas/procesar',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('http://localhost:3000/api/v1/facturas/procesar', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','http://localhost:3000/api/v1/facturas/procesar', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("http://localhost:3000/api/v1/facturas/procesar");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "http://localhost:3000/api/v1/facturas/procesar", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /facturas/procesar`

_Procesar facturas enviando PDFs en base64 a N8N_

Envía hasta 5 facturas en formato PDF (base64) a N8N para procesamiento OCR.
N8N extrae códigos de reserva y retorna los pagos encontrados.

> Body parameter

```json
{
  "archivos": [
    {
      "nombre": "NA - 39331961285.2025-01-31.pdf",
      "tipo": "application/pdf",
      "base64": "string"
    }
  ]
}
```

<h3 id="post__facturas_procesar-parameters">Parameters</h3>

| Name       | In   | Type     | Required | Description                 |
| ---------- | ---- | -------- | -------- | --------------------------- |
| body       | body | object   | true     | none                        |
| » archivos | body | [object] | true     | none                        |
| »» nombre  | body | string   | true     | none                        |
| »» tipo    | body | string   | true     | none                        |
| »» base64  | body | string   | true     | Contenido del PDF en base64 |

> Example responses

> 200 Response

```json
{
  "code": 200,
  "estado": true,
  "message": "Pagos encontrados",
  "data": {
    "pagos_encontrados": [
      {
        "cod": 0
      }
    ],
    "total": 0
  }
}
```

<h3 id="post__facturas_procesar-responses">Responses</h3>

| Status | Meaning                                                                  | Description                             | Schema |
| ------ | ------------------------------------------------------------------------ | --------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Facturas procesadas exitosamente        | Inline |
| 400    | [Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)         | Error al procesar facturas              | None   |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Servicio de procesamiento no disponible | None   |

<h3 id="post__facturas_procesar-responseschema">Response Schema</h3>

Status Code **200**

| Name                 | Type     | Required | Restrictions | Description |
| -------------------- | -------- | -------- | ------------ | ----------- |
| » code               | integer  | false    | none         | none        |
| » estado             | boolean  | false    | none         | none        |
| » message            | string   | false    | none         | none        |
| » data               | object   | false    | none         | none        |
| »» pagos_encontrados | [object] | false    | none         | none        |
| »»» cod              | integer  | false    | none         | none        |
| »» total             | integer  | false    | none         | none        |

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

# Schemas

<h2 id="tocS_Error">Error</h2>
<!-- backwards compatibility -->
<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "code": 0,
  "estado": true,
  "message": "string",
  "data": {},
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### Properties

| Name      | Type        | Required | Restrictions | Description                                      |
| --------- | ----------- | -------- | ------------ | ------------------------------------------------ |
| code      | integer     | false    | none         | Código HTTP de error                             |
| estado    | boolean     | false    | none         | Estado de la petición (siempre false en errores) |
| message   | string      | false    | none         | Mensaje descriptivo del error                    |
| data      | object¦null | false    | none         | Datos adicionales (null en errores)              |
| errors    | [object]    | false    | none         | Detalles de errores de validación                |
| » field   | string      | false    | none         | none                                             |
| » message | string      | false    | none         | none                                             |

<h2 id="tocS_Success">Success</h2>
<!-- backwards compatibility -->
<a id="schemasuccess"></a>
<a id="schema_Success"></a>
<a id="tocSsuccess"></a>
<a id="tocssuccess"></a>

```json
{
  "code": 0,
  "estado": true,
  "message": "string",
  "data": {}
}
```

### Properties

| Name    | Type    | Required | Restrictions | Description                                   |
| ------- | ------- | -------- | ------------ | --------------------------------------------- |
| code    | integer | false    | none         | Código HTTP de éxito                          |
| estado  | boolean | false    | none         | Estado de la petición (siempre true en éxito) |
| message | string  | false    | none         | Mensaje descriptivo del éxito                 |
| data    | object  | false    | none         | Datos de la respuesta                         |
