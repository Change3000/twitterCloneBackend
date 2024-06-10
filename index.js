
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const {connectDB, disconnectDB} = require('./db/connect');
const userAuthRouter = require('./routes/userAuthRouters');
const authenticate = require('./middlewares/authenticate');
const userActionsRouter = require("./routes/userActionsRouter");

dotenv.config();
const port = process.env.PORT || 5500;
const mongoURI = process.env.MONGO_URI;

const publicDirectoryPath = path.join(__dirname, 'public');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(publicDirectoryPath));


app.get("/", (req, res)=>{
    res.status(200).send("Hello world");
});

// Router
app.use("/user/auth", userAuthRouter);
app.use(authenticate,userActionsRouter);

app.all("*",(req,res)=>{
    res.status(404).send({
        "error":"Invalid Route"
    })
})


const start = async () => {
    try {
        
        if (!mongoURI) {
            console.error('MONGO_URI environment variable is not set.');
            process.exit(1);
        }

        await connectDB(mongoURI);
        app.listen(port, () => {
            console.log(`Server is listening to port ${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
};

start();

process.on('SIGINT', () => {
    console.log('Shutting down server');

    try {
        disconnectDB();
    } catch (err) {
        console.log("Error disconnecting mongoDB", err);
    }

    process.exit(0);
});