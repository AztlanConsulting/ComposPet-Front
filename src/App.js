import logo from './logo.svg';
import './App.css';
import Icon from './components/atoms/Icon';
import Button from './components/atoms/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <Button size='xl' type='info' className='button'>
          Extra grande
        </Button>

        <Button size='large' type='accept' className='button'>
          Grande
        </Button>

        <Button size='medium' type='login' className='button'>
          Mediano
        </Button>

        <Button size='small' type='cancel' className='button'>
          Pequeño
        </Button>

        <Button size='mini' type='warning' className='button'>
          Eliminar
        </Button>

        <Button size='mini' type='plus-min' className='button'>
          <Icon name="plus" size="small" color="primary" />
        </Button>

        <Button size='mini' type='plus-min' className='button'>
          <Icon name="minus" size="small" color="primary" />
        </Button>

        
      </header>
    </div>
  );
}

export default App;
