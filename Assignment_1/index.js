const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "index.html"));
});

app.post("/calculate-bmi", (req, res) => {
    const weight = req.body.weight;
    const height = req.body.height;

    if (weight <= 0 || height <= 0) {
        res.send("Invalid input");
        return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category = "";
    let color = "";

    if (bmi < 18.5) {
        category = "Underweight";
        color = "blue";
    } else if (bmi < 24.9) {
        category = "Normal weight";
        color = "green";
    } else if (bmi < 29.9) {
        category = "Overweight";
        color = "orange";
    } else {
        category = "Obese";
        color = "red";
    }

    res.send(`
        <html>
        <head>
            <title>BMI Result</title>
        </head>
        <body>
            <h2>Your BMI Result</h2>
            <p>BMI: ${bmi.toFixed(2)}</p>
            <p style="color:${color}">Category: ${category}</p>
            
            <a href="/">Back</a>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});