const express = require('express');
const bodyParser = require('body-parser');
const {routes}  = require('./routes/customersRoutes');
const { authorization } = require('./middleware/authMiddleware');
const app = express();
const port = 4000;


app.use(express.static('public'));
app.use(bodyParser.json());
app.use((req,res,next)=>{authorization(req,res,next)})

routes(app)
console.log("Open a browser to http://localhost:" + port + " to view the application");
app.listen(port);

