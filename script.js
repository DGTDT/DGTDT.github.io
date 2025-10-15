// DOM Content Loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Navigation
            const navbar = document.getElementById('navbar');
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            
            // Toggle mobile menu
            hamburger.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
            
            // Navbar scroll effect
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Skills Carousel
            const carouselTrack = document.querySelector('.carousel-track');
            const skillCategories = document.querySelectorAll('.skill-category');
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            const indicators = document.querySelectorAll('.indicator');
            
            let currentIndex = 0;
            
            // Function to update carousel
            function updateCarousel() {
                // Hide all categories
                skillCategories.forEach(category => {
                    category.classList.remove('active');
                });
                
                // Show current category
                skillCategories[currentIndex].classList.add('active');
                
                // Update indicators
                indicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            }
            
            // Next button click
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % skillCategories.length;
                updateCarousel();
            });
            
            // Previous button click
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + skillCategories.length) % skillCategories.length;
                updateCarousel();
            });
            
            // Indicator click
            indicators.forEach(indicator => {
                indicator.addEventListener('click', function() {
                    currentIndex = parseInt(this.getAttribute('data-index'));
                    updateCarousel();
                });
            });
            
            // Auto-rotate carousel
            let carouselInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % skillCategories.length;
                updateCarousel();
            }, 5000);
            
            // Pause auto-rotation on hover
            const carouselContainer = document.querySelector('.skills-carousel');
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(carouselInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                carouselInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % skillCategories.length;
                    updateCarousel();
                }, 5000);
            });
            
            // Animate elements on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);
            
            // Observe elements to animate
            document.querySelectorAll('.education-card, .timeline-item, .project-card, .skill-category').forEach(el => {
                observer.observe(el);
            });
            
            // EmailJS initialization (Add this at the top of your script)
            emailjs.init("YOUR_PUBLIC_KEY"); // You'll get this from EmailJS

            // Contact form submission
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form data
                    const formData = new FormData(contactForm);
                    const name = formData.get('name');
                    const email = formData.get('email');
                    const message = formData.get('message');
                    
                    // Simple validation
                    if (!name || !email || !message) {
                        showNotification('Please fill in all fields', 'error');
                        return;
                    }
                    
                    // Show loading state
                    const submitBtn = contactForm.querySelector('.submit-btn');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitBtn.disabled = true;
                    
                    // Send email using EmailJS
                    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
                        from_name: name,
                        from_email: email,
                        message: message,
                        to_email: "DagimT2027@gmail.com"
                    })
                    .then(function(response) {
                        showNotification(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
                        console.error('EmailJS error:', error);
                    })
                    .finally(function() {
                        // Reset button state
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    });
                });
            }
            
            // Notification function
            function showNotification(message, type) {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                
                // Add styles for notification
                notification.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                `;
                
                if (type === 'success') {
                    notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                } else {
                    notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                }
                
                document.body.appendChild(notification);
                
                // Animate in
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                // Remove after 5 seconds
                setTimeout(() => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 5000);
            }

            // Typewriter Animation
            const phrases = [
                {text: "Building the Future with Code", colorParts: [["Future", "text-blue"]]},
                {text: "Creating AI Solutions", colorParts: [["AI", "text-green"]]},
                {text: "Engineering Scalable Systems", colorParts: [["Scalable", "text-orange"]]},
                {text: "Developing Full-Stack Apps", colorParts: [["Full-Stack", "text-purple"]]},
                {text: "Designing Cloud Architecture", colorParts: [["Cloud", "text-red"]]},
                {text: "Building Machine Learning Models", colorParts: [["Machine Learning", "text-blue"]]},
                {text: "Crafting Elegant Code", colorParts: [["Elegant", "text-green"]]},
                {text: "Optimizing System Performance", colorParts: [["System", "text-orange"]]},
                {text: "Developing Real-Time Applications", colorParts: [["Real-Time", "text-purple"]]},
                {text: "Engineering Secure APIs", colorParts: [["Secure", "text-red"]]}
            ];

            const typingElement = document.getElementById('typing-text');
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100;

            function typeWriter() {
                const currentPhrase = phrases[phraseIndex];
                const plainText = currentPhrase.text;
                
                if (isDeleting) {
                    // Delete text
                    const displayText = applyColors(plainText.substring(0, charIndex - 1), currentPhrase.colorParts);
                    typingElement.innerHTML = displayText;
                    charIndex--;
                    typingSpeed = 50;
                } else {
                    // Type text
                    const displayText = applyColors(plainText.substring(0, charIndex + 1), currentPhrase.colorParts);
                    typingElement.innerHTML = displayText;
                    charIndex++;
                    typingSpeed = 100;
                }

                if (!isDeleting && charIndex === plainText.length) {
                    // Pause at end of phrase
                    typingSpeed = 1500;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    // Move to next phrase
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 500;
                }

                setTimeout(typeWriter, typingSpeed);
            }

            function applyColors(text, colorParts) {
                let result = text;
                colorParts.forEach(([word, colorClass]) => {
                    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                    result = result.replace(regex, `<span class="${colorClass}">${word}</span>`);
                });
                return result;
            }

            // Start the typing animation after a short delay
            setTimeout(typeWriter, 1000);
        });
        document.addEventListener('DOMContentLoaded', function() {
            const loadingScreen = document.getElementById('loading-screen');
            const terminalOutput = document.getElementById('terminal-output');
            const progressBar = document.getElementById('encryption-progress');
            const statusText = document.getElementById('status-text');
            const percentage = document.getElementById('percentage');
            const mainContent = document.getElementById('main-content');

            const terminalLines = [
                { text: '<span class="path">root@portfolio:~</span> <span class="command">sudo system_init.sh</span>', delay: 500 },
                { text: '[sudo] password for root: ********', delay: 800 },
                { text: '<span class="success">✓</span> Authentication successful', delay: 600 },
                { text: '<span class="text">Initializing secure connection...</span>', delay: 400 },
                { text: '<span class="success">✓</span> TLS 1.3 handshake complete', delay: 700 },
                { text: '<span class="text">Loading encryption modules...</span>', delay: 500 },
                { text: '<span class="success">✓</span> AES-256-GCM initialized', delay: 600 },
                { text: '<span class="success">✓</span> RSA-4096 keys generated', delay: 600 },
                { text: '<span class="text">Establishing secure session...</span>', delay: 500 },
                { text: '<span class="success">✓</span> Secure session established', delay: 700 },
                { text: '<span class="text">Decrypting portfolio data...</span>', delay: 800 }
            ];

            let currentLine = 0;
            let progress = 0;

            function addTerminalLine(line) {
                const lineElement = document.createElement('div');
                lineElement.className = 'terminal-line';
                lineElement.innerHTML = line;
                terminalOutput.appendChild(lineElement);
                
                // Scroll to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }

            function updateProgress(value, text) {
                progress = value;
                progressBar.style.width = progress + '%';
                percentage.textContent = progress + '%';
                statusText.textContent = text;
            }

            function typeLines() {
                if (currentLine < terminalLines.length) {
                    const line = terminalLines[currentLine];
                    setTimeout(() => {
                        addTerminalLine(line.text);
                        currentLine++;
                        
                        // Update progress based on current line
                        const lineProgress = Math.min((currentLine / terminalLines.length) * 80, 80);
                        updateProgress(lineProgress, getStatusText(currentLine));
                        
                        typeLines();
                    }, line.delay);
                } else {
                    // Start encryption animation
                    startEncryptionAnimation();
                }
            }

            function getStatusText(lineIndex) {
                const statuses = [
                    'Initializing encryption protocol...',
                    'Loading security modules...',
                    'Establishing secure connection...',
                    'Generating encryption keys...',
                    'Decrypting portfolio data...',
                    'Finalizing secure session...'
                ];
                return statuses[Math.min(lineIndex, statuses.length - 1)];
            }

            function startEncryptionAnimation() {
                // Create encryption grid
                const grid = document.createElement('div');
                grid.className = 'encryption-grid';
                grid.id = 'encryption-grid';
                
                // Add 100 cells (10x10 grid)
                for (let i = 0; i < 100; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'encryption-cell';
                    cell.textContent = Math.random().toString(16).substr(2, 1).toUpperCase();
                    grid.appendChild(cell);
                }
                
                terminalOutput.appendChild(grid);
                
                // Animate cells
                let completedCells = 0;
                const totalCells = 100;
                const cellInterval = setInterval(() => {
                    const cells = document.querySelectorAll('.encryption-cell');
                    const randomCell = Math.floor(Math.random() * cells.length);
                    
                    cells[randomCell].classList.add('active');
                    cells[randomCell].textContent = Math.random().toString(16).substr(2, 1).toUpperCase();
                    
                    setTimeout(() => {
                        cells[randomCell].classList.remove('active');
                    }, 200);
                    
                    completedCells++;
                    
                    // Update progress
                    const encryptionProgress = 80 + (completedCells / totalCells) * 20;
                    updateProgress(encryptionProgress, 'Finalizing decryption...');
                    
                    if (completedCells >= 50) {
                        clearInterval(cellInterval);
                        
                        // Add final terminal lines
                        setTimeout(() => {
                            addTerminalLine('<span class="success">✓</span> Portfolio data decrypted successfully');
                            updateProgress(95, 'Loading user interface...');
                            
                            setTimeout(() => {
                                addTerminalLine('<span class="text">Initializing user interface...</span>');
                                updateProgress(98, 'Almost ready...');
                                
                                setTimeout(() => {
                                    addTerminalLine('<span class="success">✓</span> System ready');
                                    addTerminalLine('<span class="path">root@portfolio:~</span> <span class="command">./start_portfolio.sh</span>');
                                    updateProgress(100, 'Ready!');
                                    
                                    // Add blinking cursor at the end
                                    const cursorLine = document.createElement('div');
                                    cursorLine.className = 'terminal-line';
                                    cursorLine.innerHTML = '<span class="blinking-cursor"></span>';
                                    terminalOutput.appendChild(cursorLine);
                                    
                                    // Hide loading screen
                                    setTimeout(() => {
                                        loadingScreen.classList.add('fade-out');
                                        mainContent.classList.add('loaded');
                                        
                                        setTimeout(() => {
                                            loadingScreen.remove();
                                        }, 800);
                                    }, 1000);
                                }, 500);
                            }, 500);
                        }, 500);
                    }
                }, 30);
            }

            // Start the loading sequence
            setTimeout(() => {
                typeLines();
            }, 1000);
        });
        // Project data (you can customize this)
const projectData = {
    gtMovies: {
        demoUrl: '#',
        githubUrl: '#'
    },
    minigpt: {
        demoUrl: '#',
        githubUrl: '#'
    },
    pokeTrade: {
        demoUrl: 'YOUR_GOOGLE_SITES_URL_HERE',
        githubUrl: 'YOUR_GITHUB_URL_HERE'
    }
};

// Modal functions
function showProjectDetails(projectId) {
    const modalId = projectId + 'Modal';
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openDemo(projectId) {
    const url = projectData[projectId]?.demoUrl;
    if (url && url !== '#') {
        window.open(url, '_blank');
    } else {
        // Show message or handle missing URL
        alert('Demo link coming soon!');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});