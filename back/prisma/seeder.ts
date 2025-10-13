import { PrismaClient, RolesEnum } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Usuarios base
    const usuariosBase = [
      {
        email: "admin.sys@mail.com",
        nombre: "Admin",
        apellido: "Sys",
        password: "Admin123!",
        rol: RolesEnum.ADMIN,
        bio: "Usuario administrador del sistema",
        email_verificado: true,
      },
      {
        email: "academico.sys@mail.com",
        nombre: "Academico",
        apellido: "Sys",
        password: "Academico123!",
        rol: RolesEnum.ACADEMICO,
        bio: "Usuario académico del sistema",
        email_verificado: true,
      },
      {
        email: "usuario.sys@mail.com",
        nombre: "Usuario",
        apellido: "Sys",
        password: "Usuario123!",
        rol: RolesEnum.USUARIO,
        bio: "Usuario común del sistema",
        email_verificado: true,
      },
    ];

    // Crear usuarios si no existen
    for (const u of usuariosBase) {
      const existingUser = await prisma.usuario.findUnique({
        where: { email: u.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await prisma.usuario.create({
          data: {
            email: u.email,
            password_hash: hashedPassword,
            nombre: u.nombre,
            apellido: u.apellido,
            activo: true,
            provider: "local",
            bio: u.bio,
            rol: u.rol, 
            email_verificado: u.email_verificado
          },
        });
        console.log(`Usuario ${u.email} creado correctamente`);
      } else {
        console.log(`Usuario ${u.email} ya existe`);
      }
    }

    // Curso base Python
    let curso = await prisma.curso.findUnique({
      where: { codigo_curso: "PY001" },
    });

    if (!curso) {
      curso = await prisma.curso.create({
        data: {
          id: 100,
          nombre: "Python",
          descripcion: "Curso introductorio de Python",
          codigo_curso: "PY001",
          creado_por: "admin.sys",
        },
      });
      console.log("Curso de Python creado correctamente");
    } else {
      console.log("Curso PY001 ya existe");
    }
    
    // Crear 3 unidades plantilla si no existen
    const plantillas = await prisma.unidadPlantilla.findMany({
      where: { id_curso: curso.id },
    });

    if (plantillas.length === 0) {
      await prisma.unidadPlantilla.createMany({
        data: [
          {
            id_curso: curso.id,
            titulo: "Introducción a Python",
            descripcion: "Fundamentos básicos del lenguaje",
            orden: 1,
            version: 1,
            icono: "📘",
            color: "#4B8BBE",
          },
          {
            id_curso: curso.id,
            titulo: "Estructuras de Datos",
            descripcion: "Listas, pilas, tuplas y diccionarios",
            orden: 2,
            version: 1,
            icono: "🧱",
            color: "#FFD43B",
          },
          {
            id_curso: curso.id,
            titulo: "Estandares de codigo",
            descripcion: "Estudio de estandares y buenas practicas de programacion",
            orden: 3,
            version: 1,
            icono: "⚙️",
            color: "#306998",
          },
        ],
      });
      console.log("3 Unidades plantilla creadas");
    } else {
      console.log("Unidades plantilla ya existen");
    }

    // Crear edición base
    const edicion = await prisma.edicion.upsert({
      where: { id: 500 },
      update: {},
      create: {
        id: 500,
        id_curso: curso.id,
        nombre_edicion: "Python 2025-I",
        descripcion: "Primera curso de Python del 2025",
        fecha_apertura: new Date("2025-01-01"),
        fecha_cierre: new Date("2025-12-31"),
        creado_por: "admin.sys@mail.com",
      },
    });
    console.log("Edición base creada");

    // Crear unidades replicadas
    const unidades = await prisma.unidad.findMany({
      where: { id_edicion: edicion.id },
    });

    if (unidades.length === 0) {
      const plantillasExistentes = await prisma.unidadPlantilla.findMany({
        where: { id_curso: curso.id },
      });

      for (const plantilla of plantillasExistentes) {
        await prisma.unidad.create({
          data: {
            id_edicion: edicion.id,
            id_unidad_plantilla: plantilla.id,
            titulo: plantilla.titulo,
            descripcion: plantilla.descripcion,
            orden: plantilla.orden,
            icono: plantilla.icono,
            color: plantilla.color,
            publicado: false,
            activo: true,
          },
        });
      }
      console.log("3 Unidades replicadas en la edicion del curso");
    } else {
      console.log("Unidades ya replicadas");
    }

    console.log("Seeding completo");

  } catch (error) {
    console.error("Error en el seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
