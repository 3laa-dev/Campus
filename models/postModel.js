const { Schema, model } = require("mongoose")

const postSchema = new Schema(
    {
        user:{
            required:true,
            type:Schema.ObjectId,
            ref: "User"
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
        },
        solved: {
            type: Boolean,
            default: false
        }
        
    }
)

module.exports = model("post", postSchema);