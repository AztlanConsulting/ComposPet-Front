import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import Icon from './components/atoms/Icon';
import Button from './components/atoms/Button';
import InputComponent from './components/molecules/InputComponent';
import Image from './components/atoms/Image';

import PersonImg from './public/img/person.png';
import AniluImg from './public/img/Anilu.png';

import Dashboard from './components/Dashboard';
import ProductCard from './components/molecules/ProductCard';

function Home() {
    const navigate = useNavigate();

    const login = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        console.log("Access Token para Gmail:", tokenResponse.access_token);
        localStorage.setItem('accessToken', tokenResponse.access_token);
        
        try {
          const res = await axios.post('http://localhost:8080/user/auth/google', {
            token: tokenResponse.access_token 
          });

          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/dashboard');
        } catch (error) {
          console.error("Error al conectar", error);
        }
      },
      scope: "https://www.googleapis.com/auth/gmail.send", 
    });

    return (
        <div className='container'>
            <div className='row'>
                
                <div className='col d-flex flex-column align-items-center flex-wrap'>
                  <h5>Iniciar Sesión con Gmail</h5>
                  <button onClick={() => login()} className="button-google">
                    Conectar con Google y Gmail
                  </button>
                
                </div>

                <div className='col d-flex flex-column align-items-center flex-wrap'>
                    <Button size='extra-lg' type='info' className='button'>Extra grande</Button>
                    <Button size='large' type='accept' className='button'>Grande</Button>
                    <Button size='medium' type='login' className='button'>Mediano</Button>
                    <Button size='small' type='cancel' className='button'>Pequeño</Button>
                    <Button size='mini' type='warning' className='button'>Eliminar</Button>
                    <Button size='mini' type='plus-min' className='button'>
                        <Icon name="plus" size="small" color="primary" />
                    </Button>
                    <Button size='mini' type='plus-min' className='button'>
                        <Icon name="minus" size="small" color="primary" />
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

            </div>

            <div className='row'>

                <ProductCard></ProductCard>

            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;