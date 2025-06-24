import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';

const BudgetCreate = () => {
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    descricao: '',
    projetoId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await budgetService.create(formData);
      toast.success('Orçamento criado com sucesso!');
      navigate('/budgets');
    } catch {
      setError('Erro ao criar orçamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Input
              name="nome"
              placeholder="Nome do orçamento"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <Input
              name="valor"
              placeholder="Valor"
              type="number"
              value={formData.valor}
              onChange={handleChange}
              required
            />
            <Input
              name="descricao"
              placeholder="Descrição"
              value={formData.descricao}
              onChange={handleChange}
            />
            <Input
              name="projetoId"
              placeholder="ID do Projeto"
              value={formData.projetoId}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Orçamento'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetCreate;
