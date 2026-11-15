-- Egy kitalált webshop: 5000 vásárló, 20 termék, 20 000 rendelés, 40 000 rendelési tétel.
CREATE TABLE vasarlok (
  vasarlo_id  INT PRIMARY KEY,
  nev         VARCHAR(40) NOT NULL,
  email       VARCHAR(80) NOT NULL,
  varos       VARCHAR(30) NOT NULL,
  regisztralt DATE NOT NULL
);
CREATE TABLE termekek (
  termek_id INT PRIMARY KEY,
  nev       VARCHAR(40) NOT NULL,
  kategoria VARCHAR(20) NOT NULL,
  ar        NUMERIC(10, 2) NOT NULL
);
CREATE TABLE rendelesek (
  rendeles_id INT PRIMARY KEY,
  vasarlo_id  INT NOT NULL REFERENCES vasarlok (vasarlo_id),
  datum       DATE NOT NULL,
  statusz     VARCHAR(12) NOT NULL
);
CREATE TABLE tetelek (
  rendeles_id INT REFERENCES rendelesek (rendeles_id),
  termek_id   INT REFERENCES termekek (termek_id),
  db          INT NOT NULL,
  egysegar    NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (rendeles_id, termek_id)
);
INSERT INTO termekek VALUES
  (1, 'Vezeték nélküli egér', 'periféria', 4990),   (2, 'Mechanikus billentyűzet', 'periféria', 24990),
  (3, '27 colos monitor', 'monitor', 69990),         (4, 'USB-C dokkoló', 'kiegészítő', 19990),
  (5, 'Webkamera', 'periféria', 12990),              (6, 'Fejhallgató', 'audió', 15990),
  (7, 'Hangszóró', 'audió', 9990),                   (8, '1 TB SSD', 'tárolás', 29990),
  (9, 'Külső HDD 2 TB', 'tárolás', 24990),           (10, 'Laptoptáska', 'kiegészítő', 8990),
  (11, 'Egérpad', 'kiegészítő', 2990),               (12, '24 colos monitor', 'monitor', 44990),
  (13, 'Mikrofon', 'audió', 19990),                  (14, 'Pendrive 64 GB', 'tárolás', 3990),
  (15, 'HDMI kábel', 'kiegészítő', 1990),            (16, 'Gamer egér', 'periféria', 14990),
  (17, 'Monitorkar', 'kiegészítő', 11990),           (18, 'Router', 'hálózat', 22990),
  (19, 'Switch 8 portos', 'hálózat', 13990),         (20, 'Wi-Fi adapter', 'hálózat', 5990);
-- A vásárlók, rendelések és tételek „álvéletlen”, de mindig ugyanolyan adatok (generate_series).
INSERT INTO vasarlok
SELECT i, 'Vásárló ' || i, 'vasarlo' || i || '@pelda.hu',
       (ARRAY['Budapest', 'Debrecen', 'Szeged', 'Pécs', 'Győr'])[1 + i % 5],
       DATE '2024-01-01' + (i % 600)
FROM generate_series(1, 5000) AS i;
INSERT INTO rendelesek
SELECT i, 1 + (i * 37) % 5000, DATE '2025-01-01' + (i * 13) % 670,
       (ARRAY['kész', 'kész', 'kész', 'szállítás', 'törölt'])[1 + i % 5]
FROM generate_series(1, 20000) AS i;
INSERT INTO tetelek
SELECT r.rendeles_id, t.termek_id, 1 + (r.rendeles_id + t.termek_id) % 3, t.ar
FROM rendelesek r
JOIN termekek t ON t.termek_id IN (1 + r.rendeles_id % 20, 1 + (r.rendeles_id * 7 + 3) % 20);
ANALYZE;
