import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ThreadsPage from '../pages/ThreadsPage';
import ThreadDetailPage from '../pages/ThreadDetailPage';
import NotFoundPage from '../pages/NotFoundPage';
import '../styles/layout.css';
import '../styles/forum.css';

export default function App() {
  return <BrowserRouter><Routes><Route element={<AppLayout />}><Route path="/" element={<ThreadsPage />} /><Route path="/threads/:threadId" element={<ThreadDetailPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></BrowserRouter>;
}
