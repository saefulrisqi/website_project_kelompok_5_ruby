document.addEventListener('DOMContentLoaded', function () {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const url = el.getAttribute('data-include');
    fetch(url)
      .then(r => r.text())
      .then(html => {
        el.innerHTML = html;
      })
      .catch(err => console.error('Include error:', err));
  });
});

// Dispatch an event when all includes have been loaded (useful for init sequencing)
document.addEventListener('DOMContentLoaded', function () {
  window._includesPending = true;
  const includes = Array.from(document.querySelectorAll('[data-include]'));
  if (includes.length === 0) {
    // no includes -> still dispatch so scripts can continue
    document.dispatchEvent(new Event('includes:loaded'));
    return;
  }

  let remaining = includes.length;
  includes.forEach(el => {
    const url = el.getAttribute('data-include');
    fetch(url)
      .then(r => r.text())
      .then(html => {
        el.innerHTML = html;
      })
      .catch(err => console.error('Include error:', err))
      .finally(() => {
        remaining -= 1;
        if (remaining === 0) {
          // all includes done
          window._includesPending = false;
          document.dispatchEvent(new Event('includes:loaded'));
        }
      });
  });
});
