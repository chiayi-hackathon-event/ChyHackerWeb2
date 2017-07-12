var Hackathon = Hackathon || {};
Hackathon.namespace = function () {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = Hackathon;
        for (j = (d[0] == "Hackathon") ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};
require(['Map/EsriMap', 'Common'], function (EsriMap, Common) {
    //載入map底圖&&MapFunc
    $.when(EsriMap.init('map')).then(function () {
        //Load UI.js
        require(['UI/UI_Main'], function (UI_Main) {
            UI_Main.init();          
        });
    });
});
