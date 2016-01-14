(function () {
   $("#busquedasCollapse").on("click", function () {
        $("#CollapseContent").slideToggle();
    });
    
    enquire.register("screen and (max-width: 50em)", {
                match: function () {
                    
                    $(".iconoFooter").on("click", function () {
                        $("#bibliografia > .ui-block-a").hide();
                    });
                    $(".iconoSonido").hide();
                },
                unmatch: function () {
                    $("#bibliografia > .ui-block-a").show();
                    $(".iconoSonido").show();
                }
            });
            enquire.register("screen and (min-width: 50em)", {
                match: function () {


                },
                unmatch: function () {

                    $(".iconoSonido").hide();
                }
            });
   
})();