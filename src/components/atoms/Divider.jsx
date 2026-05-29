import '../../css/atoms/divider.css';

const Divider = ({ className = '' }) => {
    return <hr className={`divider ${className}`} />;
};

export default Divider;