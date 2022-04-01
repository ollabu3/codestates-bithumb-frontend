# codestates-bithumb-frontend

**node v16.14.2**

배포 링크 : [https://ollabu3.github.io/codestates-bithumb-frontend](https://ollabu3.github.io/codestates-bithumb-frontend/)

### 프로젝트 실행 방법

1. git clone
2. npm install
3. npm start

### 사용한 스택 목록

- javascript
- styped-component
- react
- react-hooks
- chart.js

### 구현한 기능 목록

- 24시간 기준 해당 자산에 대한
  - 실시간 시세, 변동률, 거래금액 리스트
  - 채결내역 테이브
  - 시세, 고가, 저가, 종가 내역
- 1시간 기준 해당 자산에 대한
  - 시세, 고가, 저가, 종가 차트

### 구현 방법 및 구현하면서 어려웠던 점

- websocket을 통해 실시간으로 해당 컴포넌트들에 맞게 가공해주는 바인딩을 하는것이 어려웠다. response object key들이 같지만 symbol value에따라 자산 타입이 달라져서 각 자산 목록들 symbol을 key로 설정하여 데이터를 만들어줬다.

### 성능 최적화에 대해서 고민하고 개선한 방법

- 한 페이지에 대한 데이터 양이 많아 최대한 컴포넌트를 쪼개려고 노력했었다.
