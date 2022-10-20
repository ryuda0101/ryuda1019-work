const search_input = document.querySelector(".search_menu input");
const search_btn = document.querySelector(".search_btn");

search_btn.addEventListener("click",function(event){
    search_value = search_input.value;
    search_value = search_value.trim();

    if (search_value === "") {
        event.preventDefault();
        alert("검색창에는 한글자 이상의 글자가 들어가야 합니다.");
    }
});
