const searchIcon = document.querySelector(".searchbar svg");
const searchbar = document.querySelector(".searchbar input");


var tl = gsap.timeline();



tl.from(".logo", {
    y: -20,
    opacity: 0,
    duration: 0.3,
    delay: 0.5,
    ease: "power3.out"
})
    .from(".buttons button", {
        y: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.2") // overlap with previous
    .from(".searchbar", {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power3.out"
    }, "-=0.1"); // small overlap



searchbar.addEventListener("focus", () => {
    gsap.to(searchbar, {
        width: "45vw",
        duration: 0.4,
        ease: "power2.out"
    });
});

searchbar.addEventListener("blur", () => {
    gsap.to(searchbar, {
        width: "40vw",
        duration: 0.4,
        ease: "power2.inOut"
    });
});


searchIcon.addEventListener("click", () => {
    gsap.fromTo(searchIcon,
        { scale: 1 },
        { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
});

var map = L.map('map').setView([28.754046, 77.495854], 13); // SF coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// Marker variable
var marker;

// Search function
function searchLocation() {
  var query = document.getElementById("locationInput").value;
  if (!query) return;

  // Call Nominatim API
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        var lat = data[0].lat;
        var lon = data[0].lon;

        // Move map
        map.setView([lat, lon], 12);

        // Add marker
        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${data[0].display_name}</b>`).openPopup();
      } else {
        alert("Location not found!");
      }
    })
    .catch(err => console.error(err));
}



// Inline Mini Calendar below date input
document.addEventListener('DOMContentLoaded', () => {
  const dateInputEl = document.getElementById('dateInput');
  const miniCalEl = document.getElementById('miniCalendar');

  if (!dateInputEl || !miniCalEl) return;

  // Initialize current month based on input value or today
  let currentMonth = dateInputEl.value ? new Date(dateInputEl.value) : new Date();
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

  const monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function formatISO(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function getSelectedDate() {
    if (!dateInputEl.value) return null;
    const d = new Date(dateInputEl.value);
    return isNaN(d) ? null : d;
  }

  function renderMiniCalendar() {
    const selected = getSelectedDate();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingWeekday = firstDay.getDay(); // 0-6 (Sun-Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Header
    let html = '<div class="mc-header">'
      + '<button type="button" class="mc-prev" aria-label="Previous month">&#8592;</button>'
      + `<div class="mc-title">${monthNames[month]} ${year}</div>`
      + '<button type="button" class="mc-next" aria-label="Next month">&#8594;</button>'
      + '</div>';

    // Weekday row
    html += '<div class="mc-grid">';
    for (const wd of weekDays) {
      html += `<div class="mc-weekday">${wd}</div>`;
    }

    // Empty leading cells
    for (let i = 0; i < startingWeekday; i++) {
      html += '<div class="mc-day empty"></div>';
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(year, month, day);
      const selClass = selected && sameDay(thisDate, selected) ? ' selected' : '';
      html += `<button type="button" class="mc-day${selClass}" data-day="${day}">${day}</button>`;
    }
    html += '</div>'; // end mc-grid

    miniCalEl.innerHTML = html;

    // Hook up navigation
    miniCalEl.querySelector('.mc-prev').addEventListener('click', () => {
      currentMonth = new Date(year, month - 1, 1);
      renderMiniCalendar();
    });
    miniCalEl.querySelector('.mc-next').addEventListener('click', () => {
      currentMonth = new Date(year, month + 1, 1);
      renderMiniCalendar();
    });

    // Day selection
    miniCalEl.querySelectorAll('.mc-day:not(.empty)').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.getAttribute('data-day'), 10);
        const picked = new Date(year, month, d);
        dateInputEl.value = formatISO(picked);
        renderMiniCalendar();
      });
    });
  }

  // Sync calendar when input changes externally
  dateInputEl.addEventListener('change', () => {
    const selected = getSelectedDate();
    if (selected) {
      currentMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
    renderMiniCalendar();
  });

  // Initial render
  renderMiniCalendar();
});

