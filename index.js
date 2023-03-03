require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

var morgan = require("morgan");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

morgan.token("reqx", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :reqx")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1><div>Try /api/persons</div");
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((p) => {
      console.log("P", JSON.stringify(p));
      res.json(p);
    })
    .catch((error) => {
      console.log("error GET /api/persons :", error.message);
    });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }
  // TODO: ?
  /*  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  // TODO: delete
  //persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  const time = new Date();
  Person.find({})
  .then((p) => {
    res.send(`<div>phonebook has info for ${p.length} people</div>
    <div>${time}</div>`);
  })
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT; // process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// https://fs-osa3.onrender.com
