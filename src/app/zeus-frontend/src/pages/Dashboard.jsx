import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  FolderOpen, 
  Wrench, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import { clientService, memberService, projectService, equipmentService, penaltyService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    members: 0,
    projects: 0,
    equipment: 0,
    penalties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clients, members, projects, equipment, penalties] = await Promise.allSettled([
          clientService.getAll(),
          memberService.getAll(),
          projectService.getAll(),
          equipmentService.getAll(),
          penaltyService.getAll(),
        ]);

        setStats({
          clients: clients.status === 'fulfilled' ? clients.value?.length || 0 : 0,
          members: members.status === 'fulfilled' ? members.value?.length || 0 : 0,
          projects: projects.status === 'fulfilled' ? projects.value?.length || 0 : 0,
          equipment: equipment.status === 'fulfilled' ? equipment.value?.length || 0 : 0,
          penalties: penalties.status === 'fulfilled' ? penalties.value?.length || 0 : 0,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.clients,
      description: 'Clientes cadastrados',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total de Membros',
      value: stats.members,
      description: 'Membros da equipe',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Projetos Ativos',
      value: stats.projects,
      description: 'Projetos em andamento',
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Equipamentos',
      value: stats.equipment,
      description: 'Equipamentos disponíveis',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Penalidades',
      value: stats.penalties,
      description: 'Penalidades registradas',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema Zeus</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo cliente cadastrado</p>
                  <p className="text-xs text-gray-500">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Projeto atualizado</p>
                  <p className="text-xs text-gray-500">Há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Equipamento adicionado</p>
                  <p className="text-xs text-gray-500">Há 6 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Estatísticas Rápidas
            </CardTitle>
            <CardDescription>
              Resumo dos dados principais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Projetos Ativos</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilização de Equipamentos</span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfação dos Clientes</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar/Schedule Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Agenda de Hoje
          </CardTitle>
          <CardDescription>
            Compromissos e tarefas programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-semibold">09:00</div>
              <div className="flex-1">
                <p className="font-medium">Reunião com cliente</p>
                <p className="text-sm text-gray-600">Discussão sobre novo projeto</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="text-green-600 font-semibold">14:00</div>
              <div className="flex-1">
                <p className="font-medium">Revisão de equipamentos</p>
                <p className="text-sm text-gray-600">Manutenção preventiva</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-semibold">16:30</div>
              <div className="flex-1">
                <p className="font-medium">Entrega de projeto</p>
                <p className="text-sm text-gray-600">Finalização do projeto Alpha</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

