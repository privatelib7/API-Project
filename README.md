# API Project

## 기능 및 주요 구성

### 기능 구성
- 랭킹 조회
  - 오리콘 차트, 데일리 싱글 차트
    - 일본 사이트의 특성상 SHIFT-JIL 인코딩 기능을 추가했습니다.	
  - 박스오피스 
- 한자 조회
- 네이버 주가 조회

### 주요 사양
- swagger ui를 통한 매뉴얼 관리
  - Path: /api/api-docs
- 커스텀 캐시 미들웨어 적용 후 응답 속도 개선
  - 약 500ms  -> 약 10ms
  - ttl 설정 가능
- 요청 실패 시, 재시작 루틴 추가
- 로깅
  - 성공, 실패 횟수 로깅
  - 성공 데이터 누적

## Project structore

```
src
│   app.ts          # 진입점
└───api             # Express 라우터 컨트롤러
└───config          # 환경설정값
└───loaders         # 시작 프로세스
└───services        # 비즈니스 로직
└───types           # 타입 선언 파일 (d.ts)
└───utils           # 공통 활용 함수
```

## Usage

### 의존성 설치
```
npm install
```

### 단위 테스트 코드 커버리지 확인
```
npm run coverage
```

### 서버 구동
```
npm start
```
