CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image MEDIUMTEXT NOT NULL,
  category ENUM('bags','toys','accessories') NOT NULL,
  badge VARCHAR(40) NULL,
  description TEXT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(120) NULL,
  product VARCHAR(120) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  status ENUM('approved','pending','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id VARCHAR(64) PRIMARY KEY,
  question VARCHAR(400) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(64) PRIMARY KEY,
  src MEDIUMTEXT NOT NULL,
  alt VARCHAR(180) NOT NULL,
  cols TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(160) NOT NULL,
  customer_email VARCHAR(160) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','shipped','delivered') NOT NULL DEFAULT 'pending',
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(64) NOT NULL,
  product_name VARCHAR(120) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY,
  store_name VARCHAR(120) NOT NULL,
  tagline VARCHAR(240) NOT NULL,
  footer_description TEXT NOT NULL,
  support_email VARCHAR(160) NOT NULL,
  business_phone VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  instagram_url VARCHAR(255) NOT NULL,
  facebook_url VARCHAR(255) NOT NULL,
  whatsapp_url VARCHAR(255) NOT NULL,
  tiktok_url VARCHAR(255) NOT NULL DEFAULT '',
  youtube_url VARCHAR(255) NOT NULL DEFAULT '',
  site_content JSON NULL
);

INSERT IGNORE INTO settings (
  id, store_name, tagline, footer_description, support_email, business_phone, address, instagram_url, facebook_url, whatsapp_url, tiktok_url, youtube_url, site_content
) VALUES (
  1, 'AREVE', 'Handcrafted · Unique · Made with Love',
  'Every piece is a tiny sun — made with warmth, patience, and the kind of love only hands can give.',
  'care@areve.com', '+1 (555) 123-4567',
  '123 Artisan Maker Way, Creative District, NY 10012',
  'https://instagram.com/areve_brand',
  'https://facebook.com/areve.brand',
  'https://wa.me/message/xyz',
  '',
  '',
  NULL
);
