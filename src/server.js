const express = require("express");
// require은 외부로부터 모듈을 가져올 때 사용됨.
// 상수 express라는 변수생성, express변수를 사용하기 위해 node_modules 폴더의 express파일을 요청함
// "express"에 따로 경로값이 지정되어있지 않을 경우, default값은 node_modules 폴더 안의 값임.
const { default: mongoose } = require("mongoose");
// npm i mongoose로 mongoose 설치해준 후, 해당 js파일에서 mongoose라고 입력 후 엔터치면
// 알아서 mongoose require라는 해당 구문을 저장해준다. 해당구문 저장 후
// => 아래 let result~에서 이어서 설명
const { User } = require("./model/User.js");
// distructure? 구조분해할당..?
// {} :: 변수에 require~부분의 값중 User만 뽑아 쓰겠다는 의미!!!
// 중괄호 {}의의미는 여러가지 요소 중 {}안의 값을 골라 사용하겠다는 뜻이기도 함.

const app = express();
// app변수 선언, app변수는 express()함수의 데이터를 저장한다.
const users = [];
// 배열 형식의 저장공간을 임의로 만들어줄거고, request(요청)해서 받아온 response(응답)데이터를 저장할 예정.
app.use(express.json());
// =>미들웨어???★ json방식으로 깨지지않게 요청하도록 해주는 코드
// get방식에선 우리가 req 요청할 필요 없이 읽어오기만 하면 되니까 해당문구가 없어도 실행이 되지만,
// post방식에선 우리가 req에 요청을 담아 보내고, res로 응답을 받아오는 두가지 과정이 전부 필요한데
// 해당 코드가 없으면 요청과정에서 json형식이 깨짐??? 이게 있어야 post방식에서 오류가 발생하지 않음

const MONGO_URL =
  "mongodb+srv://KED:PuyMOCzmuNE3k0Bu@mongodb.7taafsz.mongodb.net/book?retryWrites=true&w=majority&appName=Mongodb";

// let result = mongoose.connect(MONGO_URL);
// mongoose와 관련된 해당 변수 지정 및 선언, 저장 후 콘솔창 출력 확인을 위해 npm run dev로 확인해보면
// console.log(result);
// result값을 콘솔에 출력할 때 Promise{<pending>}이라는 메시지가 출력되는걸 확인할 수 있다.

// mongoose.connect(MONGO_URL).then(function (result) {
//   return console.log(result);
// });

// function fn(){}
// const fn = function(){}
// fn()

const server = async function () {
  try {
    await mongoose.connect(MONGO_URL); // promise
    console.log("db연결완~");

    // app.get("/", function (req, res) {});
    // => app.get은 포스트맨에서 GET(read)에서 localhost뒤에 /가붙으면 res 응답을줌.
    app.get("/user", async function (req, res) {
      // =>활용예시, "/"대신 "/user"라고 사용할 경우, localhost:3000/user라고 경로를 지정해줘야하면 응담을 받을 수 있다.
      // app.get에서 app.이 의미하는 것은, 위의 변수 선언에서 사용된 app을 이용하는 것이므로
      // express().get()과 동일하다.
      // get에서는 자료 전송하는 것 없이(=req없이) 경로값만 입력하면 자료를 전달받아오기만하면된다(=res)
      // 1
      // return res.send({ user: users });
      // res(응답)값을 body에 넣어 send해준다 (user: 위에 선언해준 users인 []라는 메시지가 출력 될 예정)

      try {
        const users = await User.find({});
        // mongoose에서 사용_ Schema파일 User.js에서 작성한 데이터에서 값을가져온다는 의미
        return res.send({ users });
      } catch (error) {
        return res.status(500).send({ error: error.message });
      }
    });

    //  => app.post는 포스트맨에서 POST(create)에서 localhost뒤에 /user가 붙으면 res응답을 줌.
    app.post("/user", async function (req, res) {
      // POST에선 BODY에 데이터를 담아서 전송해주면(=req),
      // 01
      // users.push({
      // name: req.body.name,
      // 응답받을데이터(포스트맨에서 post-body탭에 작성된 데이터)_body에 들어있는 name이라는 데이터를 받아올 예정
      // age: req.body.age,
      // 응답받을데이터(포스트맨에서 post-body탭에 작성된 데이터)_body에 들어있는 age이라는 데이터를 받아올 예정
      // });
      // 위에 선언해줬던 배열형식 저장공간 users =[]에 자료값을 push해준다는 의미.
      // users.push({name:"홍길동", age:30})
      // return res.send({ success: true });
      // res(응답)값을 body에 넣어서 send해줄건데, "success" : true라는 메시지가 출력되도록 해줌.

      // 02
      // let username = req.body.username
      // let name = req.body.name

      try {
        let { username, name } = req.body;
        // 요청, 응답받은 body안의 데이터값 중 {}중괄호 안의 값 username, name이라는 값을 추출해 이용할 예정
        // => let name = req.body.name
        // => let username = req.body.username 총 2줄을 합쳐 1줄로 요약한 표현이다.

        if (!username) {
          return res
            .status(400)
            .send({ error: "username을 다시 확인해주세요." });
          // 보통 프론트단에서 오류 원인 발생시 오류코드 400대를 출력한다.
        }
        if (!name || !name.first || !name.last) {
          // name.fist는 let{username, name}=req.body줄에서 나온 name임.
          return res
            .status(400)
            .send({ error: "name :: 성 또는 이름을 확인해주세요." });
        }

        const user = new User(req.body);
        // new 생성자를이용해 새로운 변수 user를 생성.
        // User.js에서 받아올건데, 포스트맨의 body에서 받아온 데이터임
        await user.save();
        // 인스턴스화...?:/
        // 몽구스에서 데이터를 세이브해서.
        res.send({ user });
        // await user.save()에서 저장한값을 res값(function(req, res)값 중 res임.)에서 send해줌. 가져온 데이터를 뿌려주기 위함?
      } catch (error) {
        return res.status(500).send({ error: error.message });
        // 보통 서버, 백엔드단에서 오류 원인 발생시 오류코드 500대를 출력한다
      }
    });
  } catch (error) {
    console.log("망햇쥬ㅠㅠ");
  }
};
app.listen(3000);
// => localhost:3000 포트로 응답 받겠다는 뜻.
// app.use().get().post().delete().listen()
// => $('선택자').css().attr().click().addClass()
//      =>jQuery형식의 실행문
server();
