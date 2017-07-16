define(function () {
    var _Status = {};

    var _GetPoiData = function (_x, _y) {
        var dtd = $.Deferred();
        var _url = window.location.origin + '/ChyHackerAPI/api/Qry_UseXY';
        var _data = {
            type: 1,
            x: _x,
            y: _y,
            Buffer:500
        };
        var _option = { async: true, dataType: "JSON", type: "GET" };
        var _callback = function (evt) {
            var xmlDoc = evt.Result;
            return dtd.resolve(xmlDoc);
        }
        Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
        return dtd.promise();
    }
    var _GetFactoryData = function (_x, _y) {
        var dtd = $.Deferred();
        var _url = window.location.origin + '/ChyHackerAPI/api/Qry_UseXY';
        var _data = {
            type: 2,
            x: _x,
            y: _y,
            Buffer: 500
        };
        var _option = { async: true, dataType: "JSON", type: "GET" };
        var _callback = function (evt) {
            var xmlDoc = evt.Result;
            return dtd.resolve(xmlDoc);
        }
        Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
        return dtd.promise();
    }
    var _GetData = function (_type) {
        var dtd = $.Deferred();
        var _url = window.location.origin + '/ChyHackerAPI/api/Qry_UseXY';
        var _data = {
            type: _type,
        };
        var _option = { async: true, dataType: "JSON", type: "GET" };
        var _callback = function (evt) {
            var xmlDoc = evt.Result;
            return dtd.resolve(xmlDoc);
        }
        Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
        return dtd.promise();
    }
    var _GetBUSMData = function (_x, _y) {
        var dtd = $.Deferred();
        var _url = window.location.origin + '/ChyHackerAPI/api/Qry_UseXY';
        var _data = {
            type: 6,
            x: _x,
            y: _y,
            Buffer: 500
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
        GetPoiData: function (_x,_y) {
            var dtd = $.Deferred();
            $.when(_GetPoiData(_x, _y)).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        },
        GetFactoryData: function (_x, _y) {
            var dtd = $.Deferred();
            $.when(_GetFactoryData(_x, _y)).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        },
        GetTaiwanAskData: function () {
            var dtd = $.Deferred();
            $.when(_GetData(3)).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        },
        GetTaiwanIsGoodData: function () {
            var dtd = $.Deferred();
            $.when(_GetData(4)).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        },
        GetBUSMData: function (_x, _y) {
            var dtd = $.Deferred();
            $.when(_GetBUSMData(_x, _y)).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        },
        GetAllPoiData: function () {
            var dtd = $.Deferred();
            $.when(_GetData(5)).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        },
    };
    return module;
})