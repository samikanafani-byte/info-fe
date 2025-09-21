import axios from 'axios';

const getToken = () => {
    const item = localStorage.getItem('token');
    var token = "Bearer " + item;
    // remove all ' and "" from the token
    token = token.replace(/['"]+/g, '');
    return token
}

const getAxiosInstance = (ignoreJson?: boolean | null) => {


    
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
    // var baseURL: string = "http://35.202.27.155";
    var baseURL: string = "http://localhost:8300";
    // var baseURL: string = "https://iqapi.bytebeam.co";
    const token = localStorage.getItem('token');

    var headers: { 'Content-Type'?: string, 'Accept': string, 'Authorization'?: string } = (token != null && token != "" && token != undefined && token != "null" && token != "undefined")
        ? {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': getToken()
        }
        : {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        };
    if (ignoreJson) {
        delete headers['Content-Type'];
    }
    console.log("Headers:", headers);

    var axiosInstance = axios.create({
        baseURL,
        headers: headers
    });
    return axiosInstance;
}


export default getAxiosInstance;