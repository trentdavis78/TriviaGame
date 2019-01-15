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
var score = 0;
var categorySelected = 0;
var leaderScore0;
var leaderScore1;
var leaderScore2;
var hsPath;

    // onclick event to hide the splash screen, unhide game content and start the game
    $(".categoryBtn").on("click", function(e){
        $("#splash").addClass("hidden");
        $("#leaderboard").addClass("hidden");
        $("#gameContent").removeClass("hidden");   
        $("#"+e.target.id).removeClass("btn-theme");  
        $("#"+e.target.id).addClass("btn-secondary");  
        $("#"+e.target.id).attr("disabled", true);      
        category = e.target.value;
        categorySelected++;
        startRound();
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
    function startRound(){    
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
                score = score + 1; 
            } else {
                $("#answer-"+response).addClass("wrong");
                $("#answer-"+answer).addClass("correct unanswered");  
                losses++;               
            }
        } else {
            $("#answer-"+answer).addClass("correct unanswered");  
            unanswered++;
        }
              
        // console.log(wins, losses, unanswered, score);
        
        setTimeout(resetQuestion, 1500);
    }
    function resetQuestion() {
        $('.answers').children("span").removeClass("correct");
        $('.answers').children("span").removeClass("wrong");
        $('.answers').children("span").removeClass("unanswered");
        $('.answers').children("input[type=radio]").prop("checked", false);
        $('div.highlight').removeClass('highlight');        
        time = 4;        
        qNum++;
        if(categorySelected < 4){
            if(qNum < questionLength){            
                startRound();
            } else {
                endRound();
            }
        } else {
            endGame();
        }      
        
    }
    function endRound() {
       $("#gameContent").addClass("hidden");
       $("#endRound").removeClass("hidden");   
       $("#wins").text(wins);
       $("#losses").text(losses);
       $("#unanswered").text(unanswered);     
       $("#score").text(score);   
    }
    function endGame() {
        $("#gameContent").addClass("hidden");
        $("#endGame").removeClass("hidden");   
        $("#finalScore").text(score);   
        console.log(score);
        
        if(score > parseInt(leaderScore2)) {
            $("#newHighScore").removeClass("hidden"); 
            if(score > parseInt(leaderScore2) && score < parseInt(leaderScore1) ) {
                hsPath = "p2";
            } else if(score > parseInt(leaderScore1) && score < parseInt(leaderScore0)) {
                hsPath = "p1";
            } else {
                hsPath = "p0";
            }
        }
    }
    function restartGame() {
        time = 4;        
        qNum = 0;
        wins = 0;
        losses = 0;
        unanswered = 0;
        $("#splash").removeClass("hidden");
        $("#leaderboard").removeClass("hidden");
        $("#gameContent").addClass("hidden");   
        $("#endRound").addClass("hidden");   
        $("#newHighScore").addClass("hidden"); 
    }
    $("#nextCategory").on("click", function(){
        restartGame();
    });
    function startOver() {
        score = 0;        
        categorySelected = 0;        
        $("#endGame").addClass("hidden");  
        restartGame();
    }
    $("#startOver").on("click", function(){
        $(".categoryBtn").attr("disabled", false);
        $(".categoryBtn").removeClass("btn-secondary");
        $(".categoryBtn").addClass("btn-theme");       
        startOver();
    });
    function loadLeaderBoard(){         
        var leaderRef = firebase.database().ref().child("highscores");
        leaderRef.child("p0").child('name').on('value', snap => {
            $("#p0").text(snap.val());            
        }); 
        leaderRef.child("p0").child('score').on('value', snap => {
            $("#p0score").text(snap.val());  
            leaderScore0 = snap.val();            
        });    
        leaderRef.child("p1").child('name').on('value', snap => {
            $("#p1").text(snap.val());            
        }); 
        leaderRef.child("p1").child('score').on('value', snap => {
            $("#p1score").text(snap.val());  
            leaderScore1 = snap.val();  
        }); 
        leaderRef.child("p2").child('name').on('value', snap => {
            $("#p2").text(snap.val());            
        }); 
        leaderRef.child("p2").child('score').on('value', snap => {
            $("#p2score").text(snap.val());  
            leaderScore2 = snap.val();  
        });
    }
    loadLeaderBoard();

    $("#addHighScore").on('click', function(){
        var hsName = $("#newHighScoreName").val();        
        var hsObj = {
            name : hsName,
            score: score
        }
        var path = hsPath;
        updateHighScore(path,hsObj);
        $("#newHighScoreName").val("");
        $("#newHighScore").addClass("hidden"); 
        $("#leaderboard").removeClass("hidden");
    });
    function updateHighScore(path, data) {
        var leaderRef = firebase.database().ref().child("highscores");
        leaderRef.child(path).update(data);
    }
    
  });
  