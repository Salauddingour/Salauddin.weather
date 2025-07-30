const apiKey = "3acd77a6182ec203538a33d5df34bce4"; // 👈 Replace with your actual OpenWeatherMap API key

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeatherData(city);
  }
});

async function getWeatherData(city) {
  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const currentData = await currentRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData.list);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("weatherInfo").innerHTML = `<p>❌ Could not load data for ${city}</p>`;
  }
}

function updateCurrentWeather(data) {
  const location = `${data.name}, ${data.sys.country}`;
  const temp = `${Math.round(data.main.temp)}°C`;
  const condition = data.weather[0].main;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("location").textContent = location;
  document.getElementById("weatherInfo").innerHTML = `
    <img src="${icon}" alt="${condition}" width="80" />
    <h3>${temp}</h3>
    <p>${condition}</p>
  `;
}

function updateForecast(list) {
  const daily = {};
  list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date] && Object.keys(daily).length < 5) {
      daily[date] = item;
    }
  });

  const grid = document.getElementById("forecastGrid");
  grid.innerHTML = "";

  Object.keys(daily).forEach(date => {
    const item = daily[date];
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const temp = `${Math.round(item.main.temp)}°C`;
    const condition = item.weather[0].main;

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <p>${date}</p>
      <img src="${icon}" alt="${condition}" width="50" />
      <p>${temp}</p>
      <p>${condition}</p>
    `;
    grid.appendChild(card);
  });
}