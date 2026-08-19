/**
 * GATA NEGA - SCRIPT COMEMORATIVO (ENCONTRADA)
 * Confetes Festivos • Galeria de Fotos • Compartilhamento
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryModal();
  initConfetti();
  initShareFound();
});

/**
 * 1. Modal / Lightbox para as fotos da galeria
 */
function initGalleryModal() {
  const triggers = document.querySelectorAll('.gallery-trigger');
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('closePhotoModal');

  if (!modal || !modalImg) return;

  const openModal = (src, caption) => {
    modalImg.src = src;
    modalCaption.textContent = caption || 'Gata Nega em casa! 💖🐾';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach(img => {
    img.addEventListener('click', () => {
      const fullSrc = img.getAttribute('data-full') || img.src;
      const caption = img.getAttribute('data-caption') || img.alt;
      openModal(fullSrc, caption);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-img-wrapper')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 2. Efeito de Confetes Festivos (Canvas Leve e Autônomo)
 */
let launchBurstGlobal = null;

function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#059669', '#10b981', '#34d399', '#f59e0b', '#fbbf24', '#f43f5e', '#3b82f6', '#8b5cf6'];
  const particles = [];

  function createParticle(x, y, isBurst = false) {
    const angle = isBurst ? Math.random() * Math.PI * 2 : (Math.random() * 0.4 + 0.3) * Math.PI;
    const speed = isBurst ? Math.random() * 7 + 3 : Math.random() * 3 + 2;
    return {
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : -10,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.cos(angle) * speed * (isBurst ? 1 : (Math.random() - 0.5) * 2),
      vy: isBurst ? Math.sin(angle) * speed - 4 : Math.sin(angle) * speed + 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      gravity: 0.12,
      decay: isBurst ? 0.008 : 0.004
    };
  }

  function launchBurst(originX = width / 2, originY = height / 3, count = 70) {
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(originX, originY, true));
    }
  }

  launchBurstGlobal = launchBurst;

  // Explosão inicial de comemoração
  setTimeout(() => {
    launchBurst(width * 0.3, height * 0.35, 45);
    launchBurst(width * 0.7, height * 0.35, 45);
  }, 350);

  // Pequena chuva leve de confetes nos primeiros 4 segundos
  const interval = setInterval(() => {
    if (particles.length < 100) {
      for (let i = 0; i < 4; i++) {
        particles.push(createParticle());
      }
    }
  }, 120);

  setTimeout(() => clearInterval(interval), 4000);

  let animationId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();
}

/**
 * 3. Compartilhar a Boa Notícia que a Nega foi encontrada
 */
function initShareFound() {
  const shareBtn = document.getElementById('btnSharePage');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    // Solta confetes extras ao clicar!
    if (typeof launchBurstGlobal === 'function') {
      launchBurstGlobal(window.innerWidth / 2, window.innerHeight * 0.6, 60);
    }

    const pageUrl = window.location.href.split('?')[0];
    const shareTitle = '🎉 FINAL FELIZ: A Gata NEGA Foi Encontrada! 🐾🏠';
    const shareText = '🎉 *FINAL FELIZ: A GATA NEGA FOI ENCONTRADA!* 🐾🏠\n\nNossa gatinha já está sã e salva em casa no Jd. Ipanema (Santo André)!\n\nMuito obrigado a todos que compartilharam, ajudaram nas buscas e mandaram mensagens de apoio! ❤️\n\nVeja as fotos da Nega em:';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: pageUrl
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyLinkWithToast(pageUrl, '✅ Link copiado! Envie para quem ajudou!');
        }
      }
    } else {
      copyLinkWithToast(pageUrl, '✅ Link copiado para a área de transferência!');
    }
  });
}

function copyLinkWithToast(text, successMsg = '✅ Link copiado!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(successMsg))
      .catch(() => execCopy(text, successMsg));
  } else {
    execCopy(text, successMsg);
  }
}

function execCopy(text, successMsg) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(successMsg || '✅ Link copiado!');
}

function showToast(message, duration = 3200) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}
