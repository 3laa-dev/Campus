const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "name required"]
        },
        username: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },
        title: {
            type: String,
            trim: true,
            default: "Öğrenci"
        },
        bio: {
            type: String,
            trim: true,
            default: "CampusHUB üyesi."
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: String,
        profileImage: String,
        password: {
            type: String,
            required: [true, "password is required"],
            minlength: [8, "too short password"]
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: ["admin","student"],
            default: "student"
        },
        
    }, { timestamps: true });

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
})

module.exports = model("User", userSchema);