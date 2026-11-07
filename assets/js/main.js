/* =========================================================
   FERMnke — comportamiento editorial (vanilla ES2019)
   ========================================================= */

(function () {
  'use strict';

  var DRIVE_FOLDER =
    'https://drive.google.com/drive/folders/1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG';
  var LANG_KEY = 'fermnke-lang';

  var I18N = {
    es: {
      meta_title: 'FERMnke — Edición de video y marketing digital',
      meta_description:
        'Portafolio de edición de video y marketing digital: reels, spots y contenido para marcas.',
      nav_home: 'Inicio',
      nav_reel: 'Reel',
      nav_cases: 'Casos',
      nav_index: 'Índice',
      nav_profile: 'Perfil',
      nav_contact: 'Contacto',
      nav_menu: 'Menú',
      menu_close: 'Cerrar',
      hero_tagline: 'Edición de video y marketing digital',
      hero_work: 'Ver trabajo ↓',
      hero_contact: 'Contacto ↗',
      reel_title: 'EL REEL',
      reel_region: 'Carrusel de videos',
      reel_prev: '← Anterior',
      reel_next: 'Siguiente →',
      cases_title: 'CASOS',
      case_client: 'Cliente',
      case_type: 'Tipo',
      case_format: 'Formato',
      case_open: 'Ver completo',
      index_title: 'ÍNDICE',
      index_region: 'Índice de proyectos',
      index_go: 'Ir al caso',
      open_video: 'Abrir',
      profile_title: 'SOBRE MÍ',
      about_p1:
        'Hola, soy <strong>FERMnke</strong>, creador de contenido y estudiante de <strong>Marketing</strong> en la <strong>UEPCA</strong>.',
      about_p2:
        'Me especializo en la edición de video con un enfoque centrado en engagement, ritmo dinámico y retención de audiencia. Combino principios psicológicos del marketing con técnicas de montaje y diseño sonoro para potenciar marcas personales y comerciales.',
      about_p3:
        'Este portafolio reúne reels para redes sociales y spots publicitarios.',
      tools_title: 'Herramientas',
      contact_title: 'HABLEMOS',
      footer_text: '© 2026 FERMnke · UEPCA',
      modal_drive: 'Ver en Drive ↗',
      modal_prev: 'Anterior',
      modal_next: 'Siguiente',
      modal_close: 'Cerrar',
      load_error: 'No se pudo cargar el manifiesto de videos.',
      load_error_link: 'Abrir la carpeta en Drive',
    },
    en: {
      meta_title: 'FERMnke — Video editing and digital marketing',
      meta_description:
        'Video editing and digital marketing portfolio: reels, spots, and content for brands.',
      nav_home: 'Home',
      nav_reel: 'Reel',
      nav_cases: 'Cases',
      nav_index: 'Index',
      nav_profile: 'Profile',
      nav_contact: 'Contact',
      nav_menu: 'Menu',
      menu_close: 'Close',
      hero_tagline: 'Video editing and digital marketing',
      hero_work: 'See work ↓',
      hero_contact: 'Contact ↗',
      reel_title: 'THE REEL',
      reel_region: 'Video carousel',
      reel_prev: '← Previous',
      reel_next: 'Next →',
      cases_title: 'CASES',
      case_client: 'Client',
      case_type: 'Type',
      case_format: 'Format',
      case_open: 'Watch full',
      index_title: 'INDEX',
      index_region: 'Project index',
      index_go: 'Go to case',
      open_video: 'Open',
      profile_title: 'ABOUT ME',
      about_p1:
        'Hi, I\'m <strong>FERMnke</strong>, content creator and <strong>Marketing</strong> student at <strong>UEPCA</strong>.',
      about_p2:
        'I specialize in video editing focused on engagement, rapid rhythm, and audience retention. I combine psychological marketing principles with dynamic cuts and sound design to elevate personal and commercial brands.',
      about_p3:
        'This portfolio brings together social media reels and advertising spots.',
      tools_title: 'Tools',
      contact_title: 'LET\'S TALK',
      footer_text: '© 2026 FERMnke · UEPCA',
      modal_drive: 'Open in Drive ↗',
      modal_prev: 'Previous',
      modal_next: 'Next',
      modal_close: 'Close',
      load_error: 'The video manifest could not be loaded.',
      load_error_link: 'Open the Drive folder',
    },
  };

  var state = {
    lang: 'es',
    videos: [],
    reduced: false,
    loadError: false,
    heroItems: [],
    heroIndex: 0,
    heroVisible: true,
    heroTimer: null,
    modalIndex: -1,
    lastFocus: null,
  };

  var els = {};
  var observedVideos = new WeakSet();
  var playbackObserver = null;
  var paletteObserver = null;

  function t(key) {
    var dict = I18N[state.lang] || I18N.es;
    return dict[key] || I18N.es[key] || key;
  }

  function videoLabel(video) {
    return video.client || video.title;
  }

  function formatRatio(video) {
    if (!video.width || !video.height) return null;
    var a = video.width;
    var b = video.height;
    while (b) {
      var temp = b;
      b = a % b;
      a = temp;
    }
    var gcd = a || 1;
    return Math.round(video.width / gcd) + ':' + Math.round(video.height / gcd);
  }

  function driveThumb(id) {
    return 'https://drive.google.com/thumbnail?id=' + id + '&sz=w800';
  }

  function aspectString(video) {
    if (video.width && video.height) {
      return video.width + ' / ' + video.height;
    }
    return video.orientation === 'horizontal' ? '16 / 9' : '9 / 16';
  }

  function buildVideoElement(video) {
    var el = document.createElement('video');
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
    el.preload = 'none';
    el.setAttribute('muted', '');
    el.setAttribute('loop', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('preload', 'none');
    el.setAttribute('aria-label', video.title || '');
    if (video.poster) el.poster = video.poster;
    el.src = video.loop;
    return el;
  }

  function buildPosterImage(video, decorative) {
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = decorative ? '' : video.title || '';
    img.src = video.loop
      ? video.poster || driveThumb(video.id)
      : driveThumb(video.id);
    return img;
  }

  function mediaFor(video) {
    if (!state.reduced && video.loop) {
      return buildVideoElement(video);
    }
    return buildPosterImage(video);
  }

  function observePlayback(video) {
    if (state.reduced || !playbackObserver) return;
    if (observedVideos.has(video)) return;
    observedVideos.add(video);
    playbackObserver.observe(video);
  }

  function setupPlaybackObserver() {
    if (state.reduced || !('IntersectionObserver' in window)) return;
    playbackObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
              promise.catch(function () {});
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2, rootMargin: '80px 0px' }
    );
  }

  /* -------------------------------------------------------
     Hero
     ------------------------------------------------------- */

  function renderHero() {
    if (!els.heroStage) return;
    els.heroStage.innerHTML = '';
    state.heroItems = [];

    var verticals = state.videos.filter(function (video) {
      return video.orientation === 'vertical';
    });
    var list = verticals.length ? verticals : state.videos;
    if (!list.length) return;

    list.forEach(function (video) {
      var layer = document.createElement('div');
      layer.className = 'hero-layer';

      if (!state.reduced && video.loop) {
        var player = buildVideoElement(video);
        layer.appendChild(player);
        state.heroItems.push({ video: video, layer: layer, player: player });
      } else {
        layer.appendChild(buildPosterImage(video, true));
        state.heroItems.push({ video: video, layer: layer, player: null });
      }

      els.heroStage.appendChild(layer);
    });

    activateHero(0);

    if (!state.reduced && state.heroItems.length > 1) {
      if (state.heroTimer) window.clearInterval(state.heroTimer);
      state.heroTimer = window.setInterval(function () {
        if (!state.heroVisible) return;
        activateHero((state.heroIndex + 1) % state.heroItems.length);
      }, 5000);
    }
  }

  function activateHero(index) {
    state.heroIndex = index;

    state.heroItems.forEach(function (item, i) {
      var active = i === index;
      item.layer.classList.toggle('is-active', active);

      if (!item.player) return;
      if (active && state.heroVisible) {
        var promise = item.player.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      } else {
        item.player.pause();
      }
    });

    var current = state.heroItems[index];
    if (!current) return;
    els.heroClient.textContent = current.video.client || '';
    els.heroTitleLabel.textContent = current.video.title || '';
    els.heroSep.hidden = !current.video.client;
  }

  function setupHeroVisibility() {
    if (!('IntersectionObserver' in window) || !els.heroSection) return;
    new IntersectionObserver(
      function (entries) {
        var entry = entries[0];
        state.heroVisible = entry.isIntersecting;
        var item = state.heroItems[state.heroIndex];
        if (!item || !item.player) return;
        if (entry.isIntersecting) {
          var promise = item.player.play();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
          }
        } else {
          item.player.pause();
        }
      },
      { threshold: 0.05 }
    ).observe(els.heroSection);
  }

  /* -------------------------------------------------------
     Reel
     ------------------------------------------------------- */

  function renderReel() {
    if (!els.reelTrack) return;
    els.reelTrack.innerHTML = '';

    state.videos.forEach(function (video, index) {
      var item = document.createElement('article');
      item.className = 'reel-item';
      item.dataset.index = String(index);

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'reel-media-btn';
      button.dataset.index = String(index);

      var media = document.createElement('div');
      media.className = 'reel-media';
      media.style.setProperty('--ar', aspectString(video));

      var mediaEl = mediaFor(video);
      media.appendChild(mediaEl);
      button.appendChild(media);

      var label = document.createElement('h3');
      label.className = 'reel-label';
      label.textContent = videoLabel(video);

      item.appendChild(button);
      item.appendChild(label);
      if (video.client) {
        var sublabel = document.createElement('p');
        sublabel.className = 'reel-sublabel';
        sublabel.textContent = video.title || '';
        item.appendChild(sublabel);
      }
      els.reelTrack.appendChild(item);
    });

    els.reelTrack.querySelectorAll('video').forEach(observePlayback);

    if (els.reelControls) els.reelControls.hidden = false;
  }

  function scrollReel(direction) {
    if (!els.reelViewport) return;
    var first = els.reelTrack
      ? els.reelTrack.querySelector('.reel-item')
      : null;
    var gap = 0;
    if (els.reelTrack) {
      gap =
        parseFloat(window.getComputedStyle(els.reelTrack).columnGap || '0') ||
        0;
    }
    var step = first
      ? first.getBoundingClientRect().width + gap
      : els.reelViewport.clientWidth * 0.8;

    els.reelViewport.scrollBy({
      left: direction * step,
      behavior: state.reduced ? 'auto' : 'smooth',
    });
  }

  function bindReelInteractions() {
    if (!els.reelViewport || !els.reelTrack) return;

    var drag = null;
    var suppressClick = false;

    els.reelViewport.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      drag = {
        x: event.clientX,
        start: els.reelViewport.scrollLeft,
        moved: false,
      };
      suppressClick = false;
    });

    window.addEventListener('pointermove', function (event) {
      if (!drag) return;
      var dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        els.reelTrack.classList.add('is-dragging');
      }
      if (drag.moved) {
        els.reelViewport.scrollLeft = drag.start - dx;
      }
    });

    window.addEventListener('pointerup', function () {
      if (drag && drag.moved) suppressClick = true;
      drag = null;
      els.reelTrack.classList.remove('is-dragging');
    });

    window.addEventListener('pointercancel', function () {
      if (drag && drag.moved) suppressClick = true;
      drag = null;
      els.reelTrack.classList.remove('is-dragging');
    });

    els.reelTrack.addEventListener('click', function (event) {
      var button = event.target.closest('.reel-media-btn');
      if (!button) return;
      if (suppressClick) {
        suppressClick = false;
        event.preventDefault();
        return;
      }
      var index = Number(button.dataset.index);
      if (Number.isInteger(index)) openModal(index);
    });

    els.reelTrack.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollReel(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollReel(1);
      }
    });

    if (els.reelPrev) {
      els.reelPrev.addEventListener('click', function () {
        scrollReel(-1);
      });
    }
    if (els.reelNext) {
      els.reelNext.addEventListener('click', function () {
        scrollReel(1);
      });
    }
  }

  /* -------------------------------------------------------
     Casos
     ------------------------------------------------------- */

  function renderCases() {
    if (!els.casesList) return;
    els.casesList.innerHTML = '';

    state.videos.forEach(function (video, index) {
      var article = document.createElement('article');
      article.className = 'case' + (index % 2 === 1 ? ' alt' : '');
      article.id = 'caso-' + video.id;
      article.dataset.palette = index % 2 === 0 ? 'ink' : 'paper';
      article.dataset.index = String(index);

      var head = document.createElement('div');
      head.className = 'case-head';

      var number = document.createElement('span');
      number.className = 'case-number';
      number.textContent = String(index + 1).padStart(2, '0');

      var heading = document.createElement('div');

      var title = document.createElement('h3');
      title.className = 'case-title';
      title.textContent = video.title || '';

      var ficha = document.createElement('dl');
      ficha.className = 'case-ficha';

      if (video.client) {
        var clientRow = document.createElement('div');
        var clientLabel = document.createElement('dt');
        clientLabel.dataset.i18n = 'case_client';
        clientLabel.textContent = t('case_client');
        var clientValue = document.createElement('dd');
        clientValue.textContent = video.client;
        clientRow.appendChild(clientLabel);
        clientRow.appendChild(clientValue);
        ficha.appendChild(clientRow);
      }

      var tag = state.lang === 'en' ? video.tag_en : video.tag_es;
      if (tag) {
        var typeRow = document.createElement('div');
        typeRow.className = 'ficha-type';
        var typeLabel = document.createElement('dt');
        typeLabel.dataset.i18n = 'case_type';
        typeLabel.textContent = t('case_type');
        var typeValue = document.createElement('dd');
        typeValue.className = 'case-type';
        typeValue.textContent = tag;
        typeRow.appendChild(typeLabel);
        typeRow.appendChild(typeValue);
        ficha.appendChild(typeRow);
      }

      var ratio = formatRatio(video);
      if (ratio) {
        var formatRow = document.createElement('div');
        var formatLabel = document.createElement('dt');
        formatLabel.dataset.i18n = 'case_format';
        formatLabel.textContent = t('case_format');
        var formatValue = document.createElement('dd');
        formatValue.textContent = ratio;
        formatRow.appendChild(formatLabel);
        formatRow.appendChild(formatValue);
        ficha.appendChild(formatRow);
      }

      heading.appendChild(title);
      heading.appendChild(ficha);
      head.appendChild(number);
      head.appendChild(heading);

      var body = document.createElement('div');
      body.className = 'case-body';

      var media = document.createElement('div');
      media.className = 'case-media';
      media.style.setProperty('--ar', aspectString(video));
      media.style.setProperty(
        '--r',
        String(video.width && video.height ? video.width / video.height : 16 / 9)
      );
      var mediaEl = mediaFor(video);
      media.appendChild(mediaEl);

      var copy = document.createElement('div');
      copy.className = 'case-copy';

      var desc = document.createElement('p');
      desc.className = 'case-desc';
      copy.appendChild(desc);

      if (video.metrics && video.metrics.length) {
        var metrics = document.createElement('ul');
        metrics.className = 'case-metrics';
        video.metrics.forEach(function (metric) {
          var item = document.createElement('li');
          var value = document.createElement('span');
          value.className = 'metric-value';
          value.textContent = String(metric.value);
          var label = document.createElement('span');
          label.className = 'metric-label';
          label.dataset.labelEs = metric.label_es || '';
          label.dataset.labelEn = metric.label_en || '';
          item.appendChild(value);
          item.appendChild(label);
          metrics.appendChild(item);
        });
        copy.appendChild(metrics);
      }

      var open = document.createElement('button');
      open.type = 'button';
      open.className = 'case-open';
      open.dataset.i18n = 'case_open';
      open.dataset.index = String(index);
      open.textContent = t('case_open');
      copy.appendChild(open);

      body.appendChild(media);
      body.appendChild(copy);

      article.appendChild(head);
      article.appendChild(body);
      els.casesList.appendChild(article);
    });

    els.casesList.querySelectorAll('video').forEach(observePlayback);
  }

  /* -------------------------------------------------------
     Índice
     ------------------------------------------------------- */

  function renderIndex() {
    if (!els.indexList) return;
    els.indexList.innerHTML = '';

    state.videos.forEach(function (video, index) {
      var link = document.createElement('a');
      link.className = 'index-item';
      link.href = '#caso-' + video.id;
      link.dataset.index = String(index);
      link.setAttribute('role', 'listitem');

      var circle = document.createElement('span');
      circle.className = 'index-circle';

      var img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = '';
      img.src = video.poster || driveThumb(video.id);
      circle.appendChild(img);

      var name = document.createElement('span');
      name.className = 'index-name';
      name.textContent = video.title || '';

      link.appendChild(circle);
      link.appendChild(name);
      els.indexList.appendChild(link);
    });
  }

  /* -------------------------------------------------------
     i18n y textos dinámicos
     ------------------------------------------------------- */

  function updateDynamicText() {
    var dict = I18N[state.lang] || I18N.es;

    if (els.reelTrack) {
      els.reelTrack
        .querySelectorAll('.reel-media-btn')
        .forEach(function (button) {
          var video = state.videos[Number(button.dataset.index)];
          if (video) {
            button.setAttribute(
              'aria-label',
              dict.open_video + ': ' + (video.title || '')
            );
          }
        });
    }

    if (els.indexList) {
      els.indexList.querySelectorAll('.index-item').forEach(function (item) {
        var video = state.videos[Number(item.dataset.index)];
        if (video) {
          item.setAttribute(
            'aria-label',
            dict.index_go + ': ' + (video.title || '')
          );
        }
      });
    }

    if (els.casesList) {
      els.casesList.querySelectorAll('.case').forEach(function (article) {
        var video = state.videos[Number(article.dataset.index)];
        if (!video) return;

        var typeValue = article.querySelector('.case-type');
        if (typeValue) {
          var tag = state.lang === 'en' ? video.tag_en : video.tag_es;
          var typeRow = typeValue.closest('.ficha-type');
          if (typeRow) typeRow.hidden = !tag;
          typeValue.textContent = tag || '';
        }

        var desc = article.querySelector('.case-desc');
        if (desc) {
          var text = state.lang === 'en' ? video.desc_en : video.desc_es;
          desc.textContent = text || '';
          desc.hidden = !text;
        }

        article.querySelectorAll('.metric-label').forEach(function (label) {
          var value =
            state.lang === 'en' ? label.dataset.labelEn : label.dataset.labelEs;
          label.textContent = value || '';
        });

        var openButton = article.querySelector('.case-open');
        if (openButton) {
          openButton.textContent = dict.case_open;
          openButton.setAttribute(
            'aria-label',
            dict.case_open + ': ' + (video.title || '')
          );
        }
      });
    }

    var heroVideo = state.heroItems[state.heroIndex];
    if (heroVideo) {
      els.heroSep.hidden = !heroVideo.video.client;
    }
  }

  function applyTranslations() {
    var dict = I18N[state.lang] || I18N.es;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (!(key in dict)) return;
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.dataset.i18nAria;
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });

    document.documentElement.lang = state.lang;
    document.title = dict.meta_title;

    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', dict.meta_description);

    els.langButtons.forEach(function (button) {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.lang === state.lang)
      );
    });

    if (state.videos.length) updateDynamicText();
    if (state.loadError) renderLoadError();
  }

  function setLanguage(lang) {
    state.lang = lang === 'en' ? 'en' : 'es';
    applyTranslations();
    try {
      window.localStorage.setItem(LANG_KEY, state.lang);
    } catch (error) {
      /* almacenamiento no disponible */
    }
  }

  function readLanguage() {
    try {
      var saved = window.localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'es') return saved;
    } catch (error) {
      /* almacenamiento no disponible */
    }
    return 'es';
  }

  /* -------------------------------------------------------
     Carga del manifiesto
     ------------------------------------------------------- */

  function showLoadError() {
    state.loadError = true;
    renderLoadError();
  }

  function renderLoadError() {
    if (!els.reelTrack) return;
    var dict = I18N[state.lang] || I18N.es;
    els.reelTrack.innerHTML = '';

    var message = document.createElement('p');
    message.className = 'load-error';
    message.appendChild(document.createTextNode(dict.load_error + ' '));

    var link = document.createElement('a');
    link.href = DRIVE_FOLDER;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = dict.load_error_link;
    message.appendChild(link);

    els.reelTrack.appendChild(message);
    if (els.reelControls) els.reelControls.hidden = true;
  }

  function loadVideos() {
    fetch('data/videos.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        var videos = data && Array.isArray(data.videos) ? data.videos : [];
        if (!videos.length) throw new Error('Manifiesto vacío');
        state.videos = videos;
        state.loadError = false;
        renderAll();
        applyTranslations();
      })
      .catch(function () {
        state.videos = [];
        showLoadError();
      });
  }

  function renderAll() {
    renderHero();
    renderReel();
    renderCases();
    renderIndex();
    observePalettes();
  }

  /* -------------------------------------------------------
     Paletas por sección
     ------------------------------------------------------- */

  function setPalette(palette) {
    if (!palette) return;
    if (document.body.dataset.palette === palette) return;
    document.body.dataset.palette = palette;
  }

  function observePalettes() {
    if (!('IntersectionObserver' in window)) return;
    if (!paletteObserver) {
      paletteObserver = new IntersectionObserver(
        function (entries) {
          var article = null;
          var section = null;

          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            if (entry.target.tagName === 'ARTICLE') {
              if (
                !article ||
                entry.intersectionRatio > article.intersectionRatio
              ) {
                article = entry;
              }
            } else if (
              !section ||
              entry.intersectionRatio > section.intersectionRatio
            ) {
              section = entry;
            }
          });

          var chosen = article || section;
          if (chosen) setPalette(chosen.target.dataset.palette);
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
      );
    }

    document.querySelectorAll('[data-palette]').forEach(function (el) {
      paletteObserver.observe(el);
    });
  }

  /* -------------------------------------------------------
     Modal
     ------------------------------------------------------- */

  function openModal(index) {
    if (!els.modal) return;
    if (!Number.isInteger(index) || !state.videos[index]) return;

    state.modalIndex = index;
    state.lastFocus = document.activeElement;
    renderModal();

    if (typeof els.modal.showModal === 'function') {
      if (!els.modal.open) els.modal.showModal();
    } else {
      els.modal.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
  }

  function renderModal() {
    var video = state.videos[state.modalIndex];
    if (!video || !els.modalFrame) return;

    els.modalTitle.textContent = video.title || '';
    els.modalDrive.href =
      'https://drive.google.com/file/d/' + video.id + '/view';

    els.modalFrame.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.className =
      'modal-frame-inner ' +
      (video.orientation === 'horizontal' ? 'is-horizontal' : 'is-vertical');

    var iframe = document.createElement('iframe');
    iframe.src = 'https://drive.google.com/file/d/' + video.id + '/preview';
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    iframe.title = video.title || '';
    wrap.appendChild(iframe);

    els.modalFrame.appendChild(wrap);
  }

  function closeModal() {
    if (!els.modal) return;
    if (typeof els.modal.close === 'function' && els.modal.open) {
      els.modal.close();
    } else {
      els.modal.removeAttribute('open');
      handleModalClosed();
    }
  }

  function handleModalClosed() {
    if (els.modalFrame) els.modalFrame.innerHTML = '';
    document.body.classList.remove('modal-open');
    var focus = state.lastFocus;
    state.lastFocus = null;
    if (focus && typeof focus.focus === 'function') focus.focus();
  }

  function navigateModal(step) {
    if (!state.videos.length) return;
    var next =
      (state.modalIndex + step + state.videos.length) % state.videos.length;
    state.modalIndex = next;
    renderModal();
  }

  /* -------------------------------------------------------
     Menú móvil
     ------------------------------------------------------- */

  function toggleMenu(force) {
    if (!els.menuOverlay || !els.menuBtn) return;
    var open =
      typeof force === 'boolean' ? force : els.menuOverlay.hidden === true;

    els.menuOverlay.hidden = !open;
    els.menuBtn.setAttribute('aria-expanded', String(open));
    els.menuBtn.dataset.i18n = open ? 'menu_close' : 'nav_menu';
    els.menuBtn.textContent = t(open ? 'menu_close' : 'nav_menu');
    document.body.classList.toggle('menu-open', open);
  }

  /* -------------------------------------------------------
     Inicialización
     ------------------------------------------------------- */

  function cacheElements() {
    els.heroSection = document.getElementById('inicio');
    els.heroStage = document.getElementById('heroStage');
    els.heroClient = document.getElementById('heroClient');
    els.heroTitleLabel = document.getElementById('heroTitleLabel');
    els.heroSep = document.getElementById('heroSep');

    els.reelTrack = document.getElementById('reelTrack');
    els.reelViewport = document.querySelector('.reel-viewport');
    els.reelControls = document.getElementById('reelControls');
    els.reelPrev = document.getElementById('reelPrev');
    els.reelNext = document.getElementById('reelNext');

    els.casesList = document.getElementById('casesList');
    els.indexList = document.getElementById('indexList');

    els.modal = document.getElementById('videoModal');
    els.modalTitle = document.getElementById('modalTitle');
    els.modalDrive = document.getElementById('modalDrive');
    els.modalFrame = document.getElementById('modalFrame');
    els.modalClose = document.getElementById('modalClose');
    els.modalPrev = document.getElementById('modalPrev');
    els.modalNext = document.getElementById('modalNext');

    els.menuBtn = document.getElementById('menuBtn');
    els.menuOverlay = document.getElementById('menuOverlay');

    els.langButtons = Array.prototype.slice.call(
      document.querySelectorAll('.lang-switch [data-lang]')
    );
  }

  function bindUI() {
    els.langButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setLanguage(button.dataset.lang);
      });
    });

    if (els.menuBtn) {
      els.menuBtn.addEventListener('click', function () {
        toggleMenu();
      });
    }

    if (els.menuOverlay) {
      els.menuOverlay.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggleMenu(false);
        });
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && els.menuOverlay && !els.menuOverlay.hidden) {
        toggleMenu(false);
      }
    });

    bindReelInteractions();

    if (els.casesList) {
      els.casesList.addEventListener('click', function (event) {
        var button = event.target.closest('.case-open');
        if (!button) return;
        var index = Number(button.dataset.index);
        if (Number.isInteger(index)) openModal(index);
      });
    }

    if (els.modal) {
      els.modal.addEventListener('close', handleModalClosed);
      els.modal.addEventListener('click', function (event) {
        if (event.target === els.modal) closeModal();
      });
    }

    if (els.modalClose) {
      els.modalClose.addEventListener('click', closeModal);
    }
    if (els.modalPrev) {
      els.modalPrev.addEventListener('click', function () {
        navigateModal(-1);
      });
    }
    if (els.modalNext) {
      els.modalNext.addEventListener('click', function () {
        navigateModal(1);
      });
    }
  }

  function init() {
    cacheElements();

    state.lang = readLanguage();
    state.reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      Boolean(
        navigator.connection &&
          navigator.connection.saveData === true
      );

    setupPlaybackObserver();
    setupHeroVisibility();
    bindUI();
    applyTranslations();
    loadVideos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
