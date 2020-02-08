$(document).ready(function () {

    $(".arrow").click(function () {
        $('html, body').animate({scrollTop:$(document).height()},1500);
        return false;
    });
});



