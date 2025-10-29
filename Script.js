/* ---------- SLIDESHOWS ---------- */
function initSlideshow(containerSelector) {
  const slides = document.querySelectorAll(containerSelector + ' img');
  if (!slides.length) return;
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
  initSlideshow('.hero-slideshow');
  initSlideshow('.prijs-slideshow');
  initSlideshow('.booking-slideshow');
  initSlideshow('.about-slideshow');

  // type shoot toggle
  const typeShoot = document.getElementById('type_shoot');
  const fotoOpties = document.getElementById('foto_opties');
  const videoOpties = document.getElementById('video_opties');
  if (typeShoot) {
    typeShoot.addEventListener('change', function() {
      if (this.value === 'foto') {
        fotoOpties.style.display = 'block';
        videoOpties.style.display = 'none';
      } else if (this.value === 'video') {
        videoOpties.style.display = 'block';
        fotoOpties.style.display = 'none';
      } else {
        fotoOpties.style.display = 'none';
        videoOpties.style.display = 'none';
      }
    });
  }

  /* ---------- LIGHTBOX ---------- */
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
  if (closeBtn) closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });

  /* ---------- CALENDAR ---------- */
  // persistent schedule in localStorage
  const STORAGE_KEY = 'bl4ckeye_busySchedule_v1';
  let busySchedule = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  const calendarEl = document.getElementById('calendar');
  const monthYearEl = document.getElementById('monthYear');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const selectedDayEl = document.getElementById('selectedDay');
  const timeSlotsEl = document.getElementById('timeSlots');
  const toggleBusyBtn = document.getElementById('toggleBusyBtn');
  const addTimeBtn = document.getElementById('addTimeBtn');

  let currentDate = new Date();
  let selectedDateString = null;

  function saveSchedule() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(busySchedule));
  }

  function renderCalendar() {
    calendarEl.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    // Create weekday headers (Ma..Zo)
    const weekNames = ['Ma','Di','Wo','Do','Vr','Za','Zo'];
    // If first render, add headers
    if (!calendarEl.dataset.headers) {
      weekNames.forEach(w => {
        const h = document.createElement('div');
        h.textContent = w;
        h.style.fontWeight = '700';
        h.style.opacity = '0.7';
        calendarEl.appendChild(h);
      });
      calendarEl.dataset.headers = '1';
    }

    // offset (convert Sunday=0 to last position)
    let offset = firstWeekday === 0 ? 6 : firstWeekday - 1;
    for (let i = 0; i < offset; i++) {
      const empty = document.createElement('div');
      calendarEl.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const dateString = dt.toISOString().split('T')[0];
      const div = document.createElement('div');
      div.classList.add('day');
      div.textContent = d;

      if (busySchedule[dateString]) div.classList.add('busy');
      else div.classList.add('available');

      div.addEventListener('click', () => {
        selectedDateString = dateString;
        showDayDetails(dateString, d);
      });

      calendarEl.appendChild(div);
    }
  }

  function showDayDetails(dateString, dayNumber) {
    selectedDayEl.textContent = `📅 ${dayNumber} — ${dateString}`;
    timeSlotsEl.innerHTML = '';
    const slots = busySchedule[dateString] || [];
    if (slots.length) {
      slots.forEach((slot, idx) => {
        const li = document.createElement('li');
        li.textContent = `❌ ${slot}`;
        // add remove button
        const btn = document.createElement('button');
        btn.textContent = 'Verwijder';
        btn.style.marginLeft = '8px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
          busySchedule[dateString].splice(idx,1);
          if (busySchedule[dateString].length === 0) delete busySchedule[dateString];
          saveSchedule(); renderCalendar(); showDayDetails(dateString, dayNumber);
        };
        li.appendChild(btn);
        timeSlotsEl.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = '✅ Hele dag beschikbaar';
      timeSlotsEl.appendChild(li);
    }
  }

  toggleBusyBtn.addEventListener('click', () => {
    if (!selectedDateString) return alert('Klik eerst op een dag in de kalender.');
    if (busySchedule[selectedDateString]) {
      delete busySchedule[selectedDateString];
    } else {
      busySchedule[selectedDateString] = ['Hele dag bezet'];
    }
    saveSchedule();
    renderCalendar();
    // show details for the selected date (find day number)
    const parts = selectedDateString.split('-');
    showDayDetails(selectedDateString, Number(parts[2]));
  });

  addTimeBtn.addEventListener('click', () => {
    if (!selectedDateString) return alert('Klik eerst op een dag in de kalender.');
    const time = prompt('Voeg tijdslot toe (bijv. 09:00 - 11:00):');
    if (time && time.trim()) {
      if (!busySchedule[selectedDateString]) busySchedule[selectedDateString] = [];
      busySchedule[selectedDateString].push(time.trim());
      saveSchedule();
      renderCalendar();
      const parts = selectedDateString.split('-');
      showDayDetails(selectedDateString, Number(parts[2]));
    }
  });

  prevBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
  nextBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

  // initial render
  renderCalendar();

  // if there are values in busySchedule, keep selection to today
  const todayKey = new Date().toISOString().split('T')[0];
  if (busySchedule[todayKey]) {
    selectedDateString = todayKey;
    showDayDetails(todayKey, new Date().getDate());
  }

}); // DOMContentLoaded
