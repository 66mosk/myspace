/* ========================================================================
   Quiz
   ======================================================================== */
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (match) => {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escapeMap[match];
  });
}

class Quizfrage {
  constructor({ id, frage, antworten, richtig }) {
    this.id = id;
    this.frage = frage;
    this.antworten = antworten;
    this.richtig = richtig;
  }

  zeigen(nummer) {
    const abtn = this.antworten
      .map((antwort, index) => {
        return `
          <button type="button" class="antwort-knopf btn btn-outline-primary w-100 text-start mb-3" data-index="${index}">
            <span class="buchstabe me-2">${String.fromCharCode(65 + index)}.</span>
            ${escapeHTML(antwort)}
          </button>
        `;
      })
      .join("");

    return `
      <div class="frage-box rounded p-4 mb-4 text-start">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span class="badge bg-info text-dark">Frage ${nummer + 1}</span>
          </div>
          <div>
            <span class="text-muted">${this.antworten.length} Antworten</span>
          </div>
        </div>
        <h3>${this.frage}</h3>
        <div class="antwort-liste mt-4">${abtn}</div>
      </div>
    `;
  }

  istRichtig(index) {
    return index === this.richtig;
  }
}

class Quizspiel {
  constructor(container) {
    this.container = container;
    this.fragen = this.fragen();
    this.aktuelleNr = 0;
    this.punkte = 0;
    this.spielVorbei = false;
  }

  fragen() {
    return [
      new Quizfrage({
        id: "q1",
        frage: "Mit welchem HTML-Tag macht man einen Link?",
        antworten: ["<link>", "<a>", "<href>", "<url>"],
        richtig: 1,
      }),
      new Quizfrage({
        id: "q2",
        frage: "Wie ändert man in CSS die Hintergrundfarbe?",
        antworten: ["color", "background-color", "bg-color", "background"],
        richtig: 1,
      }),
      new Quizfrage({
        id: "q3",
        frage:
          "Welches Keyword brauchst du für eine Variable, die sich ändern kann?",
        antworten: ["var", "let", "const", "static"],
        richtig: 1,
      }),
      new Quizfrage({
        id: "q4",
        frage: "Was passiert, wenn der User auf einen Button klickt?",
        antworten: [
          "submit-Event",
          "click-Event",
          "button-Event",
          "press-Event",
        ],
        richtig: 1,
      }),
      new Quizfrage({
        id: "q5",
        frage: "Was ist OOP?",
        antworten: [
          "Open Online Project",
          "Object-oriented Programming",
          "Online Output Processing",
          "Open Object Pattern",
        ],
        richtig: 1,
      }),
    ];
  }

  start() {
    this.aktuelleNr = 0;
    this.punkte = 0;
    this.spielVorbei = false;
    this.aktuelleFrage();
  }

  aktuelleFrage() {
    this.container.innerHTML = "";
    if (this.aktuelleNr >= this.fragen.length) {
      this.zeigeEnde();
      return;
    }

    const frage = this.fragen[this.aktuelleNr];
    this.container.innerHTML = frage.zeigen(this.aktuelleNr);
    this.antbtn();
  }

  antbtn() {
    const abtn = this.container.querySelectorAll(".antwort-knopf");
    abtn.forEach((knopf) => {
      knopf.addEventListener("click", () => {
        const index = Number(knopf.dataset.index);
        this.antwortGewählt(index, knopf);
      });
    });
  }

  antwortGewählt(index, knopf) {
    if (this.spielVorbei) {
      return;
    }

    const frage = this.fragen[this.aktuelleNr];
    const richtig = frage.istRichtig(index);
    knopf.classList.add(richtig ? "richtig" : "falsch");

    frage.antworten.forEach((_, idx) => {
      const btn = this.container.querySelector(`[data-index="${idx}"]`);
      if (!btn) return;
      btn.disabled = true;
      if (idx === frage.richtig) {
        btn.classList.add("richtig");
      }
    });

    if (richtig) {
      this.punkte += 1;
    }

    this.spielVorbei = true;
    setTimeout(() => {
      this.aktuelleNr += 1;
      this.spielVorbei = false;
      this.aktuelleFrage();
    }, 1100);
  }

  zeigeEnde() {
    const gesamt = this.fragen.length;
    const prozent = Math.round((this.punkte / gesamt) * 100);

    this.container.innerHTML = `
      <div class="ende-karte rounded p-4 text-start">
        <div class="mb-4">
          <h3 class="mb-1">Quiz abgeschlossen!</h3>
          <p class="mb-0 text-muted">Du hast: <strong>${this.punkte}/${gesamt}</strong> (${prozent} %)</p>
        </div>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
          <button id="neustart-knopf" class="btn btn-primary btn-lg">Nochmal spielen</button>
        </div>
      </div>
    `;

    const neustartKnopf = this.container.querySelector("#neustart-knopf");
    neustartKnopf.addEventListener("click", () => this.start());
  }
}

/* ========================================================================
   Quiz-Start
   ======================================================================== */
function starteQuiz() {
  const quizContainer = document.getElementById("quiz-game-container");
  if (!quizContainer) {
    return;
  }

  const spiel = new Quizspiel(quizContainer);
  spiel.start();
}

/* ========================================================================
   Quiz DOMContentLoaded
   ======================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("main.quiz-seite")) {
    starteQuiz();
  }
});
