// backend.js
// creating express framework, creating a web server, and manging http requests and responses
import express from "express"

// creating an instance of Express application (used for routes, middleware, and server behavior)
const app = express();
// port number to remain constant to listen to incoming HTTP requests 
const port = 8000;

// creating users object with a users_list array where each object contains an id, name, and job
const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspiring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        },
    ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

// adding middleware to be used to process incoming HTTP requests in JSON format
app.use(express.json());

// sets endpoint to accept http requests
// the "/" is the route for the GET HTTP method on root path
// (req, res) is the callback function with a request then a response
// when request is made to root URL (http://localhost:8000/), server responds with message
// using "/users" makes the new URL -> http://localhost:8000/users, accessing the users variable
app.get("/users", (req, res) => { 
    const name = req.query.name; // initializing name variable to access specific names from HTTP query using request
    if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});

// starting server on specified port
// listening (from the backend) to the incoming http requests on the port
// confirmation message (console.log()) send to console to indicate server is listening
app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}/users?name=Mac`
    );
});