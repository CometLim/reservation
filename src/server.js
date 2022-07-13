import express, { application } from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");

app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`listening on http://localhost:3000`);
app.listen(3000, handleListen);