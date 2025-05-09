 // app.js
 document.addEventListener('DOMContentLoaded', () => {
    const calendar = new tui.Calendar('#calendar', {
        defaultView: 'month',
        taskView: true,
        template: {
            monthGridHeader: function(model) {
                const date = new Date(model.date);
                return `<span class="tui-full-calendar-weekday-grid-date">${date.getDate()}</span>`;
            }
        }
    });
    placeSVGs("dropdown-icon-1");
    placeSVGs("icon-1");
    placeSVGs("icon-2");

    document.getElementById("sign_in_out").addEventListener("click", function() {
        const signInOutButton = this;
        // Toggle the button text and class
        if (signInOutButton.innerText === "Sign In as Admin") {
            signInOutButton.innerText = "Sign Out";
            signInOutButton.classList.remove("bg-blue-500");
            signInOutButton.classList.add("bg-red-500");
            window.location.replace("/signin");
        } else {
            signInOutButton.innerText = "Sign In as Admin";
            signInOutButton.classList.remove("bg-red-500");
            signInOutButton.classList.add("bg-blue-500");
        }
    });
});

// SVG for Down icon
const downSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
    <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
  </svg>
`;

// SVG for Up icon
const upSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
    <path fill-rule="evenodd" d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
  </svg>
`;

function placeSVGs(id) {
  const icon = document.getElementById(id);
  if (icon) {
    icon.innerHTML = downSVG;
  }
}

// https://www.material-tailwind.com/docs/html/accordion
// Accordion functionality
// This function toggles the accordion content and changes the icon
// when the accordion header is clicked.
// It uses the index to identify which accordion item to toggle.
// The SVG icons are defined as strings and are inserted into the DOM
// when the accordion is opened or closed.
// The function also sets the max-height of the content to create a smooth
// opening and closing animation.
function toggleAccordion(index) {
  const content = document.getElementById(`content-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  // Toggle the content's max-height for smooth opening and closing
  if (content.style.maxHeight && content.style.maxHeight !== '0px') {
    content.style.maxHeight = '0';
    icon.innerHTML = upSVG;
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    icon.innerHTML = downSVG;
  }
}

// https://www.material-tailwind.com/docs/html/dropdown
// Dropdown functionality
// This function toggles the dropdown content and changes the icon
// when the dropdown header is clicked.
// It uses the index to identify which dropdown item to toggle.
// The SVG icons are defined as strings and are inserted into the DOM
// when the dropdown is opened or closed.
// The function also sets the display property of the dropdown content
// to create a smooth opening and closing effect.
// The dropdown content is initially hidden and is shown when the
// dropdown header is clicked.
// The function also changes the icon from a down arrow to an up arrow
// when the dropdown is opened, and back to a down arrow when it is closed.
// The SVG icons are defined as strings and are inserted into the DOM
// when the dropdown is opened or closed.
// The function uses the index to identify which dropdown item to toggle.
// The dropdown content is initially hidden and is shown when the
// dropdown header is clicked.
// The function also changes the icon from a down arrow to an up arrow
// when the dropdown is opened, and back to a down arrow when it is closed.
function toggleDropdown(index) {
  const dropdown = document.getElementById(`dropdown-${index}`);
  const icon = document.getElementById(`dropdown-icon-${index}`);

  // Toggle the dropdown's display
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
    icon.innerHTML = downSVG;
  } else {
    dropdown.style.display = 'block';
    icon.innerHTML = upSVG;
  }
}