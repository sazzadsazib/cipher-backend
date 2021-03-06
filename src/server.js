let express = require("express");
let app = express();
let blogRoute = require("./routes/notes");
let customerRoute = require("./routes/userTable");
let path = require("path");
let cors = require('cors');
let bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
});

app.use(customerRoute);
app.use(blogRoute);
app.use(express.static("public"));

// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/500.html"));
});

// Handler for Error 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendFile(path.join(__dirname, "../public/500.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
