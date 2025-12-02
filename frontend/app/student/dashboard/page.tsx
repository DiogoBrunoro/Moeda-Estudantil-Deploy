"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import AdvantageCard from "@/components/advantage-card"
import TransactionItem from "@/components/transaction-item"
import { Student, type Advantage, type Transaction } from "@/types"

import {
  getAlunoData,
  getExtrato,
  getVantagensParaAluno,
  resgatarVantagem,
  type AdvantageWithStatus,
} from "@/api/alunoApi"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/loading-spinner"
import { useNotification } from "@/context/NotificationContext"
import ConfirmationModal from "@/components/confirmation-modal"

export default function StudentDashboard() {
  const [aluno, setAluno] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [advantages, setAdvantages] = useState<AdvantageWithStatus[]>([])
  const [advantagesLoading, setAdvantagesLoading] = useState(true)
  const [advantagesError, setAdvantagesError] = useState<string | null>(null)
  const [redeemingId, setRedeemingId] = useState<string | null>(null)
  const [totalCoinsReceived, setTotalCoinsReceived] = useState(0);
  const [totalAdvantagesRedeemed, setTotalAdvantagesRedeemed] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advantageToRedeem, setAdvantageToRedeem] = useState<Advantage | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const alunoBuscado = await getAlunoData()
        if (alunoBuscado === null) {
          setError("Não foi possível carregar os dados do aluno.")
          setAluno(null)
        } else {
          setAluno(alunoBuscado)
        }

        const transactionsData = await getExtrato()
        setTransactions(transactionsData.transacoes)

        let received = 0;
        let redeemed = 0;

        transactionsData.transacoes.forEach((transaction: any) => {
          if (transaction.professor_id) {
            // Se tem professor_id, é uma moeda recebida
            received += transaction.valor!;
          } else {
            // Se não tem professor_id, é uma vantagem resgatada
            redeemed += 1;
          }
        });

        setTotalCoinsReceived(received);
        setTotalAdvantagesRedeemed(redeemed);

      } catch (err: any) {
        console.error("Erro ao buscar dados iniciais:", err)
        setError(err.message || "Ocorreu um erro desconhecido ao carregar os dados.")
        setAluno(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchAdvantages = async () => {
      setAdvantagesLoading(true)
      setAdvantagesError(null)
      try {
        const data = await getVantagensParaAluno()
        setAdvantages(data)
      } catch (err: any) {
        console.error("Erro ao buscar vantagens:", err)
        setAdvantagesError(err.message)
      } finally {
        setAdvantagesLoading(false)
      }
    }

    fetchAdvantages()
  }, [])

  const handleRedeem = async (advantage: Advantage) => {
    if (redeemingId) return // Já existe um resgate em andamento

    if (!aluno) {
      showNotification("Erro: Dados do aluno não carregados. Tente recarregar a página.", "error");
      return
    }

    const advStatus = advantages.find(a => a.vantagem.id === advantage.id)
    if (advStatus?.ja_resgatada) {
      showNotification("Você já resgatou esta vantagem.", "warning");
      return
    }

    if (aluno.saldo_moedas < advantage.cost) {
      showNotification("Saldo insuficiente para resgatar esta vantagem.", "warning");
      return
    }

    // Abrir o modal de confirmação
    setAdvantageToRedeem(advantage);
    setIsModalOpen(true);
  }

  // Função para confirmar o resgate (chamada pelo modal)
  const confirmRedeem = async () => {
    if (!advantageToRedeem || !aluno) return; // Não deve acontecer se o modal for aberto corretamente

    setIsModalOpen(false); // Fechar o modal imediatamente
    setRedeemingId(advantageToRedeem.id); // Ativar estado de carregamento para a vantagem específica

    try {
      await resgatarVantagem(advantageToRedeem.id);

      // Atualizar saldo do aluno
      setAluno(prevAluno => {
        if (!prevAluno) return null;
        return {
          ...prevAluno,
          saldo_moedas: prevAluno.saldo_moedas - advantageToRedeem.cost,
        };
      });

      // Atualizar status da vantagem
      setAdvantages(prevAdvantages =>
        prevAdvantages.map(advWithStatus =>
          advWithStatus.vantagem.id === advantageToRedeem.id
            ? {
              ...advWithStatus,
              ja_resgatada: true,
              vantagem: {
                ...advWithStatus.vantagem,
                quantidade: advWithStatus.vantagem.quantidade
                  ? advWithStatus.vantagem.quantidade - 1
                  : 0,
              },
            }
            : advWithStatus,
        ),
      );

      // Atualizar contador de vantagens resgatadas
      setTotalAdvantagesRedeemed(prev => prev + 1);

      showNotification(
        `Vantagem "${advantageToRedeem.title}" resgatada com sucesso! Um email com o cupom será enviado para você!`,
        "success"
      );
    } catch (err: any) {
      console.error("Erro ao resgatar vantagem:", err);
      showNotification(err.message || "Não foi possível resgatar a vantagem. Tente novamente.", "error");
    } finally {
      setRedeemingId(null); // Finalizar estado de carregamento
      setAdvantageToRedeem(null); // Limpar vantagem pendente
    }
  };

  const cancelRedeem = () => {
    setIsModalOpen(false);
    setAdvantageToRedeem(null); // Limpar vantagem pendente
    showNotification("Resgate de vantagem cancelado.", "info"); // Notificação de cancelamento
  };

  const handleName = (name: string) => {
    let splitName = name.split(" ")
    if (splitName.length > 1) {
      return splitName[0] + " " + splitName.at(-1)
    } else {
      return splitName[0]
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!aluno) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error || "Não foi possível carregar os dados do aluno."}
      </div>
    )
  }

  return (
    <DashboardLayout
      userType="student"
      userName={handleName(aluno.nome)}
      balance={aluno.saldo_moedas ?? 0}
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-3">Bem-vindo, {handleName(aluno.nome)}!</h1>
          <p className="text-blue-100 text-lg">Acompanhe seu saldo e resgate vantagens incríveis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Saldo Atual"
            value={aluno.saldo_moedas}
            icon={
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            }
            trend={{ value: "+150 este mês", positive: true }}
          />

          <StatCard
            title="Total de Moedas Recebidas"
            value={totalCoinsReceived}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            }
          />

          <StatCard
            title="Vantagens Resgatadas"
            value={totalAdvantagesRedeemed}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            }
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Vantagens em Destaque</h2>
            <a
              href="/student/advantages"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Ver todas →
            </a>
          </div>

          {advantagesLoading ? (
            <p className="text-center text-muted">Carregando vantagens...</p>
          ) : advantagesError ? (
            <p className="text-center text-red-500">Erro ao carregar vantagens: {advantagesError}</p>
          ) : (
            <>
              {advantages.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted">Nenhuma vantagem em destaque no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advantages.slice(0, 3).map((advantageWithStatus) => (
                    <AdvantageCard
                      key={advantageWithStatus.vantagem.id}
                      advantage={advantageWithStatus.vantagem}
                      onRedeem={handleRedeem}
                      userBalance={aluno.saldo_moedas}
                      isLoading={redeemingId === advantageWithStatus.vantagem.id}
                      isRedeemed={advantageWithStatus.ja_resgatada}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Transações Recentes</h2>
            <a
              href="/student/transaction"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Ver extrato completo →
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">
            {transactions.length === 0 ? (
              <div className="p-4 text-center text-muted">Nenhuma transação recente.</div>
            ) : (
              transactions
                .slice(0, 5)
                .map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} userType="student" />
                ))
            )}
          </div>
        </div>
      </div>
      {isModalOpen && advantageToRedeem && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirmar Resgate"
          message={`Você tem certeza que deseja resgatar "${advantageToRedeem.title}" por ${advantageToRedeem.cost} moedas?`}
          onConfirm={confirmRedeem}
          onCancel={cancelRedeem}
        
          confirmText={redeemingId === advantageToRedeem.id ? "Resgatando..." : "Confirmar Resgate"}
          cancelText="Cancelar"
      
        />
      )}
    </DashboardLayout>
  )
}