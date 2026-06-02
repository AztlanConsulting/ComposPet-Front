import Navbar from '../../../components/molecules/Navbar';
import InputComponent from '../../../components/molecules/InputComponent';
import Label from '../../../components/atoms/Label';
import Button from '../../../components/atoms/Button';

import DropdownInput from '../../../components/molecules/DropdownInput';
import Form from 'react-bootstrap/Form';
import Loading from '../../../components/Template/loading';
import Icon from '../../../components/atoms/Icon';

import useRegisterClientCatalogViewModel from '../../viewmodels/admin/registerClientCatalogViewModel';
import { registerClientCatalogUseCase } from '../../../di/admin/registerClientDependencies';
import { registerClientUseCase } from '../../../di/admin/registerClientDependencies';

import { sanitizeText, sanitizeEmail, sanitizePhone } from '../../../utilities/sanitize';

import useRegisterClientViewModel from '../../viewmodels/admin/registerClientViewModel';

import '../../../css/registerClient/registerClient.css';
import '../../../css/molecules/inputComponent.css';

/**
 * Vista principal del formulario de registro de un nuevo cliente.
 * Orquesta dos ViewModels: uno para los catálogos del formulario
 * y otro para el estado y envío de los datos del cliente.
 *
 * El formulario se divide en cuatro secciones:
 * - Información personal (nombre, apellidos, correo, teléfono).
 * - Datos familiares (mascotas, familia, notas adicionales).
 * - Ubicación (dirección de entrega).
 * - Asignación de ruta (día de ruta mediante dropdown).
 *
 * Muestra un indicador de carga mientras se obtienen los catálogos,
 * y un mensaje de error si la carga falla.
 * Los campos de texto aplican sanitización en tiempo real al cambio de valor.
 * Los botones quedan deshabilitados mientras hay una operación en curso.
 *
 * @returns {JSX.Element} Formulario de registro de cliente o indicador de carga/error.
 * @see useRegisterClientCatalogViewModel
 * @see useRegisterClientViewModel
 */
function RegisterClient(){

    const {
        daysOfRoutes,
        selectedDay,
        handleDayOfRouteChange, 
        loading, 
        error, 
        dropdownErrors,
        setDropdownErrors, 
        validateDropdowns,
    } = useRegisterClientCatalogViewModel(registerClientCatalogUseCase);

    const {
        errors, 
        name, setName, lastname1, setLastName1,
        lastname2, setLastName2, email, setEmail,
        phone, setPhone, pets, setPets, family, setFamily,
        notes, setNotes, address, setAddress, cancelForm, confirmForm,
        handleSubmit, validateField,
        nameRef, lastname1Ref, emailRef, phoneRef, addressRef,
    } = useRegisterClientViewModel(registerClientUseCase);

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
                { selectedDay, validateDropdowns, setDropdownErrors }
                )} className='register-client-form'>
                
                <section>
                    <h5 className="section-title">Información personal</h5>
                    <hr />

                    <InputComponent
                        id="name"
                        type="text"
                        ref={nameRef}
                        maxLength={100}
                        value={name}
                        classNameLabel="label"
                        placeholder="Ej. Alejandro Sebastián"
                        classNameInput={
                            `register-input ${errors.name ? "input-error" : ""}`
                        }
                        onChange={(e) => {const value =sanitizeText(e.target.value);
                            setName(value);
                            validateField("name", value);
                        }}
                        error={errors.name}
                        required
                    >
                        Nombre <Icon name="requiredInput" size="mini" color="icon-required" />
                    </InputComponent> 
                    <p className="character-counter">
                        {name.length}/100 caracteres
                    </p>

                    <InputComponent
                        id="lastname_1"
                        type="text"
                        ref={lastname1Ref}
                        maxLength={100}
                        value={lastname1}
                        classNameLabel="label"
                        placeholder="Ej. Villavicencio"
                        classNameInput={
                            `register-input 
                            ${errors.lastname1 ? "input-error" : ""}`
                        }
                        onChange={(e) => {const value =sanitizeText(e.target.value);
                        setLastName1(value);
                        validateField("lastname1", value);
                        }}
                        error={errors.lastname1}
                        required
                    >
                        Apellido Paterno <Icon name="requiredInput" size="mini" color="icon-required" />
                    </InputComponent>
                    <p className="character-counter">
                        {lastname1.length}/100 caracteres
                    </p>

                    <InputComponent
                        id="lastname_2"
                        type="text"
                        value={lastname2}
                        maxLength={100}
                        classNameLabel="label"
                        placeholder="Ej. Casarrubia"
                        classNameInput={`register-input ${errors.lastname2 ? "input-error" : ""}`}
                        error={errors.lastname2}
                        onChange={(e) => {
                            const value = sanitizeText(e.target.value);
                            setLastName2(value);
                            validateField("lastname2", value);
                        }}
                    >
                        Apellido Materno
                    </InputComponent>
                    <p className="character-counter">
                        {lastname2.length}/100 caracteres
                    </p>

                    <InputComponent
                        id="email"
                        type="text"
                        ref={emailRef}
                        maxLength={150}
                        value={email}
                        classNameLabel="label"
                        placeholder="Ej. carlos.mendez@soluciones.com.mx"
                        classNameInput={
                            `register-input ${errors.email ? "input-error" : ""}`
                        }
                        error={errors.email}
                        onChange={(e) => {const value = sanitizeEmail(e.target.value);
                            setEmail(value);
                            validateField("email", value);
                        }}
                    >
                        Correo <Icon name="requiredInput" size="mini" color="icon-required" />
                    </InputComponent>
                    <p className="character-counter">
                        {email.length}/150 caracteres
                    </p>

                    <InputComponent
                        id="phone"
                        type="text"
                        ref={phoneRef}
                        value={phone}
                        classNameLabel="label"
                        placeholder="Ej. +524425676543"
                        classNameInput={
                            `register-input ${errors.phone ? "input-error" : ""}`
                        }
                        error={errors.phone}
                        onChange={(e) => {const value = sanitizePhone(e.target.value);
                            setPhone(value);
                            validateField("phone", value);
                        }}
                    >
                        Número de teléfono <Icon name="requiredInput" size="mini" color="icon-required" />
                    </InputComponent>

                    <p className="character-counter">
                        {phone.length}/15 caracteres
                    </p>
                </section>

                <section>
                    <h5 className="section-title">Datos familiares</h5>
                    <hr />

                    <InputComponent
                        id="pets"
                        type="text"
                        placeholder="Ej. 3 perros, 2 gatos."
                        value={pets}
                        maxLength={50}
                        classNameLabel="label"
                        onChange={(e) => setPets(sanitizeText(e.target.value))}
                    >
                        Mascotas
                    </InputComponent>
                    <p className="character-counter">
                        {pets.length}/50 caracteres
                    </p>

                    <InputComponent
                        id="family"
                        type="text"
                        placeholder="Ej. 2 adultos, 1 niño."
                        value={family}
                        maxLength={50}
                        classNameLabel="label"
                        onChange={(e) => setFamily(sanitizeText(e.target.value))}
                    >
                        Familia
                    </InputComponent>
                    <p className="character-counter">
                        {family.length}/50 caracteres
                    </p>

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
                        maxLength={500}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <p className="character-counter">
                        {notes.length}/500 caracteres
                    </p>

                </section>

                <section>
                    <h5 className="section-title">Ubicación</h5>
                    <hr />

                    <InputComponent
                        id="address"
                        type="text"
                        ref={addressRef}
                        value={address}
                        classNameLabel="label"
                        placeholder="Ej. Calle 123, Colonia, CP Ciudad, Estado"
                        classNameInput={
                            `register-input ${errors.address ? "input-error" : ""}`
                        }
                        error={errors.address}
                        maxLength={255}
                        onChange={(e) => {const value =sanitizeText(e.target.value);
                            setAddress(value);
                            validateField("address", value);
                        }}
                    >
                        Dirección <Icon name="requiredInput" size="mini" color="icon-required" />
                    </InputComponent>
                    <p className="character-counter">
                        {address.length}/255 caracteres
                    </p>

                </section>

                <section>
                    <h5 className="section-title">Asignación de ruta</h5>
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
                        Día de ruta <Icon name="requiredInput" size="mini" color="icon-required" />
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