// Shared constants for the application
const MAX_ANNOUNCEMENT_LENGTH = 500;

// Character counter utility function
function updateCharCounter(inputId, counterId) {
    const inputEl = document.getElementById(inputId);
    const counterEl = document.getElementById(counterId);
    const currentLength = inputEl.value.length;
    
    counterEl.textContent = `${currentLength} / ${MAX_ANNOUNCEMENT_LENGTH} characters`;
    
    // Add warning class if approaching or exceeding limit
    if (currentLength > MAX_ANNOUNCEMENT_LENGTH) {
        counterEl.className = 'char-counter char-counter-over';
    } else if (currentLength > MAX_ANNOUNCEMENT_LENGTH * 0.9) {
        counterEl.className = 'char-counter char-counter-warning';
    } else {
        counterEl.className = 'char-counter';
    }
}
