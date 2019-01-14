$(document).ready(function() {
    //change colour when radio is selected
    $('#answerRow input:radio').change(function() {
      // Only remove the class in the specific `box` that contains the radio
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
  });