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

    const handleSendEmail = async () => {
        const accessToken = localStorage.getItem('accessToken'); // Recuperamos la "llave"
        
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/send-email`, {
                token: accessToken,
                // temporalmente, a mi misma
                to: user.email, 
                subject: "Reporte de Composta",
                message: "¡Hola! Este correo fue enviado desde el botón del Dashboard de Compospet."
            });
            alert("¡Correo enviado con éxito!");
        } catch (error) {
            console.error("Error al enviar", error);
            alert("Error al enviar el correo");
        }
    };

    // Función para mandar los datos del form al backend
    const sheets = async (e) => {
        e.preventDefault();

        const accesToken = localStorage.getItem('accessToken');

        try {
            // Mandamos el nuevo registro
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/sheets`,
                {
                    token: accesToken,
                    numero: sheetsValues.numero,
                    texto: sheetsValues.texto,
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
                                value={sheetsValues.text}
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