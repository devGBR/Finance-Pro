import React from 'react';
import { Navigate} from 'react-router-dom';
import Cookies from 'universal-cookie';

const ProtectedRoute = ({ children }) => {
    const cookies = new Cookies();
    const isAuthenticated = !!cookies.get('api_token'); // Verifica se o cookie do token existe
    if (!isAuthenticated) {
        return(<Navigate push={true} to='/login' />)
    }

    // Se estiver autenticado, renderiza os filhos
    return children;
};

export default ProtectedRoute;
