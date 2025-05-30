// Global Variables
let currentUser = null;
let currentLanguage = 'en';
let chatMessages = [];
let weatherData = null;
let userHistory = []; // To store user activity history

// Utility Functions
function showLoading(element) {
    element.classList.add('loading');
    const originalText = element.innerHTML;
    element.innerHTML = '<div class="spinner"></div>';
    element.setAttribute('data-original', originalText);
}

function hideLoading(element, originalContent = null) {
    element.classList.remove('loading');
    const content = originalContent || element.getAttribute('data-original');
    element.innerHTML = content;
    element.removeAttribute('data-original');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
   
    document.body.appendChild(notification);
   
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
   
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function addToHistory(activity) {
    userHistory.push({
        ...activity,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('userHistory', JSON.stringify(userHistory));
}

// Page Detection and Initialization
function initializePage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
   
    switch(filename) {
        case 'index.html':
        case '':
            initLandingPage();
            break;
        case 'login.html':
            initLoginPage();
            break;
        case 'create-profile.html':
            initProfilePage();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
        case 'profile.html':
            initProfileSidebar();
            break;
        case 'crop-recommendation.html':
            initCropRecommendation();
            break;
        case 'fertilizer.html':
            initFertilizerGuide();
            break;
        case 'govt-schemes.html':
            initGovernmentSchemes();
            break;
        case 'disease-detection.html':
            initPlantDisease();
            break;
        case 'weather-alerts.html':
            initWeatherAlerts();
            break;
        case 'kisanbot.html':
            initKisanBot();
            break;
        default:
            console.log('Page not recognized, applying general initialization');
    }
}

// Landing Page Functions (Updated for scrolling and navigation)
function initLandingPage() {
    const startButton = document.querySelector('.start-button, .btn-primary, button[onclick*="login"]');
    const kisanBotButton = document.querySelector('.kisan-bot-btn, .talk-to-kisanbot, button[onclick*="kisanbot"]');
    const featureLink = document.querySelector('a[href="#features"]');
    const aboutLink = document.querySelector('a[href="#about"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    // Navigation to login or features
    if (startButton) {
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    if (kisanBotButton) {
        kisanBotButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'kisanbot.html';
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Feature cards navigation
    const featureCards = document.querySelectorAll('.feature-card, .feature-item');
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const featureText = card.querySelector('h3, .feature-title')?.textContent || card.textContent;
            handleFeatureClick(featureText);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Login Page Functions (Updated for navigation)
function initLoginPage() {
    const loginForm = document.getElementById('loginForm') || document.querySelector('form');
    const signupLink = document.querySelector('.signup-text, a[href*="create-profile"], .new-user-link');
    const googleBtn = document.querySelector('.google-btn, button[onclick*="google"]');
    const facebookBtn = document.querySelector('.facebook-btn, button[onclick*="facebook"]');
   
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
   
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'create-profile.html';
        });
    }
   
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Google login will be implemented soon', 'info');
        });
    }
   
    if (facebookBtn) {
        facebookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Facebook login will be implemented soon', 'info');
        });
    }

    // Add enter key support
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
   
    const email = document.getElementById('email')?.value || document.querySelector('input[type="email"]')?.value;
    const password = document.getElementById('password')?.value || document.querySelector('input[type="password"]')?.value;
    const loginBtn = document.querySelector('.login-button, .btn-primary, button[type="submit"]');
   
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
   
    if (loginBtn) {
        showLoading(loginBtn);
    }
   
    // Simulate API call
    setTimeout(() => {
        // Mock login validation
        if (email === 'test@example.com' && password === 'password') {
            currentUser = {
                name: 'John Doe',
                email: email,
                location: 'Punjab, India',
                farmerType: 'Organic',
                farmingType: 'Crop',
                state: 'Punjab',
                city: 'Ludhiana',
                gender: 'Male',
                age: '35'
            };
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Navigate to dashboard after login
            }, 1000);
        } else {
            showNotification('Invalid credentials. Try test@example.com / password', 'error');
            if (loginBtn) {
                hideLoading(loginBtn, 'LOGIN');
            }
        }
    }, 1500);
}

// Profile Creation Functions
function initProfilePage() {
    const profileForm = document.getElementById('profileForm') || document.querySelector('form');
    const backBtn = document.querySelector('.back-btn, button[onclick*="back"]');
    const languageDropdown = document.querySelector('.language-dropdown, select[name="language"]');
   
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
   
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
   
    if (languageDropdown) {
        languageDropdown.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            showNotification(`Language changed to ${e.target.options[e.target.selectedIndex].text}`, 'success');
        });
    }
   
    // Populate dropdowns
    populateDropdowns();
}

function populateDropdowns() {
    const stateSelect = document.getElementById('state') || document.querySelector('select[name="state"]');
    const citySelect = document.getElementById('city') || document.querySelector('select[name="city"]');
    const genderSelect = document.getElementById('gender') || document.querySelector('select[name="gender"]');
    const farmerTypeSelect = document.getElementById('farmerType') || document.querySelector('select[name="farmerType"]');
    const farmingTypeSelect = document.getElementById('farmingType') || document.querySelector('select[name="farmingType"]');
   
    // States
    const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan'];
    if (stateSelect) {
        stateSelect.innerHTML = '<option value="">Select State</option>';
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }
   
    // Cities
    const cities = ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Mohali', 'Bathinda', 'Delhi', 'Mumbai', 'Bangalore'];
    if (citySelect) {
        citySelect.innerHTML = '<option value="">Select City</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
   
    // Gender
    const genders = ['Male', 'Female', 'Other'];
    if (genderSelect) {
        genderSelect.innerHTML = '<option value="">Select Gender</option>';
        genders.forEach(gender => {
            const option = document.createElement('option');
            option.value = gender;
            option.textContent = gender;
            genderSelect.appendChild(option);
        });
    }
   
    // Farmer Types
    const farmerTypes = ['Traditional', 'Organic', 'Commercial', 'Subsistence'];
    if (farmerTypeSelect) {
        farmerTypeSelect.innerHTML = '<option value="">Select Type</option>';
        farmerTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            farmerTypeSelect.appendChild(option);
        });
    }
   
    // Farming Types
    const farmingTypes = ['Crop Farming', 'Dairy Farming', 'Poultry', 'Mixed Farming', 'Horticulture'];
    if (farmingTypeSelect) {
        farmingTypeSelect.innerHTML = '<option value="">Select Type</option>';
        farmingTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            farmingTypeSelect.appendChild(option);
        });
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
   
    const formData = new FormData(e.target);
    const profileData = {};
   
    for (let [key, value] of formData.entries()) {
        profileData[key] = value;
    }
   
    // Get values from form inputs directly
    const nameInput = document.querySelector('input[name="name"]') || document.getElementById('name');
    const emailInput = document.querySelector('input[name="email"]') || document.getElementById('email');
    const stateSelect = document.querySelector('select[name="state"]') || document.getElementById('state');
    const citySelect = document.querySelector('select[name="city"]') || document.getElementById('city');
    const genderSelect = document.querySelector('select[name="gender"]') || document.getElementById('gender');
   
    if (nameInput) profileData.name = nameInput.value;
    if (emailInput) profileData.email = emailInput.value;
    if (stateSelect) profileData.state = stateSelect.value;
    if (citySelect) profileData.city = citySelect.value;
    if (genderSelect) profileData.gender = genderSelect.value;
   
    // Validate required fields
    const requiredFields = ['name', 'state', 'city', 'gender'];
    const missingFields = requiredFields.filter(field => !profileData[field]);
   
    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
   
    const submitBtn = document.querySelector('.submit-button, button[type="submit"]');
    if (submitBtn) {
        showLoading(submitBtn);
    }
   
    // Simulate API call
    setTimeout(() => {
        currentUser = profileData;
        showNotification('Profile created successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html'; // Navigate to dashboard after profile creation
        }, 1000);
    }, 1500);
}

// Dashboard Functions (Updated with beautiful design and history)
function initDashboard() {
    loadUserProfile();
    setupNavigation();
    loadDashboardData();
   
    // Initialize sections
    initHomeSection();
    initFeaturesSection();
    initAboutSection();
    initContactSection();
   
    // Show home section by default
    showSection('home');

    // Load history
    userHistory = JSON.parse(localStorage.getItem('userHistory')) || [];
    displayHistory();
}

function loadUserProfile() {
    if (!currentUser) {
        currentUser = {
            name: 'RamLal',
            email: 'test@example.com',
            state: 'Punjab',
            city: 'Ludhiana',
            gender: 'Male',
            age: '35',
            farmerType: 'Organic',
            farmingType: 'Crop Farming'
        };
    }
    updateProfileDisplay();
}

function updateProfileDisplay() {
    const welcomeText = document.querySelector('.welcome-text h1');
    const profileInfo = document.querySelector('.profile-info');
    const nameDisplay = document.querySelector('.name-display, .profile-name');
    const locationDisplay = document.querySelector('.location-display, .profile-location');
   
    if (welcomeText && currentUser) {
        welcomeText.textContent = `Welcome Back, ${currentUser.name || 'User'}`;
    }
   
    if (nameDisplay && currentUser) {
        nameDisplay.textContent = currentUser.name || 'User';
    }
   
    if (locationDisplay && currentUser) {
        locationDisplay.textContent = `${currentUser.city || ''}, ${currentUser.state || ''}`;
    }
   
    if (profileInfo && currentUser) {
        profileInfo.innerHTML = `
            <div class="profile-details">
                <p><strong>Name:</strong> ${currentUser.name || 'N/A'}</p>
                <p><strong>Location:</strong> ${currentUser.city || ''}, ${currentUser.state || ''}</p>
                <p><strong>Email:</strong> ${currentUser.email || 'N/A'}</p>
                <p><strong>Gender:</strong> ${currentUser.gender || 'N/A'}</p>
                <p><strong>Age:</strong> ${currentUser.age || 'N/A'}</p>
                <p><strong>Farmer Type:</strong> ${currentUser.farmerType || 'N/A'}</p>
                <p><strong>Farming Type:</strong> ${currentUser.farmingType || 'N/A'}</p>
            </div>
        `;
    }
}
window.addEventListener('load', () => {
    // Always show the home section on first load
    showSection('home');

    // Force scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
});
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a, .nav-link');
    const logoutBtn = document.querySelector('.logout-btn');
   
    // Navigation menu clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const text = link.textContent.toLowerCase().trim();
           
            if (href === '#home' || text === 'home') {
                showSection('home');
            } else if (href === '#features' || text === 'features') {
                showSection('features');
            } else if (href === '#about' || text === 'about us') {
                showSection('about');
            } else if (href === '#contact' || text === 'contact us') {
                showSection('contact');
            }
           
            // Update active navigation
            navLinks.forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
        });
    });
   
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            userHistory = [];
            localStorage.removeItem('userHistory');
            showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section, .page-section, .content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
   
    const targetSection = document.getElementById(sectionId) ||
                         document.querySelector(`[data-section="${sectionId}"]`) ||
                         document.querySelector(`.${sectionId}-section`);
   
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}
function loadWeatherWidget() {
    // Add your weather widget logic here
    console.log('Weather widget loading');
    
    // Example implementation:
    const weatherContainer = document.getElementById('weather-widget');
    if (weatherContainer) {
        weatherContainer.innerHTML = '<p>Weather widget loading...</p>';
    }
}
function loadDashboardData() {
    setTimeout(() => loadRecentActivity(), 500);
    setTimeout(() => loadWeatherWidget(), 1000);
    setTimeout(() => loadFarmingInsights(), 1500);
}


function handleFeatureClick(featureText) {
    const text = featureText.toLowerCase();
    console.log('Feature clicked:', text); // Debug log
   
    if (text.includes('disease') || text.includes('detection')) {
        console.log('Navigating to disease-detection.html');
        window.location.href = 'disease-detection.html';
        addToHistory({ text: 'Accessed Disease Detection', type: 'disease' });
    } else if (text.includes('crop') || text.includes('recommendation')) {
        console.log('Navigating to crop-recommendation.html');
        window.location.href = 'crop-recommendation.html';
        addToHistory({ text: 'Accessed Crop Recommendation', type: 'crop' });
    } else if (text.includes('government') || text.includes('govt') || text.includes('scheme') || text.includes('subsid')) {
        console.log('Navigating to govt-schemes.html');
        window.location.href = 'govt-schemes.html';
        addToHistory({ text: 'Accessed Government Schemes', type: 'scheme' });
    } else if (text.includes('fertilizer')) {
        console.log('Navigating to fertilizer.html');
        window.location.href = 'fertilizer.html';
        addToHistory({ text: 'Accessed Fertilizer Recommendation', type: 'fertilizer' });
    } else if (text.includes('weather') || text.includes('alert')) {
        console.log('Navigating to weather-alerts.html');
        window.location.href = 'weather-alerts.html';
        addToHistory({ text: 'Accessed Weather Alerts', type: 'weather' });
    } else if (text.includes('bot') || text.includes('kisan')) {
        console.log('Navigating to kisanbot.html');
        window.location.href = 'kisanbot.html';
        addToHistory({ text: 'Accessed KisanBot', type: 'bot' });
    } else {
        console.log('No matching feature found for:', text);
        showNotification('Feature coming soon!', 'info');
    }
}

// Complete handleActivityClick function
function handleActivityClick(type) {
    const pageMap = {
        'crop': 'crop-recommendation.html',
        'recommendation': 'crop-recommendation.html',
        'weather': 'weather-alerts.html',
        'scheme': 'govt-schemes.html',
        'disease': 'disease-detection.html',
        'fertilizer': 'fertilizer.html',
        'bot': 'kisanbot.html'
    };
   
    if (pageMap[type]) {
        window.location.href = pageMap[type];
    }
}
function loadRecentActivity() {
    const activities = [
        { icon: '🌱', text: 'Crop recommendation received for Wheat', time: '2 hours ago', type: 'crop' },
        { icon: '🌧️', text: 'Weather alert: Heavy rain expected', time: '5 hours ago', type: 'weather' },
        { icon: '💰', text: 'New government scheme available', time: '1 day ago', type: 'scheme' },
        { icon: '🦠', text: 'Plant disease detected and treated', time: '2 days ago', type: 'disease' },
        { icon: '🧪', text: 'Fertilizer recommendation updated', time: '3 days ago', type: 'fertilizer' },
        { icon: '🤖', text: 'Consulted KisanBot for farming advice', time: '4 days ago', type: 'bot' }
    ];
   
    const activityList = document.querySelector('.activity-list, .recent-activity ul, .history-list');
    if (activityList) {
        activityList.innerHTML = '';
        activities.forEach((activity, index) => {
            const item = document.createElement('li');
            item.className = 'activity-item';
            item.innerHTML = `
                <span class="activity-icon">${activity.icon}</span>
                <div class="activity-content">
                    <span class="activity-text">${activity.text}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `;
           
            item.addEventListener('click', () => {
                handleActivityClick(activity.type);
            });
           
            activityList.appendChild(item);
           
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.3s ease';
               
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            }, index * 100);
        });
    }
}

function loadFarmingInsights() {
    const insights = [
        { title: 'Soil Health', value: '85%', status: 'Good', color: '#4CAF50' },
        { title: 'Crop Growth', value: '92%', status: 'Excellent', color: '#2196F3' },
        { title: 'Water Usage', value: '78%', status: 'Optimal', color: '#FF9800' },
        { title: 'Yield Prediction', value: '88%', status: 'High', color: '#9C27B0' }
    ];
   
    const insightsContainer = document.querySelector('.farming-insights, .dashboard-insights');
    if (insightsContainer) {
        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-card" style="border-left: 4px solid ${insight.color};">
                <h4>${insight.title}</h4>
                <div class="insight-value">${insight.value}</div>
                <div class="insight-status">${insight.status}</div>
            </div>
        `).join('');
    }
}

 function displayHistory() {
     const historyList = document.querySelector('.history-list');
     if (historyList) {
         historyList.innerHTML = '';
         userHistory.forEach((activity, index) => {
             const item = document.createElement('li');
             item.className = 'history-item';
             item.innerHTML = `
                 <span class="history-icon">${activity.icon || '📋'}</span>
                 <div class="history-content">
                     <span class="history-text">${activity.text}</span>
                     <span class="history-time">${activity.timestamp}</span>
                 </div>
             `;
             historyList.appendChild(item);

             setTimeout(() => {
                 item.style.opacity = '0';
                 item.style.transform = 'translateX(-20px)';
                 item.style.transition = 'all 0.3s ease';
                 setTimeout(() => {
                     item.style.opacity = '1';
                     item.style.transform = 'translateX(0)';
                 }, 50);
             }, index * 100);
         });
     }
 }

function initHomeSection() {
    const getStartedBtn = document.querySelector('.get-started-btn');
    const kisanBotBtn = document.querySelector('.kisan-bot-btn, .talk-to-kisanbot, button[onclick*="kisanbot"]');
    const weatherBtn = document.querySelector('.weather-alerts-btn');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            showSection('features');
        });
    }
   
    if (kisanBotBtn) {
        kisanBotBtn.addEventListener('click', () => {
            window.location.href = 'kisanbot.html';
        });
    }
    if (weatherBtn) {
        weatherBtn.addEventListener('click', () => {
            window.location.href = 'weather-alerts.html';
            addToHistory({ text: 'Accessed Weather Alerts', type: 'weather' });
        });
    }
}



function initAboutSection() {
    // About section is static, no special initialization needed
}

function initContactSection() {
    const contactForm = document.getElementById('contactForm') || document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
           
            const name = contactForm.querySelector('input[name="name"]')?.value;
            const email = contactForm.querySelector('input[name="email"]')?.value;
            const message = contactForm.querySelector('textarea[name="message"]')?.value;
           
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
           
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                showLoading(submitBtn);
            }
           
            setTimeout(() => {
                showNotification('Message sent successfully! We will get back to you soon.', 'success');
                addToHistory({ text: 'Submitted Contact Form', type: 'contact' });
                contactForm.reset();
                if (submitBtn) {
                    hideLoading(submitBtn, 'Send Message');
                }
            }, 1000);
        });
    }
}

// Feature Pages Functions
function initFeaturePage() {
    const backBtn = document.querySelector('.back-btn, button[onclick*="back"]');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }
}

// Crop Recommendation Functions (4th Snippet)
function initCropRecommendation() {
    initFeaturePage();
   
    const form = document.getElementById('cropForm') || document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleCropRecommendation);
    }
   
    const getRecommendationBtn = document.querySelector('button[onclick*="recommendation"], .get-recommendation-btn');
    if (getRecommendationBtn) {
        getRecommendationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Add background image
    document.body.style.backgroundImage = 'url("image here")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

function handleCropRecommendation(e) {
    e.preventDefault();
   
    const nitrogen = document.querySelector('input[name="nitrogen"]')?.value || document.getElementById('nitrogen')?.value;
    const phosphorus = document.querySelector('input[name="phosphorus"]')?.value || document.getElementById('phosphorus')?.value;
    const potassium = document.querySelector('input[name="potassium"]')?.value || document.getElementById('potassium')?.value;
    const temperature = document.querySelector('input[name="temperature"]')?.value || document.getElementById('temperature')?.value;
    const humidity = document.querySelector('input[name="humidity"]')?.value || document.getElementById('humidity')?.value;
    const ph = document.querySelector('input[name="ph"]')?.value || document.getElementById('ph')?.value;
    const rainfall = document.querySelector('input[name="rainfall"]')?.value || document.getElementById('rainfall')?.value;
   
    if (!nitrogen || !phosphorus || !potassium || !temperature || !humidity || !ph || !rainfall) {
        showNotification('Please fill in all soil and weather parameters', 'error');
        return;
    }
   
    const btn = document.querySelector('.get-recommendation-btn, button[type="submit"]');
    if (btn) {
        showLoading(btn);
    }
   
    setTimeout(() => {
        const recommendations = generateCropRecommendations({
            nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall
        });
        displayCropRecommendations(recommendations);
        addToHistory({ text: `Requested Crop Recommendation (N:${nitrogen}, P:${phosphorus}, K:${potassium})`, type: 'recommendation' });
        if (btn) {
            hideLoading(btn, 'Get Recommendation');
        }
    }, 2000);
}

function generateCropRecommendations(data) {
    const crops = [
        { name: 'Wheat', suitability: 95, reason: 'Optimal pH and nutrient levels for wheat cultivation' },
        { name: 'Rice', suitability: 88, reason: 'Good humidity and temperature conditions for rice growth' },
        { name: 'Maize', suitability: 82, reason: 'Suitable rainfall and soil conditions for maize' },
        { name: 'Barley', suitability: 75, reason: 'Adequate nutrient availability for barley' },
        { name: 'Sugarcane', suitability: 70, reason: 'Good for current climate conditions' }
    ];
   
    const topCrops = crops.sort((a, b) => b.suitability - a.suitability).slice(0, 3);
   
    return {
        recommendedCrops: topCrops,
        guide: `Based on your soil analysis (N: ${data.nitrogen}%, P: ${data.phosphorus}%, K: ${data.potassium}%, pH: ${data.ph}) and weather conditions (Temp: ${data.temperature}°C, Humidity: ${data.humidity}%, Rainfall: ${data.rainfall}mm), we recommend these crops for optimal yield.`
    };
}

function displayCropRecommendations(recommendations) {
    const resultBox = document.querySelector('.recommendation-result, .recommended-crops');
    const guideBox = document.querySelector('.crop-guide, .guide-section');
   
    if (resultBox) {
        resultBox.innerHTML = `
            <h3>🌱 Top Recommended Crops:</h3>
            <div class="crops-list">
                ${recommendations.recommendedCrops.map(crop => `
                    <div class="crop-item">
                        <div class="crop-header">
                            <strong>${crop.name}</strong>
                            <span class="suitability">${crop.suitability}% suitable</span>
                        </div>
                        <p class="crop-reason">${crop.reason}</p>
                    </div>
                `).join('')}
            </div>
        `;
        resultBox.style.display = 'block';
    }
   
    if (guideBox) {
        guideBox.innerHTML = `
            <h3>📋 Cultivation Guide:</h3>
            <p>${recommendations.guide}</p>
            <div class="next-steps">
                <h4>Next Steps:</h4>
                <ul>
                    <li>Prepare your field according to crop requirements</li>
                    <li>Ensure proper irrigation based on rainfall data</li>
                    <li>Monitor weather conditions regularly</li>
                </ul>
            </div>
        `;
        guideBox.style.display = 'block';
    }
}
// Plant Disease Detection Functions - Add to script.js
function initPlantDisease() {
    console.log('Initializing plant disease detection...');
    
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeDisease);
    }
    
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('click', triggerFileInput);
    }
    
    const backBtn = document.querySelector('.back-btn');
    if (backBtn && !backBtn.onclick) {
        backBtn.addEventListener('click', goBack);
    }
}

function triggerFileInput() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file (JPG, PNG, JPEG)', 'error');
        return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        displayImagePreview(e.target.result, file.name);
        enableAnalyzeButton();
        showNotification('Image uploaded successfully!', 'success');
    };
    
    reader.onerror = function() {
        showNotification('Error reading the image file', 'error');
    };
    
    reader.readAsDataURL(file);
}

function displayImagePreview(imageSrc, fileName) {
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    if (uploadPlaceholder) {
        uploadPlaceholder.style.display = 'none';
    }
    
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = imageSrc;
        previewImage.style.display = 'block';
    }
    
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.classList.add('file-uploaded');
    }
}

function enableAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.add('enabled');
    }
}

function analyzeDisease() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput || !fileInput.files[0]) {
        showNotification('Please upload a plant image first', 'error');
        return;
    }
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        showLoadingOnButton(analyzeBtn);
    }
    
    clearPreviousResults();
    
    setTimeout(() => {
        const detectionResult = simulateDiseaseDetection();
        displayDetectionResults(detectionResult);
        
        if (analyzeBtn) {
            hideLoadingOnButton(analyzeBtn, 'Analyze Disease');
        }
    }, 2500);
}

function showLoadingOnButton(button) {
    button.disabled = true;
    button.innerHTML = `
        <span class="loading-spinner"></span>
        Analyzing...
    `;
}

function hideLoadingOnButton(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

function simulateDiseaseDetection() {
    const diseases = [
        {
            disease: 'Powdery Mildew',
            confidence: 89,
            severity: 'Moderate',
            description: 'A fungal disease that appears as white powdery spots on leaves and stems.',
            treatment: [
                'Remove affected leaves immediately',
                'Apply neem oil spray every 3-4 days',
                'Improve air circulation around plants',
                'Avoid overhead watering'
            ],
            prevention: [
                'Plant in well-ventilated areas',
                'Avoid overcrowding plants',
                'Water at soil level, not on leaves',
                'Apply preventive fungicide spray monthly'
            ],
            urgency: 'medium'
        },
        {
            disease: 'Leaf Spot Disease',
            confidence: 92,
            severity: 'Mild',
            description: 'Bacterial or fungal infection causing dark spots on leaves.',
            treatment: [
                'Remove and destroy affected leaves',
                'Apply copper-based fungicide',
                'Ensure proper drainage',
                'Reduce watering frequency'
            ],
            prevention: [
                'Water plants at base, not leaves',
                'Provide adequate spacing between plants',
                'Clean gardening tools regularly',
                'Apply mulch to prevent soil splash'
            ],
            urgency: 'low'
        },
        {
            disease: 'Rust Fungus',
            confidence: 85,
            severity: 'Severe',
            description: 'Fungal disease causing orange/brown rust-like spots on leaves.',
            treatment: [
                'Remove all affected plant parts',
                'Apply systemic fungicide immediately',
                'Increase air circulation',
                'Consider removing severely affected plants'
            ],
            prevention: [
                'Choose rust-resistant plant varieties',
                'Avoid watering leaves in evening',
                'Maintain proper plant spacing',
                'Apply preventive fungicide in humid conditions'
            ],
            urgency: 'high'
        },
        {
            disease: 'Healthy Plant',
            confidence: 96,
            severity: 'None',
            description: 'Your plant appears healthy with no signs of disease.',
            treatment: [
                'Continue current care routine',
                'Monitor for any changes',
                'Maintain proper watering schedule',
                'Ensure adequate nutrition'
            ],
            prevention: [
                'Regular inspection for early detection',
                'Proper watering and fertilization',
                'Good air circulation',
                'Clean gardening practices'
            ],
            urgency: 'none'
        }
    ];
    
    return diseases[Math.floor(Math.random() * diseases.length)];
}

function displayDetectionResults(result) {
    const detectionResults = document.getElementById('detectionResults');
    if (detectionResults) {
        const severityColor = getSeverityColor(result.severity);
        const urgencyIcon = getUrgencyIcon(result.urgency);
        
        detectionResults.innerHTML = `
            <div class="detection-result">
                <div class="result-header">
                    <h4 style="color: ${severityColor}; margin: 0;">
                        ${urgencyIcon} ${result.disease}
                    </h4>
                    <div class="confidence-badge" style="background: ${severityColor};">
                        ${result.confidence}% Confidence
                    </div>
                </div>
                <p class="result-description">
                    ${result.description}
                </p>
                <div class="severity-indicator">
                    <strong>Severity: </strong>
                    <span style="color: ${severityColor}; font-weight: bold;">${result.severity}</span>
                </div>
            </div>
        `;
    }
    
    const treatmentCard = document.getElementById('treatmentCard');
    const treatmentContent = document.getElementById('treatmentContent');
    if (treatmentCard && treatmentContent) {
        treatmentContent.innerHTML = `
            <ul class="treatment-list">
                ${result.treatment.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
        treatmentCard.style.display = 'block';
    }
    
    const preventionCard = document.getElementById('preventionCard');
    const preventionContent = document.getElementById('preventionContent');
    if (preventionCard && preventionContent) {
        preventionContent.innerHTML = `
            <ul class="prevention-list">
                ${result.prevention.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
        preventionCard.style.display = 'block';
    }
    
    setTimeout(() => {
        detectionResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function getSeverityColor(severity) {
    switch (severity?.toLowerCase()) {
        case 'severe': return '#dc3545';
        case 'moderate': return '#fd7e14';
        case 'mild': return '#ffc107';
        case 'none': return '#28a745';
        default: return '#6c757d';
    }
}

function getUrgencyIcon(urgency) {
    switch (urgency?.toLowerCase()) {
        case 'high': return '🚨';
        case 'medium': return '⚠️';
        case 'low': return '💡';
        case 'none': return '✅';
        default: return '🔍';
    }
}

function clearPreviousResults() {
    const treatmentCard = document.getElementById('treatmentCard');
    const preventionCard = document.getElementById('preventionCard');
    
    if (treatmentCard) treatmentCard.style.display = 'none';
    if (preventionCard) preventionCard.style.display = 'none';
    
    const detectionResults = document.getElementById('detectionResults');
    if (detectionResults) {
        detectionResults.innerHTML = `
            <div class="analyzing-state">
                <div class="analysis-icon">🔬</div>
                <p>Analyzing your plant image...</p>
            </div>
        `;
    }
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'dashboard.html';
    }
}

function showNotification(message, type = 'info') {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize when page loads - Add this at the end of your script.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the plant disease page
    if (document.querySelector('.disease-detection-container')) {
        initPlantDisease();
    }
});


// Weather Alerts Functions 
function initWeatherAlerts() {
    initFeaturePage();
   
    const form = document.getElementById('weatherForm') || document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleWeatherFetch);
    }

    // Populate dropdowns
    const stateSelect = document.getElementById('state') || document.querySelector('select[name="state"]');
    const citySelect = document.getElementById('city') || document.querySelector('select[name="city"]');
   
    const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan'];
    if (stateSelect) {
        stateSelect.innerHTML = '<option value="">Select State</option>';
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }
   
    const cities = ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Mohali', 'Bathinda', 'Delhi', 'Mumbai', 'Bangalore'];
    if (citySelect) {
        citySelect.innerHTML = '<option value="">Select City</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    // Add background image
    document.body.style.backgroundImage = 'url("image here")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

function handleWeatherFetch(e) {
    e.preventDefault();
   
    const state = document.querySelector('select[name="state"]')?.value || document.getElementById('state')?.value;
    const city = document.querySelector('select[name="city"]')?.value || document.getElementById('city')?.value;
   
    if (!state || !city) {
        showNotification('Please select both state and city', 'error');
        return;
    }
   
    const btn = document.querySelector('.get-weather-btn, button[type="submit"]');
    if (btn) {
        showLoading(btn);
    }
   
    setTimeout(() => {
        const weatherInfo = fetchWeatherData({ state, city });
        displayWeatherData(weatherInfo);
        addToHistory({ text: `Fetched Weather for ${city}, ${state}`, type: 'weather' });
        if (btn) {
            hideLoading(btn, 'Get Weather');
        }
    }, 2000);
}

function fetchWeatherData(location) {
    // Simulate weather data fetch
    return {
        current: {
            temperature: '28°C',
            condition: 'Partly Cloudy',
            humidity: '65%',
            windSpeed: '12 km/h',
            rainfall: '2mm'
        },
        alerts: [
            { type: 'Rain', message: 'Heavy rain expected in the next 24 hours', severity: 'High' }
        ],
        forecast: [
            { day: 'Day 1', temp: '29°C', condition: 'Sunny' },
            { day: 'Day 2', temp: '27°C', condition: 'Rainy' },
            { day: 'Day 3', temp: '28°C', condition: 'Cloudy' },
            { day: 'Day 4', temp: '30°C', condition: 'Sunny' },
            { day: 'Day 5', temp: '26°C', condition: 'Rainy' },
            { day: 'Day 6', temp: '27°C', condition: 'Cloudy' },
            { day: 'Day 7', temp: '29°C', condition: 'Sunny' }
        ],
        farmingAdvice: [
            'Delay planting due to expected heavy rainfall.',
            'Ensure proper drainage in fields.'
        ]
    };
}

function displayWeatherData(weatherInfo) {
    const currentWeather = document.querySelector('.current-weather');
    const weatherAlerts = document.querySelector('.weather-alerts');
    const forecast = document.querySelector('.weather-forecast');
    const farmingAdvice = document.querySelector('.farming-advice');
   
    if (currentWeather) {
        currentWeather.innerHTML = `
            <h3>Current Weather</h3>
            <p><strong>Temperature:</strong> ${weatherInfo.current.temperature}</p>
            <p><strong>Condition:</strong> ${weatherInfo.current.condition}</p>
            <p><strong>Humidity:</strong> ${weatherInfo.current.humidity}</p>
            <p><strong>Wind Speed:</strong> ${weatherInfo.current.windSpeed}</p>
            <p><strong>Rainfall:</strong> ${weatherInfo.current.rainfall}</p>
        `;
    }
   
    if (weatherAlerts) {
        weatherAlerts.innerHTML = `
            <h3>Weather Alerts</h3>
            ${weatherInfo.alerts.length > 0 ? weatherInfo.alerts.map(alert => `
                <div class="alert-item">
                    <p><strong>${alert.type} Alert:</strong> ${alert.message}</p>
                    <p><strong>Severity:</strong> ${alert.severity}</p>
                </div>
            `).join('') : '<p>No active weather alerts for your area</p>'}
        `;
    }
   
    if (forecast) {
        forecast.innerHTML = `
            <h3>7-Day Forecast</h3>
            <div class="forecast-list">
                ${weatherInfo.forecast.map(day => `
                    <div class="forecast-item">
                        <p><strong>${day.day}:</strong> ${day.temp}, ${day.condition}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
   
    if (farmingAdvice) {
        farmingAdvice.innerHTML = `
            <h3>Farming Advice</h3>
            <ul>
                ${weatherInfo.farmingAdvice.map(advice => `<li>${advice}</li>`).join('')}
            </ul>
        `;
    }
}

// KisanBot Functions (8th Snippet)
function initKisanBot() {
    initFeaturePage();
   
    const chatForm = document.getElementById('chatForm') || document.querySelector('form');
    const chatInput = document.getElementById('chatInput') || document.querySelector('input[name="message"]');
    const quickQuestions = document.querySelectorAll('.quick-question');

    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    quickQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const question = realizadasbutton.textContent;
            displayChatMessage({ sender: 'user', message: question });
            handleChatResponse(question);
        });
    });

    // Load chat history
    displayChatHistory();

    // Add background image
    document.body.style.backgroundImage = 'url("image here")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

function handleChatSubmit(e) {
    e.preventDefault();
   
    const chatInput = document.getElementById('chatInput') || document.querySelector('input[name="message"]');
    const message = chatInput.value.trim();
   
    if (!message) {
        showNotification('Please enter a message', 'error');
        return;
    }
   
    displayChatMessage({ sender: 'user', message });
    chatInput.value = '';
   
    handleChatResponse(message);
}

function handleChatResponse(message) {
    setTimeout(() => {
        const response = generateBotResponse(message);
        displayChatMessage({ sender: 'bot', message: response });
        chatMessages.push({ sender: 'user', message });
        chatMessages.push({ sender: 'bot', message: response });
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        addToHistory({ text: `Asked KisanBot: ${message}`, type: 'bot' });
    }, 1000);
}

function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('crop') || lowerMessage.includes('recommend')) {
        return 'I recommend checking the Crop Recommendation section for crops suitable for your soil and weather conditions. Would you like to go there?';
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('plant')) {
        return 'You can use the Plant Disease Detection feature to upload an image and get a diagnosis. Shall I take you there?';
    } else if (lowerMessage.includes('fertilizer')) {
        return 'The Fertilizer Guide can help you choose the right fertilizer based on your soil analysis. Would you like to visit that section?';
    } else if (lowerMessage.includes('weather')) {
        return 'Check the Weather Alerts section for the latest weather updates and farming advice. Want to go there?';
    } else if (lowerMessage.includes('government') || lowerMessage.includes('scheme')) {
        return 'The Government Schemes section can help you find subsidies and programs. Shall we go there?';
    } else if (lowerMessage.includes('market') || lowerMessage.includes('price')) {
        return 'Market prices are not available right now, but I can help with other farming queries!';
    } else {
        return 'I can help with crop suggestions, disease treatment, fertilizer advice, weather updates, government schemes, or market prices. What would you like to know?';
    }
}

function displayChatMessage({ sender, message }) {
    const chatBox = document.querySelector('.chat-box, .chat-messages');
    if (chatBox) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}-message`;
        messageElement.innerHTML = `
            <div class="message-bubble">
                ${sender === 'bot' ? '<img src="bot-icon.png" alt="KisanBot" class="bot-icon">' : ''}
                <p>${message}</p>
            </div>
        `;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function displayChatHistory() {
    chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    chatMessages.forEach(message => displayChatMessage(message));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePage);