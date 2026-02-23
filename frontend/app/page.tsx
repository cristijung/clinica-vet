"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Dog, PlusCircle, PawPrint } from "lucide-react";

// interface para garantir tipagem 
interface Pet {
  id: number;
  nome: string;
  especie: string;
  idade: number;
}

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [idade, setIdade] = useState<number | "">("");

  // fn para buscar pets no backend --> porta 3001
  const fetchPets = async () => {
    try {
      const response = await axios.get<Pet[]>("http://localhost:3001/pets");
      setPets(response.data);
    } catch (err) {
      console.error("Erro ao carregar lista de pets.");
    }
  };

  // fn para cadastrar um novo pet
  const cadastrarPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !especie || idade === "") return;

    try {
      await axios.post("http://localhost:3001/pets", { nome, especie, idade });
      // limpa os campos após o sucesso
      setNome("");
      setEspecie("");
      setIdade("");
      fetchPets(); // atualiza a lista
    } catch (err) {
      alert("Erro ao salvar pet no banco de dados.");
    }
  };

  // fn p excluir um pet usando o ID
  const excluirPet = async (id: number) => {
    if (confirm("Deseja realmente remover este paciente da lista?")) {
      try {
        await axios.delete(`http://localhost:3001/pets/${id}`);
        fetchPets();
      } catch (err) {
        alert("Erro ao excluir o pet.");
      }
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <main className="p-10 bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* título com ícone */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3">
          <Dog size={40} className="text-blue-600" />
          Clínica Vet PurrfectCare
        </h1>
        <p className="text-gray-600 mt-2 italic">Gestão de Pacientes e Bem-estar Animal</p>
      </header>
      
      {/* form de cadastro */}
      <section className="max-w-md mx-auto mb-16">
        <form 
          onSubmit={cadastrarPet} 
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-5"
        >
          <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-lg border-b pb-2">
            <PlusCircle size={20} />
            <h2>Novo Cadastro</h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Pet</label>
            <input 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-600 bg-gray-50" 
              placeholder="Ex: Totó ou Mel" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Espécie</label>
            <input 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-600 bg-gray-50" 
              placeholder="Ex: Canina, Felina..." 
              value={especie} 
              onChange={e => setEspecie(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Idade (Anos)</label>
            <input 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-600 bg-gray-50" 
              type="number" 
              placeholder="Ex: 3" 
              value={idade} 
              onChange={e => setIdade(e.target.value === "" ? "" : Number(e.target.value))} 
              required 
            />
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-95">
            Confirmar Cadastro
          </button>
        </form>
      </section>

      {/* lista de pets */}
      <section className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <PawPrint className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Pacientes Internados</h2>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
            Nenhum paciente cadastrado no momento.
          </div>
        ) : (
          <div className="grid gap-4">
            {pets.map(pet => (
              <article 
                key={pet.id} 
                className="bg-white p-5 rounded-xl border-l-8 border-blue-500 shadow-md flex justify-between items-center transition-transform hover:shadow-lg"
              >
                <div>
                  <h3 className="font-bold text-xl text-blue-900">{pet.nome}</h3>
                  <p className="text-gray-600 font-medium italic">
                    {pet.especie} • {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                  </p>
                </div>
                
                <button 
                  onClick={() => excluirPet(pet.id)}
                  className="p-3 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  title="Remover paciente"
                >
                  <Trash2 size={24} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}