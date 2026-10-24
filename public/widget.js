/*!
 * ChatForm embed widget
 * Usage: <script src="https://your-app.com/widget.js" data-form="SLUG" async></script>
 * Optional: data-position="left"
 */
(function () {
  'use strict';

  if (window.__chatformLoaded) return;

  // Eta ekhoni porte hobe: currentScript shudhu script chalar shomoy thake
  var script =
    document.currentScript || document.querySelector('script[data-form][src*="widget.js"]');
  if (!script) return;

  var slug = script.getAttribute('data-form');
  if (!slug) {
    console.warn('[ChatForm] Missing data-form attribute on the script tag.');
    return;
  }
  window.__chatformLoaded = true;

  var origin = new URL(script.src, window.location.href).origin;
  var side = script.getAttribute('data-position') === 'left' ? 'left' : 'right';

  var css =
    '.cf-btn{position:fixed;bottom:20px;' + side + ':20px;width:60px;height:60px;border-radius:50%;' +
    'border:0;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    'background:#0f766e;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:2147483000;transition:transform .15s ease}' +
    '.cf-btn:hover{transform:scale(1.07)}' +
    '.cf-btn:focus-visible{outline:3px solid #fff;outline-offset:-6px}' +
    '.cf-btn svg{width:28px;height:28px;fill:#fff}' +
    '.cf-frame{position:fixed;bottom:92px;' + side + ':20px;width:380px;max-width:calc(100vw - 40px);' +
    'height:620px;max-height:calc(100vh - 112px);border:0;border-radius:16px;background:#fff;' +
    'box-shadow:0 12px 40px rgba(0,0,0,.3);z-index:2147483001;display:none;overflow:hidden}' +
    '.cf-frame.cf-open{display:block}' +
    '@media (max-width:480px){' +
    '.cf-frame{top:0;left:0;right:0;bottom:0;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0}' +
    '.cf-btn.cf-hide-mobile{display:none}}' +
    '@media (prefers-reduced-motion:reduce){.cf-btn{transition:none}}';

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'cf-btn';
    button.setAttribute('aria-label', 'Open chat');
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 2-2z"/></svg>';

    var frame = document.createElement('iframe');
    frame.className = 'cf-frame';
    frame.title = 'Chat';

    document.body.appendChild(frame);
    document.body.appendChild(button);

    var loaded = false;
    var open = false;

    function setOpen(value) {
      open = value;
      if (open && !loaded) {
        // Prothom bar kholar shomoy-i chat load hoy, tai host page dhimey hoy na
        frame.src = origin + '/embed/' + encodeURIComponent(slug);
        loaded = true;
      }
      frame.classList.toggle('cf-open', open);
      button.classList.toggle('cf-hide-mobile', open);
      button.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
    }

    button.addEventListener('click', function () {
      setOpen(!open);
    });

    // Iframe er bhitorer close button ei page ke message pathay
    window.addEventListener('message', function (event) {
      if (event.origin === origin && event.data && event.data.type === 'chatform:close') {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && open) setOpen(false);
    });

    // Form er nijosso rong button e boshay
    fetch(origin + '/api/public/forms/' + encodeURIComponent(slug))
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (form) {
        if (form && /^#[0-9a-f]{6}$/i.test(form.theme_color)) {
          button.style.background = form.theme_color;
        }
      })
      .catch(function () {
        /* default rong thakbe */
      });
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();