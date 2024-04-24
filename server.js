const express = require('express');
const { MESSAGES } = require("./config/constant");
const { getCustomers, resetCustomers, addCustomer } = require('./data-access');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;


app.use(express.static('public'));
app.use(bodyParser.json());
app.get("/customers", async (req, res) => {
    const [customers, errorMsg] = await getCustomers();
    if (customers) {
        res.send(customers);
    }
    else {
        res.statusCode = 500;
        res.send(errorMsg.message);
    }
})
app.get("/reset", async (req, res) => {
    const [customers, errorMsg] = await resetCustomers();
    if (customers) {
        res.send(customers);

    }
    else {
        res.statusCode = 500;
        res.send(errorMsg.message);
    }
})
app.post("/customers", async (req, res) => {
    // - checks the request body
    if (Object.keys(req.body).length) {
        // - it calls the data access addCustomer method
        const [status, id, messageError] = await addCustomer(req.body);
        console.log(status)
        if (status === MESSAGES.SUCCESS) {
            res.statusCode = 201;
            res.send(`Record inserted id: ${id}`);
        } else {
            res.statusCode = 400;
            res.send(messageError.message);
        }

    }
    else {
        res.statusCode = 400;
        res.send("missing request body");
    }


})
console.log("Open a browser to http://localhost:" + port + " to view the application");
app.listen(port);
