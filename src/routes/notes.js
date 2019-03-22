const NoteModel = require("../models/notes.model");
const UserModel = require("../models/user.model");
const express = require("express");
const router = express.Router();
const env = require("dotenv").config();

// create
router.post("/notes", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    if (
        !req.body.username ||
        !req.body.notesData ||
        !req.body.notesTitle ||
        !req.body.storedPassword
    ) {
        console.log("Fields Are not Available in body");
        console.log(req.body);
        res.send({ status: false, error: "body is not available" });
    } else {
        UserModel.findOne({
            username: req.body.username,
            password: req.body.storedPassword,
        }).then((doc) => {
            // console.log(doc);
            if (!doc || doc.length === 0) {
                res.send({ success: false });
            } else {
                let noteModelData = {
                    username: req.body.username,
                    notesData: JSON.stringify(req.body.notesData),
                    notesTitle: req.body.notesTitle,
                    createdAt: new Date(),
                };
                NoteModel.findOne({ notesTitle: noteModelData.notesTitle })
                    .then((doc) => {
                        if (doc !== null) {
                            res.send({ success: false, error: "Note Already Exist" });
                        } else {
                            let model = new NoteModel(noteModelData);
                            model
                                .save()
                                .then((doc) => {
                                    let success = true;
                                    if (!doc || doc.length === 0) {
                                        success = false;
                                    }
                                    res.status(200).send({ success: success });
                                })
                                .catch((err) => {
                                    console.log("err", err);
                                    res.status(200).json({ success: false, error: err.errmsg });
                                });
                        }
                    })
                    .catch((e) => console.log(e));
            }
        });
    }
});

// getAllBlogs
router.get("/getUserNotes", (req, res) => {
    UserModel.findOne({
        username: req.query.username,
        password: req.query.storedPassword,
    })
        .then((doc) => {
            if (!doc || doc.length === 0) {
                res.send({ success: false });
            } else {
                NoteModel.find({ username: req.query.username })
                    .then((doc) => {
                        let success = true;
                        if (!doc || doc.length === 0) {
                            success = false;
                        }

                        res.status(200).send({ success: success, notes: doc });
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    });
            }
        })
        .catch((e) => res.status(500).json(err));
});

module.exports = router;
