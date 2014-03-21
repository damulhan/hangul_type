// Shift is off initially.
var shift = false;

// Set sounds for answer feedback.
var wrong = new buzz.sound(["./audio/Wrong.ogg","./audio/Wrong.mp3"]);
var correct = new buzz.sound(["./audio/Correct.ogg","./audio/Wrong.mp3"]);

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

// Shuffle the array.
function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

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
  var chosen = sets[$('select[name="set"]').val()];
  set = shuffle(chosen);
  set_length = set.length;
  current_word = 0;
  nextWord();
}

// Show the next word and play audio.
function nextWord() {
  var word = set[current_word];
  current_word++;
  kaudio = new buzz.sound(["./audio/" + word[1]]);
  kaudio.play();
  $('.kword').html(word[0]);
  $('.english').html(word[3]);
  $('.current').html(current_word);
  $('.total').html(set_length);    
};

// Check if the typed word is correct.
function checkWord() {
  var input = $('.write').val();
  var output = $('.kword').html();
  if (input == output) {
    // Give feedback and clear after feedback if correct.
    setTimeout(function(){
      nextWord();
      $('.write').removeClass('correct');
      $('.write').val('');
    }, 1000);
    correct.stop();
    correct.play();
    $('.write').addClass('correct');
  } else {
    // Give feedback and clear after feedback if incorrect.
    setTimeout(function(){  
      kaudio.play();
      $('.write').removeClass('wrong');
      $('.write').val('');
    }, 450);
    $('.write').addClass('wrong');
    wrong.stop()
    wrong.play();
    $('.write').shake(2, 13, 250);
  }
}

// Show a word when page loads and wait for response.
$(document).ready(function() {
  selectSet();
  // Check answer if user hits enter.
  $('.write').keypress(function(key) {
    if (key.which == 13) {
      checkWord();
    }
  });
});

// Play audio when clicking the word
$( ".kword" ).click(function() {
  kaudio.play();
});

// Change set when dropdown value changes
$('select[name="set"]').change(function() {
  selectSet();
});

$('.navigation li a').click(function() {
  $('.active').removeClass('active');
  $(this).addClass('active');
});

// Detect and react when shift is pressed and released.
KeyboardJS.on('shift', function() { toggleOn() }, function() { toggleOff() });