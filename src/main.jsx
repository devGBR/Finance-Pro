import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '../src/components/toats/toast.scss'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';  // Correção na importação
import { ToastContainer } from 'react-toastify'; // Importando o ToastContainer


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer // Adicione o ToastContainer aqui
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick
      draggable
      pauseOnHover
    />
  </StrictMode>
);
