$(document).ready(function() {
    //change colour when radio is selected
    $('#answerRow input:radio').change(function() {
      // Only remove the class in the specific `box` that contains the radio
      $('div.highlight').removeClass('highlight');
      $(this).closest('.answers').addClass('highlight');
    });
  });