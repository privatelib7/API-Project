import { AxiosInstance, AxiosStatic } from 'axios';

import axios from 'axios'

class RetryAxiosMng
{
    private axios:AxiosStatic;
     
    constructor()
    {
        this.axios = axios;
    }

    setAxios(axios:AxiosStatic)
    {
        this.axios = axios
    }

    createBasicInstance(baseURL, responseType?)
    {
        return this.axios.create({
            baseURL: baseURL,
            responseType: responseType
        })
    }

    reqByInstance(instance, originalRequest){
        instance(originalRequest)
    }

    reRequest(instance:AxiosInstance, milliseconds:number, originalRequest) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.reqByInstance(instance, originalRequest))
            }, milliseconds);
        });
    };

    updateInstance(instance:AxiosInstance, maxRetry, tryIntervalMs)
    {
        let _remainRetryCnt = maxRetry

        instance.interceptors.response.use((response)=>{
            return {res: response, remainRetryCnt: _remainRetryCnt} as any;
        }, error=>{
            _remainRetryCnt -= 1 // 차감

            if (_remainRetryCnt <= 0) {
                return {res: error, remainRetryCnt: _remainRetryCnt}
                // return Promise.reject({err: error, remainRetryCnt: _remainRetryCnt});
            }
            
            const originalRequest = error.config

            // && error.errno == -4077 && error.message == "read ECONNRESET"
            return this.reRequest(instance, tryIntervalMs, originalRequest);
        })

        return instance;
    }

    createInstance(maxRetry:number, tryIntervalMs:number, baseURL:string, responseType?):  AxiosInstance{
        let instance = this.createBasicInstance(baseURL, responseType)
        
        instance = this.updateInstance(instance,maxRetry,tryIntervalMs)
    
        return instance
    }
}

export default RetryAxiosMng