angular.module('cart', []).factory("cssLoader", function () {
    return {
        loadCss: function (url) {
            if (document.createStyleSheet) {
                document.createStyleSheet(url); //IE
            } else {
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }
    };
});
