define(['Data/Data_Transport'], function (_Data) {
    var _Status = {
        LayerName: 'NetPolyLayer',
        graphics: {}
    };
    var _AddLayer = function () {
        var _LayerOption = { ID: _Status.LayerName, AddEvent: [] };

        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
    }


    var _DrawPoly = function () {
        Hackathon.Map.MapDraw(function (evt) {
            // *** CallBack Function ***
            debugger
            //$.when(_Data.GetScoreNetPoly(evt.geometry.rings[0])).then(function (data) {
            console.log(evt.geometry.rings[0]);
            //})
            console.log('su!')
        },3);
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
        $.when(_Data.GetPoiData()).then(function (data) {
            debugger
            for (var i = 0; i < data.length; i++) {
                var _Color, _BorderColor;
                if (data[i].IS_BusStop === '0') {_Color = [210, 0, 0];}
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
    var _DrawScorePoly = function () {
    }
    var _DrawScoreCircle= function () {
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