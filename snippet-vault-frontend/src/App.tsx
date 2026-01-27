import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateSnippet from './pages/CreateSnippet';
import EditSnippet from './pages/EditSnippet';
import SnippetDetail from './pages/SnippetDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="snippets/:id" element={<SnippetDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="create" element={<CreateSnippet />} />
              <Route path="snippets/:id/edit" element={<EditSnippet />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;