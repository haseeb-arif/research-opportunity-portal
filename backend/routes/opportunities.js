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

module.exports = router;