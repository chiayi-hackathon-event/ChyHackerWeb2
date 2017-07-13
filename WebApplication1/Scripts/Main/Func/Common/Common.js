Hackathon.namespace('Hackathon.Common');
define(['proj4'], function (Proj4js) {
  //坐標系統定義檔

  Proj4js.defs([
    ["EPSG:3826", "+title=TWD97 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
    ["EPSG:3857", "+title=Google Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"],
  ]);
  var EPSG3857 = new Proj4js.Proj('EPSG:3857');
  var EPSG3826 = new Proj4js.Proj('EPSG:3826');

  //坐標轉換
  var _CoordTrans = function (x, y, EPSGFrom, EPSGTo) {
    switch (EPSGFrom) {
      case "3857":
        EPSGFrom = EPSG3857;
        break
      case "3826":
        EPSGFrom = EPSG3826;
        break
    }
    switch (EPSGTo) {
      case "3857":
        EPSGTo = EPSG3857;
        break
      case "3826":
        EPSGTo = EPSG3826;
        break
    };
    var point = new Proj4js.Point(x, y);
    return Proj4js.transform(EPSGFrom, EPSGTo, point);
  };

  //取得Ajax資料
  var _GetAjaxData = function (url, data, callback, option) {
    //_option.type 修改 傳入必須要指定
    var _ajaxOption = { async: true, type: 'POST', dataType: "json" };
    if (typeof option.async !== "undefined") { _ajaxOption.async = option.async; };
    if (typeof option.type !== "undefined") { _ajaxOption.type = option.type; };
    if (typeof option.dataType !== "undefined") { _ajaxOption.dataType = option.dataType; };

    //判斷是否為跨網域資料，若是跨網域，若自動轉換成後端抓取
    var _SameDomain = true;
    if (url.indexOf("http") !== -1) {
      if (url.indexOf(window.location.host) === -1) {
        _SameDomain = false;
      }
    }
    if (!_SameDomain) {
      var newObj = {};
      if (option.type.toUpperCase() === 'POST') {
        newObj._url = url;
        newObj._data = JSON.stringify(data);
        newObj._data = newObj._data.replace('[', '\'[').replace(']', ']\'');
        data = newObj;
      }
      else {
        var serialize = function (obj) {
          var str = [];
          for (var p in obj)
            if (obj.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
          return str.join("&");
        }
        if (url.slice(-1.1) !== "?") { url += "?"; }
        newObj._url = url + serialize(data);
        data = newObj;
      }
      url = window.location.href + "/Hackathon/GetData";
    }

    var _dtd = $.Deferred();
    var _resultObj = { Status: "", Result: {} };
    //  RiChi.GV.nowAjaxNumber += 1;
    $.ajax({
      url: url, type: _ajaxOption.type,
      data: data, async: _ajaxOption.async, dataType: _ajaxOption.dataType,
      error: function (evt) {
        _resultObj.Status = "Fail";
        _resultObj.Result = evt;
        //記錄目前發送數量(-1)
        //  RiChi.GV.nowAjaxNumber -= 1;
      },
      success: function (evt) {
        _resultObj.Status = "Success";
        _resultObj.Result = evt;
        //記錄目前發送數量(-1)
        // RiChi.GV.nowAjaxNumber -= 1;
      }
    }).then(function () {
      callback(_resultObj);
      return _dtd.resolve();
    });

    return _dtd.promise();
  };

  var _Set_UI = function (_html) {
    $('#info-panel .func-panel').empty().append(_html);
  }
  //////////////////////////////////////////////////////////////////
  var module = {
    CoordTran: function (x, y, fromCoord, ToCoord) {
      return _CoordTrans(x, y, fromCoord, ToCoord);
    },
    GetAjaxData: function (url, data, callback, option) {
      var dtd = $.Deferred();
      $.when(_GetAjaxData(url, data, callback, option)).then(function (data) { dtd.resolve(data); });
      return dtd.promise();
    },
    Set_UI: function (_html) {
      _Set_UI(_html);
    }
  }
  Hackathon.Common = module;
  return module;
})