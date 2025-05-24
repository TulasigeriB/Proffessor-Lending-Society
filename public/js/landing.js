// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scroll Down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll Up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll reveal animation
    const scrollReveal = () => {
        const elements = document.querySelectorAll('.scroll-reveal');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Initial check for elements in view
    window.addEventListener('load', scrollReveal);

    // Check for elements in view on scroll
    window.addEventListener('scroll', scrollReveal);

    // Video modal functionality
    const videoBtn = document.querySelector('a[href="#watch-video"]');
    if (videoBtn) {
        videoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your video modal implementation here
            alert('Video feature coming soon!');
        });
    }

    // Add hover effect to feature cards
    document.querySelectorAll('.feature-card, .benefit-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');

    const highlightNavLink = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-links a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-links a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);

    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('loading')) {
                e.preventDefault();
                this.classList.add('loading');
                
                // Simulate loading state
                setTimeout(() => {
                    this.classList.remove('loading');
                    window.location.href = this.getAttribute('href');
                }, 1000);
            }
        });
    });
}); 