// Slideshow functie
function initSlideshow(slideClass){
  const slides = document.querySelectorAll(slideClass);
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 3000);
}

initSlideshow('.hero-slideshow img');
initSlideshow('.prijs-slideshow img');
initSlideshow('.booking-slideshow img');
initSlideshow('.about-slideshow img');

// Type shoot dropdown
const typeShoot = document.getElementById('type_shoot');
const fotoOpties = document.getElementById('foto_opties');
const videoOpties = document.getElementById('video_opties');

typeShoot.addEventListener('change', function(){
  if(this.value === 'foto'){
    fotoOpties.style.display = 'block';
    videoOpties.style.display = 'none';
  } else if(this.value === 'video'){
    videoOpties.style.display = 'block';
    fotoOpties.style.display = 'none';
  } else {
    fotoOpties.style.display = 'none';
    videoOpties.style.display = 'none';
  }
});

// Gallery lightbox
const galleryImages = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});

// Kalender
// === KALENDER SCRIPT ===
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const selectedDay = document.getElementById("selectedDay");
const timeSlots = document.getElementById("timeSlots");

let currentDate = new Date();

const busySchedule = {
  "2025-11-29": ["16:00 - 22:00", "20:00 - 00:00"],
  "2025-11-28": ["10:30-12:30","20:30-23:30"],
  "2025-11-25": ["17:30-21:30"],
  "2025-11-22": ["11:30-14:30"],
"2025-11-24": ["19:00 -23:00"],
"2025-11-07": ["20:00-22:00"],
"2025-12-06": ["bezet"],
"2025-12-13": ["20:00-01:00"],

};

function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Januari","Februari","Maart","April","Mei","Juni",
    "Juli","Augustus","September","Oktober","November","December"
  ];

  monthYear.textContent = `${monthNames[month]} ${year}`;

  // Voeg lege cellen toe voor dagen vóór de eerste
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // Voeg dagen toe
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateString = date.toISOString().split("T")[0];
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = i;

    if (busySchedule[dateString]) {
      div.classList.add("busy");
    } else {
      div.classList.add("available");
    }

    div.addEventListener("click", () => showDayDetails(dateString, i));

    calendar.appendChild(div);
  }
}

function showDayDetails(dateString, day) {
  selectedDay.textContent = `📅 ${day} ${monthYear.textContent}`;
  timeSlots.innerHTML = "";

  if (busySchedule[dateString]) {
    busySchedule[dateString].forEach(time => {
      const li = document.createElement("li");
      li.textContent = `❌ ${time}`;
      timeSlots.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "✅ Hele dag beschikbaar";
    timeSlots.appendChild(li);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
