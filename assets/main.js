/**Getting all elements nneed from DOM */
const monthEl = document.querySelector(".date h1");
const daysEl = document.querySelector(".days");
const fullDateEl = document.querySelector(".date p");
const prevNextIcon = document.querySelectorAll("span");

/** Getting current Month and Year  */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


/** Function to get schedules dates from backend */
async function getShedules() {
  fullDateEl.innerText = currentYear;
  window.scheduledDates = {}

  await fetch('backend/api.php', {
    method: 'get',
  }).then((response) => response.json())
    .then((data) => {
      scheduledDates = data.schedule;
    })
    .catch(console.error);

  populateDates(scheduledDates)
}

/**Function to populates the day of the months */
function populateDates(dates) {

  //Calculate the first day and last day of the current month
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay() - 1;

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

//Get current month based on index and show it on the html page
  month = months[currentMonth];
  monthEl.innerText = month;

  let days = "";

  //Check for dates that dont belong to the month
  for (let i = firstDay; i > 0; i--) {
    days += `<div class="empty"></div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    //Check if the current data from loop is scheduled
    const isScheduled = dates.find(date =>date.year == fullDateEl.textContent && date.month == month && date.day == i);
    if (isScheduled) {
      days += `<div class="selected">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  daysEl.innerHTML = days;
}

//Function to add new scheduled date
async function updateSelectedDates() {

  let savedScheduledDates = window.scheduledDates;
  let updatedDates = [];
  const selectedDates = document.querySelectorAll('.selected');
  selectedDates.forEach(item => {

    //Check if date is not currently scheduled
    const scheduleExist = savedScheduledDates.find(schedule => schedule.year == fullDateEl.textContent && schedule.month == monthEl.textContent && schedule.day == item.textContent);
    if (!scheduleExist) {
      updatedDates.push({ 'year': fullDateEl.textContent, 'month': monthEl.textContent, 'day': item.textContent })
    }

  });

  //Send a request to the server to add new scheduled date
  try {
    const res = await fetch('backend/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedDates)
    });

    const resData = await res.text();
    getShedules()
  } catch (err) {
    console.log(err.message);
  }
}

//Function to delete schdule date
async function deleteSelectedDate(element) {
  //Get the date do delete
  let deleteSchedule = { 'year': fullDateEl.textContent, 'month': monthEl.textContent, 'day': element.textContent };

  //Send data to be deleted
  try {
    const res = await fetch('backend/api.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deleteSchedule)
    });

    const resData = await res.text();

    console.log(resData);
    getShedules()
  } catch (err) {
    console.log(err.message);
  }
}

//Get data from api when pages loads
window.addEventListener('load', function (event) {
  getShedules()
});

//Event to select or deselect date
daysEl.addEventListener('click', e => {
  let selectedDay = e.target;
  if (selectedDay.className === "") {
    selectedDay.classList.add("selected");
    updateSelectedDates()
  } else {
    selectedDay.classList.remove("selected");
    deleteSelectedDate(selectedDay);
  }

});

//Change month and year handler
prevNextIcon.forEach(icon => {
  icon.addEventListener("click", () => {
    currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1;
    if(currentMonth < 0 || currentMonth > 11) { 
            date = new Date(currentYear, currentMonth, new Date().getDate());
            currentYear = date.getFullYear(); 
            currentMonth = date.getMonth();
    }
    getShedules();
  });
});

