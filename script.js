document.addEventListener('DOMContentLoaded',function(event){
    // array with texts to type in typewriter
    var dataText = ["Dagim T.", "Machine Learning", "GT Class of '27"];
    
    // type one text in the typwriter
    // keeps calling itself until the text is finished
    function typeWriter(text, i, fnCallback) {
      // chekc if text isn't finished yet
      if (i < (text.length)) {
        // add next character to h1
       document.querySelector("h1").innerHTML = text.substring(0, i+1) +'<span aria-hidden="true"></span>';
  
        // wait for a while and call this function again for next character
        setTimeout(function() {
          typeWriter(text, i + 1, fnCallback)
        }, 160);
      }
      // text finished, call callback if there is a callback function
      else if (typeof fnCallback == 'function') {
        // call callback after timeout
        setTimeout(fnCallback, 700);
      }
    }
    // start a typewriter animation for a text in the dataText array
     function StartTextAnimation(i) {
       if (typeof dataText[i] == 'undefined'){
          setTimeout(function() {
            StartTextAnimation(0);
          }, 1000);
       }
       // check if dataText[i] exists
      if (i < dataText[i].length) {
        // text exists! start typewriter animation
       typeWriter(dataText[i], 0, function(){
         // after callback (and whole text has been animated), start next text
         StartTextAnimation(i + 1);
       });
      }
    }
    // start the text animation
    StartTextAnimation(0);
  });

// email

function validateForm() {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var message = document.getElementById('message').value;
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (name == "") {
      alert("Name must be filled out");
      return false;
  }
  if (email == "" || !emailPattern.test(email)) {
      alert("Please enter a valid email address");
      return false;
  }
  if (message == "") {
      alert("Message must be filled out");
      return false;
  }
  return true;
}

// Electronic sign
// script.js
const messages = ["Best Buy", "MORSE CODE STUDIO", "Refcode"];
let messageIndex = 0;

const signTextElement = document.getElementById('sign-text');

function updateText() {
    signTextElement.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
}

// Initial text setup
updateText();

// Update the text content periodically
setInterval(updateText, 10000); // Update every 10 seconds (match the animation duration)


// Experience animation

