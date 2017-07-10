define(function () {
    var _Status = {};

    var _GetData = function (_fileName) {
        var dtd = $.Deferred();
        var _url = window.location.href+ _fileName+'.json';
        var _data = {};
        var _option = { async: true, dataType: "JSON", type: "GET" };
        var _callback = function (evt) {
            var xmlDoc = evt.Result;
            return dtd.resolve(xmlDoc);
        }
        Hackathon.Common.GetAjaxData(_url, _data, _callback, _option);
        return dtd.promise();
    }
    var module = {
        GetData: function (_fileName) {
            var dtd = $.Deferred();
            $.when(_GetData(_fileName)).then(function (data) { return dtd.resolve(data); })
            return dtd.promise();
        }
    };


    return module;
})