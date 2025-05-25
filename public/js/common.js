window.addEventListener("DOMContentLoaded", () => {
    let memberDetails = JSON.parse(window.localStorage.getItem("memberDetails"));
    let id = memberDetails.member_id;
    $("#userName").text(memberDetails.name);

})