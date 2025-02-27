const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://user_1:${password}@cluster0.vcdii.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
    .then(() => {

        if (name === undefined && number === undefined) {
            Person.find({}).then(result => {
                console.log('phonebook:')
                result.forEach(person => {
                    console.log(person)
                })
                mongoose.connection.close()
            })
        } else {
            const person = new Person({
                name,
                number
            })

            person.save().then(result => {
                console.log("new person saved")
                mongoose.connection.close()
            })
        }
    })
    .catch(err => {
        console.log('Error:', err)
        mongoose.connection.close()
    })
