let blackjackGame = {
    'you': {'score': 0, 'div': '.playerA_hand', 'scoreDiv': '#scoreA'},
    'dealer': {'score': 0, 'div': '.playerB_hand', 'scoreDiv': '#scoreB'},
    'cards': ["AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "KC", "QC", "JC", "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "KD", "QD", "JD", "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "KH", "QH", "JH", "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "KS", "QS", "JS"],
    'cardMap': {"AC": [1, 11], "2C": 2, "3C": 3, "4C": 4, "5C": 5, "6C": 6, "7C": 7, "8C": 8, "9C": 9, "10C": 10, "KC": 10, "QC": 10, "JC": 10, "AD": [1, 11], "2D": 2, "3D": 3, "4D": 4, "5D": 5, "6D": 6, "7D": 7, "8D": 8, "9D": 9, "10D": 10, "KD": 10, "QD": 10, "JD": 10, "AH": [1, 11], "2H": 2, "3H": 3, "4H": 4, "5H": 5, "6H": 6, "7H": 7, "8H": 8, "9H": 9, "10H": 10, "KH": 10, "QH": 10, "JH": 10, "AS": [1, 11], "2S": 2, "3S": 3, "4S": 4, "5S": 5, "6S": 6, "7S": 7, "8S": 8, "9S": 9, "10S": 10, "KS": 10, "QS": 10, "JS": 10},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false, 
}

const you = blackjackGame['you']
const dealer = blackjackGame['dealer']

const blackjackHit = () => {
    if (blackjackGame['isStand'] === false) {
        let card = randomization();
        showCard(card, you);
        updateScore(card, you);
        showScore(you);
    }
}

const randomization = () => {
    let index = Math.floor(Math.random() * 52);
    return blackjackGame['cards'][index]
}

const showCard = (card, activePlayer) => {
    if (activePlayer['score'] <= 21) {
        let image = document.createElement('img');
        image.src = `./images/cards/${card}.png`;
        let att = document.createAttribute("class");
        att.value = "player_card";
        image.setAttributeNode(att);
        document.querySelector(activePlayer['div']).appendChild(image);
    }
}

const blackjackDeal = () => {
    if (blackjackGame['turnOver'] === true) {
        blackjackGame['isStand'] = false;
        let playerCards = document.querySelector('.playerA_hand').querySelectorAll('img');
        let dealerCards = document.querySelector('.playerB_hand').querySelectorAll('img');

        for (i = 0; i < playerCards.length; i++) {
            playerCards[i].remove()
        }

        for (i = 0; i < dealerCards.length; i++) {
            dealerCards[i].remove()
        }

        you['score'] = 0;
        dealer['score'] = 0;

        document.querySelector('#scoreA').textContent = 0;
        document.querySelector('#scoreB').textContent = 0;
        document.querySelector('#scoreA').style.color = "black";
        document.querySelector('#scoreB').style.color = "black";

        document.querySelector('.message_box').textContent = "Let's Play!";
        document.querySelector('.message_box').style.color = "#ffffff";

        blackjackGame['turnOver'] = true;
    }
}

const updateScore = (card, activePlayer) => {
    if ((card === "AC") || (card === "AD") || (card === "AH") || (card === "AS")) {
        if (activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardMap'][card][1]
        } else {
            activePlayer['score'] += blackjackGame['cardMap'][card][0]
        }
    } else {
        activePlayer['score'] += blackjackGame['cardMap'][card]
    }
}

const showScore = (activePlayer) => {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreDiv']).textContent = "Over!";
        document.querySelector(activePlayer['scoreDiv']).style.color = "red";
    } else {
        document.querySelector(activePlayer['scoreDiv']).textContent = activePlayer['score'];
    }    
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dealerLogic = async () => {
    blackjackGame['isStand'] = true;

    while (dealer['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomization();
        showCard(card, dealer);
        updateScore(card, dealer);
        showScore(dealer);
        await sleep(1000);
    }

    if (dealer['score'] > 15) {
        blackjackGame['turnOver'] = true;
        let winner = computeWinner();
        showResult(winner);
    }
}

const computeWinner = () => {
    let winner;

    if (you['score'] <= 21) {
        if (you['score'] > dealer['score'] || dealer['score'] > 21) {
            blackjackGame['wins']++;
            winner = you;
        } else if (you['score'] < dealer['score']) {
            blackjackGame['losses']++;
            winner = dealer;
        } else if (you['score'] === dealer['score']) {
            blackjackGame['draws']++
        }
    } else if (you['score'] > 21 && dealer['score'] <= 21) {
        blackjackGame['losses']++;
        winner = dealer;
    } else if (you['score'] > 21 && dealer['score'] > 21) {
        blackjackGame['draws']++
    }

    return winner;
}

const showResult = (winner) => {
    let message, messageColor;

    if (blackjackGame['turnOver'] === true) {
        if (winner === you) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = "Winner!";
            messageColor = "#50c878";
        } else if (winner === dealer) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = "You Lost";
            messageColor = "#ffa07a";
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = "Draw";
            messageColor = "ffff00";
        }

        document.querySelector('.message_box').textContent = message;
        document.querySelector('.message_box').style.color = messageColor;
    }
}

document.querySelector('#button_hit').addEventListener('click', blackjackHit);
document.querySelector('#button_stand').addEventListener('click', dealerLogic);
document.querySelector('#button_deal').addEventListener('click', blackjackDeal);



const openRules = () => {
    const rules = document.querySelector('.rule_box');

    if (rules.style.display == '' || rules.style.display == 'none') {
        rules.style.display = 'flex'
    } else {
        rules.style.display = 'none'
    }
}


document.querySelector('#rule_button').addEventListener('click', openRules);
