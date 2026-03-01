// ===== ProcastiNo Authentication System =====

/**
 * Create a new user account
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {object} - { success: boolean, message: string }
 */
function createAccount(name, email, password) {
    console.log('📝 Creating new account...');

    // Validation
    if (!name || name.trim().length === 0) {
        return { success: false, message: 'Please enter your name' };
    }

    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email' };
    }

    if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if email already exists
    if (emailExists(email)) {
        return { success: false, message: 'Email already registered. Please login instead.' };
    }

    // Get existing accounts
    let accounts = JSON.parse(localStorage.getItem('procastinoAccounts')) || [];

    // Create new account
    const newAccount = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password, // Plain text for demo
        createdAt: new Date().toISOString()
    };

    accounts.push(newAccount);
    localStorage.setItem('procastinoAccounts', JSON.stringify(accounts));

    console.log(`✅ Account created: ${newAccount.email}`);
    return { success: true, message: 'Account created successfully! Please login.' };
}

/**
 * Login user with email and password
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {object} - { success: boolean, message: string }
 */
function loginUser(email, password) {
    console.log('🔓 Attempting login...');

    // Validation
    if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email' };
    }

    if (!password) {
        return { success: false, message: 'Please enter your password' };
    }

    // Get accounts
    const accounts = JSON.parse(localStorage.getItem('procastinoAccounts')) || [];
    const account = accounts.find(a => a.email === email.trim().toLowerCase());

    if (!account) {
        return { success: false, message: 'Email not found. Please sign up first.' };
    }

    if (account.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Login successful - set current user
    const currentUser = {
        id: account.id,
        name: account.name,
        email: account.email
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log(`✅ Logged in: ${currentUser.name}`);

    return { success: true, message: 'Login successful!' };
}

/**
 * Logout current user
 */
function logoutUser() {
    console.log('🔒 Logging out...');
    localStorage.removeItem('currentUser');
    window.location.href = '/procastino-hackathon/login.html';
}

/**
 * Get currently logged-in user
 * @returns {object|null} - Current user object or null
 */
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Check if email already exists in accounts
 * @param {string} email - Email to check
 * @returns {boolean}
 */
function emailExists(email) {
    const accounts = JSON.parse(localStorage.getItem('procastinoAccounts')) || [];
    return accounts.some(a => a.email === email.trim().toLowerCase());
}

/**
 * Check authentication and redirect if needed
 * Call this on pages that require authentication
 */
function checkAuthAndRedirect() {
    const currentPage = window.location.pathname.toLowerCase();
    const isAuthPage = currentPage.includes('login.html') || currentPage.includes('signup.html') || currentPage === '/';
    const isLoggedIn = isUserLoggedIn();

    // If on auth pages but logged in, go to dashboard
    if (isAuthPage && isLoggedIn) {
        console.log('✅ User already logged in, redirecting to dashboard');
        window.location.href = '/procastino-hackathon/dashboard.html';
        return;
    }

    // If on dashboard but not logged in, go to login
    if (currentPage.includes('dashboard.html') && !isLoggedIn) {
        console.log('⛔ Not logged in, redirecting to login');
        window.location.href = '/procastino-hackathon/login.html';
        return;
    }
}

/**
 * Migrate old user data to user-specific keys
 * Called on first login to convert unnamespaced keys
 * @param {string} userId - User ID
 */
function migrateUserData(userId) {
    console.log(`🔄 Migrating user data for ${userId}...`);

    const oldKeys = ['procastinoTasks', 'procastinoChecklist', 'procastinoSchedule', 'procastinoGoals', 'procastinoPreferences', 'procastinoTheme'];

    oldKeys.forEach(oldKey => {
        const data = localStorage.getItem(oldKey);
        if (data) {
            const newKey = `${oldKey}_${userId}`;
            localStorage.setItem(newKey, data);
            console.log(`✅ Migrated: ${oldKey} → ${newKey}`);
        }
    });
}

/**
 * Get localStorage key for current user's data
 * @param {string} baseKey - Base key name (e.g., 'procastinoTasks')
 * @returns {string} - User-namespaced key
 */
function getUserDataKey(baseKey) {
    const user = getCurrentUser();
    if (!user) {
        console.error('No user logged in');
        return baseKey;
    }
    return `${baseKey}_${user.id}`;
}

console.log('✅ auth.js loaded');
