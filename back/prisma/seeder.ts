import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.curso.create({
      data: {
        nombre: "Python",
        descripcion: "Curso introductorio de Python",
        codigo_curso: "PY001",
        creado_por: "admin",
      },
    });
    console.log("Curso creado correctamente");
  } catch (error) {
    console.error("Error creando el curso:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
