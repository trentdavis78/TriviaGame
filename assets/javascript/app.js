$(document).ready(function() {   
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBmtHwFeSSpncbrLPf4wSKzEd7kFytw2aI",
    authDomain: "sample-project-21daa.firebaseapp.com",
    databaseURL: "https://sample-project-21daa.firebaseio.com",
    projectId: "sample-project-21daa",
    storageBucket: "sample-project-21daa.appspot.com",
    messagingSenderId: "1058522665094"
};
firebase.initializeApp(config);
//  game variables 
var intervalId;
var time = 3;
var clockRunning = false;
var qNum = 0;
var wins = 0;
var losses = 0;
var unanswered = 0;
var answer;
var questionLength = 0;
var category = "triviaQA-0";
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
        // set questionLength variable
        firebase.database().ref().child(category).on('value', function(snap){
            questionLength = snap.numChildren();                    
        });
        askQuestion();
        $("#timer").text(time);
        startTimer();
    }
    function askQuestion() {

                // set reference objects
                var dbRefObject = firebase.database().ref().child(category).child('q'+qNum);
                var questionRef = dbRefObject.child('question');
                var choicesRef = dbRefObject.child('choices');
                var answerRef = dbRefObject.child('answer');                
                // write answers to the choice radio button spans
                choicesRef.on('child_added', snap => {
                    $("#answer-"+snap.key).text(snap.val());
                });
                // write the question to the jumbotron
                questionRef.on('value', snap => $("#question").text(snap.val()));
                // set the answer to the answer variable 
                answerRef.on('value', function(snap){
                    answer = snap.val();           
                
        });
        
    }
    function checkResponse(){
        var response = $("input[name='answers']:checked").val();
        if(response){
            if(response == answer ) {
                $("#answer-"+response).addClass("correct");
                wins++;            
            } else {
                $("#answer-"+response).addClass("wrong");
                $("#answer-"+answer).addClass("correct");  
                losses++;               
            }
        } else {
            $("#answer-"+answer).addClass("correct");  
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
                
        if(qNum < questionLength){            
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