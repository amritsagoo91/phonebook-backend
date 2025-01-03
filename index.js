require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

const logger = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    tokens.body(req, res),
  ].join(" ");
};

app.use(morgan(logger));

{/*let persons = [

];*/}

// const generateId = () => {
//     let uniqueId;
//     do {
//         uniqueId = (Math.floor(Math.random() * 1000000)).toString();
//     } while (persons.some(person => person.id === uniqueId));

//     return uniqueId;
// };

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        res.json(persons);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.countDocuments({})
    .then(count => res.send(`<p>Phonebook has info for ${count} people<br><p>${Date()}</p>`));

});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// app.delete('/api/persons/:id', (req, res) => {
//     const id = req.params.id;
//     persons = persons.filter(person => person.id !== id);
//     res.status(204).end();

// })



app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  {/*const findName = persons.find((person) => person.name === body.name);*/ }

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Name or number missing" });
  }
  {/*if (findName) {
    return res.status(400).json({ error: "Name must be unique" });
  }*/}

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((error) => next(error));

  {
    /*   persons = persons.concat(person)
    res.status(201).json(person);*/
  }
});

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body
  Person.findByIdAndUpdate(req.params.id, { number }, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res
          .status(200)
          .send({ message: `${result.name} deleted successfully` });
      } else {
        res.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});



const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name == "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
