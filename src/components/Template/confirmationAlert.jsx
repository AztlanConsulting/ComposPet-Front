import Swal from "sweetalert2";
import "../../css/Template/confirmationAlert.css";

/**
 * Muestra un modal de confirmación utilizando SweetAlert2.
 * Permite personalizar el contenido y devuelve la respuesta del usuario.
 */
const ConfirmAlert = async ({
    title = "¿Estás seguro?",
    text = "",
    confirmText = "Sí, continuar",
    cancelText = "Cancelar",
    icon = "warning",
    showCancelButton = true,
}) => {
    return await Swal.fire({
        title,
        text,
        icon,
        showCancelButton,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        buttonsStyling: false,
        customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            htmlContainer: "custom-swal-text",
            confirmButton: "custom-swal-confirm",
            cancelButton: "custom-swal-cancel",
        },
    });
};

export default ConfirmAlert;