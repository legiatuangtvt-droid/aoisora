// ===== Get navigation buttons =====
const goToMonthButton = document.getElementById('go-to-month'); // Sửa lại ID cho đúng
// ===== Redirect helpers =====
const redirectTo = (path) => window.location.href = path;

// ===== Event listeners =====
goToMonthButton.addEventListener('click', () => redirectTo('month.html'));
