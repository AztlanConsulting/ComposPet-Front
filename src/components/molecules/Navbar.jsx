import React from 'react';
import { useState } from 'react';
import logo from '../../public/img/LogoComposPet.svg';
import "../../css/molecules/navbar.css";
import Dropdown from './Dropdown';
import NavbarItem from '../atoms/NavbarItem.jsx';
import { useLogout } from '../../presentation/viewmodels/auth/logoutViewModel';
import { useLocation } from 'react-router-dom';
import ConfirmAlert from '../Template/confirmationAlert.jsx';

/**
 * Componente principal de navegación de la aplicación.
 * Renderiza un navbar responsivo que adapta su estructura entre vista de escritorio y móvil.
 *
 * Funcionalidad:
 * - Muestra el logo de la aplicación siempre visible.
 * - En escritorio:
 *   - Muestra enlaces de navegación centrados (Dropdown, Mis recolecciones, FAQ).
 *   - Muestra botón de sesión (Iniciar sesión o Cerrar sesión) alineado a la derecha.
 * - En móvil:
 *   - Oculta los enlaces principales.
 *   - Muestra un botón hamburguesa para desplegar el menú.
 *   - Renderiza un menú vertical con las mismas opciones de navegación.
 *
 * Estado:
 * @state {boolean} menuOpen - Controla si el menú móvil está abierto o cerrado.
 *
 * Variables:
 * @constant {boolean} isLoggedIn - Determina si el usuario está autenticado basado en sessionStorage.
 *
 * Estructura:
 * - navbar_left → Logo
 * - navbar_center → Links principales (solo desktop)
 * - navbar_right → Login/Logout (solo desktop)
 * - navbar_hamburger → Botón menú móvil
 * - navbar_mobile_menu → Menú desplegable en móvil
 *
 * @returns {JSX.Element} Navbar responsivo con navegación y control de sesión.
 */
export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const { user, isAdmin, logout } = useLogout();
    const location = useLocation();

    // variable para probar el menú con el botón de iniciar sesión
    //const isLoggedIn = false;

    const handleLogout = async (e) => {
        if (e) e.preventDefault();
        const result = await ConfirmAlert({
            title: "¿Estás seguro de que quieres cerrar sesión?",
            text: "",
            confirmText: "Cerrar sesión",
            cancelText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        await logout();
    };

    // const homeOptions = [
    //     { label: "¿Quiénes somos?", path: "" },
    //     { label: "Equipo", path: "" },
    //     { label: "¿Cómo funciona?", path: "" }
    // ];

    const clientInfo = [
        { label: "Información clientes", path: "/tabla-clientes" },
        { label: "Registrar cliente", path: "/registrar-cliente" },
    ];

    // const myRecolectionsOptions = [
    //     { label: "Solicitar recolección", path: "/formulario-recoleccion" },
    //     { label: "Mi Perfil", path: "" },
    // ];

    const adminLinks = [
        //{ component: <Dropdown title="Inicio" options={homeOptions} /> },
        { component: <NavbarItem route="/tabla-clientes" active={location.pathname === "/tabla-clientes"}>Información clientes</NavbarItem>},
        { component: <NavbarItem route="/registrar-cliente" active={location.pathname === "/registrar-cliente"}>Registrar clientes</NavbarItem>},
        { component: <NavbarItem route="/ruta" active={location.pathname === "/ruta"}>Rutas</NavbarItem> },
        //{ component: <NavbarItem route="/resumen">Resumen</NavbarItem> },
    ];

    const clientLinks = [
        //{ component: <Dropdown title="Inicio" options={homeOptions} /> },
        //{ component: <Dropdown title="Mis recolecciones" options={myRecolectionsOptions} />  },
        // //{ component: <NavbarItem route="/faq">Preguntas Frecuentes</NavbarItem> },
        // { component: <NavbarItem route="/">  </NavbarItem>},
        { component: <NavbarItem route="/formulario-recoleccion" active={location.pathname === "/formulario-recoleccion"}>
                        Formulario de recolección
                    </NavbarItem> }
    ];

    const centerLinks = isAdmin ? adminLinks : clientLinks;

    return (
        <nav className="navbar">

            {/* Logo — siempre visible */}
            <div className="navbarLeft">
                {isAdmin ? 
                    <img src={logo} alt="ComposPet" className="navbarLogo" onClick={() => window.location.href = '/ruta'} /> 
                    : <img src={logo} alt="ComposPet" className="navbarLogo" onClick={() => window.location.href = '/'} />}
            </div>

            {/* Links centro — solo desktop */}
            <div className="navbarCenter">
                {centerLinks.map((link, index) => (
                    <React.Fragment key={index}>{link.component}</React.Fragment>
                ))}
            </div>

            {/* Cerrar sesión — solo desktop */}
            <div className="navbarRight">
                {user != null ? (
                    <NavbarItem route="/" logout={true} onClick={handleLogout}>
                        Cerrar sesión
                    </NavbarItem>
                ) : (
                    <div className="login">
                        <NavbarItem route="/inicio-sesion">
                            Iniciar sesión
                        </NavbarItem>
                    </div>
                )}
            </div>

            {/* Botón hamburguesa — solo mobile */}
            <button
                className="navbarHamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menú"
            >
                <span className={`hamburgerIcon ${menuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>

            {/* Menú desplegable — solo mobile */}
            {menuOpen && (
                <div className="navbarMobileMenu">
                    {centerLinks.map((link, index) => (
                        <React.Fragment key={index}>{link.component}</React.Fragment>
                    ))}
                    {user != null ? (
                        <NavbarItem route="/" logout={true} onClick={handleLogout}>
                            Cerrar sesión
                        </NavbarItem>
                    ) : (
                        <div className="login">
                            <NavbarItem route="/inicio-sesion">
                                Iniciar sesión
                            </NavbarItem>
                        </div>
                    )}
                </div>
            )}

        </nav>
    );
}