import appConfig from "../../appconfig.json"

export default {
  /**
   * 서버 포트 설정
   */
  port:appConfig.PORT || 3000,
  
  /*
   * API 설정
   */ 
  api:{
    prefix:appConfig.api.prefix || "/api",
  },

  /**
   * Retry Axios 설정
   */
  axios:{
    maxRetryCnt: appConfig.axios.maxRetryCnt || 5
  },

  /*
   * DB 설정
   */ 
  jsonDB:{
    filename:appConfig.jsonDB.filename || "apiData", 
    saveOnPush:appConfig.jsonDB.saveOnPush || true, 
    humanReadable:appConfig.jsonDB.humanReadable || false, 
    separator:appConfig.jsonDB.separator || "/", 
  },
  
  /*
   * Cache DB 설정
   */ 
  cacheJsonDB:{
    filename:appConfig.cacheJsonDB.filename || "apiCacheDB", 
    saveOnPush:appConfig.cacheJsonDB.saveOnPush || true, 
    humanReadable:appConfig.cacheJsonDB.humanReadable || false, 
    separator:appConfig.cacheJsonDB.separator || "/", 
  }
};