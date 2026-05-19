import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {useState} from 'react';

import Icon from './components/atoms/Icon';
import Button from './components/atoms/Button';
import InputComponent from './components/molecules/InputComponent';
import Image from './components/atoms/Image';

import PersonImg from './public/img/person.png';
import AniluImg from './public/img/Anilu.png';

import Dashboard from './components/Dashboard';
import ProductCard from './components/molecules/ProductCard';
import SecondPage from './components/organisms/secondPageForm';
import Login from './components/organisms/Login';
import LoginForm from '../src/presentation/views/auth/LoginView';
import ProtectedRoute from './utilities/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import YesNoQuestion from './components/molecules/YesNoQuestion';
import CounterInput from '../src/components/molecules/counterInput';
import FormCard from './components/Template/formCard';
import ProgressBarLogic from './components/molecules/ProgressBarLogic';
import Navbar from './components/molecules/Navbar';
import RoutesInfo from '../src/presentation/views/routesInfo/routesInfo';
import DropdownInput from './components/molecules/DropdownInput';

import RegisterClient from './presentation/views/admin/RegisterClient';

import CollectionRequestView from './presentation/views/collectionRequest/collectionRequest';
import ClientTable from './presentation/views/clientTableView';

import FirstLoginView from './presentation/views/auth/FirstLoginView';
import ProblemAlert from './components/Template/ProblemAlert';
import UnauthorizedPage from './presentation/views/UnauthorizedPage';
import CopyLink from './components/molecules/CopyLink';
import CountersGroup from './components/molecules/CountersGroup';
import BalanceCountersGroup from './components/organisms/BalanceCountersGroup';

function Home() {
    const navigate = useNavigate();

    const [siquiereRecoleccion, setQuiereRecoleccion] = useState(true);
    const [cubetasEntregadas, setCubetasEntregadas] = useState(5);

    const currentStep = 3;
    const totalSteps = 5;
    

    const errors = {
        quiereRecoleccion: '',
        cubetasEntregadas: '',
    };

    const [municipio, setMunicipio] = useState('');

    return (
        <div>
            <Navbar />
            <div className='container'>
                <div className='row'>


                <div className='col d-flex flex-column align-items-center flex-wrap'>
                    <Button size='extra-lg' csstype='info' className='button'>Extra grande</Button>
                    <Button size='large' csstype='accept' className='button'>Grande</Button>
                    <Button size='medium' csstype='login' className='button'>Mediano</Button>
                    <Button size='small' csstype='cancel' className='button'>Pequeño</Button>
                    <Button size='mini' csstype='warning' className='button'>Eliminar</Button>
                    <Button size='mini' csstype='plus-min' className='button'>
                        <Icon name="plus" csssize="small" color="primary" />
                    </Button>
                    <Button size='mini' csstype='plus-min' className='button'>
                        <Icon name="minus" csssize="small" color="primary" />
                    </Button>
                </div>

                <div className='col d-flex flex-column align-items-center flex-wrap'>
                    <Icon name="plus" size="large" color="primary" />
                    <Icon name="minus" size="large" color="primary" />
                    <Icon name="arrow" size="large" color="primary" />
                    <Icon name="bills" size="large" color="primary" />
                    <Icon name="card" size="large" color="primary" />
                    <Icon name="copy" size="large" color="primary" />
                    <Icon name="facebook" size="large" color="primary" />
                    <Icon name="google" size="large" color="primary" />
                    <Icon name="instagram" size="large" color="primary" />
                    <Icon name="logo" size="large" color="primary" />
                    <Icon name="piggy" size="large" color="primary" />
                    <Icon name="search" size="large" color="primary" />
                    <Icon name="tiktok" size="large" color="primary" />
                </div>

                <div className='col d-flex flex-column align-items-center flex-wrap'>
                    <Image src={PersonImg} alt='Foto de perfil' size='image-large' variant='circle'></Image>
                    <Image src={AniluImg} alt='Foto de Anilu' size='image-xl' variant='square'></Image>
                </div>

                <div className='col d-flex flex-column align-items-center flex-wrap'>
                    <InputComponent
                        id="nombre"
                        type="text"
                        size="md"
                        placeholder=""
                        classNameLabel="label"
                        classNameInput="input"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        Usuario
                    </InputComponent>

                </div>

                <div className='col d-flex flex-column align-items-center flex-wrap'>
                    <ProductCard></ProductCard>

                    <CopyLink
                        text="Link del formulario de recolección"
                        link="Texto de prueba para copiar al portapapeles"
                        bubbleMessage="¡Copiado!"
                    />

                    <Login></Login>
                </div>

                <div>
                    <YesNoQuestion
                        id="quiere-recoleccion"
                        question="¿Quieres recolección?"
                        value={siquiereRecoleccion}
                        onChange={setQuiereRecoleccion}
                        error={errors.quiereRecoleccion}
                    />
                </div>

                <div className='col-12 d-flex flex-column align-items-center flex-wrap mt-4'>

                    <div>
                        <YesNoQuestion
                            id="quiere-recoleccion"
                            question="¿Quieres recolección?"
                            value={siquiereRecoleccion}
                            onChange={setQuiereRecoleccion}
                            error={errors.quiereRecoleccion}
                        />
                    </div>

                    <div className='col d-flex flex-column align-items-center flex-wrap'>
                        <CounterInput
                            question="¿Cuántas cubetas vacías quieres?"
                            value={cubetasEntregadas}
                            onIncrement={() => setCubetasEntregadas((prev) => prev + 1)}
                            onDecrement={() => setCubetasEntregadas((prev) => Math.max(0, prev - 1))}
                            error={errors.cubetasEntregadas}
                        />
                    </div>

                    <div className='col-12 d-flex flex-column align-items-center flex-wrap mt-4'>
                        <h4>Preview ProgressSection</h4>

                        <div style={{ width: '100%', maxWidth: '40rem' }}>
                            <ProgressBarLogic currentStep={currentStep} totalSteps={totalSteps} />
                        </div>
                    </div>

                    <div className='col-12 d-flex justify-content-center mt-4'>
                        <FormCard>
                            <p style={{ margin: 0 }}>Preview de FormCard</p>
                        </FormCard>
                    </div>
                    
                    <div className='col-12 d-flex justify-content-center mt-4'>

                        <DropdownInput
                            id="municipio"
                            size="md"
                            value={municipio}
                            onChange={(e) => setMunicipio(e.target.value)}
                            options={[
                                { value: "corregidora", label: "Corregidora" },
                                { value: "queretaro", label: "Querétaro" },
                                { value: "marques", label: "El Marqués" },
                            ]}
                        >
                            Municipio
                        </DropdownInput>
                    </div>
                    <div>
                    <CountersGroup 
                        counters={[
                            { label: "Total de Familias", value: 50 },
                            { label: "Familias por ruta", value: 25 },
                        ]}
                    />

                    <BalanceCountersGroup
                        routeCounter={{
                            title: 'Saldo total de ruta',
                            favorSubtitle: 'Saldo a favor',
                            favorBalance: '$361',

                            pendingSubtitle: 'Saldo pendiente',
                            pendingBalance: '- $147',
                        }}

                        totalCounter={{
                            title: 'Saldo total',
                            favorSubtitle: 'Saldo a favor',
                            favorBalance: '$361',

                            pendingSubtitle: 'Saldo pendiente',
                            pendingBalance: '- $147',
                        }}
                    />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Router>
                <Routes>
                    
                    <Route path="/error" element={<UnauthorizedPage/>} />
                    <Route path="/inicio-sesion" element={<LoginForm />} />
                    <Route path="/activar-cuenta" element={<FirstLoginView isRecovery={false} />} />
                    <Route path="/recuperar-contraseña" element={<FirstLoginView isRecovery={true} />} />

                    {/* Rutas para usuarios autenticados */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tabla-clientes" element={<ClientTable />} />
                        <Route path="/admin/registrar-cliente" element={<RegisterClient />} />
                    </Route>

                    {/* Rutas de administrador - Protegidas por Rol */}
                    <Route element={<ProtectedRoute roles={["Administrador"]} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tabla-clientes" element={<ClientTable />} />
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