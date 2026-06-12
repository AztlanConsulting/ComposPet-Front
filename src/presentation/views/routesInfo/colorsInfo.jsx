import "../../../css/routesInfo/routesInfo.css";
import '../../../css/tokens/colors.css';

const TEXT_COLORS = [
    { text: "Productos del catálogo", color: "var(--color-green-products)" },
    { text: "Aserrín", color: "var(--color-yellow-primary)" },
    { text: "Composta", color: "var(--color-orange-primary)" },
    { text: "Costal de composta", color: "var(--color-purple-primary)" },
];

const BACKGROUND_COLORS = [
    { text: "No ha iniciado su formulario de recolección", color: "var(--color-lightgray)"},
    { text: "No ha completado su formulario de recolección", color: "var(--color-red-secondary)" },
    { text: "No quiso recolección ni productos extra", color: "var(--color-gray-bg)" },
];

export default function ColorsInfo() {
    return (
        <div className="colors-info-wrapper">
            
             <div className="colors-info-grid text-colors-grid">
                <span className="legend-title">Colores para los textos</span>

                {TEXT_COLORS.map((item) => (
                    <div key={item.text} className="color-info-item">
                        <div
                            className="color-box"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="color-text">{item.text}</span>
                    </div>
                ))}
            </div>

            <div className="colors-info-grid background-colors-grid">
                <span className="legend-title">Colores del fondo</span>

                {BACKGROUND_COLORS.map((item) => (
                    <div key={item.text} className="color-info-item">
                        <div
                            className="color-box"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="color-text">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}