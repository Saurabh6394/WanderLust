(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      // Bootstrap validation
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      // ⭐ Star rating validation (ONLY if exists)
      const ratingGroup = form.querySelector('.star-rating');

      if (ratingGroup) {
        const ratingChecked = form.querySelector(
          'input[name="review[rating]"]:checked'
        );

        if (!ratingChecked) {
          event.preventDefault();
          event.stopPropagation();
          ratingGroup.classList.add('is-invalid');
        } else {
          ratingGroup.classList.remove('is-invalid');
        }
      }

      form.classList.add('was-validated');
    }, false);
  });
})();


window.addEventListener("resize", () => {
  const sidebar = document.getElementById("mobileSidebar");

  if (!sidebar) return;

  if (window.innerWidth >= 768) {
    const instance = bootstrap.Offcanvas.getInstance(sidebar);
    if (instance) {
      instance.hide();
    }
  }
});
