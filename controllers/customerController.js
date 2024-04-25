const { MESSAGES } = require("../config/constant");
const { updateCustomer,getCustomerById, getCustomers,getCustomerByValue,deleteCustomerById,resetCustomers,addCustomer } = require("../data-access");

function responseServerError(res, errorMsg) {
    res.statusCode = 500;
    res.send(errorMsg.message);
}

function responseMissingBody(res) {
    res.statusCode = 400;
    res.send("missing request body");
}
function responseMissingQueryString(res){
    res.statusCode = 400;
    res.send("query string is required");    
}
async function getCustomersController (req, res) {
    const [customers, errorMsg] = await getCustomers();
    if (customers) {
        res.send(customers);
    }
    else {
        responseServerError(res, errorMsg);
    }
}
async function getCustomerByValueController(req, res) {
    console.log(req)
    if(req.params.id === 'find'){
        console.log(req.query)
        console.log(Object.keys(req.query).length)
        if (Object.keys(req.query).length) {
            let filter;
            if(req.query.api_key){
                ({api_key,...filter}=req.query);
            }
        else{
            filter=req.query;
        }
        const [customer, errorMsg] = await getCustomerByValue(filter);
        if (customer) {
            res.send(customer);
        }else {
            res.statusCode = 404;
            res.send("invalid customer value");
        }
        }
        else{
            responseMissingQueryString(res);    
        }       
    }
    else{
    if (req.params.id === undefined) {
        responseMissingBody(res);
    }
    else{
    const [customer, errorMsg] = await getCustomerById(req.params);
    if (customer) {
        res.send(customer);
    }else {
        res.statusCode = 404;
        res.send("invalid customer number");
    }

    }
}

}
async function resetCustomersController (req, res) {
    const [customers, errorMsg] = await resetCustomers();
    if (customers) {
        res.send(customers);

    }
    else {
        responseServerError(res, errorMsg);
    }
}
async function addCustomerController(req, res) {
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
        responseMissingBody(res);
    }


}
async function updateCustomerController(req,res){
    console.log(req.params)
    if (req.params.id === undefined || req.body === undefined) {
        responseMissingBody(res);
    }
    else{
        let id = req.params.id;
        let updatedCustomer = req.body;
        updatedCustomer.id=Number(id);
     
       if(updatedCustomer){
        const [status, messageError] = await updateCustomer(updatedCustomer);
        console.log(status)
        if (status === MESSAGES.SUCCESS) {
            res.statusCode = 201;
            res.send(`Record updated id: ${updatedCustomer.id}`);
        } else {
            res.statusCode = 400;
            res.send(messageError.message);
        }

    }
}

}
 async function deleteCustomerController(req,res){
    console.log(req.params)
    if (req.params.id === undefined || req.body === undefined) {
        responseMissingBody(res);
    }
    else{
        let id = Number(req.params.id);

        const [status, messageError] = await deleteCustomerById(id);
        console.log(status)
        if (status === MESSAGES.SUCCESS) {
            res.statusCode = 201;
            res.send(`Record deleted id: ${id}`);
        } else {
            res.statusCode = 400;
            res.send(messageError.message);
        }
    }

}
module.exports = {deleteCustomerController,addCustomerController,getCustomerByValueController,getCustomersController,updateCustomerController, resetCustomersController}
