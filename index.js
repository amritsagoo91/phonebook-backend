const express = require('express');
const app = express();

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

app.get('/persons', (req, res) => {
    res.json(persons)

})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people <br><p>${Date()}</p>`)
})

app.get('/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id)
    if (person) {
        res.send(person)
    } else {
        res.status(404).end();
    }
})

app.delete('/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();

})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})