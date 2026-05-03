import Swal from "sweetalert2";
import "../../css/Template/aceptAlert.css";

/**
 * Muestra un modal de confirmación utilizando SweetAlert2.
 * Permite personalizar el contenido y devuelve la respuesta del usuario.
 */
const AceptAlert = async ({
    title = "¡Cambios guardados con éxito!",
    icon = "success",
    confirmText = "De acuerdo",
}) => {
    return await Swal.fire({
        title,
        icon,
        confirmButtonText: confirmText,
        customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            confirmButton: "custom-swal-acept",
        },
    });
};

export default AceptAlert;