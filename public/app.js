document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        organizerName: document.getElementById('organizerName').value
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
