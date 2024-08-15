document.addEventListener('DOMContentLoaded', function(event){
    // Array with texts to type in typewriter
    var dataText = ["Innovative",
    "Tech-Savvy",
    "Creative Thinker",
    "Problem-Solver",
    "Enthusiastic Learner",
    "Detail-Oriented",
    "Adaptive",
    "Passionate",
    "Resourceful",
    "Future Software Engineer",
    "Tech Enthusiast",
    "Coding Aficionado",
    "Data-Driven Developer",
    "Algorithmic Expert",
    "Programming Prodigy",
    "Tech Innovator",
    "AI Enthusiast",
    "Systems Thinker",
    "Development Enthusiast",
    "Striving for Excellence",
    "Building the Future",
    "Empowering Through Technology",
    "Driving Technological Change",
    "Committed to Learning and Growth", "Machine Learning", "GT Class of 27'"];
    
    // Type one text in the typewriter
    // Keeps calling itself until the text is finished
    function typeWriter(text, i, fnCallback) {
        // Check if text isn't finished yet
        if (i < (text.length)) {
            // Add next character to h1
            document.querySelector("#home h1").innerHTML = text.substring(0, i+1) + '<span aria-hidden="true"></span>';

            // Wait for a while and call this function again for next character
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback)
            }, 160);
        }
        // Text finished, call callback if there is a callback function
        else if (typeof fnCallback == 'function') {
            // Call callback after timeout
            setTimeout(fnCallback, 700);
        }
    }

    // Start a typewriter animation for a text in the dataText array
    function StartTextAnimation(i) {
        if (typeof dataText[i] == 'undefined') {
            setTimeout(function() {
                StartTextAnimation(0);
            }, 1000);
        }
        // Check if dataText[i] exists
        if (i < dataText.length) {
            // Text exists! Start typewriter animation
            typeWriter(dataText[i], 0, function(){
                // After callback (and whole text has been animated), start next text
                StartTextAnimation(i + 1);
            });
        }
    }
    // Start the text animation
    StartTextAnimation(0);
});

// latest updates
document.addEventListener('DOMContentLoaded', () => {
    const updates = document.querySelectorAll('#latest_updates .update');
    let currentIndex = 0;

    function showNextUpdate() {
        updates[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % updates.length;
        updates[currentIndex].classList.add('active');
    }

    // Initialize the first update
    updates[currentIndex].classList.add('active');

    // Show updates every 5 seconds (adjust as needed)
    setInterval(showNextUpdate, 10000); 
});
