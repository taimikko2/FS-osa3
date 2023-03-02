const { response } = require("express");
const express = require("express");
const app = express();
const cors = require("cors");

var morgan = require("morgan");

app.use(express.json());
app.use(express.static('build'))
app.use(cors());

//app.use(morgan('tiny'))
morgan.token("reqx", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :reqx")
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "aaa",
    number: "123",
    id: 5,
  },
  {
    name: "aab",
    number: "12223",
    id: 6,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1><div>Try /api/persons</div");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  };
  persons = persons.concat(person);
  console.log("adding person", person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  const time = new Date();
  res.send(`<div>phonebook has info for ${persons.length} people</div>
    <div>${time}</div>`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// https://fs-osa3.onrender.com