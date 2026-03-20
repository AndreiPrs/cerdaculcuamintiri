// Reservation form validation and spam protection
window.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[action*="formspree"]');
  if (!form) return;

  // Add honeypot field for spam protection
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.style.display = 'none';
  form.appendChild(honeypot);

  // Custom CAPTCHA
  const captchaQuestion = document.getElementById('captcha-question');
  const captchaInput = document.getElementById('captcha');
  let captchaAnswer = null;
  function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = a + b;
    captchaQuestion.textContent = `${a} + ${b} = ?`;
  }
  if (captchaQuestion && captchaInput) {
    generateCaptcha();
  }

  form.addEventListener('submit', function(e) {
    // Honeypot check
    if (honeypot.value) {
      e.preventDefault();
      alert('Spam detected.');
      return;
    }

    // Email validation
    const email = form.querySelector('input[name="email"]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      e.preventDefault();
      alert('Adresa de email nu este valida!');
      email.focus();
      return;
    }

    // Phone validation (Romanian format: starts with 0, 10 digits)
    const phone = form.querySelector('input[name="phone"]');
    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(phone.value)) {
      e.preventDefault();
      alert('Numarul de telefon trebuie sa fie valid (10 cifre, incepe cu 0)!');
      phone.focus();
      return;
    }

    // CAPTCHA validation
    if (captchaInput && captchaAnswer !== null) {
      if (parseInt(captchaInput.value, 10) !== captchaAnswer) {
        e.preventDefault();
        alert('Captcha gresit! Va rugam sa rezolvati corect operatia.');
        captchaInput.focus();
        generateCaptcha();
        captchaInput.value = '';
        return;
      }
    }
  });
});
