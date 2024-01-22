import axios from 'axios'
import ip from 'ip';
import fs from 'fs';
import { jest } from '@jest/globals';
import FileLogger from '../../src/utils/FileLogger'


// ip.address()를 mocking하는 함수
function mockIPAddress() :string{
    const mockIP = '192.168.1.45';
    jest.spyOn(ip, 'address').mockReturnValue(mockIP);

    return mockIP;
}

// Date 객체와 toISOString 메소드 mocking
function mockDate() :Date{
    const mockDate = new Date('2024-01-14T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    return mockDate
}

describe('FileLogger 클래스 단위 테스트', () => {

    it('일반 로그 문자열을 생성합니다.', async () => {
        //mocking
        const mockedIP = mockIPAddress();
        const mockedDate = mockDate();

        const message = "test message"
        const logger = new FileLogger();
        const normalLogMsg = logger.createNormalLogMsg(message);
      
        expect(normalLogMsg).toEqual(`[IP:${mockedIP} / TIME: ${mockedDate.toISOString()}] ${message}` + '\n');

        // Mocking 해제
        jest.restoreAllMocks();
    })

    it('경고 로그 문자열을 반환합니다.',()=>{
        //mocking
        const mockedIP = mockIPAddress();
        const mockedDate = mockDate();

        const message = "test message"
        const logger = new FileLogger();
        const warnLogMsg = logger.createWarnLogMsg(message);
      
        expect(warnLogMsg).toBe(`[IP:${mockedIP} / TIME: ${mockedDate.toISOString()}] [WARNING] ${message}` + '\n');

        // Mocking 해제
        jest.restoreAllMocks();
    })

    it('에러 로그 문자열을 생성합니다.', async () => {
        //mocking
        const mockedIP = mockIPAddress();
        const mockedDate = mockDate();

        const logger = new FileLogger();
        const message = "test message"
        const errorLogMsg = logger.createErrorLogMsg(message);
      
        expect(errorLogMsg).toBe(`[IP:${mockedIP} / TIME: ${mockedDate.toISOString()}] [ERROR] ${message}` + '\n');

        // Mocking 해제
        jest.restoreAllMocks();
    })

    it("로그를 저장할 전체 파일 경로를 반환합니다.", ()=>{
        //mocking
        const mockedIP = mockIPAddress();
        const mockedDate = mockDate();

        const logger = new FileLogger();
        const fullFilePath = logger.getFullFileName();

        expect(fullFilePath).toBe(logger.getRootPath() + (logger.getCurISOTime()).split('T')[0] + '.log');

        // Mocking 해제
        jest.restoreAllMocks();
    })

    it("로그를 작성할 때 폴더가 존재하지 않다면 생성합니다.",()=>{
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);

        // fs.existsSync와 fs.mkdirSync mocking
        const rootPath = '/some/path';
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        const mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => rootPath);

        const fileLogger = new FileLogger(rootPath);

        // 메소드 실행
        const result = fileLogger.createFolderIfNotExists();

        // fs.mkdirSync가 호출되었는지 검증
        expect(mkdirSyncMock).toHaveBeenCalledWith(rootPath, { recursive: true });
        expect(result).toEqual(rootPath)

        // Mocking 해제
        jest.restoreAllMocks();

    })

    it("로그를 작성할 때 폴더가 존재하면 폴더 생성을 무시합니다.",()=>{
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);

        // fs.existsSync와 fs.mkdirSync mocking
        const rootPath = '/some/path';
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        const mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => rootPath);

        const fileLogger = new FileLogger(rootPath);

        const result = fileLogger.createFolderIfNotExists();
        expect(result).toEqual(false)

        // Mocking 해제
        jest.restoreAllMocks();

    })

    it("일반 로그 작성을 요청하면 파일 작성을 시도합니다..",()=>{
        const appendFileSync = jest.spyOn(fs, 'appendFileSync').mockImplementation(() => true);

        const rootPath = '/some/path';
        const fileLogger = new FileLogger(rootPath);

        const message = "test message"
        fileLogger.log(message);

        expect(appendFileSync).toHaveBeenCalled();
    })

    it("경고 로그 작성을 요청하면 파일 작성을 시도합니다..",()=>{
        const appendFileSync = jest.spyOn(fs, 'appendFileSync').mockImplementation(() => true);

        const rootPath = '/some/path';
        const fileLogger = new FileLogger(rootPath);

        const message = "test message"
        fileLogger.warn(message);

        expect(appendFileSync).toHaveBeenCalled();
    })

    it("에러 로그 작성을 요청하면 파일 작성을 시도합니다..",()=>{
        const appendFileSync = jest.spyOn(fs, 'appendFileSync').mockImplementation(() => true);
        
        const rootPath = '/some/path';
        const fileLogger = new FileLogger(rootPath);

        const message = "test message"
        fileLogger.error(message);

        expect(appendFileSync).toHaveBeenCalled();
    })
});
