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

    const [editingProduct, setEditingProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    }

    const editProductViewModel = useRegisterProductViewModel({
        mode: "edit",
        initialProduct: editingProduct,
        onClose: () => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
        },
        onProductRegistered: async () => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
            await inventoryViewModel.loadInventory();
        }
    })

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
                    <InventoryProductsView 
                    viewModel={inventoryViewModel} 
                    onEditProduct={openEditModal}
                    />
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
            <RegisterProductModal
                isOpen={isProductModalOpen}
                onClose={() => {
                    editProductViewModel.resetForm();
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                }}
                viewModel={editProductViewModel}
            />
        </>
    );
}