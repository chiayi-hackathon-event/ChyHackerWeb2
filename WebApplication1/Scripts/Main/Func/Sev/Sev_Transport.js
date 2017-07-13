define(['Data/Data_Transport'], function (_Data) {
    var _Status = {
        LayerName: 'NetPolyLayer',
        ScoreLayer: 'ScorelLayer',
        graphics: {}
    };
    var PoiCol = [
        [255, 255, 255],
        [191, 191, 191],
        [128, 128, 128],
        [64, 64, 64],
        [0, 0, 0]
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
            'EventType': 'click', 'CallBack': function (evt) {
            }
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
                debugger
                // *** 加入網格 ***
                var _rings = data[i].coordinates;
                    var _id = 'data_' + i;
                    var arrGraphicData = {
                        ID: _id,
                        Ring: _rings,
                        Symbol: {
                            'Type': 'SimpleFillSymbol',
                            'Color': PoiCol[Number(data[i].COLOR_COUNT_POI)],
                            'BorderColor': [182, 182, 182],
                            'BorderWeight': 2
                        },
                        Attribute: {
                        }
                    };
                    var _graphic = Hackathon.Map.AddPolygon(_Status.LayerName, arrGraphicData);
                    _Status.graphics[_id] = _graphic;
                
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

    var _DrawScoreCircle = function () {
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