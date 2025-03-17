/**
 * University Website JavaScript
 * Author: [Your Name]
 * Version: 1.0.0
 */

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', validateLoginForm);
    }

    // Show more/less functionality
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', toggleContent);
    });

    // Mobile navigation toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navSidebar = document.querySelector('.nav-sidebar');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            navSidebar.classList.toggle('active');
        });
    }

    // Close mobile navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (!navSidebar.contains(event.target) && !mobileNavToggle.contains(event.target)) {
            navSidebar.classList.remove('active');
        }
    });

    // Dropdown Menu Toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
        });
    });

    // Image hover effect
    const images = document.querySelectorAll('.img-hover-zoom img');
    
    images.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Active navigation highlighting
    highlightActiveNav();
});

/**
 * Validates the login form
 * @param {Event} event - The form submission event
 */
function validateLoginForm(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    if (!username || !password) {
        showError('Please fill in all fields');
        return false;
    }
    
    // Here you would typically make an API call to validate credentials
    // For demo purposes, we'll just redirect
    window.location.href = 'index.html';
}

/**
 * Shows error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

/**
 * Toggles content visibility
 * @param {Event} event - The click event
 */
function toggleContent(event) {
    const button = event.target;
    const content = button.closest('.card').querySelector('.content');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        button.textContent = 'Show More';
    } else {
        content.classList.add('expanded');
        button.textContent = 'Show Less';
    }
}

/**
 * Highlights active navigation item
 */
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-sidebar a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

/**
 * Handles document downloads
 * @param {string} documentUrl - The URL of the document to download
 */
function handleDocumentDownload(documentUrl) {
    // Here you would typically handle the document download
    // For demo purposes, we'll just open in a new tab
    window.open(documentUrl, '_blank');
}

/**
 * Handles video playback
 * @param {Event} event - The click event
 */
function handleVideoPlay(event) {
    const video = event.target;
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// Utility Functions
/**
 * Debounces a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttles a function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} The throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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