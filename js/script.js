/* ========================================
   METAL TECH BRASIL - Script
======================================== */

const CONFIG = {
  whatsappNumber: '5518998268952',
  companyName: 'Metal Tech Brasil'
};

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Esconde depois que a página carregar (mínimo 1.2s para ficar bonito)
    const hidePreloader = () => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);
    };

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 1200);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hidePreloader, 800);
      });
    }
  }

  // ---------- Ano dinâmico ----------
  const anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // ---------- Header scroll + progress ----------
  const header = document.getElementById('header');
  const progressBar = document.getElementById('scroll-progress');

  const onScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (progressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = `scaleX(${pct})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    // Fecha ao clicar nos links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') &&
          !mobileMenu.contains(e.target) &&
          !mobileBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ---------- Intelligent form ----------
  const tipoServico = document.getElementById('tipo-servico');
  const campoDetalhe = document.getElementById('campo-detalhe');
  const form = document.getElementById('orcamento-form');
  const submitBtn = document.getElementById('submit-btn');

  if (tipoServico && campoDetalhe) {
    tipoServico.addEventListener('change', () => {
      if (tipoServico.value) {
        campoDetalhe.classList.add('show');
      } else {
        campoDetalhe.classList.remove('show');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Abrindo WhatsApp...';
      }

      const data = new FormData(this);
      const nome = data.get('nome') || '';
      const telefone = data.get('telefone') || '';
      const servico = tipoServico?.options[tipoServico.selectedIndex]?.text || '';
      const detalhe = data.get('detalhe') || '';

      let msg = `Olá! Vim pelo site da *Metal Tech Brasil*.%0A%0A`;
      msg += `*Nome:* ${nome}%0A`;
      msg += `*Telefone:* ${telefone}%0A`;
      msg += `*Serviço:* ${servico}%0A`;
      if (detalhe) msg += `*Detalhes:* ${detalhe}%0A`;

      // Track
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'conversao',
          event_label: 'formulario'
        });
      }

      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank');

      // Reset form + botão
      this.reset();
      campoDetalhe?.classList.remove('show');
      if (submitBtn) {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar e Abrir WhatsApp';
        }, 1500);
      }
    });
  }

  // Track all WhatsApp links
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'conversao',
          event_label: 'botao'
        });
      }
    });
  });
});
