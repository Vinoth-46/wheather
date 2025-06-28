const API_KEY = "ded4d2120c277a0976ac862400646a4c"; // Replace with your OpenWeatherMap API key

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        await getWeatherByCoords(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Couldn't get location. Please enter a city manually.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

async function getWeatherByCoords(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const data = await response.json();
  console.log("Condition from API:", data.weather[0].main);

  if (data.cod !== 200) {
    alert(`Error: ${data.message}`);
    return;
  }

  updateWeatherUI(data);
}

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return alert("Please enter a city!");

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
  const data = await response.json();
  console.log("Condition from API:", data.weather[0].main);

  if (data.cod !== 200) {
    alert(`Error: ${data.message}`);
    return;
  }

  updateWeatherUI(data);
}

function updateWeatherUI(data) {
  const temp = data.main.temp;
  const condition = data.weather[0].main;
  const iconCode = data.weather[0].icon;

  document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').innerText = `${temp.toFixed(1)}°C`;
  document.getElementById('condition').innerText = condition;
  document.getElementById('icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.body.style.background = getBackground(condition);

  document.getElementById('details').innerHTML = `
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
  `;

  const playlistId = getPlaylist(condition);
  document.getElementById('spotifyEmbed').src = `https://open.spotify.com/embed/playlist/${playlistId}`;
}

function getBackground(condition) {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'linear-gradient(135deg, #fddb92, #d1fdff)';
    case 'rain':
    case 'drizzle':
      return 'linear-gradient(135deg, #4e54c8, #8f94fb)';
    case 'clouds':
      return 'linear-gradient(135deg, #757f9a, #d7dde8)';
    case 'snow':
      return 'linear-gradient(135deg, #e0eafc, #cfdef3)';
    case 'thunderstorm':
      return 'linear-gradient(135deg, #283e51, #485563)';
    default:
      return 'linear-gradient(135deg, #89f7fe, #66a6ff)';
  }
}

const playlists = [
  '2MVUwKF7B95UeJSv9KZx71', 
  '1lzQQs6BPGbevt6Frc5mOk', 
  '3oqiC5m72bzdXjMFOisYdQ',
  '6PHSBLLzNLHjobls3gd3kg',
  '51B7oe26CjN0tppKRSXZgK',
  '4MSEbsDLAMap83j0tltjQ8',
  '15DUMI8qORkFVusKJMjNSK',
  '70mgTn7SMEtcXsuf4QtJU7',
  '0AGld1pY5KnRg4LhBVmIHA',
  '07Vi5Bz2SZVYZUmpIKzsaB',
  '2SVORyJp6GLb2u8AX2lkfE',
  '1mhizqfkW1FiGT5xfLY0sp',
  '7oEZPqx3LrZntqhUQ7YUJJ',
  '37i9dQZF1DXdPec7aLTmlC', 
  '37i9dQZF1DX4WYpdgoIcn6', 
  '37i9dQZF1DX6ziVCJnEm59',
  '75uG2eSAdbh7Re2kD2KOND' 
];


function getPlaylist(condition) {
  const randomIndex = Math.floor(Math.random() * playlists.length);
  return playlists[randomIndex];
}
