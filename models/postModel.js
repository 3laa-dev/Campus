const { Schema, model } = require("mongoose")

const postSchema = new Schema(
    {
        user:{
            required:true,
            type:Schema.ObjectId
        },
        title: {
            type: String,
            required: [true, "Title is reqiured"]
        },
        content: {
            type: String,
            required: [true, "content is reqiured"]
        },
        image: String,
        tags: [String],
        type: {
            type: String,
            enum: ["makale", "soru"],
            required: true
        }
        
    }
)

module.exports = model("post", postSchema);