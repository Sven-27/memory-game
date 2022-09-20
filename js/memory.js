"use strict";

class Card{
  constructor(card1, card2=card1, set=card1, sound=card1){
    this.card1 = card1;
    this.card2 = card2;
    this.set = set;
    this.sound = sound;
  }
}
// maak een const myField en koppel deze aan de div met id="field"
const myField = document.getElementById("field");

// de volgende regel krijg je vast cadeau:
const myCardArray = ["duck", "kitten", "piglet", "puppy", "calf", "veal", "lamb", "rooster", "horse", "mouse", "dog", "cat", "goose", "goat", "sheep", "pig", "cow", "chick", "hen"];
const myDblCardArray = myCardArray.concat(...myCardArray)
// console.log(myDblCardArray)

// document.onload = populateField();

function fyShuffle(array){
let i = array.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [array[randIndex], array[i]] = [array[i], array[randIndex]];
  }
    return array;
}

fyShuffle(myDblCardArray);

const myCardSet = myDblCardArray.map(card => new Card(card));

// schrijf hier de nieuwe functie populateField()
function populateField() {
  // maak binnen deze nieuwe functie een for loop waarin over de array myCardSet geïtereerd wordt (Mag ook met forEach, dat is zelfs beter).
  myCardSet.forEach(card => {
    // De volgende statements komen allemaal in de loop:
    // laat met de method document.createElement() een nieuw div-element aanmaken en stop die in een nieuwe let 'newTile'
    let newTile = document.createElement("div");
    newTile.setAttribute("class", "board6");
    // laat  met de method document.createElement() een nieuw img-element aanmaken en stop die in een nieuwe let 'newCard'
    let newCard = document.createElement("img");
    // creëer een nieuwe let 'imageURL' en laat via concatination een relatieve verwijzing naar de afbeelding uit het array waar over geïtereerd wordt die de uiteindelijke vorm moet krijgen "url(img/naamDier.jpg)" waarbij naamDier in dit geval steeds een andere naam is uit het array.
    let imageURL = `img/${card.card1}.jpg`;
    console.log(imageURL);
    // Ken deze imageURL via setAttribute() toe aan het src attribute van let 'newCard'.
    newCard.setAttribute("src", imageURL);
    // Ken ook de naam van het dier via setAttribute() toe aan de name attribute van de let 'newCard';
    newCard.setAttribute("name", card.card1);
    // Ken via de appendChild() method het element 'newCard' toe aan 'newTile'
    newTile.appendChild(newCard);
    // Ken via de appendChild() method het element 'newTile' toe aan 'myField'
    myField.appendChild(newTile);
  })
}


// schrijf hier de functie onClickCard(e)

function onClickCard(e) {
  // Zorg er voor dat als deze functie wordt uitgevoerd, m.b.v. de method getAttribute() in het console de naam van het aangeklikte dier getoond wordt.
  // Hint, je moet hierbij gebruik maken van de verwijzing e.target omdat je de naam van het element wilt weten waar op geklikt is, dus die het 'click' event verstuurd heeft.
  console.log(e.target.getAttribute("name"));
}


// Geef myField een event listener die de functie onClickCard aanroept als er op geklikt wordt
myField.addEventListener("click", onClickCard);

// geef het document een event listener die bij het laden van de pagina de functie populateField aanroept
document.addEventListener("DOMContentLoaded", populateField);

