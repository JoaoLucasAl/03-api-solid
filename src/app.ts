import { fastify } from "fastify";
import { PrismaClient } from "@prisma/client";

export const app = fastify();

const prisma = new PrismaClient();

// npx prisma init
prisma.user.create({
	data: {
		name: "João",
		email: "joao.muniz@sejaefi.com.br"
	}
});