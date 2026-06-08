/**
 * Interfaz abstracta del repositorio de la información de transferencia
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * los metodos definidos si no dara error
 *
 * @abstract
 */

export class paymentIRepository{
    /**
     * Obtiene la forma de pago de transferencia
     *
     * @abstract
     * @returns {Promise<Payment|null>} Objeto con el pago o `null` si no existe.
     * @throws {Error} Si el método no ha sido implementado.
     */
    async getTransferPayment(){
        throw new Error('paymentIRepository.getTransferPayment() not implemented')
    }

}