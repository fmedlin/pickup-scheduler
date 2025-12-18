# pickup-scheduler

A simple web application for organizing pickup soccer games. Create events, generate invite links, and track RSVPs from your friends.

## Features

- Create pickup soccer events with date, time, and location
- Generate shareable invite links
- Players can RSVP as "going" or "not going"
- View all responses in real-time
- Simple, mobile-friendly interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Create an Event**: Go to the home page and fill out the event creation form
2. **Share the Link**: Copy the generated invite link and share it with players
3. **Players RSVP**: Players visit the link and submit their response
4. **Track Responses**: View all RSVPs on the event page

## API Endpoints

- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/rsvp` - Submit an RSVP