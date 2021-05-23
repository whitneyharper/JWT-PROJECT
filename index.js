const express = require('express');
const app = express();
const port = 3001;
const jwt = require('jsonwebtoken');
  //secret
const secret = "tHisAseCReT";
app.use(express.json());

// CREATE A TOKEN AND SEND BACK TO CLIENT
app.post('/create-token', (req, res) => {
    //payload
    const payload = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        id: req.body.id
    };
    //expiry time
    const expiry = 36000;
    //CREATE TOKEN
    jwt.sign(payload, secret, { expiresIn: expiry }, () => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json({ token });
        }
    })
});

// RECEIVE TOKEN FROM CLIENT AND DECODE IT
app.get('/decode-token', (req, res) => {
    console.log(req.headers);
    //PICK AUTH HEADER
    if (!req.headers.authorization) {
        return res.status(403).json({message: `authentication token is required`})
    }
    const authHeader = req.headers.authorization;
    // EXTRACT TOKEN
    const splittedStr = authHeader.split(' ')
    const token = splittedStr[1];
    //DECODE TOKEN
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(500).json({ err })
        } else {
            return res.status(200).json({ user: decodedToken})
        }
    })
});

app.listen(port, () => {
    console.log(`App is running. Listening on port ${port}`)
});