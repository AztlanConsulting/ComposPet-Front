import Navbar from "../../../components/molecules/Navbar";
import Button from '../../../components/atoms/Button';
import InputComponent from '../../../components/molecules/InputComponent';

import useAdminProfileViewModel from "../../viewmodels/admin/adminProfileViewModel";

export default function AdminProfileInformation(){

    const { 
        profile, loading, error,
        isEditing,
        phone, setPhone,
        email, setEmail,
        accountHolder, setAccountHolder,
        accountNumber, setAccountNumber,
        handleEdit, handleCancel, handleSave,
    } = useAdminProfileViewModel();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return(
        <main className="main-backgound">

            <Navbar />

            <div>
                <h1 className="title">Mi perfil</h1>
            </div>

            <div>
                <div>
                    <p>{profile.name}</p>

                    {isEditing ? (
                        <>
                            <Button size="medium" type="button" csstype="cancel" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button size="medium" type="button" csstype="accept" onClick={handleSave}>
                                Guardar
                            </Button>
                        </>
                    ) : (
                        <Button size="medium" type="button" csstype="accept" onClick={handleEdit}>
                            Editar Perfil
                        </Button>
                    )}
                </div>

                <div>
                    <div className="personal-information-container">
                        <h4>
                            Información personal
                        </h4>
                        
                        <div>
                            {isEditing ? (
                                <InputComponent 
                                    id="phone" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                >
                                    Teléfono
                                </InputComponent>
                            ) : (
                                <>
                                    <p>Teléfono</p>
                                    <p>{profile.phone}</p>
                                </>
                            )}
                        </div>

                        <div>
                            {isEditing ? (
                                <InputComponent 
                                    id="email" 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                >
                                    Correo
                                </InputComponent>
                            ) : (
                                <>
                                    <p>Correo</p>
                                    <p>{profile.email}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="transfer-information-container">
                        <h4>
                            Datos de transferencia
                        </h4>
                        
                        <div>
                            {isEditing ? (
                                <InputComponent id="accountHolder" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)}>
                                    Nombre del titular de la cuenta
                                </InputComponent>
                            ) : (
                                <>
                                    <p>Nombre del titular de la cuenta</p>
                                    <p>{profile.accountHolder}</p>
                                </>
                            )}
                        </div>

                        <div>
                            {isEditing ? (
                                <InputComponent id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}>
                                    Número de cuenta
                                </InputComponent>
                            ) : (
                                <>
                                    <p>Número de cuenta</p>
                                    <p>{profile.accountNumber}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </main>
    )
}
