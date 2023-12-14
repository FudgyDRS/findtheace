import React, { useState, useEffect } from 'react';
import './Game.css';

const cardObjectDefinitions = [
  { id: 1, isFlipped: false, value: 'K', shuffleState: '', imagePath: 'assets/images/card-KingHearts.png' },
  { id: 2, isFlipped: false, value: 'J', shuffleState: '', imagePath: 'assets/images/card-JackClubs.png' },
  { id: 3, isFlipped: false, value: 'Q', shuffleState: '', imagePath: 'assets/images/card-QueenDiamonds.png' },
  { id: 4, isFlipped: false, value: 'A', shuffleState: '', imagePath: 'assets/images/card-AceSpades.png' },
];

const Game = () => {
  const [currentStatusText, setCurrentStatusText] = useState({
    message: `Click 'Play Game' button to play game`,
    color: 'black',
  });
  const [scoreVisiblity, setScoreVisiblity] = useState('flex');
  const [roundNumVisibility, setRoundNumVisibility] = useState('flex');
  const [cardItems, setCardItems] = useState(cardObjectDefinitions);
  const [numCards, setNumCards] = useState(cardObjectDefinitions.length);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [shufflingInProgress, setShufflingInProgress] = useState(false);
  const [gridTemplateAreas, setGridTemplateAreas] = useState(`"a b" "c d"`);
  const [isGameInProgress, setIsGameInProgress] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);

  const onAnimationEnd = (id) => {
    const card = document.getElementById(id);
    if (card) {
      card.classList.remove('fly-in');
    }
  };

  const Card = ({ cardItem, index }) => (
    <div
      className={`card fly-in card-pos-${getCardPosition(index)}`}
      id={`card-${cardItem.id}`}
      onAnimationEnd={() => onAnimationEnd(cardItem.id)}
    >
      <div className={`card-inner ${cardItem.isFlipped ? 'flip-it' : ''}`}>
        <div className="card-front">
          <img src={cardItem.imagePath} alt={`Front of card ${cardItem.id}`} className="card-img" />
        </div>
        <div className="card-back" onClick={() => handleChooseCard(cardItem)}>
          <img src="assets/images/card-back-red.png" alt="Back of card" className="card-img" />
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    setCardItems(cardObjectDefinitions);
    setShowPlayButton(true);
    setShowCards(true);
    setScoreVisiblity("none");
    setRoundNumVisibility("none");
  }, []);

  const getCardPosition = (cardId) => {
    switch (cardId) {
      case 0:
        return 'a';
      case 1:
        return 'b';
      case 2:
        return 'c';
      case 3:
        return 'd';
    }
  };

  const statusText = [`Click 'Play Game' button to play game`];

  const aceid = 4;

  const cardBackImgPath = 'assets/images/card-back-red.png';

  let cards = [];

  const playGameButtonElem = document.getElementById('playGame');

  const cardContainerElem = document.querySelector('.card-container');

  const collapsedGridAreaTemplate = '"a a" "a a"';
  const cardCollectionCellClass = '.card-pos-a';

  let cardPositions = [];

  let maxRounds = 4;

  let gameObj = {};

  const localStorageGameKey = 'HTA';

  function gameOver() {
    setScoreVisiblity("none");
    setRoundNumVisibility("none");
    setCurrentStatusText({ message: `Game Over! Final Score - ${score} Click 'Play Game' button to play again`, color: 'black' });

    setIsGameInProgress(false);
    setShowPlayButton(true);
  }

  function endRound() {
    setRoundNum(roundNum+1);
    setTimeout(() => {
      if (roundNum === maxRounds-1) {
        gameOver();
        return;
      } else {
        startRound();
      }
    }, 3000);
  }

  const handleChooseCard = (cardItem) => {
    if (canChooseCard()) {
      if (cardItem.value == "A") {
        updateScore();
        outputChoiceFeedBack(true);
      } else {
        outputChoiceFeedBack(false);
      }
      // saveObjectToLocalStorage(score, roundNum);
      // flipCard(card, false);

      setTimeout(() => {
        flipCards(false);
        setCurrentStatusText({ message: 'Card Positions Revealed', color: 'black' });
        endRound();
      }, 3000);
      setCardsRevealed(true);
    }
  }

  function updateScore() {
    const scoreMap = [100, 50, 25, 10];
    console.log(roundNum)
    console.log(scoreMap[roundNum])
    console.log(score)
    setScore(score + scoreMap[roundNum]);
    console.log(score)
  }

  // function updateStatusElement(elem, display, color, innerHTML) {
  //   elem.style.display = display;

  //   if (arguments.length > 2) {
  //     elem.style.color = color;
  //     elem.innerHTML = innerHTML;
  //   }
  // }

  function outputChoiceFeedBack(hit) {
    if (hit) {
      setCurrentStatusText({ message: 'Hit!! -Well Done!! :)', color: 'green' });
    } else {
      setCurrentStatusText({ message: 'Missed!! :(', color: 'red' });
    }
  }
  
  function canChooseCard() {
    return isGameInProgress == true && !shufflingInProgress && !cardsRevealed;
  }

  // function checkForIncompleteGame() {
  //   const serializedGameObj = getLocalStorageItemValue(localStorageGameKey);
  //   if (serializedGameObj) {
  //     gameObj = getObjectFromJSON(serializedGameObj);

  //     if (gameObj.round >= maxRounds) {
  //       removeLocalStorageItem(localStorageGameKey);
  //     } else {
  //       if (window.confirm("Would you like to continue with your game?")) {
  //         score = gameObj.score;
  //         roundNum = gameObj.round;
  //       }
  //     }
  //   }
  // }

  const handleStartGame = () => {
    setScore(0);
    setRoundNum(0);

    // checkForIncompleteGame();

    setShufflingInProgress(false);
    setScoreVisiblity('flex');
    setRoundNumVisibility('flex');
    startRound();
  };

  function startRound() {
    initializeNewRound();
    collectCards();
    flipCards(true);
    shuffleCards();
  }

  function shuffleCards() {
    let shuffleCount = 0;
    const id = setInterval(shuffle, 12);

    function shuffle() {
      randomizeCardPositions();
      animateShuffle(shuffleCount);

      if (shuffleCount == 500) {
        clearInterval(id);
        setShufflingInProgress(false);
        removeShuffleClasses();
        setCurrentStatusText({
          message: 'Please click the card that you think is the Ace of Spades...',
          color: 'black',
        });
      } else {
        shuffleCount++;
      }
    }
  }

  const toggleShuffleState = (cardIndex, shuffleClass) => {
    setCardItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === cardIndex ? { ...item, shuffleState: item.shuffleState === shuffleClass ? '' : shuffleClass } : item
      )
    );
  };

  const randomizeCardPositions = () => {
    let items = cardItems;
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setCardItems(items);
  };

  function initializeNewRound() {
    // setRoundNum(roundNum + 1);
    setShowPlayButton(false);

    setIsGameInProgress(true);
    setShufflingInProgress(true);
    setCardsRevealed(false);

    setCurrentStatusText({ message: 'Shuffling...', color: 'black' });
  }

  function collectCards() {
    setGridTemplateAreas(`"a a" "a a"`);
  }

  const flipCards = (state) => {
    let updatedItems = cardItems;
    updatedItems.forEach((card) => {
      card.isFlipped = state;
    });
    setCardItems(updatedItems);
  };

  function removeShuffleClasses() {
    cards.forEach((card) => {
      card.classList.remove('shuffle-left');
      card.classList.remove('shuffle-right');
    });
  }

  function animateShuffle(shuffleCount) {
    const random1 = Math.floor(Math.random() * numCards) + 1;
    const random2 = Math.floor(Math.random() * numCards) + 1;

    let card1 = cardItems[random1];
    let card2 = cardItems[random2];

    if (shuffleCount % 4 == 0) {
      // card1.classList.toggle("shuffle-left");
      toggleShuffleState(card1, 'shuffle-left');
      // card1.style.zIndex = 100;
    }
    if (shuffleCount % 10 == 0) {
      // card2.classList.toggle("shuffle-right");
      toggleShuffleState(card2, 'shuffle-right');
      // card2.style.zIndex = 200;
    }
  }

  const generateGridAreas = () => {
    let firstPart = '';
    let secondPart = '';
    let areas = '';

    cardPositions.forEach((position, index) => {
      areas += { 1: 'a', 2: 'b', 3: 'c', 4: 'd' }[position] + ' ';
      if (index === 1) {
        firstPart = areas.trim();
        areas = '';
      } else if (index === 3) {
        secondPart = areas.trim();
      }
    });

    return `"${firstPart}" "${secondPart}"`;
  };

  // local storage functions
  function getSerializedObectAsJSON(obj) {
    return JSON.stringify(obj);
  }
  function getObjectFromJSON(json) {
    return JSON.parse(json);
  }
  function updateLocalStorageItem(key, value) {
    localStorage.setItem(key, value);
  }
  function removeLocalStorageItem(key) {
    localStorage.removeItem(key);
  }
  function getLocalStorageItemValue(key) {
    return localStorage.getItem(key);
  }
  function updateGameObject(score, round) {
    gameObj.score = score;
    gameObj.round = round;
  }
  function saveObjectToLocalStorage(score, round) {
    updateGameObject(score, round);
    updateLocalStorageItem(localStorageGameKey, getSerializedObectAsJSON(gameObj));
  }

  return (
    <div className="game-container">
      <header>
        <div className="header-title-container">
          <h1>Hunt the Ace</h1>
        </div>
        <div className="header-round-info-container">
          <div className="header-img-container">
            <img src="assets/images/AceSpades.png" alt="" className="header-img" />
          </div>
          <div className="header-score-container" style={{ display: `${scoreVisiblity}` }}>
            <h2 className="score">
              Score&nbsp;<span className="badge">{score}</span>
            </h2>
          </div>
          <div className="header-round-container" style={{ display: `${roundNumVisibility}` }}>
            <h2 className="round">
              Round&nbsp;<span className="badge">{roundNum}</span>
            </h2>
          </div>
        </div>
        <div className="header-status-info-container">
          <p className="current-status-text style={{ color: currentStatusText.color }}">{currentStatusText.message}</p>
        </div>
        <div className="header-button-container">
          <div className="game-play-button-container">
            <button
              id="playGame"
              className="play-game"
              style={{
                display: showPlayButton ? 'block' : 'none',
                animation: showPlayButton ? 'game-play-button-fade-in 3s forwards' : 'none',
              }}
              onClick={() => handleStartGame()}
            >
              Play Game
            </button>
          </div>
          <div className="metamask-login-container">
            <button id="connectWeb3" className="connect-web3">
              Connect Web3 Wallet
            </button>
            <p id="walletAddress"></p>
            <p id="ensName"></p>
          </div>
        </div>
      </header>
      <main>
        <div className="card-container">
          {cardItems.map((cardItem, index) => (
            <Card
              key={cardItem.id}
              cardItem={cardItem}
              index={index}
              style={{
                animation: showCards ? 'flyInAnimation 1s ease forwards' : 'none',
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Game;
