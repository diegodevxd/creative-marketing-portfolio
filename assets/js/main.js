/* =========================================================
   FERMnke / comportamiento editorial e interactivo (ES2019)
   ========================================================= */

(function () {
  'use strict';

  var DRIVE_FOLDER =
    'https://drive.google.com/drive/folders/1ydixa37LrvgI_I5NX1gF9aGJPm3SkaNG';
  var LANG_KEY = 'fermnke-lang';

  var I18N = {
    es: {
      meta_title: 'FERMnke / Edición de video y marketing digital',
      meta_description:
        'Portafolio de edición de video y marketing digital: reels, spots y contenido para marcas.',
      nav_home: 'Inicio',
      nav_reel: 'Reel',
      nav_cases: 'Casos',
      nav_index: 'Archivo',
      nav_profile: 'Perfil',
      nav_contact: 'Contacto',
      nav_menu: 'Menú',
      menu_close: 'Cerrar',
      hero_badge: 'Disponible para proyectos',
      hero_display: 'EDICIÓN & MARKETING',
      hero_tagline:
        'Reels, spots y montaje estratégico diseñados para maximizar retención y conversión de marca.',
      hero_work: 'Ver trabajo',
      hero_contact: 'Hablemos',
      hero_play_aria: 'Reproducir video completo',
      hero_progress_aria: 'Selector de reel destacado',
      pill_reels: 'Reels 9:16',
      pill_spots: 'Spots Comerciales',
      pill_retention: 'Retention Editing',
      pill_sound: 'Sound & Color',
      reel_title: 'EL REEL',
      reel_subtitle:
        'Montaje de ritmo rápido, retención y piezas comerciales en reproducción continua.',
      reel_region: 'Carrusel de videos',
      reel_prev: 'Anterior',
      reel_next: 'Siguiente',
      filter_region: 'Filtrar por formato',
      filter_all: 'Todos',
      filter_vertical: 'Reels 9:16',
      filter_horizontal: 'Spots',
      cases_title: 'CASOS DE ESTUDIO',
      cases_subtitle:
        'Desglose de producción, formato y enfoque estratégico de cada pieza.',
      case_client: 'Cliente',
      case_type: 'Tipo',
      case_format: 'Formato',
      case_open: 'Ver completo',
      spec_format: 'Formato',
      spec_delivery: 'Entrega',
      spec_focus: 'Enfoque',
      spec_sync: 'Archivo Drive',
      cases_show_all: 'Ver todos los casos',
      cases_show_less: 'Mostrar menos',
      index_title: 'ARCHIVO',
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
      method_1_title: 'Retención & Hook',
      method_1_desc:
        'Primeros 3 segundos diseñados para frenar el scroll y sostener el watch time.',
      method_2_title: 'Diseño Sonoro',
      method_2_desc:
        'Capas rítmicas, transiciones acústicas y mezcla limpia para impacto inmediato.',
      method_3_title: 'Psicología de Marca',
      method_3_desc:
        'Narrativa visual alineada a objetivos comerciales y posicionamiento digital.',
      tools_title: 'Stack de Producción',
      tool_pr_role: 'Montaje narrativo, ritmo y color base',
      tool_ae_role: 'Motion graphics, tracking y composición',
      tool_cp_role: 'Edición ágil de reels y subtítulos dinámicos',
      contact_title: 'HABLEMOS',
      contact_subtitle:
        'Disponible para edición mensual de reels, spots de marca y campañas digitales.',
      footer_text: '© 2026 FERMnke · UEPCA',
      footer_drive: 'Carpeta Drive ↗',
      modal_drive: 'Ver en Drive ↗',
      modal_prev: 'Anterior',
      modal_next: 'Siguiente',
      modal_close: 'Cerrar',
      load_error: 'No se pudo cargar el manifiesto de videos.',
      load_error_link: 'Abrir la carpeta en Drive',
    },
    en: {
      meta_title: 'FERMnke / Video editing and digital marketing',
      meta_description:
        'Video editing and digital marketing portfolio: reels, spots, and content for brands.',
      nav_home: 'Home',
      nav_reel: 'Reel',
      nav_cases: 'Cases',
      nav_index: 'Archive',
      nav_profile: 'Profile',
      nav_contact: 'Contact',
      nav_menu: 'Menu',
      menu_close: 'Close',
      hero_badge: 'Available for projects',
      hero_display: 'EDITING & MARKETING',
      hero_tagline:
        'Reels, spots, and strategic editing built to maximize audience retention and brand conversion.',
      hero_work: 'See work',
      hero_contact: "Let's talk",
      hero_play_aria: 'Watch full video',
      hero_progress_aria: 'Featured reel selector',
      pill_reels: '9:16 Reels',
      pill_spots: 'Commercial Spots',
      pill_retention: 'Retention Editing',
      pill_sound: 'Sound & Color',
      reel_title: 'THE REEL',
      reel_subtitle:
        'Fast-paced editing, audience retention, and commercial brand pieces in continuous playback.',
      reel_region: 'Video carousel',
      reel_prev: 'Previous',
      reel_next: 'Next',
      filter_region: 'Filter by format',
      filter_all: 'All',
      filter_vertical: '9:16 Reels',
      filter_horizontal: 'Spots',
      cases_title: 'CASE STUDIES',
      cases_subtitle:
        'Production breakdown, format specs, and strategic approach behind each piece.',
      case_client: 'Client',
      case_type: 'Type',
      case_format: 'Format',
      case_open: 'Watch full',
      spec_format: 'Format',
      spec_delivery: 'Delivery',
      spec_focus: 'Focus',
      spec_sync: 'Drive Sync',
      cases_show_all: 'Show all cases',
      cases_show_less: 'Show fewer',
      index_title: 'ARCHIVE',
      index_region: 'Project index',
      index_go: 'Go to case',
      open_video: 'Open',
      profile_title: 'ABOUT ME',
      about_p1:
        "Hi, I'm <strong>FERMnke</strong>, content creator and <strong>Marketing</strong> student at <strong>UEPCA</strong>.",
      about_p2:
        'I specialize in video editing focused on engagement, rapid rhythm, and audience retention. I combine psychological marketing principles with dynamic cuts and sound design to elevate personal and commercial brands.',
      about_p3:
        'This portfolio brings together social media reels and advertising spots.',
      method_1_title: 'Retention & Hook',
      method_1_desc:
        'First 3 seconds engineered to stop the scroll and sustain watch time.',
      method_2_title: 'Sound Design',
      method_2_desc:
        'Rhythmic layers, acoustic transitions, and clean mixing for instant impact.',
      method_3_title: 'Brand Psychology',
      method_3_desc:
        'Visual storytelling aligned with commercial goals and digital positioning.',
      tools_title: 'Production Stack',
      tool_pr_role: 'Narrative cut, pacing, and base color',
      tool_ae_role: 'Motion graphics, tracking, and compositing',
      tool_cp_role: 'Fast reel turnaround and kinetic captions',
      contact_title: "LET'S TALK",
      contact_subtitle:
        'Available for monthly reel retainers, brand spots, and digital campaigns.',
      footer_text: '© 2026 FERMnke · UEPCA',
      footer_drive: 'Drive Folder ↗',
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
    filteredReelVideos: [],
    reelFilter: 'all',
    reelActiveIdx: 0,
    casesExpandedMobile: false,
    reduced: false,
    loadError: false,
    heroItems: [],
    heroSegments: [],
    heroIndex: 0,
    heroVisible: true,
    heroTimer: null,
    modalIndex: -1,
    lastFocus: null,
  };

  var els = {};
  var observedVideos = new WeakSet();
  var playbackObserver = null;
  var revealObserver = null;
  var reelCenterObserver = null;
  var navObserver = null;

  function t(key) {
    var dict = I18N[state.lang] || I18N.es;
    return dict[key] || I18N.es[key] || key;
  }

  function videoLabel(video) {
    return video.client || video.title;
  }

  function isMobileViewport() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function formatRatio(video) {
    if (!video.width || !video.height) {
      return video.orientation === 'horizontal' ? '16:9' : '9:16';
    }
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

  function posterUrlFor(video) {
    return video.poster || driveThumb(video.id);
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
    img.src = posterUrlFor(video);
    return img;
  }

  function mediaFor(video, forcePoster) {
    if (!forcePoster && !state.reduced && video.loop) {
      return buildVideoElement(video);
    }
    return buildPosterImage(video, true);
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
     Smart Fullstack Fallback & Spec Generator
     ------------------------------------------------------- */

  function getCaseDetails(video) {
    var ratio = formatRatio(video);
    var resolution =
      video.width && video.height ? video.width + '×' + video.height : ratio;
    var clientName = video.client || (state.lang === 'en' ? 'Brand Production' : 'Producción de marca');
    var isHorizontal = video.orientation === 'horizontal';

    var descEs = video.desc_es;
    var descEn = video.desc_en;

    if (!descEs) {
      descEs = isHorizontal
        ? 'Pieza audiovisual panorámica producida para ' +
          clientName +
          '. Montaje cinematográfico, ritmo visual controlado y gradación de color orientada a campañas digitales.'
        : 'Pieza vertical optimizada para retención en redes sociales para ' +
          clientName +
          '. Montaje rítmico con cortes dinámicos, acentos sonoros y encuadre 9:16 nativo.';
    }

    if (!descEn) {
      descEn = isHorizontal
        ? 'Widescreen commercial piece produced for ' +
          clientName +
          '. Built with cinematic pacing, intentional transitions, and color grading for digital campaigns.'
        : 'Vertical reel engineered for social retention for ' +
          clientName +
          '. Fast-paced editing with rhythmic cuts, sound accents, and native 9:16 framing.';
    }

    var specs = [
      {
        labelKey: 'spec_format',
        value: ratio + ' (' + resolution + ')',
      },
      {
        labelKey: 'spec_delivery',
        value: isHorizontal
          ? state.lang === 'en'
            ? '16:9 Spot'
            : 'Spot 16:9'
          : state.lang === 'en'
            ? 'Social Reel'
            : 'Reel Social',
      },
      {
        labelKey: 'spec_focus',
        value: isHorizontal
          ? state.lang === 'en'
            ? 'Brand Story'
            : 'Narrativa'
          : state.lang === 'en'
            ? 'Retention'
            : 'Retención',
      },
      {
        labelKey: 'spec_sync',
        value: video.driveModified || 'Drive Live',
      },
    ];

    var tags = isHorizontal
      ? state.lang === 'en'
        ? ['Cinematography', 'Color Grading', 'Sound Mix']
        : ['Montaje Spot', 'Color Grading', 'Mezcla']
      : state.lang === 'en'
        ? ['Hook Pacing', 'Sound Design', '9:16 Native']
        : ['Corte Dinámico', 'Sound Design', '9:16 Nativo'];

    return {
      desc: state.lang === 'en' ? descEn : descEs,
      specs: specs,
      tags: tags,
    };
  }

  /* -------------------------------------------------------
     Hero
     ------------------------------------------------------- */

  function startHeroTimer() {
    if (state.heroTimer) {
      window.clearInterval(state.heroTimer);
      state.heroTimer = null;
    }
    if (state.reduced || state.heroItems.length <= 1) return;
    state.heroTimer = window.setInterval(function () {
      if (!state.heroVisible) return;
      activateHero((state.heroIndex + 1) % state.heroItems.length);
    }, 5000);
  }

  function renderHero() {
    if (!els.heroStage) return;
    els.heroStage.innerHTML = '';
    if (els.heroProgress) els.heroProgress.innerHTML = '';
    state.heroItems = [];
    state.heroSegments = [];

    var verticals = state.videos.filter(function (video) {
      return video.orientation === 'vertical';
    });
    var list = verticals.length ? verticals : state.videos;
    if (!list.length) return;

    list.forEach(function (video, idx) {
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

      if (els.heroProgress) {
        var seg = document.createElement('button');
        seg.type = 'button';
        seg.className = 'hero-progress-seg';
        seg.setAttribute('role', 'tab');
        seg.setAttribute('aria-label', (video.client ? video.client + ' · ' : '') + (video.title || ''));
        seg.dataset.heroIdx = String(idx);

        var fill = document.createElement('span');
        fill.className = 'hero-progress-fill';
        seg.appendChild(fill);

        seg.addEventListener('click', function () {
          activateHero(idx);
          startHeroTimer();
        });

        els.heroProgress.appendChild(seg);
        state.heroSegments.push(seg);
      }
    });

    activateHero(0);
    startHeroTimer();
  }

  function activateHero(index) {
    state.heroIndex = index;

    state.heroItems.forEach(function (item, i) {
      var active = i === index;
      item.layer.classList.toggle('is-active', active);

      if (item.player) {
        if (active && state.heroVisible) {
          var promise = item.player.play();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
          }
        } else {
          item.player.pause();
        }
      }
    });

    state.heroSegments.forEach(function (seg, i) {
      seg.classList.remove('is-active', 'is-past');
      seg.setAttribute('aria-selected', String(i === index));
      if (i < index) {
        seg.classList.add('is-past');
      } else if (i === index) {
        void seg.offsetWidth;
        seg.classList.add('is-active');
      }
    });

    var current = state.heroItems[index];
    if (!current) return;

    if (els.heroAmbient) {
      els.heroAmbient.style.backgroundImage =
        'url("' + posterUrlFor(current.video) + '")';
    }

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
     Reel / 21st.dev Focal-Scale Carousel & Filter
     ------------------------------------------------------- */

  function updateReelProgress(activePos, total) {
    if (!els.reelProgressFill || !els.reelCounter) return;
    var safeTotal = Math.max(total, 1);
    var safePos = Math.min(Math.max(activePos, 0), safeTotal - 1);
    var pct = ((safePos + 1) / safeTotal) * 100;
    els.reelProgressFill.style.width = pct + '%';
    els.reelCounter.textContent =
      String(safePos + 1).padStart(2, '0') +
      ' / ' +
      String(safeTotal).padStart(2, '0');
  }

  function setupReelCenterObserver() {
    if (reelCenterObserver) {
      reelCenterObserver.disconnect();
    }
    if (!els.reelViewport || !els.reelTrack || !('IntersectionObserver' in window)) {
      return;
    }

    var items = Array.prototype.slice.call(
      els.reelTrack.querySelectorAll('.reel-item')
    );
    if (!items.length) return;

    reelCenterObserver = new IntersectionObserver(
      function (entries) {
        var bestEntry = null;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (
            !bestEntry ||
            entry.intersectionRatio > bestEntry.intersectionRatio
          ) {
            bestEntry = entry;
          }
        });
        if (!bestEntry) return;
        var activePos = Number(bestEntry.target.dataset.pos || 0);
        state.reelActiveIdx = activePos;
        items.forEach(function (el) {
          el.classList.toggle('is-centered', el === bestEntry.target);
        });
        updateReelProgress(activePos, items.length);
      },
      {
        root: els.reelViewport,
        threshold: [0.55, 0.75, 0.95],
      }
    );

    items.forEach(function (item) {
      reelCenterObserver.observe(item);
    });
  }

  function renderReel() {
    if (!els.reelTrack) return;
    els.reelTrack.innerHTML = '';

    var itemsWithIndex = [];
    state.videos.forEach(function (video, globalIndex) {
      if (state.reelFilter === 'all' || video.orientation === state.reelFilter) {
        itemsWithIndex.push({ video: video, globalIndex: globalIndex });
      }
    });

    state.filteredReelVideos = itemsWithIndex;
    state.reelActiveIdx = 0;

    itemsWithIndex.forEach(function (entry, pos) {
      var video = entry.video;
      var globalIndex = entry.globalIndex;

      var isHorizontal = video.orientation === 'horizontal';
      var item = document.createElement('article');
      item.className =
        'reel-item ' +
        (isHorizontal ? 'reel-item--horizontal' : 'reel-item--vertical') +
        (pos === 0 ? ' is-centered' : '');
      item.dataset.index = String(globalIndex);
      item.dataset.pos = String(pos);

      var shell = document.createElement('div');
      shell.className = 'reel-card-shell bezel-shell spotlight-card';

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'reel-media-btn';
      button.dataset.index = String(globalIndex);

      var media = document.createElement('div');
      media.className = 'reel-media';
      media.style.setProperty('--ar', aspectString(video));

      var mediaEl = mediaFor(video, false);
      media.appendChild(mediaEl);

      var overlay = document.createElement('div');
      overlay.className = 'reel-card-overlay';

      var tagPill = document.createElement('span');
      tagPill.className = 'reel-tag-pill';
      tagPill.textContent =
        (state.lang === 'en' ? video.tag_en : video.tag_es) ||
        formatRatio(video);

      var playBadge = document.createElement('span');
      playBadge.className = 'reel-play-badge';
      playBadge.setAttribute('aria-hidden', 'true');
      var tri = document.createElement('span');
      tri.className = 'play-triangle';
      playBadge.appendChild(tri);

      overlay.appendChild(tagPill);
      overlay.appendChild(playBadge);
      media.appendChild(overlay);
      button.appendChild(media);

      var meta = document.createElement('div');
      meta.className = 'reel-meta';

      var label = document.createElement('h3');
      label.className = 'reel-label';
      label.textContent = videoLabel(video);
      meta.appendChild(label);

      if (video.client) {
        var sublabel = document.createElement('p');
        sublabel.className = 'reel-sublabel';
        sublabel.textContent = video.title || '';
        meta.appendChild(sublabel);
      }

      button.appendChild(meta);
      shell.appendChild(button);
      item.appendChild(shell);
      els.reelTrack.appendChild(item);
    });

    if (els.reelViewport) els.reelViewport.scrollLeft = 0;

    els.reelTrack.querySelectorAll('video').forEach(observePlayback);
    setupReelCenterObserver();
    updateReelProgress(0, itemsWithIndex.length);

    if (els.reelControls) {
      els.reelControls.hidden = itemsWithIndex.length === 0;
    }
  }

  function scrollReel(direction) {
    if (!els.reelViewport || !els.reelTrack) return;
    var items = Array.prototype.slice.call(
      els.reelTrack.querySelectorAll('.reel-item')
    );
    if (!items.length) return;

    var nextPos = Math.min(
      Math.max(state.reelActiveIdx + direction, 0),
      items.length - 1
    );
    var target = items[nextPos];
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: state.reduced ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      state.reelActiveIdx = nextPos;
      items.forEach(function (el, idx) {
        el.classList.toggle('is-centered', idx === nextPos);
      });
      updateReelProgress(nextPos, items.length);
    }
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

    if (els.reelFilters) {
      els.reelFilters.addEventListener('click', function (event) {
        var btn = event.target.closest('.filter-pill');
        if (!btn) return;
        var nextFilter = btn.dataset.filter || 'all';
        if (nextFilter === state.reelFilter) return;
        state.reelFilter = nextFilter;

        els.reelFilters.querySelectorAll('.filter-pill').forEach(function (el) {
          var active = el === btn;
          el.classList.toggle('is-active', active);
          el.setAttribute('aria-pressed', String(active));
        });

        renderReel();
        updateDynamicText();
      });
    }
  }

  /* -------------------------------------------------------
     Cases / Asymmetric Bento (PC) & Compact Cards (Mobile)
     ------------------------------------------------------- */

  function renderCases() {
    if (!els.casesList) return;
    els.casesList.innerHTML = '';

    var mobileMode = isMobileViewport();

    var hasOddLast = state.videos.length % 2 === 1;

    state.videos.forEach(function (video, index) {
      var isHorizontal = video.orientation === 'horizontal';
      var isLastOdd = hasOddLast && index === state.videos.length - 1;

      var article = document.createElement('article');
      article.className =
        'case bezel-shell spotlight-card reveal ' +
        (isHorizontal ? 'case--horizontal' : 'case--vertical') +
        (isLastOdd ? ' is-last-odd' : '');
      article.id = 'caso-' + video.id;
      article.dataset.index = String(index);

      var core = document.createElement('div');
      core.className = 'bezel-core case-core';

      var grid = document.createElement('div');
      grid.className = 'case-grid';

      // Column 1: Media button
      var mediaBtn = document.createElement('button');
      mediaBtn.type = 'button';
      mediaBtn.className = 'case-media-wrap';
      mediaBtn.dataset.index = String(index);

      var media = document.createElement('div');
      media.className = 'case-media';
      media.style.setProperty('--ar', aspectString(video));
      media.appendChild(mediaFor(video, mobileMode));

      var playCircle = document.createElement('span');
      playCircle.className = 'case-media-play';
      playCircle.setAttribute('aria-hidden', 'true');
      var playTri = document.createElement('span');
      playTri.className = 'play-triangle';
      playCircle.appendChild(playTri);

      mediaBtn.appendChild(media);
      mediaBtn.appendChild(playCircle);

      // Column 2 (+ optional Column 3 on .is-last-odd): Info wrapper
      var info = document.createElement('div');
      info.className = 'case-info';

      var copy = document.createElement('div');
      copy.className = 'case-copy';

      var headMeta = document.createElement('div');
      headMeta.className = 'case-head-meta';

      var number = document.createElement('span');
      number.className = 'case-number';
      number.textContent = String(index + 1).padStart(2, '0');
      headMeta.appendChild(number);

      var badges = document.createElement('div');
      badges.className = 'case-badges';

      if (video.client) {
        var clientPill = document.createElement('span');
        clientPill.className = 'case-pill is-client';
        clientPill.textContent = video.client;
        badges.appendChild(clientPill);
      }

      var typePill = document.createElement('span');
      typePill.className = 'case-pill case-type';
      badges.appendChild(typePill);

      headMeta.appendChild(badges);
      copy.appendChild(headMeta);

      var title = document.createElement('h3');
      title.className = 'case-title';
      title.textContent = video.title || '';
      copy.appendChild(title);

      var desc = document.createElement('p');
      desc.className = 'case-desc';
      copy.appendChild(desc);

      var tagsWrap = document.createElement('div');
      tagsWrap.className = 'case-tags';
      copy.appendChild(tagsWrap);

      var sideCol = document.createElement('div');
      sideCol.className = 'case-side-col';

      var specsList = document.createElement('dl');
      specsList.className = 'case-specs';
      sideCol.appendChild(specsList);

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
        sideCol.appendChild(metrics);
      }

      var actions = document.createElement('div');
      actions.className = 'case-actions';

      var openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.className = 'case-open';
      openBtn.dataset.index = String(index);

      var openText = document.createElement('span');
      openText.className = 'case-open-label';
      openText.textContent = t('case_open');

      var openCircle = document.createElement('span');
      openCircle.className = 'btn-circle';
      openCircle.setAttribute('aria-hidden', 'true');
      openCircle.textContent = '↗';

      openBtn.appendChild(openText);
      openBtn.appendChild(openCircle);
      actions.appendChild(openBtn);
      sideCol.appendChild(actions);

      info.appendChild(copy);
      info.appendChild(sideCol);

      grid.appendChild(mediaBtn);
      grid.appendChild(info);
      core.appendChild(grid);
      article.appendChild(core);
      els.casesList.appendChild(article);
    });

    if (!mobileMode) {
      els.casesList.querySelectorAll('video').forEach(observePlayback);
    }

    syncMobileCasesState();
    observeReveals();
  }

  function syncMobileCasesState() {
    if (!els.casesList || !els.casesToggleWrap || !els.casesToggleBtn) return;
    var hasExtra = state.videos.length > 3 && isMobileViewport();
    els.casesToggleWrap.hidden = !hasExtra;
    els.casesList.classList.toggle(
      'is-mobile-collapsed',
      hasExtra && !state.casesExpandedMobile
    );
    els.casesToggleBtn.textContent = t(
      state.casesExpandedMobile ? 'cases_show_less' : 'cases_show_all'
    );
  }

  /* -------------------------------------------------------
     Index / Interactive Hover-Preview Archive
     ------------------------------------------------------- */

  function updateIndexPreview(video) {
    if (!els.indexPreview || !video) return;
    if (els.indexPreviewImg) {
      els.indexPreviewImg.src = posterUrlFor(video);
      els.indexPreviewImg.alt = video.title || '';
    }
    if (els.indexPreviewClient) {
      els.indexPreviewClient.textContent =
        (video.client || (state.lang === 'en' ? 'Project' : 'Proyecto')) +
        ' · ' +
        formatRatio(video);
    }
    if (els.indexPreviewTitle) {
      els.indexPreviewTitle.textContent = video.title || '';
    }
  }

  function renderIndex() {
    if (!els.indexList) return;
    els.indexList.innerHTML = '';

    if (els.indexCount) {
      els.indexCount.textContent = String(state.videos.length).padStart(2, '0');
    }

    state.videos.forEach(function (video, index) {
      var link = document.createElement('a');
      link.className = 'index-item';
      link.href = '#caso-' + video.id;
      link.dataset.index = String(index);
      link.setAttribute('role', 'listitem');

      var num = document.createElement('span');
      num.className = 'index-num';
      num.textContent = String(index + 1).padStart(2, '0');

      var thumb = document.createElement('span');
      thumb.className = 'index-thumb';
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = '';
      img.src = posterUrlFor(video);
      thumb.appendChild(img);

      var mainInfo = document.createElement('span');
      mainInfo.className = 'index-main';
      var name = document.createElement('span');
      name.className = 'index-name';
      name.textContent = video.title || '';
      mainInfo.appendChild(name);

      if (video.client) {
        var client = document.createElement('span');
        client.className = 'index-client';
        client.textContent = video.client;
        mainInfo.appendChild(client);
      }

      var tag = document.createElement('span');
      tag.className = 'index-tag';

      var arrow = document.createElement('span');
      arrow.className = 'index-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';

      link.appendChild(num);
      link.appendChild(thumb);
      link.appendChild(mainInfo);
      link.appendChild(tag);
      link.appendChild(arrow);

      link.addEventListener('mouseenter', function () {
        updateIndexPreview(video);
      });
      link.addEventListener('focus', function () {
        updateIndexPreview(video);
      });
      link.addEventListener('click', function () {
        if (index >= 3 && !state.casesExpandedMobile) {
          state.casesExpandedMobile = true;
          syncMobileCasesState();
        }
      });

      els.indexList.appendChild(link);
    });

    if (state.videos.length) {
      updateIndexPreview(state.videos[0]);
    }
  }

  /* -------------------------------------------------------
     i18n & Dynamic Text
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
        if (!video) return;
        item.setAttribute(
          'aria-label',
          dict.index_go + ': ' + (video.title || '')
        );
        var tagEl = item.querySelector('.index-tag');
        if (tagEl) {
          var tag = state.lang === 'en' ? video.tag_en : video.tag_es;
          tagEl.textContent = tag || formatRatio(video);
        }
      });
    }

    if (els.casesList) {
      els.casesList.querySelectorAll('.case').forEach(function (article) {
        var video = state.videos[Number(article.dataset.index)];
        if (!video) return;

        var details = getCaseDetails(video);

        var typePill = article.querySelector('.case-type');
        if (typePill) {
          var tag = state.lang === 'en' ? video.tag_en : video.tag_es;
          typePill.textContent = tag || formatRatio(video);
        }

        var desc = article.querySelector('.case-desc');
        if (desc) {
          desc.textContent = details.desc;
        }

        var tagsWrap = article.querySelector('.case-tags');
        if (tagsWrap) {
          tagsWrap.innerHTML = '';
          details.tags.forEach(function (tagText) {
            var span = document.createElement('span');
            span.className = 'case-tag';
            span.textContent = tagText;
            tagsWrap.appendChild(span);
          });
        }

        var specsList = article.querySelector('.case-specs');
        if (specsList) {
          specsList.innerHTML = '';
          details.specs.forEach(function (spec) {
            var box = document.createElement('div');
            box.className = 'case-spec';
            var dt = document.createElement('dt');
            dt.textContent = dict[spec.labelKey] || spec.labelKey;
            var dd = document.createElement('dd');
            dd.textContent = spec.value;
            box.appendChild(dt);
            box.appendChild(dd);
            specsList.appendChild(box);
          });
        }

        article.querySelectorAll('.metric-label').forEach(function (label) {
          var value =
            state.lang === 'en' ? label.dataset.labelEn : label.dataset.labelEs;
          label.textContent = value || '';
        });

        var mediaWrap = article.querySelector('.case-media-wrap');
        if (mediaWrap) {
          mediaWrap.setAttribute(
            'aria-label',
            dict.open_video + ': ' + (video.title || '')
          );
        }

        var openButton = article.querySelector('.case-open');
        if (openButton) {
          var openLabel = openButton.querySelector('.case-open-label');
          if (openLabel) openLabel.textContent = dict.case_open;
          openButton.setAttribute(
            'aria-label',
            dict.case_open + ': ' + (video.title || '')
          );
        }
      });
    }

    if (els.heroPlayBtn) {
      els.heroPlayBtn.setAttribute('aria-label', dict.hero_play_aria);
    }
    if (els.heroProgress) {
      els.heroProgress.setAttribute('aria-label', dict.hero_progress_aria);
    }

    var heroVideo = state.heroItems[state.heroIndex];
    if (heroVideo) {
      els.heroSep.hidden = !heroVideo.video.client;
    }

    if (state.videos.length) {
      updateIndexPreview(state.videos[0]);
    }

    syncMobileCasesState();
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
     Load Manifest
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
    observeReveals();
    setupNavObserver();
  }

  /* -------------------------------------------------------
     Scroll Reveals, Spotlight & Active Nav Observer
     ------------------------------------------------------- */

  function observeReveals() {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll('.reveal:not(.is-visible)')
    );
    if (!nodes.length) return;

    if (state.reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (node) {
        node.classList.add('is-visible');
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
    }

    nodes.forEach(function (node) {
      revealObserver.observe(node);
    });

    window.setTimeout(function () {
      var vh = window.innerHeight || 900;
      nodes.forEach(function (node) {
        if (node.classList.contains('is-visible')) return;
        var rect = node.getBoundingClientRect();
        if (rect.top < vh * 1.15) {
          node.classList.add('is-visible');
          if (revealObserver) revealObserver.unobserve(node);
        }
      });
    }, 600);
  }

  function setupSpotlightEffect() {
    if (
      state.reduced ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return;
    }

    document.addEventListener(
      'pointermove',
      function (event) {
        var card = event.target.closest('.spotlight-card');
        if (!card) return;
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', event.clientX - rect.left + 'px');
        card.style.setProperty('--mouse-y', event.clientY - rect.top + 'px');
      },
      { passive: true }
    );
  }

  function setupNavObserver() {
    if (!('IntersectionObserver' in window)) return;
    if (navObserver) navObserver.disconnect();

    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav-links a[href^="#"]')
    );
    if (!links.length) return;

    navObserver = new IntersectionObserver(
      function (entries) {
        var best = null;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        });
        if (!best) return;
        var activeId = '#' + best.target.id;
        links.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === activeId
          );
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.4] }
    );

    ['reel', 'casos', 'indice', 'perfil', 'contacto'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) navObserver.observe(section);
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
     Mobile Menu
     ------------------------------------------------------- */

  function toggleMenu(force) {
    if (!els.menuOverlay || !els.menuBtn) return;
    var open =
      typeof force === 'boolean' ? force : els.menuOverlay.hidden === true;

    els.menuOverlay.hidden = !open;
    els.menuBtn.setAttribute('aria-expanded', String(open));
    els.menuBtn.setAttribute('aria-label', t(open ? 'menu_close' : 'nav_menu'));

    if (els.menuBtnLabel) {
      els.menuBtnLabel.dataset.i18n = open ? 'menu_close' : 'nav_menu';
      els.menuBtnLabel.textContent = t(open ? 'menu_close' : 'nav_menu');
    }

    document.body.classList.toggle('menu-open', open);
  }

  /* -------------------------------------------------------
     Init
     ------------------------------------------------------- */

  function cacheElements() {
    els.heroSection = document.getElementById('inicio');
    els.heroStage = document.getElementById('heroStage');
    els.heroAmbient = document.getElementById('heroAmbient');
    els.heroProgress = document.getElementById('heroProgress');
    els.heroClient = document.getElementById('heroClient');
    els.heroTitleLabel = document.getElementById('heroTitleLabel');
    els.heroSep = document.getElementById('heroSep');
    els.heroPlayBtn = document.getElementById('heroPlayBtn');

    els.reelTrack = document.getElementById('reelTrack');
    els.reelViewport = document.querySelector('.reel-viewport');
    els.reelControls = document.getElementById('reelControls');
    els.reelFilters = document.getElementById('reelFilters');
    els.reelProgressFill = document.getElementById('reelProgressFill');
    els.reelCounter = document.getElementById('reelCounter');
    els.reelPrev = document.getElementById('reelPrev');
    els.reelNext = document.getElementById('reelNext');

    els.casesList = document.getElementById('casesList');
    els.casesToggleWrap = document.getElementById('casesToggleWrap');
    els.casesToggleBtn = document.getElementById('casesToggleBtn');

    els.indexList = document.getElementById('indexList');
    els.indexCount = document.getElementById('indexCount');
    els.indexPreview = document.getElementById('indexPreview');
    els.indexPreviewImg = document.getElementById('indexPreviewImg');
    els.indexPreviewClient = document.getElementById('indexPreviewClient');
    els.indexPreviewTitle = document.getElementById('indexPreviewTitle');

    els.modal = document.getElementById('videoModal');
    els.modalTitle = document.getElementById('modalTitle');
    els.modalDrive = document.getElementById('modalDrive');
    els.modalFrame = document.getElementById('modalFrame');
    els.modalClose = document.getElementById('modalClose');
    els.modalPrev = document.getElementById('modalPrev');
    els.modalNext = document.getElementById('modalNext');

    els.menuBtn = document.getElementById('menuBtn');
    els.menuBtnLabel = els.menuBtn
      ? els.menuBtn.querySelector('.menu-btn-label')
      : null;
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

    if (els.heroPlayBtn) {
      els.heroPlayBtn.addEventListener('click', function () {
        var current = state.heroItems[state.heroIndex];
        if (!current) return;
        var globalIdx = state.videos.indexOf(current.video);
        if (globalIdx >= 0) openModal(globalIdx);
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
        var trigger = event.target.closest('.case-open, .case-media-wrap');
        if (!trigger) return;
        var index = Number(trigger.dataset.index);
        if (Number.isInteger(index)) openModal(index);
      });
    }

    if (els.casesToggleBtn) {
      els.casesToggleBtn.addEventListener('click', function () {
        state.casesExpandedMobile = !state.casesExpandedMobile;
        syncMobileCasesState();
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

    // Re-sync mobile cases media vs desktop video when crossing 767px breakpoint
    var mq = window.matchMedia('(max-width: 767px)');
    var handleBreakpointChange = function () {
      if (state.videos.length) {
        renderCases();
        updateDynamicText();
      }
    };
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleBreakpointChange);
    }
  }

  function init() {
    document.documentElement.classList.add('js-ready');
    cacheElements();

    state.lang = readLanguage();
    state.reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      Boolean(
        navigator.connection && navigator.connection.saveData === true
      );

    setupPlaybackObserver();
    setupHeroVisibility();
    setupSpotlightEffect();
    bindUI();
    applyTranslations();
    observeReveals();
    loadVideos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
