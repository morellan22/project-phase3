const express = require('express');
const { getCustomers } = require('./data-acess');
const app = express();
const port = 4000;


app.use(express.static('public'));
app.get("/customers", async (req,res)=>{
    const customers = await getCustomers();
    res.send(customers);
})
console.log("Open a browser to http://localhost:"+port+" to view the application");
app.listen(port);
