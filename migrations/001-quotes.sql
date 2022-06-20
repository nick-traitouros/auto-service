
--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE Quotes (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL,
  zip_code TEXT NOT NULL,
  date_of_birth DATE,
  monthly_premium FLOAT,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Quotes (id, name, zip_code, date_of_birth, monthly_premium, created_at) VALUES (1, "Nick Traitouros", "11415", "1983-08-04", 612.47, "2022-06-10 20:11:22");
INSERT INTO Quotes (id, name, zip_code, date_of_birth, monthly_premium, created_at) VALUES (2, "Bill Gates", "11803", "1977-04-04", 603.35, "2022-06-12 20:11:22");
INSERT INTO Quotes (id, name, zip_code, date_of_birth, monthly_premium, created_at) VALUES (3, "Steve Jobs", "12561", "1975-08-04", 602.40, "2022-06-13 20:11:22");

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE Quotes;