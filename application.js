// Shift is off initially.
var shift = false;

// Set sounds for answer feedback.
var wrong = new buzz.sound(["./audio/Wrong.ogg"]);
var correct = new buzz.sound(["./audio/Correct.ogg"]);
var kaudio
var set

// Shake effect from https://gist.github.com/hzlzh/3270711
jQuery.fn.shake = function(intShakes, intDistance, intDuration) {
  this.each(function() {
    $(this).css({
      position: "relative"
    });
    for (var x = 1; x <= intShakes; x++) {
      $(this).animate({
        left: (intDistance * -1)
      }, (((intDuration / intShakes) / 4))).animate({
        left: intDistance
      }, ((intDuration / intShakes) / 2)).animate({
        left: 0
      }, (((intDuration / intShakes) / 4)));
    }
  });
  return this;
};

// Get a random object from an array.
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
}

// Detect and react when shift is pressed and released.
KeyboardJS.on('shift', function() { toggleOn() }, function() { toggleOff() });

// Toggle shift key on.
function toggleOn () {
  $('.left-shift').addClass('pressed');
  $('.right-shift').addClass('pressed');
  $('.multiple .on').show();
  $('.multiple .off').hide();
  $('.symbol .on').show();
  $('.symbol .off').hide();
}

// Toggle shift key off.
function toggleOff () {
  $('.left-shift').removeClass('pressed');
  $('.right-shift').removeClass('pressed');
  $('.multiple .on').hide();
  $('.multiple .off').show();
  $('.symbol .on').hide();
  $('.symbol .off').show();
}

// Select set from hash
function selectSet() {
  set = sets[$('select[name="set"]').val()];
  nextWord();
}

// Show a word when page loads and wait for response.
$(document).ready(function() {
  selectSet();
  // Check answer if user hits enter.
  $('#write').keypress(function(key) {
    if (key.which == 13) {
      checkWord();
    }
  });
});

// Show the next word and play audio.
function nextWord() {
  var word = set.random();
  kaudio = new buzz.sound(["./audio/" + word[1]]);
  kaudio.play();
  $('#kword').html(word[0]);
  $('#english').html(word[3]);
}

// Check if the typed word is correct.
function checkWord() {
  var input = $('#write').val();
  var output = $('#kword').html();
  if (input == output) {
    // Give feedback and clear after feedback if correct.
    setTimeout(function(){
      nextWord();
      $('#write').removeClass('correct');
      $('#write').val('');
    }, 1000);
    correct.stop();
    correct.play();
    $('#write').addClass('correct');
  } else {
    // Give feedback and clear after feedback if incorrect.
    setTimeout(function(){  
      kaudio.play();
      $('#write').removeClass('wrong');
      $('#write').val('');
    }, 450);
    $('#write').addClass('wrong');
    wrong.stop()
    wrong.play();
    $('#write').shake(2, 13, 250);
  }
}

// Play audio when clicking the word
$( "#kword" ).click(function() {
  kaudio.play();
});

// Change set when dropdown value changes
$('select[name="set"]').change(function() {
  selectSet();
});