import Navbar from '../../../components/molecules/Navbar';
import InputComponent from '../../../components/molecules/InputComponent';
import Label from '../../../components/atoms/Label';
import Button from '../../../components/atoms/Button';

import DropdownInput from '../../../components/molecules/DropdownInput';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Loading from '../../../components/Template/loading';

import useRegisterClientCatalogViewModel from '../../viewmodels/admin/registerClientCatalogViewModel';
import { registerClientCatalogUseCase } from '../../../di/admin/registerClientDependencies';
import { registerClientUseCase } from '../../../di/admin/registerClientDependencies';

import { sanitizeText, sanitizeEmail, sanitizePhone } from '../../../utilities/sanitize';

import useRegisterClientViewModel from '../../viewmodels/admin/registerClientViewModel';

import '../../../css/registerClient/registerClient.css';
import '../../../css/molecules/inputComponent.css';

function RegisterClient(){

    const {
        states, towns, zones, daysOfRoutes,
        selectedState, selectedTown, selectedZone, selectedDay,
        handleStateChange, handleTownChange, handleZoneChange, 
        handleDayOfRouteChange, loading, error, dropdownErrors,
        setDropdownErrors, validateDropdowns,
    } = useRegisterClientCatalogViewModel(registerClientCatalogUseCase);

    const {
        errors, 
        name, setName, lastname1, setLastName1,
        lastname2, setLastName2, email, setEmail,
        phone, setPhone, pets, setPets, family, setFamily,
        notes, setNotes, address, setAddress, cancelForm, confirmForm,
        handleSubmit, nameRef, lastname1Ref, emailRef, phoneRef, addressRef,
    } = useRegisterClientViewModel();

    if (loading) {
        return <Loading />;
    }
    if(error) return <p>{error}</p>;

    return(
        <main className="register-client-background">
            <Navbar /> 

            <div>
                <h1 className="register-client-title">
                    Registrar nuevo cliente
                </h1>
            </div>

            <form onSubmit={(e) => handleSubmit(e, 
                { selectedDay, selectedZone, validateDropdowns, setDropdownErrors }
                )} className='register-client-form'>
                
                <section>
                    <h5 className="section-title">Información personal</h5>
                    <hr />

                    <InputComponent
                        id="name"
                        type="text"
                        ref={nameRef}
                        value={name}
                        classNameLabel="label"
                        classNameInput={
                            `register-input ${errors.name ? "input-error" : ""}`
                        }
                        onChange={(e) => setName(sanitizeText(e.target.value))}
                        error={errors.name}
                        required
                    >
                        Nombre
                    </InputComponent>

                    <div className='lastname-container'> 
                        <InputComponent
                            id="lastname_1"
                            type="text"
                            ref={lastname1Ref}
                            value={lastname1}
                            classNameLabel="label"
                            classNameInput={
                                `register-input-mid 
                                ${errors.lastname1 ? "input-error" : ""}`
                            }
                            onChange={(e) => setLastName1(sanitizeText(e.target.value))}
                            error={errors.lastname1}
                            required
                        >
                            Apellido Paterno
                        </InputComponent>

                        <InputComponent
                            id="lastname_2"
                            type="text"
                            value={lastname2}
                            classNameLabel="label"
                            classNameInput="register-input-mid"
                            onChange={(e) => setLastName2(sanitizeText(e.target.value))}
                        >
                            Apellido Materno
                        </InputComponent>
                    </div>

                    <InputComponent
                        id="email"
                        type="text"
                        ref={emailRef}
                        value={email}
                        classNameLabel="label"
                        classNameInput={
                            `register-input ${errors.email ? "input-error" : ""}`
                        }
                        error={errors.email}
                        onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
                    >
                        Correo
                    </InputComponent>

                    <InputComponent
                        id="phone"
                        type="text"
                        ref={phoneRef}
                        value={phone}
                        classNameLabel="label"
                        classNameInput={
                            `register-input ${errors.phone ? "input-error" : ""}`
                        }
                        error={errors.phone}
                        onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                    >
                        Número de teléfono
                    </InputComponent>
                </section>

                <section>
                    <h5 class="section-title">Datos familiares</h5>
                    <hr />

                    <InputComponent
                        id="pets"
                        type="text"
                        value={pets}
                        classNameLabel="label"
                        classNameInput="register-input"
                        onChange={(e) => setPets(sanitizeText(e.target.value))}
                    >
                        Mascotas
                    </InputComponent>

                    <InputComponent
                        id="family"
                        type="text"
                        value={family}
                        classNameLabel="label"
                        classNameInput="register-input"
                        onChange={(e) => setFamily(sanitizeText(e.target.value))}
                    >
                        Familia
                    </InputComponent>

                    <Label
                        id="notas-adicionales"
                        size="lg"
                        className="label"
                    >
                        Notas adicionales
                    </Label>

                    <Form.Control
                        as="textarea"
                        placeholder="Escribe cualquier nota adicional sobre el cliente."
                        className="register-input-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </section>

                <section>
                    <h5 class="section-title">Ubicación</h5>
                    <hr />

                    <InputComponent
                        id="address"
                        type="text"
                        ref={addressRef}
                        value={address}
                        classNameLabel="label"
                        classNameInput={
                            `register-input ${errors.address ? "input-error" : ""}`
                        }
                        error={errors.address}
                        onChange={(e) => setAddress(sanitizeText(e.target.value))}
                    >
                        Dirección
                    </InputComponent>
                    
                    <div className='zone-dropdowns-containers'>
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
                            error={dropdownErrors.selectedState}
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
                            error={dropdownErrors.selectedTown}
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
                            error={dropdownErrors.selectedZone}
                        >
                            Zona
                        </DropdownInput>
                    </div>

                </section>

                <section>
                    <h5 class="section-title">Asignación de ruta</h5>
                    <hr />
                    <div className='route-dropdowns-containers'>
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
                            error={dropdownErrors.selectedDay}
                        >
                            Dia de ruta
                        </DropdownInput>
                    </div>

                </section>

                <div className='buttons-container'>
                    <Button
                        size="medium" 
                        type="button" 
                        csstype="cancel" 
                        className='cancel-button' 
                        onClick={cancelForm}
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