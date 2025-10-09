import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Usuario base admin.sys
    const adminEmail = "admin.sys@example.com";
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin123!", 10);

      await prisma.usuario.create({
        data: {
          email: adminEmail,
          password_hash: hashedPassword,
          nombre: "Admin",
          apellido: "Sys",
          activo: true,
          provider: "local",
          bio: "Usuario administrador del sistema",
        },
      });

      console.log("Usuario admin.sys creado correctamente");
    } else {
      console.log("Usuario admin.sys ya existe");
    }

    // Curso base Python
    const existingCurso = await prisma.curso.findUnique({
      where: { codigo_curso: "PY001" },
    });

    if (!existingCurso) {
      await prisma.curso.create({
        data: {
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
