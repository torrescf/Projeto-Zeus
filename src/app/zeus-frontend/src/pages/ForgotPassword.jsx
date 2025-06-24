import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (userType === 'client') {
        await authService.forgotPasswordClient(email);
      } else {
        await authService.forgotPassword(email);
      }
      toast.success('E-mail de redefinição enviado!');
      navigate('/login');
    } catch {
      setError('Erro ao enviar e-mail de redefinição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Redefinir Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <label className="block mb-1 text-sm font-medium">Tipo de usuário</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={userType}
                onChange={e => setUserType(e.target.value)}
              >
                <option value="member">Membro</option>
                <option value="client">Cliente</option>
              </select>
            </div>
            <Input
              name="email"
              placeholder="Seu e-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de redefinição'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
