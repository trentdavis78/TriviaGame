$(document).ready(function() {   
//  game variables 
var intervalId;
var time = 3;
var clockRunning = false;
var qNum = 0;
var wins = 0;
var losses = 0;
var unanswered = 0;
var triviaQA = 
[
  {
    question: "How long does it take to code a trivia game with HTML, CSS, and Javascript?",
    choices: ["One hour", "Ten hours", "Before 12pm on Saturday", "It can never be finished"],
    answer: 2
  },
  
  {
    question: "What is the capital of United States?",
    choices: ["California", "Washington D.C.", "Miami", "Florida"],
    answer: 1
  }
  
  
];
    // onclick event to hide the splash screen, unhide game content and start the game
    $("#start").on("click", function(){
        $("#splash").addClass("hidden");
        $("#gameContent").removeClass("hidden");   
        startGame();
    });
   
    //change bg color when radio is selected
    $('#answerRow input:radio').change(function() {
      // Only remove the class in the specific div that contains the radio
      $('div.highlight').removeClass('highlight');
      $(this).closest('.answers').addClass('highlight');
    });
    // allow containing div to check radio button and change highlight class --> for mobile functionality
    $('.answers').click( function(){
        $('.answers').removeClass('highlight');
        $('.answers').children("input[type=radio]").prop("checked", false);
        $(this).addClass('highlight');
        $(this).children("input[type=radio]").prop("checked", true);
    });

    function startTimer(){
        if (!clockRunning) {
            clockRunning = true;
            intervalId = setInterval(count, 1000);
            }
    }
    function stopTimer(){
        clearInterval(intervalId);
        clockRunning = false;
    }
    function count(){
        time--;
        $("#timer").text(time);
        if(time == 0){
            stopTimer(); 
            checkResponse();          
        }
    }
    function startGame(){       
        askQuestion();
        $("#timer").text(time);
        startTimer();
    }
    function askQuestion() {
        $("#question").text(triviaQA[qNum].question);            
        for(i=0; i < 5; i++){
            var options = triviaQA[qNum].choices;
             $("#answer-" + i).text(options[i]);            
        }
        
    }
    function checkResponse(){
        var response = $("input[name='answers']:checked").val();
        if(response){
            if(response == triviaQA[qNum].answer) {
                $("#answer-"+response).addClass("correct");
                wins++;            
            } else {
                $("#answer-"+response).addClass("wrong");
                $("#answer-"+triviaQA[qNum].answer).addClass("correct");  
                losses++;               
            }
        } else {
            $("#answer-"+triviaQA[qNum].answer).addClass("correct");  
            unanswered++;
        }
              
        console.log(wins, losses, unanswered);
        
        setTimeout(resetQuestion, 1500);
    }
    function resetQuestion() {
        $('.answers').children("span").removeClass("correct");
        $('.answers').children("span").removeClass("wrong");
        $('.answers').children("input[type=radio]").prop("checked", false);
        $('div.highlight').removeClass('highlight');        
        time = 5;        
        qNum++;
                
        if(qNum < triviaQA.length){            
            startGame();
        } else {
            endGame();
        }
    }
    function endGame() {
       $("#gameContent").addClass("hidden");
       $("#endGame").removeClass("hidden");   
       $("#wins").text(wins);
       $("#losses").text(losses);
       $("#unanswered").text(unanswered);     
    }
    function restartGame() {
        time = 5;        
        qNum = 0;
        wins = 0;
        losses = 0;
        unanswered = 0;
        $("#gameContent").removeClass("hidden");
        $("#endGame").addClass("hidden"); 
        startGame();
    }
    $("#playAgain").on("click", function(){
        restartGame();
    });
  });