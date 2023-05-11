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
		[array[i], array[j]] = [array[j], array[i]];
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
	return cards.splice(0, 12);
}

export function getBotCards(cards) {
	const botCards = cards.splice(0, 12);

	const index1 = Math.floor(Math.random() * 12);
	let index2 = index1;
	while (index1 === index2) {
		index2 = Math.floor(Math.random() * 12);
	}

	botCards[index1].visible = true;
	botCards[index2].visible = true;

	return botCards;
}
