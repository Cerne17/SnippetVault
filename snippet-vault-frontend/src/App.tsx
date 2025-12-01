import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateSnippet from './pages/CreateSnippet';
import SnippetDetail from './pages/SnippetDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="create" element={<CreateSnippet />} />
        <Route path="snippets/:id" element={<SnippetDetail />} />
      </Route>
    </Routes>
  );
}