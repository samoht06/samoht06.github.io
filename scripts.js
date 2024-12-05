document.addEventListener("DOMContentLoaded", () => {
  // Initialisation du jeu
  const cartes = document.querySelectorAll('.memory-card');
  const timerDisplay = document.getElementById('timer');
  const dialog = document.getElementById('dialog');
  const closeButton = document.getElementById('closeDialog');

  let lacarteesttournée = false;
  let lockBoard = false;
  let premièrecarte, deuxièmecarte;
  let startTime;
  let timerInterval;

  // Affiche la boîte de dialogue
  dialog.showModal();
//bouton pour fermer la boite de dialogue
  closeButton.addEventListener('click', () => {
    dialog.close();
    startTimer();
  });

  function flipCard() {//foction pour trouver les cartes paires
    if (lockBoard || this === premièrecarte) return;

    this.classList.add('flip');

    if (!lacarteesttournée) {
      lacarteesttournée = true;
      premièrecarte = this;
    } else {
      deuxièmecarte = this;
      checkForMatch();
    }
  }

  function checkForMatch() {//si les deux cartes ne sont pas pareils...
    const isMatch = premièrecarte.dataset.framework === deuxièmecarte.dataset.framework;
    isMatch ? disableCards() : unflipCards(); //retourner les cartes
  }

  function disableCards() {//si les 2 cartes sont parreils...
    premièrecarte.removeEventListener('click', flipCard);//désactiver l'action de la première carte
    deuxièmecarte.removeEventListener('click', flipCard);//désactiver l'action de la deuxième carte
    resetBoard();
  }

  function unflipCards() {//si les cartes ne sont pas pareils...
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
      elapsedTime = Math.floor.apply((Date.now() - startTime) / 1000);
      
      timerDisplay.textContent = `Temps écoulé : ${elapsed}s`;
    }, 1000);
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


let cartesRetournées = 0; // Compteur de cartes retournées
let meilleurTemps = localStorage.getItem('meilleurTemps') || null; // Chargement du meilleur temps

function flipCard() {
  if (lockBoard || this === premièrecarte) return;

  this.classList.add('flip');
  cartesRetournées++; // Incrémentation à chaque clic

  // Gère la logique pour une paire
  if (!lacarteesttournée) {
    lacarteesttournée = true;
    premièrecarte = this;
  } else {
    deuxièmecarte = this;
    checkForMatch();
  }
}

function checkForMatch() {
  const isMatch = premièrecarte.dataset.framework === deuxièmecarte.dataset.framework;
  isMatch ? disableCards() : unflipCards();

  // Vérifie si toutes les cartes sont retournées
  if (document.querySelectorAll('.memory-card.flip').length === cartes.length) {
    finDePartie();
  }
}

function finDePartie() {
  
  clearInterval(timerInterval); // Arrête le minuteur
  const tempsFinal = Math.floor((Date.now() - startTime) / 1000);

  // Sauvegarde du meilleur temps
  if (!meilleurTemps || tempsFinal < meilleurTemps) {
    meilleurTemps = tempsFinal;
    localStorage.setItem('meilleurTemps = ', meilleurTemps);
  }

  // Affiche la page de fin
  const dialog = document.createElement('dialog');
  dialog.innerHTML = `
    <h1>Félicitations, vous avez terminé !</h1>
    <p>Cartes retournées : ${cartesRetournées}</p>
    <p>Temps écoulé : ${tempsFinal}s</p>
    <p>Meilleur temps : ${meilleurTemps}s</p>
    <button id="rejouer">Rejouer</button>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();

  // Gestion du bouton "Rejouer"
  document.getElementById('rejouer').addEventListener('click', () => {
    dialog.close();
    cartesRetournées = 0; // Réinitialise les stats
    resetGame();
  });
}

function resetGame() {
  cartes.forEach(card => card.classList.remove('flip'));
  shuffle(); // Mélange les cartes
  startTimer(); // Redémarre le minuteur
}



