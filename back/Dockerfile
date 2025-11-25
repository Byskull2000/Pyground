# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar OpenSSL (requerido por Prisma)
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Generar el cliente de Prisma ANTES de copiar el código
RUN npx prisma generate

# Copiar el código fuente (después de generar Prisma)
COPY . .

# Compilar TypeScript
RUN npm run build

# Etapa 2: Production
FROM node:20-alpine

WORKDIR /app

# Instalar OpenSSL (requerido por Prisma)
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Generar el cliente de Prisma en producción
RUN npx prisma generate

# Copiar los archivos compilados y generated desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated

# Crear directorio para uploads
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Exponer el puerto
EXPOSE 5000

# Variables de entorno por defecto (se sobrescriben en runtime)
ENV NODE_ENV=production
ENV PORT=5000

# Comando de inicio
CMD ["node", "dist/server.js"]