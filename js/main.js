window.onload = function() {
    const buttonOp = document.querySelectorAll(".option");

    var questionCorrect = 0;

    function game() {

        const img = document.getElementById("flag");
        const h3 = document.getElementById("flagNum");
        const number = document.getElementById("number");

        
        const optionTxt = document.getElementsByClassName("optionTxt");
        const signal = document.getElementById("signal");

        const sndCorrect = new Audio("sounds/correct.mp3");
        const sndIncorr = new Audio("sounds/incorrect.mp3");
        const sndEnd = new Audio("sounds/win.mp3");

        var correct;
        var correct_index;
        var questionCount = 0;
        

        signal.style.opacity = 0;

        function nextQuestion(){
            let url = 'https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json';
            let zahtjev = new XMLHttpRequest();
            zahtjev.open('GET', url);

            zahtjev.responseType = 'json';
            zahtjev.send();

            zahtjev.onload = function() {
                var drzave = zahtjev.response;

                var countries = [];
                

                tick();

                function randomiser(){
                    do {
                        let generated = Math.floor(Math.random() * 249);
                        if (countries.includes(generated)){
                            continue;
                        }
                        else {
                            countries.push(generated)
                        }
                    } while(countries.length<4);
                    correct_index = Math.floor(Math.random() * 4);
                    correct = countries[correct_index];
                }

                randomiser();
                

                img.src = "https://flagcdn.com/256x192/" + String(drzave[correct].Code).toLowerCase() + ".png"

                optionTxt[0].textContent = String(drzave[countries[0]].Name).split(',')[0];
                optionTxt[1].textContent = String(drzave[countries[1]].Name).split(',')[0];;
                optionTxt[2].textContent = String(drzave[countries[2]].Name).split(',')[0];;
                optionTxt[3].textContent = String(drzave[countries[3]].Name).split(',')[0];;

                questionCount++;
                number.textContent = questionCount;

            }
        }

        var seconds = 59; 
        var tens = 99; 
        var appendSeconds = document.getElementById("seconds");
        var Interval;
            
        clearInterval(Interval);
        Interval = setInterval(tick, 10);
        
        function tick() {
            tens--; 

            if (tens <= 0){
                seconds--;
                tens = 99;
                appendSeconds.innerHTML = seconds;

                if (seconds <= 0){
                    clearInterval(Interval);
                    endGame();
                    sndEnd.play();
                }
            }

            if (signal.style.opacity > 0){
                signal.style.opacity -= 0.01;
            }

        }

        nextQuestion();

        buttonOp.forEach(item => {
            item.addEventListener("click", event => {
                if (item.value == correct_index){
                    console.log("correct");
                    questionCorrect++;
                    setSignal(true);
                    sndCorrect.play();
                    if (seconds >= 57){
                        seconds = 59;
                        tens = 99;
                    } else {
                        seconds = seconds + 3;
                    }
                } else{
                    console.log("incorrect")
                    seconds = seconds - 2;
                    setSignal(false);
                    sndIncorr.play();
                }
                nextQuestion();
            })
        })

        function setSignal(bool){
            if (bool == true){
                signal.textContent = "+3";
                signal.style.opacity = 1;
                signal.style.color = "rgb(1, 255, 1)";
            } else if(bool == false) {
                signal.textContent = "-2";
                signal.style.opacity = 1;
                signal.style.color = "red";
            }
        }
    }

    game();

    function endGame() {

        const resultBox = document.getElementById("container-top");
        resultBox.innerHTML = "";

        const end = document.createElement("h3");
        end.textContent = "Out of time!";
        resultBox.appendChild(end);

        const scoreTxt = document.createElement("p")
        scoreTxt.id = "score";
        scoreTxt.textContent = "Your score: " + questionCorrect;
        resultBox.appendChild(scoreTxt);

        const replayButton = document.createElement("button");
        replayButton.id = "replay";
        replayButton.onclick = reload;
        const replayImage = document.createElement("img");
        replayImage.src = "imgs/replay.png";
        replayImage.id = "imgRep";
        replayButton.appendChild(replayImage);
        resultBox.appendChild(replayButton);

        buttonOp.forEach(button => {
            button.style.display = "none";
        })
    }

    function reload(){
        window.location.reload()
    }
}
