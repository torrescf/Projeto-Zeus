import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { memberService } from '../services/api';
import toast from 'react-hot-toast';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = members.filter(member =>
      member.nomeCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm)
    );
    setFilteredMembers(filtered);
  }, [members, searchTerm]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await memberService.getAll();
      setMembers(data || []);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    try {
      await memberService.delete(memberToDelete.id);
      toast.success('Membro excluído com sucesso');
      fetchMembers();
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
      toast.error('Erro ao excluir membro');
    } finally {
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { label: 'Admin', variant: 'destructive' },
      member: { label: 'Membro', variant: 'default' },
    };
    
    const roleInfo = roleMap[role] || { label: role, variant: 'outline' };
    return <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>;
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membros</h1>
          <p className="text-gray-600">Gerencie os membros da equipe</p>
        </div>
        <Button asChild>
          <Link to="/register">
            <Plus className="mr-2 h-4 w-4" />
            Novo Membro
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Membros</CardTitle>
          <CardDescription>
            Encontre membros por nome, email ou telefone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum membro encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando um novo membro.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/register">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Membro
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Gênero</TableHead>
                    <TableHead>Habilidades</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <span>{member.nomeCompleto || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{member.email || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{member.phone || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(member.role)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {member.gender === 'M' ? 'Masculino' : 
                           member.gender === 'F' ? 'Feminino' : 
                           member.gender === 'O' ? 'Outro' : 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate" title={member.skills}>
                          {member.skills || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/members/${member.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/members/${member.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(member)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o membro "{memberToDelete?.nomeCompleto}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Members;

