import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, DollarSign, Calendar, User, Building } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { budgetService, clientService } from '../services/api';
import toast from 'react-hot-toast';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    amount: ''
  });

  useEffect(() => {
    fetchBudgets();
    fetchClients();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await budgetService.getAll();
      setBudgets(data);
    } catch (error) {
      toast.error('Erro ao carregar orçamentos');
      console.error('Erro ao carregar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await budgetService.create({
        ...formData,
        clientId: parseInt(formData.clientId),
        amount: formData.amount ? parseFloat(formData.amount) : undefined
      });
      toast.success('Orçamento criado com sucesso!');
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', clientId: '', amount: '' });
      fetchBudgets();
    } catch (error) {
      toast.error('Erro ao criar orçamento');
      console.error('Erro ao criar orçamento:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await budgetService.update(selectedBudget.id, {
        ...formData,
        clientId: parseInt(formData.clientId),
        amount: formData.amount ? parseFloat(formData.amount) : undefined
      });
      toast.success('Orçamento atualizado com sucesso!');
      setIsEditModalOpen(false);
      setSelectedBudget(null);
      setFormData({ name: '', description: '', clientId: '', amount: '' });
      fetchBudgets();
    } catch (error) {
      toast.error('Erro ao atualizar orçamento');
      console.error('Erro ao atualizar orçamento:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await budgetService.delete(id);
        toast.success('Orçamento excluído com sucesso!');
        fetchBudgets();
      } catch (error) {
        toast.error('Erro ao excluir orçamento');
        console.error('Erro ao excluir orçamento:', error);
      }
    }
  };

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setFormData({
      name: budget.name,
      description: budget.description,
      clientId: budget.client?.id?.toString() || '',
      amount: budget.amount?.toString() || ''
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'em analise': { label: 'Em Análise', variant: 'secondary' },
      'aprovado': { label: 'Aprovado', variant: 'default' },
      'negado': { label: 'Negado', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-600">Gerencie orçamentos e propostas de projetos</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Orçamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="clientId">Cliente</Label>
                <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Valor (opcional)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Orçamento</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar orçamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="em analise">Em Análise</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="negado">Negado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Orçamentos */}
      <div className="grid gap-4">
        {filteredBudgets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece criando seu primeiro orçamento.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBudgets.map((budget) => (
            <Card key={budget.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                      {getStatusBadge(budget.status)}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{budget.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>{budget.client?.name || 'Cliente não informado'}</span>
                      </div>
                      
                      {budget.amount && (
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>R$ {budget.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(budget.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(budget)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Orçamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome do Projeto</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-clientId">Cliente</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-amount">Valor (opcional)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budgets;

