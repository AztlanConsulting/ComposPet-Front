import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSendEmail = async () => {
        const accessToken = localStorage.getItem('accessToken'); // Recuperamos la "llave"
        
        try {
            const res = await axios.post('http://localhost:8080/user/send-email', {
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

    return (
        <div style={{ padding: '40px' }}>
            <h1>Panel de Control - Compospet</h1>
            <button 
                onClick={handleSendEmail}
                style={{ backgroundColor: '#4CAF50', color: 'white', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
            >
                📧 Enviar Notificación por Correo
            </button>
        </div>
    );
};

export default Dashboard;