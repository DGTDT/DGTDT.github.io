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
                    
                    // In a real application, you would send this data to a server
                    // For now, we'll just show a success message
                    showNotification(`Thank you, ${name}! Your message has been sent.`, 'success');
                    contactForm.reset();
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
