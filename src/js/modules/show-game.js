import { DOM } from './dom-element';
import { SYLLABLES, DEFEAT, VICTORY } from './settings';
import showSlider from './slider';

function showGame() {
  let time = 10;
  let sound = 1;
  let isVictory = false;
  let timerId;

  /**
   * Добавляет разметку в родительский элемент.
   *
   * @param {object} parentElement Родительский элемент.
   * @param {string} childElement Разметка дочернего элемента.
   */
  function addMarkup(parentElement, childElement) {
    parentElement.innerHTML = childElement;
  }

  /**
   * Создает и возвращает разметку рабочего экрана, при этом перемещая предыдущий экран из видимой области и очишая его содержимое
   *
   * @param {object} parentElement Родительский элемент.
   * @return {object} разметка рабочего экрана.
   */
  function addScreen(parentElement) {
    const newScreen = document.createElement('div');
    newScreen.className = 'screen';
    parentElement.append(newScreen);

    const screenFirst = document.querySelector('.screen');
    screenFirst.classList.add('up');
    screenFirst.innerHTML = '';

    return newScreen;
  }

  /**
   * Удаляет элемент первого (скрытого) экрана
   *
   */
  function removeScreen() {
    const screenFirst = document.querySelector('.screen');
    screenFirst.remove();
  }

  /**
   * Возвращает рандомное число из заданного диапазона.
   *
   * @param {number} min минимальное значение.
   * @param {number} max максимальное значение.
   * @return {number} рандомное число.
   */
  function getRandomNumber(min, max) {
    const randomNumber = Math.round(Math.random() * (max - min) + min);
    return randomNumber;
  }

  /**
   * Присваивает указанному параметру значение датаатрибута выбранной кнопки, меняет оформлениеп активной кнопки.
   *
   * @param {object} parentElement родительский элемент, в котором находится группа кнопок.
   * @param {string} param строковое название параметра за который отвечает группа кнопок.
   *
   */
  function changeActiveButton(parentElement, param) {
    parentElement.addEventListener('click', (event) => {
      if (event.target.closest('.button')) {
        const buttonClick = event.target.closest('.button');
        if (param === 'time') time = Number(buttonClick.dataset[param]);
        if (param === 'sound') sound = Number(buttonClick.dataset[param]);

        const buttons = parentElement.querySelectorAll('.button');

        buttons.forEach((button) => {
          button.classList.remove('button--active');
        });

        buttonClick.classList.add('button--active');
      }
    });
  }

  /**
   * Запускает таймер обратного отсчета выхода из игры.
   *
   * @return {number} идентификатор таймера.
   */
  function startFinishGameTimer() {
    function FinishGameTimerCallback() {
      const seconds = String(time).padStart(2, '0');
      if (document.querySelector('.game__timer')) {
        const gameTimer = document.querySelector('.game__timer');
        gameTimer.textContent = `00:00:${seconds}`;
      }

      if (time === 0) {
        clearInterval(finishGameTimer);
        finishGame();
      }

      time--;
    }

    FinishGameTimerCallback();
    const finishGameTimer = setInterval(FinishGameTimerCallback, 1000);

    return finishGameTimer;
  }

  function showSyllabics() {
    if (document.getElementById('syllabics')) {
      const syllabics = document.getElementById('syllabics');
      let text = SYLLABLES[getRandomNumber(0, SYLLABLES.length - 1)];
      for (let i = 0; i <= 10; i += 1) {
        text += `-${SYLLABLES[getRandomNumber(0, SYLLABLES.length - 1)]}`;
      }
      syllabics.textContent = text;
    }
  }

  /**
   * Завершает игру
   *
   */
  function finishGame() {
    removeScreen();
    const screen = addScreen(DOM.containerGame);
    addMarkup(screen, createFinishScreen());
    addFunctionaliatyFinishScreen();
  }

  /**
   * Формирует и возвращает разметку стартового экрана.
   *
   * @return {string} разметка стартового экрана.
   */
  function createStartScreen() {
    const markup = `
    <div class="game__inner game__inner--start">
      <div class="game__img game__slider-list">
        <div class="game__slide game__slide--active">
          <img src="./img/svg/start-01.svg" alt="Котик на ветке" />
        </div>
        <div class="game__slide">
          <img src="./img/svg/start-02.svg" alt="Котик на ветке" />
        </div>
        <div class="game__slide">
          <img src="./img/svg/start-03.svg" alt="Котик на ветке" />
        </div>
      </div>
      <div class="game__descr">
        <h2 class="game__title">Слоговая дорожка</h2>
        <div class="game__img--mobile">
          <img src="./img/svg/start-01.svg" alt="Котик на ветке" />
        </div>
        <p class="game__text">
            Быстро и четко прочитай строчки из слогов за заданное время.
        </p>
        <button class="game__button button button--light" id="settings-btn">Пройти испытание</button>
      </div>
    </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с настройками.
   *
   * @return {string} разметка экрана с настройками.
   */
  function createSettingsScreen() {
    const markup = `
            <div class="game__inner game__inner--setting">
              <div class="game__descr">
                <h2 class="game__title">Настройки</h2>
                <div class="game__text">
                  До начала испытания всего один шаг. Выбери подходящие настройки.
                  <h3 class="game__subtitle">Скорость чтения строки:</h3>
                  <div class="game__buttons-list" id="buttons-list-time">
                    <button class="game__button--setting button" data-time="14"><span class="icon icon--bike"></span>Медленно</button>
                    <button class="game__button--setting button button--active" data-time="10"><span class="icon icon--car"></span>Средне</button>
                    <button class="game__button--setting button" data-time="6"><span class="icon icon--rocket"></span>Быстро</button>
                  </div>
                  <div class="game__sound-inner">
                    <h3 class="game__subtitle">Звук:</h3>
                    <div class="game__buttons-list" id="buttons-list-sound">
                      <button class="game__button--setting button button--active" data-sound="1"><span class="icon icon--sound-on"></span>Включен</button>
                      <button class="game__button--setting button" data-sound="0"><span class="icon icon--sound-off"></span>Выключен</button>
                    </div>
                  </div>
                  <button class="game__button button button--light" id="start-btn">Начать</button>
                </div>
              </div>
              <div class="game__img">
                <img src="./img/svg/settings.svg" alt="Котик с ноут буком" />
              </div>
            </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с игровым полем.
   *
   * @return {string} разметка экрана с игровым полем.
   */
  function createGameScreen() {
    const markup = `
            <div class="game__inner">
              <div class="game__board" id="board">
                <p class="game__timer" id="timer">00:00:00</p>
                <p class="game__syllabics" id="syllabics">пер-пер-пер-пер-пер-пер-пер-пер-пер-пер</p>
              </div>
            </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с завершающим вопросом.
   *
   * @return {string} разметка экрана с завершающим вопросом.
   */
  function createFinishScreen() {
    const markup = `
    <div class="game__inner game__inner--finish">
      <div class="game__img">
        <img src="./img/svg/finish.svg" alt="Котик смотрит на знак вопроса" />
      </div>
      <div class="game__descr">
        <h2 class="game__title">Оцени себя.<br> У тебя все получилось?</h2>
        <div class="game__img--mobile">
          <img src="./img/svg/finish.svg" alt="Котик смотрит на знак вопроса" />
        </div>
        <div class="game__buttons-list game__buttons-list--grade" id="buttons-list-grade">
          <button class="game__button--grade button button--green" id="button-yes"><span class="icon icon--smile"></span>Да</button>
          <button class="game__button--grade button button--red" id="button-no"><span class="icon icon--sad"></span>Нет</button>
        </div>
      </div>
    </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с результатом.
   *
   * @return {string} разметка экрана с результатом.
   */
  function createResScreen() {
    const { src1, text } = isVictory
      ? VICTORY[getRandomNumber(0, VICTORY.length - 1)]
      : DEFEAT[getRandomNumber(0, DEFEAT.length - 1)];
    const markup = `
    <div class="game__inner game__inner--finish">
      <div class="game__descr">
        <h2 class="game__title">${text}</h2>
        <div class="game__img--mobile">
          <img src=${src1} alt="Котик" />
        </div>
        <button class="game__button button button--light" id="new-game-btn">Играть снова</button>
      </div>
      <div class="game__img">
        <img src=${src1} alt="Котик" />
      </div>
    </div>
    `;

    return markup;
  }

  /**
   * Добавляет обработчики событий для первого экрана, когда он сформирован.
   *
   */
  function addFunctionaliatyStartScreen() {
    showSlider();
    if (document.getElementById('settings-btn')) {
      const settingsBtn = document.getElementById('settings-btn');

      settingsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelectorAll('.screen').length > 1 && removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createSettingsScreen());
        addFunctionaliatySettingsScreen();
      });
    }
  }

  /**
   * Добавляет обработчики событий для экрана с настройками, когда он сформирован.
   *
   */
  function addFunctionaliatySettingsScreen() {
    if (document.getElementById('buttons-list-time')) {
      const buttonsListTime = document.getElementById('buttons-list-time');
      changeActiveButton(buttonsListTime, 'time');
    }

    if (document.querySelector('.game__range')) {
      const slideValue = document.getElementById('slider__value');
      const sliderInput = document.getElementById('slider__input');

      sliderInput.oninput = () => {
        countWords = sliderInput.value;
        slideValue.textContent = countWords;
        slideValue.style.left = `${countWords * 10 - 40}%`;
      };
    }

    if (document.getElementById('buttons-list-sound')) {
      const buttonsListSound = document.getElementById('buttons-list-sound');
      changeActiveButton(buttonsListSound, 'sound');
    }

    if (document.getElementById('start-btn')) {
      const startBtn = document.getElementById('start-btn');

      startBtn.addEventListener('click', (event) => {
        event.preventDefault();
        removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createGameScreen());
        addFunctionaliatyGameScreen();
      });
    }
  }

  /**
   * Добавляет функциональность для экрана с игрой.
   *
   */
  function addFunctionaliatyGameScreen() {
    if (document.getElementById('board')) {
      startFinishGameTimer();
      showSyllabics();
    }
  }

  /**
   * Добавляет обработчики событий для экрана с финальным вопросом, когда он сформирован.
   *
   */
  function addFunctionaliatyFinishScreen() {
    const finishAudio = new Audio();
    finishAudio.src = './files/stop.mp3';
    sound && finishAudio.play();

    if (document.getElementById('buttons-list-grade')) {
      const yesBtn = document.getElementById('button-yes');
      const noBtn = document.getElementById('button-no');

      function showResult() {
        removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createResScreen());
        addFunctionaliatyResScreen();
      }

      yesBtn.addEventListener('click', (event) => {
        event.preventDefault();
        isVictory = true;
        showResult();
      });

      noBtn.addEventListener('click', (event) => {
        event.preventDefault();
        isVictory = false;
        showResult();
      });
    }
  }

  /**
   * Добавляет обработчики событий для экрана с результатами, когда он сформирован.
   *
   */
  function addFunctionaliatyResScreen() {
    const resAudio = new Audio();
    resAudio.src = isVictory ? './files/victory.mp3' : './files/defeat.mp3';
    sound && resAudio.play();

    if (document.getElementById('new-game-btn')) {
      const newGameBtn = document.getElementById('new-game-btn');
      newGameBtn.addEventListener('click', (event) => {
        event.preventDefault();
        removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createStartScreen());
        addFunctionaliatyStartScreen();
        time = 10;
        sound = 1;
      });
    }
  }

  addMarkup(DOM.screen, createStartScreen());
  addFunctionaliatyStartScreen();
}

export default showGame;
