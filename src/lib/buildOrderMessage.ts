import { formatPrice } from './currency';

export type OrderLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderMessageLabels = {
  introSingular: string;
  introPlural: string;
  link: string;
  price: string;
  orderTotal: string;
  thanks: string;
};

export function buildOrderMessage(
  items: OrderLineItem[],
  orderTotal: number,
  _totalItemCount: number,
  siteOrigin: string,
  labels: OrderMessageLabels
): string {
  const isSingle = items.length === 1;
  const lines: string[] = [isSingle ? labels.introSingular : labels.introPlural, ''];

  items.forEach((item, index) => {
    const productUrl = `${siteOrigin}/products/${item.id}`;
    const linePrice = item.price * item.quantity;

    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`   ${labels.link}: ${productUrl}`);
    lines.push(`   ${labels.price}: ${formatPrice(linePrice)}`);
    lines.push('');
  });

  if (!isSingle) {
    lines.push(`${labels.orderTotal} ${formatPrice(orderTotal)}`);
    lines.push('');
  }

  lines.push(labels.thanks);

  return lines.join('\n');
}
