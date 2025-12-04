# 🗂️ Sistema de Gestión de Archivos (Backend)

Backend modular en **NestJS** que permite subir, descargar y gestionar archivos mediante **AWS S3** con URLs pre-firmadas. Guarda metadatos en la base de datos usando **Prisma** (MySQL).

---

## 🧩 Arquitectura (resumen)

```
📦 sistema-de-gestion-de-archivos
├── src/
│   ├── file-upload/    # Controlador, servicio y repositorio de archivos
│   ├── s3/             # Lógica de S3 (generación de pre-signed URLs)
│   ├── prisma/         # PrismaService (cliente y conexión)
│   └── users/          # Autenticación y gestión de usuarios
├── prisma/
│   └── schema.prisma   # Modelos: User, FileMetadata
├── generated/prisma/   # Cliente Prisma generado
└── README.md
```

- Capa Infraestructura: AWS S3 (URLs pre-firmadas para PUT/GET).
- Capa Backend: NestJS (servicios, controladores, guards JWT).
- Persistencia: Prisma + MySQL para metadatos (`FileMetadata`).

---

## 🚀 Características principales

- Subida directa a S3 con URLs pre-firmadas (PUT).
- Descarga mediante URLs pre-firmadas (GET) verificando permisos.
- Persistencia de metadatos (`originalName`, `s3Key`, `mimeType`, `size`, `ownerId`).
- Autenticación JWT y protección de rutas.
- Eliminación coordinada (BD + S3).

---

## ⚙️ Tecnologías

| Capa | Tecnología |
|------|------------|
| Backend | NestJS, TypeScript |
| S3 SDK | @aws-sdk/client-s3, @aws-sdk/s3-request-presigner |
| ORM | Prisma (MySQL) |
| Auth | passport, passport-local, passport-jwt, @nestjs/jwt |

---

## 🗄️ Modelos principales (Prisma)

- `User` — `id`, `email`, `password` (hash), `name`, `createdAt`, `updatedAt`, `files[]`.
- `FileMetadata` — `id`, `originalName`, `s3Key`, `mimeType`, `size`, `bucketName`, `isPublic`, `uploadDate`, `ownerId`.

El esquema está en `prisma/schema.prisma`.

---

## 📥 Variables de entorno (recomendadas)

Crea un `.env` con al menos:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
PORT=3000
JWT_SECRET=tu_secreto_jwt
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=mi-bucket
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_UPLOAD_EXPIRATION_SECONDS=300
AWS_S3_DOWNLOAD_EXPIRATION_SECONDS=300
```

---

## 🛠️ Instalación y ejecución local

1. Instala dependencias:

```bash
npm install
```

2. Aplica migraciones y genera cliente Prisma (desarrollo):

```bash
npm run prisma:dev
```

3. Inicia en modo desarrollo:

```bash
npm run start:dev
```

---

## 🔌 Endpoints principales

Rutas protegidas por `JwtAuthGuard` y expuestas bajo el prefijo `/file-upload`.

- Iniciar subida — `POST /file-upload/upload`
  - Body: `{ "fileName": "photo.jpg", "fileType": "image/jpeg", "fileSize": 12345 }`
  - Respuesta: `{ s3Key, url, metadata }` (URL pre-firmada para PUT).

- Descargar — `GET /file-upload/download/:id`
  - Respuesta: URL pre-firmada para GET.

- Listar archivos del usuario — `GET /file-upload/userFiles`

- Eliminar — `DELETE /file-upload/deleteFile/:id`

Autenticación: `POST /auth/register`, `POST /auth/login` (login devuelve cookie `access_token` y/o token JWT).

---

## 🔎 Ejemplos rápidos

Obtener URL de subida (curl):

```bash
curl -X POST 'http://localhost:3000/file-upload/upload' \
  -H 'Authorization: Bearer <TU_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{"fileName":"foto.png","fileType":"image/png","fileSize":1024}'
```

Subir archivo directo a S3 con la URL obtenida:

```bash
curl -X PUT "<URL_PRE_FIRMADA>" \
  -H "Content-Type: image/png" \
  --data-binary '@ruta/local/foto.png'
```

Descargar (obtener URL y luego descargar):

```bash
curl -H 'Authorization: Bearer <TU_JWT>' \
  http://localhost:3000/file-upload/download/<FILE_ID>
```

---

## 🔐 Consideraciones de seguridad

- No subir `AWS_SECRET_ACCESS_KEY` al repo.
- Mantén expiraciones cortas para URLs pre-firmadas.
- Configura CORS del bucket para permitir PUT desde orígenes confiables.
- Aplica políticas IAM de menor privilegio (PutObject/GetObject/DeleteObject solo al bucket necesario).

---

## 📦 Despliegue (ideas)

- Usar variables de entorno en la plataforma (Heroku, Vercel Serverless, ECS, etc.) o secrets manager.
- Contenerizar con `Dockerfile` y `docker-compose` para DB y entorno local.

---

## 👨‍💻 Contribuir

- Abrir issues y PRs. Usa ramas temáticas y describe los cambios.

---

## ✍️ Autor

Angel Oropeza — Backend Developer

---

