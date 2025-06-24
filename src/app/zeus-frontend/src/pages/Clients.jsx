import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Calendar, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { clientService } from '../services/api';
import PhotoUpload from '../components/PhotoUpload';
import toast from 'react-hot-toast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    data_nascimento: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await clientService.update(selectedClient.id, formData);
      toast.success('Cliente atualizado com sucesso!');
      setIsEditModalOpen(false);
      setSelectedClient(null);
      setFormData({ name: '', email: '', phone: '', data_nascimento: '' });
      fetchClients();
    } catch (error) {
      toast.error('Erro ao atualizar cliente');
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientService.delete(id);
        toast.success('Cliente excluído com sucesso!');
        fetchClients();
      } catch (error) {
        toast.error('Erro ao excluir cliente');
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handlePhotoUpload = async (clientId, file) => {
    setUploadingPhoto(true);
    try {
      await clientService.uploadPhoto(clientId, file);
      toast.success('Foto atualizada com sucesso!');
      fetchClients(); // Recarrega a lista para mostrar a nova foto
    } catch (error) {
      toast.error('Erro ao fazer upload da foto');
      console.error('Erro ao fazer upload da foto:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      data_nascimento: client.data_nascimento ? new Date(client.data_nascimento).toISOString().split('T')[0] : ''
    });
    setIsEditModalOpen(true);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie informações dos clientes</p>
        </div>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Tente ajustar os termos de busca.' : 'Nenhum cliente cadastrado ainda.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Foto do Cliente */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        {client.photoUrl ? (
                          <img
                            src={client.photoUrl}
                            alt={client.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      
                      {/* Botão de upload de foto */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors">
                            <Camera size={12} />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Atualizar Foto do Cliente</DialogTitle>
                          </DialogHeader>
                          <PhotoUpload
                            currentPhoto={client.photoUrl}
                            onUpload={(file) => handlePhotoUpload(client.id, file)}
                            isLoading={uploadingPhoto}
                            size="lg"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Informações do Cliente */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{client.name}</h3>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{client.email}</span>
                          </div>
                          
                          {client.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                          
                          {client.data_nascimento && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {new Date(client.data_nascimento).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Projetos do cliente */}
                        {client.projects && client.projects.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-500">
                              {client.projects.length} projeto(s)
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-data_nascimento">Data de Nascimento</Label>
              <Input
                id="edit-data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
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

export default Clients;

