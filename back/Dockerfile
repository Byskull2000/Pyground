# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el código fuente
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa 2: Production
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Crear directorio para uploads
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Exponer el puerto
EXPOSE 5000

# Variables de entorno por defecto (se sobrescriben en runtime)
ENV NODE_ENV=production
ENV PORT=5000

# Comando de inicio
CMD ["node", "dist/server.js"]