"use strict";
// Variabele voor de html select element
const select = document.getElementById("speelveld");

// variabele die is gkoppeld aan het element met betreffende id in de HTML"
const myField = document.getElementById("field");
const totalTurns = document.getElementById("totalCount");
const success = document.getElementById("successCount");

// Variabele voor de grootte van het speelveld
let boardClass = "";

// Array met kaarten vauit json bestand
let myCardArray;

//geselecteerde kaarten opslaan in array
let selectedCards = [];

//variabele voor te kijken of kaarten overeenkomen
let cardOne, cardTwo;

//variabele om aantal beuten bij te houden
let totalCount = 0;
let successCount = 0;

//variable voor de tijd bij te houden
let time = 0;

// Template voor de card objects
class Card {
  constructor(cardObject) {
    this.card1 = cardObject.card1;
    this.card2 = cardObject.card2;
    this.set = cardObject.set;
    this.sound = cardObject.sound;
  }
}

fetch("js/cards.json")
.then(response => response.json())
.then(data => {
   myCardArray = data.map(card => new Card(card));
  console.log(myCardArray);
});

// Functie om de kaarten willekeurig te schudden.
function fyShuffle(array) {
  let i = array.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [array[randIndex], array[i]] = [array[i], array[randIndex]];
  }
  return array;
}

function nextMove(){
  totalCount++;
  totalTurns.innerHTML = totalCount;
}

function keepScore() {
  successCount++;
  success.innerHTML = successCount;

}

// Selecteren van de grootte van het speelveld
function onSelectFieldSize(e) {
  // kaarten worden willekeurig neergelegd
  let customSizeArray = fyShuffle(myCardArray);
  // Instellen van de grootte van het speelveld afhankelijk van welke optie er gekozen is
  switch (e.target.value) {
    case "4":
      boardClass = "board4";
      customSizeArray = myCardArray.slice(0, 8)
      break;
    case "5":
      boardClass = "board5";
      customSizeArray = myCardArray.slice(0, 12)
      break;
    case "6":
      boardClass = "board6";
      customSizeArray = myCardArray.slice(0, 18)
      break;
    default:
      boardClass = "";
  }
  let DblCustomSizeArray = customSizeArray.concat(...customSizeArray); 
  // Kaarten nogmaals schudden
  DblCustomSizeArray = fyShuffle(DblCustomSizeArray)

  // call functie om de kaarten op het scherm te tonen
  populateField(DblCustomSizeArray);
}

// Nieuwe elementen creeren om images op het scherm te tonen
function populateField(cardSet) {
  // Bestaande velden verwijderen
  myField.innerHTML = "";
  // Loop door de array met kaarten en maak voor elke kaart een nieuw element aan.
  cardSet.forEach(card => {
    // creeer container elementen voor de kaarten
    let newTile = document.createElement("div");
    // Voeg een class aan het element toe voor styling
    newTile.setAttribute("class", boardClass);
    // creeer img elementen voor de kaarten
    let newCard = document.createElement("img");
    // variable die de url van de afbeeldingen als waarde heeft
    let imageURL = `img/${card.card1}.jpg`;
    // Voeg de image url van de afbeeldingen toe aan de src attribuut van de img elementen
    newCard.setAttribute("src", imageURL);
    // Naam van het dier toevoegen aan de img elementen
    newCard.setAttribute("name", card.card1);
    // Creer img elementen om de afbeeldingen af te dekken
    let newCover = document.createElement("img");
    // Voeg de image url van de afbeeldingen toe aan de src attribuut van de img elementen
    newCover.setAttribute("src", "img/cover.png");
    // Naam van het dier toevoegen aan de img elementen
    newCover.setAttribute("name", card.card1);
    // Voeg een class aan het element toe voor styling
    newCover.setAttribute("class", "covered");
    // Connect de img element aan de container elementen als child
    newTile.appendChild(newCard);
    newTile.appendChild(newCover);
    // Connect de container elementen aan het element met id 'myField' in de HTML als child
    myField.appendChild(newTile);
  })
}

// Verwijder cover als op kaart geklikt wordt
function onClickCard(e) {
  // check of classname gelijk is aan covered
  if (e.target.className === "covered") {
    // verander classname naar uncovered
    e.target.className = "uncovered";
    //Loggen in console welke naam er verschijnt als je op een kaart klikt
    console.log(e.target.parentNode.firstChild.getAttribute("name"));
  }

  if(selectedCards.length === 1) {
    myField.removeEventListener("click", onClickCard);
  }

  evaluateMatch(e.target.name);
}

function evaluateMatch(name){
  if(selectedCards.length === 0){
    selectedCards.push(name);
    cardOne = name;
    console.log(selectedCards);
    console.log(cardOne);
  } else if(selectedCards.length === 1){
    selectedCards.push(name);
    cardTwo = name;
    if(cardOne === cardTwo){
      console.log("match");
      setTimeout(function () {
        selectedCards.forEach(card => {
          let cardElement = document.getElementsByName(card);
          cardElement.forEach(element => {
            element.parentNode.style.display = "none";
          })
        })
        selectedCards = [];
        myField.addEventListener("click", onClickCard);
      }, 1000)
      keepScore()
    } else {
      console.log("no match");
      setTimeout(function(){
        let uncoveredCards = document.querySelectorAll(".uncovered");
        uncoveredCards.forEach(card => {
          card.className = "covered";
        })
        selectedCards = [];
        myField.addEventListener("click", onClickCard);
      }, 1000)
    }
    nextMove()
  }
}

// Click event maken voor de kaarten 
myField.addEventListener("click", onClickCard);

// Event listener voor de grootte van het speelveld
select.addEventListener("change", onSelectFieldSize);