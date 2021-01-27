const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
  
    title:{
        type: String,
        required: true,
        unique: true,

    },
    description:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporters'
    },
    img:{
        type: Buffer
    }
},{
    timestamps:true
})


const News = mongoose.model('News',newsSchema)
module.exports = News