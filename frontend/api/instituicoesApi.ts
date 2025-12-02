import { Institution } from "@/types";
import apiUrl from "./apiUrl";

export const getAllInstituicoes = async () => {
  const url = `${apiUrl}/instituicoes`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })

  if (!response.ok) {
    const errorData: { error: string } = await response.json();
    throw new Error(`Erro ${response.status}: ${errorData.error || 'Falha ao buscar instituições'}`);
  }

  const instituicoesData: Institution[] = await response.json();
  return instituicoesData;
}

export interface Instituicao {
  id: number;
  user_id: number;
  nome: string;
  cnpj: string;
  endereco?: string;
}

export async function getInstituicaoData(): Promise<Instituicao> {
  const url = `${apiUrl}/instituicao/perfil`;

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Token não encontrado — usuário não autenticado");
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Erro ao buscar perfil da instituição (${response.status})`);
  }

  return response.json();
}
