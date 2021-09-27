// url 127.0.0.1:3800 -> hello ingcoin! 출력을 해보자

const express = require('express')
const request = require('request')
const cheerio = require('cheerio')  // npm install cheerio
const app = express()

// 요청 -> 응답
app.get('/', (req, res) => {
    res.send('hello ingcoin!')
})

// 요청A - 요청B - 응답B - 응답A
app.get('/naver', (req, res) => {
    // 요청 B - request 라는 패키지를 사용할거임
    request('https://naver.com', (err, response, body) => {
        console.log(err)

        if (err == null) {
            res.send('naver')
        } else {
            res.send('error')
        }
    })
})

app.get('/naver2', (req, res) => {
    request(
        {
            url: "http://naver.com",
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: "{msg:'hello world!'}"
        },
        (err, response, data) => {
            console.log(data)
            console.log(response.statusCode);

            if (err == null && response.statusCode == 200) {
                res.send('naver2')
            } else {
                res.send('error')
            }
        })
})

app.get('/crawling', (req, res) => {
    request('http://naver.com', (err, response, data) => {
        let $ = cheerio.load(data)      // 얘를 선택자로 쓸거임

        // 뽑아낼 영역. css 에서 선택하듯이 뽑아서 결과물이 여러개니까 each 로 반복문 돌림
        $('.partner_box_wrap > .partner_box:nth-child(3) > a').each((index, item) => {
            // console.log(typeof(item)) // 이렇게 찍어서 어떤 형태인지 알수 있음 object
            // console.log(item.children[0].data)      // 하나씩 찍어보면서 안으로 들어가면 된다.
            let { data } = item.children[0]
            console.log(data);

        })
    })
})

const headers = {"Content-type": "application/json"}
const USER = process.env.RPC_USER || 'ingoo'
const PASS = process.env.RPC_PASSWORD || '1234'
const RPCPORT = process.env.RPC_PORT || 3000

app.get('/newaddress/:account', (req, res) => {
    const {account} = req.params
    const body = `{"method":"getnewaddress","params":["${account}"]}`
    const options = {
        url: `http://${USER}:${PASS}@127.0.0.1:${RPCPORT}`,
        method: "POST",
        headers,
        body
    }

    const callback = (err, response, data) => {
        if (err == null && response.statusCode == 200) {
            const body = JSON.parse(data)   // 결과물이 json 형태로 오지만 string 이므로 이렇게 parse 해주고
            // res.send(body)
            // res.render('')  //html 페이지를 보여줄 수 있다는 것
        } else {
            res.send('error')
        }
    }
    request(options, callback)
})

app.listen(3800, () => {
    console.log('server open');
})