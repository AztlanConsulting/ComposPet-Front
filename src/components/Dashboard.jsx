import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './atoms/Button';
import InputComponent from './molecules/InputComponent';

const Dashboard = () => {
    
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
        }}>
            <h1>Panel de Control - Compospet</h1>
            
            <Button 
                size='medium' 
                className='button'
            >
                Dashboard
            </Button>
        </div>
    );
};

export default Dashboard;