'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../app/hooks/useAuth';
import Toast from '../Toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha obrigatória'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        setToastType('success');
        setToastMessage('Registro realizado com sucesso!');
      } else {
        setToastType('error');
        setToastMessage(result.message || 'Erro no registro');
      }
    } catch (error: any) {
      setToastType('error');
      setToastMessage(error.message || 'Erro inesperado');
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px) translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px) translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
        }
        
        @keyframes bounceIn {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .form-field-register {
          animation: slideInFromTop 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .form-field-register:nth-child(1) { 
          animation-name: slideInFromTop;
          animation-delay: 0.1s; 
        }
        .form-field-register:nth-child(2) { 
          animation-name: slideInFromLeft;
          animation-delay: 0.2s; 
        }
        .form-field-register:nth-child(3) { 
          animation-name: slideInFromRight;
          animation-delay: 0.3s; 
        }
        .form-field-register:nth-child(4) { 
          animation-name: slideInFromBottom;
          animation-delay: 0.4s; 
        }
        .form-field-register:nth-child(5) { 
          animation-name: bounceIn;
          animation-delay: 0.5s; 
        }
      `}</style>
      
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          type={toastType}
        />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 select-none">
        <div className="form-field-register opacity-0">
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1 select-none">
              Nome
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full p-2 mt-1 border-1 border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 select-text transform transition-all duration-300 hover:scale-105 focus:scale-105 ${
                errors.name ? 'border-red-500' : 'border-gray-400'
              }`}
              placeholder="Digite seu nome"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1 select-none">{errors.name.message}</p>}
          </div>

          <div className="form-field-register opacity-0">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1 select-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full p-2 mt-1 border-1 border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 select-text transform transition-all duration-300 hover:scale-105 focus:scale-105 ${
                errors.email ? 'border-red-500' : 'border-gray-400'
              }`}
              placeholder="Digite seu e-mail"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1 select-none">{errors.email.message}</p>}
          </div>

          <div className="form-field-register opacity-0">
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1 select-none">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full p-2 mt-1 border-1 border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 select-text transform transition-all duration-300 hover:scale-105 focus:scale-105 ${
                errors.password ? 'border-red-500' : 'border-gray-400'
              }`}
              placeholder="Digite sua senha"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1 select-none">{errors.password.message}</p>}
          </div>

          <div className="form-field-register opacity-0">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1 select-none">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`w-full p-2 mt-1 border-1 border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 select-text transform transition-all duration-300 hover:scale-105 focus:scale-105 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-400'
              }`}
              placeholder="Confirme sua senha"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1 select-none">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="form-field-register opacity-0">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4 select-none transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar-se'}
            </button>
          </div>
        </form>
    </>
  );
}