'use strict';

const state = { pairs: 2, pairsHaveMatched: 0 };
let pairs = [];

// prettier-ignore
const iconArray = [ 'volleyball', 'umbrella', 'truck', 'tree', 'ruler', 'rocket', 'rainbow', 'atom', 'popcorn', 'pinwheel', 'parachute', 'mountains', 'backpack', 'lightning', 'ladder', 'hard-drive', 'hamburger', 'fish', 'dog', 'confetti'];

const body = document.querySelector('body');

const modeBtn = document.querySelector('.mode__button');
const settingBtn = document.querySelector('.setting__button');
const modalCloseBtn = document.querySelector('.modal__close--btn');
const restartBtn = document.querySelector('.restart__button');

// #BUG => NULL
// const gameCardElement = document.querySelectorAll('.game--card');

const gameSection = document.querySelector('.section--game');
const modalSection = document.querySelector('.section--modal');
const modalFilter = document.querySelector('.modal__filter');
const headerTimer = document.querySelector('.header--timer');

const pairsSelect = document.querySelector('.pairs__select');

// TESTING!!
pairsSelect.addEventListener('change', () => {
  const newPairsNum = +pairsSelect.options[pairsSelect.selectedIndex].text;
  if (newPairsNum === state.pairs) return;
  state.pairs = newPairsNum;
  renderGame(newPairsNum);
});

// Testing line
console.log('Welcome to my application!');

///////////////////////////////
// Helpers
const modeChange = function () {
  body.classList.toggle('dark');

  body.classList.contains('dark')
    ? (modeBtn.innerHTML =
        '<i class="ph-sun-bold setting__icon"></i>  Light mode')
    : (modeBtn.innerHTML =
        '<i class="ph-moon-bold setting__icon"></i>  Dark mode');
};

const openModal = function () {
  modalSection.classList.remove('hidden');
  modalFilter.classList.remove('hidden');
};
const closeModal = function () {
  modalSection.classList.add('hidden');
  modalFilter.classList.add('hidden');
};

const generateCardMarkup = function (pairs) {
  const iconArrayCopy = [...iconArray];
  let gameIconArray = [];

  // Choosing the icons for cards
  [...Array(+pairs)].forEach(_ => {
    const randomNum = Math.floor(Math.random() * iconArrayCopy.length);
    gameIconArray.push(...iconArrayCopy.splice(randomNum, 1));
  });

  // Rendering the markup
  gameIconArray = [...gameIconArray, ...gameIconArray];
  const markup = [...Array(+pairs * 2)]
    .map(_ => {
      const randomNum = Math.floor(Math.random() * gameIconArray.length);
      const icon = gameIconArray[randomNum];
      gameIconArray.splice(randomNum, 1);
      return `
          <div class="game--card" data-icon="${icon}">
            <div class="card--content">
              <div class="card--front__back card--front">
                <i class="ph-fingerprint-bold card--icon"></i>
              </div>
              <div class="card--front__back card--back">
                <i class="ph-${icon} card--icon" ></i>
              </div>
            </div>
          </div>
      `;
    })
    .join('');
  return markup;
};

const renderGame = function (pairs) {
  gameSection.innerHTML = '';
  gameSection.insertAdjacentHTML('beforeend', generateCardMarkup(pairs));
  const gameCardElement = document.querySelectorAll('.game--card');
  gameCardElement.forEach(el => {
    el.style.flex = `0 0 ${Math.floor(100 / (pairs + 1))}%`;
    // el.style.flex = `0 0 14%`;
    console.log(`0 0 ${+Math.floor(100 / (pairs + 1)) + 1}`);
  });
};

const startTimer = function () {
  const start = Date.now();
  const timer = setInterval(() => {
    const secondPass = Math.floor((Date.now() - start) / 1000);
    const timeDisplay =
      secondPass < 60
        ? `00:${((secondPass % 60) + '').padStart(2, '0')}`
        : `${Math.floor(secondPass / 60)}:${((secondPass % 60) + '').padStart(
            2,
            '0'
          )}`;
    headerTimer.textContent = timeDisplay;

    if (state.pairsHaveMatched === state.pairs /*|| #TODO */) {
      console.log('HELLLO');
      clearInterval(timer);
    }
  }, 100);
};

/////////////////////////////
/////////////////////////////
// Handlers
modeBtn.addEventListener('click', modeChange);

settingBtn.addEventListener('click', openModal);

[modalFilter, modalCloseBtn].forEach(el =>
  el.addEventListener('click', closeModal)
);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalSection.classList.contains('hidden')) {
    closeModal();
  }
});

restartBtn.addEventListener('click', () => {
  Array.from(gameSection.children).forEach(gameCard =>
    gameCard.classList.remove('flipped')
  );
  setTimeout(init, 1000);
});

gameSection.addEventListener('click', function (e) {
  const card = e.target.closest('.game--card');

  if (!card || card.classList.contains('checked' || pairs.length === 1)) return;
  if (card.classList.contains('flipped')) {
    card.classList.remove('flipped');
    return;
  }

  card.classList.add('flipped');
  pairs.push(card);

  if (pairs.length === 2 && pairs[0].dataset.icon === pairs[1].dataset.icon) {
    pairs.forEach(card => {
      card.classList.add('checked');
    });
    pairs = [];
    state.pairsHaveMatched += 1;
  } else if (
    pairs.length === 2 &&
    pairs[0].dataset.icon !== pairs[1].dataset.icon
  ) {
    setTimeout(() => {
      pairs.forEach(card => {
        card.classList.remove('flipped');
      });
      pairs = [];
    }, 1000);
  }
  if (headerTimer.textContent === '') startTimer();
});

function init() {
  renderGame(state.pairs);
}
init();

// #BUG #TODO
// modalSection.addEventListener('keydown', function (e) {
//   console.log(e.code);
//   if (e.code === 'Escape') closeModal();
// });

//#TODO
// 1. change event on the modal
// 2. color picker for the card
// 3. Best scores
// 4. Time used
