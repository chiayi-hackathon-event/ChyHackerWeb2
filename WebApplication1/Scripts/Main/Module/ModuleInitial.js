var Hackathon = Hackathon || {};
Hackathon.GenNamespace = function (ns_string) {
    eval(ns_string + ".namespace = function (ns_string) { var parts = ns_string.split('.'),parent = " + ns_string + ",i;if (parts[0] === '" + ns_string + "') {parts = parts.slice(1);}for (i = 0; i < parts.length; i += 1) {if (typeof parent[parts[i]] === 'undefined') {parent[parts[i]] = {};}parent = parent[parts[i]];}return parent;};");
};
Hackathon.GenNamespace('Hackathon');
require(['Map/EsriMap', 'Common'], function (EsriMap, Common) {
    //載入map底圖&&MapFunc
    $.when(EsriMap.init('map')).then(function () {
        //Load UI.js
        require(['UI/UI_Hackathon'], function (UI_Hackathon) {
            UI_Hackathon.init();          
        });
    });
});
