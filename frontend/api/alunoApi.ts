import { Advantage, Student } from "@/types";
import apiUrl from "./apiUrl";

export type AdvantageWithStatus = {
  vantagem: Advantage;
  ja_resgatada: boolean;
};

export async function getAlunoData(): Promise<Student> {
  const url = `${apiUrl}/aluno/perfil`;

  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar dados do aluno'}`);
  }

  const alunoData: Student = await response.json();
  return alunoData;
}

export async function getExtrato() {
  const url = `${apiUrl}/aluno/extrato`;

  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar extrato do aluno'}`);
  }

  const extratoData = await response.json();
  return extratoData;
}

export async function updateAluno(updatedAluno: Student): Promise<Student> {
  const url = `${apiUrl}/aluno`;

  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedAluno),
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar dados do aluno'}`);
  }

  const alunoData: Student = await response.json();
  return alunoData;
}

export async function resgatarVantagem(advantageId: string): Promise<Student> {
  const url = `${apiUrl}/aluno/resgatar-vantagem`;
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ vantagem_id: Number(advantageId) }), 
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    
    // O backend provavelmente retornará 409 (Conflict) ou 400 se o saldo for insuficiente
    // Estamos tratando "saldo insuficiente" vindo do backend
    if (response.status === 409 || response.status === 400) {
       throw new Error(errorData.error || 'Saldo insuficiente');
    }

    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao resgatar vantagem'}`);
  }

  // O backend deve retornar o objeto Aluno atualizado com o novo saldo
  const alunoData: Student = await response.json();
  return alunoData;
}



export async function updateAlunoSaldo(valor: number): Promise<Student> {
  const url = `${apiUrl}/aluno/saldo`; // Endpoint PATCH
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ valor: valor }), 
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    
    if (response.status === 409) { 
       throw new Error(errorData.error || 'Saldo insuficiente');
    }

    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao atualizar saldo'}`);
  }

  const alunoData: Student = await response.json();
  return alunoData;
}

export async function getVantagensParaAluno(): Promise<AdvantageWithStatus[]> {
  const url = `${apiUrl}/aluno/vantagens`; // A nova rota protegida
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Requer autenticação
    },
  });

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar vantagens'}`);
  }

  const data = await response.json();
  
  const mappedData: AdvantageWithStatus[] = data.map((item: any) => ({
    ja_resgatada: item.ja_resgatada,
    vantagem: {
      id: String(item.vantagem.ID),
      companyId: String(item.vantagem.empresa_parceira_id),
      companyName: item.vantagem.empresa_parceira?.nome || "Empresa Parceira",
      title: item.vantagem.titulo,
      description: item.vantagem.descricao,
      cost: Number(item.vantagem.custo_moedas),
      imageUrl: item.vantagem.foto_url || "/default.png",
      quantidade: Number(item.vantagem.quantidade),
      estoque: Number(item.vantagem.estoque), 
    }
  }));

  return mappedData;
}