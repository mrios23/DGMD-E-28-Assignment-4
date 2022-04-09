window.onload = () =>{

    var game = new Game();
    game.generateRandomWord();
    game.createGameBoard();

}

class Letter{
    value;
    status;

    constructor(value){
        this.value = value;
        this.display = () => `<div class="letterBox ${this.status}">${this.value}</div>`;
    }
}
/* API KEY */
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'wordle-creator-tools.p.rapidapi.com',
        'X-RapidAPI-Key': 'c5c5487ec6mshfa9eea1774ea84fp1b6491jsn97d7ea39604c'
    }
};

class Word{
    letters = [];
    isValid;

    constructor(letters){
        this.letters = letters;
    }

    display(){
        let string = "";

        for(let i=0; i<this.letters.length; i++){
            string += this.letters[i].display();
        }
        return string;
    }

    toString(){
        let string = "";
        this.letters.forEach(letter => string+= letter.value);

        return string;
    }

    /*Check if a word is a real dictionary word 
    (Takes a query parameter called word which denotes the word to check) */    
    async checkIsValid(){
        await fetch(`https://wordle-creator-tools.p.rapidapi.com/check-word?word=${this.toString()}`, options)
            .then(response => response.json())
            .then(response => {
                if(response.result === true){
                    console.log("The word entered was valid");
                    this.isValid = true;
                }else{
                    // inform user that entry is not valid word
                    console.log("The word entered was not valid");
                }
            })
            .catch(err => console.error(err));        
    }
}

class Game{
    attempts = 1;
    randomWord = "";
    usedLetters =[]
    isGameOver = false;

    letterTrash = document.getElementById("used-letters");

    constructor(){}

    createGameBoard(){
        const gameBoard = document.getElementById("game-board");

        const tiles = document.createElement("div");
        tiles.setAttribute("id", "gameTiles");
    
        for(let i=0; i<6; i++){
            // create word row div
            let row = document.createElement("div");
            row.setAttribute("class", "word");
            row.setAttribute("id", `attempt_${i+1}`);
    
            // create 5 "empty" letters per row
            let letters = [];
            for(let j=0; j<5; j++){
                let placeHolderLetter = new Letter("");
                letters.push(placeHolderLetter);
            }
    
            let word = new Word(letters);
            row.innerHTML = word.display();
            tiles.appendChild(row);
        }
        // add tiles to game board
        gameBoard.appendChild(tiles);

        const inputContainer = document.createElement("div");
        inputContainer.setAttribute("id", "inputContainer");
    
        // create input box
        var input = document.createElement("input");
        input.setAttribute("id", "guess");
        input.setAttribute("type", "text");
        input.setAttribute("maxlength", "5");
        inputContainer.appendChild(input);
    
        // create submit btn
        let submit = document.createElement("button");
        submit.setAttribute("id", "submitBtn");
        submit.innerHTML = "Submit";
        inputContainer.appendChild(submit);

        submit.addEventListener("click", () => {
            this.submitGuess(input);
            input.value = "";
        }); 

        gameBoard.appendChild(inputContainer);
    }

    generateRandomWord(){        
        fetch('https://wordle-creator-tools.p.rapidapi.com/new-word?wordlength=5', options)
            .then(response => response.json())
            .then(response => {
                console.log("Random generated word: " + response.word)
                // may want to check its empty
                let input = convertStringToLetterArray(response.word.split(''));
                let answer = new Word(input);
                this.randomWord = answer;
            })
            .catch(err => console.error(err));
    }

    submitGuess(input){
        if(input.value.length < 5){
            // inform user that they need to enter text with more than 5 characters
            console.log("Need at least 5 letters for each attempt");
            return false;
    
        }else{
            console.log("You inputted: " + input.value);    // DEBUG
    
            let guess = convertStringToLetterArray(input.value.split(''));
            let guessWord = new Word(guess);
    
            guessWord.checkIsValid()
            .then(()=>{
                    if(guessWord.isValid == true){
                        //compare words
                        this.compareWords(guessWord, this.randomWord);

                        // display guess
                        let currAttemptRow = document.getElementById("attempt_" + this.attempts);
                        currAttemptRow.innerHTML = guessWord.display();

                        this.letterTrash.innerHTML += this.usedLetters.toString();

                        // attempt guess count
                        this.attempts++;
                    }
                }
            )
            .catch(err => console.log(err));
        }
    }

    compareWords(guess, answer){

        let guessArray = guess.letters;
        let answerArray = answer.letters;

        if(guess.toString() == answer.toString()){
            console.log("horray you solved the wordle!");
            // end game
            this.isGameOver = true;

            // set all letters to greeen
            guess.letters.forEach((letter) => letter.status = "match");
            
            // display winning message!

        }else{
            // check each letter status
            for(let i=0; i<5; i++){
                if(guessArray[i].value != answerArray[i].value){
                    let currLetter = guessArray[i];

                    let isLetterInAnswerWord = answer.toString().includes(currLetter.value);
                    currLetter.status = (isLetterInAnswerWord) ? "wrongSpot" : "invalid";

                    if(!isLetterInAnswerWord){
                        this.usedLetters.push(currLetter.value);
                    }

                }else{
                    guessArray[i].status = "match";
                }
            }
        }
    }
}

function  convertStringToLetterArray(stringArray){
    return stringArray.map((item)=> new Letter(item));
}