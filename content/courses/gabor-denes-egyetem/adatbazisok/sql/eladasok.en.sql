-- A made-up electronics chain's data warehouse in a star schema: 3 dimension tables and 1 fact table.
-- Dimension: the calendar (every day of 2025 and 2026).
CREATE TABLE dim_date (
  date_id   INT PRIMARY KEY,           -- e.g. 20250314
  full_date DATE NOT NULL,
  year      INT NOT NULL,
  quarter   INT NOT NULL,
  month     INT NOT NULL
);
-- Dimension: the products.
CREATE TABLE dim_product (
  product_id INT PRIMARY KEY,
  name       VARCHAR(40) NOT NULL,
  category   VARCHAR(20) NOT NULL,
  price      NUMERIC(10, 2) NOT NULL
);
-- Dimension: the stores.
CREATE TABLE dim_store (
  store_id INT PRIMARY KEY,
  city     VARCHAR(20) NOT NULL,
  region   VARCHAR(20) NOT NULL
);
-- Fact table: every row is a sale (which day, which product, which store, how many).
CREATE TABLE fact_sales (
  date_id    INT REFERENCES dim_date (date_id),
  product_id INT REFERENCES dim_product (product_id),
  store_id   INT REFERENCES dim_store (store_id),
  qty        INT NOT NULL,
  revenue    NUMERIC(12, 2) NOT NULL
);
INSERT INTO dim_date
SELECT TO_CHAR(d, 'YYYYMMDD')::INT, d, EXTRACT(YEAR FROM d), EXTRACT(QUARTER FROM d), EXTRACT(MONTH FROM d)
FROM generate_series(DATE '2025-01-01', DATE '2026-12-31', INTERVAL '1 day') AS g (d);
INSERT INTO dim_product VALUES
  (1, 'Wireless mouse', 'peripheral', 4990),  (2, 'Mechanical keyboard', 'peripheral', 24990),
  (3, '27-inch monitor', 'monitor', 69990),   (4, '24-inch monitor', 'monitor', 44990),
  (5, 'Headphones', 'audio', 15990),          (6, 'Speaker', 'audio', 9990),
  (7, '1 TB SSD', 'storage', 29990),          (8, 'Pen drive 64 GB', 'storage', 3990);
INSERT INTO dim_store VALUES
  (1, 'Budapest', 'Central'), (2, 'Debrecen', 'East'), (3, 'Szeged', 'South'), (4, 'Gyor', 'West');
-- "Pseudo-random" but always identical sales: every day, in every store, two products.
INSERT INTO fact_sales
SELECT TO_CHAR(DATE '2025-01-01' + i, 'YYYYMMDD')::INT, p.product_id, s, x.qty, x.qty * p.price
FROM generate_series(0, 729) AS i,
     generate_series(1, 4) AS s,
     generate_series(0, 1) AS k,
     LATERAL (SELECT 1 + (i * 7 + s * 3 + k * 5) % 8 AS pid, 1 + (i + s + k) % 4 AS qty) AS x
     JOIN dim_product p ON p.product_id = x.pid;
ANALYZE;
