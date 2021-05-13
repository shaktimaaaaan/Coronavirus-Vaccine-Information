const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const date_in_url = req.body.user_date;
  const pincode_in_url = req.body.user_pincode;

  const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode_in_url}&date=${date_in_url}`;

  https.get(url, (response) => {
    console.log("statusCode:", response.statusCode);

    response.on("data", (data) => {
      for (let i = 0; i < 18; i++) {
        const cowin_data = JSON.parse(data);
        const center_name = cowin_data.centers[i].name;
        const center_address = cowin_data.centers[i].address;
        const from = cowin_data.centers[i].from;
        const to = cowin_data.centers[i].to;
        const fee_type = cowin_data.centers[i].fee_type;

        const sessions = cowin_data.centers[i].sessions;
        for (let j = 0; j < sessions.length; j++) {
          const date = cowin_data.centers[i].sessions[j].date;
          const min_age_limit = cowin_data.centers[i].sessions[j].min_age_limit;
          const vaccine = cowin_data.centers[i].sessions[j].vaccine;
          const slots = cowin_data.centers[i].sessions[j].slots;

          res.write(`<h1>Date: ${date}</h1>`);
          res.write(`<h1>Center Name: ${center_name}</h1>`);
          res.write(`<h1>Center Address: ${center_address}</h1>`);
          res.write(`<h1>Time: from ${from} to ${to}</h1>`);
          res.write(`<h1>Fees : ${fee_type}</h1>`);
          res.write(`<h1>Minimum Age Limit: ${min_age_limit}</h1>`);
          res.write(`<h1>Vaccine Name: ${vaccine}</h1>`);
          res.write(`<h1>Available slots: ${slots}</h1>`);
          res.write(`<hr/>`);
        }
      }
      res.send();
    });
  });
});

app.listen(4444, () => {
  console.log("Server started on port 4444");
});
