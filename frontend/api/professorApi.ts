import { Professor } from "@/types";
import apiUrl from "./apiUrl";

export const getProfessor = async () => {
    const url = `${apiUrl}/professor/perfil`;

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

    const alunoData: Professor = await response.json();
    return alunoData;
}