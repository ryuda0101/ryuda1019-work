// npm init
// npm install ejs express mongodb moment
// npm install express-session passport passport-local

// 설치한것을 불러들여 그 안의 함수 명령어들을 쓰기위해 변수로 세팅
const express = require("express");
// 데이터베이스의 데이터 입력, 출력을 위한 함수명령어 불러들이는 작업
const MongoClient = require("mongodb").MongoClient;
// 시간 관련된 데이터 받아오기위한 moment라이브러리 사용(함수)
const moment = require("moment");
// 로그인 관련 데이터 받아오기위한 작업
// 로그인 검증을 위해 passport 라이브러리 불러들임
const passport = require('passport');
// Strategy(전략) → 로그인 검증을 하기 위한 방법을 쓰기 위해 함수를 불러들이는 작업
const LocalStrategy = require('passport-local').Strategy;
// 사용자의 로그인 데이터 관리를 위한 세션 생성에 관련된 함수 명령어 사용
const session = require('express-session');

const app = express();

// 포트번호 변수로 세팅
const port = process.env.PORT || 8000;
// const port = 8080;


// ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
// 사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
// css나 img, js와 같은 정적인 파일 사용하려면 ↓ 하단의 코드를 작성해야한다.
app.use(express.static('public'));


// 로그인 관련 작언을 하기 위한 세팅
// 로그인 관련 작업시 세션을 생성하고 데이터를 기록할 때 세션 이름의 접두사 / 세션 변경시 자동저장 유무 설정
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
// passport라이브러리 실행
app.use(passport.initialize());
// 로그인 검증시 세션데이터를 이용해서 검증하겠다.
app.use(passport.session());


// Mongodb 데이터 베이스 연결작업
// 데이터베이스 연결을 위한 변수 세팅 (변수의 이름은 자유롭게 지어도 ok)
let db;
// Mongodb에서 데이터베이스를 만들고 데이터베이스 클릭 → connect → Connect your application → 주소 복사, password에는 데이터베이스 만들때 썼었던 비밀번호를 입력해 준다.
MongoClient.connect("mongodb+srv://admin:qwer1234@testdb.g2xxxrk.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    // 에러가 발생했을 경우 메세지 출력 (선택사항임. 안쓴다고 해서 문제가 되지는 않는다.)
    if(err){ return console.log(err);}

    // 위에서 만든 db변수에 최종적으로 연결 / ()안에는 mongodb atlas에서 생성한 데이터 베이스 이름 집어넣기
    db = result.db("testdb");

    // db연결이 제대로 되었다면 서버 실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});

// 메인페이지 get 경로로 요청하기
app.get("/",function(req,res){
    res.render("index");
});

// 게시판 목록 페이지 get 경로로 요청하기
app.get("/brdlist",function(req,res){
    res.render("brd_list");
});

// 게시글 상세 페이지 get 경로로 요청하기
app.get("/brddetail",function(req,res){
    res.render("brd_detail");
});

// 게시글 작성 페이지 get 경로로 요청하기
app.get("/brdinsert",function(req,res){
    res.render("brd_insert");
});

// html과 같은 정적인 파일 보낼때는 app.get.sendFile(__dirname + "/불러들일 html파일 경로")
// ejs와 같은 동적인 파일 보낼때는 app.get.render("불러들일 ejs파일")
// 특정 주소로 이동해달라고 요청할때는 res.redirect("/이동할 경로")


// get요청으로 join.ejs 화면 응답받기
// ex.
// app.get("/호스트8080 뒤에 붙을 주소 이름",function(req,res){
//     res.render("응답받을 ejs파일 이름");
// });

// post요청으로 join.ejs에서 입력한 value값 콜렉션에 넣어주기
// ex.
// app.post("/폼태그에서 입력한 action의 경로",function(req,res){
//     // 입력한 데이터값 요청받은거는 form 태그에서 name 속성값 이름지정필수
//     // 데이터베이스에 값 저장하는 방법 db.collection("altas 사이트에서 본인이 생성한 콜렉션 이름 집어넣기").insertOne()
//     db.collection("데이터베이스의 컬렉션 이름").insertOne({
//         // ↓ 여러개의 객체로 데이터를 보내준다.
//         // ex. 프로퍼티명: 추가할 데이터값
//         userId:req.body.userId,      ←   컬렉션에 넣을때 넣어줄 이름:req.body.input에서 입력한 name값
//         userpass:req.body.pass,
//         userPassCheck:req.body.passCh
//         // ↓ 전달받은 데이터를 받아서 실행할 코드. / ↓ 여기에 페이지 이동하는 기능이 들어간다.
//     },function(err,result){
//         // 에러가 발생했을 경우 메세지 출력 (선택사항임. 안쓴다고 해서 문제가 되지는 않는다.)
//         if (err) {return console.log(err);}
//         res.send("가입이 완료되었습니다.");      ←   결과 화면에 출력될것
//     });
//     데이터 값을 가져와서 화면에 보여주고자 할 때
//     db.collection("joinTest").find().toArray(function(err,result){
//         res.render("welcome.ejs",{useritem:result});
//     })
// });


// 게시판 만들고 게시글 번호 부여하기
// 1. 데이터베이스에서 컬렉션을 2개 만든다.
//      하나는 데이터를 담을 컬렉션 / 하나는 데이터의 갯수를 담아줄 컬렉션
// 2. ejs를 3개 만들어준다.
//      하나는 데이터를 작성할 페이지 / 하나는 데이터를 수정할 페이지 / 하나는 데이터를 보여줄 페이지
// 3. db에서 데이터의 갯수를 담아줄 컬렉션에 insert document로 ObjectId를 string에서 Int32 또는 Int64로 바꿔주고 totalCount값을 만들고 그 안에 0을 담아준다. 또한 name으로 개시물갯수라는 객체를 추가로 만들어준다. 
// 4. db 컬렉션에서 findOne으로 갯수를 담아줄 컬렉션을 찾아서 가져온다.
// 5. app.post작업으로 데이터를 작성할 페이지.ejs에서 입력한 값을 객체형식으로 db의 컬렉션에 받아준다.
// 6. 데이터를 보여줄 페이지.ejs에서 db의 컬렉션에 담긴 값을 가져와서 화면에 보여준다.


// 데이터 수정하기
// 1. 기존의컬렉션의 데이터값을 가져와서 데이터를 수정할 페이지.ejs에 넣어준다.  
// 2. 데이터를 수정할 페이지.ejs에서 가져온 기존의 값을 컬렉션에.update({변경될 값의 페이지 넘버 찾기},{$set:{변경될 값}},function(req,res){})해서 수정해준다.
// 3. 수정해준 값이 화면에 보여지는지 확인한다.
// ex. 
// app.post("/update",function(req,res){
//     // 해당 게시글 번호에 맞는 게시글 수정 처리
//     db.collection("ex10_board").updateOne({brdid:Number(req.body.no)},{$set:{
//         brdtitle:req.body.title,
//         brdcontext:req.body.context
//     }},function(req,res){
//     // 해당 게시글 상세 화면 페이지로 이동
//     res.redirect("/detail/" + req.body.no);
//     });
// });


// // 로그인 기능 수행 작업
// // 로그인 화면으로 요청
// app.get("/login",function(req,res){
//     res.render("login");
// });

// // 로그인 페이지에서 입력한 아이디, 비밀번호 검증처리 요청
// // app.post("/경로",여기 사이에 ↓ 입력,function(req,res){});
// // passport.authenticate('local', {failureRedirect : '/fail'})
// app.post("/loginresult",passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
//     //                                                   ↑ 실패시 위의 경로로 요청
//     // ↓ 로그인 성공시 메인페이지로 이동
//     res.redirect("/")
// });

// /loginresult 경로 요청시 passport.autenticate() 함수 구간이 아이디, 비밀번호 로그인 검증 구간
// passport.use(new LocalStrategy({
//     usernameField: 'id',    // login.ejs에서 입력한 아이디의 name값
//     passwordField: 'pw',    // login.ejs에서 입력한 비밀번호의 name값
//     session: true,      // 세션을 이용할것인지에 대한 여부
//     passReqToCallback: false,   // 아이디와 비밀번호 말고도 다른 항목들을 더 검사할것인가에 대한 여부
//   }, function (입력한아이디작명, 입력한비번작명, done) {
//     //console.log(입력한아이디, 입력한비번);
//     db.collection('아이디, 비밀번호가 들어있는 컬렉션 이름').findOne({ 컬렉션에서 아이디가 들어있는 데이터 이름: 위에서작명한입력한아이디 }, function (에러, 결과) {
//       if (에러) return done(에러)
// // 아래의 message는 필요에 따라 뻴수도 있다. 
//       if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
//       if (위에서작명한입력한비번 == 결과.컬렉션에서 비밀번호가 들어있는 데이터 이름) {
//         return done(null, 결과)
//       } else {
//         return done(null, false, { message: '비번틀렸어요' })
//       }
//     })
// }));

// // 최초의 로그인시 한번 실행
// // serializeUser    →   처음 로그인 했을 시 해당 사용자의 아이디를 기반으로 세션을 생성함
// // ↓ 여기서 생성된 매게변수 user로 req.user~~를 쓸 수 있다.
// passport.serializeUser(function (user, done) {
//      // ↓ 서버에는 세션을 만들고 / 사용자 웹 브라우저에는 쿠키를 만들어준다. 
//     done(null, user.컬렉션에서 아이디가 들어있는 데이터 이름)
// });

// // 로그인 할 때마다 실행
// // deserializeUser  →   로그인을 한 후 다른 페이지들을 접근할 시 생성된 세션에 담겨있는 회원정보 데이터를 보내주는 처리
// passport.deserializeUser(function (입력한아이디작명, done) {
//     db.collection("ex9_join").findOne({컬렉션에서 아이디가 들어있는 데이터 이름:위에서 입력한아이디작명},function(err,result){
//         done(null,result)
//     });
// });

// // 로그아웃 기능 작업
// app.get("/logout",function(req,res){
//     // 서버의 세션을 삭제하고, 본인 웹브라우저의 쿠키를 삭제한다.
//     req.session.destroy(function(err,result){
//         // 지워줄 쿠키를 선택한다. / 콘솔 로그의 application → cookies에 가면 name에서 확인할 수 있다.
//         res.clearCookie("어떤 쿠키를 지워줄 것인가 선택")
//         // 로그아웃 후 다시 메인페이지로 돌아가기
//         res.redirect("/");
//     });
// });

// 로그인 했는지 않했는지 확인하는 작업
// app.get("/list",function(req,res){
// /list 경로를 입력하면 ↓ 아래의 ejs가 출력되고, 동시에 userData에 로그인 정보를 담아서 보내준다.
// passport.serializeUser(function (user, done){}에서 써준 코드인 user를 써서 그 안에 담긴 데이터를 가져온다.
// 즉, req.user는 로그인 했을 때 담긴 아이디, 비밀번호, 메일주소, 전화번호의 데이터를 말한다.
//     res.render("brd_list",{userData:req.user});
// })
