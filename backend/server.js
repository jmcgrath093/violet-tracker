const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all entries
app.get('/api/entries', (req, res) => {
  db.all('SELECT * FROM entries ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Create a new entry
app.post('/api/entries', (req, res) => {
  const { type, subItem, timestamp, notes } = req.body;
  if (!type || !subItem || !timestamp) {
    res.status(400).json({ error: 'Type, subItem and timestamp are required' });
    return;
  }
  
  db.run(
    'INSERT INTO entries (type, subItem, timestamp, notes) VALUES (?, ?, ?, ?)',
    [type, subItem, timestamp, notes],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, type, subItem, timestamp, notes });
    }
  );
});

// Update an existing entry
app.put('/api/entries/:id', (req, res) => {
  const { id } = req.params;
  const { type, subItem, timestamp, notes } = req.body;
  if (!type || !subItem || !timestamp) {
    res.status(400).json({ error: 'Type, subItem and timestamp are required' });
    return;
  }
  
  db.run(
    'UPDATE entries SET type = ?, subItem = ?, timestamp = ?, notes = ? WHERE id = ?',
    [type, subItem, timestamp, notes, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, type, subItem, timestamp, notes });
    }
  );
});

// Get unique tags for a type to provide autocomplete suggestions
app.get('/api/tags', (req, res) => {
  const { type } = req.query;
  if (!type) {
    res.status(400).json({ error: 'Type query parameter is required' });
    return;
  }

  // Get distinct subItems for the given type
  db.all('SELECT DISTINCT subItem FROM entries WHERE type = ?', [type], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const tags = rows.map(r => r.subItem);
    res.json({ data: tags });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
