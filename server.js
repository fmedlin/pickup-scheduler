const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data storage
const events = new Map();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes

// Create a new event
app.post('/api/events', (req, res) => {
  const { title, date, time, location, organizerName } = req.body;
  
  if (!title || !date || !time || !location || !organizerName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const eventId = uuidv4();
  const event = {
    id: eventId,
    title,
    date,
    time,
    location,
    organizerName,
    createdAt: new Date().toISOString(),
    rsvps: []
  };
  
  events.set(eventId, event);
  
  res.status(201).json({
    event,
    inviteLink: `/event.html?id=${eventId}`
  });
});

// Get event details
app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  const event = events.get(eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  res.json(event);
});

// RSVP to an event
app.post('/api/events/:id/rsvp', (req, res) => {
  const eventId = req.params.id;
  const { playerName, status } = req.body;
  
  if (!playerName || !status) {
    return res.status(400).json({ error: 'Missing playerName or status' });
  }
  
  if (status !== 'going' && status !== 'not_going') {
    return res.status(400).json({ error: 'Status must be "going" or "not_going"' });
  }
  
  const event = events.get(eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  // Check if player already RSVP'd and update, otherwise add new
  const existingRsvpIndex = event.rsvps.findIndex(r => r.playerName === playerName);
  
  const rsvp = {
    playerName,
    status,
    timestamp: new Date().toISOString()
  };
  
  if (existingRsvpIndex >= 0) {
    event.rsvps[existingRsvpIndex] = rsvp;
  } else {
    event.rsvps.push(rsvp);
  }
  
  res.json({
    message: 'RSVP recorded successfully',
    rsvp,
    event
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Pickup Scheduler server running on http://localhost:${PORT}`);
});
