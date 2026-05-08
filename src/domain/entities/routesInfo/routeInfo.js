/**
 * Entidad de dominio que representa la información de una ruta de recolección.
 * Encapsula todos los datos relevantes de una ruta diaria, incluyendo
 * recolecciones, entregas, productos extra y detalles de pago.
 * 
 * @class RouteInfo
 */
export class RouteInfo {
   /**
   * Crea una instancia de RouteInfo.
   *
   * @constructor
   * @param {Object} params - Objeto con los datos de la ruta.
   * @param {string} params.name - Nombre del repartidor o identificador de la ruta.
   * @param {string} params.collectedBuckets - Número de cubetas recolectadas en formato string.
   * @param {string} params.deliveredBuckets - Número de cubetas entregadas en formato string.
   * @param {string} params.extraProducts - Descripción de productos extra solicitados.
   * @param {string} params.schedule - Horario asignado para la ruta.
   * @param {string} params.paymentMethod - Método de pago utilizado (efectivo, transferencia, etc.).
   * @param {string} params.totalToPay - Monto total a pagar en formato string.
   * @param {string} params.totalPaid - Monto total pagado en formato string.
   * @param {string} params.notes - Notas adicionales sobre la ruta o cliente.
   * 
   */
  constructor({
    name,
    collectedBuckets,
    deliveredBuckets,
    extraProducts,
    // route,
    schedule,
    paymentMethod,
    totalToPay,
    totalPaid,
    notes,
  }) {
    this.name = name;
    this.collectedBuckets = collectedBuckets;
    this.deliveredBuckets = deliveredBuckets;
    this.extraProducts = extraProducts;
    this.schedule = schedule;
    this.paymentMethod = paymentMethod;
    this.totalToPay = totalToPay;
    this.totalPaid = totalPaid;
    this.notes = notes;
  }
}