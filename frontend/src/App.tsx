import { Routes, Route } from 'react-router-dom'; 
import { AuthPage } from './pages/AuthPage';
import { StoresPage } from './pages/StoresPage'; 

function App() {
  return (
    <div className="app-wrapper">
      <div className="content-wrap">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<StoresPage />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;