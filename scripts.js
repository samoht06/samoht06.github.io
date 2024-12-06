document.addEventListener("DOMContentLoaded", () => {
  const cartes = document.querySelectorAll('.memory-card');
  let commencer = false;
  let nbcarteTourné = 0;
  let nbCarteDécouvert = 0;
  let lacarteesttournée = false;
  let lockBoard = false;
  let premièrecarte, deuxièmecarte;
  let startTime, timerInterval, elapsedTime;
  let cartesRetournées = 0;
  let meilleurTemps = localStorage.getItem('meilleurTemps') || null;

  const timerDisplay = document.getElementById('compteurTemps');
  const closeButton = document.getElementById('fermerDialog');
  const dialog = document.getElementById('dialog');
  const finDePartieDialog = document.getElementById('finDePartie');
  const playAgainButton = document.getElementById('playAgain');
  const cardsFlipped = document.getElementById('cardsFlipped');
  const timeElapsedDisplay = document.getElementById('timeElapsed');
  const bestTimeDisplay = document.getElementById('bestTime');

  // Affiche la boîte de dialogue
  dialog.showModal();

  // Bouton pour fermer la boîte de dialogue
  closeButton.addEventListener('click', () => {
    dialog.close();
    startTimer();
  });

  function flipCard() {
    if (lockBoard || this === premièrecarte) return;

    this.classList.add('flip');
    cartesRetournées++;

    if (!lacarteesttournée) {
      lacarteesttournée = true;
      premièrecarte = this;
      nbcarteTourné++;
      if (!commencer) {
        setInterval(Temps, 1000);
        commencer = true;
      }
      return;
    }

    deuxièmecarte = this;
    nbcarteTourné++;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = premièrecarte.dataset.framework === deuxièmecarte.dataset.framework;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    premièrecarte.removeEventListener('click', flipCard);
    deuxièmecarte.removeEventListener('click', flipCard);
    nbCarteDécouvert++;
    Verifiertermine();
    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      premièrecarte.classList.remove('flip');
      deuxièmecarte.classList.remove('flip');
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [lacarteesttournée, lockBoard] = [false, false];
    [premièrecarte, deuxièmecarte] = [null, null];
  }

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      timerDisplay.textContent = `Temps écoulé : ${elapsedTime}s`;
    }, 1000);
  }

  function finDePartie() {
    clearInterval(timerInterval);
    const tempsFinal = Math.floor((Date.now() - startTime) / 1000);

    // Sauvegarde du meilleur temps
    if (!meilleurTemps || tempsFinal < meilleurTemps) {
      meilleurTemps = tempsFinal;
      localStorage.setItem('meilleurTemps', meilleurTemps);
    }

    // Affiche la page de fin
    cardsFlipped.textContent = cartesRetournées;
    timeElapsedDisplay.textContent = `${tempsFinal}s`;
    bestTimeDisplay.textContent = `${meilleurTemps}s`;

    finDePartieDialog.showModal();

    // Bouton "Rejouer"
    playAgainButton.addEventListener('click', () => {
      finDePartieDialog.close();
      cartesRetournées = 0;
      resetGame();
    });
  }

  function resetGame() {
    cartes.forEach(card => card.classList.remove('flip'));
    shuffle();
    startTimer();
  }

  function Verifiertermine() {
    if (nbCarteDécouvert === cartes.length / 2) {
      finDePartie();
    }
  }

  // Mélange des cartes
  (function shuffle() {
    cartes.forEach(card => {
      const randomPos = Math.floor(Math.random() * cartes.length);
      card.style.order = randomPos;
    });
  })();

  // Ajoute les écouteurs d'événements aux cartes
  cartes.forEach(card => card.addEventListener('click', flipCard));
});
