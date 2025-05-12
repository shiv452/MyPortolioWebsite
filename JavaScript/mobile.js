// Js for Handling the About Skill, Education and Exp. section
    var tabLinks = document.getElementsByClassName('tab-links');
    var tabContents = document.getElementsByClassName('tab-contents');

    function openTab(tabName) {
        for (tabLink of tabLinks) {
            tabLink.classList.remove('active-link');
        }
        for (tabContent of tabContents) {
            tabContent.classList.remove('active-tab');
        }
        event.currentTarget.classList.add('active-link');
        document.getElementById(tabName).classList.add('active-tab');
    }

    // JavaScript for handling the mobile navigation menu
    // document.querySelector('.fas.fa-bars').addEventListener('click', function () {
    //     document.querySelector('nav ul').classList.toggle('show');
    // });

    // document.querySelector('.fas.fa-times').addEventListener('click', function () {
    //     document.querySelector('nav ul').classList.remove('show');
    // });
    // Function to toggle the visibility of the menu
    function toggleMenu(toggleButtonSelector, menuSelector, classToToggle, closeButtonSelector) {
        const toggleButton = document.querySelector(toggleButtonSelector);
        const menu = document.querySelector(menuSelector);
        const closeButton = document.querySelector(closeButtonSelector);
    
        if (toggleButton && menu && closeButton) {
            toggleButton.addEventListener('click', function () {
                menu.classList.toggle(classToToggle);
                // Toggle the visibility of close and hamburger icons
                closeButton.style.display = menu.classList.contains(classToToggle) ? 'block' : 'none';
                toggleButton.style.display = menu.classList.contains(classToToggle) ? 'none' : 'block';
            });
        }
    }
    
    // Function to close the menu (for clicking the close icon)
    function closeMenu(closeButtonSelector, menuSelector, classToRemove, toggleButtonSelector) {
        const closeButton = document.querySelector(closeButtonSelector);
        const menu = document.querySelector(menuSelector);
        const toggleButton = document.querySelector(toggleButtonSelector);
    
        if (closeButton && menu && toggleButton) {
            closeButton.addEventListener('click', function () {
                menu.classList.remove(classToRemove);
                // Show the hamburger icon and hide the close icon
                toggleButton.style.display = 'block';
                closeButton.style.display = 'none';
            });
        }
    }
    
    toggleMenu('.fas.fa-bars', 'nav ul', 'show', '.fas.fa-times');
    closeMenu('.fas.fa-times', 'nav ul', 'show', '.fas.fa-bars');
    


    //typing Text Animation
    document.addEventListener('DOMContentLoaded', function () {
    var typed = new Typed(".typing", {
        strings: [
            "Associate QA Engineer",
            "Data Scientist",
            "Web Developer",
            "YouTuber",
        ],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });
});
