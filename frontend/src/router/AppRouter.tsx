import { Routes, Route } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { StoresPage } from '../pages/StoresPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<StoresPage />} />
    </Routes>
  );
};