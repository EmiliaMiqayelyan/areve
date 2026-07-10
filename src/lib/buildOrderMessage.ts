import { formatPrice } from './currency';

export type OrderLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderMessageLabels = {
  intro: string;
  link: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
  orderTotal: string;
  itemCount: string;
  thanks: string;
};

export function buildOrderMessage(
  items: OrderLineItem[],
  orderTotal: number,
  totalItemCount: number,
  siteOrigin: string,
  labels: OrderMessageLabels
): string {
  const lines: string[] = [labels.intro, ''];

  items.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    const productUrl = `${siteOrigin}/products/${item.id}`;

    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`   ${labels.link}: ${productUrl}`);
    lines.push(`   ${labels.quantity}: ${item.quantity}`);
    lines.push(`   ${labels.unitPrice}: ${formatPrice(item.price)}`);
    lines.push(`   ${labels.lineTotal}: ${formatPrice(subtotal)}`);
    lines.push('');
  });

  lines.push(`${labels.orderTotal}: ${formatPrice(orderTotal)}`);
  lines.push(labels.itemCount.replace('{count}', String(totalItemCount)));
  lines.push('');
  lines.push(labels.thanks);

  return lines.join('\n');
}
