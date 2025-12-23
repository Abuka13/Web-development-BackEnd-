const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.static("public"));


const NEWS_API_KEY = "3149777e10af4cd992bee752d2ca365a";
const EXCHANGE_API_KEY = "24a13ea25983d7b795ea436c";

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "template", "index.html"));
});

app.get("/api/user", async (req, res) => {
    try {
        // Random User API
        const userRes = await axios.get("https://randomuser.me/api/");
        const user = userRes.data.results[0];

        const userData = {
            firstName: user.name.first,
            lastName: user.name.last,
            gender: user.gender,
            age: user.dob.age,
            dob: user.dob.date.split("T")[0],
            picture: user.picture.large,
            city: user.location.city,
            country: user.location.country,
            address: user.location.street.name + " " + user.location.street.number
        };

        // REST Countries API
        const countryRes = await axios.get(
            `https://restcountries.com/v3.1/name/${userData.country}`
        );
        const country = countryRes.data[0];

        const currencyCode = Object.keys(country.currencies)[0];

        const countryData = {
            name: country.name.common,
            capital: country.capital ? country.capital[0] : "N/A",
            languages: country.languages
                ? Object.values(country.languages).join(", ")
                : "N/A",
            currency: currencyCode,
            flag: country.flags.png
        };

        // Exchange Rate API
        const exchangeRes = await axios.get(
            `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${currencyCode}`
        );

        const exchange = {
            usd: exchangeRes.data.conversion_rates.USD,
            kzt: exchangeRes.data.conversion_rates.KZT
        };

        //  News API
        const newsRes = await axios.get(
            `https://newsapi.org/v2/everything?q=${userData.country}&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`
        );

        const news = newsRes.data.articles.map(n => ({
            title: n.title,
            description: n.description,
            image: n.urlToImage,
            url: n.url
        }));

        
        res.json({
            user: userData,
            country: countryData,
            exchange,
            news
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to load data" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
