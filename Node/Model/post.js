const mongoose=require('mongoose')
const PostSchema=new mongoose.Schema({
    Name:{
        type:String,
    },
    userid:{
        type:String
    },
    Description:{
        type:String
    },
    Image:{
        type:String
    },
    Likes:{
        type:Array
    },
    Comments:[{
        userid:{
            type:String
        },
        comment:{
            type:String
        }
}]

},{timestamps:true})
const Postdb=mongoose.model('post',PostSchema)
module.exports = Postdb