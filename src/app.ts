import express from 'express';

import config from './config';
import * as loaders from './loaders';

let server
let app = express()

function closeServer() {
  return new Promise((resolve, reject)=>{
    server.close(()=>{
      console.log(`Server closed: ${config.port}`);
      resolve(1);
    })
  })

}

async function startServer() {
  // 서버 시작 프로세스 
  await loaders.init(app, config);

  // 서버 포트 개방
  server = app.listen(config.port, () => {
    console.log(`🔥 Server listening on port: ${config.port}` + '\n');
  }).on('error', (err:any)=> {
    switch(err.code){
      case "EADDRINUSE":
        console.error(`🚫 Port ${config.port} is already in use. (${config.port}번을 사용하는 프로세스를 kill(윈도우 명령어: netstat -ano | findstr [포트번호], taskkill /F /PID [프로세스 ID])하거나 appconfig.json 설정 파일을 변경해주세요. )`);

        break;

      default:
        console.error(err);

        break;
    }
  });
}

// 서버 시작
startServer()

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


module.exports.app = app;
module.exports.closeServer = closeServer;