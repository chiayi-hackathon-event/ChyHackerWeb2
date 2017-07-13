define(function () {
    var _Status = {};

    var _GetNetPolyData = function () {
        var dtd = $.Deferred();
        var _href = window.location.href;
        var _url = _href.substr(_href.length - 1, 1) === '/' ? _href : _href + '/';
        _url += 'NetInfo.json';
        var _data = {};
        var _option = { async: true, dataType: "JSON", type: "GET" };
        var _callback = function (evt) {
            var xmlDoc = evt.Result;
            return dtd.resolve(xmlDoc);
        }
        Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
        return dtd.promise();
    }
    var _GetPoiData = function () {
        var dtd = $.Deferred();
        var _url = window.location.origin + '/ChyHackerAPI/api/CounTownCode';
        var _data = {
            type: 'poi',
        };
        var _option = { async: true, dataType: "JSON", type: "GET" };
        var _callback = function (evt) {
            var xmlDoc = evt.Result;
            return dtd.resolve(xmlDoc);
        }
        Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
        return dtd.promise();
    }
    var module = {
        GetNetPolyData: function () {
            var dtd = $.Deferred();
            $.when(_GetNetPolyData()).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        },
        GetPoiData: function () {
            var dtd = $.Deferred();
            $.when(_GetPoiData()).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        }
    };
    return module;
})