'use strict';

const state = {};

// prettier-ignore
const iconArray = [ 'volleyball', 'umbrella', 'truck', 'tree', 'ruler', 'rocket', 'rainbow', 'atom', 'popcorn', 'pinwheel', 'parachute', 'mountains', 'backpack', 'lightning', 'ladder', 'hard-drive', 'hamburger', 'fish', 'dog', 'confetti'];

const body = document.querySelector('body');

const modeBtn = document.querySelector('.mode__button');
const settingBtn = document.querySelector('.setting__button');
const modalCloseBtn = document.querySelector('.modal__close--btn');

const gameSection = document.querySelector('.section--game');
const modalSection = document.querySelector('.section--modal');

// Testing line
console.log('Welcome to my application!');

///////////////////////////////
// Helpers
const modeChange = function () {
  body.classList.toggle('dark');

  body.classList.contains('dark')
    ? (modeBtn.innerHTML =
        '<i class="ph-sun-bold setting__icon"></i> &nbsp;&nbsp; Light mode')
    : (modeBtn.innerHTML =
        '<i class="ph-moon-bold setting__icon"></i> &nbsp;&nbsp; Dark mode');
};

const openModal = function () {
  modalSection.classList.remove('hidden');
};
const closeModal = function () {
  modalSection.classList.add('hidden');
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

/////////////////////////////
// Handlers
modeBtn.addEventListener('click', modeChange);

settingBtn.addEventListener('click', openModal);

[modalSection, modalCloseBtn].forEach(el =>
  el.addEventListener('click', closeModal)
);

gameSection.addEventListener('click', function (e) {
  const card = e.target.closest('.game--card');
  if (!card) return;
  card.classList.toggle('flipped');
});

function init() {
  gameSection.insertAdjacentHTML('beforeend', generateCardMarkup(9));
}
init();

// #BUG #TODO
// modalSection.addEventListener('keydown', function (e) {
//   console.log(e.code);
//   if (e.code === 'Escape') closeModal();
// });
