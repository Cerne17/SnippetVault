import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateSnippet from './pages/CreateSnippet';
import SnippetDetail from './pages/SnippetDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="snippets/:id" element={<SnippetDetail />} />
            <Route path="create" element={<CreateSnippet />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;