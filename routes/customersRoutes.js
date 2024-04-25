const { addCustomerController, deleteCustomerController, getCustomerByValueController, getCustomersController, resetCustomersController, updateCustomerController } = require("../controllers/customerController");

function routes(app) {
    app.route('/reset').get(resetCustomersController);
    app.route('/customers')
    
    .get(getCustomersController)

   
    .post(addCustomerController);

    app.route('/customers/:id')

    .get(getCustomerByValueController)

    // update a contact
    .put(updateCustomerController)

    .delete(deleteCustomerController)
}

module.exports = {routes};