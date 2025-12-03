const express = require('express');
const { Pool } = require('pg');
const { register, Counter } = require('prom-client');

const app = express();
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'testdb',
  port: process.env.DB_PORT || 5432
});

const reqs = new Counter({ name: 'http_requests_total', help: 'total http requests' });

app.get('/api/hello', async (req, res) => {
  reqs.inc();
  try {
    const { rows } = await pool.query('SELECT NOW() as now');
    res.json({ message: 'Hello from backend', time: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`backend listening ${port}`));
