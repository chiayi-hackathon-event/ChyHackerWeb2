define(['Data/Data_Lodging', 'Chart'], function (_Data, _Chart) {
    var _Status = {
        LayerName: 'GraphicLayer',
        POILayerName: 'POIGraphicLayer',
        graphics: {},
        ArrayRoomDemand: [],
        ArrayRoomSupply:[],
        ArrayNation: [],
        hotelInfo: {},
        babInfo: {}
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
        var $selLodgingType = $('select.sel-lodging-type');
        $.when(_Data.GetPointData(_townId, 'bablist'),
            _Data.GetPointData(_townId, 'hotellist'),
            _Data.GetSupplyDemand(_townId, '民宿'),
            _Data.GetSupplyDemand(_townId, '旅館'),
            _Data.GetPassengerData(_townId, '2017', 1, 1)).
            then(function (bablist, hotellist, BabData, HotelData, PassengerData) {
                var POILayer = Hackathon.Map.GetStatus().layList[_Status.POILayerName];
                POILayer.clear();
                // ***  TODO 待整理的髒髒der Code
                var searchList, bedCount, RoomData,
                    type = $selLodgingType.val();
                
                RoomData = (type == 'hotel') ? HotelData : BabData;
                _AddPOI('hotel', hotellist);
                _AddPOI('bab', bablist);
                _SwitchPOI(type);

                _SaveData('hotel', hotellist, HotelData);
                _SaveData('bab', bablist, BabData);

                //基本統計
                var stats = _Status[type + 'Info']['stats'];
                $('.tbl-lodging-stats .tr-number td').each(function () { $(this).text(stats[$(this).attr('name')]); });
                
                // 房間供需
                _Status['ArrayRoomDemand'] = RoomData.map(function (e) { return e.DEMAND; });
                _Status['ArrayRoomSupply'] = RoomData.map(function (e) { return e.SUPPLY; });
                _DrawChart_Room();

                // 國籍比
                var NationObj = {};
                _Status['ArrayNation'] = [];
                PassengerData.forEach(function (MonthData) {
                    MonthData.data.forEach(function (Obj) {
                        if (Obj.VALUE == 0) return;
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

    }
    var _AddPOI = function (_type, _obj) {
        /// <summary>
        /// Add Point && return bed count
        /// </summary>
        /// <param name="_type" type="type"></param>
        /// <param name="_obj" type="type"></param>
        if (!_Status['graphics']['poi']) _Status['graphics']['poi'] = [];
        var BedCount = 0;
        for (let i = 0; i < _obj.length; i++) {
            var _id = _type + '_' + i;
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
                AVG_ROOM_PRICE: _obj[i].AVG_ROOM_PRICE,
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
            _Status['graphics']['poi'].push(_g);
            BedCount += Number(_obj[i].ROOM_NUM);
            //  PtArry.push(_g);
        }
        return BedCount;
    }

    var _SaveData = function (type, searchList, RoomData) {
        _Status[type + 'Info']['searchList'] = searchList;
        _Status[type + 'Info']['RoomData'] = RoomData;
        var stats = {
            LodgingCount: 0,
            RoomCount: 0,
            AvgPrice: 0
        };
        if (searchList.length > 0) {
            stats.LodgingCount = searchList.length;
            stats.RoomCount = searchList.reduce(function (a,b) {
                return a + Number(b.ROOM_NUM);
            }, 0);
            stats.AvgPrice = Hackathon.Common.FormatThousandth(Math.round(searchList.reduce(function (a, b) { return a + Number(b.AVG_ROOM_PRICE); }, 0) / searchList.length));
        }
        _Status[type + 'Info']['stats'] = stats;
    }
    var _Switch_LodgingType = function () {
        var type = $(this).val(),
            info = _Status[type + 'Info'],
            stats = info['stats'],
            RoomData = info['RoomData'];
        
        console.log(type);
        _SwitchPOI(type);
        $('.tbl-lodging-stats .tr-number td').each(function () { $(this).text(stats[$(this).attr('name')]); });

        _Status['ArrayRoomDemand'] = RoomData.map(function (e) { return e.DEMAND; });
        _Status['ArrayRoomSupply'] = RoomData.map(function (e) { return e.SUPPLY; });
        _DrawChart_Room();
    }

    var _SwitchPOI = function (type) {
        _Status['graphics']['poi'].map(function (e) { 
            if (e.Graphic.id.startsWith(type)){
                e.Graphic.show();
            } else {
                e.Graphic.hide();
            }
        })
    }
    // 住宿供需趨勢圖表
    var _DrawChart_Room = function () {
        $('#room-chart').empty();
        if (_Status['ArrayRoomDemand'].length == 0 && _Status['ArrayRoomSupply'].length == 0) {
            $('#room-chart').append('<div class="no-data">查無資料</div>');
            return false;
        }
        var type = 'line',
            id = 'room-chart',
            series = [{
                name: '需求',
                data: _Status['ArrayRoomDemand']
            }, {
                name: '供給',
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
        _Chart.DrawChart(type, id, series, custom);
    }
    // 國籍比圖表
    var _DrawChart_Nation = function () {
        $('#nation-chart').empty();
        if (_Status['ArrayNation'].length == 0) {
            $('#nation-chart').append('<div class="no-data">查無資料</div>');
            return false;
        }

        _Status['ArrayNation'].sort(function (a, b) { return b.y - a.y; })
                              .map(function (e, idx) { if (idx > 2) { e.visible = false; } });
        
        var type = 'pie',
            id = 'nation-chart',
            custom = {},
            series = [{
                name: '房客國籍比',
                data: _Status['ArrayNation']
            }];
        
        var chart = _Chart.DrawChart(type, id, series, custom);

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
        _add: _add,
        Switch_LodgingType: _Switch_LodgingType
    }
})