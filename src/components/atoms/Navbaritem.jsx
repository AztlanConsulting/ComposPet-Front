import React from 'react'

/**
 * Elemento de navegación de la barra lateral o menú principal.
 * Renderiza un enlace de navegación con un ícono y etiqueta de texto.
 * Soporta una variante de cierre de sesión con estilos diferenciados.
 *
 * @param {string} [route="/"] - Ruta de destino del enlace.
 * @param {React.ReactNode} [icon=<></>] - Elemento de ícono a mostrar junto al texto.
 * @param {boolean} [logout=false] - Si es `true`, aplica la clase `logout` en lugar de `navbarItem`.
 * @param {React.ReactNode} children - Texto descriptivo del ítem de navegación.
 * @returns {JSX.Element} Enlace de navegación estilizado según su tipo.
 */

export default function Navbaritem({ 
    route = "/", 
    icon = <></>, 
    logout = false, 
    children 
}) {
    return (
        <Link to={route} className={logout ? "logout" : "navbarItem"}>
        <span>{icon}</span>
        {children}
        </Link>
    );
}
