const { MESSAGES } = require("../config/constant");
const { updateCustomer,getCustomerById, getCustomers,getCustomerByValue,deleteCustomerById,resetCustomers,addCustomer } = require("../data-access");
function setResponse(res, code, message){
    res.status(code);
    res.send(message);
}
function responseServerError(res, errorMsg) {
    setResponse(res, 500,errorMsg.message);
}

function responseMissingBody(res) {
    setResponse(res, 400,"missing request body");
}
function responseMissingQueryString(res){
    setResponse(res, 400,"name must be one of the following (id, email, password)");    
}
function responseNotMatch(res){
    setResponse(res, 404,"no matching customer documents found");    
}
function validateQueryString(req){
    const requiredFields = ["id", "email", "password"];
    return (Object.keys(req.query).length&&(requiredFields.some((value)=>Object.keys(req.query).includes(value))));

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
        if (validateQueryString(req)) {
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
            responseNotMatch(res);
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
        setResponse(res, 404,"invalid customer number");
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
            setResponse(res, 201,`Record inserted id: ${id}`);
        } else {
            setResponse(res, 400,messageError.message);
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
            setResponse(res, 201,`Record updated id: ${updatedCustomer.id}`);
        } else {
            setResponse(res, 400, messageError.message);
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
            setResponse(res, 201,`Record deleted id: ${id}`);
        } else {
            setResponse(res, 400,messageError.message);
        }
    }

}
module.exports = {deleteCustomerController,addCustomerController,getCustomerByValueController,getCustomersController,updateCustomerController, resetCustomersController}
