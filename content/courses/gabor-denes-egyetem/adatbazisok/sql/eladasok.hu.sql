-- Egy kitalált műszaki üzletlánc adattárháza csillagsémában: 3 dimenziótábla és 1 ténytábla.
-- Dimenzió: a naptár (2025 és 2026 minden napja).
CREATE TABLE dim_datum (
  datum_id INT PRIMARY KEY,            -- pl. 20250314
  datum    DATE NOT NULL,
  ev       INT NOT NULL,
  negyedev INT NOT NULL,
  honap    INT NOT NULL
);
-- Dimenzió: a termékek.
CREATE TABLE dim_termek (
  termek_id INT PRIMARY KEY,
  nev       VARCHAR(40) NOT NULL,
  kategoria VARCHAR(20) NOT NULL,
  ar        NUMERIC(10, 2) NOT NULL
);
-- Dimenzió: a boltok.
CREATE TABLE dim_bolt (
  bolt_id INT PRIMARY KEY,
  varos   VARCHAR(20) NOT NULL,
  regio   VARCHAR(20) NOT NULL
);
-- Ténytábla: minden sor egy eladás (melyik nap, melyik termék, melyik bolt, mennyi).
CREATE TABLE teny_eladas (
  datum_id  INT REFERENCES dim_datum (datum_id),
  termek_id INT REFERENCES dim_termek (termek_id),
  bolt_id   INT REFERENCES dim_bolt (bolt_id),
  db        INT NOT NULL,
  bevetel   NUMERIC(12, 2) NOT NULL
);
INSERT INTO dim_datum
SELECT TO_CHAR(d, 'YYYYMMDD')::INT, d, EXTRACT(YEAR FROM d), EXTRACT(QUARTER FROM d), EXTRACT(MONTH FROM d)
FROM generate_series(DATE '2025-01-01', DATE '2026-12-31', INTERVAL '1 day') AS g (d);
INSERT INTO dim_termek VALUES
  (1, 'Vezeték nélküli egér', 'periféria', 4990), (2, 'Mechanikus billentyűzet', 'periféria', 24990),
  (3, '27 colos monitor', 'monitor', 69990),       (4, '24 colos monitor', 'monitor', 44990),
  (5, 'Fejhallgató', 'audió', 15990),              (6, 'Hangszóró', 'audió', 9990),
  (7, '1 TB SSD', 'tárolás', 29990),               (8, 'Pendrive 64 GB', 'tárolás', 3990);
INSERT INTO dim_bolt VALUES
  (1, 'Budapest', 'Közép'), (2, 'Debrecen', 'Kelet'), (3, 'Szeged', 'Dél'), (4, 'Győr', 'Nyugat');
-- „Álvéletlen”, de mindig ugyanolyan eladások: minden nap, minden boltban két termék.
INSERT INTO teny_eladas
SELECT TO_CHAR(DATE '2025-01-01' + i, 'YYYYMMDD')::INT, p.termek_id, b, x.db, x.db * p.ar
FROM generate_series(0, 729) AS i,
     generate_series(1, 4) AS b,
     generate_series(0, 1) AS k,
     LATERAL (SELECT 1 + (i * 7 + b * 3 + k * 5) % 8 AS tid, 1 + (i + b + k) % 4 AS db) AS x
     JOIN dim_termek p ON p.termek_id = x.tid;
ANALYZE;
