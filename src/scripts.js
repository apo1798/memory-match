'use strict';

// prettier-ignore
const iconArray = [ 'volleyball', 'umbrella', 'truck', 'tree', 'ruler', 'rocket', 'rainbow', 'atom', 'popcorn', 'pinwheel', 'parachute', 'mountains', 'backpack', 'lightning', 'ladder', 'hard-drive', 'hamburger', 'fish', 'dog', 'confetti'];

const body = document.querySelector('body');

const modeBtn = document.querySelector('.mode__button');
const settingBtn = document.querySelector('.setting__button');
const modalCloseBtn = document.querySelector('.modal__close--btn');
const restartBtn = document.querySelector('.restart__button');

const gameSection = document.querySelector('.section--game');
const modalSection = document.querySelector('.section--modal');
const modalFilter = document.querySelector('.modal__filter');
const headerTimer = document.querySelector('.header--timer');
const headerMessage = document.querySelector('.header--message');
const recordsContent = document.querySelector('.records--content');

const pairsSelect = document.querySelector('.pairs__select');

/////////////////////////////////
/////////////////////////////////

class App {
  constructor(pairs = 2, darkMode = false, records = []) {
    this._iconArray = iconArray;

    this._state = { pairs: pairs, darkMode: darkMode, records: records };
    this._cardSelected = null;
    this._gameIconArray = [];
    this._cardPairsHaveMatched = 0;
    this._timer;
    this._busy = false;

    this._updateAppSetting();
  }

  _updateAppSetting() {
    // 1) Get previous setting and records
    this._getLocalStorage();

    // 2) Render mode
    this._renderMode();

    // 3) Render game
    this._renderGame();

    // 4) Choose the right select of pairs in modal
    this._renderSelect();

    // 5) Render Record
    this._renderRecords();
  }

  _renderMode() {
    if (this._state.darkMode) body.classList.add('dark');
  }

  _renderSelect() {
    Array.from(pairsSelect.options)
      .find(el => +el.textContent === this._state.pairs)
      .setAttribute('selected', 'selected');
  }

  _renderGame() {
    this._stopTimer();
    this._clearTimer();

    gameSection.innerHTML = '';

    gameSection.insertAdjacentHTML('beforeend', this._generateCardMarkup());
    headerMessage.textContent = 'Match the cards!';
    this._cardPairsHaveMatched = 0;
  }

  _renderRecords() {
    recordsContent.innerHTML = '';
    recordsContent.insertAdjacentHTML(
      'afterbegin',
      this._generateRecordMarkup()
    );
  }

  _restartGame() {
    Array.from(gameSection.children).forEach(gameCard =>
      gameCard.classList.remove('flipped')
    );
    this._busy = true;
    setTimeout(() => {
      this._clearTimer();
      this._stopTimer();
      this._renderGame();
      this._busy = false;
    }, 1000);
  }

  _pairSelectChange() {
    const newPairsNum = +pairsSelect.options[pairsSelect.selectedIndex].text;
    if (newPairsNum === this._state.pairs) return;
    this._state.pairs = newPairsNum;
    this._saveLocalStorage();
    this._renderSelect();
    this._renderGame();
  }

  _generateCardMarkup() {
    // shuffle array
    this._gameIconArray = this._shuffleArray(
      this._iconArray,
      this._state.pairs
    );

    // Rendering an array containing two icon pairs and shuffle again
    this._gameIconArray = this._shuffleArray([
      ...this._gameIconArray,
      ...this._gameIconArray,
    ]);

    // Rendering markup based on shuffled icon array
    const markup = this._gameIconArray
      .map(icon => {
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
  }

  _generateRecordMarkup() {
    if (!this._state.records) return;
    const markup = this._state.records
      .map((record, i) => {
        const [pairs, time] = [record[0], record[1]];
        return `
      <tr>
        <td>Game ${i + 1}</td>
        <td>${pairs} pairs</td>
        <td>${time}</td>
      </tr>
    `;
      })
      .join('');
    return markup;
  }

  _shuffleArray(array, num = array.length) {
    for (let i = array.length - 1; i > 0; i--) {
      const randIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randIndex]] = [array[randIndex], array[i]];
    }
    return array.slice(0, num);
  }

  _checkCardPairs(card) {
    if (!card || card.classList.contains('checked') || this._busy) return;

    if (!this._cardSelected) {
      this._busy = true;
      card.classList.add('flipped');
      this._cardSelected = card;
      this._busy = false;
      return;
    }

    this._busy = true;
    card.classList.add('flipped');

    if (
      this._cardSelected &&
      this._cardSelected.dataset.icon === card.dataset.icon
    ) {
      this._cardSelected.classList.add('checked');
      card.classList.add('checked');
      this._cardPairsHaveMatched++;
      this._cardSelected = null;

      this._checkWinGame();
      this._busy = false;
    } else {
      setTimeout(() => {
        this._cardSelected.classList.remove('flipped');
        card.classList.remove('flipped');
        this._cardSelected = null;
        this._busy = false;
      }, 600);
    }

    // #TODO
    if (headerTimer.textContent === '') this._timer = this._startTimer();
  }

  _checkWinGame() {
    if (this._state.pairs !== this._cardPairsHaveMatched) return;
    this._stopTimer();
    this._state.records.push([this._state.pairs, headerTimer.textContent]);
    this._saveLocalStorage();
    this._renderRecords();
    headerMessage.innerHTML =
      '<i class="ph-confetti-bold setting__icon"></i> Stage clear ^_^';
  }

  _changeMode() {
    body.classList.toggle('dark');
    this._state.darkMode = !this._state.darkMode;

    modeBtn.innerHTML = body.classList.contains('dark')
      ? '<i class="ph-sun-bold setting__icon"></i>  Light mode'
      : '<i class="ph-moon-bold setting__icon"></i>  Dark mode';

    this._saveLocalStorage();
  }

  _openModal() {
    modalSection.classList.remove('hidden');
    modalFilter.classList.remove('hidden');
  }

  _closeModal() {
    modalSection.classList.add('hidden');
    modalFilter.classList.add('hidden');
  }

  _getLocalStorage() {
    let data = localStorage.getItem('state');
    if (!data) return;
    data = JSON.parse(data);

    this._state.pairs = data.pairs;
    this._state.darkMode = data.darkMode;
    this._state.records = data.records;
  }

  _saveLocalStorage() {
    localStorage.setItem('state', JSON.stringify(this._state));
  }

  _startTimer() {
    this._clearTimer();

    const start = Date.now();
    return setInterval(() => {
      const secondPass = Math.floor((Date.now() - start) / 1000);
      const timeDisplay =
        secondPass < 60
          ? `00:${((secondPass % 60) + '').padStart(2, '0')}`
          : `${Math.floor(secondPass / 60)}:${((secondPass % 60) + '').padStart(
              2,
              '0'
            )}`;
      headerTimer.textContent = timeDisplay;
    }, 100);
  }

  _stopTimer() {
    window.clearInterval(this._timer);
  }

  _clearTimer() {
    headerTimer.textContent = '';
  }
}

/////////////////////////////
///// To evoke our app //////

// Rendering new game
const init = function () {
  const app = new App();

  // Event handlers
  modeBtn.addEventListener('click', app._changeMode.bind(app));
  settingBtn.addEventListener('click', app._openModal);
  // settingBtn.addEventListener('click', app._stopTimer);
  restartBtn.addEventListener('click', app._restartGame.bind(app));

  [(modalFilter, modalCloseBtn)].forEach(el =>
    el.addEventListener('click', app._closeModal)
  );
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modalSection.classList.contains('hidden')) {
      app._closeModal();
    }
  });

  pairsSelect.addEventListener('change', app._pairSelectChange.bind(app));
  gameSection.addEventListener('click', function (e) {
    const card = e.target.closest('.game--card');
    app._checkCardPairs(card);
  });
};
init();
