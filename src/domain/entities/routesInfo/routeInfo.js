export class RouteInfo {
  constructor({
    name,
    collectedBuckets,
    deliveredBuckets,
    extraProducts,
    route,
    date,
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
    this.route = route;
    this.date = date;
    this.schedule = schedule;
    this.paymentMethod = paymentMethod;
    this.totalToPay = totalToPay;
    this.totalPaid = totalPaid;
    this.notes = notes;
  }
}