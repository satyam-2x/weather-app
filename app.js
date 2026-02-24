
//DOM ELEMENTS

let cityInput = document.querySelector("#cityInput");
let getBtn = document.querySelector("#getWeatherBtn");
let saveBtn = document.querySelector("#saveCityBtn");
let tempEl = document.querySelector(".temperature");
let dayEl = document.querySelector(".day");
let weatherEl = document.querySelector(".weather");
let windEl = document.querySelector(".wind");
let humidityEl = document.querySelector(".humidity");
let img = document.querySelector("#image");
let errorEl = document.querySelector(".error");
let loadingEl = document.querySelector(".loading");
let statusEl = document.querySelector(".current-status");


//APPLICATION STATE
let currentCity = "";

// INITIAL LOAD (LOAD SAVED CITY)
window.addEventListener("load", async () => {
  let savedCity = localStorage.getItem("savedCity");

  if (savedCity) {
    loadingEl.innerText = "Loading...";
    let data = await weather(savedCity);
    filteredWeather(data);
    statusEl.innerHTML = `Weather in <span>${savedCity}</span> `;
  }
});


// GET WEATHER BUTTON CLICK
getBtn.addEventListener("click", async () => {
  let input = cityInput.value.trim();

  if (input === "") {
    errorEl.innerText = "please enter a city name";
    return;
  }

  loadingEl.innerText = "Loading...";
  let data = await weather(input);

  if (data) {
    filteredWeather(data);
    currentCity = input;
    statusEl.innerHTML = `Weather in <span>${input}</span>`;
  }
});


// SAVE CITY TO LOCAL STORAGE
saveBtn.addEventListener("click", () => {
  if (currentCity === "") {
    errorEl.innerText = "First search a city";
    return;
  }

  localStorage.setItem("savedCity", currentCity);
  errorEl.innerText = "";
  statusEl.innerHTML = `Weather in <span>${currentCity}</span>`;
});


// INPUT CLEAR HANDLING (RESTORE SAVED CITY)
cityInput.addEventListener("input", async () => {
  if (cityInput.value.trim() === "") {
    let savedCity = localStorage.getItem("savedCity");

    if (savedCity) {
      loadingEl.innerText = "Loading...";
      let data = await weather(savedCity);
      filteredWeather(data);
      statusEl.innerHTML = `Weather in <span>${savedCity}</span>`;
    }
  }
});


// FILTER & DISPLAY WEATHER DATA
function filteredWeather(data) {
  
  if (!data) return;

  errorEl.innerText = "";
  loadingEl.innerText = "";

  tempEl.innerText = data.main.temp + "°C";
  humidityEl.innerText = data.main.humidity + "%";
  windEl.innerText = data.wind.speed + " km/h";
  weatherEl.innerText = data.weather[0].main;


  let localTime = (data.dt + data.timezone) * 1000;
  let hour = new Date(localTime).getUTCHours();

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dayEl.innerText = days[new Date(localTime).getUTCDay()];


  if (hour >= 5 && hour < 12) {
    img.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  }
  else if (hour >= 12 && hour < 17) {
    img.src = "https://cdn-icons-png.flaticon.com/512/3222/3222691.png";
  }
  else if (hour >= 17 && hour < 19) {
    img.src = "https://cdn-icons-png.flaticon.com/512/869/869857.png";
  }
  else {
    img.src = "https://cdn-icons-png.flaticon.com/512/189/189162.png";
  }
}


// WEATHER API CALL FUNCTION
async function weather(city) {
  try {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=8e681c7e1f2fd2517003d1f709e9ebfe`;
    let res = await axios.get(url);
    return res.data;
  } catch {
    loadingEl.innerText = "";
    errorEl.innerText = "City not found";
    return null;
  }
}
