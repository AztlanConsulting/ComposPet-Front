import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import LoginForm from '../src/presentation/views/auth/LoginView';
import ProtectedRoute from './utilities/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import RoutesInfo from '../src/presentation/views/routesInfo/routesInfo';
import TemporaryView from './components/Template/temporaryView';
import RegisterClient from './presentation/views/admin/RegisterClient';
import Inventory from './presentation/views/inventory/inventoryView';

import CollectionRequestView from './presentation/views/collectionRequest/collectionRequest';
import ClientInfo from './presentation/views/clientInfoView';

import FirstLoginView from './presentation/views/auth/FirstLoginView';
import UnauthorizedPage from './presentation/views/UnauthorizedPage';
import ComponentMock from './components/componentMock';
import Button from './components/atoms/Button';
import './css/atoms/button.css';

function AppRoutes() {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/error" element={<UnauthorizedPage />} />
            <Route path="/inicio-sesion" element={<LoginForm />} />
            <Route path="/activar-cuenta" element={<FirstLoginView isRecovery={false} />} />
            <Route path="/recuperar-contraseña" element={<FirstLoginView isRecovery={true} />} />

            <Route path="/componentMock" element={<ComponentMock />} />

            {/* Rutas de administrador - Protegidas por Rol */}
            <Route element={<ProtectedRoute roles={["Administrador"]} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tabla-clientes" element={<ClientInfo />} />
                <Route path="/registrar-cliente" element={<RegisterClient />} />
                <Route path="/ruta" element={<RoutesInfo />} />
                <Route path="/inventario" element={<Inventory />} />
            </Route>

            {/* Rutas de clientes - Protegidas por Rol */}
            <Route element={<ProtectedRoute roles={["Cliente"]} />}>
                <Route path="/formulario-recoleccion" element={<CollectionRequestView />} />

                <Route
                    path="/"
                    element={
                        <TemporaryView
                            navbarStatus={true}
                            message={
                                <div className="App">
                                    ¡Bienvenido a ComposPage!
                                    <br />
                                    <br />
                                    Gracias por ser parte de nuestra comunidad.

                                    <div className="button-form ">
                                        <Button
                                            size="medium"
                                            type="button"
                                            csstype="accept"
                                            className="button form"
                                            onClick={() =>
                                                navigate('/formulario-recoleccion')
                                            }
                                        >
                                            Formulario de recolección
                                        </Button>
                                    </div>
                                </div>
                            }
                            img={false}
                        />
                    }
                />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Router>
                <AppRoutes />
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;