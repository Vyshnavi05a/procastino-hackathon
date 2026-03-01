// ===== Dashboard Tab Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ProcastiNo Dashboard Initializing...');

    // ===== AUTH CHECK =====
    // Prevent unauthorized access to dashboard
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    console.log(`✅ User logged in as: ${user.name} (${user.email})`);

    try {
        initializeTabs();
        initializeTaskForm();
        initializeSidebarLinks();
        initializeTaskList();
        initializeGoalForm();
        initializeSmoothScroll();
        updateMotivationalQuote();

        // Check if we're on dashboard page
        if (document.body.classList.contains('dashboard-page')) {
            initializeCoach();
            initializeAIChat();
            smartChecklist = new SmartChecklist();
            schedule = new Schedule();
        }

        console.log('✅ All components initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
});

// ===== Motivational Quotes (Defined Early) =====
const motivationalQuotes = [
    '"The secret of getting ahead is getting started." - Mark Twain',
    '"You don\'t have to see the whole staircase, just take the first step." - Martin Luther King Jr.',
    '"The best way to get started is to quit talking and begin doing." - Walt Disney',
    '"Success is not final, failure is not fatal." - Winston Churchill',
    '"Don\'t watch the clock; do what it does. Keep going." - Sam Levenson',
    '"The future depends on what you do today." - Mahatma Gandhi',
    '"Your limitation—it\'s only your imagination." - Unknown',
    '"Great things never came from comfort zones." - Unknown',
    '"Dream it. Wish it. Do it." - Unknown',
    '"Success doesn\'t just find you. You have to go out and get it." - Unknown'
];

function getRandomQuote() {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

function updateMotivationalQuote() {
    const dateDisplay = document.querySelector('.date-display');
    if (dateDisplay) {
        dateDisplay.textContent = 'Today\'s Motivation: ' + getRandomQuote();
    }
}

function initializeTabs() {
    const tabLinks = document.querySelectorAll('.sidebar-link[data-tab]');
    console.log(`📌 Found ${tabLinks.length} tab links to initialize`);

    if (tabLinks.length === 0) {
        console.warn('⚠️ No tab links found! Check .sidebar-link[data-tab] selectors');
    }

    tabLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);

            console.log(`📑 Switching to tab: ${tabId}`);

            if (!tabContent) {
                console.error(`❌ Tab content not found for: ${tabId}`);
                return;
            }

            // Remove active class from all tabs and links
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            document.querySelectorAll('.sidebar-link').forEach(l => {
                l.classList.remove('active');
            });

            // Add active class to clicked tab and link
            tabContent.classList.add('active');
            this.classList.add('active');
            console.log(`✅ Tab switched to: ${tabId}`);
        });
    });
}

function initializeSidebarLinks() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    console.log(`🔗 Initializing Sidebar Links...`);
    console.log(`  - Found ${sidebarLinks.length} sidebar links`);

    if (sidebarLinks.length === 0) {
        console.warn('⚠️ No sidebar links found!');
        return;
    }

    sidebarLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🔗 Sidebar link ${index} clicked: ${this.textContent.trim()}`);
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            console.log(`✅ Active state updated`);
        });
    });
    console.log(`✅ Sidebar links initialized`);
}

// ===== Task Form Management =====
function initializeTaskForm() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskFormContainer = document.getElementById('taskFormContainer');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');

    console.log('🎯 Initializing Task Form...');
    console.log(`  - Add Task Button: ${addTaskBtn ? '✅' : '❌'}`);
    console.log(`  - Form Container: ${taskFormContainer ? '✅' : '❌'}`);
    console.log(`  - Save Button: ${saveTaskBtn ? '✅' : '❌'}`);
    console.log(`  - Cancel Button: ${cancelTaskBtn ? '✅' : '❌'}`);

    if (!addTaskBtn) {
        console.warn('⚠️ Task form elements not found!');
        return;
    }

    addTaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('📝 Add Task clicked');
        taskFormContainer.style.display = 'block';
        document.getElementById('taskTitle').focus();
    });

    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Cancel Task clicked');
            taskFormContainer.style.display = 'none';
            clearTaskForm();
        });
    }

    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('💾 Save Task clicked');
            saveTask();
        });
    }
}

function clearTaskForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskDue').value = '';
    document.getElementById('taskPriority').value = 'medium';
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDesc').value.trim();
    const dueDate = document.getElementById('taskDue').value;
    const priority = document.getElementById('taskPriority').value;

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];

    // Create new task object
    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        completed: false
    };

    // Add to tasks array
    tasks.push(newTask);

    // Save to localStorage
    localStorage.setItem(getUserDataKey('procastinoTasks'), JSON.stringify(tasks));

    // Add task to DOM
    addTaskToDOM(newTask);

    // Update deadline list
    populateDeadlineList();

    // Clear form and hide
    clearTaskForm();
    document.getElementById('taskFormContainer').style.display = 'none';

    // Show success message
    showNotification('Task added successfully!');
}

function addTaskToDOM(task) {
    const tasksList = document.getElementById('tasksList');

    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.priority}`;
    taskCard.setAttribute('data-task-id', task.id);

    const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';

    taskCard.innerHTML = `
        <div class="task-header">
            <h3>${escapeHtml(task.title)}</h3>
            <span class="priority-badge ${task.priority}">${task.priority}</span>
        </div>
        <p class="task-description">${task.description ? escapeHtml(task.description) : 'No description'}</p>
        <div class="task-footer">
            <span class="due-date">📅 Due: ${dueDateStr}</span>
            <div class="task-actions">
                <button class="task-btn complete" title="Mark complete">✓</button>
                <button class="task-btn delete" title="Delete task">✕</button>
            </div>
        </div>
    `;

    // Add event listeners
    const completeBtn = taskCard.querySelector('.task-btn.complete');
    const deleteBtn = taskCard.querySelector('.task-btn.delete');

    completeBtn.addEventListener('click', function() {
        completeTask(task.id, taskCard);
    });

    deleteBtn.addEventListener('click', function() {
        deleteTask(task.id, taskCard);
    });

    tasksList.appendChild(taskCard);
}

function completeTask(taskId, element) {
    let tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];
    tasks = tasks.map(t => {
        if (t.id === taskId) {
            t.completed = !t.completed;
        }
        return t;
    });

    localStorage.setItem(getUserDataKey('procastinoTasks'), JSON.stringify(tasks));

    // Update deadline list
    populateDeadlineList();

    element.style.opacity = '0.6';
    element.querySelector('h3').style.textDecoration = 'line-through';

    showNotification('Task status updated!');
}

function deleteTask(taskId, element) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    let tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];
    tasks = tasks.filter(t => t.id !== taskId);

    localStorage.setItem(getUserDataKey('procastinoTasks'), JSON.stringify(tasks));

    // Update deadline list
    populateDeadlineList();

    element.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        element.remove();
    }, 300);

    showNotification('Task deleted!');
}

function initializeTaskList() {
    const tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];
    const tasksList = document.getElementById('tasksList');

    if (tasksList && tasks.length > 0) {
        tasksList.innerHTML = ''; // Clear default task
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    // Also populate the deadline list with upcoming deadlines
    populateDeadlineList();
}

// ===== Populate Upcoming Deadlines Widget =====
function populateDeadlineList() {
    const deadlineList = document.querySelector('.deadline-list');
    if (!deadlineList) return;

    const tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];
    const scheduleItems = JSON.parse(localStorage.getItem(getUserDataKey('procastinoSchedule'))) || [];

    // Collect all upcoming deadlines
    const deadlines = [];

    // Add task deadlines
    tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
            deadlines.push({
                date: task.dueDate,
                title: task.title,
                type: 'task'
            });
        }
    });

    // Add schedule deadlines
    scheduleItems.forEach(item => {
        if (item.date && !item.completed) {
            deadlines.push({
                date: item.date,
                title: item.title,
                type: 'scheduled'
            });
        }
    });

    // Sort by date and get the next 5
    deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcomingDeadlines = deadlines.slice(0, 5);

    // Clear and populate the deadline list
    deadlineList.innerHTML = '';

    if (upcomingDeadlines.length === 0) {
        deadlineList.innerHTML = '<p style="color: var(--gray-medium); text-align: center; padding: 1rem;">📭 No upcoming deadlines yet!</p>';
        return;
    }

    upcomingDeadlines.forEach(deadline => {
        const dateObj = new Date(deadline.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });

        const deadlineItem = document.createElement('div');
        deadlineItem.className = 'deadline-item';
        deadlineItem.innerHTML = `
            <div class="deadline-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="deadline-info">
                <h4>${deadline.title}</h4>
                <p>${deadline.type === 'scheduled' ? '📅 Scheduled' : '🎯 Due'}</p>
            </div>
        `;
        deadlineList.appendChild(deadlineItem);
    });
}

// ===== Goal Form Management =====
function initializeGoalForm() {
    const addGoalBtn = document.getElementById('addGoalBtn');

    console.log('🎯 Initializing Goal Form...');
    console.log(`  - Add Goal Button: ${addGoalBtn ? '✅' : '❌'}`);

    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Add Goal clicked');
            const goalTitle = prompt('Enter your goal title:');

            if (!goalTitle) {
                console.log('⚠️ Goal creation cancelled');
                return;
            }

            const goals = JSON.parse(localStorage.getItem(getUserDataKey('procastinoGoals'))) || [];

            const newGoal = {
                id: Date.now(),
                title: goalTitle,
                progress: 0
            };

            goals.push(newGoal);
            localStorage.setItem(getUserDataKey('procastinoGoals'), JSON.stringify(goals));
            console.log(`✅ Goal saved: "${goalTitle}"`);

            showNotification('Goal added successfully!');
        });
        console.log('✅ Goal form initialized');
    } else {
        console.warn('⚠️ Add Goal button not found!');
    }
}

// ===== Smooth Scroll =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Notification System =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #7DDFAF, #A8E6CF);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== Add Animations to CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Dashboard Statistics Update =====
function updateDashboardStats() {
    const tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];
    const completedTasks = tasks.filter(t => t.completed).length;

    // Update completed tasks stat if element exists
    // Find the stat card with the correct text content
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const heading = card.querySelector('h3');
        if (heading && heading.textContent.includes('Tasks Completed')) {
            const statNumber = card.querySelector('.stat-number');
            if (statNumber) {
                statNumber.textContent = completedTasks;
            }
        }
    });
}

// Update stats on page load
if (document.body.classList.contains('dashboard-page')) {
    updateDashboardStats();
}

// ===== Checkbox Functionality on Overview Tab =====
document.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox' && e.target.closest('.task-list')) {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
            taskItem.classList.toggle('completed');
        }
    }
});

// ===== Auto-save User Preferences =====
document.addEventListener('change', function(e) {
    // Save notification preferences
    if (e.target.closest('.toggle-item')) {
        const preferences = {
            taskReminders: document.querySelectorAll('.toggle-item input')[0]?.checked || true,
            dailyMotivation: document.querySelectorAll('.toggle-item input')[1]?.checked || true,
            emailNotifications: document.querySelectorAll('.toggle-item input')[2]?.checked || false
        };
        localStorage.setItem(getUserDataKey('procastinoPreferences'), JSON.stringify(preferences));
    }

    // Save theme preference
    if (e.target.name === 'theme') {
        const theme = e.target.value;
        localStorage.setItem(getUserDataKey('procastinoTheme'), theme);
        applyTheme(theme);
    }
});

// ===== Apply Theme =====
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#1f2937';
        document.body.style.color = '#f8f9fa';
    } else {
        document.body.style.backgroundColor = '#f8f9fa';
        document.body.style.color = '#1f2937';
    }
}

// Load theme on page load
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem(getUserDataKey('procastinoTheme')) || 'light';
    applyTheme(savedTheme);
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search (can be extended for search functionality)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('taskTitle')?.focus();
    }

    // Escape to close forms
    if (e.key === 'Escape') {
        const formContainer = document.getElementById('taskFormContainer');
        if (formContainer && formContainer.style.display !== 'none') {
            formContainer.style.display = 'none';
        }
    }
});

// ===== Progress Bar Animation =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target.querySelector('.progress-fill');
            if (fill) {
                fill.style.animation = 'none';
                setTimeout(() => {
                    fill.style.animation = 'progressAnimation 0.6s ease';
                }, 10);
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.progress-bar').forEach(bar => {
    observer.observe(bar);
});

const progressStyle = document.createElement('style');
progressStyle.textContent = `
    @keyframes progressAnimation {
        from {
            width: 0 !important;
        }
    }
`;
document.head.appendChild(progressStyle);

// ===== Animated Coach Character =====
let coachQuoteIndex = 0;
let coachMessageType = 'quote'; // 'quote' or 'deadline'

const coachMotivationalQuotes = [
    "Let's crush those goals! 💪",
    "You're doing amazing! Keep it up! 🌟",
    "Every task completed is a step forward! 📚",
    "Procrastination is just a word - ignore it! ⚡",
    "You've got this! Trust yourself! 🚀",
    "Stay focused, stay motivated! 🎯",
    "Great effort today! Keep pushing! 💥",
    "Your future self will thank you! 🎉",
    "One small step at a time! You're unstoppable! 💫",
    "Success is built on small wins like this! 🏆",
    "Believe in yourself - you deserve it! ✨",
    "This is your moment to shine! 🌈"
];

const coachDeadlineMessages = [
    "Don't forget your upcoming deadline! 📅",
    "Time to tackle that assignment! 📝",
    "Your goal is waiting for you! 🎯",
    "Let's finish strong! 💪",
    "Deadline alert - you can do this! ⏰"
];

const coachRescheduleMessages = [
    "⏰ Don't worry! I've moved this task to a better time. You've got this! 💪",
    "🔄 I've rescheduled this task for you. Let's tackle it together! 🎯",
    "📅 Moved this to a fresh new time. No worries, you're still on track! 🚀",
    "🆕 New deadline set! This is your fresh start. Let's do this! ✨",
    "💫 Rescheduled! Remember, every day is a chance to make progress! 🌟"
];

function initializeCoach() {
    console.log('🏆 Initializing Coach Character...');

    const closeCoachBtn = document.getElementById('closeCoach');
    const coachCharacter = document.getElementById('coachCharacter');
    const coachContainer = document.getElementById('coachContainer');

    console.log(`  - Close Coach Button: ${closeCoachBtn ? '✅' : '❌'}`);
    console.log(`  - Coach Character: ${coachCharacter ? '✅' : '❌'}`);
    console.log(`  - Coach Container: ${coachContainer ? '✅' : '❌'}`);

    if (closeCoachBtn) {
        closeCoachBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🏆 Close Coach button clicked');
            const coachContainer = document.getElementById('coachContainer');
            coachContainer.style.animation = 'coachHide 0.4s ease forwards';
            setTimeout(() => {
                coachContainer.style.display = 'none';
                console.log('✅ Coach hidden');
            }, 400);
        });
    }

    if (coachCharacter) {
        coachCharacter.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('💬 Coach character clicked');
            updateCoachMessage();
        });
    }

    // Initialize coach with first quote
    updateCoachMessage();
    console.log('✅ Coach initialized');

    // Update coach message every 4-6 minutes randomly
    setInterval(() => {
        // 70% chance for quote, 30% chance for deadline reminder
        const shouldShowDeadline = Math.random() < 0.3;

        if (shouldShowDeadline) {
            console.log('⏰ Coach showing deadline reminder');
            showDeadlineReminder();
        } else {
            console.log('💭 Coach updating message');
            updateCoachMessage();
        }
    }, Math.random() * 120000 + 240000); // 4-6 minutes

    // Check for nearby deadlines every 10 minutes
    setInterval(checkUpcomingDeadlines, 600000);
}

function updateCoachMessage() {
    const bubbleText = document.getElementById('bubbleText');
    if (!bubbleText) return;

    const quote = coachMotivationalQuotes[coachQuoteIndex];
    bubbleText.textContent = quote;
    coachQuoteIndex = (coachQuoteIndex + 1) % coachMotivationalQuotes.length;

    // Trigger bubble animation
    const speechBubble = document.getElementById('speechBubble');
    if (speechBubble) {
        speechBubble.style.animation = 'none';
        setTimeout(() => {
            speechBubble.style.animation = 'bubbleAppear 0.4s ease';
        }, 10);
    }

    // Slight coach bounce when talking
    const coachBody = document.querySelector('.coach-body');
    if (coachBody) {
        coachBody.style.animation = 'none';
        setTimeout(() => {
            coachBody.style.animation = 'coachBounce 2s ease-in-out infinite';
        }, 10);
    }
}

function showDeadlineReminder() {
    const bubbleText = document.getElementById('bubbleText');
    const speechBubble = document.getElementById('speechBubble');

    if (!bubbleText || !speechBubble) return;

    // First check for upcoming scheduled tasks
    const scheduleItems = JSON.parse(localStorage.getItem(getUserDataKey('procastinoSchedule'))) || [];
    const today = new Date().toISOString().split('T')[0];

    const upcomingScheduled = scheduleItems.filter(item => {
        return !item.completed && item.date >= today;
    });

    if (upcomingScheduled.length > 0) {
        // Sort by date and time
        upcomingScheduled.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });

        const nextScheduled = upcomingScheduled[0];
        const scheduleDate = new Date(nextScheduled.date);
        const today = new Date();
        const daysUntil = Math.ceil((scheduleDate - today) / (1000 * 60 * 60 * 24));

        let timeStr = '';
        if (nextScheduled.time) {
            const [hours, minutes] = nextScheduled.time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            timeStr = ` at ${displayHour}:${minutes} ${ampm}`;
        }

        let message = '';
        if (daysUntil <= 0) {
            message = `⏰ ${nextScheduled.title}${timeStr} - TODAY! Let's focus! 🎯`;
        } else if (daysUntil === 1) {
            message = `📅 "${nextScheduled.title}"${timeStr} is scheduled for tomorrow! Prepare now! 💪`;
        } else {
            message = `📌 Don't forget "${nextScheduled.title}"${timeStr} in ${daysUntil} days! 🚀`;
        }

        bubbleText.textContent = message;
    } else {
        // Fall back to task deadlines if no scheduled tasks
        const tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];
        const incompleteTasks = tasks.filter(t => !t.completed && t.dueDate);

        if (incompleteTasks.length > 0) {
            // Sort by due date
            incompleteTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            const nextTask = incompleteTasks[0];
            const dueDate = new Date(nextTask.dueDate);
            const today = new Date();
            const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            let message = '';
            if (daysUntil <= 0) {
                message = `⚠️ "${nextTask.title}" is due TODAY! Let's go! 🔥`;
            } else if (daysUntil === 1) {
                message = `⏰ "${nextTask.title}" is due tomorrow! You can do this! 💪`;
            } else {
                message = `📌 "${nextTask.title}" is due in ${daysUntil} days. Plan ahead! 🎯`;
            }

            bubbleText.textContent = message;
        } else {
            bubbleText.textContent = coachDeadlineMessages[Math.floor(Math.random() * coachDeadlineMessages.length)];
        }
    }

    // Trigger bubble animation
    speechBubble.style.animation = 'none';
    setTimeout(() => {
        speechBubble.style.animation = 'bubbleAppear 0.4s ease';
    }, 10);
}

function checkUpcomingDeadlines() {
    const tasks = JSON.parse(localStorage.getItem(getUserDataKey('procastinoTasks'))) || [];
    const scheduleItems = JSON.parse(localStorage.getItem(getUserDataKey('procastinoSchedule'))) || [];
    const today = new Date().toISOString().split('T')[0];

    // Check scheduled items first (they have priority in reminders)
    const upcomingScheduled = scheduleItems.filter(item => {
        return !item.completed && item.date >= today;
    });

    if (upcomingScheduled.length > 0) {
        upcomingScheduled.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });

        const nextScheduled = upcomingScheduled[0];
        const scheduleDate = new Date(nextScheduled.date);
        const today_date = new Date();
        const daysUntil = Math.ceil((scheduleDate - today_date) / (1000 * 60 * 60 * 24));

        // Show reminder if deadline is within 3 days
        if (daysUntil <= 3 && daysUntil >= 0) {
            // 50% chance to show deadline reminder during the check
            if (Math.random() < 0.5) {
                showDeadlineReminder();
            }
        }
    } else {
        // Fall back to task deadlines
        const incompleteTasks = tasks.filter(t => !t.completed && t.dueDate);

        if (incompleteTasks.length > 0) {
            incompleteTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            const nextTask = incompleteTasks[0];
            const dueDate = new Date(nextTask.dueDate);
            const today_date = new Date();
            const daysUntil = Math.ceil((dueDate - today_date) / (1000 * 60 * 60 * 24));

            // Show reminder if deadline is within 3 days
            if (daysUntil <= 3 && daysUntil >= 0) {
                // 50% chance to show deadline reminder during the check
                if (Math.random() < 0.5) {
                    showDeadlineReminder();
                }
            }
        }
    }
}

// Coach and AI Chat initialization is now in main DOMContentLoaded above
// ===== AI Chat Integration with Backend =====
// The API key is now securely stored on the server in .env file
const API_BASE_URL = 'https://procastino-hackathon.onrender.com/api'; // Backend API endpoint

let chatHistory = [];

function initializeAIChat() {
    const chatSendBtn = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatMinimizeBtn = document.getElementById('chatMinimize');
    const chatCloseBtn = document.getElementById('chatClose');
    const chatPanel = document.getElementById('chatPanel');

    console.log('🤖 Initializing AI Chat...');
    console.log(`  - Chat Send Button: ${chatSendBtn ? '✅' : '❌'}`);
    console.log(`  - Chat Input: ${chatInput ? '✅' : '❌'}`);
    console.log(`  - Chat Minimize Button: ${chatMinimizeBtn ? '✅' : '❌'}`);
    console.log(`  - Chat Close Button: ${chatCloseBtn ? '✅' : '❌'}`);
    console.log(`  - Chat Panel: ${chatPanel ? '✅' : '❌'}`);

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📤 Chat send button clicked');
            sendChatMessage();
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter key pressed in chat input');
                sendChatMessage();
            }
        });
    }

    if (chatMinimizeBtn) {
        chatMinimizeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const chatMessages = document.getElementById('chatMessages');
            const chatInputArea = document.querySelector('.chat-input-area');

            if (chatMessages.style.display === 'none') {
                chatMessages.style.display = 'flex';
                chatInputArea.style.display = 'flex';
                chatMinimizeBtn.textContent = '−';
                console.log('📂 Chat expanded');
            } else {
                chatMessages.style.display = 'none';
                chatInputArea.style.display = 'none';
                chatMinimizeBtn.textContent = '+';
                console.log('📁 Chat minimized');
            }
        });
    }

    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            chatPanel.style.animation = 'chatSlideOut 0.4s ease forwards';
            setTimeout(() => {
                chatPanel.style.display = 'none';
                console.log('❌ Chat closed');
            }, 400);
        });
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) {
        console.log('⚠️ Empty message, ignoring');
        return;
    }

    console.log(`💬 Sending message: ${message.substring(0, 50)}...`);

    // Add user message to chat
    addMessageToChat(message, 'user');
    chatInput.value = '';

    // Show loading indicator
    showLoadingMessage();

    // Send to backend API
    sendToBackend(message);
}

function addMessageToChat(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;

    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';

    // For assistant messages with list content, preserve formatting
    if (sender === 'assistant' && typeof content === 'string') {
        contentElement.innerHTML = content;
    } else {
        contentElement.textContent = content;
    }

    messageElement.appendChild(contentElement);
    chatMessages.appendChild(messageElement);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event delegation for Assign to Schedule button at document level
document.addEventListener('click', (e) => {
    if (e.target.id === 'assignToScheduleBtn' || e.target.closest('#assignToScheduleBtn')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('📅 Assign to Schedule button clicked via event delegation');

        if (!schedule) {
            console.error('❌ Schedule object not initialized');
            alert('Schedule system not ready. Please refresh the page.');
            return;
        }

        if (schedule.pendingScheduleTasks) {
            console.log('📋 Pending tasks:', schedule.pendingScheduleTasks);
            const { tasks, taskTitle } = schedule.pendingScheduleTasks;
            console.log('📋 Opening modal with tasks:', tasks);
            schedule.openModal(tasks, taskTitle);
        } else {
            console.error('❌ No pending tasks stored');
            alert('No tasks to schedule. The AI response should have created tasks first.');
        }
    }
}, true);  // Use capture phase for better event handling

function showLoadingMessage() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingElement = document.createElement('div');
    loadingElement.className = 'chat-message assistant loading';
    loadingElement.id = 'loadingMessage';

    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.textContent = 'Thinking...';

    loadingElement.appendChild(contentElement);
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

async function sendToBackend(userMessage) {
    try {
        // Call backend API endpoint
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        const data = await response.json();

        // Remove loading message
        removeLoadingMessage();

        // Extract and display the response
        if (data.success && data.message) {
            const assistantMessage = data.message;

            // Format the message (convert plain text lists to HTML)
            const formattedMessage = formatAssistantMessage(assistantMessage);
            addMessageToChat(formattedMessage, 'assistant');
        } else {
            addMessageToChat('Sorry, I couldn\'t understand that. Please try again!', 'assistant');
        }
    } catch (error) {
        removeLoadingMessage();
        console.error('Chat error:', error);
        addMessageToChat(`Error: ${error.message}. Please check your connection and try again.`, 'assistant');
    }
}

function formatAssistantMessage(text) {
    let formatted = text;
    let hasChecklist = false;
    let checklistItems = [];

    // Convert numbered lists to HTML and capture items
    formatted = formatted.replace(/^(\d+)\.\s+\[\s*\]\s+(.+)$/gm, (match, num, itemText) => {
        hasChecklist = true;
        checklistItems.push(itemText.trim());
        return `<div style="margin: 0.5rem 0;"><input type="checkbox" style="margin-right: 0.5rem; cursor: pointer;"> <label style="cursor: pointer;">${itemText}</label></div>`;
    });

    // Convert bullet points with [ ] to checkboxes
    formatted = formatted.replace(/^[-•]\s+\[\s*\]\s+(.+)$/gm, (match, itemText) => {
        hasChecklist = true;
        checklistItems.push(itemText.trim());
        return `<div style="margin: 0.5rem 0;"><input type="checkbox" style="margin-right: 0.5rem; cursor: pointer;"> <label style="cursor: pointer;">${itemText}</label></div>`;
    });

    // Convert regular numbered lists
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<div style="margin: 0.5rem 0;">$1. $2</div>');

    // Convert bullet points
    formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<div style="margin: 0.5rem 0;">• $1</div>');

    // Convert line breaks to paragraphs
    formatted = formatted.split('\n\n').map(p => p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : '').join('');

    // Add schedule button if checklist was detected
    if (hasChecklist && checklistItems.length > 0) {
        console.log('✅ Checklist detected with items:', checklistItems);

        // Store the items on the Schedule instance instead of embedding in HTML
        if (schedule) {
            schedule.pendingScheduleTasks = {
                tasks: checklistItems,
                taskTitle: 'AI Task Breakdown'
            };
            console.log('✅ Stored pending tasks on schedule object');
        } else {
            console.warn('⚠️ Schedule object not available yet');
        }

        formatted += `
            <div style="margin-top: 1rem; text-align: center;">
                <button class="schedule-action-button" id="assignToScheduleBtn" style="cursor: pointer;">📅 Assign to Schedule</button>
            </div>
        `;
        console.log('✅ Added Assign to Schedule button to formatted message');
    }

    return formatted;
}

// ===== Smart Checklist =====
class SmartChecklist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem(getUserDataKey('procastinoChecklist'))) || [];
        this.init();
    }

    init() {
        const addBtn = document.getElementById('addChecklistBtn');
        const saveBtn = document.getElementById('saveChecklistBtn');
        const cancelBtn = document.getElementById('cancelChecklistBtn');

        console.log('📋 Initializing Smart Checklist...');
        console.log(`  - Add Button: ${addBtn ? '✅' : '❌'}`);
        console.log(`  - Save Button: ${saveBtn ? '✅' : '❌'}`);
        console.log(`  - Cancel Button: ${cancelBtn ? '✅' : '❌'}`);

        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📋 Add checklist item clicked');
                this.showForm();
            });
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('💾 Save checklist item clicked');
                this.saveItem();
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 Cancel checklist form clicked');
                this.hideForm();
            });
        }

        this.render();
        console.log('✅ Smart Checklist initialized');

        // Initialize missed task detection if on dashboard
        if (document.body.classList.contains('dashboard-page')) {
            this.setupMissedTaskDetection();
        }
    }

    showForm() {
        document.getElementById('checklistFormContainer').style.display = 'block';
        document.getElementById('checklistTitle').focus();
    }

    hideForm() {
        document.getElementById('checklistFormContainer').style.display = 'none';
        this.clearForm();
    }

    clearForm() {
        document.getElementById('checklistTitle').value = '';
        document.getElementById('checklistDesc').value = '';
        document.getElementById('checklistDue').value = '';
        document.getElementById('checklistPriority').value = 'medium';
    }

    saveItem() {
        const title = document.getElementById('checklistTitle').value.trim();
        const desc = document.getElementById('checklistDesc').value.trim();
        const due = document.getElementById('checklistDue').value;
        const priority = document.getElementById('checklistPriority').value;

        if (!title) {
            alert('Please enter a task title');
            return;
        }

        const item = {
            id: Date.now(),
            title,
            description: desc,
            dueDate: due,
            originalDueDate: due,
            priority,
            completed: false,
            isMissed: false,
            rescheduledCount: 0,
            createdAt: new Date().toISOString()
        };

        this.items.push(item);
        this.save();
        this.render();
        this.hideForm();
        showNotification('Task added to checklist! 🎯');
    }

    toggleItem(id) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.completed = !item.completed;
            this.save();
            this.render();

            if (item.completed) {
                showNotification('Great job! Task completed! 🎉');
            }
        }
    }

    deleteItem(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        this.items = this.items.filter(i => i.id !== id);
        this.save();
        this.render();
        showNotification('Task removed! 🗑️');
    }

    save() {
        localStorage.setItem(getUserDataKey('procastinoChecklist'), JSON.stringify(this.items));
    }

    getActiveItems() {
        return this.items.filter(i => !i.completed);
    }

    getCompletedItems() {
        return this.items.filter(i => i.completed);
    }

    formatDate(dateString) {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Due today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Due tomorrow';

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    isUrgent(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
        return daysDiff <= 1;
    }

    renderItem(item) {
        const container = document.createElement('div');
        container.className = `checklist-item ${item.priority} ${item.completed ? 'completed' : ''} ${item.isMissed ? 'checklist-item-missed' : ''}`;
        container.setAttribute('data-id', item.id);

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'checklist-checkbox-wrapper';
        const checkbox = document.createElement('input');
        checkbox.className = 'checklist-checkbox';
        checkbox.type = 'checkbox';
        checkbox.checked = item.completed;
        checkbox.addEventListener('change', () => this.toggleItem(item.id));
        checkboxWrapper.appendChild(checkbox);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'checklist-content-wrapper';

        const title = document.createElement('h4');
        title.className = 'checklist-title';
        title.textContent = item.title;

        // Add rescheduled badge if task was missed and rescheduled
        if (item.isMissed && item.rescheduledCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'rescheduled-badge';
            badge.textContent = `⚠️ Rescheduled ${item.rescheduledCount}x`;
            title.appendChild(badge);
        }

        if (item.description) {
            const desc = document.createElement('p');
            desc.className = 'checklist-description';
            desc.textContent = item.description;
            contentWrapper.appendChild(desc);
        }

        const meta = document.createElement('div');
        meta.className = 'checklist-meta';

        if (item.dueDate) {
            const dueDate = document.createElement('span');
            dueDate.className = `checklist-due-date ${this.isUrgent(item.dueDate) ? 'urgent' : ''}`;
            dueDate.textContent = `📅 ${this.formatDate(item.dueDate)}`;
            meta.appendChild(dueDate);
        }

        const badge = document.createElement('span');
        badge.className = `checklist-priority-badge ${item.priority}`;
        badge.textContent = item.priority;
        meta.appendChild(badge);

        contentWrapper.appendChild(title);
        contentWrapper.appendChild(meta);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'checklist-delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => this.deleteItem(item.id));

        container.appendChild(checkboxWrapper);
        container.appendChild(contentWrapper);
        container.appendChild(deleteBtn);

        return container;
    }

    render() {
        const activeContainer = document.getElementById('activeChecklist');
        const completedContainer = document.getElementById('completedChecklist');

        if (!activeContainer || !completedContainer) return;

        // Clear containers
        activeContainer.innerHTML = '';
        completedContainer.innerHTML = '';

        const active = this.getActiveItems();
        const completed = this.getCompletedItems();

        // Render active items
        if (active.length === 0) {
            activeContainer.innerHTML = '<div class="empty-state"><p>📝 No active tasks yet. Use the AI assistant to break down a big task, or add one manually!</p></div>';
        } else {
            active.forEach(item => {
                activeContainer.appendChild(this.renderItem(item));
            });
        }

        // Render completed items
        if (completed.length === 0) {
            completedContainer.innerHTML = '<div class="empty-state"><p>🎉 No completed tasks yet. Start checking some off!</p></div>';
        } else {
            completed.forEach(item => {
                completedContainer.appendChild(this.renderItem(item));
            });
        }
    }

    setupMissedTaskDetection() {
        // Check for missed tasks immediately
        detectAndHandleMissedTasks();

        // Check every 10 minutes
        setInterval(() => {
            detectAndHandleMissedTasks();
        }, 600000);
    }
}

// Initialize checklist when DOM is ready
let smartChecklist;
// SmartChecklist initialization is now in main DOMContentLoaded above

// Add checklist items from AI responses
function addAIChecklistItems(items, taskTitle) {
    if (!smartChecklist) return;

    items.forEach((itemText, index) => {
        // Clean up the text (remove checkbox markers if present)
        let cleanText = itemText.replace(/^[\s\-•*\d.)\]]*\s*\[\s*\]\s*/i, '').trim();

        const item = {
            id: Date.now() + index,
            title: cleanText || itemText,
            description: `Part of: ${taskTitle}`,
            dueDate: '',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        };

        smartChecklist.items.push(item);
    });

    smartChecklist.save();
    smartChecklist.render();
    showNotification('Checklist items added! Check the Smart Checklist tab 🎯');
}

// ===== Schedule System =====
class Schedule {
    constructor() {
        this.items = JSON.parse(localStorage.getItem(getUserDataKey('procastinoSchedule'))) || [];
        this.pendingScheduleTasks = null;
        this.init();
    }

    init() {
        const scheduleModalOverlay = document.getElementById('scheduleModalOverlay');
        const scheduleModalClose = document.getElementById('scheduleModalClose');
        const scheduleModalSave = document.getElementById('scheduleModalSave');
        const scheduleModalCancel = document.getElementById('scheduleModalCancel');

        console.log('📅 Initializing Schedule System...');
        console.log(`  - Modal Overlay: ${scheduleModalOverlay ? '✅' : '❌'}`);
        console.log(`  - Modal Close Button: ${scheduleModalClose ? '✅' : '❌'}`);
        console.log(`  - Modal Save Button: ${scheduleModalSave ? '✅' : '❌'}`);
        console.log(`  - Modal Cancel Button: ${scheduleModalCancel ? '✅' : '❌'}`);

        if (scheduleModalClose) {
            scheduleModalClose.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📅 Schedule modal close clicked');
                this.closeModal();
            });
        }
        if (scheduleModalCancel) {
            scheduleModalCancel.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📅 Schedule modal cancel clicked');
                this.closeModal();
            });
        }
        if (scheduleModalSave) {
            scheduleModalSave.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📅 Schedule modal save clicked');
                this.saveScheduledTasks();
            });
        }

        this.render();
        console.log('✅ Schedule system initialized');
    }

    openModal(tasks, taskTitle = 'Tasks') {
        this.pendingScheduleTasks = { tasks, taskTitle };
        const modalContent = document.getElementById('scheduleModalContent');
        const modalOverlay = document.getElementById('scheduleModalOverlay');

        if (!modalContent) return;

        modalContent.innerHTML = '';

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'modal-task-item';
            taskItem.innerHTML = `
                <h4>${escapeHtml(task)}</h4>
                <div class="modal-task-inputs">
                    <div class="modal-input-group">
                        <label>Date</label>
                        <input type="date" class="schedule-date-input" data-index="${index}" required>
                    </div>
                    <div class="modal-input-group">
                        <label>Time</label>
                        <input type="time" class="schedule-time-input" data-index="${index}">
                    </div>
                </div>
            `;
            modalContent.appendChild(taskItem);
        });

        modalOverlay.style.display = 'flex';
    }

    closeModal() {
        const modalOverlay = document.getElementById('scheduleModalOverlay');
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
        this.pendingScheduleTasks = null;
    }

    saveScheduledTasks() {
        if (!this.pendingScheduleTasks) return;

        const { tasks, taskTitle } = this.pendingScheduleTasks;
        const dateInputs = document.querySelectorAll('.schedule-date-input');
        const timeInputs = document.querySelectorAll('.schedule-time-input');

        tasks.forEach((taskText, index) => {
            const date = dateInputs[index]?.value;
            const time = timeInputs[index]?.value || '09:00';

            if (!date) {
                alert(`Please set a date for: ${taskText}`);
                return;
            }

            const scheduleItem = {
                id: Date.now() + index,
                title: taskText,
                date: date,
                time: time,
                description: `From: ${taskTitle}`,
                completed: false,
                aiGenerated: true,
                createdAt: new Date().toISOString()
            };

            this.items.push(scheduleItem);
        });

        this.save();
        this.render();
        this.closeModal();
        showNotification('📅 Tasks scheduled successfully!');
    }

    toggleItem(id) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.completed = !item.completed;
            this.save();
            this.render();

            if (item.completed) {
                showNotification('Schedule item completed! ✅');
            }
        }
    }

    deleteItem(id) {
        if (!confirm('Remove this scheduled task?')) return;

        this.items = this.items.filter(i => i.id !== id);
        this.save();
        this.render();
        showNotification('Scheduled task removed 🗑️');
    }

    save() {
        localStorage.setItem(getUserDataKey('procastinoSchedule'), JSON.stringify(this.items));
        // Update deadline list when schedule changes
        populateDeadlineList();
    }

    getItemsByDate(dateStr) {
        return this.items
            .filter(i => i.date === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time));
    }

    getAllDates() {
        const dates = new Set(this.items.map(i => i.date));
        return Array.from(dates).sort();
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const options = { weekday: 'long', month: 'short', day: 'numeric' };

        if (date.toDateString() === today.toDateString()) return `Today`;
        if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow`;

        return date.toLocaleDateString('en-US', options);
    }

    formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    isUpcoming(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        return date >= today;
    }

    render() {
        const scheduleView = document.getElementById('scheduleView');
        if (!scheduleView) return;

        if (this.items.length === 0) {
            scheduleView.innerHTML = `
                <div class="empty-state">
                    <p>📅 No scheduled tasks yet. Ask the AI to break down a task and click "Assign to Schedule"!</p>
                </div>
            `;
            return;
        }

        scheduleView.innerHTML = '';
        const dates = this.getAllDates();

        dates.forEach(date => {
            const dayTasks = this.getItemsByDate(date);
            const isUpcoming = this.isUpcoming(date);

            const dayContainer = document.createElement('div');
            dayContainer.className = 'schedule-day';

            const dayHeader = document.createElement('div');
            dayHeader.className = `schedule-day-header ${isUpcoming ? 'upcoming' : ''}`;
            dayHeader.textContent = this.formatDate(date);

            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'schedule-tasks';

            dayTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'schedule-task';

                const timeElement = document.createElement('div');
                timeElement.className = 'schedule-time';
                timeElement.textContent = this.formatTime(task.time);

                const infoElement = document.createElement('div');
                infoElement.className = 'schedule-task-info';
                infoElement.innerHTML = `
                    <h4 class="schedule-task-title" style="${task.completed ? 'text-decoration: line-through; color: var(--gray-medium);' : ''}">${escapeHtml(task.title)}</h4>
                    <p class="schedule-task-meta">${escapeHtml(task.description)}</p>
                `;

                const actionsElement = document.createElement('div');
                actionsElement.className = 'schedule-task-actions';

                const completeBtn = document.createElement('button');
                completeBtn.className = 'schedule-task-btn';
                completeBtn.textContent = task.completed ? '✓' : '○';
                completeBtn.style.opacity = task.completed ? '1' : '0.6';
                completeBtn.addEventListener('click', () => this.toggleItem(task.id));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'schedule-task-btn';
                deleteBtn.textContent = '✕';
                deleteBtn.style.color = 'var(--danger)';
                deleteBtn.style.background = 'rgba(239, 68, 68, 0.1)';
                deleteBtn.addEventListener('click', () => this.deleteItem(task.id));

                actionsElement.appendChild(completeBtn);
                actionsElement.appendChild(deleteBtn);

                taskElement.appendChild(timeElement);
                taskElement.appendChild(infoElement);
                taskElement.appendChild(actionsElement);

                tasksContainer.appendChild(taskElement);
            });

            dayContainer.appendChild(dayHeader);
            dayContainer.appendChild(tasksContainer);
            scheduleView.appendChild(dayContainer);
        });
    }
}

// Initialize schedule when DOM is ready
let schedule;
// Schedule initialization is now in main DOMContentLoaded above

// ===== Smart Task Rescheduling System =====

function detectAndHandleMissedTasks() {
    if (!smartChecklist) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const missedTasks = smartChecklist.items.filter(item => {
        if (item.completed || item.isMissed) return false; // Skip completed and already missed tasks

        if (!item.dueDate) return false; // Skip tasks without due dates

        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today; // Task is in the past and not completed
    });

    // Show modal for first missed task if any exist
    if (missedTasks.length > 0) {
        console.log(`🚨 Found ${missedTasks.length} missed task(s)`);
        promptRescheduleTask(missedTasks[0]);
    }
}

function promptRescheduleTask(task) {
    const modal = document.getElementById('rescheduleModalOverlay');
    if (!modal) return;

    // Set modal content
    document.getElementById('rescheduleTaskTitle').textContent = `Reschedule: ${task.title}`;
    document.getElementById('rescheduleOriginalDate').textContent = formatDateForDisplay(task.dueDate);

    // Set default date to today
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('rescheduleNewDate').value = dateString;
    document.getElementById('rescheduleNewTime').value = '09:00';

    // Show modal
    modal.style.display = 'flex';

    // Event listeners
    const confirmBtn = document.getElementById('rescheduleConfirmBtn');
    const dismissBtn = document.getElementById('rescheduleDismissBtn');

    const handleConfirm = () => {
        const newDate = document.getElementById('rescheduleNewDate').value;
        const newTime = document.getElementById('rescheduleNewTime').value;

        if (newDate && newTime) {
            console.log(`📅 Rescheduling "${task.title}" to ${newDate} at ${newTime}`);
            rescheduleTask(task, newDate, newTime);
            closeRescheduleModal();
        } else {
            alert('Please select a date and time');
        }
    };

    const handleDismiss = () => {
        console.log(`⏭️ Dismissed rescheduling for "${task.title}"`);
        closeRescheduleModal();
    };

    const closeRescheduleModal = () => {
        modal.style.display = 'none';
        confirmBtn.removeEventListener('click', handleConfirm);
        dismissBtn.removeEventListener('click', handleDismiss);
    };

    confirmBtn.addEventListener('click', handleConfirm);
    dismissBtn.addEventListener('click', handleDismiss);

    // Also close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeRescheduleModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function rescheduleTask(task, newDate, newTime) {
    // Update task in SmartChecklist
    task.dueDate = newDate;
    task.isMissed = true;
    task.rescheduledCount = (task.rescheduledCount || 0) + 1;

    // Save to localStorage
    smartChecklist.save();
    smartChecklist.render();

    // Add to Schedule
    if (schedule) {
        const newScheduleItem = {
            id: Date.now(),
            title: task.title,
            date: newDate,
            time: newTime,
            description: `Rescheduled from: ${task.originalDueDate || task.dueDate}`,
            completed: false,
            aiGenerated: false,
            createdAt: new Date().toISOString()
        };

        schedule.items.push(newScheduleItem);
        schedule.save();
        schedule.render();

        console.log(`✅ Task rescheduled and added to schedule`);
    }

    // Show notification from coach
    showRescheduledNotification(task, newDate, newTime);

    // Show success message
    showNotification(`Task rescheduled to ${formatDateForDisplay(newDate)} at ${newTime}! 📅`);
}

function showRescheduledNotification(task, newDate, newTime) {
    const bubbleText = document.getElementById('bubbleText');
    if (!bubbleText) return;

    // Pick a random rescheduling message
    const message = coachRescheduleMessages[Math.floor(Math.random() * coachRescheduleMessages.length)];

    // Replace placeholders if message contains them
    const finalMessage = message
        .replace('[title]', task.title)
        .replace('[date]', formatDateForDisplay(newDate))
        .replace('[time]', formatTimeForDisplay(newTime));

    bubbleText.textContent = finalMessage;

    // Trigger animation
    const speechBubble = document.getElementById('speechBubble');
    if (speechBubble) {
        speechBubble.style.animation = 'none';
        setTimeout(() => {
            speechBubble.style.animation = 'bubbleAppear 0.4s ease';
        }, 10);
    }

    // Trigger coach bounce
    const coachCharacter = document.getElementById('coachCharacter');
    if (coachCharacter) {
        coachCharacter.style.animation = 'none';
        setTimeout(() => {
            coachCharacter.style.animation = 'coachBounce 2s infinite';
        }, 10);
    }
}

function formatDateForDisplay(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTimeForDisplay(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${meridiem}`;
}
