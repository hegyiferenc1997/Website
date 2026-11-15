CREATE TABLE students (
  neptun   CHAR(6) PRIMARY KEY,
  name     VARCHAR(60) NOT NULL,
  major    VARCHAR(30) NOT NULL,
  semester INT NOT NULL,
  city     VARCHAR(40),
  born     DATE
);
CREATE TABLE courses (
  code     VARCHAR(6) PRIMARY KEY,
  name     VARCHAR(60) NOT NULL,
  credits  INT NOT NULL,
  semester INT NOT NULL
);
CREATE TABLE enrollments (
  neptun CHAR(6) REFERENCES students (neptun),
  code   VARCHAR(6) REFERENCES courses (code),
  grade  INT CHECK (grade BETWEEN 1 AND 5),
  PRIMARY KEY (neptun, code)
);
INSERT INTO students VALUES
  ('ABC123', 'Anna Kiss',   'computer engineering', 3, 'Budapest', '2005-03-14'),
  ('BCD234', 'Bela Nagy',   'computer engineering', 1, 'Debrecen', '2006-07-02'),
  ('CDE345', 'Cili Toth',   'business informatics', 3, 'Budapest', '2004-11-23'),
  ('DEF456', 'Dani Szabo',  'computer engineering', 5, 'Szeged',   NULL),
  ('EFG567', 'Emma Varga',  'business informatics', 1, 'Gyor',     '2006-01-30'),
  ('FGH678', 'Feri Kovacs', 'computer engineering', 3, NULL,       '2005-09-09');
INSERT INTO courses VALUES
  ('ADB',  'Databases',          5, 3),
  ('DIG',  'Digital Technology', 5, 3),
  ('PROG', 'Programming Basics', 6, 1),
  ('MAT',  'Mathematics',        6, 1),
  ('OPR',  'Operating Systems',  4, 1);
INSERT INTO enrollments VALUES
  ('ABC123', 'ADB', 5), ('ABC123', 'DIG', 4), ('ABC123', 'PROG', 5),
  ('BCD234', 'PROG', 3), ('BCD234', 'MAT', NULL),
  ('CDE345', 'ADB', 4), ('CDE345', 'MAT', 2),
  ('DEF456', 'ADB', 3), ('DEF456', 'DIG', 5), ('DEF456', 'OPR', 4),
  ('FGH678', 'ADB', NULL), ('FGH678', 'PROG', 4);
