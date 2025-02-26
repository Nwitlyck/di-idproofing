const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');
require("dotenv").config({ path: './oauthconfig.env' });

const app = express();
const port = 3000;

app.use(cors());

const backgroundImage = "images/flag.jpg"

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const authorization_url = process.env.AUTHORIZATION_URL;
const token_url = process.env.TOKEN_URL;
const scope = process.env.SCOPE;

app.get('/login', (req, res) => {
  const acr_values = "IAL2A";

  const authUrl = `${authorization_url}?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&acr_values=${acr_values}`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const authorization_code = req.query.code;

  try {
    const response = await axios.post(token_url, new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorization_code,
      redirect_uri: redirect_uri,
      client_id: client_id,
      client_secret: client_secret
    }), { httpsAgent: agent });

    res.send(`
      <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
          <title>Callback Demo</title>
          <style>

            body {
              font-family: 'Roboto', sans-serif;
              background-image: url(${backgroundImage});
              background-size: cover;
              background-position: center;
              background-attachment: fixed;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              text-align: center;
              color: #222; 
            }

            .content-container {
              background-color: rgba(227, 242, 253, 0.9);
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
              width: 100%;
              max-width: 520px;
            }

            h1 {
              font-size: 34px;
              font-weight: 700;
              color: #2C3E50;
              margin-bottom: 25px;
              font-family: 'Poppins', sans-serif;
              text-align: center; /* Keep title centered */
            }
    
            p {
              font-size: 18px;
              color: #555;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="content-container">
            <h1>Success!</h1>
            <p>Identity Proofing Process Completed Successfully.</p>
          </div>
        </body>
      </html>
    `);
  } catch (e) {

    let error = req.query.error_description;

    if (typeof error === "undefined"){
      error = "Not Spected";
    } 
    
    console.error(error);
    
    if (error.includes("AAMVA")) {
      res.send(`
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
            <title>Error - Felipe Not Found</title>
            <style>
              body {
                font-family: 'Roboto', sans-serif;
                background-image: url(${backgroundImage});
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                text-align: center;
                color: #222; 
              }
      
              .content-container {
                background-color: rgba(227, 242, 253, 0.9);
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                width: 100%;
                max-width: 520px;
              }
      
              h1 {
                font-size: 34px;
                font-weight: 700;
                color: #2C3E50;
                margin-bottom: 25px;
                font-family: 'Poppins', sans-serif;
                text-align: center;
              }
      
              p {
                font-size: 18px;
                color: #555;
                margin-bottom: 20px;
              }
      
              .error-icon {
                font-size: 100px;
                color: #e74c3c;
                margin-bottom: 20px;
              }
      
              .retry-button {
                padding: 10px 20px;
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
              }
      
              .retry-button:hover {
                background-color: #2980b9;
              }
            </style>
          </head>
          <body>
            <div class="content-container">
              <h1>Verification of DMV records did not pass</h1>
              <p>Please return to the home page.</p>
              <button class="retry-button" onclick="window.location.href='/'">Try again</button>
            </div>
          </body>
        </html>
      `);
    } 
    else {   
      res.send(`
        <html>
          <head>
              <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
            <title>Callback Demo</title>
            <style>
              body {
                font-family: 'Roboto', sans-serif;
                background-image: url(${backgroundImage});
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                text-align: center;
                color: #222; 
              }

              .content-container {
                background-color: rgba(227, 242, 253, 0.9);
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                width: 100%;
                max-width: 520px;
              }

              h1 {
                font-size: 34px;
                font-weight: 700;
                color: #2C3E50;
                margin-bottom: 25px;
                font-family: 'Poppins', sans-serif;
              }

              p {
                font-size: 18px;
                color: #555;
                margin-bottom: 20px;
              }

              .token-info p {
                font-size: 18px;
                color: #333;
                margin-top: 20px;
              }

              .id-token-container {
                background-color: #ffffff;
                padding: 20px;
                margin-top: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 500px; 
                word-wrap: break-word;
                white-space: pre-wrap;
                font-family: 'Courier New', Courier, monospace;
                width: 100%;
              }

              .btn {
                padding: 14px 24px;
                background-color: #0056b3;
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s;
              }

              .btn:hover {
                background-color: #004494;
                transform: scale(1.05);
              }

            </style>
          </head>
          <body>
            <div class="content-container">
              <h1>Something went wrong</h1>
              <p>The identity proofing process was not completed successfully.</p>
              <p>Please return to the home page:</p>
              <a href="/" class="btn">Go to home</a>
            </div>
          </body>
        </html>
      `);
    }
  }
});

app.get('/', (req, res) => {
  const descriptions = {
    step1: "To complete the identity verification process, click 'Submit'.",
    step2: "This verifies an identity by matching the Driver's License Number and Date of Birth against the American Association of Motor Vehicle Administrators (AAMVA) national database.",
    step3: "What's happening in the background?",
    step4: "&nbsp;&nbsp;&nbsp;1.	Selfie Liveness - Confirming the user is real and present",
    step5: "&nbsp;&nbsp;&nbsp;2.	Document Authentication - Confirming the driver's license is real and has not been altered in any way",
    step6: "&nbsp;&nbsp;&nbsp;3.	Selfie Matching - Confirming the selfie that was taken matches the photo on the driver's license.",
    step7: "&nbsp;&nbsp;&nbsp;4.	System of Record Check - Confirming the driver's license number and date of birth on the driver's license match what is in the AAMVA database"
  };

  res.send(`
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
        <title>Identity Proofing</title>
        <style>

          body {
            font-family: 'Roboto', sans-serif;
            background-image: url(${backgroundImage});
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            color: #222; 
          }

          .content-container {
            background-color: rgba(227, 242, 253, 0.9);
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 520px;
          }

          h1 {
            font-size: 34px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 25px;
            font-family: 'Poppins', sans-serif;
            text-align: center;
          }

          p {
            font-size: 18px;
            color: #444;
            margin-bottom: 20px;
            line-height: 1.6;
            text-align: left;
          }

          .btn {
            padding: 14px 24px;
            background-color: #0056b3;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s;
          }

          .btn:hover {
            background-color: #004494;
            transform: scale(1.05);
          }

        </style>
      </head>
      <body>
        <div class="content-container">
          <h1>Welcome to the NCDIT Identity Proofing Demonstration</h1>
          <p>
            ${descriptions.step1}<br><br>
            ${descriptions.step2}<br><br>
            <b>${descriptions.step3}</b><br><br>
            ${descriptions.step4}<br>
            ${descriptions.step5}<br>
            ${descriptions.step6}<br>
            ${descriptions.step7}<br>
          </p>
          
          <a href="/login">
            <button type="submit" class="btn" id="submitBtn">Submit</button>
          </a>
        </div>
        
      </body>
    </html>
  `);

});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`OAuth 2.0 server listening at http://localhost:${port}`);
});
