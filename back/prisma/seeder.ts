import { PrismaClient, RolesEnum } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Usuarios base
    const usuariosBase = [
      {
        id: 10,
        email: "admin.sys@mail.com",
        nombre: "Admin",
        apellido: "Sys",
        password: "Admin123!",
        rol: RolesEnum.ADMIN,
        bio: "Usuario administrador del sistema",
        email_verificado: true,
      },
      {
        id: 20,
        email: "academico.sys@mail.com",
        nombre: "Academico",
        apellido: "Sys",
        password: "Academico123!",
        rol: RolesEnum.ACADEMICO,
        bio: "Usuario académico del sistema",
        email_verificado: true,
      },
      {
        id: 30,
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
            id: u.id,
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
          creado_por: "admin.sys@mail.com",
          estado_publicado: true
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
            id: 1,
            id_curso: curso.id,
            titulo: "Introducción a Python",
            descripcion: "Fundamentos básicos del lenguaje",
            orden: 1,
            version: 1,
            icono: "📘",
            color: "#4B8BBE",
          },
          {
            id: 2,
            id_curso: curso.id,
            titulo: "Estructuras de Datos",
            descripcion: "Listas, pilas, tuplas y diccionarios",
            orden: 2,
            version: 1,
            icono: "🧱",
            color: "#FFD43B",
          },
          {
            id: 3,
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

    // Crear topicos plantilla
    const getUnidadesPlantilla = await prisma.unidadPlantilla.findMany({
      where: { id_curso: curso.id },
    });

    for (const unidad of getUnidadesPlantilla) {
      const topicos = await prisma.topicoPlantilla.findMany({
        where: { id_unidad_plantilla: unidad.id },
      });

      if (topicos.length === 0) {
        let topicosData: any[] = [];

        if (unidad.orden === 1) {
          topicosData = [
            {
              titulo: "Instalación y entorno",
              descripcion: "Cómo instalar Python y configurar el entorno de desarrollo.",
              duracion_estimada: 15,
              orden: 1,
              version: 1,
              objetivos_aprendizaje: "Comprender el entorno de ejecución y uso básico de intérprete.",
            },
            {
              titulo: "Tipos de datos básicos",
              descripcion: "Introducción a enteros, flotantes, cadenas y booleanos.",
              duracion_estimada: 15,
              orden: 2,
              version: 1,
              objetivos_aprendizaje: "Entender y manipular los tipos de datos fundamentales.",
            },
            {
              titulo: "Estructuras de control",
              descripcion: "Uso de if, for y while en Python.",
              duracion_estimada: 45,
              orden: 3,
              version: 1,
              objetivos_aprendizaje: "Escribir programas básicos con lógica condicional e iterativa.",
            },
          ];
        } else if (unidad.orden === 2) {
          topicosData = [
            {
              titulo: "Listas y tuplas",
              descripcion: "Manipulación y operaciones comunes.",
              duracion_estimada: 25,
              orden: 1,
              version: 1,
            },
            {
              titulo: "Conjuntos y diccionarios",
              descripcion: "Estructuras de datos basadas en hash.",
              duracion_estimada: 25,
              orden: 2,
              version: 1,
            },
            {
              titulo: "Comprensiones y slicing",
              descripcion: "Formas concisas y potentes de manipular colecciones.",
              duracion_estimada: 25,
              orden: 3,
              version: 1,
            },
          ];
        } else if (unidad.orden === 3) {
          topicosData = [
            {
              titulo: "Estilo PEP8",
              descripcion: "Reglas de estilo y formato del código Python.",
              duracion_estimada: 20,
              orden: 1,
              version: 1,
            },
            {
              titulo: "Documentación y docstrings",
              descripcion: "Buenas prácticas de documentación de funciones y clases.",
              duracion_estimada: 15,
              orden: 2,
              version: 1,
            },
            {
              titulo: "Testing básico",
              descripcion: "Introducción a pruebas unitarias con pytest.",
              duracion_estimada: 15,
              orden: 3,
              version: 1,
            },
          ];
        }

        for (const topico of topicosData) {
          await prisma.topicoPlantilla.create({
            data: {
              id_unidad_plantilla: unidad.id,
              ...topico,
            },
          });
        }
        console.log(`Tópicos plantilla creados para la unidad: ${unidad.titulo}`);
      } else {
        console.log(`ℹTópicos plantilla ya existen en la unidad: ${unidad.titulo}`);
      }
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
            estado_publicado: true,
            activo: true,
          },
        });
      }
      console.log("3 Unidades replicadas en la edicion del curso");
    } else {
      console.log("Unidades ya replicadas");
    }

    // Replicar tópicos plantilla a tópicos de la edición
    const unidadesEdicion = await prisma.unidad.findMany({
      where: { id_edicion: edicion.id },
    });

    for (const unidad of unidadesEdicion) {
      // Verificar si ya existen tópicos en la unidad
      const topicosExistentes = await prisma.topico.findMany({
        where: { id_unidad: unidad.id },
      });

      if (topicosExistentes.length === 0) {
        // Obtener los tópicos plantilla asociados
        const plantillaTopicos = await prisma.topicoPlantilla.findMany({
          where: { id_unidad_plantilla: unidad.id_unidad_plantilla || 0 },
        });

        for (const topico of plantillaTopicos) {
          await prisma.topico.create({
            data: {
              id_unidad: unidad.id,
              id_topico_plantilla: topico.id,
              titulo: topico.titulo,
              descripcion: topico.descripcion,
              duracion_estimada: topico.duracion_estimada,
              orden: topico.orden,
              publicado: topico.publicado,
              objetivos_aprendizaje: topico.objetivos_aprendizaje,
              activo: topico.activo,
            },
          });
        }
        console.log(`Tópicos replicados para la unidad de edición: ${unidad.titulo}`);
      } else {
        console.log(`Tópicos ya existen en la unidad de edición: ${unidad.titulo}`);
      }
    }

    // Crear cargos base si no existen
    const cargosBase = [
      { id: 1, nombre: "Docente" },
      { id: 2, nombre: "Editor" },
      { id: 3, nombre: "Estudiante" },
    ];

    for (const cargo of cargosBase) {
      const existingCargo = await prisma.cargo.findUnique({
        where: { id: cargo.id },
      });

      if (!existingCargo) {
        await prisma.cargo.create({
          data: cargo,
        });
        console.log(`Cargo ${cargo.nombre} creado correctamente con ID ${cargo.id}`);
      } else {
        console.log(`Cargo ${cargo.nombre} ya existe con ID ${cargo.id}`);
      }
    }



    const admin = await prisma.usuario.findUnique({
      where: { email: "admin.sys@mail.com" },
    });
    const cargoDocente = await prisma.cargo.findUnique({
      where: { nombre: "Docente" },
    });

    if (admin && cargoDocente) {
      const existingInscripcion = await prisma.inscripcion.findUnique({
        where: {
          usuario_id_edicion_id: {
            usuario_id: admin.id,
            edicion_id: edicion.id,
          },
        },
      });

      if (!existingInscripcion) {
        await prisma.inscripcion.create({
          data: {
            usuario_id: admin.id,
            edicion_id: edicion.id,
            cargo_id: cargoDocente.id,
          },
        });
        console.log("Admin inscrito como docente en la edición base");
      } else {
        console.log("Admin ya inscrito en la edición base");
      }
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
