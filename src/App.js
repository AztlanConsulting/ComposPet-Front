import React from 'react';
import './App.css';
<<<<<<< bugfix/auth
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {useState} from 'react';

import Icon from './components/atoms/Icon';
import Button from './components/atoms/Button';
import InputComponent from './components/molecules/InputComponent';
import Image from './components/atoms/Image';

import PersonImg from './public/img/person.png';
import AniluImg from './public/img/Anilu.png';
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
>>>>>>> develop

import Dashboard from './components/Dashboard';
import LoginForm from '../src/presentation/views/auth/LoginView';
import ProtectedRoute from './utilities/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import RoutesInfo from '../src/presentation/views/routesInfo/routesInfo';

import RegisterClient from './presentation/views/admin/RegisterClient';

import CollectionRequestView from './presentation/views/collectionRequest/collectionRequest';
import ClientInfo from './presentation/views/clientInfoView';

import FirstLoginView from './presentation/views/auth/FirstLoginView';
import UnauthorizedPage from './presentation/views/UnauthorizedPage';
import ComponentMock from './components/componentMock';

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Router>
                <Routes>
                    
                    <Route path="/error" element={<UnauthorizedPage/>} />
                    <Route path="/inicio-sesion" element={<LoginForm />} />
                    <Route path="/activar-cuenta" element={<FirstLoginView isRecovery={false} />} />
                    <Route path="/recuperar-contraseña" element={<FirstLoginView isRecovery={true} />} />

                    <Route path="/componentMock" element={<ComponentMock/>} />

                    {/* Rutas para usuarios autenticados */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tabla-clientes" element={<ClientInfo />} />
                        <Route path="/admin/registrar-cliente" element={<RegisterClient />} />
                    </Route>

                    {/* Rutas de administrador - Protegidas por Rol */}
                    <Route element={<ProtectedRoute roles={["Administrador"]} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tabla-clientes" element={<ClientInfo />} />
                        <Route path="/registrar-cliente" element={<RegisterClient />} />
                        <Route path="/ruta" element={<RoutesInfo />} />
                    </Route>

                    {/* Rutas de clientes - Protegidas por Rol */}
                    <Route element={<ProtectedRoute roles={["Cliente"]} />}> 
                        <Route path="/formulario-recoleccion" element={<CollectionRequestView />} />
                    </Route>

                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;