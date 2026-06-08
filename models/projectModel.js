const { Schema, model } = require("mongoose")

const projectSchema = new Schema(
    {
        user: {
            required: true,
            type: Schema.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: [true, "Title is reqiured"]
        },
        description: {
            type: String,
            required: [true, "content is reqiured"]
        },
        githubLink: String,

    }
)

module.exports = model("project", projectSchema);