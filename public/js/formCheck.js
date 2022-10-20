// 변수세팅
const lines = document.querySelectorAll(".checkLine");
const joinBtn = document.querySelector(".joinBtn");
let lastCheck = false;


// 정규표현식, 출력 메시지 객체로 만들기
let checkList = [
    // 이메일 확인
    {
        formCheck:/^[\w]+\@+[a-z]+\.[a-z]{2,3}$/,
        trueMessage:"이메일 주소를 올바르게 기입하였습니다.",
        falseMessage:"이메일 주소를 다시한번 확인해 주세요.",
        trueOrFalse:false
    },
    // 아이디 확인
    {
        formCheck:/^\w{6,12}$/,
        trueMessage:"아이디를 올바르게 기입하였습니다.",
        falseMessage:"아이디는 6글자에서 12글자 사이의 영문 대소문자, 숫자, 특수문자 _만 사용할 수 있습니다.",
        trueOrFalse:false
    },
    // 비밀번호 확인
    {
        formCheck:/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/,
        trueMessage:"비밀번호를 형식에 맞게 입력하셨습니다.",
        falseMessage:"비밀번호는 8자리 이상 25자리 이하의 영문 대소문자, 숫자, 특수문자 !@#$%^*+=-_ 를 조합해서 사용해야 합니다.",
        trueOrFalse:false
    }
] 

lines.forEach(function(el,index){
    el.querySelector(".checkLine input").addEventListener("keyup",function(){
        let joinValue = el.querySelector(".checkLine input").value;
        let checkTest = checkList[index].formCheck.test(joinValue);

        if (checkTest) {
            el.querySelector("span").innerHTML = checkList[index].trueMessage;
            el.querySelector("span").style.color = "green";
            checkList[index].trueOrFalse = true;
        }
        else {
            el.querySelector("span").innerHTML = checkList[index].falseMessage;
            el.querySelector("span").style.color = "red";
            checkList[index].trueOrFalse = false;
        }
    });
});

joinBtn.addEventListener("click",function(event){
    lastCheck = checkList.every(element => element.trueOrFalse == true);
    if (!lastCheck) {
        event.preventDefault();
        alert("필수체크사항을 다시한번 확인해 주세요")
    }
});