import { Admin } from "./admin.model";
import { Category } from "./category.model";
import { Contact } from "./contact.model";
import { Faq } from "./faq.model";
import { Gallery } from "./gallery.model";
import { OrderItem } from "./order-item.model";
import { Order } from "./order.model";
import { Product } from "./product.model";
import { Review } from "./review.model";
import { Setting } from "./setting.model";

Order.hasMany(OrderItem, { foreignKey: "orderId", sourceKey: "id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", targetKey: "id" });

export { Admin, Category, Contact, Faq, Gallery, Order, OrderItem, Product, Review, Setting };
