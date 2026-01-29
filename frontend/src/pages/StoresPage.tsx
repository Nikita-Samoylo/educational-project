import React, { useEffect, useState } from 'react';
import { instance } from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Store {
  id: string;
  name: string;
  location: string;
}

export const StoresPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const fetchStores = async () => {
    try {
      const response = await instance.get('/stores');
      setStores(response.data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      navigate('/auth');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await instance.post('/stores', { name, location });
      setName('');
      setLocation('');
      fetchStores();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Ошибка при создании';
      setError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.post('/auth/logout');
      navigate('/auth');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Список магазинов</h2>
          <button onClick={handleLogout}
            className="submit-btn"
            style={{ background: '#ef4444', width: 'auto', marginTop: 0, padding: '8px 16px', fontSize: '0.9rem' }}>
            Выйти
          </button>
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleCreate} className="auth-form">
          <h3 style={{ textAlign: 'left', margin: 0, fontSize: '1.1rem' }}>Добавить магазин</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 1 }} />
            <input type="text" placeholder="Локация" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ flex: 1 }} />
          </div>
          <button type="submit" className="submit-btn">Создать</button>
        </form>
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          {stores.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Магазинов пока нет...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stores.map((store) => (
                <div key={store.id} style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  background: '#f9fafb'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{store.name}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>📍 {store.location}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};