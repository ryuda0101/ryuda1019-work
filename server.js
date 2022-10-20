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
    res.render("index",{userData:req.user});
});

// 게시글 작성 페이지 get 방식으로 요청하기
app.get("/brdinsert",function(req,res){
    res.render("brd_insert",{userData:req.user});
});

// 작성한 게시글 db에 업로드하기
app.post("/insert",function(req,res){
    db.collection("ex10_count").findOne({name:"게시판"},function(err,result){
        db.collection("ex10_board").insertOne({
            brdid:result.totalBoard + 1,
            brdtitle:req.body.brdtitle,
            brdcontext:req.body.brdcontext,
            brdauther:req.user.joinnick,
            brddate:moment().format("YYYY-MM-DD HH:mm") 
        },function(err,result){
            db.collection("ex10_count").updateOne({name:"게시판"},{$inc:{totalBoard:1}},function(err,result){
                res.redirect("/brdlist")
            })
        });
    });
});

// 게시판 목록 페이지 get 방식으로 요청하기
app.get("/brdlist",function(req,res){
    db.collection("ex10_board").find().toArray(function(err,result){
        res.render("brd_list",{userData:req.user, brdinfo:result});
    });
});

// 게시글 상세 페이지 get 방식으로 요청하기
app.get("/brddetail/:no",function(req,res){
    db.collection("ex10_board").findOne({brdid:Number(req.params.no)},function(err,result){
        res.render("brd_detail",{userData:req.user, brdinfo:result});
    });
});

// 게시글 수정 페이지 get 방식으로 요청
app.get("/brdedit/:no",function(req,res){
    db.collection("ex10_board").findOne({brdid:Number(req.params.no)},function(err,result){
        res.render("brd_edit.ejs", {userData:req.user, brdinfo:result})
    });
});


// 게시글 수정 페이지에서 글 수정후 db에 새로 업데이트
app.post("/update",function(req,res){
    db.collection("ex10_board").updateOne({brdid:Number(req.body.id)},{$set:{
        brdtitle:req.body.brdtitle,
        brdcontext:req.body.brdcontext
    }},function(err,result){
        res.redirect("/brddetail/" + Number(req.body.id));
    });
});

// 게시글 삭제 처리 get 방식으로 요청
app.get ("/delete/:no",function(req,res){
    db.collection("ex10_board").deleteOne({brdid:Number(req.params.no)},function(err,result){
        res.redirect("/brdlist")
    })
});

// 검색기능 추가하기
app.get("/search",function(req,res){
    let search = [
                    {
                        '$search': {
                            'index': 'ex10_board',
                            'text': {
                                query: req.query.searchInput,
                                path: req.query.search_menu
                            }
                        }
                    },{
                        $sort:{brdid:-1}
                    }
                ]
    db.collection("ex10_board").aggregate(search).toArray(function(err,result){
        res.render("brd_list",{brdinfo:result,userData:req.user});
    });
});




// 회원가입 페이지 get 방식으로 요청하기
app.get("/join",function(req,res){
    res.render("join");
});

// 회원가입 페이지 post로 db에 데이터 올리기
app.post("/userJoin",function(req,res){
    db.collection("ex10_join").findOne({joinid:req.body.joinid},function(err,result){
        if (result){
            res.send("<script> alert('이미 가입된 아이디 입니다.'); location.href = '/login' </script>")
        }
        else {
            db.collection("ex10_count").findOne({name:"회원정보"},function(err,result){
                db.collection("ex10_join").insertOne({
                    joinno:result.joinCount + 1,
                    joinid:req.body.joinid,
                    joinpass:req.body.joinpass,
                    joinnick:req.body.joinname,
                    joinemail:req.body.joinemail
                },function(err,result){
                    db.collection("ex10_count").updateOne({name:"회원정보"},{$inc:{joinCount:1}},function(err,result){
                        res.send("<script> alert('회원가입을 축하드립니다.'); location.href = '/' </script>")
                    });
                });
            });
        }
    });
});

// 로그인 페이지 get 방식으로 요청하기
app.get("/login",function(req,res){
    res.render("login");
});

// 로그인시 입력한 아이디, 비밀번호 검증 처리
app.post("/loginresult",passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
    //                                                   ↑ 실패시 위의 경로로 요청
    // ↓ 로그인 성공시 메인페이지로 이동
    res.redirect("/")
});

// /loginresult 경로 요청시 passport.autenticate() 함수 구간이 아이디, 비밀번호 로그인 검증 구간
passport.use(new LocalStrategy({
    usernameField: 'userid',    // login.ejs에서 입력한 아이디의 name값
    passwordField: 'userpass',    // login.ejs에서 입력한 비밀번호의 name값
    session: true,      // 세션을 이용할것인지에 대한 여부
    passReqToCallback: false,   // 아이디와 비밀번호 말고도 다른 항목들을 더 검사할것인가에 대한 여부
  }, function (userid, userpass, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('ex10_join').findOne({joinid:userid }, function(err,result) {
      if (err) return done(err)
// 아래의 message는 필요에 따라 뻴수도 있다. 
      if (!result) return done(null, false, { message: '존재하지않는 아이디 입니다.' })
      if (userpass == result.joinpass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호를 다시한번 확인해 주세요.' })
      }
    })
}));

// 최초의 로그인시 한번 실행
// ↓ 여기서 생성된 매게변수 user로 req.user~~를 쓸 수 있다.
passport.serializeUser(function (user, done) {
     // ↓ 서버에는 세션을 만들고 / 사용자 웹 브라우저에는 쿠키를 만들어준다. 
    done(null, user.joinid)
});

// 로그인 할 때마다 실행
passport.deserializeUser(function (userid, done) {
    db.collection("ex10_join").findOne({joinid:userid }, function(err,result){
        done(null,result)
    });
});

// 로그아웃 기능 작업
app.get("/logout",function(req,res){
    // 서버의 세션을 삭제하고, 본인 웹브라우저의 쿠키를 삭제한다.
    req.session.destroy(function(err,result){
        // 지워줄 쿠키를 선택한다. / 콘솔 로그의 application → cookies에 가면 name에서 확인할 수 있다.
        res.clearCookie("connect.sid")
        // 로그아웃 후 다시 메인페이지로 돌아가기
        res.redirect("/");
    });
});
