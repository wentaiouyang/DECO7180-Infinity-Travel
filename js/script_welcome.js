$(document).ready(function () {
    $(".arrow").on("click", function () {
        const target = $("#about");
        if (!target.length) {
            return false;
        }

        $("html, body").animate(
            { scrollTop: target.offset().top - 24 },
            900
        );
        return false;
    });
});
