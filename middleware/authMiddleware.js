function authorization(req, res, next){
    
    const envVarValue = process.argv[2]?process.argv[2].split('=')[1]:process.env.API_KEY;
    let apiKey = req.headers['x-api-key']? req.headers['x-api-key']: req.query.api_key; 

    if(apiKey===undefined){
        responseApiKeyMissingError(res);
    }else{
        if(apiKey === envVarValue){
            next();
        }
        else{
            responseApiKeyInvalidError(res);
        }
    }
}
function responseApiKeyMissingError(res) {
    res.statusCode = 401;
    res.send("API Key is missing");
}
function responseApiKeyInvalidError(res) {
    res.statusCode = 403;
    res.send("API Key is invalid");
}

module.exports = {authorization}