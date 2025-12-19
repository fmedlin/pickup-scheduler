// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

let currentEvent = null;

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
        currentEvent = event;
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
    
    // Display announcement
    displayAnnouncement(event);
    
    // Display RSVPs
    displayRsvps(event.rsvps);
}

function displayAnnouncement(event) {
    const section = document.getElementById('announcementSection');
    const textEl = document.getElementById('announcementText');
    const noAnnouncementEl = document.getElementById('noAnnouncement');
    const editBtn = document.getElementById('editAnnouncementBtn');
    
    section.classList.remove('hidden');
    
    // Only show edit button if user has organizer token
    const organizerToken = localStorage.getItem(`organizer_${eventId}`);
    if (organizerToken) {
        editBtn.classList.remove('hidden');
    } else {
        editBtn.classList.add('hidden');
    }
    
    if (event.announcement && event.announcement.trim()) {
        textEl.textContent = event.announcement;
        textEl.classList.remove('hidden');
        noAnnouncementEl.classList.add('hidden');
    } else {
        textEl.classList.add('hidden');
        noAnnouncementEl.classList.remove('hidden');
    }
}

function showAnnouncementForm() {
    const formEl = document.getElementById('announcementForm');
    const inputEl = document.getElementById('announcementInput');
    const textEl = document.getElementById('announcementText');
    const noAnnouncementEl = document.getElementById('noAnnouncement');
    const editBtn = document.getElementById('editAnnouncementBtn');
    
    inputEl.value = currentEvent.announcement || '';
    formEl.classList.remove('hidden');
    textEl.classList.add('hidden');
    noAnnouncementEl.classList.add('hidden');
    editBtn.classList.add('hidden');
    inputEl.focus();
    updateCharCounter('announcementInput', 'charCounter');
}

function hideAnnouncementForm() {
    const formEl = document.getElementById('announcementForm');
    const editBtn = document.getElementById('editAnnouncementBtn');
    
    formEl.classList.add('hidden');
    editBtn.classList.remove('hidden');
    displayAnnouncement(currentEvent);
}

async function saveAnnouncement() {
    const inputEl = document.getElementById('announcementInput');
    const announcement = inputEl.value.trim();
    
    // Get organizer token from localStorage
    const organizerToken = localStorage.getItem(`organizer_${eventId}`);
    
    if (!organizerToken) {
        alert('Error: You do not have permission to edit announcements');

      // Validate maximum length
    if (announcement.length > MAX_ANNOUNCEMENT_LENGTH) {
        alert(`Announcement is too long. Maximum length is ${MAX_ANNOUNCEMENT_LENGTH} characters. Current length: ${announcement.length}`);
        return;
    }
    
    try {
        const response = await fetch(`/api/events/${eventId}/announcement`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ announcement, organizerToken })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update announcement');
        }
        
        const data = await response.json();
        currentEvent = data.event;
        hideAnnouncementForm();
        displayAnnouncement(currentEvent);
        
    } catch (error) {
        alert('Error saving announcement: ' + error.message);
    }
}

// Announcement event listeners
document.getElementById('editAnnouncementBtn').addEventListener('click', showAnnouncementForm);
document.getElementById('cancelAnnouncementBtn').addEventListener('click', hideAnnouncementForm);
document.getElementById('saveAnnouncementBtn').addEventListener('click', saveAnnouncement);
document.getElementById('announcementInput').addEventListener('input', () => {
    updateCharCounter('announcementInput', 'charCounter');
});

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
