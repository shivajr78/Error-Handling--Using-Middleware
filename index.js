const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const { nextTick } = require("process");
const ExpressError = require('./ExpressError.js')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//to connect css file to index.ejs file
app.use(express.static(path.join(__dirname, "public")));
//parsing
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("Connection Successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

app.get("/", (req, res) => {
    res.send("Hello World");
})

//Index Route : Show all chats 
app.get("/chats", async (req, res, next) => {
    try {
        let chats = await Chat.find();
        res.render("index.ejs", { chats });
    } catch (err) {
        next(err);
    }
});


//New Route : to form render
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
})

//Create Route : insert data to db
app.post("/chats", asyncWrap (async (req, res, next) => {
        let { from, to, message } = req.body;
        let newChat = new Chat({
            from: from,
            message: message,
            to: to,
            created_at: new Date()
        });
        await newChat.save();
        res.redirect("/chats");
   
}))

//WrapAsync Function
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

//Show Route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        next(new ExpressError(500, "Helo, I'm the error of last lecture"))
    }
    res.render("edit.ejs", { chat });
}));


//Edit Route : to form render
app.get("/chats/:id/edit", async (req, res, next) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", { chat });
    } catch (err) {
        next(err);
    }
})

//Update Route : 
app.put("/chats/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let { message: newMsg } = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id, { message: newMsg }, { runValidators: true, new: true });
        res.redirect("/chats");
    } catch (err) {
        next(err);
    }
})

//Destroy Route : 
app.delete("/chats/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        console.log(deletedChat)
        res.redirect("/chats");
    } catch (err) {
        next(err);
    }
})

//Function handleValidationErr
const handleValidationErr = (err) =>{
    console.log("This is a validation Error, follow the rules")
    console.dir(err.message);
    return err;
}

//Another Error handling Middleware to show ERROR name
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        err = handleValidationErr(err);
    }
    next(err);
})

//Common Error handling midddleware 
app.use((err, req, res, next) => {
    let { status = 403, message = "Hello yeh error hai oky" } = err;
    res.status(status).send(message);
})
app.listen(8080, () => {
    console.log("Server is listening on port 8080...")
});