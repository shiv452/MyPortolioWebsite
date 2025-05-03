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
function toggleMenu(toggleButtonSelector, menuSelector, classToToggle) {
    const toggleButton = document.querySelector(toggleButtonSelector);
    const menu = document.querySelector(menuSelector);

    if (toggleButton && menu) {
        toggleButton.addEventListener('click', function () {
            menu.classList.toggle(classToToggle);
        });
    }
}

// Function to close the menu
function closeMenu(closeButtonSelector, menuSelector, classToRemove) {
    const closeButton = document.querySelector(closeButtonSelector);
    const menu = document.querySelector(menuSelector);

    if (closeButton && menu) {
        closeButton.addEventListener('click', function () {
            menu.classList.remove(classToRemove);
        });
    }
}

toggleMenu('.fas.fa-bars', 'nav ul', 'show');
closeMenu('.fas.fa-times', 'nav ul', 'show');



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
