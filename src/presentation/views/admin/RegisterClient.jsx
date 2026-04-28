import Navbar from '../../../components/molecules/Navbar';
import InputComponent from '../../../components/molecules/InputComponent';
import Label from '../../../components/atoms/Label';
import Button from '../../../components/atoms/Button';

import DropdownInput from '../../../components/molecules/DropdownInput';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import useRegisterClientCatalogViewModel from '../../viewmodels/admin/registerClientCatalogViewModel';
import { registerClientCatalogUseCase } from '../../../di/admin/registerClientDependencies';

function RegisterClient(){

    const {
        states, towns, zones, daysOfRoutes,
        selectedState, selectedTown, selectedZone, selectedDay,
        handleStateChange, handleTownChange, handleZoneChange, handleDayOfRouteChange,
        loading, error,onSubmit,
    } = useRegisterClientCatalogViewModel(registerClientCatalogUseCase);

    if(loading) return <p>Cargando...</p>;
    if(error) return <p>{error}</p>;

    return(
        <main className="">
            <Navbar /> 

            <div>
                <h1 className="">
                    Rgistrar nuevo cliente
                </h1>
            </div>

            <form onSubmit={(e) => {console.log("form disparado"); onSubmit(e);}} className='col d-flex flex-column align-items-center flex-wrap'>
                
                <section>
                    <h5 class="text-center">Información personal</h5>
                    <hr />

                    <InputComponent
                        id="name"
                        type="text"
                        size="md"
                        placeholder=""
                        classNameLabel="label"
                        classNameInput="input"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        Nombre
                    </InputComponent>

                    <div>
                        <InputComponent
                            id="lastname_1"
                            type="text"
                            size="md"
                            placeholder=""
                            classNameLabel="label"
                            classNameInput="input"
                            onChange={(e) => console.log(e.target.value)}
                        >
                            Apellido Paterno
                        </InputComponent>

                        <InputComponent
                            id="lastname_2"
                            type="text"
                            size="md"
                            placeholder=""
                            classNameLabel="label"
                            classNameInput="input"
                            onChange={(e) => console.log(e.target.value)}
                        >
                            Apellido Materno
                        </InputComponent>
                    </div>

                    <InputComponent
                        id="email"
                        type="text"
                        size="md"
                        placeholder=""
                        classNameLabel="label"
                        classNameInput="input"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        Correo
                    </InputComponent>

                    <InputComponent
                        id="phone"
                        type="text"
                        size="md"
                        placeholder=""
                        classNameLabel="label"
                        classNameInput="input"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        Número de teléfono
                    </InputComponent>
                </section>

                <section>
                    <h5 class="text-center">Datos familiares</h5>
                    <hr />

                    <InputComponent
                        id="pets"
                        type="text"
                        size="md"
                        placeholder=""
                        classNameLabel="label"
                        classNameInput="input"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        Mascotas
                    </InputComponent>

                    <InputComponent
                        id="family"
                        type="text"
                        size="md"
                        placeholder=""
                        classNameLabel="label"
                        classNameInput="input"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        Familia
                    </InputComponent>

                    <Label
                        id="notas-adicionales"
                        size="lg"
                        className=""
                    >
                        Notas adicionales
                    </Label>

                    <Form.Control
                        as="textarea"
                        placeholder="Escribe cualquier nota adicional que los operadores necesiten para poder entregar tus productos."
                        className=""
                        value={""}
                        onChange={(e) => console.log(e.target.value)}
                    />
                </section>

                <section>
                    <h5 class="text-center">Ubicación</h5>
                    <hr />

                    <InputComponent
                        id="address"
                        type="text"
                        size="md"
                        placeholder=""
                        classNameLabel="label"
                        classNameInput="input"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        Dirección
                    </InputComponent>
                    
                    <div>
                        <DropdownInput
                            id="state"
                            size="md"
                            value={selectedState}
                            onChange={(e) => handleStateChange(Number(e.target.value))}
                            options={
                                states.map(s => ({
                                    value: s.id_estado,
                                    label: s.estado,
                                }))}
                        >
                            Estado
                        </DropdownInput>

                        <DropdownInput
                            id="town"
                            size="md"
                            value={selectedTown}
                            onChange={(e) => handleTownChange(Number(e.target.value))}
                            options={
                                towns.map(s => ({
                                    value: s.id_municipio,
                                    label: s.municipio,
                                }))}
                        >
                            Municipio
                        </DropdownInput>

                        <DropdownInput
                            id="zone"
                            size="md"
                            value={selectedZone}
                            onChange={(e) => handleZoneChange(Number(e.target.value))}
                            options={
                                zones.map(s => ({
                                    value: s.id_zona,
                                    label: s.descripcion,
                                }))}
                        >
                            Zona
                        </DropdownInput>
                    </div>

                </section>

                <section>
                    <h5 class="text-center">Asignación de ruta</h5>
                    <hr />

                    <DropdownInput
                        id="daysOfRoutes"
                        size="md"
                        value={selectedDay}
                        onChange={(e) => handleDayOfRouteChange(Number(e.target.value))}
                        options={
                            daysOfRoutes.map(s => ({
                                value: s.id_ruta,
                                label: s.dia_ruta,
                            }))}
                    >
                        Dia de ruta
                    </DropdownInput>
                </section>

                <div>
                    <Button
                        size="medium" 
                        type="submit" 
                        csstype="cancel" 
                        className='button' 
                        disabled={loading}
                    >
                            {loading ? "Cancelando..." : "Cancelar"}
                    </Button>

                    <Button
                        size="medium" 
                        type="submit" 
                        csstype="accept" 
                        className='button' 
                        disabled={loading}
                    >
                            {loading ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </form>            
        </main>
    );
}

export default RegisterClient;