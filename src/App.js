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
import SecondPage from './components/organisms/extraProductsPageForm';
import Login from './components/organisms/Login';
import LoginForm from '../src/presentation/views/auth/LoginView';
import ProtectedRoute from './components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import YesNoQuestion from './components/molecules/YesNoQuestion';
import CounterInput from '../src/components/molecules/counterInput';
import FormCard from './components/Template/formCard';
import ProgressBarLogic from './components/molecules/ProgressBarLogic';
import Navbar from './components/molecules/Navbar';

import SolicitudView from './presentation/views/solicitudes/solicitudView';


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

    /**
     * Callback ejecutado tras un inicio de sesión exitoso con Google.
     * * Realiza la sincronización con el backend para obtener un JWT de sesión
     * y persiste ambos tokens en el almacenamiento local.
     * * @async
     * @param {Object} tokenResponse - Respuesta del SDK de Google.
     * @param {string} tokenResponse.access_token - Token de portador (Bearer) de Google.
     * @returns {void} Redirige al usuario a la ruta '/dashboard'.
     */
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            localStorage.setItem('accessToken', tokenResponse.access_token);
            
            try {
                const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/auth/google`, {
                    token: tokenResponse.access_token 
                });

                localStorage.setItem('userToken', res.data.token);
                localStorage.setItem('accessToken', tokenResponse.access_token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            } catch (error) {
                console.error("Error al conectar", error);
            }
        },
        scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/spreadsheets"
    });

    return (
        <div>
            <Navbar />
            <div className='container'>
                <div className='row'>

                    <div className='col d-flex flex-column align-items-center flex-wrap'>
                        <h5>Iniciar Sesión con Gmail</h5>
                        <button onClick={() => login()} className="button-google">
                            Conectar con Google y Gmail
                        </button>
                    </div>

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
                            <Icon name="minus" csssize="icon-small" color="primary" />
                        </Button>
                    </div>

                    <div className='col d-flex flex-column align-items-center flex-wrap'>
                        <Icon name="plus" size="icon-large" color="primary" />
                        <Icon name="minus" size="icon-large" color="primary" />
                        <Icon name="arrow" size="icon-large" color="primary" />
                        <Icon name="bills" size="icon-large" color="primary" />
                        <Icon name="card" size="icon-large" color="primary" />
                        <Icon name="copy" size="icon-large" color="primary" />
                        <Icon name="facebook" size="icon-large" color="primary" />
                        <Icon name="google" size="icon-large" color="primary" />
                        <Icon name="instagram" size="icon-large" color="primary" />
                        <Icon name="logo" size="icon-large" color="primary" />
                        <Icon name="piggy" size="icon-large" color="primary" />
                        <Icon name="search" size="icon-large" color="primary" />
                        <Icon name="tiktok" size="icon-large" color="primary" />
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

                </div>



            </div>
        </div>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }/>

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }/>
                    <Route path="/formulario-recoleccion" 
                    element={
                        <ProtectedRoute>
                            <SolicitudView />
                        </ProtectedRoute>
                    }/>

                    <Route path="/formulario-recoleccion/extraProductos" element={
                        <ProtectedRoute>
                           <SecondPage />
                        </ProtectedRoute>
                    }/>
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;