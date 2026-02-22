import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// ação para cadastrar um novo Pet
// recebe o FormData diretamente do formulário
export async function cadastrarPet(formData: FormData) {
  // extração segura dos dados
  const nome = formData.get("nome")?.toString();
  const especie = formData.get("especie")?.toString();
  const idadeStr = formData.get("idade")?.toString();
  const dono = formData.get("dono")?.toString();

  // validação para evitar campos vazios no banco
  if (!nome || !especie || !idadeStr || !dono) {
    throw new Error("Todos os campos são obrigatórios!");
  }

  try {
    await prisma.pet.create({
      data: {
        nome,
        especie,
        idade: parseInt(idadeStr),
        dono,
      },
    });

    // avisa ao Next.js que os dados mudaram e a página "/" deve ser atualizada
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
  }
}

// ação para eliminar um Pet
// recebe o ID do pet como argumento

export async function eliminarPet(id: string) {
  try {
    await prisma.pet.delete({
      where: { id },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao eliminar pet:", error);
  }
}

// --> O que o arquvo faz?
// --> Resumo Visual do Fluxo:
// - Usuário clica em "Salvar" no formulário da clínica.
// - A Action cadastrarPet é acionada no servidor.
// - A Action usa o prisma.ts para gravar o bichinho no dev.db.
// - A Action manda a página se atualizar com revalidatePath.
// - O Usuário vê o novo pet na lista sem precisar dar F5.