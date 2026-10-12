const API_URL = '/api/opportunities';

function showAlert(message, type = 'success') {
  const container = document.getElementById('alert-container');
  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

// Escape text from the database before putting it into HTML
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function statusBadge(status) {
  const cls = status === 'Open' ? 'badge-open' : 'badge-closed';
  return `<span class="badge ${cls}">${escapeHtml(status)}</span>`;
}

async function loadOpportunities() {
  const list = document.getElementById('opportunities-list');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Server returned ' + res.status);
    renderOpportunities(await res.json());
  } catch (err) {
    list.innerHTML = '';
    showAlert('Could not load opportunities. Is the server running?', 'danger');
  }
}

function renderOpportunities(items) {
  const list = document.getElementById('opportunities-list');

  if (items.length === 0) {
    list.innerHTML = '<p class="text-muted">No research opportunities yet. Click "+ New Opportunity" to add one.</p>';
    return;
  }

  list.innerHTML = items.map((o) => `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm opportunity-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0 me-2">${escapeHtml(o.title)}</h5>
            ${statusBadge(o.status)}
          </div>
          <p class="text-muted small mb-2">${escapeHtml(o.research_area)} &middot; ${escapeHtml(o.department)}</p>
          <p class="small mb-1"><strong>Faculty:</strong> ${escapeHtml(o.faculty_name)}</p>
          <p class="small mb-1"><strong>Positions:</strong> ${escapeHtml(o.positions)}</p>
          <p class="small mb-0"><strong>Deadline:</strong> ${escapeHtml(o.deadline)}</p>
        </div>
        <div class="card-footer bg-white d-flex flex-wrap gap-2">
          <button class="btn btn-sm btn-outline-primary" data-action="view" data-id="${o.id}">View</button>
          <button class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${o.id}">Edit</button>
          <button class="btn btn-sm btn-outline-warning" data-action="close" data-id="${o.id}" ${o.status === 'Closed' ? 'disabled' : ''}>Close</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${o.id}">Delete</button>
        </div>
      </div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', loadOpportunities);

// One click listener for all card buttons
document.getElementById('opportunities-list').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;

  if (action === 'view') viewOpportunity(id);
  // edit, close and delete are added in later steps
});

async function viewOpportunity(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const o = await res.json();
    if (!res.ok) throw new Error(o.error || 'Could not load opportunity');

    document.getElementById('details-title').textContent = o.title;
    document.getElementById('details-body').innerHTML = `
      <div class="mb-3">${statusBadge(o.status)}</div>
      <dl class="row mb-0">
        <dt class="col-sm-4">Description</dt><dd class="col-sm-8">${escapeHtml(o.description)}</dd>
        <dt class="col-sm-4">Research area</dt><dd class="col-sm-8">${escapeHtml(o.research_area)}</dd>
        <dt class="col-sm-4">Faculty member</dt><dd class="col-sm-8">${escapeHtml(o.faculty_name)}</dd>
        <dt class="col-sm-4">Department</dt><dd class="col-sm-8">${escapeHtml(o.department)}</dd>
        <dt class="col-sm-4">Required skills</dt><dd class="col-sm-8">${escapeHtml(o.required_skills)}</dd>
        <dt class="col-sm-4">Positions</dt><dd class="col-sm-8">${escapeHtml(o.positions)}</dd>
        <dt class="col-sm-4">Deadline</dt><dd class="col-sm-8">${escapeHtml(o.deadline)}</dd>
      </dl>`;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('detailsModal')).show();
  } catch (err) {
    showAlert(escapeHtml(err.message), 'danger');
  }
}