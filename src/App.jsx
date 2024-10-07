import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './views/Home/Home';
import Entry from './views/Entry/Entry';
import Exit from './views/Exit/Exit';
import Settings from './views/Settings/Settings';
import Login from './views/Login';
import ProtectedRoute from './ProtectedRoute'; // Importar o componente de proteção de rotas

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route
                    path='/'
                    element={
                        <ProtectedRoute>
                            <Layout>
                               
                                <Home />
                            </Layout>

                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/entradas'
                    element={
                        <ProtectedRoute>
                            <Entry />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/saida'
                    element={
                        <ProtectedRoute>
                            <Exit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/config'
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <title>Finance Pro | Configs</title>
                                <Settings />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router >
    );
}
