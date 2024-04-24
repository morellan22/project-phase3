// mongodb client driver
const { MongoClient } = require('mongodb');

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
    module.exports = {getCustomers, resetCustomers}; 