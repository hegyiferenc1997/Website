CREATE TABLE hallgatok (
  neptun    CHAR(6) PRIMARY KEY,
  nev       VARCHAR(60) NOT NULL,
  szak      VARCHAR(30) NOT NULL,
  felev     INT NOT NULL,
  varos     VARCHAR(40),
  szuletett DATE
);
CREATE TABLE targyak (
  kod    VARCHAR(6) PRIMARY KEY,
  nev    VARCHAR(60) NOT NULL,
  kredit INT NOT NULL,
  felev  INT NOT NULL
);
CREATE TABLE jelentkezesek (
  neptun CHAR(6) REFERENCES hallgatok (neptun),
  kod    VARCHAR(6) REFERENCES targyak (kod),
  jegy   INT CHECK (jegy BETWEEN 1 AND 5),
  PRIMARY KEY (neptun, kod)
);
INSERT INTO hallgatok VALUES
  ('ABC123', 'Kiss Anna',   'mérnökinformatikus',   3, 'Budapest', '2005-03-14'),
  ('BCD234', 'Nagy Béla',   'mérnökinformatikus',   1, 'Debrecen', '2006-07-02'),
  ('CDE345', 'Tóth Cili',   'gazdaságinformatikus', 3, 'Budapest', '2004-11-23'),
  ('DEF456', 'Szabó Dani',  'mérnökinformatikus',   5, 'Szeged',   NULL),
  ('EFG567', 'Varga Emma',  'gazdaságinformatikus', 1, 'Győr',     '2006-01-30'),
  ('FGH678', 'Kovács Feri', 'mérnökinformatikus',   3, NULL,       '2005-09-09');
INSERT INTO targyak VALUES
  ('ADB',  'Adatbázisok',          5, 3),
  ('DIG',  'Digitális technika',   5, 3),
  ('PROG', 'Programozási alapok',  6, 1),
  ('MAT',  'Matematika',           6, 1),
  ('OPR',  'Operációs rendszerek', 4, 1);
INSERT INTO jelentkezesek VALUES
  ('ABC123', 'ADB', 5), ('ABC123', 'DIG', 4), ('ABC123', 'PROG', 5),
  ('BCD234', 'PROG', 3), ('BCD234', 'MAT', NULL),
  ('CDE345', 'ADB', 4), ('CDE345', 'MAT', 2),
  ('DEF456', 'ADB', 3), ('DEF456', 'DIG', 5), ('DEF456', 'OPR', 4),
  ('FGH678', 'ADB', NULL), ('FGH678', 'PROG', 4);
