// Vanguard Plumbing UT - Main JavaScript

class VanguardPlumbingApp {
  constructor() {
    this.formspreeId = 'xgobbdkb'; // Vanguard Plumbing Formspree form ID
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.setupFormHandling();
    this.setupAnimations();
    this.setupGallery();
    this.setFooterYear();
  }

  // ===== NAVIGATION =====

  setupNavigation() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      this.updateActiveNavLink();
    });

    this.updateActiveNavLink();
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
      if (window.pageYOffset >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // ===== MOBILE MENU =====

  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      const icon = toggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        const icon = toggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      });
    });

    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('active');
        const icon = toggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  }

  // ===== SMOOTH SCROLLING =====

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== FORM HANDLING =====

  setupFormHandling() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleFormSubmission(form);
    });

    form.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }

    if (field.type === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    if (field.type === 'tel' && value) {
      if (value.replace(/\D/g, '').length < 7) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
      }
    }

    this.setFieldValidation(field, isValid, errorMessage);
    return isValid;
  }

  setFieldValidation(field, isValid, errorMessage) {
    const existing = field.parentNode.querySelector('.form-error');

    if (isValid) {
      field.classList.remove('error');
      if (existing) existing.remove();
    } else {
      field.classList.add('error');
      if (!existing) {
        const div = document.createElement('div');
        div.className = 'form-error';
        field.parentNode.appendChild(div);
      }
      field.parentNode.querySelector('.form-error').textContent = errorMessage;
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const existing = field.parentNode.querySelector('.form-error');
    if (existing) existing.remove();
  }

  async handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    let isValid = true;
    form.querySelectorAll('.form-control').forEach(field => {
      if (!this.validateField(field)) isValid = false;
    });

    if (!isValid) {
      this.showNotification('Please fix the errors above before submitting.', 'error');
      return;
    }

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(`https://formspree.io/f/${this.formspreeId}`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        this.showNotification("Thanks! We'll be in touch within a few hours. For emergencies call (435) 705-1295.", 'success');
        form.reset();
      } else {
        this.showNotification('Something went wrong. Please call us at (435) 705-1295.', 'error');
      }
    } catch (err) {
      console.error('Form error:', err);
      this.showNotification('Something went wrong. Please call us at (435) 705-1295.', 'error');
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  }

  // ===== SCROLL ANIMATIONS =====

  setupAnimations() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== GALLERY LIGHTBOX =====

  setupGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!items.length || !lightbox) return;

    let currentIndex = 0;
    const images = Array.from(items).map(item => item.dataset.image);

    const isImageReady = item => {
      const img = item.querySelector('img');
      // Skip items whose image failed to load (placeholder showing)
      return img && img.style.display !== 'none' && img.complete && img.naturalWidth > 0;
    };

    const open = () => {
      lightboxImage.src = images[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    const show = index => {
      currentIndex = (index + images.length) % images.length;
      lightboxImage.src = images[currentIndex];
    };

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Don't open the lightbox for placeholder tiles (image not added yet)
        if (!isImageReady(item)) return;
        currentIndex = index;
        open();
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(currentIndex - 1));
    nextBtn.addEventListener('click', () => show(currentIndex + 1));

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  // ===== FOOTER YEAR =====

  setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ===== NOTIFICATIONS =====

  showNotification(message, type = 'info') {
    const existing = document.querySelector('.vp-notification');
    if (existing) existing.remove();

    const colors = {
      success: '#10b981',
      error:   '#ef4444',
      warning: '#f59e0b',
      info:    '#2b7fff'
    };

    const notification = document.createElement('div');
    notification.className = 'vp-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      padding: 16px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      font-size: 0.95rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      animation: slideInRight 0.3s ease;
      max-width: 420px;
      line-height: 1.5;
      background-color: ${colors[type] || colors.info};
    `;

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
      }
    }, 6000);
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  new VanguardPlumbingApp();
});
