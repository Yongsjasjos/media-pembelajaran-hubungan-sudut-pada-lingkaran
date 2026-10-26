let currentSlide = 1;
const slideElements = Array.from(document.querySelectorAll(".deck-container > .slide"));
const totalSlides = slideElements.length;

function showSlide(n) {
  currentSlide = Math.max(1, Math.min(totalSlides, n));
  const target = slideElements[currentSlide - 1];
  if (target) {
    document.querySelector(".deck-container").scrollTo({
      top: target.offsetTop,
      behavior: "smooth"
    });
  }
  document.getElementById("slide-num").innerText =
    `Slide ${currentSlide} / ${totalSlides}`;
}

// Pantau slide yang aktif
const deck = document.querySelector(".deck-container");

const slideObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (visible && visible.intersectionRatio >= 0.55) {
    currentSlide = slideElements.indexOf(visible.target) + 1;

    document.getElementById("slide-num").innerText =
      `Slide ${currentSlide} / ${totalSlides}`;

    document.querySelectorAll(".slide").forEach(s => {
      s.classList.toggle("active", s === visible.target);
    });

    if (
      visible.target.id === "slide-10" ||
      visible.target.id === "slide-11"
    ) {
      visible.target.querySelectorAll("svg").forEach(svg => {
        svg.style.animation = "none";
        void svg.offsetWidth;
        svg.style.animation = "";
      });
    }
  }
}, {
  root: deck,
  threshold: [0.35, 0.55, 0.75]
});

document.querySelectorAll(".slide").forEach(slide => {
  slideObserver.observe(slide);
});

function toggleElementMenu() {
  const menu = document.getElementById("element-menu");
  const button = document.getElementById("element-intro");
  const isOpening = menu.hidden;

  menu.hidden = !isOpening;
  button.querySelector("span").textContent = isOpening ? "−" : "＋";

  document.getElementById("element-instruction").textContent = isOpening
    ? "Pilih unsur. Garis atau daerah akan ditampilkan perlahan pada lingkaran."
    : "Menu ditutup. Lingkaran kembali polos saat menu dibuka lagi.";

  if (!isOpening) {
    document.getElementById("element-visual").innerHTML = "";
    document.getElementById("element-definition").textContent =
      "Definisi akan muncul setelah salah satu unsur dipilih.";

    document.querySelectorAll("#element-menu button").forEach(b => {
      b.classList.remove("selected");
    });
  }
}

const elementInfo = {
  pusat: [
    "Titik pusat",
    "Titik tetap di tengah lingkaran yang berjarak sama dari setiap titik pada lingkaran."
  ],
  jari: [
    "Jari-jari",
    "Ruas garis yang menghubungkan titik pusat dengan satu titik pada lingkaran."
  ],
  diameter: [
    "Diameter",
    "Ruas garis yang melalui titik pusat dan menghubungkan dua titik pada lingkaran. Panjangnya dua kali jari-jari."
  ],
  busur: [
    "Busur",
    "Bagian lengkung dari keliling lingkaran yang terletak di antara dua titik pada lingkaran."
  ],
  tali: [
    "Tali busur",
    "Ruas garis yang menghubungkan dua titik pada lingkaran."
  ],
  apotema: [
    "Apotema",
    "Ruas garis dari titik pusat yang tegak lurus terhadap suatu tali busur."
  ],
  tembereng: [
    "Tembereng",
    "Daerah dalam lingkaran yang dibatasi oleh sebuah tali busur dan busur yang bersesuaian."
  ],
  juring: [
    "Juring",
    "Daerah dalam lingkaran yang dibatasi oleh dua jari-jari dan busur di antaranya."
  ]
};

function showElement(key, button) {
  document.querySelectorAll("#element-menu button").forEach(b => {
    b.classList.toggle("selected", b === button);
  });

  const g = document.getElementById("element-visual");
  const blue = "#2563EB";
  const red = "#EF4444";
  const green = "#059669";

  const line = (x1, y1, x2, y2, color = blue, extra = "") =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-linecap="round" ${extra}/>`;
  const dot = (x, y) =>
    `<circle cx="${x}" cy="${y}" r="4.5" fill="${red}"/>`;

  const arc = "M 90 58.84 A 105 105 0 0 1 210 58.84";
  let drawing = "";

  if (key === "pusat") {
    drawing = `${dot(150, 145)}<text x="160" y="140">O (pusat)</text>`;
  }

  if (key === "jari") {
    drawing = `${line(150, 145, 255, 145)}${dot(150, 145)}${dot(255, 145)}<text x="188" y="132">r</text>`;
  }

  if (key === "diameter") {
    drawing = `${line(45, 145, 255, 145, red)}${dot(45, 145)}${dot(255, 145)}${dot(150, 145)}<text x="160" y="135">O</text><text x="150" y="166">diameter</text>`;
  }

  if (key === "busur") {
    drawing = `<path d="${arc}" fill="none" stroke="${green}" stroke-width="6" stroke-linecap="round"/><circle cx="90" cy="58.84" r="4.5" fill="${red}"/><circle cx="210" cy="58.84" r="4.5" fill="${red}"/><text x="150" y="42" text-anchor="middle" style="font-size:12px;fill:#059669">busur</text>`;
  }

  if (key === "tali") {
    drawing = `${line(90, 54, 210, 54, blue)}${dot(90, 54)}${dot(210, 54)}<text x="130" y="43">tali busur</text>`;
  }

  if (key === "apotema") {
    drawing = `${line(90, 54, 210, 54, blue)}${line(150, 145, 150, 54, red)}${dot(150, 145)}<path d="M150 66 h12 v-12" fill="none" stroke="${red}" stroke-width="2"/><text x="157" y="95">apotema</text>`;
  }

  if (key === "tembereng") {
    drawing = `<path d="M90 58.84 A105 105 0 0 1 210 58.84 L90 58.84 Z" fill="#93C5FD" opacity=".82" stroke="${blue}" stroke-width="3"/><path d="M90 58.84 L210 58.84" fill="none" stroke="${red}" stroke-width="3"/><text x="150" y="39" text-anchor="middle" style="font-size:12px;fill:#1D4ED8">tembereng</text>`;
  }

  if (key === "juring") {
    drawing = `<path d="M150 145 L255 145 A105 105 0 0 0 202 54 Z" fill="#93C5FD" opacity=".75" stroke="${blue}" stroke-width="2"/>${line(150, 145, 255, 145)}${line(150, 145, 202, 54)}${dot(150, 145)}`;
  }

  g.innerHTML = drawing;

  g.querySelectorAll("line,path,circle").forEach(el => {
    if (
      el.tagName.toLowerCase() === "line" ||
      el.tagName.toLowerCase() === "path"
    ) {
      const length = el.getTotalLength ? el.getTotalLength() : 0;

      if (length) {
        el.style.strokeDasharray = length;
        el.style.strokeDashoffset = length;
        el.style.transition = "stroke-dashoffset 1.1s ease";
        requestAnimationFrame(() => {
          el.style.strokeDashoffset = "0";
        });
      }

      el.style.opacity = "0.98";
    }
  });

  const [title, definition] = elementInfo[key];

  document.getElementById("element-definition").innerHTML =
    `<strong>${title}.</strong> ${definition}<div class="source-note">Sumber: Susanto, D., dkk. (2021), <em>Matematika untuk SMA/SMK Kelas XI</em>, Bab 2; Tohir, M., dkk. (2022), <em>Matematika untuk SMA/SMK/MA Kelas XII</em>, Bab 2.</div>`;
}

/* =========================================================
   ANIMASI SUDUT
   ========================================================= */

function animateAngle(index, button, preserveAll = false) {
  const cards = Array.from(
    document.querySelectorAll("#slide-4 .angle-card")
  );
  const card = cards[index - 1];

  if (!card) return;

  if (!preserveAll) {
    cards.forEach(c => {
      c.classList.remove("outside-playing");

      const base = c.querySelector("svg.angle-visual");
      const img = c.querySelector(".angle-outside-img");

      if (base) {
        base.style.display = "block";
        base.querySelectorAll(":scope > *:not(circle)").forEach(el => {
          el.remove();
        });

        const circle = base.querySelector("circle");

        if (circle) {
          circle.setAttribute("stroke-dasharray", "");
          circle.setAttribute("stroke-dashoffset", "");
          circle.style.opacity = "1";
        }
      }

      if (img) img.style.display = "none";

      const def = c.querySelector(".angle-definition");
      if (def) def.hidden = true;

      const defBtn = c.querySelector(".definition-btn");
      if (defBtn) defBtn.textContent = "Cek definisi";

      const play = c.querySelector(".play-angle-btn");
      if (play) play.textContent = "▶ Play visualisasi";
    });
  }

  const svg = card.querySelector("svg.angle-visual");
  const playBtn = card.querySelector(".play-angle-btn");

  if (!svg) return;

  if (preserveAll) {
    svg.querySelectorAll(":scope > *:not(circle)").forEach(el => {
      el.remove();
    });

    const circle = svg.querySelector("circle");

    if (circle) {
      circle.style.opacity = "1";
      circle.setAttribute("stroke-dasharray", "");
      circle.setAttribute("stroke-dashoffset", "");
    }
  }

  if (playBtn) playBtn.textContent = "↻ Putar ulang";

  const ns = "http://www.w3.org/2000/svg";

  function draw(el, delay = 0) {
    let length = 180;

    try {
      if (typeof el.getTotalLength === "function") {
        length = Math.max(1, el.getTotalLength());
      }
    } catch (_) {}

    el.style.strokeDasharray = String(length);
    el.style.strokeDashoffset = String(length);
    el.style.opacity = "0";

    if (typeof el.animate === "function") {
      el.animate(
        [
          { opacity: 0, strokeDashoffset: String(length) },
          { opacity: 1, strokeDashoffset: "0" }
        ],
        {
          duration: 850,
          delay,
          easing: "ease-in-out",
          fill: "forwards"
        }
      );
    } else {
      el.style.transition =
        `stroke-dashoffset 850ms ease-in-out ${delay}ms, opacity 200ms ease ${delay}ms`;

      setTimeout(() => {
        el.style.opacity = "1";
        el.style.strokeDashoffset = "0";
      }, 30);
    }
  }

  function addLine(
    x1, y1, x2, y2,
    delay = 0,
    color = "#2563EB",
    width = 3
  ) {
    const el = document.createElementNS(ns, "line");

    Object.entries({
      x1, y1, x2, y2,
      stroke: color,
      "stroke-width": width,
      "stroke-linecap": "round"
    }).forEach(([k, v]) => el.setAttribute(k, v));

    svg.appendChild(el);
    draw(el, delay);
    return el;
  }

  function addDot(
    x, y,
    delay = 0,
    color = "#DC2626",
    r = 3.8
  ) {
    const el = document.createElementNS(ns, "circle");

    Object.entries({ cx: x, cy: y, r, fill: color }).forEach(([k, v]) => {
      el.setAttribute(k, v);
    });

    el.style.opacity = "0";
    svg.appendChild(el);

    if (typeof el.animate === "function") {
      el.animate(
        [
          { opacity: 0, transform: "scale(.4)" },
          { opacity: 1, transform: "scale(1)" }
        ],
        {
          duration: 400,
          delay,
          easing: "ease-out",
          fill: "forwards"
        }
      );
    } else {
      setTimeout(() => {
        el.style.opacity = "1";
      }, delay);
    }

    return el;
  }

  function addPath(
    d,
    delay = 0,
    color = "#EF4444",
    width = 2.8
  ) {
    const el = document.createElementNS(ns, "path");

    Object.entries({
      d,
      fill: "none",
      stroke: color,
      "stroke-width": width,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }).forEach(([k, v]) => el.setAttribute(k, v));

    svg.appendChild(el);
    draw(el, delay);
    return el;
  }

  function addText(
    x, y, text,
    delay = 1900,
    color = "#0F172A"
  ) {
    const el = document.createElementNS(ns, "text");

    Object.entries({
      x, y,
      fill: color,
      "font-size": 10,
      "font-weight": 700
    }).forEach(([k, v]) => el.setAttribute(k, v));

    el.textContent = text;
    el.style.opacity = "0";
    svg.appendChild(el);

    if (typeof el.animate === "function") {
      el.animate(
        [
          { opacity: 0, transform: "translateY(3px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 350,
          delay,
          easing: "ease-out",
          fill: "forwards"
        }
      );
    } else {
      setTimeout(() => {
        el.style.opacity = "1";
      }, delay);
    }

    return el;
  }

  if (index === 4) {
    const P = { x: 207, y: 60 };

    addLine(P.x, P.y, 39, 28, 200);
    addLine(P.x, P.y, 39, 92, 900);
    addPath(
      "M 190.4 56.8 A 17.2 17.2 0 0 0 190.4 63.2",
      1650,
      "#DC2626",
      2.8
    );
    addDot(P.x, P.y, 1950, "#DC2626", 4.2);
    addText(177, 79, "P (luar)", 2100, "#DC2626");
    return;
  }

  if (index === 1) {
    addLine(110, 60, 151, 38, 200);
    addLine(110, 60, 151, 82, 850);
    addPath("M 130 49 A 23 23 0 0 1 130 71", 1500, "#EF4444", 3);
    addDot(110, 60, 1750, "#DC2626");
    addText(94, 76, "O", 1850);
    addText(126, 40, "r", 2050, "#2563EB");
    addText(126, 81, "r", 2150, "#2563EB");
    addText(129, 54, "α", 2250, "#DC2626");
  } else if (index === 2) {
    addLine(80, 28, 110, 96, 200);
    addLine(110, 96, 147, 32, 850);
    addPath("M 103 79 A 18 18 0 0 1 119 80", 1500, "#EF4444", 3);
    addDot(110, 96, 1750, "#DC2626");
    addText(116, 108, "C", 1850);
    addText(89, 57, "A", 1950);
    addText(149, 62, "B", 2050);
    addText(114, 82, "β", 2200, "#DC2626");
  } else if (index === 3) {
    addLine(74, 34, 146, 86, 200);
    addLine(146, 34, 74, 86, 850);
    addPath("M 100 60 A 10 10 0 0 1 120 60", 1500, "#EF4444", 3);
    addDot(110, 60, 1750, "#DC2626");
    addText(116, 53, "E", 1850, "#DC2626");
    addText(90, 53, "α", 2100, "#DC2626");
    addText(130, 75, "β", 2200, "#DC2626");
  }
}

window.animateAngle = animateAngle;

function animateAllAngles() {
  const cards = Array.from(
    document.querySelectorAll("#slide-4 .angle-card")
  );

  cards.forEach((card, i) => {
    const play = card.querySelector(".play-angle-btn");
    animateAngle(i + 1, play, true);
  });

  const btn = document.getElementById("show-all-angles");
  if (btn) btn.textContent = "✓ Seluruh animasi ditampilkan";
}

window.animateAllAngles = animateAllAngles;

function toggleDefinition(id, button) {
  const el = document.getElementById(id);
  if (!el) return;

  el.hidden = !el.hidden;
  button.textContent = el.hidden
    ? "Cek definisi"
    : "Sembunyikan definisi";
}

window.toggleDefinition = toggleDefinition;

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

document.addEventListener("keydown", event => {
  if (event.key.toLowerCase() === "f") toggleFullscreen();
});

function changeSlide(dir) {
  currentSlide += dir;

  if (currentSlide < 1) currentSlide = 1;
  if (currentSlide > totalSlides) currentSlide = totalSlides;

  showSlide(currentSlide);
}

function advanceExample(button) {
  const card = button.closest(".example-card");
  if (!card) return;

  const wrap = card.querySelector(".worked-steps");
  if (!wrap) return;

  const steps = Array.from(wrap.querySelectorAll("[data-workstep]"));
  let current = Number(wrap.dataset.step || 0);

  current = Math.min(current + 1, steps.length);
  wrap.dataset.step = String(current);

  steps.forEach((el, i) => {
    if (i < current) el.classList.add("revealed");
  });

  wrap.classList.remove("is-hidden");

  button.textContent = current >= steps.length
    ? "✓ Pembahasan lengkap"
    : `Lanjut langkah ${current + 1} ▶`;

  if (current >= steps.length) button.disabled = true;
}

window.advanceExample = advanceExample;

function toggleAnswer(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("show");
}

/* =========================================================
   DIAGRAM PEMBUKTIAN
   ========================================================= */

function prepareProofDiagrams() {
  [5, 6, 7].forEach(n => {
    const svg = document.querySelector(`#slide-${n} .geo-panel svg`);
    if (!svg) return;

    Array.from(svg.children).forEach((el, i) => {
      el.style.transition =
        "opacity 420ms ease, stroke-dashoffset 650ms ease";

      const isCircle = i === 0 && el.tagName.toLowerCase() === "circle";

      el.style.display = isCircle ? "" : "none";
      el.style.opacity = isCircle ? "1" : "0";
      el.style.strokeDasharray = "";
      el.style.strokeDashoffset = "";
    });

    svg.dataset.proofStep = "0";
  });
}

function showProofDiagram(n, step) {
  const svg = document.querySelector(`#slide-${n} .geo-panel svg`);
  if (!svg) return;

  const children = Array.from(svg.children);
  const specialId = n === 5
    ? "tri-aoc-5"
    : n === 6
      ? "tri-ade-6"
      : "line-bc-7";

  const helperId = n === 5
    ? "line-diam-5"
    : n === 6
      ? "line-ad-6"
      : "line-bc-7";

  const token = String(Number(svg.dataset.animationToken || 0) + 1);
  svg.dataset.animationToken = token;

  if (step === 0) {
    children.forEach((el, i) => {
      el.style.transition =
        "opacity 350ms ease, stroke-dashoffset 650ms ease";

      const isCircle = i === 0 && el.tagName.toLowerCase() === "circle";

      el.style.display = isCircle ? "" : "none";
      el.style.opacity = isCircle ? "1" : "0";
      el.style.strokeDasharray = "";
      el.style.strokeDashoffset = "";
      el.classList.remove("active");
    });
  }

  const reveal = (el, animate = true) => {
    if (!el) return;
    if (el.style.display !== "none" && el.style.opacity === "1") return;

    el.style.transition =
      "opacity 350ms ease, stroke-dashoffset 650ms ease";
    el.style.display = "";

    const tag = el.tagName.toLowerCase();

    if (
      animate &&
      ["line", "polygon", "path"].includes(tag) &&
      typeof el.getTotalLength === "function"
    ) {
      let len = 1;

      try {
        len = Math.max(1, el.getTotalLength());
      } catch (_) {}

      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.style.opacity = "1";

      requestAnimationFrame(() => {
        if (svg.dataset.animationToken === token) {
          el.style.strokeDashoffset = "0";
        }
      });
    } else {
      el.style.opacity = "0";

      requestAnimationFrame(() => {
        if (svg.dataset.animationToken === token) {
          el.style.opacity = "1";
        }
      });
    }
  };

  const circle = children[0];
  if (circle) {
    circle.style.display = "";
    circle.style.opacity = "1";
  }

  const arcLegend = document.getElementById("arc-legend-7");
  const arcFormula = document.getElementById("arc-formula-7");

  if (arcLegend) arcLegend.style.display = step >= 0.5 ? "flex" : "none";
  if (arcFormula) arcFormula.style.display = step >= 0.5 ? "block" : "none";

  if (step >= 0.5) {
    reveal(document.getElementById("arc-far-7"), true);
    reveal(document.getElementById("arc-near-7"), true);

    const baseObjects = children.filter((el, i) => i > 0 && (
      (
        el.tagName.toLowerCase() === "line" &&
        (
          n === 5 ? el.id !== "line-diam-5" :
          n === 6 ? el.id !== "line-ad-6" :
          el.id !== "line-bc-7"
        )
      ) ||
      el.tagName.toLowerCase() === "text" ||
      (el.tagName.toLowerCase() === "circle" && i !== 0)
    ));

    baseObjects.forEach((el, i) => {
      if (el.style.display === "none" || !el.style.display) {
        setTimeout(() => {
          if (
            svg.dataset.animationToken === token &&
            Number(svg.dataset.proofStep || 0) >= 0.5
          ) {
            reveal(el, true);
          }
        }, i * 180);
      }
    });
  }

  if (step >= 1) reveal(document.getElementById(helperId), true);
  if (step >= 2) reveal(document.getElementById(specialId), true);

  if (n === 6 && step >= 2) {
    reveal(document.getElementById("arc-ab-6"), true);
    reveal(document.getElementById("arc-cd-6"), true);
  }

  if (step >= 3) {
    children.forEach(el => reveal(el, true));
  }

  const special = document.getElementById(specialId);
  if (special) special.classList.toggle("active", step >= 2);

  svg.dataset.proofStep = String(step);
}

function updateProofCards(n, step) {
  const slide = document.querySelector(`#slide-${n}`);
  if (!slide) return;

  slide.querySelectorAll(".step-btn").forEach(b => {
    const m = b.getAttribute("onclick")?.match(/\(([^)]+)\)/);
    b.classList.toggle(
      "active",
      !!m && Number(m[1]) === Number(step)
    );
  });

  slide.querySelectorAll(".proof-card").forEach(c => {
    let k = c.id.endsWith("-0")
      ? 0
      : c.id.endsWith("-base")
        ? 0.5
        : null;

    const m = c.id.match(/-(\d+)$/);
    if (m) k = Number(m[1]);

    const active = k !== null && (
      k === 0 ? step === 0 :
      k === 0.5 ? step >= 0.5 :
      k <= step
    );

    c.classList.toggle("active", active);
    c.classList.toggle("future", k !== null && k > step);
  });
}

function setProofStep5(step) {
  showProofDiagram(5, step);
  updateProofCards(5, step);

  const line = document.getElementById("line-diam-5");
  if (line) line.classList.toggle("active", step >= 1);

  const triangle = document.getElementById("tri-aoc-5");
  if (triangle) triangle.classList.toggle("active", step >= 2);
}

function setProofStep6(step) {
  showProofDiagram(6, step);
  updateProofCards(6, step);

  const line = document.getElementById("line-ad-6");
  if (line) line.classList.toggle("active", step >= 1);

  const triangle = document.getElementById("tri-ade-6");
  if (triangle) triangle.classList.toggle("active", step >= 2);
}

function setProofStep7(step) {
  showProofDiagram(7, step);
  updateProofCards(7, step);

  const line = document.getElementById("line-bc-7");
  if (line) line.classList.toggle("active", step >= 1);
}

/* =========================================================
   FITUR PENA, PENGHAPUS, DAN HAPUS SEMUA CORETAN (REVISI)
   ========================================================= */

function initDrawingTools() {
  const canvas = document.getElementById("drawing-layer");
  const pen = document.getElementById("pen-tool");
  const eraser = document.getElementById("eraser-tool");
  const clear = document.getElementById("clear-tool");

  if (!canvas || !pen || !eraser || !clear) {
    console.warn(
      "Fitur pena tidak aktif. Periksa ID drawing-layer, pen-tool, eraser-tool, dan clear-tool."
    );
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let mode = null;
  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const saved = document.createElement("canvas");
    saved.width = canvas.width;
    saved.height = canvas.height;

    if (saved.width && saved.height) {
      saved.getContext("2d").drawImage(canvas, 0, 0);
    }

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.scale(dpr, dpr);

    if (saved.width && saved.height) {
      ctx.drawImage(saved, 0, 0, saved.width / dpr, saved.height / dpr);
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function setMode(nextMode) {
    mode = mode === nextMode ? null : nextMode;

    canvas.classList.toggle("enabled", mode !== null);
    pen.classList.toggle("active", mode === "pen");
    eraser.classList.toggle("active", mode === "eraser");

    if (mode === "eraser") {
      canvas.style.cursor = "cell";
    } else if (mode === "pen") {
      canvas.style.cursor = "crosshair";
    } else {
      canvas.style.cursor = "default";
    }
  }

  function getPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function startDrawing(event) {
    if (!mode || event.button !== 0) return;

    drawing = true;
    const pos = getPosition(event);
    lastX = pos.x;
    lastY = pos.y;

    ctx.globalCompositeOperation = mode === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = mode === "eraser" ? 24 : 3;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(lastX + 0.1, lastY + 0.1);
    ctx.stroke();
  }

  function draw(event) {
    if (!drawing || !mode) return;

    const pos = getPosition(event);

    ctx.globalCompositeOperation = mode === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = mode === "eraser" ? 24 : 3;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
  }

  function stopDrawing() {
    drawing = false;
    ctx.beginPath();
  }

  // Event listener tombol alat coretan (dikunci dengan stopPropagation)
  pen.addEventListener("click", (e) => {
    e.stopPropagation();
    setMode("pen");
  });

  eraser.addEventListener("click", (e) => {
    e.stopPropagation();
    setMode("eraser");
  });

  clear.addEventListener("click", (e) => {
    e.stopPropagation();
    stopDrawing();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  });

  // Event pointer untuk menggambar di canvas
  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDrawingTools);
} else {
  initDrawingTools();
}
