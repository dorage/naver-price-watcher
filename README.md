# EXPRESS naverPriceWatcher ON VSCODE

네이버 쇼핑을 크롤링하는 서버입니다.

검색어를 기준으로 모든 상품을 크롤링합니다.

## TODO

-   각 상품코드 등록 쇼핑몰의 상품ID 수집
-   각 상품에 대한 코멘트가 가능

## 목표

벤더사들의 등록상품을 관리를 위해 가격조사를 자동화

## Install

    $ cd nodenaverPriceWatcher
    $ npm install

## Configure app

.gitignore 에 .env.development를 추가해주세요.

    $ npm i

## Running the project

NODE_ENV = 'development' 으로 실행됩니다.

    $ npm start

NODE_ENV = 'production' 으로 실행됩니다.

    .env.production 이 있어야합니다.
    $ npm run production
