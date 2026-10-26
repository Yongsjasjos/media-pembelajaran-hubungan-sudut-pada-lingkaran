// Interaksi slide, animasi geometri, dan navigasi
let currentSlide = 1;
    const totalSlides = 14;

    function showSlide(n) {
      currentSlide = Math.max(1, Math.min(totalSlides, n));
      const target = document.getElementById(`slide-${currentSlide}`);
      if(target) document.querySelector('.deck-container').scrollTo({top: target.offsetTop, behavior: 'smooth'});
      document.getElementById('slide-num').innerText = `Slide ${currentSlide} / ${totalSlides}`;
    }

    // Pantau hanya kontainer presentasi agar slide yang berdekatan tidak sama-sama dianggap aktif.
    const deck = document.querySelector('.deck-container');
    const slideObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (visible && visible.intersectionRatio >= 0.55) {
        currentSlide = Number(visible.target.id.replace('slide-', ''));
        document.getElementById('slide-num').innerText = `Slide ${currentSlide} / ${totalSlides}`;
        document.querySelectorAll('.slide').forEach(s => s.classList.toggle('active', s === visible.target));
        if (visible.target.id === 'slide-10' || visible.target.id === 'slide-11') { visible.target.querySelectorAll('svg').forEach(svg => { svg.style.animation='none'; void svg.offsetWidth; svg.style.animation=''; }); }
      }
    }, { root: deck, threshold: [0.35, 0.55, 0.75] });
    document.querySelectorAll('.slide').forEach(slide => slideObserver.observe(slide));


    function toggleElementMenu() {
      const menu = document.getElementById('element-menu');
      const button = document.getElementById('element-intro');
      const isOpening = menu.hidden;
      menu.hidden = !isOpening;
      button.querySelector('span').textContent = isOpening ? '−' : '＋';
      document.getElementById('element-instruction').textContent = isOpening
        ? 'Pilih unsur. Garis atau daerah akan ditampilkan perlahan pada lingkaran.'
        : 'Menu ditutup. Lingkaran kembali polos saat menu dibuka lagi.';
      if (!isOpening) {
        document.getElementById('element-visual').innerHTML = '';
        document.getElementById('element-definition').textContent = 'Definisi akan muncul setelah salah satu unsur dipilih.';
        document.querySelectorAll('#element-menu button').forEach(b=>b.classList.remove('selected'));
      }
    }
    const elementInfo = {
      pusat: ['Titik pusat', 'Titik tetap di tengah lingkaran yang berjarak sama dari setiap titik pada lingkaran.'],
      jari: ['Jari-jari', 'Ruas garis yang menghubungkan titik pusat dengan satu titik pada lingkaran.'],
      diameter: ['Diameter', 'Ruas garis yang melalui titik pusat dan menghubungkan dua titik pada lingkaran. Panjangnya dua kali jari-jari.'],
      busur: ['Busur', 'Bagian lengkung dari keliling lingkaran yang terletak di antara dua titik pada lingkaran.'],
      tali: ['Tali busur', 'Ruas garis yang menghubungkan dua titik pada lingkaran.'],
      apotema: ['Apotema', 'Ruas garis dari titik pusat yang tegak lurus terhadap suatu tali busur.'],
      tembereng: ['Tembereng', 'Daerah dalam lingkaran yang dibatasi oleh sebuah tali busur dan busur yang bersesuaian.'],
      juring: ['Juring', 'Daerah dalam lingkaran yang dibatasi oleh dua jari-jari dan busur di antaranya.']
    };
    function showElement(key, button) {
      document.querySelectorAll('#element-menu button').forEach(b=>b.classList.toggle('selected',b===button));
      const g = document.getElementById('element-visual');
      const blue = '#2563EB', red = '#EF4444', green = '#059669';
      const line = (x1,y1,x2,y2,color=blue,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-linecap="round" ${extra}/>`;
      const dot = (x,y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${red}"/>`;
      // Busur memakai titik yang benar-benar berada pada lingkaran (pusat 150,145; jari-jari 105).
      const arc = 'M 90 58.84 A 105 105 0 0 1 210 58.84';
      let drawing = '';
      if(key==='pusat') drawing = `${dot(150,145)}<text x="160" y="140">O (pusat)</text>`;
      if(key==='jari') drawing = `${line(150,145,255,145)}${dot(150,145)}${dot(255,145)}<text x="188" y="132">r</text>`;
      if(key==='diameter') drawing = `${line(45,145,255,145,red)}${dot(45,145)}${dot(255,145)}${dot(150,145)}<text x="160" y="135">O</text><text x="150" y="166">diameter</text>`;
      if(key==='busur') drawing = `<path d="${arc}" fill="none" stroke="${green}" stroke-width="6" stroke-linecap="round"/><circle cx="90" cy="58.84" r="4.5" fill="${red}"/><circle cx="210" cy="58.84" r="4.5" fill="${red}"/><text x="150" y="42" text-anchor="middle" style="font-size:12px;fill:#059669">busur</text>`;
      if(key==='tali') drawing = `${line(90,54,210,54,blue)}${dot(90,54)}${dot(210,54)}<text x="130" y="43">tali busur</text>`;
      if(key==='apotema') drawing = `${line(90,54,210,54,blue)}${line(150,145,150,54,red)}${dot(150,145)}<path d="M150 66 h12 v-12" fill="none" stroke="${red}" stroke-width="2"/><text x="157" y="95">apotema</text>`;
      if(key==='tembereng') drawing = `<path d="M90 58.84 A105 105 0 0 1 210 58.84 L90 58.84 Z" fill="#93C5FD" opacity=".82" stroke="${blue}" stroke-width="3"/><path d="M90 58.84 L210 58.84" fill="none" stroke="${red}" stroke-width="3"/><text x="150" y="39" text-anchor="middle" style="font-size:12px;fill:#1D4ED8">tembereng</text>`;
      if(key==='juring') drawing = `<path d="M150 145 L255 145 A105 105 0 0 0 202 54 Z" fill="#93C5FD" opacity=".75" stroke="${blue}" stroke-width="2"/>${line(150,145,255,145)}${line(150,145,202,54)}${dot(150,145)}`;
      g.innerHTML = drawing;
      g.querySelectorAll('line,path,circle').forEach(el => {
        if (el.tagName.toLowerCase()==='line' || el.tagName.toLowerCase()==='path') {
          const length = el.getTotalLength ? el.getTotalLength() : 0;
          if(length) { el.style.strokeDasharray = length; el.style.strokeDashoffset = length; el.style.transition = 'stroke-dashoffset 1.1s ease'; requestAnimationFrame(()=>el.style.strokeDashoffset='0'); }
          el.style.opacity='0.98';
        }
      });
      const [title,definition] = elementInfo[key];
      document.getElementById('element-definition').innerHTML = `<strong>${title}.</strong> ${definition}<div class="source-note">Sumber: Susanto, D., dkk. (2021), <em>Matematika untuk SMA/SMK Kelas XI</em>, Bab 2; Tohir, M., dkk. (2022), <em>Matematika untuk SMA/SMK/MA Kelas XII</em>, Bab 2.</div>`;
    }
    function animateAngle(index, button, preserveAll = false) {
      const cards = Array.from(document.querySelectorAll('#slide-4 .angle-card'));
      const card = cards[index - 1];
      if (!card) return;

      // Play biasa mengulang satu pilihan dan mereset kartu lain; mode semua mempertahankan hasil kartu lain.
      if (!preserveAll) cards.forEach((c) => {
        c.classList.remove('outside-playing');
        const base = c.querySelector('svg.angle-visual');
        const img = c.querySelector('.angle-outside-img');
        if (base) {
          base.style.display = 'block';
          base.querySelectorAll(':scope > *:not(circle)').forEach(el => el.remove());
          const circle = base.querySelector('circle');
          if (circle) {
            circle.setAttribute('stroke-dasharray', '');
            circle.setAttribute('stroke-dashoffset', '');
            circle.style.opacity = '1';
          }
        }
        if (img) { img.style.display = 'none'; }
        const def = c.querySelector('.angle-definition');
        if (def) def.hidden = true;
        const defBtn = c.querySelector('.definition-btn');
        if (defBtn) defBtn.textContent = 'Cek definisi';
        const play = c.querySelector('.play-angle-btn');
        if (play) play.textContent = '▶ Play visualisasi';
      });

      const svg = card.querySelector('svg.angle-visual');
      const playBtn = card.querySelector('.play-angle-btn');
      if (!svg) return;
      if (preserveAll) {
        svg.querySelectorAll(':scope > *:not(circle)').forEach(el => el.remove());
        const circle = svg.querySelector('circle');
        if (circle) { circle.style.opacity = '1'; circle.setAttribute('stroke-dasharray',''); circle.setAttribute('stroke-dashoffset',''); }
      }
      if (playBtn) playBtn.textContent = '↻ Putar ulang';

      // Gambar elemen SVG dengan fallback jika Web Animations API tidak tersedia.
      const ns = 'http://www.w3.org/2000/svg';
      function draw(el, delay = 0) {
        let length = 180;
        try { if (typeof el.getTotalLength === 'function') length = Math.max(1, el.getTotalLength()); } catch (_) {}
        el.style.strokeDasharray = String(length);
        el.style.strokeDashoffset = String(length);
        el.style.opacity = '0';
        if (typeof el.animate === 'function') {
          el.animate(
            [{ opacity: 0, strokeDashoffset: String(length) }, { opacity: 1, strokeDashoffset: '0' }],
            { duration: 850, delay, easing: 'ease-in-out', fill: 'forwards' }
          );
        } else {
          el.style.transition = `stroke-dashoffset 850ms ease-in-out ${delay}ms, opacity 200ms ease ${delay}ms`;
          setTimeout(() => { el.style.opacity = '1'; el.style.strokeDashoffset = '0'; }, 30);
        }
      }
      function addLine(x1, y1, x2, y2, delay = 0, color = '#2563EB', width = 3) {
        const el = document.createElementNS(ns, 'line');
        Object.entries({ x1, y1, x2, y2, stroke: color, 'stroke-width': width, 'stroke-linecap': 'round' })
          .forEach(([k, v]) => el.setAttribute(k, v));
        svg.appendChild(el); draw(el, delay); return el;
      }
      function addDot(x, y, delay = 0, color = '#DC2626', r = 3.8) {
        const el = document.createElementNS(ns, 'circle');
        Object.entries({ cx: x, cy: y, r, fill: color }).forEach(([k, v]) => el.setAttribute(k, v));
        el.style.opacity = '0'; svg.appendChild(el);
        if (typeof el.animate === 'function') {
          el.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }],
            { duration: 400, delay, easing: 'ease-out', fill: 'forwards' });
        } else setTimeout(() => { el.style.opacity = '1'; }, delay);
        return el;
      }
      function addPath(d, delay = 0, color = '#EF4444', width = 2.8) {
        const el = document.createElementNS(ns, 'path');
        Object.entries({ d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
          .forEach(([k, v]) => el.setAttribute(k, v));
        svg.appendChild(el); draw(el, delay); return el;
      }
      function addText(x, y, text, delay = 1900, color = '#0F172A') {
        const el = document.createElementNS(ns, 'text');
        Object.entries({ x, y, fill: color, 'font-size': 10, 'font-weight': 700 }).forEach(([k, v]) => el.setAttribute(k, v));
        el.textContent = text; el.style.opacity = '0'; svg.appendChild(el);
        if (typeof el.animate === 'function') {
          el.animate([{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 350, delay, easing: 'ease-out', fill: 'forwards' });
        } else setTimeout(() => { el.style.opacity = '1'; }, delay);
      }

      if (index === 4) {
        // Sudut luar: dua garis secan melewati lingkaran dan bertemu di titik P di kanan.
        // Busur sudut kecil berpusat tepat di P dan kedua ujungnya mengikuti arah kedua secan.
        const P = { x: 207, y: 60 };
        addLine(P.x, P.y, 39, 28, 200);
        addLine(P.x, P.y, 39, 92, 900);
        addPath('M 190.4 56.8 A 17.2 17.2 0 0 0 190.4 63.2', 1650, '#DC2626', 2.8);
        addDot(P.x, P.y, 1950, '#DC2626', 4.2);
        addText(177, 79, 'P (luar)', 2100, '#DC2626');
        return;
      }

      // Tiga sudut lainnya: konstruksi muncul satu per satu di atas lingkaran polos.
      if (index === 1) {
        addLine(110, 60, 151, 38, 200);
        addLine(110, 60, 151, 82, 850);
        addPath('M 130 49 A 23 23 0 0 1 130 71', 1500, '#EF4444', 3);
        addDot(110, 60, 1750, '#DC2626'); addText(94, 76, 'O', 1850); addText(126, 40, 'r', 2050, '#2563EB'); addText(126, 81, 'r', 2150, '#2563EB'); addText(129, 54, 'α', 2250, '#DC2626');
      } else if (index === 2) {
        addLine(80, 28, 110, 96, 200);
        addLine(110, 96, 147, 32, 850);
        addPath('M 103 79 A 18 18 0 0 1 119 80', 1500, '#EF4444', 3);
        addDot(110, 96, 1750, '#DC2626'); addText(116, 108, 'C', 1850); addText(89, 57, 'A', 1950); addText(149, 62, 'B', 2050); addText(114, 82, 'β', 2200, '#DC2626');
      } else if (index === 3) {
        // Dua tali busur dengan keempat ujung tepat pada keliling lingkaran.
        // Pusat (110,60), r=44; ujung tali busur berada pada (74,34), (146,86), (146,34), (74,86).
        addLine(74, 34, 146, 86, 200);
        addLine(146, 34, 74, 86, 850);
        addPath('M 100 60 A 10 10 0 0 1 120 60', 1500, '#EF4444', 3);
        addDot(110, 60, 1750, '#DC2626');
        addText(116, 53, 'E', 1850, '#DC2626'); addText(90, 53, 'α', 2100, '#DC2626'); addText(130, 75, 'β', 2200, '#DC2626');
      }
    }
    window.animateAngle = animateAngle;
    window.toggleDefinition = toggleDefinition;

    function animateAllAngles() {
      const cards = Array.from(document.querySelectorAll('#slide-4 .angle-card'));
      cards.forEach((card, i) => {
        const play = card.querySelector('.play-angle-btn');
        animateAngle(i + 1, play, true);
      });
      const btn = document.getElementById('show-all-angles');
      if (btn) btn.textContent = '✓ Seluruh animasi ditampilkan';
    }
    window.animateAllAngles = animateAllAngles;

    function toggleDefinition(id, button) {
      const el = document.getElementById(id);
      el.hidden = !el.hidden;
      button.textContent = el.hidden ? 'Cek definisi' : 'Sembunyikan definisi';
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
    document.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'f') toggleFullscreen();
    });

    function changeSlide(dir) {
      currentSlide += dir;
      if(currentSlide < 1) currentSlide = 1;
      if(currentSlide > totalSlides) currentSlide = totalSlides;
      showSlide(currentSlide);
    }

    // Pembahasan contoh soal maju satu tahap per klik; tahap lama tetap terlihat.
    function advanceExample(button) {
      const card = button.closest('.example-card');
      if (!card) return;
      const wrap = card.querySelector('.worked-steps');
      const steps = Array.from(wrap.querySelectorAll('[data-workstep]'));
      let current = Number(wrap.dataset.step || 0);
      current = Math.min(current + 1, steps.length);
      wrap.dataset.step = String(current);
      steps.forEach((el, i) => { if (i < current) el.classList.add('revealed'); });
      const svg = card.querySelector('.example-svg');
      if (svg) {
        const parts = Array.from(svg.children);
        const thresholds = [1, 4, 7, parts.length];
        const count = thresholds[Math.min(current, thresholds.length - 1)];
        parts.forEach((part, i) => {
          if (i < count) {
            part.style.opacity = '1';
            if (i > 0 && !part.dataset.animated) {
              part.dataset.animated = '1';
              part.style.transformBox = 'fill-box'; part.style.transformOrigin = 'center';
              part.animate?.([{opacity:0, transform:'scale(.96)'},{opacity:1,transform:'scale(1)'}], {duration:420, easing:'ease-out', fill:'forwards'});
            }
          }
        });
      }
      button.textContent = current >= steps.length ? '✓ Pembahasan lengkap' : `Lanjut langkah ${current + 1} ▶`;
      if (current >= steps.length) button.disabled = true;
    }
    window.advanceExample = advanceExample;

    // Toggle Answers Panel
    function toggleAnswer(id) {
      const el = document.getElementById(id);
      if(el) el.classList.toggle('show');
    }


    // Diagram pembuktian: tiap tahap menambahkan objek sesuai urutan penjelasan.
    function prepareProofDiagrams() {
      [5,6,7].forEach(n => {
        const svg = document.querySelector(`#slide-${n} .geo-panel svg`);
        if (!svg) return;
        Array.from(svg.children).forEach((el, i) => {
          el.style.transition = 'opacity 420ms ease, stroke-dashoffset 650ms ease';
          el.style.display = (i === 0 && el.tagName.toLowerCase() === 'circle') ? '' : 'none';
          el.style.opacity = (i === 0 && el.tagName.toLowerCase() === 'circle') ? '1' : '0';
          el.style.strokeDasharray = '';
          el.style.strokeDashoffset = '';
        });
        svg.dataset.proofStep = '0';
      });
    }

    function showProofDiagram(n, step) {
      const svg = document.querySelector(`#slide-${n} .geo-panel svg`);
      if (!svg) return;
      const children = Array.from(svg.children);
      const specialId = n === 5 ? 'tri-aoc-5' : n === 6 ? 'tri-ade-6' : 'line-bc-7';
      const helperId = n === 5 ? 'line-diam-5' : n === 6 ? 'line-ad-6' : 'line-bc-7';
      // Token membatalkan animasi tertunda jika pengguna memilih langkah lain.
      const token = String((Number(svg.dataset.animationToken || 0) + 1));
      svg.dataset.animationToken = token;
      const previousStep = Number(svg.dataset.proofStep || 0);
      // Hanya Langkah 0 yang mengulang dari awal. Langkah berikutnya menambahkan
      // konstruksi baru dan mempertahankan seluruh objek yang telah muncul.
      if (step === 0) {
        children.forEach((el, i) => {
          el.style.transition = 'opacity 350ms ease, stroke-dashoffset 650ms ease';
          el.style.display = (i === 0 && el.tagName.toLowerCase() === 'circle') ? '' : 'none';
          el.style.opacity = (i === 0 && el.tagName.toLowerCase() === 'circle') ? '1' : '0';
          el.style.strokeDasharray = '';
          el.style.strokeDashoffset = '';
          el.classList.remove('active');
        });
      }
      const reveal = (el, animate=true) => {
        if (!el || el.style.display !== 'none' && el.style.opacity === '1') return;
        el.style.transition = 'opacity 350ms ease, stroke-dashoffset 650ms ease';
        el.style.display = '';
        const tag = el.tagName.toLowerCase();
        if (animate && (tag === 'line' || tag === 'polygon' || tag === 'path') && typeof el.getTotalLength === 'function') {
          let len = 1; try { len = Math.max(1, el.getTotalLength()); } catch (_) {}
          el.style.strokeDasharray = String(len);
          el.style.strokeDashoffset = String(len);
          el.style.opacity = '1';
          requestAnimationFrame(() => { if (svg.dataset.animationToken === token) el.style.strokeDashoffset = '0'; });
        } else {
          el.style.opacity = '0';
          requestAnimationFrame(() => { if (svg.dataset.animationToken === token) el.style.opacity = '1'; });
        }
      };
      const circle = children[0];
      if (circle) { circle.style.display=''; circle.style.opacity='1'; }
      if (step >= 0.5) {
        const baseObjects = children.filter((el,i) => i>0 && (
          (el.tagName.toLowerCase()==='line' && (n===5 ? el.id!=='line-diam-5' : n===6 ? el.id!=='line-ad-6' : el.id!=='line-bc-7')) ||
          el.tagName.toLowerCase()==='text' || (el.tagName.toLowerCase()==='circle' && i!==0)
        ));
        // Animasi hanya untuk objek yang belum muncul; objek sebelumnya menetap.
        baseObjects.forEach((el,i) => {
          if (el.style.display === 'none' || !el.style.display) {
            setTimeout(() => {
              if (svg.dataset.animationToken === token && Number(svg.dataset.proofStep || 0) >= 0.5) reveal(el, true);
            }, i*180);
          }
        });
      }
      if (step >= 1) reveal(document.getElementById(helperId), true);
      if (step >= 2) reveal(document.getElementById(specialId), true);
      if (n===6 && step>=2) {
        reveal(document.getElementById('arc-ab-6'), true);
        reveal(document.getElementById('arc-cd-6'), true);
      }
      if (step >= 3) children.forEach(el => reveal(el, true));
      const special = document.getElementById(specialId);
      if (special) special.classList.toggle('active', step >= 2);
      svg.dataset.proofStep = String(step);
    }

    // Interactive Proof Step Controllers
    function setProofStep5(step) {
      showProofDiagram(5, step);
      const btns = document.querySelectorAll('#slide-5 .step-btn');
      btns.forEach(b => b.classList.toggle('active', b.getAttribute('onclick').includes(`(${step})`)));
      const cards = document.querySelectorAll('#slide-5 .proof-card');
      cards.forEach(c => {
        let active = false;
        if (step === 0) active = c.id.endsWith('-0');
        else if (step === 0.5) active = c.id.endsWith('-0') || c.id.endsWith('-base');
        else {
          const m = c.id.match(/-(\d+)$/);
          active = c.id.endsWith('-base') || (m && Number(m[1]) <= step);
        }
        c.classList.toggle('active', !!active);
        let cardStep = null;
        if (c.id.endsWith('-0')) cardStep = 0;
        else if (c.id.endsWith('-base')) cardStep = 0.5;
        else {
          const match = c.id.match(/-(\d+)$/);
          if (match) cardStep = Number(match[1]);
        }
        c.classList.toggle('future', cardStep !== null && cardStep > step);
      });
      const line = document.getElementById('line-diam-5');
      if (line) line.classList.toggle('active', step >= 1);
      const shape = document.getElementById('tri-aoc-5'); if (shape) shape.classList.toggle('active', step >= 2);
    }

    function setProofStep6(step) {
      showProofDiagram(6, step);
      const btns = document.querySelectorAll('#slide-6 .step-btn');
      btns.forEach(b => b.classList.toggle('active', b.getAttribute('onclick').includes(`(${step})`)));
      const cards = document.querySelectorAll('#slide-6 .proof-card');
      cards.forEach(c => {
        let active = false;
        if (step === 0) active = c.id.endsWith('-0');
        else if (step === 0.5) active = c.id.endsWith('-0') || c.id.endsWith('-base');
        else {
          const m = c.id.match(/-(\d+)$/);
          active = c.id.endsWith('-base') || (m && Number(m[1]) <= step);
        }
        c.classList.toggle('active', !!active);
        let cardStep = null;
        if (c.id.endsWith('-0')) cardStep = 0;
        else if (c.id.endsWith('-base')) cardStep = 0.5;
        else {
          const match = c.id.match(/-(\d+)$/);
          if (match) cardStep = Number(match[1]);
        }
        c.classList.toggle('future', cardStep !== null && cardStep > step);
      });
      const line = document.getElementById('line-ad-6');
      if (line) line.classList.toggle('active', step >= 1);
      const shape = document.getElementById('tri-ade-6'); if (shape) shape.classList.toggle('active', step >= 2);
    }

    function setProofStep7(step) {
      showProofDiagram(7, step);
      const btns = document.querySelectorAll('#slide-7 .step-btn');
      btns.forEach(b => b.classList.toggle('active', b.getAttribute('onclick').includes(`(${step})`)));
      const cards = document.querySelectorAll('#slide-7 .proof-card');
      cards.forEach(c => {
        let active = false;
        if (step === 0) active = c.id.endsWith('-0');
        else if (step === 0.5) active = c.id.endsWith('-0') || c.id.endsWith('-base');
        else {
          const m = c.id.match(/-(\d+)$/);
          active = c.id.endsWith('-base') || (m && Number(m[1]) <= step);
        }
        c.classList.toggle('active', !!active);
        let cardStep = null;
        if (c.id.endsWith('-0')) cardStep = 0;
        else if (c.id.endsWith('-base')) cardStep = 0.5;
        else {
          const match = c.id.match(/-(\d+)$/);
          if (match) cardStep = Number(match[1]);
        }
        c.classList.toggle('future', cardStep !== null && cardStep > step);
      });
      const line = document.getElementById('line-bc-7');
      if (line) line.classList.toggle('active', step >= 1);
      
    }

    // Render equation berbasis LaTeX pada seluruh materi setelah DOM siap.
    document.addEventListener('DOMContentLoaded', () => {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});
      }
    });

    // Pena dan penghapus untuk mencoret langsung di atas slide.
    (() => {
      const canvas = document.getElementById('drawing-layer');
      const ctx = canvas.getContext('2d');
      const pen = document.getElementById('pen-tool');
      const eraser = document.getElementById('eraser-tool');
      const clear = document.getElementById('clear-tool');
      let mode = null, drawing = false;
      function resizeCanvas() {
        const old = document.createElement('canvas'); old.width = canvas.width; old.height = canvas.height;
        old.getContext('2d').drawImage(canvas, 0, 0);
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        canvas.style.width = window.innerWidth + 'px'; canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
        if (old.width && old.height) ctx.drawImage(old,0,0,old.width,old.height,0,0,window.innerWidth,window.innerHeight);
        ctx.lineCap='round'; ctx.lineJoin='round';
      }
      resizeCanvas(); window.addEventListener('resize', resizeCanvas);
      function setMode(next) {
        mode = mode === next ? null : next;
        canvas.classList.toggle('enabled', !!mode);
        pen.classList.toggle('active', mode === 'pen'); eraser.classList.toggle('active', mode === 'eraser');
        canvas.style.cursor = mode === 'eraser' ? 'cell' : 'crosshair';
      }
      pen.addEventListener('click', () => setMode('pen'));
      eraser.addEventListener('click', () => setMode('eraser'));
      clear.addEventListener('click', () => ctx.clearRect(0,0,window.innerWidth,window.innerHeight));
      canvas.addEventListener('pointerdown', e => { if (!mode) return; drawing=true; canvas.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(e.clientX,e.clientY); });
      canvas.addEventListener('pointermove', e => { if (!drawing || !mode) return; ctx.globalCompositeOperation = mode === 'eraser' ? 'destination-out' : 'source-over'; ctx.strokeStyle='#EF4444'; ctx.lineWidth=mode === 'eraser' ? 24 : 3; ctx.lineTo(e.clientX,e.clientY); ctx.stroke(); });
      const stop = () => { drawing=false; ctx.closePath(); ctx.globalCompositeOperation='source-over'; };
      canvas.addEventListener('pointerup',stop); canvas.addEventListener('pointercancel',stop);
    })();

    // Awal slide 5–7: lingkaran polos, agar murid membuat dugaan sebelum konstruksi ditampilkan.
    document.addEventListener('DOMContentLoaded', () => {
      prepareProofDiagrams();
      [5,6,7].forEach(n => {
        document.querySelectorAll(`#slide-${n} .proof-card`).forEach(card => {
          card.classList.toggle('active', card.id.endsWith('-0'));
          card.classList.remove('future');
        });
        document.querySelectorAll(`#slide-${n} .step-btn`).forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`(${0})`));
        });
      });
    });
