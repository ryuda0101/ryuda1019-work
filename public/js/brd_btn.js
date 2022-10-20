// 변수세팅
const qnaBtn = document.querySelector("#brd_list_container .qnaBtn");
const qna = document.querySelector("#brd_list_container .qna")
const notice = document.querySelector("#brd_list_container .notice")

qnaBtn.addEventListener("mouseenter",function(){
    qna.style.opacity = "1"
    notice.style.opacity = "0"
});

qnaBtn.addEventListener("mouseleave",function(){
    qna.style.opacity = "0"
    notice.style.opacity = "1"
});