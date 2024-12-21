"use strict";
const navLinks = document.querySelectorAll(".nav-link");
const searchInput = document.querySelector("#search");
const submitButton = document.querySelector("#submit");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    navLinks.forEach((nav) => nav.classList.remove("active"));
    this.classList.add("active"); 
  });
});

async function getAPI(city = "", lat = "", lon = "") {
  let url = "";
  if (city) {
    url = `https://api.weatherapi.com/v1/forecast.json?key=50c50ece38604c2d80081935241512&q=${city}&days=3`;
  } else if (lat && lon) {
    url = `https://api.weatherapi.com/v1/forecast.json?key=50c50ece38604c2d80081935241512&q=${lat},${lon}&days=3`;
  } else {
    url = `https://api.weatherapi.com/v1/forecast.json?key=50c50ece38604c2d80081935241512&q=Gaza&days=3`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    Swal.fire({
      title: "Error",
      text: "Unable to fetch weather data. Please check your internet connection or enter a valid city name.",
      icon: "error",
      color: "#fff",
      background: "#323544",
      confirmButtonColor: "#009ad8",
    });
  }
}

function displayWeather(data) {
  let currentWeather = data.forecast.forecastday[0];

  document.querySelector(".forecast-container").innerHTML = `
    <div class="today forecast">
      <div class="forecast-header overflow-hidden" id="today">
        <div class="day float-start">${new Date(currentWeather.date).toLocaleDateString("en-US", { weekday: "long" })}</div>
        <div class="date float-end">${new Date(currentWeather.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div>
      </div>
      <div class="forecast-content text-start" id="current">
        <div class="location">${data.location.name}</div>
        <div class="degree">
          <div class="num d-inline-block align-middle">${data.current.temp_c}<sup>o</sup>C</div>
          <div class="forecast-icon d-inline-block align-middle">
            <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" width="90" />
          </div>
        </div>
        <div class="custom">${data.current.condition.text}</div>
        <span><img src="./img/icon-umberella.png" alt="" />${currentWeather.day.daily_chance_of_rain}%</span>
        <span><img src="./img/icon-wind.png" alt="" />${currentWeather.day.maxwind_kph}km/h</span>
        <span><img src="./img/icon-compass.png" alt="" />${data.current.wind_dir}</span>
      </div>
    </div>
    ${data.forecast.forecastday
      .slice(1)
      .map(
        (day) => `
      <div class="forecast">
        <div class="forecast-header">
          <div class="day">${new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}</div>
        </div>
        <div class="forecast-content">
          <div class="forecast-icon">
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" width="48" />
          </div>
          <div class="degree text-white fw-bolder">${day.day.maxtemp_c}<sup>o</sup>C</div>
          <small>${day.day.mintemp_c}<sup>o</sup></small>
          <div class="custom">${day.day.condition.text}</div>
        </div>
      </div>`
      )
      .join("")}
  `;
}

submitButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    getAPI(city);
  } else {
    Swal.fire({
      title: "Please Enter City Name",
      color: "#fff",
      background: "#323544",
      confirmButtonColor: "#009ad8",
    });
  }
});


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getAPI("", lat, lon);
    },
    (error) => {
      console.error("Geolocation error:", error);
      // Swal.fire({
      //   title: "Location Error",
      //   text: "Unable to get your location. Please enter a city manually.",
      //   icon: "error",
      //   color: "#fff",
      //   background: "#323544",
      //   confirmButtonColor: "#009ad8",
      // });
      getAPI("gaza");
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
  getAPI("gaza");
}
