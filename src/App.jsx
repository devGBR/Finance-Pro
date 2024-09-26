import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './views/Home/Home';
import Entry from './views/Entry/Entry';
import Exit from './views/Exit/Exit';
import Settings from './views/Settings/Settings';
// importe outras páginas conforme necessário

export default function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/entradas' element={<Entry/>}/>
                    <Route path='/saida' element={<Exit/>}/>
                    <Route path='/config' element={<Settings/>}/>
                </Routes>
            </Layout>
        </Router>
    );
}