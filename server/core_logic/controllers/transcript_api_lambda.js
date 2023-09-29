const { default: axios } = require('axios');

class speechToText {
   
    axiosInstance;   
    constructor() { 
        this.axiosInstance = axios.create({   
            //baseURL: "https://sl44xst6ghx3rrpractnyjy6yy0txpie.lambda-url.ap-south-1.on.aws/",
            timeout: 1800000          
        });  
    };
  
    run(payload) {
        
        return this.axiosInstance.post("http://127.0.0.1:5000/", payload)
    }
}
 
module.exports = { 
    speechToText
}