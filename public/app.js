document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const announcement = document.getElementById('announcement').value;
    
    // Validate announcement length
    const MAX_ANNOUNCEMENT_LENGTH = 500;
    if (announcement.length > MAX_ANNOUNCEMENT_LENGTH) {
        alert(`Announcement is too long. Maximum length is ${MAX_ANNOUNCEMENT_LENGTH} characters. Current length: ${announcement.length}`);
        return;
    }
    
    const formData = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        organizerName: document.getElementById('organizerName').value,
        announcement: announcement
    };
    
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create event');
        }
        
        const data = await response.json();
        
        // Show the result section
        document.getElementById('eventForm').style.display = 'none';
        const resultDiv = document.getElementById('result');
        resultDiv.classList.remove('hidden');
        
        // Set the invite link
        const fullLink = window.location.origin + data.inviteLink;
        document.getElementById('inviteLink').value = fullLink;
        
        // Setup copy button
        document.getElementById('copyBtn').addEventListener('click', async () => {
            const inviteLinkInput = document.getElementById('inviteLink');
            const btn = document.getElementById('copyBtn');
            const originalText = btn.textContent;
            
            try {
                await navigator.clipboard.writeText(inviteLinkInput.value);
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                inviteLinkInput.select();
                document.execCommand('copy');
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }
        });
        
    } catch (error) {
        alert('Error creating event: ' + error.message);
    }
});

// Character counter for announcement field
function updateCreateCharCounter() {
    const inputEl = document.getElementById('announcement');
    const counterEl = document.getElementById('createCharCounter');
    const MAX_ANNOUNCEMENT_LENGTH = 500;
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

document.getElementById('announcement').addEventListener('input', updateCreateCharCounter);
