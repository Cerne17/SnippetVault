import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader2 } from 'lucide-react';
import type { LoginDto } from '../types/auth';
import { useState } from 'react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h1 className="text-3xl font-black text-center mb-2 text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">Continue your curation journey.</p>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
              Email
            </label>
            <Input
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="you@example.com"
              className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            {errors.email && (
              <p className="mt-1 text-xs font-bold text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
              Password
            </label>
            <Input
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="••••••••"
              className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            {errors.password && (
              <p className="mt-1 text-xs font-bold text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              'Login'
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
