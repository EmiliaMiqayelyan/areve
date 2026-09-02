export type OrderLineTotals = {
  bagPrice?: number;
  stonePrice?: number;
  price?: number;
  unitCost?: number;
};

export type OrderWithLineTotals = {
  items?: OrderLineTotals[];
  total?: number | string;
};

export function lineNetIncome(item: OrderLineTotals) {
  const bagPrice = Number(item.bagPrice ?? item.price ?? 0);
  const stonePrice = Number(item.stonePrice ?? item.unitCost ?? 0);
  return bagPrice - stonePrice;
}

export function orderNetIncome(order: OrderWithLineTotals) {
  const items = order.items ?? [];
  if (items.length > 0) {
    return items.reduce((sum, item) => sum + lineNetIncome(item), 0);
  }
  return Number(order.total ?? 0);
}
