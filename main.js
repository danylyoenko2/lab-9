const TOTAL_ATTEMPTS = 3;      
const FLIP_TIME = 250;         
const MAX_NAME_TRIES = 3;      
const DEFAULT_NAME = 'Гравець';

const CARDS = [
  { rank: '6',  title: '6',      value: 6 },
  { rank: '7',  title: '7',      value: 7 },
  { rank: '8',  title: '8',      value: 8 },
  { rank: '9',  title: '9',      value: 9 },
  { rank: '10', title: '10',     value: 10 },
  { rank: 'В',  title: 'Валет',  value: 2 },
  { rank: 'Д',  title: 'Дама',   value: 3 },
  { rank: 'К',  title: 'Король', value: 4 },
  { rank: 'Т',  title: 'Туз',    value: 11 }
];

const SUITS = [
  { symbol: '♠', color: '#111111' },
  { symbol: '♣', color: '#111111' },
  { symbol: '♥', color: '#d32f2f' },
  { symbol: '♦', color: '#d32f2f' }
];

const COLORS = {
  score: '#00b0f0',
  win:   '#34c759',
  lose:  '#ff6b6b',
  draw:  '#ffb020'
};

const getPlayerUI = (pr) => {
  const card = document.getElementById(pr + '-card');
  return {
    block:   document.getElementById(pr + '-block'),
    name:    document.getElementById(pr + '-name'),
    score:   document.getElementById(pr + '-score'),
    caption: document.getElementById(pr + '-caption'),
    card:    card,
    ranks:     card.querySelectorAll('.card__rank'),
    miniSuits: card.querySelectorAll('.card__mini-suit'),
    bigSuit:   card.querySelector('.card__suit')
  };
}

const ui = {
  user:     getPlayerUI('user'),
  computer: getPlayerUI('computer'),
  attempt:  document.getElementById('attempt'),
  generate: document.getElementById('generate'),
  restart:  document.getElementById('restart'),
  result:   document.getElementById('result')
};

const state = {
  attempt: 0,
  userScore: 0,
  computerScore: 0,
  userName: DEFAULT_NAME,
  busy: false
};

const askUserName = () => {

  let username = prompt("Введіть ваше ім'я:");

  if (username === null || username.trim() === "") {
    username = prompt("Введіть коректне ім'я:")
  }

  return username;
}

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

const setGenerateEnabled = (enabled) => {
  ui.generate.disabled = !enabled;
  ui.generate.style.opacity = enabled ? '1' : '0.5';
  ui.generate.style.cursor = enabled ? 'pointer' : 'not-allowed';
}

const showFace = (player, card, suit) => {
  player.card.classList.remove('card--back');
  player.card.style.color = suit.color; 

  player.ranks.forEach((el) => { el.textContent = card.rank; });
  player.miniSuits.forEach((el) => { el.textContent = suit.symbol; });
  player.bigSuit.textContent = suit.symbol;

  player.caption.textContent = card.title + ' (' + card.value + ')';
}

const hideFace = (player) => {
  player.card.classList.add('card--back');
  player.card.style.color = '';
  player.card.style.transform = '';
  player.caption.textContent = '\u00a0';
}

const onGenerate = () => {
  if (state.busy || state.attempt >= TOTAL_ATTEMPTS) {
    return;
  }

  state.busy = true;
  setGenerateEnabled(false);

  state.attempt++;
  ui.attempt.textContent = 'Спроба ' + state.attempt + ' з ' + TOTAL_ATTEMPTS;

  const userCard = randomItem(CARDS);
  const computerCard = randomItem(CARDS);
  const userSuit = randomItem(SUITS);
  const computerSuit = randomItem(SUITS);

  ui.user.card.style.transform = 'rotateY(90deg)';
  ui.computer.card.style.transform = 'rotateY(90deg)';

  setTimeout(() => {
    showFace(ui.user, userCard, userSuit);
    showFace(ui.computer, computerCard, computerSuit);

    state.userScore += userCard.value;
    state.computerScore += computerCard.value;
    ui.user.score.textContent = state.userScore;
    ui.computer.score.textContent = state.computerScore;

    ui.user.card.style.transform = 'rotateY(0deg)';
    ui.computer.card.style.transform = 'rotateY(0deg)';

    setTimeout(() => {
      state.busy = false;

      if (state.attempt >= TOTAL_ATTEMPTS) {
        finishGame();
      } else {
        setGenerateEnabled(true);
      }
    }, FLIP_TIME);
  }, FLIP_TIME);
}

const highlight = (player, color, dim) => {
  player.score.style.backgroundColor = color;
  player.block.style.boxShadow = '0 0 0 4px ' + color;
  player.block.style.opacity = dim ? '0.6' : '1';
}

const finishGame = () => {
  let text;
  let color;

  if (state.userScore > state.computerScore) {
    text = `Переміг ${state.userName}!`;
    color = COLORS.win;
    highlight(ui.user, COLORS.win, false);
    highlight(ui.computer, COLORS.lose, true);
  } else if (state.userScore < state.computerScore) {
    text = "Переміг комп'ютер";
    color = COLORS.lose;
    highlight(ui.user, COLORS.lose, true);
    highlight(ui.computer, COLORS.win, false);
  } else {
    text = 'Нічия';
    color = COLORS.draw;
    highlight(ui.user, COLORS.draw, false);
    highlight(ui.computer, COLORS.draw, false);
  }

  ui.result.textContent = text;
  ui.result.style.color = color;
  ui.result.style.display = 'block';
  ui.restart.style.display = 'inline-block';
}

const resetGame = () => {
  state.attempt = 0;
  state.userScore = 0;
  state.computerScore = 0;
  state.busy = false;

  [ui.user, ui.computer].forEach((player) => {
    hideFace(player);
    player.score.textContent = '0';
    player.score.style.backgroundColor = COLORS.score;
    player.block.style.boxShadow = 'none';
    player.block.style.opacity = '1';
  });

  ui.attempt.textContent = 'Спроба 0 з ' + TOTAL_ATTEMPTS;
  ui.result.style.display = 'none';
  ui.restart.style.display = 'none';
  setGenerateEnabled(true);
}

const init = () => {
  state.userName = askUserName();
  ui.user.name.textContent = state.userName;

  ui.generate.addEventListener('click', onGenerate);
  ui.restart.addEventListener('click', resetGame);
  resetGame();
}

init();
