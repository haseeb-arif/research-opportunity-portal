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