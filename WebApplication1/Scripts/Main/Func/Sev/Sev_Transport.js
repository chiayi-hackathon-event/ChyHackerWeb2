define(['Data/Data_Transport'], function (_Data) {
    var _Status = {
        LayerName: 'NetPolyLayer',
        ScoreLayer: 'ScorelLayer',
        LandmineLayer: 'LandmineLayer',
        graphics: {},
        ScoreGraphics: {},
        tempghp: undefined,
        IsLandmineMode:false
    };
    var PoiCol = [
        [220, 220, 220],
        [165, 165, 165],
        [123, 123, 123],
        [100, 100, 100],
        [80, 80, 80]
    ];
    var DistCol = [
         [0, 97, 0],
         [122, 171, 0],
         [255, 255, 0],
         [255, 153, 0],
         [255, 34, 0]
    ];
    var _AddLayer = function () {
        var _LayerOption = { ID: _Status.LayerName, AddEvent: [] };
        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
        var _ScoreLayerOption = { ID: _Status.ScoreLayer, AddEvent: [] };
        _ScoreLayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': _SetEvent_NetScorePolyLayerClick
        });
        Hackathon.Map.AddLayer('Graphic', '', _ScoreLayerOption);
    }

    var _DrawPoly = function () {
        Hackathon.Map.MapDraw(function (evt) {
            // *** CallBack Function ***
            _AddScoreNetPoly(evt.geometry.rings[0]);
        }, 3);
    }
    var _AddScoreNetPoly = function (Geometry) {
        /// <summary>
        /// 加入網格
        /// </summary>
        /// <param name="Geometry" type="type"></param>
        console.log(Geometry);
        $.when(_Data.GetNetInfo(Geometry)).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                // *** 加入網格 ***
                var _rings = data[i].coordinates;
                var _pid = 'p_' + i;
                var arrGraphicData = {
                    ID: _pid,
                    Ring: _rings,
                    Symbol: {
                        'Type': 'SimpleFillSymbol',
                        'Color': PoiCol[Number(data[i].COLOR_COUNT_POI) - 1],
                        'BorderColor': [182, 182, 182],
                        'BorderWeight': 2
                    },
                    Attribute: {
                        "COUNT_POI": data[i].COUNT_POI,
                        "NEAR_DIST": data[i].NEAR_DIST,
                    }
                };
                var _graphic = Hackathon.Map.AddPolygon(_Status.ScoreLayer, arrGraphicData);
                _Status.ScoreGraphics[_pid] = _graphic;

                // *** 加入小圓 ***

                var _Color, _BorderColor;
                if (data[i].IS_BusStop === '0') { _Color = [210, 0, 0]; }
                else { _Color = [0, 116, 253] }
                var _cid = 'c_' + i;
                var graphicData = { ID: _cid, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = data[i].X;
                graphicData.Geometry.Y = data[i].Y;
                graphicData.Attribute = {
                    "COUNT_POI": data[i].COUNT_POI,
                    "NEAR_DIST": data[i].NEAR_DIST,
                }
                graphicData.Symbol = {
                    Size: 7,
                    Color: DistCol[Number(data[i].COLOR_NEAR_DIST) - 1],
                    BorderColor: [33, 35, 33],// [67, 53, 53],
                    Type: 'SimpleMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.ScoreLayer, graphicData);
                _Status.ScoreGraphics[_cid] = _g;
            }
        })
    }
    var _AddNetPoly = function () {
        $.when(_Data.GetNetPolyData()).then(function (PolyData) {
            for (var i = 0; i < PolyData.length; i++) {
                var multiPoly = PolyData[i].XY.split(';');
                for (var j = 0; j < multiPoly.length; j++) {
                    var _rings = multiPoly[j].split(',');
                    for (var k = 0; k < _rings.length; k++) {
                        _rings[k] = _rings[k].split(' ');
                    }
                    var _id = 'data_' + j;
                    var _Color = PolyData[i].IS_BUS === '0' ? [255, 190, 190, 0.9] : [197, 220, 245, 0.9];
                    var arrGraphicData = {
                        ID: _id,
                        Ring: _rings,
                        Symbol: {
                            'Type': 'SimpleFillSymbol',
                            'Color': _Color,
                            'BorderWeight': 0
                        },
                        Attribute: {
                        }
                    };
                    var _graphic = Hackathon.Map.AddPolygon(_Status.LayerName, arrGraphicData);
                    _Status.graphics[_id] = _graphic;
                }
            }
        })
    }
    var _AddPoiPoint = function () {
        $.when(_Data.GetPoiData(), _Data.GetBusstation()).then(function (data, Busstation) {
            // *** Add Busstation Point ***
            for (let i = 0; i < Busstation.length; i++) {
                var _id = 'Busstation_' + i;
                var graphicData = { ID: _id, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = Busstation[i].X;
                graphicData.Geometry.Y = Busstation[i].Y;
                graphicData.Attribute = {
                }
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/POI/B01.svg',
                    Width: 18,
                    Height: 18,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.LayerName, graphicData);
            }
            // *** Add Poi Point ***
            for (let i = 0; i < data.length; i++) {
                var _Color, _BorderColor;
                if (data[i].IS_BusStop === '0') { _Color = [210, 0, 0]; }
                else { _Color = [0, 116, 253] }
                var _id = 'babPoint_' + i;
                var graphicData = { ID: _id, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = data[i].X;
                graphicData.Geometry.Y = data[i].Y;
                graphicData.Attribute = {
                }
                graphicData.Symbol = {
                    Size: 4,
                    Color: _Color,
                    BorderColor: [67, 53, 53],
                    Type: 'SimpleMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.LayerName, graphicData);
            }
        })
    }
    var _SetEvent_NetScorePolyLayerClick = function (evt) {
        _ChageBorderColor(evt);
        debugger
        _ShowPointInfoTemplate(evt);
    }
    var _ChageBorderColor = function (evt) {
        if (_Status.tempghp) {
            // *** 如果不是第一個點擊的 Graphic ，則將上一個Graphic 還原
            var _symbol = _Status.tempghp.Graphic.symbol;
            _symbol.outline.color.r = 182;
            _symbol.outline.color.g = 182;
            _symbol.outline.color.b = 182;
            _Status.tempghp.Graphic.setSymbol(_symbol);
        }
        var _id;
        if (evt.graphic.geometry.type === 'point') {
            // *** 利用小圓的ID對應到網格id
            _id = 'p_' + evt.graphic.id.split('_')[1];
        }
        else { _id = evt.graphic.id; }
        var _g = _Status.ScoreGraphics[_id];
        var _symbol = _g.Graphic.symbol;
        _symbol.outline.color.r = 10;
        _symbol.outline.color.g = 245;
        _symbol.outline.color.b = 245;
        _g.Graphic.setSymbol(_symbol);
        _Status.tempghp = _g;
    };
    var _ShowPointInfoTemplate = function (evt) {
        debugger
        Hackathon.Map.SetInfowindow(
          {
              title: "網格資訊",
              content: '<ul style="list-style-type:disc;">' +
                  '<li>距離現有公車站' + evt.graphic.attributes.NEAR_DIST + ' 公尺</li>' +
                  '<li>若在此處設新公車站可多服務' + evt.graphic.attributes.COUNT_POI + '個無大眾運輸景點</li></ul>'
          },
          {
              WinWidth: 300,
              WinHeight: 100,
              screenPoint: evt.screenPoint,
              placement: 'upperright'
          });
    }
    var _Clear = function () {
    }

    var _Add = function () {
        _AddLayer();
        _AddNetPoly();
        _AddPoiPoint();
    }
    return {
        Clear: _Clear,
        Add: _Add,
        DrawPoly: _DrawPoly,
        // AddNetPoly: _AddNetPoly
    }
})