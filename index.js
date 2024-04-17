const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Set the port dynamically for Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// replace the value below with the Telegram token you receive from @BotFather
const token = "2136045481:AAFfO1sp7DJqt15mgjP7BoiUZSAcfip2cyo";
const bot = new TelegramBot(token);

// Set up webhook for Telegram updates
bot.setWebHook('https://telegram-weather-bot-vb1v.vercel.app/api/webhook');

// Handle incoming webhook updates
app.post('/api/webhook', async (req, res) => {
  const { message } = req.body;

  if (message && message.text) {
    const chatId = message.chat.id;
    const userInput = message.text;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=ea05f0b6617d998492f421c4335d3bba`
      );
      const data = response.data;
      const weather = data.weather[0].description;
      const temperature = data.main.temp - 273.15;
      const city = data.name;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windSpeed = data.wind.speed;
      const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

      bot.sendMessage(chatId, message);
    } catch (error) {
      bot.sendMessage(chatId, "City doesn't exist.");
    }
  }

  res.sendStatus(200);
});
