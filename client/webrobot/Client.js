var Client = function(configuration) {
    /**
     * important urls are to be returned back to client from the server
     * 
     */
    console.log("constructed client instance");
    this._configuration = configuration;
    this._request = null;
    this._baseUrl = null;
};

Client.prototype.request = function(options, callback){

};

module.exports = Client;