require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const Person = require('./models/person')
const app = express();



app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

const logger = (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}


app.use(morgan(logger))


let persons =
    [
        {
            "id": "1",
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": "2",
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": "3",
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": "4",
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]


// const generateId = () => {
//     let uniqueId;
//     do {
//         uniqueId = (Math.floor(Math.random() * 1000000)).toString();
//     } while (persons.some(person => person.id === uniqueId));

//     return uniqueId;
// };

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))


})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people <br><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id)
    if (person) {
        res.send(person)
    } else {
        res.status(404).end();
    }
})

// app.delete('/api/persons/:id', (req, res) => {
//     const id = req.params.id;
//     persons = persons.filter(person => person.id !== id);
//     res.status(204).end();

// })




app.post('/api/persons', (req, res) => {
    const body = req.body;
    const findName = persons.find(person => person.name === body.name);

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number missing' });
    }
    if (findName) {
        return res.status(400).json({ error: "Name must be unique" })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person.save().then(savedPerson => res.status(201).json(savedPerson))


    { /*   persons = persons.concat(person)
    res.status(201).json(person);*/}
});

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            if (result) {
                res.status(200).send({ message: `${result.name} deleted successfully` });
            } else {
                res.status(404).send({ error: 'Person not found' });
            }
        })
        .catch(error => {
            res.status(500).send({ error: 'Internal server error' });
        });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})

