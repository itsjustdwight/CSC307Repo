// backend.js
import express from "express"

// creating an instance of Express
const app = express();
// port number to remain constant to listen to incoming HTTP requests 
const port = 8000;

// used to process incoming data in JSON format
app.use(express.json());

// sets endpoint to accept http requests
// the "/" is the URL pattern that'll map to this endpoint
// (req, res) is the callback function with a request then a response
app.get("/", (req, res) => { 
    res.send("Hello World!");
});

// listening (from the backend) to the incoming http requests on the port
app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});