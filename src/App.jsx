import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurriculumProvider } from './context/CurriculumContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurriculumProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </CurriculumProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
