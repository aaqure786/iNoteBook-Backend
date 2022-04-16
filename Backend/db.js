const mongoose = require('mongoose');
const mogoURI = "mongodb://localhost:27017/";


const connectToMong = () => {
    mongoose.connect(mogoURI, ()=>{
        console.log("Connected To Mongo sucessfuly");
    })
}

module.exports = connectToMong;