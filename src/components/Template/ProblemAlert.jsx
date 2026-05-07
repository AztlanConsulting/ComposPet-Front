import Swal from "sweetalert2";
import "../../css/Template/problemAlert.css";

/**
 * Muestra un modal de confirmación utilizando SweetAlert2.
 * Permite personalizar el contenido y devuelve la respuesta del usuario.
 */
const ProblemAlert = async ({
    title = "Ocurrió un problema",
    text = "",
    icon = "error",
    confirmText = "Entendido",
}) => {
    return await Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: confirmText,
        customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            confirmButton: "custom-swal-problem",
        },
    });
};

export default ProblemAlert;