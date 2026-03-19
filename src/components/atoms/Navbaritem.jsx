import React from 'react'

export default function Navbaritem({ 
    route = "/", 
    icon = <></>, 
    logout = false, 
    children 
}) {
    return (
        <Link to={route} className={logout ? "logout" : "navbarItem"}>
        <span>{icon}</span>
        {children}
        </Link>
    );
}
