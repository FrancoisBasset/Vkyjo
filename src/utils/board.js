function getCardsOfValue(value, count) {
	const cards = [];
	for (let i = 0; i < count; i++) {
		cards.push({
			value: value,
			visible: false
		});
	}

	return cards;
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

export function getNewCardsPack() {
	const cards = [];
	cards.push(...getCardsOfValue(-2, 5));
	cards.push(...getCardsOfValue(-1, 10));
	cards.push(...getCardsOfValue(0, 15));
	for (let i = 1; i <= 12; i++) {
		cards.push(...getCardsOfValue(i, 10));
	}
	shuffleArray(cards);

	return cards;
}

export function getPlayerCards(cards) {
	const playerCards = [];
	
	for (let i = 0; i < 12; i++) {
		playerCards.push(cards.pop());
	}

	return playerCards;
}

export function getBotCards(cards) {
	const botCards = [];

	for (let i = 0; i < 12; i++) {
		botCards.push(cards.pop());
	}

	const index1 = Math.floor(Math.random() * 12);
	let index2 = index1;
	while (index1 === index2) {
		index2 = Math.floor(Math.random() * 12);
	}

	botCards[index1].visible = true;
	botCards[index2].visible = true;

	return botCards;
}
