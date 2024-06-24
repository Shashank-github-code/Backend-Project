class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.datamessage=message
        this.success=statusCode<400
    }
}