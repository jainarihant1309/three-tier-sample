CREATE TABLE IF NOT EXISTS visits (
  id serial PRIMARY KEY,
  ts timestamptz DEFAULT now()
);
