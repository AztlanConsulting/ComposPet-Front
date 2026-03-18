import logo from './logo.svg';
import './App.css';
import Icon from './components/atoms/Icon';
import Button from './components/atoms/Button';

function App() {
  return (
    <div className="">

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <Button size='xl' type='info' className='button'>Extra grande</Button>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
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

        </div>
    </div>
  );
}

export default App;
