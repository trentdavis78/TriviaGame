$(document).ready(function() {   
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyARgHGjUoNIXG9BTX096kVLoT5Md_HmKQo",
    authDomain: "trivia-game-ec53a.firebaseapp.com",
    databaseURL: "https://trivia-game-ec53a.firebaseio.com",
    projectId: "trivia-game-ec53a",
    storageBucket: "",
    messagingSenderId: "632296056982"
  };
  firebase.initializeApp(config);
//  game variables 
var intervalId;
var time = 4;
var clockRunning = false;
var qNum = 0;
var wins = 0;
var losses = 0;
var unanswered = 0;
var answer;
var questionLength = 0;
var category;
var categorySelected = 0;

    // onclick event to hide the splash screen, unhide game content and start the game
    $(".categoryBtn").on("click", function(e){
        $("#splash").addClass("hidden");
        $("#gameContent").removeClass("hidden");   
        $("#"+e.target.id).removeClass("btn-primary");  
        $("#"+e.target.id).addClass("btn-secondary");  
        $("#"+e.target.id).attr("disabled", true);      
        category = e.target.value;
        categorySelected++;
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
        time = 4;        
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
        time = 4;        
        qNum = 0;
        wins = 0;
        losses = 0;
        unanswered = 0;
        $("#splash").removeClass("hidden");
        $("#gameContent").addClass("hidden");   
        $("#endGame").addClass("hidden");   
    }
    $("#playAgain").on("click", function(){
        restartGame();
    });

  });