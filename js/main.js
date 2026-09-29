// Small progressive enhancements. The site works fully without this file.
document.addEventListener('DOMContentLoaded', () => {
  // Keep the footer year current.
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Highlight today's row in the opening hours table.
  // data-day matches JavaScript's getDay(): 0 = Sunday ... 6 = Saturday.
  const today = document.querySelector(`.hours tr[data-day="${new Date().getDay()}"]`);
  if (today) today.classList.add('today');
});
