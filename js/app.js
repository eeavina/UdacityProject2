/*
 * Create a list that holds all of your cards
 */

var allCards = document.querySelectorAll(".card");
var classListArray = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Eventually not used but replaced with the Durstenfeld shuffle algorithm

// Shuffle algorithm is used further below

// Combining the 2nd and 3rd steps into one step further below: shuffling the class list of the cards

// Shuffle function from http://stackoverflow.com/a/2450976
//function shuffle(array) {
//    var currentIndex = array.length, temporaryValue, randomIndex;

//    while (currentIndex !== 0) {
//        randomIndex = Math.floor(Math.random() * currentIndex);
//        currentIndex -= 1;
//        temporaryValue = array[currentIndex];
//        array[currentIndex] = array[randomIndex];
//        array[randomIndex] = temporaryValue;
//    }

//    return array;
//}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * Function from http://stackoverflow.com/a/2450976
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var cardList = [];
var cardChildNodes = [];
var moves = 0;
var moveCounter = document.querySelector(".moves");
var numberOfMoves = document.querySelector("#numberOfMoves");
var stars = document.querySelectorAll(".fa-star");
var visibleStars = 0;
var hiddenStars = 0;
var repeatGame = document.querySelector(".restart");
var playAgain = document.querySelector("#playAgain");
var tempTimer = document.getElementsByTagName("time")[0], seconds = 0, minutes = 0, hours = 0, t;

// Add event listeners to each card
allCards.forEach(function (card) {

    card.addEventListener('click', function (e) {
        if (moves == 0) {
            startTimer();
        }
        if (!card.classList.contains("open", "show")) {
            openCard(card);
            addToCardList(cardList, cardChildNodes, card);
            addMoves(moves);
            decreaseNumberOfStars();

            if (cardList.length > 1) {
                checkIfMatch(cardList, cardChildNodes);
                checkIfAllCardsMatched();
                // Empty lists
                cardList = [];
                cardChildNodes = [];
            };
        }
    });
});

// Add an event listener to the repeatGame class
repeatGame.addEventListener('click', function (e) {
    closeAllCards();
    resetStars();
    resetMoveCounter();
    classListArray = [];
    fillArray(classListArray, allCards);
    // Shuffle the current order of the class lists instead of creating a new set of cards
    shuffleArray(classListArray);
    replaceCards();
    // Empty lists
    cardList = [];
    cardChildNodes = [];
    clearTimeout(t);
    tempTimer.textContent = "00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
});

// Add an event listener to the playAgain id
playAgain.addEventListener('click', function (e) {
    $("#myModal").modal('hide');
    closeAllCards();
    resetStars();
    resetMoveCounter();
    classListArray = [];
    fillArray(classListArray, allCards);
    // Shuffle the current order of the class lists instead of creating a new set of cards
    shuffleArray(classListArray);
    replaceCards();
    // Empty listst
    cardList = [];
    cardChildNodes = [];
    tempTimer.textContent = "00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
});

// Open the selected card if it is not yet open
function openCard(card) {
    card.classList.add("open", "show");
};

// Add the selected card to the card list
function addToCardList(cardList, cardChildNodes, card) {
    cardList.push(card);
    cardChildNodes.push(card.childNodes);
};

// Check if the selected card has a match with the previously selected one if any
function checkIfMatch(cardList, cardChildNodes) {
    // Get the index of the card and fill symbols with the last class item
    var symbolOne = cardChildNodes[0][1].classList[1];
    var symbolTwo = cardChildNodes[1][1].classList[1];

    if (symbolOne == symbolTwo) {
        remainOpen(cardList, cardChildNodes);
    } else {
        closeInOneSec(cardList);
    }
};

// Keep the card open if it is a match
function remainOpen(cardList, cardChildNodes) {
    //console.log('Hurray! Got it!');
    cardList[0].classList.add("match");
    cardList[1].classList.add("match");
    cardList = [];
    cardChildNodes = [];
};

// Close the cards if it is not a match with time delay of one second
function closeInOneSec(cardList) {
    setTimeout(function () {
        //console.log("Not a match");
        cardList.forEach(function (c) {
            c.classList.remove("open", "show");
        })
    }, 1000);
};

// Increase the number of moves
function addMoves() {
    moves++;
    moveCounter.innerHTML = moves;
    numberOfMoves.innerHTML = moves;
};

// Decrease the number of stars
function decreaseNumberOfStars() {
    if (moves % 17 == 0) {
        for (var i = 0; i < stars.length; i++) {
            if (!stars[i].classList.contains("hide")) {
                stars[i].classList.add("hide");
                break;
            }
        }
    }
};

// Check if all cards are open and show modal
function checkIfAllCardsMatched() {
    var numberOfMatchCards = 0;
    var matchedCards = document.querySelectorAll(".match")
    matchedCards.forEach(function (card) {
        numberOfMatchCards++;
    });
    if (numberOfMatchCards == 16) {
        getPopupWindow();
    }
};

// Show modal
function getPopupWindow() {
    countStars();
    clearTimeout(t);
    getTimeSpent();
    $("#myModal").modal();
};

// Count the visible stars
function countStars() {
    hiddenStars = 0;
    for (var i = 0; i < stars.length; i++) {
        if (stars[i].classList.contains("hide") && (hiddenStars < 3)) {
            hiddenStars++;
        }
    }
    visibleStars = stars.length - hiddenStars;
    document.getElementById("visibleStars").innerHTML = visibleStars;
};

// Flip all cards over to the starting point
function closeAllCards() {
    for (var i = 0; i < allCards.length; i++) {
        if (allCards[i].classList.contains("open")) {
            allCards[i].classList.remove("open");
        }
        if (allCards[i].classList.contains("show")) {
            allCards[i].classList.remove("show");
        }
        if (allCards[i].classList.contains("match")) {
            allCards[i].classList.remove("match");
        }
    }
};

// Show all stars
function resetStars() {
    for (var i = 0; i < stars.length; i++) {
        if (stars[i].classList.contains("hide")) {
            stars[i].classList.remove("hide");
        }
    }
};

// Set moves to zero
function resetMoveCounter() {
    moveCounter.innerHTML = 0;
    numberOfMoves.innerHTML = 0;
    moves = 0;
};

// Mix cards by mixing the class list
function replaceCards() {
    for (var i = 0; i < allCards.length; i++) {
        allCards[i].firstElementChild.classList.value = classListArray[i];
    }
};

// Get the current class list
function fillArray(classListArray, allCards) {
    for (var i = 0; i < allCards.length; i++) {
        var item = allCards[i].firstElementChild.classList.value;
        classListArray.push(item);
    }
};

// Start the timer
// Timer function from https://codepad.co/snippet/YMYUDYgr
function startTimer() {
    function add() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }

        tempTimer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

        timer();
    };

    function timer() {
        t = setTimeout(add, 1000);
    };

    timer();
};

// Indicate the time spent in the modal
function getTimeSpent() {
    document.getElementById("finalTime").innerHTML = tempTimer.textContent;
};