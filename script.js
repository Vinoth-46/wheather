document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "ded4d2120c277a0976ac862400646a4c";
  const canvas = document.getElementById("weather-canvas");
  const ctx = canvas.getContext("2d");
  let weatherType = "clear";
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setWeatherAnimation(weatherType); // Reset on resize
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (weatherType === "rain") {
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(174,194,224,0.5)";
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.stroke();
        p.y += p.speedY;
        if (p.y > canvas.height) p.y = 0;
      });
    } else if (weatherType === "snow") {
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01);
        if (p.y > canvas.height) {
          p.y = 0;
          p.x = Math.random() * canvas.width;
        }
      });
    } else if (weatherType === "clouds") {
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    requestAnimationFrame(animate);
  }
  animate();

  function setWeatherAnimation(type) {
    weatherType = type;
    particles = [];

    if (type === "rain") {
      for (let i = 0; i < 300; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 20 + 10,
          speedY: Math.random() * 4 + 4,
        });
      }
    } else if (type === "snow") {
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speedY: Math.random() * 1 + 0.5,
        });
      }
    }
  }

  function setWeatherBackground(condition) {
    const c = condition.toLowerCase();
    if (c.includes("rain")) setWeatherAnimation("rain");
    else if (c.includes("snow")) setWeatherAnimation("snow");
    else if (c.includes("cloud")) setWeatherAnimation("clouds");
    else setWeatherAnimation("clear");
  }

 const playlists = [
  '2MVUwKF7B95UeJSv9KZx71', // Playlist 1
  '1lzQQs6BPGbevt6Frc5mOk', // Playlist 2
  '3oqiC5m72bzdXjMFOisYdQ', // Playlist 3
  '6PHSBLLzNLHjobls3gd3kg', // Playlist 4
  '51B7oe26CjN0tppKRSXZgK', // Playlist 5
  '70mgTn7SMEtcXsuf4QtJU7', // Playlist 6
  '0AGld1pY5KnRg4LhBVmIHA', // Playlist 7
  '07Vi5Bz2SZVYZUmpIKzsaB', // Playlist 8
  '2SVORyJp6GLb2u8AX2lkfE', // Playlist 9
  '1mhizqfkW1FiGT5xfLY0sp', // Playlist 10
  '7oEZPqx3LrZntqhUQ7YUJJ', // Playlist 11
  '4MSEbsDLAMap83j0tltjQ8', // Playlist 12
  '15DUMI8qORkFVusKJMjNSK', // Playlist 13
  '37i9dQZF1DXdPec7aLTmlC', // Playlist 14
  '37i9dQZF1DX4WYpdgoIcn6', // Playlist 15
  '37i9dQZF1DX6ziVCJnEm59', // Playlist 16
  '75uG2eSAdbh7Re2kD2KOND'  // Playlist 17
];


function getRandomPlaylist() {
  const id = playlists[Math.floor(Math.random() * playlists.length)];
  return `https://open.spotify.com/embed/playlist/${id}`;
}


  function setThemeByTime() {
    const hour = new Date().getHours();
    document.body.className = hour >= 6 && hour < 18 ? "light-mode" : "dark-mode";
  }

  async function getWeatherByCoords(lat, lon) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
    if (data.cod !== 200) {
      alert(`Error: ${data.message}`);
      return;
    }
    updateWeatherUI(data);
  }

  async function getWeatherBySearch() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return alert("Please enter a city name!");
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
    if (data.cod !== 200) {
      alert(`Error: ${data.message}`);
      return;
    }
    updateWeatherUI(data);
  }

  function updateWeatherUI(data) {
    setThemeByTime();
    setWeatherBackground(data.weather[0].main);
    document.getElementById("spotify").src = getRandomPlaylist();
    document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText = `${data.main.temp.toFixed(1)}°C`;
    document.getElementById("condition").innerText = data.weather[0].main;
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("details").innerHTML = `
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;
  }

  // 🔥 Geolocation: Try to use user location on load
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        alert("Could not get your location. Please search manually.");
      },
      { timeout: 10000 }
    );
  } else {
    alert("Geolocation not supported. Please search manually.");
  }

  // Expose search function globally
  window.getWeatherBySearch = getWeatherBySearch;
});
