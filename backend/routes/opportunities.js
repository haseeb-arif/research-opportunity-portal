const express = require('express');
const pool = require('../db');
const { validateOpportunity } = require('../validate');

const router = express.Router();

// (Steps 6 to 9 code goes here)

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const errors = validateOpportunity(req.body);
    if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });

    const { title, description, research_area, faculty_name, department,
            required_skills, positions, deadline, status } = req.body;

    const [result] = await pool.query(
      `INSERT INTO opportunities
       (title, description, research_area, faculty_name, department, required_skills, positions, deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), description.trim(), research_area.trim(), faculty_name.trim(),
       department.trim(), required_skills.trim(), Number(positions), deadline, status || 'Open']
    );

    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});


// GET ALL
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM opportunities ORDER BY created_at DESC, id DESC');
    res.status(200).json(rows);
  } catch (err) { next(err); }
});

// GET ONE
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'ID must be a positive integer' });

    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Opportunity not found' });

    res.status(200).json(rows[0]);
  } catch (err) { next(err); }
});


// UPDATE
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'ID must be a positive integer' });

    const [existing] = await pool.query('SELECT id FROM opportunities WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Opportunity not found' });

    const allowed = ['title', 'description', 'research_area', 'faculty_name', 'department',
                     'required_skills', 'positions', 'deadline', 'status'];
    const fields = allowed.filter((f) => req.body[f] !== undefined);
    if (fields.length === 0) return res.status(400).json({ error: 'No valid fields provided to update' });

    const errors = validateOpportunity(req.body, true);
    if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });

    const setClause = fields.map((f) => `${f} = ?`).join(', ');
    const values = fields.map((f) => (typeof req.body[f] === 'string' ? req.body[f].trim() : req.body[f]));

    await pool.query(`UPDATE opportunities SET ${setClause} WHERE id = ?`, [...values, id]);

    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;