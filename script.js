// Lista ścieżek do obrazów
const images = [
  "images/tlo1.jpg",
  "images/tlo2.jpg",
  "images/tlo3.jpg",
  "images/tlo4.jpg",
  "images/tlo5.jpg",
  "images/tlo6.jpg",
  "images/tlo7.jpg",
  "images/tlo8.jpg",
];

const icons = {
  "temperature-outside": "/ikony/thermometer.png",
  "temperature-inside": "/ikony/home-thermometer-outline.png",
  "current-production": "/ikony/home-assistant.png",
};

// Funkcja do zmiany tła na losowy obraz z listy
function changeBackground() {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = `url('${randomImage}')`;
}

// Funkcja do pobierania danych z Home Assistant i aktualizowania elementu HTML
async function fetchData(url, elementId, label) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "//API HomeAssisant",
      },
    });
    const data = await response.json();

    // Pobranie elementu HTML i przypisanie treści z ikoną
    const element = document.getElementById(elementId);
    element.innerHTML = `<img src="${icons[elementId]}" alt="${label} icon" class = "sensor-icon"> ${data.state} ${data.attributes.unit_of_measurement}`;
  } catch (error) {
    document.getElementById(elementId).textContent =
      "Błąd podczas pobierania danych.";
  }
}

function updateSystemTime() {
  const teraz = new Date();
  const godzina = teraz.getHours().toString().padStart(2, "0");
  const minuta = teraz.getMinutes().toString().padStart(2, "0");
  const sekunda = teraz.getSeconds().toString().padStart(2, "0");

  const dzien = teraz.getDate().toString().padStart(2, "0");
  const miesiac = (teraz.getMonth() + 1).toString().padStart(2, "0"); // Miesiące są indeksowane od 0
  const rok = teraz.getFullYear();

  document.getElementById(
    "czas"
  ).textContent = `${godzina}:${minuta}:${sekunda}`;
  document.getElementById("data").textContent = `${dzien}.${miesiac}.${rok}`;
}

// Uruchomienie cyklicznych wywołań dla każdej funkcji
function startIntervals() {
  setInterval(changeBackground, 300000); // Zmiana tła co 10 sekund
  setInterval(
    () =>
      fetchData(
        "https://homeassistant.com/api/states/sensor.sonoff_basic_r2_temp_zewnatrz",
        "temperature-outside",
        "Temperatura zewnętrzna"
      ),
    90000
  );

  setInterval(
    () =>
      fetchData(
        "https://homeassistant.com/api/states/sensor.zamel_thw_01_temperature",
        "temperature-inside",
        "Temperatura wewnętrzna"
      ),
    90000
  );

  setInterval(
    () =>
      fetchData(
        "https://homeassistant.com/api/states/sensor.energia_czynna",
        "current-production",
        "Energia czynna"
      ),
    30000
  );

  // Aktualizacja czasu systemowego co sekundę
  setInterval(updateSystemTime, 1000);
}

// Inicjalizacja funkcji po załadowaniu strony
window.onload = function () {
  changeBackground(); // Pierwsza zmiana tła od razu po załadowaniu
  fetchData(
    "https://homeassistant.com/api/states/sensor.sonoff_basic_r2_temp_zewnatrz",
    "temperature-outside",
    "Temperatura zewnętrzna"
  );
  fetchData(
    "https://homeassistant.com/api/states/sensor.zamel_thw_01_temperature",
    "temperature-inside",
    "Temperatura wewnętrzna"
  );
  fetchData(
    "https://homeassistant.com/api/states/sensor.energia_czynna",
    "current-production",
    "Energia czynna"
  );
  updateSystemTime();
  startIntervals();
};
