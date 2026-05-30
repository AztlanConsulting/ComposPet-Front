import Swal from "sweetalert2";
import "../../css/Template/timerAlert.css";

const TimerAlert = async ({
    title = "",
    text = "",
    secondaryText = "",
    confirmText = "Continuar",
    icon = "warning",
}) => {

    return await Swal.fire({
        title,
        html: `
            <div class="custom-swal-message">
                <p>${text}</p>

                ${
                    secondaryText
                        ? `<p class="custom-swal-secondary-text">${secondaryText}</p>`
                        : ""
                }
            </div>
        `,
        icon,
        showConfirmButton: true,
        confirmButtonText: confirmText,
        showCancelButton: false,
        buttonsStyling: false,
        customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            htmlContainer: "custom-swal-text",
            confirmButton: "custom-swal-confirm-timer",
        },
    });
};

export default TimerAlert;