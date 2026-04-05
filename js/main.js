/* ALPHA Ontario Construction - Main JS */

// Sticky navbar
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
if (lightbox) {
  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src || item.src;
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = document.getElementById('form-success');
    if (success) {
      success.style.display = 'block';
      contactForm.reset();
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }
  });
}

// Invoice calculator
function recalcInvoice() {
  const rows = document.querySelectorAll('.invoice-item-row');
  let subtotal = 0;

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.inv-qty')?.value) || 0;
    const rate = parseFloat(row.querySelector('.inv-rate')?.value) || 0;
    const amount = qty * rate;
    const amountEl = row.querySelector('.inv-amount');
    if (amountEl) amountEl.value = amount.toFixed(2);
    subtotal += amount;
  });

  const taxRate = parseFloat(document.getElementById('tax-rate')?.value) || 13;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  if (document.getElementById('subtotal-display')) document.getElementById('subtotal-display').textContent = '$' + subtotal.toFixed(2);
  if (document.getElementById('tax-display')) document.getElementById('tax-display').textContent = '$' + taxAmount.toFixed(2);
  if (document.getElementById('total-display')) document.getElementById('total-display').textContent = '$' + total.toFixed(2);
}

function addInvoiceRow() {
  const tbody = document.getElementById('invoice-tbody');
  if (!tbody) return;
  const row = document.createElement('tr');
  row.className = 'invoice-item-row';
  row.innerHTML = `
    <td><input type="text" placeholder="Description of work..." /></td>
    <td><input type="number" class="inv-qty" value="1" min="0" oninput="recalcInvoice()" /></td>
    <td><input type="number" class="inv-rate" value="0.00" min="0" step="0.01" oninput="recalcInvoice()" /></td>
    <td><input type="text" class="inv-amount" value="0.00" readonly /></td>
    <td><button class="btn btn-sm" style="background:#fee2e2;color:#c62828;border:none;cursor:pointer;" onclick="removeRow(this)"><i class="fa-solid fa-xmark"></i></button></td>
  `;
  tbody.appendChild(row);
  recalcInvoice();
}

function removeRow(btn) {
  btn.closest('tr').remove();
  recalcInvoice();
}

function printInvoice() {
  window.print();
}

// Init invoice listeners
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.inv-qty, .inv-rate').forEach(inp => {
    inp.addEventListener('input', recalcInvoice);
  });
  const taxRateEl = document.getElementById('tax-rate');
  if (taxRateEl) taxRateEl.addEventListener('input', recalcInvoice);
  recalcInvoice();

  // Animate elements on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card, .project-card, .value-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
