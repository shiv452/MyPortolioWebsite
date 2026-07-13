// Turn each portfolio-link-block into an accordion: icon + item count + chevron,
// toggled open/closed by click or keyboard.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.portfolio-link-block').forEach(function (block) {
    var h4 = block.querySelector('h4');
    var count = block.querySelectorAll('.portfolio-link-list a').length;

    h4.innerHTML =
      '<i class="fab fa-linkedin"></i>' +
      '<span>' + h4.textContent.trim() + '</span>' +
      '<span class="link-count">' + count + '</span>' +
      '<i class="fas fa-chevron-down link-chevron"></i>';

    h4.setAttribute('tabindex', '0');
    h4.addEventListener('click', function () {
      block.classList.toggle('open');
    });
    h4.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        block.classList.toggle('open');
      }
    });
  });
});
