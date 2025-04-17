import express from "express"
import data from "./data.js"

const app = express()

function checkUniqueID(array) {
    return (req, res, next) => {
        const id = Number(req.params.id)

        if (!id) {
            res.status(400).send("ID is required")
            return
        }

        if (array.some(person => person.id === id)) {
            res.status(400).send("ID must be unique")
            return
        }

        next()
    };
}

app.use(express.json())

app.get("/api/people", (req, res) => {
    res.status(200).json(data.people)
})

app.post("/api/people", checkUniqueID(data.people), (req, res) => {
    const properties = req.body

    if (Number(properties.id) && properties.name) {
        data.people.push({id: Number(properties.id), 
                         name: properties.name})
                         
        res.status(200).send("Success")
    }

    else {
        res.status(400).send("Fields were not properly established")
    }
})

app.put("/api/people/:id", (req, res) => {
    const id = Number(req.params.id)
    const name = req.body.name

    if (id && name && id > 0 && id <= data.people.length) {
        data.people[id - 1] = {
            id: id,
            name: name
        }

        res.status(200).send("Success")
    }

    else {
        res.status(400).send("Fields were not properly established")
    }
})

app.delete("/api/people/:id", (req, res) => {
    const id = Number(req.params.id)

    if (id > 0 && id <= data.people.length) {
        data.people = data.people.filter(person => person.id !== id)
        res.status(200).send("Success")
    }

    else {
        res.status(400).send("Fields were not properly established")
    }
})

app.all("*", (req, res) => {
    res.status(404).send("Page not found")
})

app.listen(8080, () => console.log("Server listening on port 8080..."))