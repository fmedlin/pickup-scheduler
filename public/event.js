// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

if (!eventId) {
    showError('No event ID provided');
} else {
    loadEvent();
}

async function loadEvent() {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
            throw new Error('Event not found');
        }
        
        const event = await response.json();
        displayEvent(event);
        
    } catch (error) {
        showError('Error loading event: ' + error.message);
    }
}

function displayEvent(event) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('eventDetails').classList.remove('hidden');
    
    // Fill in event details
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventDate').textContent = formatDate(event.date);
    document.getElementById('eventTime').textContent = event.time;
    document.getElementById('eventLocation').textContent = event.location;
    document.getElementById('eventOrganizer').textContent = event.organizerName;
    
    // Display RSVPs
    displayRsvps(event.rsvps);
}

function displayRsvps(rsvps) {
    const goingList = document.getElementById('goingList');
    const notGoingList = document.getElementById('notGoingList');
    
    goingList.innerHTML = '';
    notGoingList.innerHTML = '';
    
    let goingCount = 0;
    let notGoingCount = 0;
    
    rsvps.forEach(rsvp => {
        const li = document.createElement('li');
        li.textContent = rsvp.playerName;
        
        if (rsvp.status === 'going') {
            goingList.appendChild(li);
            goingCount++;
        } else {
            notGoingList.appendChild(li);
            notGoingCount++;
        }
    });
    
    document.getElementById('goingCount').textContent = goingCount;
    document.getElementById('notGoingCount').textContent = notGoingCount;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showError(message) {
    document.getElementById('loading').classList.add('hidden');
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Handle RSVP form submission
document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        playerName: document.getElementById('playerName').value,
        status: document.querySelector('input[name="status"]:checked').value
    };
    
    try {
        const response = await fetch(`/api/events/${eventId}/rsvp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit RSVP');
        }
        
        const data = await response.json();
        
        // Show success message
        const messageDiv = document.getElementById('rsvpMessage');
        messageDiv.textContent = '✓ Your RSVP has been recorded!';
        messageDiv.className = 'message success';
        messageDiv.classList.remove('hidden');
        
        // Update the RSVP list
        displayRsvps(data.event.rsvps);
        
        // Reset form
        document.getElementById('rsvpForm').reset();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);
        
    } catch (error) {
        const messageDiv = document.getElementById('rsvpMessage');
        messageDiv.textContent = '✗ Error: ' + error.message;
        messageDiv.className = 'message error';
        messageDiv.classList.remove('hidden');
    }
});
