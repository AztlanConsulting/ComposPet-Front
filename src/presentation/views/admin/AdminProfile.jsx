import Navbar from "../../../components/molecules/Navbar";
import Button from '../../../components/atoms/Button';
import InputComponent from '../../../components/molecules/InputComponent';

import '../../../css/adminProfile/adminProfile.css';
import '../../../css/molecules/inputComponent.css';

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
        <main>
            <Navbar />
            
            <div>
                <h1 className="title">Mi perfil</h1>
            </div>

            <div className="main-container">
                <div className="header">
                    <p className="user-full-name">{profile.name}</p>

                    {isEditing ? (
                        <>
                            <div className="edit-buttons-container">
                                <Button size="medium" type="button" csstype="cancel" onClick={handleCancel}>
                                    Cancelar
                                </Button>
                                <Button size="medium" type="button" csstype="accept" onClick={handleSave}>
                                    Guardar
                                </Button>
                            </div>

                        </>
                    ) : (
                        <Button size="medium" type="button" csstype="accept" onClick={handleEdit}>
                            Editar Perfil
                        </Button>
                    )}
                </div>

                <div className="user-information">
                    <div className="personal-information-container">
                        <h4 className="profile-section-title">
                            Información personal
                        </h4>
                        
                        <div className="section-container">
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
                                        <p className="profile-element-title">Teléfono</p>
                                        <p className="profile-element-text">{profile.phone}</p>
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
                                        <p className="profile-element-title">Correo</p>
                                        <p className="profile-element-text">{profile.email}</p>
                                    </>
                                )}
                            </div>
                        </div>


                    </div>

                    <div className="transfer-information-container">
                        <h4 className="profile-section-title">
                            Datos de transferencia
                        </h4>
                        
                        <div>
                            <div className="section-container">
                                {isEditing ? (
                                    <InputComponent id="accountHolder" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)}>
                                        Nombre del titular de la cuenta
                                    </InputComponent>
                                ) : (
                                    <>
                                        <p className="profile-element-title">Nombre del titular de la cuenta</p>
                                        <p className="profile-element-text">{profile.accountHolder}</p>
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
                                        <p className="profile-element-title">Número de cuenta</p>
                                        <p className="profile-element-text">{profile.accountNumber}</p>
                                    </>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </main>
    )
}
