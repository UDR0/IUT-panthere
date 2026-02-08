(function () {
  function setFieldError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    var id = field.getAttribute('id');
    var errId = id ? (id + '-error') : null;
    var existing = errId ? document.getElementById(errId) : null;
    if (!existing) {
      existing = document.createElement('div');
      if (errId) existing.id = errId;
      existing.className = 'field-error';
      existing.setAttribute('aria-live', 'polite');
      field.parentNode.insertBefore(existing, field.nextSibling);
    }
    existing.textContent = message;
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    var id = field.getAttribute('id');
    var err = id ? document.getElementById(id + '-error') : null;
    if (err) err.textContent = '';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var messages = document.getElementById('form-messages');

    ['name','email','message','consent'].forEach(function(name){
      var field = form.querySelector('[name="'+name+'"]');
      if (!field) return;
      field.addEventListener('input', function(){ clearFieldError(field); });
      field.addEventListener('change', function(){ clearFieldError(field); });
    });

    form.addEventListener('submit', function (e) {
      var errors = [];

      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      var consent = form.querySelector('[name="consent"]');

      if (name && !name.value.trim()) {
        errors.push('Veuillez renseigner votre nom.');
        setFieldError(name, 'Nom requis.');
      }
      if (email) {
        if (!email.value.trim()) {
          errors.push('Veuillez renseigner votre email.');
          setFieldError(email, 'Email requis.');
        } else if (!isValidEmail(email.value.trim())) {
          errors.push('Adresse email invalide (ex: nom@exemple.com).');
          setFieldError(email, 'Email invalide. Exemple : nom@exemple.com');
        }
      }
      if (message && !message.value.trim()) {
        errors.push('Veuillez écrire un message.');
        setFieldError(message, 'Message requis.');
      }
      if (consent && !consent.checked) {
        errors.push('Veuillez accepter l’utilisation de vos informations pour être recontacté.');
        setFieldError(consent, 'Consentement requis.');
      }

      if (errors.length) {
        e.preventDefault();
        if (messages) {
          messages.textContent = errors.join(' ');
        }
        // focus first invalid
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      } else {
        if (messages) messages.textContent = 'Merci ! Votre message a bien été envoyé (simulation).';
        // prevent actual submit in this static site
        e.preventDefault();
      }
    });
  });
})();
