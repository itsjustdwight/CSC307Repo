// backend.js
// creating express framework, creating a web server, and manging http requests and responses
import express from "express"
import cors from "cors";

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
        {
            id: "dat110",
            name: "Dwight",
            job: "Student"
        }
    ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserByJob = (job) => {
    return users["users_list"].filter(
       (user) => user["job"] === job
    );
};

const findUserByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => user["name"] === name && user["job"] === job
    );
};

const findUserById = (id) => 
    users["users_list"].find((user) => user["id"] === id);

// creating variable that takes a user object and adds it to users_list array
const addUser = (user) => {
    users["users_list"].push(user); // adding new user to end of users_list array
    return user;
}

// creating variable that deletes user object specified by id
// uses filter function to separate elements in users_list by id 
const deleteUser = (id) => {
    users["users_list"] = users["users_list"].filter(
       (user) => user["id"] !== id);
    return users["users_list"];
}

// enabling all CORS requests
app.use(cors());

// adding middleware to be used to process incoming HTTP requests in JSON format
app.use(express.json());

// sets endpoint to accept http requests
// the "/" is the route for the GET HTTP method on root path
// (req, res) is the callback function with a request then a response
// when request is made to root URL (http://localhost:8000/), server responds with message
// using "/users" makes the new URL -> http://localhost:8000/users, accessing the users variable
app.get("/users", (req, res) => {
    const name = req.query.name; // initializing name variable to access specific names from HTTP query using request
    if(name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users)
    }
})

app.get("/users/:id", (req, res) => { 
    const id = req.params["id"];
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

// getting all users that match given name and job
app.get("/users/:name/:job", (req, res) => {
    const name = req.params.name;
    const job = req.params.job;
    if (name && job) {
        let result = findUserByNameAndJob(name, job);
        result = { users_list: result }
        res.send(result)
    }
    else if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    }
    else if (job != undefined) {
        let result = findUserByJob(job);
        result = { users_list: result };
        res.send(result)
    } else {
        res.send(users);
    }
})

// starting server on specified port
// listening (from the backend) to the incoming http requests on the port
// confirmation message (console.log()) send to console to indicate server is listening
app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}/users`
    );
});

// function to handle the POST http request
app.post("/users", (req, res) => {
    const userToAdd = req.body; // access the incoming data of users_list
    addUser(userToAdd);
    res.send();
})

// function to handle the DELETE http request
app.delete("/users/:id", (req, res) => {
    const userToDelete = req.params.id;
    deleteUser(userToDelete);
    res.send();
})