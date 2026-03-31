import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './atoms/Button';
import InputComponent from './molecules/InputComponent';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // Estados de control de la información de sheets
    const [sheetsValues, setSheetsValues] = React.useState({
        numero: '',
        texto: ''
    });
    const [sheetsData, setSheetsData] = React.useState([]);

    /**
     * Manejador del evento para enviar correos desde la interfaz.
     * * Recupera el 'userToken' (sesión) y el 'accessToken' (Google) del localStorage
     * para realizar la petición POST al backend.
     * * @async
     * @function handleSendEmail
     * @returns {void} Muestra una alerta con el resultado de la operación.
     */
    const handleSendEmail = async () => {
        const sessionToken = localStorage.getItem('userToken'); // El JWT de tu server (para el portero/middleware)
        const googleToken = localStorage.getItem('accessToken');
        
        try {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/user/send-email`, 
                {
                    // Solo datos del correo
                    to: user.email, 
                    subject: "Reporte de Composta",
                    message: "¡Hola! Enviado correctamente."
                },
                {
                    // La llave con el prefijo Bearer
                    headers: {
                        // Llave 1: Para tu portero (Middleware)
                        'Authorization': `Bearer ${sessionToken}`,
                        // Llave 2: Para la API de Google (Header personalizado)
                        'x-google-token': googleToken 
                    }
                }
            );
            alert("¡Correo enviado con éxito!");
        } catch (error) {
            console.error("Error al enviar", error);
            alert("Error al enviar el correo");
        }
    };

    // Función para mandar los datos del form al backend
    const sheets = async (e) => {
        e.preventDefault();

        const sessionToken = localStorage.getItem('userToken'); 
        const googleToken = localStorage.getItem('accessToken');

        try {
            // Mandamos el nuevo registro
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/user/sheets`,
                {
                    numero: sheetsValues.numero,
                    texto: sheetsValues.texto,
                },
                {
                    headers: {
                        // Llave 1: Para tu portero (Middleware)
                        'Authorization': `Bearer ${sessionToken}`,
                        // Llave 2: Para la API de Google (Header personalizado)
                        'x-google-token': googleToken 
                    }
                }
            );
            
            // Actualizamos el estado de la información recuperada
            setSheetsData([response.data.data])
            console.log(response.data.data)

        } catch (error) {
            console.log("Error al conectarse a Google Sheets ", error);
        } 
    }

    return (
        <div style={{ padding: '40px' }}>
            <h1>Panel de Control - Compospet</h1>
            <button 
                onClick={handleSendEmail}
                style={{ backgroundColor: '#4CAF50', color: 'white', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
            >
                📧 Enviar Notificación por Correo
            </button>

                <div className='col d-flex flex-column align-items-center flex-wrap'>
                  <h5>Google Sheets</h5>

                    <div>

                        {/*Form para mandar datos a una hoja de Google Sheets*/}
                        <form onSubmit={sheets}>
                            <InputComponent
                                id='numero'
                                type='number'
                                size='md'
                                placeholder='number'
                                classNameLabel='label'
                                classNameInput='input'
                                value={sheetsValues.numero}
                                onChange={(e) => setSheetsValues({
                                    ...sheetsValues,
                                    numero: e.target.value
                                })}
                            >
                                Número
                            </InputComponent>

                            <InputComponent
                                id='text'
                                type='text'
                                size='md'
                                placeholder='text'
                                classNameLabel='label'
                                classNameInput='input'
                                value={sheetsValues.texto}
                                onChange={(e) => setSheetsValues({
                                    ...sheetsValues,
                                    texto: e.target.value
                                })}
                            >
                                Text
                                
                            </InputComponent>

                            <Button size='medium' type='submit' className='button' >Submit</Button>
                            
                        </form>

                    </div>
                  
                  {/* Elemento para visualizar la información del sheets */}
                    <div>
                        { sheetsData.length > 0 ? sheetsData[0].map((cell) => {
                            return (
                                <div>
                                    {cell[0] + " , " + cell[1]}
                                </div>
                            );
                        }) : <></>}
                    </div>

                </div>

        </div>

    );
};

export default Dashboard;