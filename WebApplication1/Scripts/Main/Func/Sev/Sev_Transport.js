define(['Data/Data_Transport'], function (_Data) {
    var _Status = {
        LayerName: 'NetPolyLayer',
        ScoreLayer: 'ScorelLayer',
        LandmineLayer: 'LandmineLayer',
        BusLandmineLayer: 'BusLandmineLayer',
        graphics: [],
        ScoreGraphics: {},
        tempghp: undefined,
        IsLandmineMode: false,
        NoServiceList: [],
        PoiCount: 0  // 景點數: 服務 + 未服務
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
        // *** Layer1 ***
        var _LayerOption = { ID: _Status.LayerName, AddEvent: [] };
        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
        // *** Layer2 ***
        _LayerOption = { ID: _Status.ScoreLayer, AddEvent: [] };
        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': _SetEvent_NetScorePolyLayerClick
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
        // *** Layer3 ***
        _LayerOption = { ID: _Status.LandmineLayer, AddEvent: [] };
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
        // *** Layer4 ***
        _LayerOption = { ID: _Status.BusLandmineLayer, AddEvent: [] };
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
    }
    var _DrawPoly = function () {
        Hackathon.Map.MapDraw(function (evt) {
            // *** CallBack Function ***
            _Reset();
            _AddScoreNetPoly(evt.geometry.rings[0]);
        }, 3);
    }
    var _AddScoreNetPoly = function (Geometry) {
        /// <summary>
        /// 加入網格
        /// </summary>
        /// <param name="Geometry" type="type"></param>
        $.when(_Data.GetNetInfo(Geometry)).then(function (data) {
            _Status.ScoreGraphics = {};
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
            $('#Fun_Legend').draggable({ opacity: 0.75 }).show();

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
                    //  _Status.graphics[_id] = _graphic;
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
                var _id = 'Point_' + i;
                var graphicData = { ID: _id, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = data[i].X;
                graphicData.Geometry.Y = data[i].Y;
                graphicData.Attribute = {
                    'hasServicenoService': false,
                    'Description': data[i].Description,
                    'Name': data[i].Name,
                }
                graphicData.Symbol = {
                    Size: 4,
                    Color: _Color,
                    BorderColor: [67, 53, 53],
                    Type: 'SimpleMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.LayerName, graphicData);
                if (data[i].IS_BusStop === '0') {
                    _Status.graphics.push(_g);
                    _Status.NoServiceList = _Status.graphics.slice();
                }
            }
            $('body').removeClass('menu-show panel-empty');
            $('body').addClass('panel-show');
            _Status.PoiCount = data.length;
            _DrawDataTable(_Status.graphics);
            _DigitalAnimation(_Status.NoServiceList.length);
        })
    }
    var _DrawDataTable = function (_PoiList) {
        var _html;
        for (var i = 0; i < _PoiList.length; i++) {
            _html += '<tr><th>' + (i+1) + '.</th><td>' + _PoiList[i].Graphic.attributes.Name + '</td><td>' + _PoiList[i].Graphic.attributes.Description + '</td></tr>';
        }
        if (_Status.DataTable) {
            _Status.DataTable.destroy();
        }
        $('.tbl-no-service-poi tbody').empty().append(_html);
        $('#tb tbody').append(_html);
        _Status.DataTable = $('.tbl-no-service-poi').DataTable({
            "paging": true,
            "bLengthChange": false,
            "iDisplayLength": 10,
            "pagingType": "simple_numbers",
            "ordering": false,
            "info": false,
            "searching": false,
            "oLanguage": {
                "oPaginate": {
                    "sFirst": "首頁",
                    "sPrevious": "上頁",
                    "sNext": "下頁",
                    "sLast": "末頁"
                }
            }
        });
    }
    var _SetEvent_NetScorePolyLayerClick = function (evt) {
        _AddLandmine(evt);
        _ChageBorderColor(evt);
        _ShowPointInfoTemplate(evt);
    }
    var _AddLandmine = function (evt) {
        // *** 踩地雷功能 ***
        // 邏輯非1即2
        // 邏輯1 : 傳入的如果是Point => 直接找9宮格 => 找9宮格對應的網格
        // 邏輯2 : 傳入的如果是Polygon =>先找對應的中心點 => 找9宮格 => 找9宮格對應的網格
        if (!_Status.IsLandmineMode) {
            return;
        }
        Hackathon.Map.GetStatus().map.infoWindow.hide();
        var _arr = [], cx, cy;
        // *** 邏輯1 ***
        if (evt.graphic.geometry.type === 'point') {
            cx = evt.graphic.geometry.x;
            cy = evt.graphic.geometry.y;
        }
        else {
            var _id = evt.graphic.id;
            var _g = _Status.ScoreGraphics['c_' + _id.split('_')[1]];
            cx = _g.Graphic.geometry.x;
            cy = _g.Graphic.geometry.y;
        }
        Object.keys(_Status.ScoreGraphics).forEach(function (item, index, array) {
            var x = _Status.ScoreGraphics[item].Graphic.geometry.x;
            var y = _Status.ScoreGraphics[item].Graphic.geometry.y;
            // 條件為 兩點距離為500內的才列入， (X2-X1)次方 + (Y2-Y1)次方 =>在開根號
            if (item.split('_')[0] == 'c' && (Math.sqrt(Math.pow((cx - x), 2) + Math.pow((cy - y), 2))) < 500) {
                _arr.push('p_' + item.split('_')[1]);
            }
        })
        for (let i = 0; i < _arr.length; i++) {
            var _g = _Status.ScoreGraphics[_arr[i]];
            var _rings = _g.Graphic.geometry.rings[0];
            var _id = 'data_' + i;
            var arrGraphicData = {
                ID: _id,
                Ring: _rings,
                Symbol: {
                    'Type': 'SimpleFillSymbol',
                    'Color': [197, 220, 245, 0.75],
                    'BorderColor': [197, 220, 245],
                    'BorderWeight': 1
                },
                Attribute: {
                }
            };
            var _graphic = Hackathon.Map.AddPolygon(_Status.LandmineLayer, arrGraphicData);
        }

        var graphicData = { ID: _id, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
        graphicData.Geometry.X = cx;
        graphicData.Geometry.Y = cy;
        graphicData.Attribute = {
        }
        graphicData.Symbol = {
            Url: window.location.href + '/Content/img/POI/B01.svg',
            Width: 18,
            Height: 18,
            yoffset: 5,
            Type: 'PictureMarkerSymbol'
        };
        var _g = Hackathon.Map.AddPoint(_Status.BusLandmineLayer, graphicData);
        for (let i = 0; i < _Status.NoServiceList.length; i++) {
            var x = _Status.NoServiceList[i].Graphic.geometry.x;
            var y = _Status.NoServiceList[i].Graphic.geometry.y;

            if ((Math.sqrt(Math.pow((cx - x), 2) + Math.pow((cy - y), 2))) < 500) {
                _Status.NoServiceList.splice(i, 1);
            }
        }
        _DrawDataTable(_Status.NoServiceList);
        // *** 介面事件 ****
        _DigitalAnimation(_Status.NoServiceList.length);

    }
    var _DigitalAnimation = function (NoServiceCount) {
        var _hasServiceCount = _Status.PoiCount - NoServiceCount;
        $('h1[name="hasService"]').attr('data-count', _hasServiceCount);
        $('h1[name="hasServicenoService"]').attr('data-count', NoServiceCount);
        $('.counter').each(function () {
            var $this = $(this),
              countTo = $this.attr('data-count');
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            },
              {
                  duration: 300,
                  easing: 'linear',
                  step: function () {
                      $this.text(Math.floor(this.countNum));
                  },
                  complete: function () {
                      $this.text(this.countNum);
                  }
              });
        });
    }
    var _ChageBorderColor = function (evt) {
        //if (_Status.tempghp) {
        //    // *** 如果不是第一個點擊的 Graphic ，則將上一個Graphic 還原
        //    var _symbol = _Status.tempghp.Graphic.symbol;
        //    _symbol.outline.color.r = 182;
        //    _symbol.outline.color.g = 182;
        //    _symbol.outline.color.b = 182;
        //    _Status.tempghp.Graphic.setSymbol(_symbol);
        //}
        //var _id;
        //if (evt.graphic.geometry.type === 'point') {
        //    // *** 利用小圓的ID對應到網格id
        //    _id = 'p_' + evt.graphic.id.split('_')[1];
        //}
        //else { _id = evt.graphic.id; }

        //var _g = _Status.ScoreGraphics[_id];
        //var _symbol = _g.Graphic.symbol;
        //_symbol.outline.color.r = 10;
        //_symbol.outline.color.g = 245;
        //_symbol.outline.color.b = 245;
        //_g.Graphic.setSymbol(_symbol);
        //_Status.tempghp = _g;
        if (_Status.tempghp) {
            Hackathon.Map.RemoveGraphic(_Status.ScoreLayer, _Status.tempghp);
        };
        var _id;
        if (evt.graphic.geometry.type === 'point') {
            // *** 利用小圓的ID對應到網格id
            _id = 'p_' + evt.graphic.id.split('_')[1];
        }
        else { _id = evt.graphic.id; }
        var _g = _Status.ScoreGraphics[_id];
        var arrGraphicData = {
            ID: 'line_1',
            Ring: _g.Graphic.geometry.rings[0],
            Symbol: {
                'Type': 'SimpleFillSymbol',
                'Color': [255, 190, 190, 0],
                'BorderWeight': 1,
                'BorderColor': 'red'
            },
            Attribute: {
            }
        };
        _Status.tempghp = Hackathon.Map.AddPolygon(_Status.ScoreLayer, arrGraphicData);
    };
    var _ShowPointInfoTemplate = function (evt) {
        if (_Status.IsLandmineMode) {
            return;
        }
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
    var _SetLandmineMode = function (_IsOn) {
        _Status.IsLandmineMode = _IsOn;
    }
    var _Reset = function () {
        // 還原UI
        _DigitalAnimation(_Status.graphics.length);
        // 清除圖層
        Hackathon.Map.ClearLayer(_Status.ScoreLayer);
        Hackathon.Map.ClearLayer(_Status.LandmineLayer);
        Hackathon.Map.ClearLayer(_Status.BusLandmineLayer);
        Hackathon.Map.GetStatus().map.infoWindow.hide();
        _Status.NoServiceList = _Status.graphics.slice();
        $('#Fun_Legend').hide();
    }

    var _Clear = function () {
        // 清除圖層
        Hackathon.Map.RemoveLayer(_Status.LayerName);
        Hackathon.Map.RemoveLayer(_Status.ScoreLayer);
        Hackathon.Map.RemoveLayer(_Status.LandmineLayer);
        Hackathon.Map.RemoveLayer(_Status.BusLandmineLayer);
        Hackathon.Map.GetStatus().map.infoWindow.hide();
        _Status.graphics =[];
        ScoreGraphics={};
        tempghp= undefined;
        NoServiceList = [];
        _Status.IsLandmineMode = false;
        $('#Fun_Legend').hide();
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
        Reset: _Reset,
        SetLandmineMode: _SetLandmineMode
        // AddNetPoly: _AddNetPoly
    }
})