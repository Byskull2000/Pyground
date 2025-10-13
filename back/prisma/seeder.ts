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
          },
        });
        console.log(`Usuario ${u.email} creado correctamente`);
      } else {
        console.log(`Usuario ${u.email} ya existe`);
      }
    }

    // Curso base Python
    const existingCurso = await prisma.curso.findUnique({
      where: { codigo_curso: "PY001" },
    });

    if (!existingCurso) {
      await prisma.curso.create({
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
  } catch (error) {
    console.error("Error en el seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
