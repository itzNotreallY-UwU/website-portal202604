// ========== INFINITE SCROLL ANIMATION SETUP ==========
const track = document.getElementById('infiniteSocialTrack');
if (track) {
    const items = Array.from(track.children);
    // Clone items for seamless infinite loop
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    // Double again for smoother loop
    const newItems = Array.from(track.children);
    if (newItems.length < 15) {
        items.forEach(item => {
            const clone2 = item.cloneNode(true);
            track.appendChild(clone2);
        });
    }
}

// ========== FORM VALIDATION (Green ticks / Red errors) ==========
let totalSubmissions = 0;
let currentFeedbackData = { name: "", matrix: "", email: "", comment: "" };

function isMatrixOnlyDigits(value) {
    return /^\d+$/.test(value);
}

function isValidEmailFormat(email) {
    return email.includes('@') && email.includes('.') && email.length > 5;
}

const fullNameInput = document.getElementById('fullName');
const matrixInput = document.getElementById('matrixNo');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('nameError');
const nameValid = document.getElementById('nameValid');
const matrixError = document.getElementById('matrixError');
const matrixValid = document.getElementById('matrixValid');
const emailError = document.getElementById('emailError');
const emailValid = document.getElementById('emailValid');

function resetValidationStyles() {
    [fullNameInput, matrixInput, emailInput].forEach(inp => {
        inp.classList.remove('is-valid', 'is-invalid');
    });
    if (nameError) nameError.style.display = 'none';
    if (nameValid) nameValid.style.display = 'none';
    if (matrixError) matrixError.style.display = 'none';
    if (matrixValid) matrixValid.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    if (emailValid) emailValid.style.display = 'none';
}

function validateFieldRealTime() {
    // Full Name validation
    if (fullNameInput.value.trim() === "") {
        fullNameInput.classList.remove('is-valid');
        fullNameInput.classList.add('is-invalid');
        if (nameError) nameError.style.display = 'block';
        if (nameValid) nameValid.style.display = 'none';
    } else {
        fullNameInput.classList.remove('is-invalid');
        fullNameInput.classList.add('is-valid');
        if (nameError) nameError.style.display = 'none';
        if (nameValid) nameValid.style.display = 'block';
    }
    
    // Matrix validation (only digits)
    const matrixVal = matrixInput.value.trim();
    if (matrixVal === "" || !isMatrixOnlyDigits(matrixVal)) {
        matrixInput.classList.remove('is-valid');
        matrixInput.classList.add('is-invalid');
        if (matrixError) matrixError.style.display = 'block';
        if (matrixValid) matrixValid.style.display = 'none';
    } else {
        matrixInput.classList.remove('is-invalid');
        matrixInput.classList.add('is-valid');
        if (matrixError) matrixError.style.display = 'none';
        if (matrixValid) matrixValid.style.display = 'block';
    }
    
    // Email validation (must contain @ and .)
    const emailVal = emailInput.value.trim();
    if (emailVal === "" || !isValidEmailFormat(emailVal)) {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
        if (emailError) emailError.style.display = 'block';
        if (emailValid) emailValid.style.display = 'none';
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        if (emailError) emailError.style.display = 'none';
        if (emailValid) emailValid.style.display = 'block';
    }
}

// Add event listeners for real-time validation
if (fullNameInput) fullNameInput.addEventListener('input', validateFieldRealTime);
if (matrixInput) matrixInput.addEventListener('input', validateFieldRealTime);
if (emailInput) emailInput.addEventListener('input', validateFieldRealTime);

function checkFormAndStore() {
    const name = fullNameInput.value.trim();
    const matrix = matrixInput.value.trim();
    const email = emailInput.value.trim();
    const comment = document.getElementById('feedbackMsg').value;
    
    let valid = true;
    if (name === "") valid = false;
    if (matrix === "" || !isMatrixOnlyDigits(matrix)) valid = false;
    if (email === "" || !isValidEmailFormat(email)) valid = false;
    
    if (valid) {
        currentFeedbackData = { name, matrix, email, comment };
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmSubmitModal'));
        confirmModal.show();
    } else {
        const statusMsg = document.getElementById('formStatusMsg');
        if (statusMsg) {
            statusMsg.innerHTML = '<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> Please fix errors: Matrix only digits, valid email with @ and .</span>';
        }
        validateFieldRealTime();
    }
}

function finalSubmitFeedback() {
    // Loop demonstration
    for (let key in currentFeedbackData) {
        console.log(`${key}: ${currentFeedbackData[key]}`);
    }
    
    totalSubmissions++;
    
    if (totalSubmissions > 0) {
        const form = document.getElementById('feedbackForm');
        if (form) form.reset();
        resetValidationStyles();
        
        const statusMsg = document.getElementById('formStatusMsg');
        if (statusMsg) statusMsg.innerHTML = '';
        
        currentFeedbackData = {};
        
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    }
}

// Event handlers
const openConfirmBtn = document.getElementById('openConfirmBtn');
if (openConfirmBtn) {
    openConfirmBtn.addEventListener('click', checkFormAndStore);
}

const finalSubmitBtn = document.getElementById('finalSubmitBtn');
if (finalSubmitBtn) {
    finalSubmitBtn.addEventListener('click', function() {
        let confirmModalElem = document.getElementById('confirmSubmitModal');
        let confirmModalInstance = bootstrap.Modal.getInstance(confirmModalElem);
        if (confirmModalInstance) confirmModalInstance.hide();
        finalSubmitFeedback();
    });
}

const resetFormBtn = document.getElementById('resetFormBtn');
if (resetFormBtn) {
    resetFormBtn.addEventListener('click', function() {
        const form = document.getElementById('feedbackForm');
        if (form) form.reset();
        resetValidationStyles();
        const statusMsg = document.getElementById('formStatusMsg');
        if (statusMsg) statusMsg.innerHTML = '';
    });
}

// ========== SCROLL HANDLER: hide navbar on scroll down, show on scroll up ==========
let lastScrollTop = 0;
const navbar = document.getElementById('mainNavbar');
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 80) {
        // scrolling down
        if (navbar) navbar.classList.add('hide-nav');
    } else {
        // scrolling up
        if (navbar) navbar.classList.remove('hide-nav');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    
    // Show/hide scroll to top button
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
});

// Scroll to top functionality
if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== TOOLTIP INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
    resetValidationStyles();
    console.log('Student Portal with Infinite Scroll Animation loaded successfully!');
});