// backend.js
// creating express framework, creating a web server, and manging http requests and responses
import express from "express";
import cors from "cors";
import userModel from "./models/user.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING + "users") // connecting to users database
    .catch((error) => console.log(error))

// creating an instance of Express application (used for routes, middleware, and server behavior)
const app = express();
// port number to remain constant to listen to incoming HTTP requests 
const port = 8000;

//------------------ Helper Functions ------------------//

function findUserByName(name) {
    return userModel.find({ name: name });
}

function findUserByJob(job) {
    return userModel.find({ job: job });
}

const findUserByNameAndJob = (name, job) => {
    return userModel.find({name: name, job: job})
};

function findUserById(id) {
    return userModel.findById(id);
}

// function that gets users from mongoose database (users)
function getUsers(name, job) {
    let promise;
        if (name === undefined && job === undefined) {
        promise = userModel.find();
        } else if (name && !job) {
        promise = findUserByName(name);
        } else if (job && !name) {
        promise = findUserByJob(job);
        }
    return promise;
}

// creating variable that takes a user object and adds it to users_list array
// const addUser = (user) => {
//     users["users_list"].push(user); // adding new user to end of users_list array
//     return user;
// }

// new addUser function that makes use of mongoose
function addUser(user) {
    const userToAdd = new userModel(user);
    const promise = userToAdd.save();
    return promise;
}

// creating variable that deletes user object specified by id
// uses filter function to separate elements in users_list by id 
const deleteUser = (id) => {
    return userModel.findByIdAndDelete(id);
};

// generating random ID for newly created user form client
const randomGeneratedID = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let id = '';

    // generating three random letters
    for(let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        id += letters[randomIndex];
    }

    // generating random numbers
    for(let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        id += numbers[randomIndex];
    }

    return id;
}; 

//------------------ Express HTTP Functions ------------------//

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
    // if(name != undefined) {
    //     let result = findUserByName(name);
    //     result = { users_list: result };
    //     res.send(result);
    // } else {
    //     res.send(users)
    // }
    
    getUsers(name)
    .then((obtainedUser) => {
        res.send({ users_list: obtainedUser })
    })
    .catch((error) => {
        res.status(500).json({ message: error.message })
    })
})

app.get("/users/:id", (req, res) => { 
    const id = req.params.id;
    // let result = findUserById(id);
    // if (result === undefined) {
    //     res.status(404).send("Resource not found.");
    // } else {
    //     res.send(result);
    // }

    findUserById(id)
    .then((obtainedUser) => {
        if(!obtainedUser) {
            return res.status(404).send("User not found!");
        } 
        res.send(obtainedUser);
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    })
});

// getting all users that match given name and job
app.get("/users/:name/:job", (req, res) => {
    const name = req.params.name;
    const job = req.params.job;
    // if (name && job) {
    //     let result = findUserByNameAndJob(name, job);
    //     result = { users_list: result }
    //     res.send(result)
    // }
    // else if (name != undefined) {
    //     let result = findUserByName(name);
    //     result = { users_list: result };
    //     res.send(result);
    // }
    // else if (job != undefined) {
    //     let result = findUserByJob(job);
    //     result = { users_list: result };
    //     res.send(result)
    // } else {
    //     res.send(users);
    // }

    findUserByNameAndJob(name, job)
    .then((obtainedUser) => {
        res.send({ users_list: obtainedUser })
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    })
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
    if (!userToAdd.name || !userToAdd.job) {
        console.log("Name and Job!!!!!")
        return res.status(400).json({ 
            message: "Name and Job are needed!" 
        })
    }

    // done before adding new user to users_list
    // id -> randomly generated
    const newUser = {
        // _id: randomGeneratedID(),
        name: userToAdd.name,
        job: userToAdd.job
    }

    addUser(newUser)
    .then((newlyCreatedUser) => {
        // .json() used instead of .send() to ensure the response is corretly
        // (cont.) formatted as JSON, where frontend parses w/o issues
        res.status(201).json({ 
        message: "Successful POST, User created", 
        user: newlyCreatedUser 
        })
    })
    .catch((error) => {
        res.status(500).json({ message: error.message })
    })
    
});

// function to handle the DELETE http request
app.delete("/users/:id", (req, res) => {
    const userToDelete = req.params.id;
    deleteUser(userToDelete)
    .then((deletedUser) => {
        if (!deletedUser) {
            return res.status(404).json({ message: "User doesn't exist to delete." });
        }
        res.status(204).send();
    })
    .catch((error) => {
        res.status(500).json({ message: error.message });
    })
    
    // deleteUser(userToDelete);
    // console.log(`User ${userToDelete} successfully deleted`)
    // res.status(204).send();
})