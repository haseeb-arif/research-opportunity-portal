const TEXT_FIELDS = ['title', 'description', 'research_area', 'faculty_name', 'department', 'required_skills'];

function validateOpportunity(body, partial = false) {
  const errors = [];

  for (const f of TEXT_FIELDS) {
    if (!partial || body[f] !== undefined) {
      if (body[f] === undefined || body[f] === null || String(body[f]).trim() === '') {
        errors.push(`${f} is required`);
      }
    }
  }

  if (!partial || body.positions !== undefined) {
    const n = Number(body.positions);
    if (body.positions === '' || !Number.isInteger(n) || n < 1) {
      errors.push('positions must be a whole number of at least 1');
    }
  }

  if (!partial || body.deadline !== undefined) {
    const d = String(body.deadline ?? '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || isNaN(Date.parse(d))) {
      errors.push('deadline must be a valid date in YYYY-MM-DD format');
    }
  }

  if (body.status !== undefined && !['Open', 'Closed'].includes(body.status)) {
    errors.push("status must be 'Open' or 'Closed'");
  }

  return errors;
}

module.exports = { validateOpportunity, TEXT_FIELDS };