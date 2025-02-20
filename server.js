const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');
require("dotenv").config({ path: './oauthconfig.env' });

const app = express();
const port = 3000;

const agent = new https.Agent({
  rejectUnauthorized: false
});

app.use(cors());

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

    const { access_token, id_token, token_type } = response.data;

    res.send(`
      <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
          <title>Callback Demo</title>
          <style>

            body {
              font-family: 'Roboto', sans-serif;
              background-image: url('images/background.jpg');
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
  } catch (error) {
    console.error('Error exchanging authorization code for token:', error.response?.data || error.message);
    res.send(`
      <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
          <title>Callback Demo</title>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              background-image: url('images/background.jpg');
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
            <h1>Some think happen</h1>
            <p>Identity Proofing Process Was Not Completed Successfully.</p>
            <p>Please return to the home page:</p>
            <a href="/" class="btn">Go to Home</a>
          </div>
        </body>
      </html>
    `);
  }
});

app.get('/', (req, res) => {
  const descriptions = {
    step1: "To complete the identity verification process, click 'Submit'.",
    step2: "This option will verify your identity by cross-referencing your driver's license with DMV records.",
  };

  res.send(`
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
        <title>Identity Proofing</title>
        <style>

          body {
            font-family: 'Roboto', sans-serif;
            background-image: url('images/background.jpg');
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
          <p>${descriptions.step1}</p>
          <p>${descriptions.step2}</p>
          
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
