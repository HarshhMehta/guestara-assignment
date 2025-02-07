# Assignment: ReactJs Frontend

## Project Overview

This project is a ReactJS application built with Vite that replicates the Mobiscroll monthly calendar timeline. The goal is to implement the calendar from scratch without using Mobiscroll libraries. The application includes event creation, dragging functionality, and state persistence.

## Features

- Drag events to move them between dates horizontally
- Drag to select a timeline and add an event
- Each event is assigned a different color
- Navigate to the previous or next months
- Add more resources in the Y-axis
- Highlight today's date
- Delete events with an alert popup
- add local storage even after a hard refresh

## How to Use
- Create an event: Double-click on the desired cell to add an event.
- Add Resources for more resources
- Move an event: Drag and drop the event to another time slot.
- Delete an event: Click on an event to delete it with a confirmation modal.


## Getting Started

### 1. Clone the Repository

```sh
git https://github.com/HarshhMehta/guestara-assignment.git
cd guestara-assignment
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Run the Development Server

```sh
npm run dev
```
 This will start the Vite development server. Open http://localhost:5173 in your browser to view the application.

### 4. Folder Structure

```sh
├── src
│   ├── assets        # Images and styles
│   ├── components    # Reusable UI components
│   ├── lib           # It combines class names using clsx and removes conflicting Tailwind classes using twMerge
│   ├── App.jsx       # Root component
│   ├── main.jsx      # Entry point
│   ├── App.css       # Global styles
│   ├── index.css     # Additional styles
├── public            # Static assets
├── package.json      # Project metadata and dependencies
├── package-lock.json # Dependency lock file
├── README.md         # Documentation
├── vite.config.js    # Vite configuration

```

### 5. 3 things that you learned from this assignment?
- how works the timeline
- How resizing works: Learned how to resize elements smoothly for better user experience.
- Drag-and-drop feature: Built a system to move events on the calendar using drag and drop.
- Setting up Vite: Understood how Vite speeds up development and improves performance.

### 6. What was the most difficult part of the assignment?

- Resizing issues left: Ensure elements resize smoothly without breaking the layout.
- set today the current date not fetch properly
### 7. What would you have done differently given more time?

- Fetching current date located
- Better event handling: Improve how overlapping events are managed.
- Smoother resizing: Make resizing events more user-friendly.
 
#### GitHub Repo: https://github.com/HarshhMehta/guestara-assignment.git
#### Live Demo: https://timeline-calendar-events.vercel.app/
