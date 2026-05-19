import Icon from "../atoms/Icon";
import Input from "../atoms/Input";

import "../../css/molecules/searchInput.css";

function SearchInput({
    value,
    onChange,
    placeholder = "Buscar",
}) {
    return (
        <div className="search-input-container">
            <Icon
                name="search"
                size="medium"
                color="color-green-secondary"
                className="search-input-icon"
            />

            <Input
                id="search-input"
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="search-input"
            />
        </div>
    );
}

export default SearchInput;