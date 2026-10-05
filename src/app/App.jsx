import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { bootstrapAuth } from '../states/auth/thunks';
import AppLayout from '../components/AppLayout';
import ThreadsPage from '../pages/ThreadsPage';
import ThreadDetailPage from '../pages/ThreadDetailPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NewThreadPage from '../pages/NewThreadPage';
import RequireAuth from '../components/RequireAuth';
import '../styles/layout.css';
import '../styles/forum.css';
import '../styles/forms.css';

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(bootstrapAuth()); }, [dispatch]);
  return <BrowserRouter><Routes><Route element={<AppLayout />}><Route path="/" element={<ThreadsPage />} /><Route path="/threads/new" element={<RequireAuth><NewThreadPage /></RequireAuth>} /><Route path="/threads/:threadId" element={<ThreadDetailPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></BrowserRouter>;
}
