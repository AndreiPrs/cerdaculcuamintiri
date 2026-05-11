document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = Array.from(document.querySelectorAll('.dropdown'));

  dropdowns.forEach(function (dropdown) {
    const toggle = dropdown.querySelector('a');
    if (!toggle) return;

    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.add('dropdown-toggle');

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      const isOpen = dropdown.classList.toggle('open');

      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove('open');
          const otherToggle = other.querySelector('a');
          if (otherToggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });

      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    dropdown.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        dropdown.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.dropdown')) {
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('a');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  const submenuItems = document.querySelectorAll('.dropdown-content a');
  submenuItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const dropdown = item.closest('.dropdown');
      if (dropdown) {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('a');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});
