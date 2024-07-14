import { PORT } from "./config/config.js";
import express from "express";
import coffees from "./coffees.json";

import { config } from "dotenv";
config()

const app = express();

app.use(express.json());

app.get("/coffees", (req, res) => {
    res.status(200).send(coffees);
});

app.get("/coffees/:id", (req, res) => {
    const { id } = req.params;
    const coffee = coffees.find((c) => c.id == id);
    if (coffee) res.status(200).send(coffee);
    else res.status(404).send({ message: "No coffee found with this id" });
});

app.post("/coffees", (req, res) => {
    const coffee = req.body;
    const { id } = coffee;
    const existingCoffeeWithThisId = coffees.some((c) => c.id == id);
    if (existingCoffeeWithThisId)
        res.status(400).send({
            message: "There's already a coffee with this id",
        });
    else {
        coffees.push(coffee);
        res.status(201).send(coffee);
    }
});

app.put("/coffees/:id", (req, res) => {
    const coffee = req.body;
    const { id } = req.params;
    if (id != coffee.id)
        return res.status(400).send({
            message: "Param id doesn't match with the coffee id",
        });

    const coffeeIndexFound = coffees.findIndex((p) => p.id == id);
    if (coffeeIndexFound >= 0) {
        coffees[coffeeIndexFound] = coffee;
        res.send(coffees);
    } else {
        res.status(404).send({ message: "There's no coffee with this id" });
    }
});

app.delete("/coffees/:id", (req, res) => {
    const jwt = req.header("Authorization");
    if (jwt) {
        const { id } = req.params;
        const coffeeIndexFound = coffees.findIndex((c) => c.id == id);

        if (coffeeIndexFound >= 0) {
            coffees.splice(coffeeIndexFound, 1);
            console.log(coffeeIndexFound, coffees);
            res.send(coffees);
        } else {
            res.status(404).send({ message: "There's no coffee with this id" });
        }
    } else res.status(400).send({ message: "There's no token in the headers" });
});

app.use("*", (req, res) => {
    res.status(404).send({ message: "This route doesn't exists" });
});

app.listen(PORT, () => {
    console.log(`🔥 Server on 🔥 http://localhost:${PORT}`);
});

export default app;