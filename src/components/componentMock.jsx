
import Icon from './atoms/Icon';
import Button from './atoms/Button';
import InputComponent from './molecules/InputComponent';
import Image from './atoms/Image';
import {useState} from 'react';

import PersonImg from '../public/img/person.png';
import AniluImg from '../public/img/Anilu.png';

import ProductCard from './molecules/ProductCard';
import Login from './organisms/Login';

import YesNoQuestion from './molecules/YesNoQuestion';
import CounterInput from './molecules/counterInput';
import FormCard from './Template/formCard';
import ProgressBarLogic from './molecules/ProgressBarLogic';
import Navbar from './molecules/Navbar';
import DropdownInput from './molecules/DropdownInput';
import CopyLink from './molecules/CopyLink';
import CountersGroup from './molecules/CountersGroup';
import BalanceCountersGroup from './organisms/BalanceCountersGroup';
import MetricHeader from '../components/molecules/MetricHeader';


function ComponentMock() {

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
                    <Icon name="family" size="small" color="primary" />
                    <Icon name="car" size="small" color="primary" />
                    <Icon name="moneyBag" size="small" color="primary" />
                    <Icon name="warning" size="small" color="primary" />
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
                    <div>
                        <MetricHeader
                            text='Total de familias'
                            iconName='family'
                            size='small'
                            color='primary'
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ComponentMock;
