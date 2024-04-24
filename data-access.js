// mongodb client driver
const { MongoClient } = require('mongodb');
const {MESSAGES} = require("./config/constant")
// DB Connection URL
var url = "mongodb://127.0.0.1:27017";

// Create client
const client = new MongoClient(url);

// Database and collection variables
const dbName = "custdb";
const collectionName = "customers"

async function getCustomers(){
    let messageError=null;
    let customers = null;
    try {
        
        // connect to the db server
        const collection = await getCollection();
        customers = await collection.find({}).toArray();
        
     //   throw {"message":"an error occured"};
        console.log("finish getCustomer():%s",JSON.stringify(customers));
        } catch (error) {
            customers=null;
            messageError = error;
            console.error(error);
        }finally{
            await client.close();
        }
        return [customers, messageError];
    }
async function getCollection() {
    await client.connect();

    // set the database to use
    const db = client.db(dbName);
    // set the collection to use
    const collection = db.collection(collectionName);
    return collection;
}

    async function resetCustomers(){
        // - creates a variable pointing to an array containing three customer objects
        const customersInitial = [{
            "id": 0,
            "name": "Mary Jackson",
            "email": "maryj@abc.com",
            "password": "maryj"
          },
          {
              "id": 1,
            "name": "Karen Addams",
            "email": "karena@abc.com",
            "password": "karena"
          },
          {
            "id": 2,
            "name": "Scott Ramsey INITIAL",
            "email": "scottr@abc.com",
            "password": "scottr"
          }];
          let countCustomers = 0;
          let messageError = null;
          let messageResult = null;
          try {
        
            const collection = await getCollection();
           //  deletes all existing records in the customer collection
        await collection.deleteMany({});
        await collection.insertMany(customersInitial);
        countCustomers = await collection.countDocuments();
        messageResult = `Now, there are ${countCustomers} records`;
            } catch (error) {
                 messageError = error;
                console.error(error);
            }finally{
                await client.close();
            }
            return [messageResult, messageError];
    }
    async function addCustomer(newCustomer){
        let messageError=null;
        let id = null;
        let status = MESSAGES.FAIL;
        console.log("%s %s %s",status,id, messageError)
        try {
           // throw {"message":"an error occured"};
            // connect to the db server
            const collection = await getCollection();
            await collection.insertOne(newCustomer)
            id = newCustomer["id"];
            status = MESSAGES.SUCCESS;
            
            console.log("finish addCustomer():%s",JSON.stringify(newCustomer));
            } catch (error) {
                messageError = error;
                console.error(error);
            }finally{
                await client.close();
            }
            console.log("%s %s %s",status,id, messageError)
            return [status,id, messageError];
    }

    async function getCustomerById({id}){
        let messageError=null;
        let customer = null;
        try {
            
            // connect to the db server
            const collection = await getCollection();
            customer = await collection.findOne({"id":Number(id)});
            
         //   throw {"message":"an error occured"};
            console.log("finish getCustomerById():%s",JSON.stringify(customer));
            } catch (error) {
                customer=null;
                messageError = error;
                console.error(error);
            }finally{
                await client.close();
            }
            return [customer, messageError];
        }
   async function updateCustomer(updatedCustomer){
    let messageError=null;
    let status = MESSAGES.FAIL;
    try {
        
        // connect to the db server
        const collection = await getCollection();
        customer = await collection.updateOne({ id: updatedCustomer.id },
            {$set: updatedCustomer},
            {upsert: true});
            status= MESSAGES.SUCCESS;
     //   throw {"message":"an error occured"};
        console.log("finish updateCustomer():%s",JSON.stringify(customer));
        } catch (error) {
            messageError = error;
            console.error(error);
        }finally{
            await client.close();
        }
        return [status, messageError];
    }
    module.exports = {getCustomers, resetCustomers, getCustomerById, updateCustomer}; 