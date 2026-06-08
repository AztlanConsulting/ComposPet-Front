import React, { useState } from 'react';

import Navbar from '../../../components/molecules/Navbar';
import Button from '../../../components/atoms/Button';
import RegisterProductModal from '../../../components/organisms/RegisterProduct';
import useRegisterProductViewModel from '../../viewmodels/inventory/registerProductViewModel';

import InventoryProductsView from './inventoryProductsView';
import GetInventoryViewModel from '../../viewmodels/inventory/getInventoryViewModel';

import '../../../css/inventory/inventory.css';

export default function InventoryView() {
    const [isRegisterProductModalOpen, setIsRegisterProductModalOpen] = useState(false);

    const inventoryViewModel = GetInventoryViewModel();

    const closeRegisterProductModal = () => {
        setIsRegisterProductModalOpen(false);
    };

    const handleProductRegistered = async () => {
        closeRegisterProductModal();
        await inventoryViewModel.loadInventory();
    };

    const registerProductViewModel = useRegisterProductViewModel({
        onClose: closeRegisterProductModal,
        onProductRegistered: handleProductRegistered,
    });

    const openRegisterProductModal = () => {
        setIsRegisterProductModalOpen(true);
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
                    <InventoryProductsView viewModel={inventoryViewModel} />
                </section>
            </main>

            <RegisterProductModal
                isOpen={isRegisterProductModalOpen}
                onClose={() => {
                    registerProductViewModel.resetForm();
                    closeRegisterProductModal();
                }}
                viewModel={registerProductViewModel}
            />
        </>
    );
}