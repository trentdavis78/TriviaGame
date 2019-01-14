$(document).ready(function() {   
//  game variables 
var intervalId;
var time = 10;
var clockRunning = false;
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
   
    //change bg color when radio is selected
    $('#answerRow input:radio').change(function() {
      // Only remove the class in the specific div that contains the radio
      $('div.highlight').removeClass('highlight');
      $(this).closest('.answers').addClass('highlight');
    });
    // allow containing div to check radio button and change highlight class --> for mobile functionality
    $('.answers').click( function(){
        $('.answers').removeClass('highlight');
        $('.answers').children("input[type=radio]").removeAttr("checked");
        $(this).addClass('highlight');
        $(this).children("input[type=radio]").attr("checked","checked");
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
        }
    }
    function startGame(){
        $("#question").text(triviaQA[0].question)
            
        for(i=0; i < 5; i++){
            var options = triviaQA[0].choices;
             $("#answer-" + i).text(options[i]);
            
        }
        startTimer();
    }
    startGame();
  });