import { PrismaClient } from "../../generated/prisma";

const {
  DB_USER = "",
  DB_PASSWORD = "",
  DB_HOST = "",
  DB_PORT = "",
  DB_NAME = "",
} = process.env;

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
});

export default prisma;