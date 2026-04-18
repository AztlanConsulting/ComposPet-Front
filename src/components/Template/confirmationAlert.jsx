import Swal from "sweetalert2";
import "../../css/Template/confirmationAlert.css";

const ConfirmAlert = async ({
    title = "¿Estás seguro?",
    text = "Se perderán los cambios no guardados.",
    confirmText = "Sí, continuar",
    cancelText = "Cancelar",
    icon = "warning",
}) => {
    return await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
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