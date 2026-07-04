// Toggle .open on portfolio blocks when their heading is clicked or activated via keyboard
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.portfolio-link-block h4').forEach(function (h) {
    h.setAttribute('tabindex', '0');
    h.addEventListener('click', function () {
      this.parentElement.classList.toggle('open');
    });
    h.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });
});
