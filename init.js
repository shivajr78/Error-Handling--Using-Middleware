const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then(()=>{
    console.log("Connection Successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}


let allChats = [
    {
    from : "Harshi",
    to : "Vaibhav",
    message : "kal kon kon aara h",
    created_at : new Date(),
    },
    {
    from : "Vaibhav",
    to : "Harshi",
    message : "kal kal chal lo",
    created_at : new Date(),
    },
    {
    from : "Vinay",
    to : "Vaibhav",
    message : "Bro mei kll nhi jaraha",
    created_at : new Date(),
    },
    {
    from : "Vaibhav",
    to : "Vinay",
    message : "Bsdk ab soyega toh kaise jayenga bc",
    created_at : new Date(),
    },
    {
    from : "Aman",
    to : "Vaibhav",
    message : "Chalo sab ghumne chalte hai fir ",
    created_at : new Date(),
    },
    {
    from : "Vaibhav",
    to : "Aman",
    message : "Gaand maara ",
    created_at : new Date(),
    },
    {
    from : "Harshii",
    to : "Aman",
    message : "Haa chalo bhai ",
    created_at : new Date(),
    }
    
];


Chat.insertMany(allChats);
