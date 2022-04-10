/* API KEY */
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'wordle-creator-tools.p.rapidapi.com',
        'X-RapidAPI-Key': 'c5c5487ec6mshfa9eea1774ea84fp1b6491jsn97d7ea39604c'
    }
};
/* GLOBAL VARIABLE */
const msg = document.getElementById("msg");
const restartBtn = document.getElementById("restartBtn");
const gameBoard = document.getElementById("game-board");
const debug = document.getElementById("debugSwitch");

window.onload = () =>{
    ;

    if(restartBtn.style.visibility = "hidden") playWorlde();
    restartBtn.addEventListener("click", ()=> {
        clearPreviousGame();
        playWorlde();
    });
}

/* CLASSES */
class Letter{
    value;
    status;

    constructor(value){
        this.value = value;
        this.display = () => `<div class="letterBox ${this.status}">${this.value}</div>`;
    }
}

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
                    msg.innerHTML = "";
                    this.isValid = true;
                }else{
                    // inform user that entry is not valid word
                    msg.innerHTML = "The word entered was not valid!";
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
    debugMode = false;

    constructor(){}

    createGameBoard(){
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

        // create input conatiner
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
        submit.addEventListener("click", () => {
            (input.value.length < 5) ? 
                msg.innerHTML = "Word needs to have 5 letters" :
                this.submitGuess(input);

            input.value = "";
        });
        inputContainer.appendChild(submit);

        gameBoard.appendChild(inputContainer);

        // create used letters div
        let usedLetters = document.createElement("div");
        usedLetters.setAttribute("id", "used-letters");
        gameBoard.appendChild(usedLetters);

        // hide restart button
        restartBtn.style.visibility = "hidden";

        //add instructions msg
        msg.innerHTML = "<h2>Welcome to Wordle!</h2><div id='instructions'><p>Green = letter is in correct spot. </p><p>Yellow = letter is in the wrong spot. </p><p>Grey = letter is not in the word</p></div>"
    }

    play(){
       if(this.isGameOver == true || this.attempts > 6){
           // display restart button
           let restart = document.getElementById("restartBtn");
           restart.style.visibility = "visible";
           
           // display corresponding message
           msg.innerHTML = (this.isGameOver) ? 
            "Hooray! You solved the wordle! Press Restart to play again!" :
            "Game Over! Ran out of attempts";
        }
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

                // Set up debugger
                let debugElement = document.getElementById("game-mode");
                let debugWord = document.createElement("p");
                debugWord.setAttribute("id", "debugAnswerWord");
                debugWord.innerHTML = `: ${response.word}`;
                debugElement.appendChild(debugWord);
            })
            .catch(err => console.error(err));
    }

    submitGuess(input){
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

                document.getElementById("used-letters").innerHTML = `Used Letters: ${this.usedLetters.toString()}`

                // attempt guess count
                this.attempts++;
                
                // return if game is over
                this.play();
            }
        })
        .catch(err => console.log(err));
    }

    compareWords(guess, answer){

        let guessArray = guess.letters;
        let answerArray = answer.letters;

        if(guess.toString() == answer.toString()){
            // set all letters to greeen
            guess.letters.forEach((letter) => letter.status = "match");

            // end game
            this.isGameOver = true;

        }else{
            // check each letter status
            for(let i=0; i<5; i++){
                if(guessArray[i].value != answerArray[i].value){
                    let currLetter = guessArray[i];
                    let isLetterInAnswerWord = answer.toString().includes(currLetter.value);
                    
                    currLetter.status = (isLetterInAnswerWord) ? "wrongSpot" : "invalid";

                    if(!isLetterInAnswerWord && !this.usedLetters.includes(currLetter.value)){
                        this.usedLetters.push(currLetter.value);
                    }
                }else{
                    guessArray[i].status = "match";
                }
            }
        }
    }

    debug(){
        this.debugSwitch = !this.debugSwitch
        document.getElementById("debugAnswerWord").style.visibility = (this.debugSwitch) ? "visible" : "hidden";
    }
}

/* UTILITY FUNCTIONS */
function playWorlde(){
    var game = new Game();
    game.generateRandomWord();
    game.createGameBoard();
    game.play();

    debug.addEventListener("click", game.debug)
}

function clearPreviousGame(){
    gameBoard.innerHTML = "";
    msg.innerHTML = ""
}

function  convertStringToLetterArray(stringArray){
    return stringArray.map((item)=> new Letter(item));
}