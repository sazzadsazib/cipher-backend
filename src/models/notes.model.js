const mongoose = require("mongoose");
const env = require("dotenv").config();

const server = process.env.DB_HOST;
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${user}:${password}@${server}/${database}`);

let NoteScema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    notesTitle: {
        type: String,
        required: true,
        unique: true,
    },
    notesData: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
});

module.exports = mongoose.model("notes", NoteScema);
