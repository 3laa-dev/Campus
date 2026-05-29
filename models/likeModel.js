const { Schema, model } = require("mongoose")

const likeSchema = new Schema(
    {
        user:{
            required:true,
            type:Schema.ObjectId
        },
        post:{
            required:true,
            type:Schema.ObjectId
        }
        
    }
)

module.exports = model("like", likeSchema);