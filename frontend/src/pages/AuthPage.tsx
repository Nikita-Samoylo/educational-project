import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service'; 
export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await AuthService.login({ email, password });
        
        alert('Вход выполнен!');
        navigate('/');
      } else {
        await AuthService.register({
          email,
          password,
          name,
          position
        });

        alert('Регистрация успешна! Теперь войдите.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'Произошла ошибка';
      setError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          {!isLogin && (
            <>
              <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="text" placeholder="Должность" value={position} onChange={(e) => setPosition(e.target.value)} required />
            </>
          )}
          
          <button type="submit" className="submit-btn">{isLogin ? 'Войти' : 'Создать аккаунт'}</button>
        </form>

        <div className="toggle-mode">
          {isLogin ? (
            <p>
              Нет аккаунта?{' '}
              <span onClick={() => setIsLogin(false)}>Зарегистрироваться</span>
            </p>
          ) : (
            <p>
              Уже есть аккаунт?{' '}
              <span onClick={() => setIsLogin(true)}>Войти</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};