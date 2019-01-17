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
var origTime = 4;
var time;
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
var streak = 0;
// high score variables 
var leaderScore0;
var leaderScore1;
var leaderScore2;
var leaderName0;
var leaderName1;
var leaderName2;
var scoreArr = [];
// hide the floating score animation before the game starts
$("#scoreAnim").hide();
// for testing only
$("#trigger").on("click",function(){
    scoreAninmation();
});
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
    time = origTime;
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
    // initial game function 
    function startRound(){    
        // set questionLength variable
        firebase.database().ref().child(category).on('value', function(snap){
            questionLength = snap.numChildren();                    
        });
        askQuestion();
        $("#timer").text(time);
        startTimer();        
    }
    // update HTML with trivia question and answers
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
    // check answer selected and then fire resetQuestion function
    function checkResponse(){
        var response = $("input[name='answers']:checked").val();
        if(response){
            if(response == answer ) {
               $("#answer-"+response).addClass("correct");
                wins++;  
                streak++         
                addScore();
            } else {
                $("#answer-"+response).addClass("wrong");
                $("#answer-"+answer).addClass("correct unanswered");  
                $(".fa-fire").removeClass("heatHi heatMed heatLo");
                $(".fa-fire").addClass("deactive");
                losses++;   
                streak = 0;            
            }
        } else {
            $("#answer-"+answer).addClass("correct unanswered");  
            unanswered++;
            streak = 0;
            $(".fa-fire").addClass("deactive");
            $(".fa-fire").removeClass("heatHi heatMed heatLo");
        }        
        setTimeout(resetQuestion, 1500);
    }
    // function to add score based on streak value and update fa-fire CSS
    function addScore(){        
        if(streak > 4) {
            $("#scoreMultiplier").text("5");
            scoreAninmation();  
            score = score + 5;             
        }
        else if(streak == 4){
            $("#scoreMultiplier").text("2");
            scoreAninmation();  
            score = score + 2;
            setTimeout(function(){
                $(".fa-fire").removeClass("heatMed");
                $(".fa-fire").addClass("heatHi");
            }, 1500);           
        }
        else if(streak == 3) {
            $("#scoreMultiplier").text("1.5");
            scoreAninmation();    
            score = score + 1.5;
            setTimeout(function(){
                $(".fa-fire").removeClass("heatLo");
                $(".fa-fire").addClass("heatMed");
            }, 1500);            
        }
        else if(streak == 2) {
            $(".fa-fire").removeClass("deactive");
            $(".fa-fire").addClass("heatLo");                   
            score = score + 1;
        }
        else {
            score = score + 1;
        }
    }
    // function to add CSS animation to slide multiplier and fire fade in/out
    function scoreAninmation() {
        $("#scoreAnim").addClass("floatScore");   
        fadeInAndOut();
    };
    // function to fade in/out slide animation
    function fadeInAndOut(){
        $("#scoreAnim").fadeIn(100,function(){
            var $this = $(this);
            $this.fadeOut(1000);        
        }); 
    }
    function resetQuestion() {        
        $('.answers').children("span").removeClass("correct");
        $('.answers').children("span").removeClass("wrong");
        $('.answers').children("span").removeClass("unanswered");
        $('.answers').children("input[type=radio]").prop("checked", false);
        $('div.highlight').removeClass('highlight');        
        time = origTime;        
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
    // function fired at the end of each category
    function endRound() {
        // prevent previous answers from showing for a split second
        for(i=0;i<4;i++){
            $("#answer-" +i).text("");
        }
       $("#gameContent").addClass("hidden");
       $("#endRound").removeClass("hidden");   
       $("#wins").text(wins);
       $("#losses").text(losses);
       $("#unanswered").text(unanswered);     
       $("#score").text(score);   
    }
    // function fired when all categories have been completed
    function endGame() {
        $("#gameContent").addClass("hidden");
        $("#endGame").removeClass("hidden");   
        $("#finalScore").text(score);       
        // check to see if a new high score has been reached           
        if(score > parseInt(leaderScore2)) {
            $("#newHighScore").removeClass("hidden");             
            sortHighScore()
        }
    }
    // function to reset game for new category 
    function restartGame() {
        time = origTime;        
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
    // click event for Next Category button
    $("#nextCategory").on("click", function(){
        restartGame();
    });
    // function to Try Again and start over
    function startOver() {
        score = 0;        
        categorySelected = 0;    
        streak = 0;    
        $("#endGame").addClass("hidden");  
        $(".fa-fire").addClass("deactive");
        $(".fa-fire").removeClass("heatHi heatMed heatLo");
        restartGame();
    }
    // click event for Try Again button
    $("#startOver").on("click", function(){
        $(".categoryBtn").attr("disabled", false);
        $(".categoryBtn").removeClass("btn-secondary");
        $(".categoryBtn").addClass("btn-theme");       
        startOver();
    });
    // pull data from Firebase, update the HTML, and set high score variables
    function loadLeaderBoard(){         
        var leaderRef = firebase.database().ref().child("highscores");
        leaderRef.child("p0").child('name').on('value', snap => {
            $("#p0").text(snap.val());     
            leaderName0 = snap.val();       
        }); 
        leaderRef.child("p0").child('score').on('value', snap => {
            $("#p0score").text(snap.val());  
            leaderScore0 =  parseInt(snap.val());            
        });    
        leaderRef.child("p1").child('name').on('value', snap => {
            $("#p1").text(snap.val());    
            leaderName1 = snap.val();          
        }); 
        leaderRef.child("p1").child('score').on('value', snap => {
            $("#p1score").text(snap.val());  
            leaderScore1 = parseInt(snap.val());  
        }); 
        leaderRef.child("p2").child('name').on('value', snap => {
            $("#p2").text(snap.val());   
            leaderName2 = snap.val();           
        }); 
        leaderRef.child("p2").child('score').on('value', snap => {
            $("#p2score").text(snap.val());  
            leaderScore2 = parseInt(snap.val());  
        });
    }
    loadLeaderBoard();   
    // sort high scores to update Firebase
    function sortHighScore(){
        scoreArr = [["hsName",score], [leaderName0, leaderScore0], [leaderName1, leaderScore1], [leaderName2, leaderScore2]];
        scoreArr.sort(function compareSecondColumn(a, b) {
            if (a[1] === b[1]) {
                return 0;
            }
            else {
                return (a[1] < b[1]) ? -1 : 1;
            }
        });       
    }
    // click event for Add button on New Hire Score div
     $("#addHighScore").on('click', function(){
         // get input value from text field
        var hsName = $("#newHighScoreName").val();        
        // replace placeholder for hsName in scoreArr with text field value
        for(var i=0; i < scoreArr.length; i++) {            
            scoreArr[i][0] = scoreArr[i][0].replace("hsName", hsName);
           }       
        // create data objs for Firebase
        var hsObj0 = {
            name : scoreArr[3][0],
            score: scoreArr[3][1]
        }
        var hsObj1 = {
            name : scoreArr[2][0],
            score: scoreArr[2][1]
        }
        var hsObj2 = {
            name : scoreArr[1][0],
            score: scoreArr[1][1]
        }  
        // fire update score function for each newly sorted score           
        updateHighScore("p0",hsObj0);
        updateHighScore("p1",hsObj1);
        updateHighScore("p2",hsObj2);
        // reset CSS
        $("#newHighScoreName").val("");
        $("#newHighScore").addClass("hidden"); 
        $("#leaderboard").removeClass("hidden");
    });
    //update Firebase high scores
    function updateHighScore(path, data) {
        var leaderRef = firebase.database().ref().child("highscores");
        leaderRef.child(path).update(data);
    }
  });
  