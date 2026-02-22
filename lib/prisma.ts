// importando a ferramenta q o Prisma gerou p o nosso projeto
import { PrismaClient } from ".prisma/client";
// o Next.js, em ambiente de desenvolvimento, recarrega o código toda vez que salvamos um arquivo. 
// p não perder a conexão que já existe, nós a guardamos em uma variável global do Node.js.
const globalForPrisma = global as unknown as { prisma: PrismaClient };
// SE já existir uma conexão na variável global, use-a. Se não existir, crie uma nova.
export const prisma = globalForPrisma.prisma || new PrismaClient();
// SE não estivermos no servidor de produção, 
// nós salvamos a conexão na variável global para que ela sobreviva ao "Hot Reload" do Next.js.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;