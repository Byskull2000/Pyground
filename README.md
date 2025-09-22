# UNIVERSIDAD MAYOR DE SAN SIMÓN  

**FACULTAD DE CIENCIA Y TECNOLOGÍA**

---

## 📘 Convenciones de Código "Pyground"

**DOCENTE:**  
Ing. Vladimir Costas Jauregui  

**ESTUDIANTES:**  

- García Llanqui Jhunior Remberto  
- Grajeda Herrera Diego Gualberto  
- Limachi Martinez Pablo Hans  
- Rafael Montaño Aaron David  

**CARRERA:**  
Ingeniería Informática  

**MATERIA:**  
Generación de Software  

**Lugar:**  
Cochabamba - Bolivia  

## 📂 Estructura del Proyecto

El proyecto seguirá una arquitectura **monorepo** con separación clara entre **backend** y **frontend**.

```
/project-root
├── backend/
│ ├── src/
│ │ ├── modules/
│ │ │ └── user/
│ │ │ ├── user.controller.ts
│ │ │ ├── user.service.ts
│ │ │ ├── user.repository.ts
│ │ │ ├── user.routes.ts
│ │ │ └── user.types.ts
│ │ ├── middlewares/
│ │ ├── utils/
│ │ ├── config/
│ │ └── server.ts
│ ├── prisma/
│ │ ├── schema.prisma
│ │ └── migrations/
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── atoms/
│ │ │ ├── molecules/
│ │ │ ├── organisms/
│ │ │ └── templates/
│ │ ├── features/
│ │ │ └── user/
│ │ │ ├── UserPage.tsx
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ └── types.ts
│ │ ├── store/
│ │ ├── hooks/
│ │ └── utils/
│ └── package.json
├── docs/
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔤 Nomenclatura

- **Variables, funciones y métodos:** `camelCase`
- **Archivos y carpetas:** `kebab-case` → `user-service.ts`, `pedido-controller.ts`
- **Componentes React:** `PascalCase` → `UserCard.tsx`
- **Constantes y enums:** `UPPER_CASE` → `DEFAULT_PAGE_SIZE`

---

## 🗄️ Prisma

- **Tablas Prisma:** `snake_case` → `user_roles`
- **Modelos Prisma:** `PascalCase` → `UserRole`

---

## 📘 TypeScript

La configuración de TypeScript priorizará **strict mode** para máxima seguridad de tipos.

- Se prefieren **interfaces** sobre `types` para objetos.
- Nomenclatura descriptiva para tipos personalizados.
- Manejo de tipos opcionales y `nullable`.

---

## ⚙️ Backend (Node.js + Express + Prisma)

Arquitectura en capas con separación clara entre responsabilidades:

- **Controller:** recibe request/response (sin lógica de negocio).
- **Service:** lógica de negocio.
- **Repository:** acceso a base de datos vía Prisma.
- **DTOs:** contrato de entrada/salida.
- **Validator:** validación con `zod` o `class-validator`.

**Ejemplo flujo:**  
`pedido-routes.ts → pedido-controller.ts → pedido-service.ts → pedido-repository.ts → Prisma`

### Middlewares

- `authMiddleware` (JWT/Sessions)

### Validación

- Entrada validada vía `zod` o `express-validator` en DTOs.

---

## 🎨 Frontend (React)

- Principios de **composición** y **reutilización**.
- Uso de **hooks funcionales** sobre componentes de clase.
- Separación clara entre lógica de negocio y presentación.

---

## 🔗 API y Comunicación

Las APIs seguirán principios **RESTful** con endpoints semánticos:

**/api/v1/pedidos/:id**

### Respuestas JSON

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending"
  },
  "error": null
}
```

- **Errores uniformes** → código, mensaje y detalles.

---

## 🛢️ Base de Datos

- ORM principal: **Prisma**.

- Migraciones versionadas en `prisma/migrations/`.

- Seeds incluidos para datos iniciales (ej: admin user, roles).

- Convenciones:

  - Modelos → `PascalCase` (User, Pedido)

  - Tablas → `snake_case` plural (users, pedidos)

---

## 🖊️ Estilo de Código

- **ESLint** y **Prettier** para consistencia.

- Configuración estricta, priorizando legibilidad y mantenibilidad.

---

## 🌱 Git y Versionado

Se usará **Conventional Commits** y una estrategia de **GitFlow simplificado**.

- **Commits**:

  - `feat`: nueva funcionalidad

  - `fix`: corrección de bug

  - `chore`: mantenimiento

  - `docs`: documentación

- **Ramas:**

  - `main` → producción

  - `develop` → integración

  - `feature/*` → desarrollo de features

- **Versionado**: semántico (ej: `1.2.0`)

---

## 📝 Comentarios y Documentación

- Documentación concisa pero completa.

- **JSDoc** en funciones complejas.

- `README.md` en cada módulo con contexto.

- Comentarios inline → solo cuando el código no sea autoexplicativo.

- Documentación API → **Swagger** + **Postman collections**.
