/**
 * GATA NEGA - SCRIPT DE COMPARTILHAMENTO E FEEDBACK
 */

document.addEventListener('DOMContentLoaded', () => {
  const shareBtn = document.getElementById('btnSharePage');
  
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: '🐾 DESAPARECIDA: Gata NEGA',
        text: 'Nossa gata NEGA está desaparecida! Se você tiver informações ou a vir, fale com os tutores pelo WhatsApp. Oferecemos recompensa!',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyLinkFallback();
          }
        }
      } else {
        copyLinkFallback();
      }
    });
  }
});

function copyLinkFallback() {
  const currentUrl = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentUrl)
      .then(() => showToast('✅ Link copiado para a área de transferência!'))
      .catch(() => execCommandCopy(currentUrl));
  } else {
    execCommandCopy(currentUrl);
  }
}

function execCommandCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast('✅ Link copiado com sucesso!');
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
