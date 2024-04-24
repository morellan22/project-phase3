const express = require('express');
const app = express();
const port = 4000;


app.use(express.static('public'));
console.log("Open a browser to http://localhost:"+port+" to view the application");
app.listen(port);
