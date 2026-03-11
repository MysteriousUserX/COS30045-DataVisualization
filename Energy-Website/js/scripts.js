/**
 * PowerSmart Website Navigation Script
 * Handles page switching between Home, Televisions, and About Us
 */

/**
 * Shows the specified page and updates navigation active state
 * @param {string} pageName - The name of the page to show ('home', 'televisions', or 'about')
 */
function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  // Remove active state from all nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Show the selected page
  const selectedPage = document.getElementById("page-" + pageName);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  // Set active state on the corresponding nav link
  const selectedNavLink = document.getElementById("nav-" + pageName);
  if (selectedNavLink) {
    selectedNavLink.classList.add("active");
  }

  // Update the page title
  const pageTitles = {
    home: "PowerSmart - Home",
    televisions: "PowerSmart - Televisions",
    about: "PowerSmart - About Us",
  };
  document.title = pageTitles[pageName] || "PowerSmart";
}

// Initialize the page on load (ensure home is shown by default)
document.addEventListener("DOMContentLoaded", function () {
  showPage("home");
});
