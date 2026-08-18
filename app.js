/**
 * GATA NEGA - SCRIPT DE COMPARTILHAMENTO DO PANFLETO E GALERIA
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryModal();
  initShareFlyer();
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
    modalCaption.textContent = caption || 'Gata Nega 🐾';
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
 * 2. Compartilhar Imagem do Panfleto com Amigos
 */
function initShareFlyer() {
  const shareBtn = document.getElementById('btnSharePage');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    showToast('Preparando imagem do panfleto...');

    const flyerUrl = 'assets/panfleto.png';
    const pageUrl = window.location.href;
    const shareText = '🚨 *PROCURA-SE: GATA NEGA* 🐾\nNossa gata está desaparecida no Jd. Ipanema (Santo André). Oferecemos recompensa!\nMais informações e WhatsApp dos tutores: ' + pageUrl;

    // Tenta obter o arquivo de imagem do panfleto para compartilhar nativamente
    try {
      const response = await fetch(flyerUrl);
      const blob = await response.blob();
      const file = new File([blob], 'Panfleto_NEGA_Desaparecida.png', { type: 'image/png' });

      // Se o navegador suportar compartilhamento de arquivo
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '🚨 DESAPARECIDA: Gata NEGA 🐾',
          text: shareText,
          url: pageUrl
        });
        return;
      }
    } catch (err) {
      console.log('Compartilhamento com arquivo não suportado, tentando texto/link.', err);
    }

    // Se compartilhamento com arquivo falhar mas tiver navigator.share
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🚨 DESAPARECIDA: Gata NEGA 🐾',
          text: shareText,
          url: pageUrl
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackAction(flyerUrl, pageUrl);
        }
      }
    } else {
      fallbackAction(flyerUrl, pageUrl);
    }
  });
}

function fallbackAction(flyerUrl, pageUrl) {
  // Baixa o panfleto e copia o link
  const link = document.createElement('a');
  link.href = flyerUrl;
  link.download = 'Panfleto_NEGA_Desaparecida.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  copyLink(pageUrl);
  showToast('📥 Imagem baixada e link copiado!');
}

function copyLink(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('✅ Link copiado!'))
      .catch(() => execCopy(text));
  } else {
    execCopy(text);
  }
}

function execCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}

function showToast(message, duration = 3000) {
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
