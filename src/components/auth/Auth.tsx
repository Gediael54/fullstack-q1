'use client';
import { useState, useEffect, useRef } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      let targetWidth, targetHeight;
      
      if (isMobile) {
        targetWidth = Math.min(window.innerWidth - 32, 400);
        targetHeight = isRegister ? 640 : 560;
      } else if (isTablet) {
        targetWidth = isRegister ? 720 : 640;
        targetHeight = isRegister ? 520 : 480;
      } else {
        targetWidth = isRegister ? 896 : 768;
        targetHeight = isRegister ? 580 : 520;
      }
      
      setDimensions({ width: targetWidth, height: targetHeight });
    };

    calculateDimensions();
    
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateDimensions, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isRegister]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-2 sm:p-4 lg:p-8">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.4s ease-out forwards;
        }
        
        .form-field {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        
        .form-field:nth-child(1) { animation-delay: 0.1s; }
        .form-field:nth-child(2) { animation-delay: 0.2s; }
        .form-field:nth-child(3) { animation-delay: 0.3s; }
        .form-field:nth-child(4) { animation-delay: 0.4s; }
        .form-field:nth-child(5) { animation-delay: 0.5s; }
        
        .container-main {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: width, height;
          transform-origin: center center;
        }
        
        .image-container {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, opacity;
          transform-origin: center center;
        }
        
        .text-container {
          transition: all 0.3s ease-out;
          min-height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .form-container {
          transition: all 0.5s ease-in-out;
        }
        
        /* Garantir que o container mantenha proporções */
        .container-main {
          overflow: hidden;
          position: relative;
        }
        
        /* Suavizar mudanças de layout */
        .container-main * {
          transition: inherit;
        }
        
        /* Responsividade aprimorada */
        @media (max-width: 767px) {
          .container-main {
            width: 100% !important;
            max-width: calc(100vw - 1rem) !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .container-main {
            max-width: 90vw !important;
          }
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className="bg-gray-100 rounded-xl sm:rounded-2xl shadow-xl flex flex-col md:flex-row container-main"
        style={{
          width: `${dimensions.width}px`,
          minHeight: `${dimensions.height}px`,
          maxWidth: '100%'
        }}
      >
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-gray-100 form-container">
          <div className="flex justify-center mb-4 sm:mb-6 select-none">
            <img
              src="/login-logo.png"
              alt="Logo"
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain pointer-events-none"
            />
          </div>
         
          <div className="text-container">
            <h2 className="text-center text-sm sm:text-base md:text-lg text-gray-500 mb-4 sm:mb-6 px-2 select-none animate-fadeInDown">
              {isRegister ? 'Crie sua conta gratuita!' : 'Bem-vindo de volta! Insira seus dados.'}
            </h2>
          </div>
         
          <div className="w-full flex-1 flex flex-col justify-center">
            <div className="form-container">
              {isRegister ? (
                <div key="register" className="animate-fadeInUp">
                  <RegisterForm />
                </div>
              ) : (
                <div key="login" className="animate-fadeInUp">
                  <LoginForm />
                </div>
              )}
            </div>
          </div>
         
          <div className="text-container">
            <p className="text-xs sm:text-sm text-center mt-4 sm:mt-6 text-gray-600 px-2 select-none">
              {isRegister ? (
                <>
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded select-none whitespace-nowrap transition-colors duration-200"
                  >
                    Entrar
                  </button>
                </>
              ) : (
                <>
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded select-none whitespace-nowrap transition-colors duration-200"
                  >
                    Cadastre-se gratuitamente!
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
       
        <div 
          className="hidden md:block w-1/2 bg-blue-100 relative bg-cover bg-center bg-no-repeat pointer-events-none select-none image-container"
          style={{ 
            backgroundImage: 'url("login-decor.png")',
            transform: `scale(${isRegister ? 1.02 : 1})`,
            opacity: isRegister ? 0.97 : 1
          }}
        >
        </div>
      </div>
    </div>
  );
}