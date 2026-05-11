import Swal from "sweetalert2";
import "../../css/Template/timerAlert.css";

/**
 * Muestra un modal informativo con temporizador y botón de continuar.
 * Se cierra automáticamente después del tiempo configurado.
 * 
 * @param {Object} params - Configuración del modal.
 * @param {string} params.title - Título del modal.
 * @param {string} params.text - Mensaje del modal.
 * @param {string} params.confirmText - Texto del botón de confirmación.
 * @param {string} params.icon - Icono del modal.
 * @param {number} params.timer - Tiempo en milisegundos antes del cierre automático.
 * @returns {Promise<import("sweetalert2").SweetAlertResult>}
 * 
 */
const TimerAlert = async ({
    title = "",
    text = "Este mensaje se cerrará automáticamente.",
    secondaryText = "",
    confirmText = "Continuar",
    icon = "warning",
    timer = 10000,
}) => {
    let timerInterval;

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

                <strong id="swal-timer-text" class="custom-swal-timer"></strong>
            </div>
        `,
        icon,
        showConfirmButton: true,
        confirmButtonText: confirmText,
        showCancelButton: false,
        timer,
        timerProgressBar: true,
        buttonsStyling: false,
        customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            htmlContainer: "custom-swal-text",
            confirmButton: "custom-swal-confirm-timer",
        },
        didOpen: () => {
            const timerText = Swal.getHtmlContainer()?.querySelector("#swal-timer-text");

            timerInterval = setInterval(() => {
                if (timerText) {
                    const timeLeft = Swal.getTimerLeft();
                    timerText.textContent = timeLeft
                        ? `${Math.ceil(timeLeft / 1000)}s`
                        : "";
                }
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });
};

export default TimerAlert;