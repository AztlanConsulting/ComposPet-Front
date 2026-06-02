import React, { useState } from 'react';

import Navbar from '../../../components/molecules/Navbar';
import Button from '../../../components/atoms/Button';
import RegisterProductModal from '../../../components/organisms/RegisterProduct';
import useRegisterProductViewModel from '../../viewmodels/inventory/registerProductViewModel';

import '../../../css/inventory/inventory.css';

export default function InventoryView() {
    const [isRegisterProductModalOpen, setIsRegisterProductModalOpen] = useState(false);

    const registerProductViewModel = useRegisterProductViewModel();

    const openRegisterProductModal = () => {
        setIsRegisterProductModalOpen(true);
    };

    const closeRegisterProductModal = () => {
        setIsRegisterProductModalOpen(false);
    };

    return (
        <>
            <Navbar />

            <main className="inventory-view">
                <section className="inventory-header">
                    <Button
                        type="button"
                        size="medium"
                        csstype="accept"
                        onClick={openRegisterProductModal}
                    >
                        Agregar
                    </Button>
                </section>

                <section className="inventory-content">
                    {/* Aquí después va buscador y cards de productos */}
                </section>
            </main>

            <RegisterProductModal
                isOpen={isRegisterProductModalOpen}
                onClose={closeRegisterProductModal}
                viewModel={registerProductViewModel}
            />
        </>
    );
}