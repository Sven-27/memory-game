"use strict";

// Template voor de card objects
class Card{
  constructor(card1, card2=card1, set=card1, sound=card1){
    this.card1 = card1;
    this.card2 = card2;
    this.set = set;
    this.sound = sound;
  }
}
// variabele die is gkoppeld aan het element met id 'myField' in de HTML"
const myField = document.getElementById("field");

// lijst met de namen van afbeeldingen
const myCardArray = ["duck", "kitten", "piglet", "puppy", "calf", "veal", "lamb", "rooster", "horse", "mouse", "dog", "cat", "goose", "goat", "sheep", "pig", "cow", "chick", "hen"];

// Het aantal kaarten verdubbelen zodat elke kaart 2 keer op het scherm komt. 
const myDblCardArray = myCardArray.concat(...myCardArray)
console.log(myDblCardArray)

// Functie om de kaarten willekeurig te schudden.
function fyShuffle(array){
let i = array.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [array[randIndex], array[i]] = [array[i], array[randIndex]];
  }
    return array;
}

// kaarten worden willekeurig neergelegd
fyShuffle(myDblCardArray);

// images returnen als class objecten
const myCardSet = myDblCardArray.map(card => new Card(card));

// Nieuwe elementen creeren om images op het scherm te tonen
function populateField() {
  // Loop door de array met kaarten en maak voor elke kaart een nieuw element aan.
  myCardSet.forEach(card => {
    // creeer container elementen voor de kaarten
    let newTile = document.createElement("div");
    // Voeg een class aan het element toe voor styling
    newTile.setAttribute("class", "board6");
    // creeer img elementen voor de kaarten
    let newCard = document.createElement("img");
    // variable die de url van de afbeeldingen als waarde heeft
    let imageURL = `img/${card.card1}.jpg`;
    console.log(imageURL);
    // Voeg de image url van de afbeeldingen toe aan de src attribuut van de img elementen
    newCard.setAttribute("src", imageURL);
    // Naam van het dier toevoegen aan de img elementen
    newCard.setAttribute("name", card.card1);
    // Connect de img element aan de container elementen als child
    newTile.appendChild(newCard);
    // Connect de container elementen aan het element met id 'myField' in de HTML als child
    myField.appendChild(newTile);
  })
}

// Testen om te kijken welke naam verschijnt als je op een kaart klikt
function onClickCard(e) {
  // Loggen in de console welke naam er verschijnt als je op een kaart klikt
  console.log(e.target.getAttribute("name"));
}


// Click event maken voor de kaarten 
myField.addEventListener("click", onClickCard);

// Event om de kaarten op het scherm te tonen na het laden van de pagina
document.addEventListener("DOMContentLoaded", populateField);

