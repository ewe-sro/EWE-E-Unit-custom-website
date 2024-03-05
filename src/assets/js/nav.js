//
//    Toggle Mobile Navigation
//
const navbarMenu = document.querySelector("header #mobile-menu");
const hamburgerMenu = document.querySelector("header #hamburger-menu");
const body = document.querySelector('body');

hamburgerMenu.addEventListener('click', function() {
    const isNavOpen = navbarMenu.classList.contains("open");
    if (!isNavOpen) {
        hamburgerMenu.setAttribute("aria-expanded", true);
        hamburgerMenu.classList.add("clicked");
        navbarMenu.classList.add("open");
        body.classList.add("mobile-menu");
    } else {
        hamburgerMenu.setAttribute("aria-expanded", false);
        hamburgerMenu.classList.remove("clicked");
        navbarMenu.classList.remove("open");
        body.classList.remove("mobile-menu");
    }
});


// Add scroll class to body element on scroll
document.addEventListener('scroll', (e) => {
    const scroll = document.documentElement.scrollTop;
    if (scroll >= 100) {
        body.classList.add('scroll')
    } else {
        body.classList.remove('scroll')
    }
});
