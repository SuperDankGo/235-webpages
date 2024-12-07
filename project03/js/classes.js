class Card {
    constructor(suit) {
        this.suit = suit;

        const suits = {'cloud':0, 'mushroom':1, 'flower':2, 'luigi':3, 'mario':4, 'star':5, }
        this.value = suits[suit];
    }

}

class Deck {
    constructor() {
        this.deck = [];
        this.reset();
        this.shuffle();
    }

    reset() {
        // Cloud - 6
        // Mushroom - 6
        // Flower - 6
        // Luigi - 5
        // Mario - 5
        // Star - 4
        this.deck = [];

        for (let i = 0; i < 6; i++) {
            this.deck.push('cloud', 'mushroom', 'flower');
        }

        for (let x = 0; x < 5; x++) {
            this.deck.push('luigi', 'mario');
        }

        for (let y = 0; y < 4; y++) {
            this.deck.push('star');
        }
    }

    shuffle() {
        let cards = this.deck.length;

        for (let i = 0; i < cards; i++) {
            let ran = Math.floor(Math.random() * cards);
            let tmpDeck = this.deck[i];
            this.deck[i] = this.deck[ran];
            this.deck[ran] = tmpDeck;
        }
    }

    deal() {
        return this.deck.pop();
    }

    length() {
                return this.deck.length;
            }
}