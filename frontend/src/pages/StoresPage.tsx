import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreService } from '../services/store.service';
import { AuthService } from '../services/auth.service'; 

export const StoresPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !location.trim()) return;

    setLoading(true);

    try {
      await StoreService.create({ name, location });
      
      alert('Магазин успешно создан!');
      setName('');
      setLocation('');
      
    } catch (err: any) {
      const message = err.response?.data?.message || 'Не удалось создать магазин';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
    } finally {
      navigate('/auth');
    }
  };

  return (
    <div className="stores-page">
      <div className="store-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Создать магазин</h2>
          <button
            onClick={handleLogout}
            className="submit-btn"
            style={{
              background: '#ef4444',
              padding: '8px 16px',
              fontSize: '0.9rem',
            }}
          >
            Выйти
          </button>
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Название магазина"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="text"
            placeholder="Город / адрес"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={loading}
            style={{ marginTop: '12px' }}
          />

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Создаём...' : 'Создать магазин'}
          </button>
        </form>
      </div>
    </div>
  );
};