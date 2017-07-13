define(['Data/Data_Lodging', 'Chart'], function (_Data, _Chart) {
    var _Status = {
        LayerName: 'GraphicLayer',
        POILayerName: 'POIGraphicLayer',
        graphics: {},
        ArrayRoom: [],
        ArrayRoomSupply:[],
        ArrayNation: [],
    };
    var _Clear = function () {
        Hackathon.Map.RemoveLayer(_Status.LayerName);
        _Status.graphics = {};
    }
    var _AddLayer = function () {
        var _LayerOption = { ID: _Status.LayerName, AddEvent: [] };

        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
                //$('#info-panel').addClass('CommonShow');
                //$('#CardPanel').show();
                //$(_Status.DataTable.cells('td').nodes()).removeClass('active');
                //$(_Status.DataTable.cells('#' + evt.graphic.id).nodes()).addClass('active');
                $('body').removeClass('menu-show panel-empty').addClass('panel-show');
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
    var _AddChyPolygon = function () {
        $.when(_Data.GetData()).then(function (res) {
            for (var j = 0; j < res.length; j++) {
                var _rings = [];
                var points = res[j].POLY.split(',');
                for (var i = 0; i < points.length; i++) {
                    var point = points[i].split(' ');
                    _rings.push([point[0], point[1]]);
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
                        TOWN_ID: res[j].TOWN_ID,
                        TOWN_NA: res[j].TOWN_NA,
                    }
                };
                var _graphic = Hackathon.Map.AddPolygon(_Status.LayerName, arrGraphicData);
                _Status.graphics[_id] = _graphic;
            }
        })
    }
    var _AddPoint = function (_townId) {
        /// <summary>
        /// 種點 - 加入民宿、旅館點位資料
        /// </summary>
        /// <param name="_townId" type="type"></param>
        $.when(_Data.GetPointData(_townId, 'bablist'), _Data.GetPointData(_townId, 'hotellist'), _Data.GetPassengerData(_townId,'2017', 1, 1)).
            then(function (bablist, hotellist, PassengerData) {
                var POILayer = Hackathon.Map.GetStatus().layList[_Status.POILayerName];
                POILayer.clear();
                // ***  TODO 待整理的髒髒der Code
                // ***  民宿種點  ****
                var BabBedCount = _AddPOI('A01', bablist);
                // ***  旅館種點  ****
                var HotelBedCount = _AddPOI('A02', hotellist);

                // 圖表資料處理
                var NationObj = {};
                _Status['ArrayNation'] = [];

                PassengerData.forEach(function (MonthData) {
                    MonthData.data.forEach(function (Obj) {
                        if (_Status['ArrayNation'].filter(function (e) { return Obj.NATIONALITY == e.name; }).length == 0) {
                            _Status['ArrayNation'].push({
                                name: Obj.NATIONALITY,
                                y: Obj.VALUE
                            });
                        } else {
                            _Status['ArrayNation'].filter(function (e) { return Obj.NATIONALITY == e.name; })[0].y += Obj.VALUE;
                        }
                    });
                })

                _DrawChart_Nation();
            })
        _Status['ArrayRoom'] = [];
        _Status['ArrayRoomSupply'] = [];
        //_DrawChart_Room();

    }
    var _AddPOI = function (_type, _obj) {
        /// <summary>
        /// Add Point && return bed count
        /// </summary>
        /// <param name="_type" type="type"></param>
        /// <param name="_obj" type="type"></param>
        var BedCount = 0;
        for (let i = 0; i < _obj.length; i++) {
            var _id = 'babPoint_' + i;
            var graphicData = { ID: _id, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
            graphicData.Geometry.X = _obj[i].X;
            graphicData.Geometry.Y = _obj[i].Y;
            graphicData.Attribute = {
                ADDRESS: _obj[i].ADDRESS,
                BOSS: _obj[i].BOSS,
                CUSTOMER: _obj[i].CUSTOMER,
                FAX: _obj[i].FAX,
                NAME: _obj[i].NAME,
                ROOM_PRICE: _obj[i].ROOM_PRICE,
                ROOM_NUM: _obj[i].ROOM_NUM,
                STUFF: _obj[i].STUFF,
                TEL: _obj[i].TEL,
            }
            graphicData.Symbol = {
                Url: window.location.href + '/Content/img/POI/'+_type+'.svg',
                Width: 25,
                Height: 25,
                yoffset: 5,
                Type: 'PictureMarkerSymbol'
            };
            var _g = Hackathon.Map.AddPoint(_Status.POILayerName, graphicData);
            BedCount += Number(_obj[i].CUSTOMER);
            //  PtArry.push(_g);
        }
        return BedCount;
    }

    // 住宿供需趨勢圖表
    var _DrawChart_Room = function () {
        var type = 'line',
            id = 'room-chart',
            series = [{
                name: '需求量',
                data: _Status['ArrayRoom']
            }, {
                name: '供給量',
                data: _Status['ArrayRoomSupply']
            }],
            custom = {
                xAxis: {
                    type: 'datetime',
                    tickInterval: 30 * 24 * 3600 * 1000,
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%b月', this.value);
                        }
                    },
                },
                yAxis: {
                    title: { text: '房間數' }
                },
                plotOptions: {
                    series: {
                        pointStart: Date.UTC(2017, 0, 1),
                        pointInterval: 30 * 24 * 3600 * 1000
                    }
                }
            };
        _Chart.DrawChartWithSeries(type, id, series, custom);
    }
    // 國籍比圖表
    var _DrawChart_Nation = function () {
        var type = 'pie',
            id = 'nation-chart',
            custom = {},
            series = [{
                name: '房客國籍比',
                data: _Status['ArrayNation']
            }];
        _Chart.DrawChartWithSeries(type, id, series, custom );
    }

    var _ShowData = function (_id) {
        var _g = _Status.graphics[_id].Graphic;
        _AddPoint(_g.attributes.TOWN_ID);
        //_DrawChart();
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