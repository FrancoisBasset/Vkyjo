<template>
	<div class='container'>
		<div class='row'>
			<div class='col'>
				<label style="color: white">Score : {{ data.botScore }}</label>
				<VkyjoGrid :cards="data.botCards" />
			</div>
		</div>
		<br><br>
		<div class='row'>
			<div class='col'>
				<VkyjoCard @click="clickDiscard()" :value="data.face.value" :selected="data.choice === 'face'" :visible="data.face.visible" />
			
				<button v-if="data.step === 'end'" @click="restartGame()">Nouvelle manche</button>
			
				<VkyjoCard @click="clickDeck()" :value="data.back.value" :selected="data.choice === 'back'" :visible="data.back.visible" />
			</div>
		</div>
		<br><br>
		<div class='row'>
			<div className='col'>
				<VkyjoGrid @onCardClick="i => playerPlays(i)" :cards="data.playerCards" />
				<label style="color: white">Score : {{ data.playerScore }}</label>
			</div>
		</div>
	</div>
</template>

<script setup>
import VkyjoCard from './VkyjoCard.vue';
import VkyjoGrid from './VkyjoGrid.vue';
import { getNewCardsPack, getPlayerCards, getBotCards } from '../utils/board';
import { reactive, onUpdated } from 'vue';

const cards = getNewCardsPack();
const playerCards = getPlayerCards(cards);
const botCards = getBotCards(cards);

const face = cards.pop();
face.visible = true;

const back = cards.pop();

const data = reactive({
	cards: cards,
	playerCards: playerCards,
	botCards: botCards,
	face: face,
	back: back,
	step: 'begin',
	turn: 'player',
	cardsVisible: 0,
	choice: null,
	botCardsVisible: 2,
	playerScore: 0,
	botScore: 0
});

onUpdated(() => {
	checkColumns('player', data.playerCards);
	checkColumns('bot', data.botCards);

	if (data.step === 'game' && data.turn === 'bot') {
		botPlays();
	}
});

function clickDeck() {
	if (data.step === 'begin' || data.turn === 'bot') {
		return;
	}
		
	data.back.visible = true;
	data.choice = 'back';
}

function clickDiscard() {
	if (data.step === 'begin' || data.turn === 'bot') {
		return;
	}

	if (data.choice === 'back') {
		data.face = data.back;
		data.back = data.cards.pop();
		data.turn = 'bot';
		data.choice = null;
	} else {
		data.choice = 'face';
	}
}

function playerPlays(i) {
	if (data.turn === 'bot') {
		return;
	}

	if (data.step === 'game' && data.choice === null) {
		return;
	}

	if (data.step === 'begin') {
		if (data.playerCards[i].visible) {
			return;
		}

		data.cardsVisible = data.cardsVisible + 1;
		data.playerCards[i].visible = true;
			
		if (data.cardsVisible === 2) {
			decideWhoBegin();
			data.step = 'game';
		}
	} else {
		if (data.choice === 'face') {
			data.playerCards[i].visible = true;

			let face = data.playerCards[i];
			data.playerCards[i] = data.face;
			data.face = face;

			data.choice = null;
		} else if (data.choice === 'back') {
			data.playerCards[i].visible = true;

			data.face = data.playerCards[i];
			data.playerCards[i] = data.back;
			data.back = data.cards.pop();
			data.choice = null;
		}

		data.turn = 'bot';
		checkFinished();
	}
}

function decideWhoBegin() {
	const playerScore = getScore(data.playerCards);
	const botScore = getScore(data.botCards);

	if (playerScore > botScore) {
		data.turn = 'player';
	} else {
		data.turn ='bot';
	}
}

function getScore(cards) {
	return cards.reduce((sum, card) => {
		if (card.visible || data.step === 'game') {
			sum += card.value;
		}
		return sum;
	}, 0);
}

function checkColumns(who, cards) {
	const cols = cards.length / 3;

	for (let c = 0; c < cols; c++) {
		if (cards[c].visible && cards[c + cols].visible && cards[c + cols + cols].visible) {
			if (cards[c].value === cards[c + cols].value && cards[c + cols].value === cards[c + cols + cols].value) {
				const face = cards[c];

				cards.splice(c, 1);
				cards.splice(c + cols - 1, 1);
				cards.splice(c + cols + cols - 2, 1);

				data.face = face;

				if (who === 'player') {
					data.playerCards = cards;
				} else if (who === 'bot') {
					data.botCards = cards;
				}

				break;
			}
		}
	}
}

function checkFinished() {
	const playerLast = data.playerCards.filter(c => !c.visible).length;
	const botLast = data.botCards.filter(c => !c.visible).length;

	if (playerLast === 0 || botLast === 0) {
		updateScore();

		data.playerCards.map(c => c.visible = true);
		data.botCards.map(c => c.visible = true);
		data.step = 'end';
	}
}

function updateScore() {
	data.playerScore = data.playerScore + getScore(data.playerCards);
	data.botScore = data.botScore + getScore(data.botCards);
}

function botPlays() {
	const allHidden = data.botCards.filter(c => !c.visible);

	if (allHidden.length === 0) {
		return;
	}

	let face = data.face;
	let indexToModify = -1;

	if (data.face.value >= 1) {
		indexToModify = checkGoColumns(data.botCards, 'face');
	} else if (data.face.value <= 0) {
		for (let i = 0; i < data.botCards.length; i++) {
			if (data.botCards[i].value > 2) {
				indexToModify = i;
				break;
			}
		}
	} else {
		const back = data.back;
		back.visible = true;

		indexToModify = checkGoColumns(data.botCards, 'back');
	}
		
	if (indexToModify === -1) {
		indexToModify = Math.floor(Math.random() * allHidden.length);
		indexToModify = data.botCards.indexOf(allHidden[indexToModify]);

		data.botCards[indexToModify].visible = true;
	} else {
		face = data.botCards[indexToModify];
		face.visible = true;
		data.botCards[indexToModify] = data.face;
		data.botCards[indexToModify].visible = true;
	}

	data.face = face;
	data.turn = 'player';

	checkFinished();
}

function checkGoColumns(botCards, bloc) {
	const cols = botCards.length / 3;

	for (let c = 0; c < cols; c++) {
		const value = bloc === 'face' ? data.face.value : data.back.value;

		if (value <= 0) {
			return;
		}

		const i1 = value === botCards[c].value && botCards[c].visible;
		const i2 = value === botCards[c + cols].value && botCards[c + cols].visible;
		const i3 = value === botCards[c + cols + cols].value && botCards[c + cols + cols].visible;

		if (i1 && i2) {
			return c + cols + cols;
		} else if (i2 && i3) {
			return c;
		} else if (i1 && i3) {
			return c + cols;
		} else if (i1) {
			return c + cols + cols;
		} else if (i2) {
			return c;
		} else if (i3) {
			return c + cols;
		}
	}

	return -1;
}

function restartGame() {
	data.cards = getNewCardsPack();
	data.playerCards = getPlayerCards(data.cards);
	data.botCards = getBotCards(data.cards);

	data.face = data.cards.pop();
	data.face.visible = true;

	data.back = data.cards.pop();

	data.step = 'begin';
	data.turn = 'player';
	data.cardsVisible = 0;
	data.choice = null;
	data.botCardsVisible = 2;
	data.playerScore = 0;
	data.botScore = 0;
}
</script>
