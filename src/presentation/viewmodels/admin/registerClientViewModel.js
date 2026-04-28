import { useState, useEffect } from 'react';

function useRegisterClientViewModel(){

    const [name, setName] = useState('');
    const [lastname1, setLastName1] = useState('');
    const [lastname2, setLastName2] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pets, setPets] = useState('');
    const [family, setFamily] = useState('');
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState('');

    return {
        name, setName,
        lastname1, setLastName1,
        lastname2, setLastName2,
        email, setEmail,
        phone, setPhone,
        pets, setPets,
        family, setFamily,
        notes, setNotes,
        address, setAddress,
    };
}

export default useRegisterClientViewModel;