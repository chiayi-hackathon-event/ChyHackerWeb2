define(['Data/Data_Summary'], function (_Data) {
  var _Status = {
    LayerName: 'GraphicLayer',
    POILayerName: 'POIGraphicLayer',
    graphics: {},
  };
  var _Clear = function () {
    Hackathon.Map.RemoveLayer(_Status.LayerName);
    _Status.graphics = {};
  }
  var _AddLayer = function () {
    var _LayerOption = { ID: _Status.LayerName, AddEvent: [] };

    _LayerOption.AddEvent.push({
      'EventType': 'click', 'CallBack': function (evt) {
        $('body').removeClass('menu-show panel-empty');
        $('body').addClass('panel-show');
        _ShowData(evt.graphic.id);
      }
    });
    Hackathon.Map.AddLayer('Graphic', '', _LayerOption);

    var _POILayerOption = { ID: _Status.POILayerName, AddEvent: [] };
    _POILayerOption.AddEvent.push({
      'EventType': 'click', 'CallBack': function (evt) {
        //ShowPointInfoTemplate(evt.graphic, evt.screenPoint);
      }
    });
    Hackathon.Map.AddLayer('Graphic', '', _POILayerOption);
  }
  //村里
  var _AddChyPolygon = function () {
    $.when(_Data.GetData()).then(function (res) {
      for (var j = 0; j < res.length; j++) {
        var _rings = [];
        var points = res[j].POLY.split(',');
        for (var i = 0; i < points.length; i++) {
          var point = points[i].split(' ');
          _rings.push([point[1], point[2]]);
        }
        var _id = 'data_' + j;
        var arrGraphicData = {
          ID: _id,
          Ring: _rings,
          Symbol: {
            'Type': 'SimpleFillSymbol',
            'Color': [255, 0, 0, 0],
            'BorderColor': [0, 0, 0, 0.75],
            'BorderWeight': 2
          },
          Attribute: {
            VLG_ID: res[j].VLG_ID,
            VLG_NA: res[j].VLG_NA,
          }
        };
        var _graphic = Hackathon.Map.AddPolygon(_Status.LayerName, arrGraphicData);

        var _symbol = _graphic.symbol;
        _symbol.color.r = 0;
        _symbol.color.g = 255;
        _symbol.color.b = 255;
        _symbol.color.a = 0.4;
        _graphic.setSymbol(_symbol);

        _Status.graphics[_id] = _graphic;
      }
    })
  }
  var _AddPoint = function (_townId) {
    /// <summary>
    /// 種點 - 加入民宿、旅館點位資料
    /// </summary>
    /// <param name="_townId" type="type"></param>
    var BedCount = 0; debugger
    $.when(_Data.GetPointData(_townId, 'bablist'), _Data.GetPointData(_townId, 'hotellist'), _Data.GetPassengerData(_townId, '2017', 1, 1)).
      then(function (bablist, hotellist, PassengerData) {
        debugger
        var POILayer = Hackathon.Map.GetStatus().layList[_Status.POILayerName];
        POILayer.clear();
        // ***  TODO 待整理的髒髒der Code
        // ***  民宿種點  ****
        var BabBedCount = _AddPOI('A01', bablist);
        // ***  旅館種點  ****
        var HotelBedCount = _AddPOI('A02', hotellist);
        BedCount = BabBedCount + HotelBedCount;

        debugger
      })
  }

  var _DrawChart = function () {
    $.when(_Data)
    // **** 左邊選單HightChart ****
  }
  var _ShowData = function (_id) {
    var _g = _Status.graphics[_id].Graphic;

    _DrawChart();
    _ChangeColor(_id);
  }
  var _ChangeColor = function (_id) {
    if (_Status.tempID) {
      var _graphic = _Status.graphics[_Status.tempID].Graphic;
      var _symbol = _graphic.symbol;
      _symbol.color.a = 0;
      _graphic.setSymbol(_symbol);
    }
    _Status.tempID = _id;
    var _graphic = _Status.graphics[_Status.tempID].Graphic;
    var _symbol = _graphic.symbol;
    _symbol.color.r = 0;
    _symbol.color.g = 255;
    _symbol.color.b = 255;
    _symbol.color.a = 0.4;
    _graphic.setSymbol(_symbol);
  }
  var _add = function () {
    _AddLayer();
    _AddChyPolygon();
  }
  return {
    Clear: _Clear,
    _add: _add
  }
})