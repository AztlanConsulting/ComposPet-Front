import logo from './logo.svg';
import './App.css';
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
          Mini
        </Button>
      </header>
    </div>
  );
}

export default App;
