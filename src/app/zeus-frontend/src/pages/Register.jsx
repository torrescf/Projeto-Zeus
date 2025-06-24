import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [activeTab, setActiveTab] = useState('client');
  const [formData, setFormData] = useState({
    name: '',
    nomeCompleto: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    skills: '',
    data_nascimento: '',
    role: 'client',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError('');
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setFormData({
      ...formData,
      role: value === 'client' ? 'client' : 'member',
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const isClient = activeTab === 'client';
      const userData = {
        ...(isClient ? { name: formData.name } : { nomeCompleto: formData.nomeCompleto }),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        skills: formData.skills,
        data_nascimento: formData.data_nascimento,
        role: formData.role,
      };

      const result = await register(userData, isClient);
      
      if (result.success) {
        toast.success('Registro realizado com sucesso!');
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Zeus Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Criar nova conta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrar-se</CardTitle>
            <CardDescription>
              Escolha o tipo de conta e preencha os dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Cliente</TabsTrigger>
                <TabsTrigger value="member">Membro</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="client" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="member" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeCompleto">Nome Completo</Label>
                    <Input
                      id="nomeCompleto"
                      name="nomeCompleto"
                      type="text"
                      required
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                </TabsContent>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    name="data_nascimento"
                    type="date"
                    required
                    value={formData.data_nascimento}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Habilidades</Label>
                  <Input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Ex: React, Node.js, Python"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Sua senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirme sua senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Registrar'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Faça login aqui
                    </Link>
                  </p>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;

