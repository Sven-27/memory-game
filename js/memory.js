"use strict";

// Variabele voor de html select element
const select = document.getElementById("speelveld");

// variabele die is gkoppeld aan het element met betreffende id in de HTML"
const myField = document.getElementById("field");
const totalTurns = document.getElementById("totalCount");
const success = document.getElementById("successCount");
const resetButton = document.getElementById("reset");
const time = document.getElementById("time");

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
let minutes = 0;
let seconds = 0;
let timer;

// Naam invoeren
const firstName = prompt("Wat is je naam?");

// Template voor de card objects
class Card {
  constructor(cardObject) {
    this.card1 = cardObject.card1;
    this.card2 = cardObject.card2;
    this.set = cardObject.set;
    this.sound = cardObject.sound;
  }
}

// API call om de kaarten van het json bestand te halen
fetch("js/cards.json")
.then(response => response.json())
.then(data => {
   myCardArray = data.map(card => new Card(card));
  console.log(myCardArray);
});

// popup om naam in te vullen
function enterName(){
  document.getElementById("welkom").innerHTML = `Welkom ${firstName}!`;
}



// Functie om de kaarten willekeurig te schudden.
function fyShuffle(array) {
  let i = array.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [array[randIndex], array[i]] = [array[i], array[randIndex]];
  }
  return array;
}

// houdt bij hoeveel beurten er in totaal zijn
function nextMove(){
  totalCount++;
  totalTurns.innerHTML = totalCount;
}

// houdt bij hoeveel succesvolle beurten er zijn
function keepScore() {
  successCount++;
  success.innerHTML = successCount;
}

// Start de tijd
function startTimer(){
  timer = setInterval(displayTimer, 1000);
}

// Laat de tijd in het scherm zien
function displayTimer(){
  if(seconds < 59){
    seconds++;
  } else {
    seconds = 0;
    minutes++;
  }
  
  const sec = seconds < 10 ? `0${seconds}` : seconds;
  const min = minutes < 10 ? `0${minutes}` : minutes;
  
  time.innerHTML = `${min}:${sec}`;
}

// Stopt de tijd
function stopTimer(){
  clearInterval(timer);
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
  
  //callback om de tijd te starten
  startTimer()

  if(boardClass){
    select.removeEventListener("change", onSelectFieldSize);
    select.disabled = true;
  }
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
  
  // Als 2 kaarten zijn geselecteerd verwijder de klik event listener
  if(selectedCards.length === 1) {
    myField.removeEventListener("click", onClickCard);
  }
  console.log(e.target.name)
  // call functie om de kaarten te vergelijken
  evaluateMatch(e.target.name);

  // call functie om de geluiden af te spelen
  // playSound(e.target.name);

  // Stopt de timer als alle kaarten zijn geraden
  if (boardClass = "board4" && successCount === 8) {
    stopTimer();
    saveData();
  }
  if (boardClass = "board5" && successCount === 12) {
    stopTimer();
    saveData();
  }
  if (boardClass = "board6" && successCount === 18) {
    stopTimer();
    saveData();
  }

}

function playSound(name){
  const sound = new Audio();
  sound.src = `snd/${name}.wav`;
  sound.play();
}

// functie om te kijken of de kaarten matchen
function evaluateMatch(name){
  // voeg de naam van de kaart toe aan de array
  if(selectedCards.length === 0){
    selectedCards.push(name);
    cardOne = name;
    // voeg 2de naam toe aan de array
  } else if(selectedCards.length === 1){
    selectedCards.push(name);
    cardTwo = name;
    // vergelijk de namen van de kaarten
    //Als de kaarten matchen dan worden ze verwijderd
    if(cardOne === cardTwo){
      //wacht x aantal seconden met verwijderen
      setTimeout(function () {
        selectedCards.forEach(card => {
          let cardElement = document.getElementsByName(card);
          cardElement.forEach(element => {
            element.parentNode.remove();
          })
        })
        // reset de array
        selectedCards = [];
        //Voeg de klik weer toe aan het veld
        myField.addEventListener("click", onClickCard);
      }, 1000)
      //callback functie om de succesvolle beurten bij te houden
      keepScore()
    }
    // Als de kaarten niet matchen dan worden ze weer afgedekt
    else {
      //wacht x aantal seconden met afdekken
      setTimeout(function(){
        let uncoveredCards = document.querySelectorAll(".uncovered");
        uncoveredCards.forEach(card => {
          card.className = "covered";
        })
        // reset de array
        selectedCards = [];
        //Voeg de klik weer toe aan het veld
        myField.addEventListener("click", onClickCard);
      }, 1000)
    }
    //callback functie om de beurten bij te houden
    nextMove()
  }
}

// Reset de game
function resetGame(){
  myField.innerHTML = "";
  totalCount = 0;
  successCount = 0;
  minutes = 0;
  seconds = 0;
  totalTurns.innerHTML = "0";
  success.innerHTML = "0";
  time.innerHTML = "00:00";
  stopTimer();
  select.value = "veld";
  select.addEventListener("change", onSelectFieldSize);
  boardClass = "";
  select.disabled = false;
}

function saveData(){
  let name = firstName;
  let turns = totalTurns.innerHTML;
  let totalTime = time.innerHTML;
  let successTurns = success.innerHTML;
  let board = select.value;
  let data = {
    name: name,
    turns: turns,
    success: successTurns,
    time: totalTime,
    board: board
  }
  console.log(data);
  let dataString = JSON.stringify(data);
  localStorage.setItem("data", dataString);
}

// Click event maken voor de kaarten 
myField.addEventListener("click", onClickCard);

// Event listener voor de grootte van het speelveld
select.addEventListener("change", onSelectFieldSize);

// Event listener voor de reset button
resetButton.addEventListener("click", resetGame);

// Event listener voor popup om naam in te vullen
document.addEventListener("DOMContentLoaded", enterName);

