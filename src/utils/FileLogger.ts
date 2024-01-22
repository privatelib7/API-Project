import ip from 'ip';
import fs from 'fs';
import { Logger } from '../types/interfaces/Logger';

// class to log a message
class FileLogger implements Logger
{
    private rootPath: string = "./log/";

    constructor(rootPath: string = "./log/")
    {
        this.rootPath = rootPath;
    }

    getRootPath()
    {
        return this.rootPath
    }
    getCurIP() :string
    {
        return ip.address();
    }
    getCurISOTime() :string
    {
        return new Date().toISOString();
    }

    createFolderIfNotExists()
    {
        // 폴더 경로가 존재하지 않으면 생성
        if (!fs.existsSync(this.rootPath)) {
            // 재귀적으로 상위 폴더도 함께 생성
            fs.mkdirSync(this.rootPath, { recursive: true });

            return this.rootPath
        }
        
        return false
    }

    /**
     * 로그를 저장할 전체 파일 경로를 반환합니다.
     * 
     * @returns string 로그를 저장할 전체 파일 경로
     */
    getFullFileName() :string{
        return this.rootPath + (this.getCurISOTime()).split('T')[0] + '.log';
    }

    /**
     * 일반 로그 문자열을 반환합니다.
     * 
     * @param message 
     * @returns string 일반 로그 문자열
     */
    createNormalLogMsg(message:string)
    {
        return `[IP:${this.getCurIP()} / TIME: ${this.getCurISOTime()}] ${message}` + '\n'
    }

    /**
     * 경고 로그 문자열을 반환합니다.
     * 
     * @param message 
     * @returns string 경고 로그 문자열
     */
    createWarnLogMsg(message:string)
    {
        return `[IP:${this.getCurIP()} / TIME: ${this.getCurISOTime()}] [WARNING] ${message}` + '\n'
    }

    /**
     * 에러 로그 문자열을 반환합니다.
     * 
     * @param message 
     * @returns string 에러 로그 문자열
     */
    createErrorLogMsg(message:string)
    {
        return `[IP:${this.getCurIP()} / TIME: ${this.getCurISOTime()}] [ERROR] ${message}` + '\n'
    }

    /**
     * function to log a message into a file
     * 
     * @param message 
     * @returns void
     */
    log(message: string)
    {
        this.createFolderIfNotExists()

        return fs.appendFileSync(this.getFullFileName(), this.createNormalLogMsg(message))
    }

    /**
     * function to log a warning into a file
     * 
     * @param message 
     * @returns void
     */
    warn(message: string)
    {
        this.createFolderIfNotExists()

        return fs.appendFileSync(this.getFullFileName(), this.createNormalLogMsg(message))
    }

    /**
     * function to log an error into a file
     * 
     * @param message 
     * @returns void
     */
    error(message: string)
    {
        this.createFolderIfNotExists()
        
        return fs.appendFileSync(this.getFullFileName(), this.createErrorLogMsg(message))
    }
}

export default FileLogger;