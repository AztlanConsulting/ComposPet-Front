import { useState } from 'react';
import logo from '../../public/img/LogoComposPet.svg';
import "../../css/molecules/navbar.css";
import Dropdown from './Dropdown';
import NavbarItem from '../atoms/Navbaritem';

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
    const isLoggedIn = !!sessionStorage.getItem('token');
    // variable para probar el menú con el botón de iniciar sesión
    //const isLoggedIn = false;

    const title = "Inicio";
    const homeOptions = [
        { label: "¿Quiénes somos?", path: "" },
        { label: "Equipo", path: "" },
        { label: "¿Cómo funciona?", path: "" }
    ];

    const titleMyRecolections = "Mis recolecciones";
    const myRecolectionsOptions = [
        { label: "Solicitar recolección", path: "/formulario-recoleccion" },
        { label: "Mi Perfil", path: "" },
    ];

    return (
        <nav className="navbar">

            {/* Logo — siempre visible */}
            <div className="navbarLeft">
                <img src={logo} alt="ComposPet" className="navbarLogo" onClick={() => window.location.href = '/'} />
            </div>

            {/* Links centro — solo desktop */}
            <div className="navbarCenter">
                <Dropdown title={title} options={homeOptions} />
                {isLoggedIn && (
                    <Dropdown title={titleMyRecolections} options={myRecolectionsOptions} />
                )}
                <NavbarItem route="/faq">Preguntas Frecuentes</NavbarItem>
            </div>

            {/* Cerrar sesión — solo desktop */}
            <div className="navbarRight">
                {isLoggedIn ? (
                    <NavbarItem route="/" logout={true}>
                        Cerrar sesión
                    </NavbarItem>
                ) : (
                    <div className="login">
                        <NavbarItem route="/login">
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
                    <Dropdown title={title} options={homeOptions} />
                    {isLoggedIn && (
                        <Dropdown title={titleMyRecolections} options={myRecolectionsOptions} />
                    )}
                    <NavbarItem route="/faq">FAQ</NavbarItem>
                    {isLoggedIn ? (
                        <NavbarItem route="/logout" logout={true}>
                            Cerrar sesión
                        </NavbarItem>
                    ) : (
                        <div className="login">
                            <NavbarItem route="/login">
                                Iniciar sesión
                            </NavbarItem>
                        </div>
                    )}
                </div>
            )}

        </nav>
    );
}