////////////////////////
/// DARK MODE SYSTEM ///
////////////////////////

const html = document.documentElement
const darkmodeSwitch = document.querySelector("#darkmode-switch")


// helper functions to toggle dark mode
function enableDarkMode() {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
}
function disableDarkMode() {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
}

// determines a new users dark mode preferences
function detectColourScheme() {
  // default to the light theme
  let theme = 'light';

  // check the localstorage for a saved 'theme' variable. if it's there, the user has visited before, so apply the necessary theme choices
  if (localStorage.getItem('theme')) {
    theme = localStorage.getItem('theme');
  }
  // if it's not there, check to see if the user has applied dark mode preferences themselves in the browser
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark';
  }

  // if there is no preference set, the default of light will be used. apply accordingly
  theme === 'dark' ? enableDarkMode() : disableDarkMode();
}

// run on page load
detectColourScheme();

// add event listener to the dark mode button toggle
darkmodeSwitch.addEventListener("change", (event) => {
  // on click, check localstorage for the dark mode value, use to apply the opposite of what's saved
  localStorage.getItem('theme') === 'light' ? enableDarkMode(event) : disableDarkMode(event);
});

////////////////////////
///                  ///
////////////////////////



////////////////////////////
/// SIDEBAR MENU TOGGLE ///
///////////////////////////

const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
const bodyElement = document.querySelector('body');

sidebarToggles.forEach((item) => {
    const onClick = () => {
        bodyElement.classList.toggle('sidebar');
    }
    item.addEventListener('click', onClick);
});

///////////////////////////
///                     ///
///////////////////////////


/////////////////////////////
/// MODAL TOGGLE FUNCTION ///
/////////////////////////////

function toggleModal(controllerUid) {
    const bodyElement = document.querySelector('body');

    let modalClass = `modal-${controllerUid}`

    // Toggle the body classes
    bodyElement.classList.toggle("modal");
    bodyElement.classList.toggle(modalClass);

    // Find the modal and remove the 'hidden' class
    let modalElement = document.querySelector(`#controller-modals #controller-${modalClass}`);
    modalElement.classList.toggle("hidden");
}

///////////////////////////
///                     ///
///////////////////////////



/////////////////////////////
/// SIDEBAR SETTINGS LINK ///
/////////////////////////////

let settingsLink = document.querySelector("#settings-link");

// Find the current URL and change the port number from 81 to 80
currentUrl = window.location.origin
newUrl = currentUrl.replace(":81", ":80")

settingsLink.href = newUrl

/////////////////////////////
///                       ///
/////////////////////////////