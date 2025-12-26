// ===== Get navigation buttons =====
const monthScreen = document.getElementById('go-to-hq-tasks');
// ===== Redirect helpers =====
const redirectTo = (path) => window.location.href = path;

// ===== Event listeners =====
goToHQTasksButton.addEventListener('click', () => redirectTo('month.html'));
