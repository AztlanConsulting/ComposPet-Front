import React from 'react'
import Input from "../atoms/Input";
import Label from "../atoms/Label";


export default function InputComponent({
    placeholder = "",
    size = "md",
    id = "",
    type = "text",
    classNameLabel = "",
    classNameInput = "",
    onChange = () => {},
    children,
})  {
    return (
        <div className="ml-4">
            <Label size={size} id={id} className={classNameLabel}>
                {children}
            </Label>
            <Input
                placeholder={placeholder}
                id={id}
                size={size}
                type={type}
                onChange={onChange}
                className={classNameInput}
            />
        </div>
    );
}
