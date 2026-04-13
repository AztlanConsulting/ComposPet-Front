import NavDropdown from 'react-bootstrap/NavDropdown';
import '../../css/molecules/dropdown.css';

/**
 * Componente de dropdown para el navbar.
 * Renderiza un menú desplegable utilizando `react-bootstrap`.
 *
 * Funcionalidad:
 * - Muestra un título visible que actúa como botón del dropdown.
 * - Al hacer clic, despliega una lista de opciones de navegación.
 * - Cada opción redirige a una ruta específica mediante `href`.
 *
 * @param {string} title - Texto que se muestra como título del dropdown.
 * @param {Array<Object>} options - Lista de opciones a mostrar en el menú.
 * @param {string} options[].label - Texto visible de cada opción.
 * @param {string} options[].path - Ruta de navegación asociada a la opción.
 *
 * Estructura:
 * - NavDropdown → contenedor principal del dropdown
 * - NavDropdown.Item → elementos individuales del menú
 *
 * Estilos:
 * - Utiliza la clase `my-dropdown` para personalización visual desde CSS.
 *
 * @returns {JSX.Element} Dropdown interactivo con opciones de navegación.
 */
function NavbarDropdown({ title, options }) {
  return (
    <NavDropdown
      title={title}
      id="nav-dropdown"
      className="my-dropdown"
    >
      {options.map((option, index) => (
        <NavDropdown.Item key={index} href={option.path}>
          {option.label}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
}

export default NavbarDropdown;