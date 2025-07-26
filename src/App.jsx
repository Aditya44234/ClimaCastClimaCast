import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("Delhi");
  const [weatherData, setWeatherData] = useState(null);

  const API_Key = "159db3451613b18218501cdbe4191729";

  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const presentDate = `${
    months[currentDate.getMonth()]
  }, ${currentDate.getDate()} ,${currentDate.getFullYear()}`;

  const toCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };

  const getBackground = (weatherType) => {
    switch (weatherType.toLowerCase()) {
      case "clear":
        return "linear-gradient(to right, #56ccf2, #2f80ed)";
      case "clouds":
        return "linear-gradient(to right, #bdc3c7, #2c3e50)";
      case "rain":
        return "linear-gradient(to right, #4e54c8, #8f94fb)";
      case "snow":
        return "linear-gradient(to right, #83a4d4, #b6fbff)";
      case "thunderstorm":
        return "linear-gradient(to right, #373b44, #4286f4)";
      default:
        return "linear-gradient(to right, #2980b9, #6dd5fa)";
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataByCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`
      );
      const data = await res.json();
      setWeatherData(data);
      setCity(data.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "ClimaCast"; // set tab title

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchDataByCoords(latitude, longitude);
      },
      () => {
        fetchData(); // fallback to default city
      }
    );
  }, []);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div
      className="App"
      style={{
        background: weatherData
          ? getBackground(weatherData.weather[0].main)
          : "#2980b9",
      }}
    >
      <div className="container">
        <h1 className="heading2">🌤️ ClimaCast</h1>
        <p className="sub-heading">{presentDate}</p>

        {weatherData && (
          <>
            <div className="weather-data">
              <h2 className="city">{weatherData.name}</h2>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                alt="weather-icon"
                className="container-img"
              />
              <h2 className="container-degree">
                {toCelsius(weatherData.main.temp)}°C
              </h2>
              <h3>{weatherData.weather[0].main}</h3>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind: {weatherData.wind.speed} m/s</p>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter city name"
                  onChange={handleChange}
                  value={city}
                />
                <button type="submit">Get</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
