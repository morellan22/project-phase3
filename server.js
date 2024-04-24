const express = require('express');
const { getCustomers } = require('./data-acess');
const app = express();
const port = 4000;


app.use(express.static('public'));
app.get("/customers", async (req,res)=>{
    const [customers,errorMsg] = await getCustomers();
    if(customers){
        res.send(customers);
    }
    else{
        res.statusCode = 500;
        res.end(errorMsg.message);
    }
})
console.log("Open a browser to http://localhost:"+port+" to view the application");
app.listen(port);
