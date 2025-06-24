import React, { useEffect, useState } from 'react';
import { budgetService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const BudgetsList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await budgetService.getAll();
        setBudgets(Array.isArray(data) ? data : []);
      } catch {
        setError('Erro ao carregar orçamentos');
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  return (
    <div className="p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin w-6 h-6 mr-2" /> Carregando...
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : budgets.length === 0 ? (
            <div className="text-gray-500">Nenhum orçamento encontrado.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {budgets.map((budget) => (
                <li key={budget.id} className="py-4 flex flex-col gap-1">
                  <span className="font-semibold">{budget.nome || budget.name}</span>
                  <span>Valor: R$ {budget.valor || budget.value}</span>
                  <span>Projeto: {budget.projetoId || budget.projectId}</span>
                  <span className="text-sm text-gray-500">{budget.descricao || budget.description}</span>
                  {/* Botões de ação podem ser adicionados aqui */}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetsList;
