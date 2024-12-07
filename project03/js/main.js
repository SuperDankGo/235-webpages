"use strict";
window.onload = init;

// let deck = [];
const deck = new Deck();
let playerHand = [];
let opponentHand = [];
let pHandSort = [];
let oHandSort = [];
let pHandType = "trash";
let oHandType = "trash";
let pHandFreq = -1;
let oHandFreq = -1;
let winner = "";

let htmlWinner = document.querySelector("#winner");
let htmlPHandType = document.querySelector("#pHandType");
let htmlOHandType = document.querySelector("#oHandType");

//Card Selectors
let pCard1 = document.querySelector("#Card1Label");
let pCard2 = document.querySelector("#Card2Label");
let pCard3 = document.querySelector("#Card3Label");
let pCard4 = document.querySelector("#Card4Label");
let pCard5 = document.querySelector("#Card5Label");

let oCard1 = document.querySelector("#rCard1");
let oCard2 = document.querySelector("#rCard2");
let oCard3 = document.querySelector("#rCard3");
let oCard4 = document.querySelector("#rCard4");
let oCard5 = document.querySelector("#rCard5");

function init() {
    document.querySelector("#hold").onclick = DrawCards;
    document.querySelector("#start").onclick = DealHand;
    document.querySelector("#play").onclick = HandType;
}


function DealHand() {
    if (deck.length() < 32) {
        deck.reset();
        deck.shuffle();
    }

    for (let i = 0; i < 5; i++) {
        playerHand[i] = new Card(deck.deal());
        opponentHand[i] = new Card(deck.deal());
    }

    ChangeImg();
}

function DrawCards() {
}

function HandType() {
    //Pair 2
    //Two Pair 3
    //Three of a kind 4
    //Full House 6
    //Four of a Kind 8
    //Five of a Kind 16

    pHandSort = [];
    oHandSort = [];

    for (let i = 0; i < playerHand.length; i++) {
        pHandSort[i] = playerHand[i].value;
        oHandSort[i] = opponentHand[i].value;
    }

    pHandSort.sort();
    oHandSort.sort();

    pHandFreq = mostFrequent(pHandSort);
    oHandFreq = mostFrequent(oHandSort);

    if (isFiveKind(pHandSort)) {
        pHandType = "five";
    }
    else {
        pHandType = findOtherHands(pHandSort);
    }

    if (isFiveKind(oHandSort)) {
        oHandType = "five";
    }
    else {
        oHandType = findOtherHands(oHandSort);
    }

    console.log(pHandType);
    console.log(oHandType);

    winner = findWinner(pHandType, oHandType, pHandFreq, oHandFreq);

    console.log(winner);

    htmlWinner.innerHTML = `Winner: ${winner.toUpperCase()}`;
    htmlPHandType.innerHTML = `Your Hand Type: ${pHandType.toUpperCase()}`;
    htmlOHandType.innerHTML = `Opponent's Hand Type: ${oHandType.toUpperCase()}`;
}

function ChangeImg() {
    pCard1.innerHTML = `<img src="images/${playerHand[0].suit}.png">`;
    pCard2.innerHTML = `<img src="images/${playerHand[1].suit}.png">`;
    pCard3.innerHTML = `<img src="images/${playerHand[2].suit}.png">`;
    pCard4.innerHTML = `<img src="images/${playerHand[3].suit}.png">`;
    pCard5.innerHTML = `<img src="images/${playerHand[4].suit}.png">`;

    rCard1.innerHTML = `<img src="images/${opponentHand[0].suit}.png">`;
    rCard2.innerHTML = `<img src="images/${opponentHand[1].suit}.png">`;
    rCard3.innerHTML = `<img src="images/${opponentHand[2].suit}.png">`;
    rCard4.innerHTML = `<img src="images/${opponentHand[3].suit}.png">`;
    rCard5.innerHTML = `<img src="images/${opponentHand[4].suit}.png">`;
}

function isFiveKind(sortHand) {
    let five = true;

    for (let i = 1; i < sortHand.length; i++) {
        if (sortHand[i - 1] == sortHand[i]) {
            five = true;
        }
        else {
            five = false;
            return five;
        }
    }

    return five;
}

function findOtherHands(sortHand) {
    let zero = 0;
    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let zeroHigh = false;
    let oneHigh = false;
    let twoHigh = false;
    let threeHigh = false;
    let fourHigh = false;
    let fiveHigh = false;
    let mostFreq = mostFrequent(sortHand);

    for (let i = 0; i < sortHand.length; i++) {
        if (sortHand[i] == 0) {
            zero++;
        }
        if (sortHand[i] == 1) {
            one++;
        }
        if (sortHand[i] == 2) {
            two++;
        }
        if (sortHand[i] == 3) {
            three++;
        }
        if (sortHand[i] == 4) {
            four++;
        }
        if (sortHand[i] == 5) {
            five++;
        }
    }

    switch (mostFreq) {
        case 0:
            mostFreq = zero;
            zeroHigh = true;
            break;

        case 1:
            mostFreq = one;
            oneHigh = true;
            break;

        case 2:
            mostFreq = two;
            twoHigh = true;
            break;

        case 3:
            mostFreq = three;
            threeHigh = true;
            break;

        case 4:
            mostFreq = four;
            fourHigh = true;
            break;

        case 5:
            mostFreq = five;
            fiveHigh = true;
            break;
    }

    if (mostFreq == 4) {
        return "four";
    }

    else if (mostFreq == 3) {

        if ((zero == 2 && zeroHigh == false) || (one == 2 && oneHigh == false) || (two == 2 && twoHigh == false)
            || (three == 2 && threeHigh == false) || (four == 2 && fourHigh == false) || (five == 2 && fiveHigh == false)) {
            return "house";
        }

        else {
            return "three";
        }
    }

    else if (mostFreq == 2) {

        if ((zero == 2 && zeroHigh == false) || (one == 2 && oneHigh == false) || (two == 2 && twoHigh == false)
            || (three == 2 && threeHigh == false) || (four == 2 && fourHigh == false) || (five == 2 && fiveHigh == false)) {
            return "two";
        }

        else {
            return "pair";
        }
    }

    return "trash";
}

function mostFrequent(sortHand) {
    let max = 0;
    let mostFreq;
    let currentCount = 1;

    for (let i = 1; i < sortHand.length; i++) {
        if (sortHand[i] === sortHand[i - 1]) {
            currentCount++;
        } else {
            if (currentCount > max) {
                max = currentCount;
                mostFreq = sortHand[i - 1];
            }
            currentCount = 1;
        }
    }

    if (currentCount > max) {
        max = currentCount;
        mostFreq = sortHand[sortHand.length - 1];
    }

    return mostFreq;
}

function findWinner(pHand, oHand, pFreq, oFreq){
    if (pHand == oHand){
        if (pFreq > oFreq){
            return "player";
        }
        else if (pFreq == oFreq){
            return "tie";
        }
        else{
            return "opponent";
        }
    }

    if (pHand == "five" && oHand != "five"){
        return "player";
    } 
    else if (pHand != "five" && oHand == "five"){
        return "opponent";
    } 

    if (pHand == "four" && oHand != "four"){
        return "player";
    } 
    else if (pHand != "four" && oHand == "four"){
        return "opponent";
    } 

    if (pHand == "house" && oHand != "house"){
        return "player";
    } 
    else if (pHand != "house" && oHand == "house"){
        return "opponent";
    } 

    if (pHand == "three" && oHand != "three"){
        return "player";
    } 
    else if (pHand != "three" && oHand == "three"){
        return "opponent";
    } 

    if (pHand == "two" && oHand != "two"){
        return "player";
    } 
    else if (pHand != "two" && oHand == "two"){
        return "opponent";
    } 

    if (pHand == "pair" && oHand != "pair"){
        return "player";
    } 
    else if (pHand != "pair" && oHand == "pair"){
        return "opponent";
    } 
}