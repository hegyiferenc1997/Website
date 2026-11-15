-- A made-up web shop: 5000 customers, 20 products, 20,000 orders, 40,000 order items.
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name        VARCHAR(40) NOT NULL,
  email       VARCHAR(80) NOT NULL,
  city        VARCHAR(30) NOT NULL,
  registered  DATE NOT NULL
);
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name       VARCHAR(40) NOT NULL,
  category   VARCHAR(20) NOT NULL,
  price      NUMERIC(10, 2) NOT NULL
);
CREATE TABLE orders (
  order_id    INT PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers (customer_id),
  order_date  DATE NOT NULL,
  status      VARCHAR(12) NOT NULL
);
CREATE TABLE order_items (
  order_id   INT REFERENCES orders (order_id),
  product_id INT REFERENCES products (product_id),
  qty        INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
INSERT INTO products VALUES
  (1, 'Wireless mouse', 'peripheral', 4990),         (2, 'Mechanical keyboard', 'peripheral', 24990),
  (3, '27-inch monitor', 'monitor', 69990),          (4, 'USB-C dock', 'accessory', 19990),
  (5, 'Webcam', 'peripheral', 12990),                (6, 'Headphones', 'audio', 15990),
  (7, 'Speaker', 'audio', 9990),                     (8, '1 TB SSD', 'storage', 29990),
  (9, 'External HDD 2 TB', 'storage', 24990),        (10, 'Laptop bag', 'accessory', 8990),
  (11, 'Mouse pad', 'accessory', 2990),              (12, '24-inch monitor', 'monitor', 44990),
  (13, 'Microphone', 'audio', 19990),                (14, 'USB stick 64 GB', 'storage', 3990),
  (15, 'HDMI cable', 'accessory', 1990),             (16, 'Gaming mouse', 'peripheral', 14990),
  (17, 'Monitor arm', 'accessory', 11990),           (18, 'Router', 'network', 22990),
  (19, '8-port switch', 'network', 13990),           (20, 'Wi-Fi adapter', 'network', 5990);
-- Customers, orders and items are "pseudo-random" but always identical data (generate_series).
INSERT INTO customers
SELECT i, 'Customer ' || i, 'customer' || i || '@example.com',
       (ARRAY['Budapest', 'Debrecen', 'Szeged', 'Pecs', 'Gyor'])[1 + i % 5],
       DATE '2024-01-01' + (i % 600)
FROM generate_series(1, 5000) AS i;
INSERT INTO orders
SELECT i, 1 + (i * 37) % 5000, DATE '2025-01-01' + (i * 13) % 670,
       (ARRAY['done', 'done', 'done', 'shipping', 'cancelled'])[1 + i % 5]
FROM generate_series(1, 20000) AS i;
INSERT INTO order_items
SELECT o.order_id, p.product_id, 1 + (o.order_id + p.product_id) % 3, p.price
FROM orders o
JOIN products p ON p.product_id IN (1 + o.order_id % 20, 1 + (o.order_id * 7 + 3) % 20);
ANALYZE;
