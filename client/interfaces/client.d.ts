interface IConfigurartion {
    baseUrl: string;
    endpoint: string;
}

interface IAuthorization {
    authorization: string;
}

interface ISWClient{
    _authorization:IAuthorization;
    _configuration:IConfigurartion;
    send(callback:FunctionConstructor):Axios.IPromise<Object>;
    getSettings():Object | boolean;
}

interface IFieldInstance{
    selector:string;
    placeholder:string
}



