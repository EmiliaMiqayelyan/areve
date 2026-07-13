"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const sequelize_1 = require("../config/sequelize");
const models_1 = require("../models");
async function seed() {
    await sequelize_1.sequelize.authenticate();
    const productCount = await models_1.Product.count();
    if (productCount > 0) {
        console.log("Seed skipped: products already exist");
        return;
    }
    await models_1.Product.bulkCreate([
        { id: "1", name: "Golden Sunburst Clutch", price: 89, image: "/images/prod-bag-a.png", category: "bags", badge: "New", description: "Hand-beaded in a radiant sunburst pattern.", status: "active" },
        { id: "2", name: "Sage Garden Bag", price: 120, image: "/images/prod-bag-b.png", category: "bags", badge: "Bestseller", description: "Soft sage and cream geometric pattern.", status: "active" },
        { id: "3", name: "Bloom Evening Mini", price: 95, image: "/images/prod-bag-c.png", category: "bags", badge: "Limited", description: "Dusty rose and pearl beads.", status: "active" },
    ]);
    await models_1.Review.bulkCreate([
        { id: "1", name: "Sophie Laurent", location: "Paris, France", product: "Golden Sunburst Clutch", rating: 5, comment: "Absolutely stunning quality.", status: "approved" },
        { id: "2", name: "Aline Marques", location: "São Paulo, Brazil", product: "Cloud Bunny", rating: 5, comment: "The craftsmanship is exceptional.", status: "approved" },
    ]);
    await models_1.Faq.bulkCreate([
        { id: "f1", question: "Are all products handmade?", answer: "Yes — every item at AREVE is handmade.", sortOrder: 1 },
        { id: "f2", question: "How long does delivery take?", answer: "Standard orders ship in 3–5 business days.", sortOrder: 2 },
    ]);
    await models_1.Gallery.bulkCreate([
        { id: "g1", src: "/images/gallery-light-1.png", alt: "Collection flat lay", cols: 2, sortOrder: 0 },
        { id: "g2", src: "/images/gallery-light-2.png", alt: "Lifestyle shoot", cols: 1, sortOrder: 1 },
    ]);
    await models_1.Order.bulkCreate([
        { id: "ORD-1004", customerName: "Emma Thornton", customerEmail: "emma@example.com", total: 58, status: "shipped", address: "123 Street", city: "London", state: "LDN", zipCode: "12345" },
        { id: "ORD-1005", customerName: "Sophie Laurent", customerEmail: "sophie@example.com", total: 89, status: "pending", address: "456 Avenue", city: "Paris", state: "Ile-de-France", zipCode: "75000" },
    ]);
    await models_1.OrderItem.bulkCreate([
        { id: (0, crypto_1.randomUUID)(), orderId: "ORD-1004", productId: "7", productName: "Sun Drops Set", quantity: 1, unitPrice: 58 },
        { id: (0, crypto_1.randomUUID)(), orderId: "ORD-1005", productId: "1", productName: "Golden Sunburst Clutch", quantity: 1, unitPrice: 89 },
    ]);
    console.log("Seed completed");
}
seed()
    .then(() => sequelize_1.sequelize.close())
    .catch(async (error) => {
    console.error(error);
    await sequelize_1.sequelize.close();
    process.exit(1);
});
