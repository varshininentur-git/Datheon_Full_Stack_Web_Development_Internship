# TaskFlow – Dynamic Task Manager & Productivity Tracker

A simple, interactive, and responsive task management application built with HTML, CSS, and JavaScript. TaskFlow helps users organize their daily tasks, track productivity, manage deadlines, and monitor completed work.

This project was developed as **Task 2 of my Full Stack Web Development Internship**.


## ✨ Features

- **Create Tasks:** Add new tasks with a title, category, and optional due date.
- **Read Tasks:** View all saved tasks in an organized task list.
- **Edit Tasks:** Update task details whenever needed.
- **Delete Tasks:** Remove individual tasks.
- **Mark as Complete:** Track completed tasks with visual completion indicators.
- **Category Management:** Organize tasks into Work, Personal, Study, and Other categories.
- **Status Filters:** Filter tasks by All, Active, and Completed.
- **Quick Search:** Search tasks by title.
- **Productivity Dashboard:** View total, active, and completed task counts.
- **Progress Tracking:** Monitor task completion progress.
- **Due Date Indicators:** Identify overdue tasks, tasks due today, and upcoming deadlines.
- **Clear Completed Tasks:** Remove completed tasks with confirmation.
- **Persistent Storage:** Automatically save tasks using browser localStorage.
- **Responsive Design:** Use the application on desktop, tablet, and mobile screens.
- **Input Validation:** Prevent empty task titles.
- **Safe Text Rendering:** Display task titles as text rather than interpreting them as HTML.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling, animations, and responsive layout |
| JavaScript (ES6+) | Application logic and interactivity |
| DOM Manipulation | Dynamic task rendering and UI updates |
| Browser localStorage | Persistent task data storage |
| Git & GitHub | Version control and project hosting |

## 📂 Project Structure

```text
TaskManager/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
    └── taskflow-dashboard.png
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser such as Chrome, Safari, Firefox, or Edge.
- A code editor such as Visual Studio Code (optional).

No backend, database, package installation, or build process is required.

### Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/TaskFlow-Productivity-Tracker.git
```

Replace `YOUR_USERNAME` with your GitHub username and use your actual repository URL.

**2. Navigate to the project folder**

```bash
cd TaskFlow-Productivity-Tracker
```

**3. Run the application**

Open `index.html` directly in your browser.

Alternatively, open the project in VS Code and use the Live Server extension to launch it locally.

## 💡 How It Works

### Task Management

Users can create tasks by entering a title, selecting a category, and optionally choosing a due date. Tasks can then be edited, completed, or deleted.

### Search and Filtering

The application supports three status filters:

- **All:** Displays every task.
- **Active:** Displays incomplete tasks.
- **Completed:** Displays finished tasks.

The search feature helps users locate tasks by title and works alongside the selected status filter.

### Productivity Tracking

The dashboard automatically updates task counts and completion progress whenever tasks are added, edited, completed, or deleted.

Due-date indicators help users identify deadlines and prioritize their work.

### localStorage Persistence

TaskFlow uses the browser's localStorage API to store task data locally.

The application uses two helper functions:

- `saveToLocalStorage()` — saves task changes to browser storage.
- `loadFromLocalStorage()` — retrieves saved tasks when the application loads.

This allows tasks to remain available after a page refresh or browser restart in the same browser profile.

**Note:** Data is stored locally in the browser, not on a server. It is not automatically synchronized across devices or browsers.

## 🧪 Testing

The following checks can be used to verify the application:

- Add tasks with different categories and due dates.
- Edit existing tasks and verify the updated information.
- Mark tasks as completed and active.
- Delete individual tasks.
- Test the All, Active, and Completed filters.
- Search for tasks by title.
- Refresh the page and verify that saved tasks remain.
- Try submitting an empty task title.
- Test the layout on different screen sizes.

JavaScript syntax was checked using `node --check script.js`. Browser-based interaction testing should also be performed.

## 🎯 Learning Outcomes

Through this project, I practised:

- Building an interactive web application using vanilla JavaScript.
- Implementing CRUD operations.
- Managing application state and DOM updates.
- Working with browser localStorage.
- Handling user input and validation.
- Creating responsive layouts with CSS.
- Using Git and GitHub for version control.

## 🔮 Future Improvements

- Add drag-and-drop task reordering.
- Introduce task priorities and reminders.
- Add recurring tasks and calendar views.
- Support data export and import.
- Add user authentication and cloud synchronization.
