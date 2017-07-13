define(['Data/Data_Hackathon', 'DataTable'], function (_Data) {
    var _Status = {
        LayerName: 'GraphicLayer',
        graphics: {},
        tempID: undefined,
        PtLayerName: 'PtLayer',
        DemoPts: {
            FactoryPt: [],
            BussPt: [],
            CmpyPt: []
        },
        tempPt: undefined,
        DataTable: undefined
    };
    var _Add = function () {
        _AddLayer();
        _AddPolygon();
    };
    var _AddLayer = function () {
        var _LayerOption = { ID: _Status.LayerName, AddEvent: [] };

        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
                $('#info-panel').addClass('CommonShow');
                $('#CardPanel').show();
                $(_Status.DataTable.cells('td').nodes()).removeClass('active');
                $(_Status.DataTable.cells('#' + evt.graphic.id).nodes()).addClass('active');
                _ShowData(evt.graphic.id);
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);

        var _PtLayerOption = { ID: _Status.PtLayerName, AddEvent: [] };
        _PtLayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
                _ShowPointInfoTemplate(evt.graphic, evt.screenPoint);
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _PtLayerOption);
    }
    var _AddPolygon = function () {
        $.when(_Data.GetData('Data'), _Data.GetData('Buss'), _Data.GetData('Cmpy'), _Data.GetData('Factory')).then(
            function (data, Buss, Cmpy, Factory) {
                var _html = "";
                for (var j = 0; j < data.length; j++) {
                    var _rings = [];
                    var points = data[j].st_asewkt.split(';');
                    for (var i = 0; i < points.length; i++) {
                        var point = points[i].split(',');
                        point = Hackathon.Common.CoordTran(point[0], point[1], '3857', '3826');
                        _rings.push([point.x, point.y]);
                    }
                    var _id = 'data_' + j;
                    var arrGraphicData = {
                        ID: _id,
                        Ring: _rings,
                        Symbol: {
                            'Type': 'SimpleFillSymbol',
                            'Color': [255, 0, 0, 0.55],
                            'BorderColor': [0, 0, 0, 1],
                            'BorderWeight': 1
                        },
                        Attribute: {
                            "interrupt_time": data[j].interrupt_time,
                            "supply_time": data[j].supply_time,
                            "reason": data[j].reason,
                            "center": data[j].center,
                            "buffer": data[j].buffer,
                            "user": Number(data[j].user),
                            "people": data[j].people,
                            "men": data[j].men,
                            "st_people": data[j].st_people,
                            "commonUse": data[j].commonUse,
                            "bussUse": data[j].bussUse,
                            "factoryUse": data[j].factoryUse
                        }
                    };
                    _html += '<tr><th>' + (j + 1) + '.</th><td id="' + _id + '">' + data[j].range + '</td></tr>';
                    var _graphic = Hackathon.Map.AddPolygon(_Status.LayerName, arrGraphicData);
                    _graphic['Buss'] = [];
                    _graphic['Cmpy'] = [];
                    _graphic['Factory'] = [];
                    _Status.graphics[_id] = _graphic;
                }
                for (let i = 0; i < Buss.length; i++) {
                    var _id = Buss[i].Area;
                    _Status.graphics[_id].Buss.push({
                        name: Buss[i].BUSS_NAME,
                        x: Buss[i].X,
                        y: Buss[i].Y
                    })

                }
                for (let i = 0; i < Cmpy.length; i++) {
                    var _id = Cmpy[i].Area;
                    _Status.graphics[_id].Cmpy.push({
                        name: Cmpy[i].CMPY_NAME,
                        x: Cmpy[i].X,
                        y: Cmpy[i].Y
                    })
                }
                for (let i = 0; i < Factory.length; i++) {
                    var _id = Factory[i].Area;
                    _Status.graphics[_id].Factory.push({
                        name: Factory[i].Name,
                        x: Factory[i].X,
                        y: Factory[i].Y
                    })
                }
                $('#tb tbody').append(_html);
                _Status.DataTable = $('#tb').DataTable({
                    "paging": true,
                    "bLengthChange": false,
                    "iDisplayLength": 8,
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
            })
    }
    var _AddPoint = function (_type) {
        if (_Status.tempID) {
            var PtLayer = Hackathon.Map.GetStatus().layList[_Status.PtLayerName];
            var PtData = _Status.graphics[_Status.tempID][_type];
            var PtArry = _Status.DemoPts[_type + 'Pt'];
            for (var i = 0; i < PtData.length; i++) {
                var _id = _type + '_' + i;
                var graphicData = { ID: _id, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = PtData[i].x;
                graphicData.Geometry.Y = PtData[i].y;
                graphicData.Attribute.type = _type;
                graphicData.Attribute.name = PtData[i].name;
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/' + _type + 'Pt_off.svg',
                    Width: 25,
                    Height: 25,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.PtLayerName, graphicData);
                PtArry.push(_g);
            }
        }
    }
    var _RemovePoint = function (_type) {
        if (_Status.tempID) {
            var Pts = _Status.DemoPts[_type + 'Pt'];
            var PtLayer = Hackathon.Map.GetStatus().layList[_Status.PtLayerName];
            for (var i = 0; i < Pts.length; i++) {
                PtLayer.remove(Pts[i].Graphic);
            }

            if (_Status.tempPt && _type == _Status.tempPt.attributes.type) {
                $('.simpleInfoWindow').hide();
            }
        }
    }
    var _SetCenter = function (_id) {
        var _graphic = _Status.graphics[_id].Graphic;
        var _point = _graphic.attributes.center;
        Hackathon.Map.CenterAt(_point.cx, _point.cy, 8);
        _ShowData(_id);

    }
    var _ShowData = function (_id) {
        if( _Status.tempID != _id){
            var PtLayer = Hackathon.Map.GetStatus().layList[_Status.PtLayerName];
            PtLayer.clear();
            $('.ImageBtn').each(function () {
                $dom = $(this);
                $dom.removeClass($dom.attr('data-type') + 'On');
            })
            Hackathon.Map.GetStatus().map.infoWindow.hide();
        }
        _ChangeColor(_id);
        $('#panel').show();
      
        for (var o in _Status.DemoPts) {
            o = [];
        }
        var _graphic = _Status.graphics[_id].Graphic;
     
        $('#interrupt_time').text(_graphic.attributes.interrupt_time);
        $('#supply_time').text(_graphic.attributes.supply_time);
        $('#reason').text(_graphic.attributes.reason);

        $('#user').attr('data-count', _graphic.attributes.user);
        $('#people').attr('data-count', _graphic.attributes.people);
        $('#commonUse').attr('data-count', _graphic.attributes.commonUse);
        $('#bussUse').attr('data-count', _graphic.attributes.bussUse);
        $('#factoryUse').attr('data-count', _graphic.attributes.factoryUse);
        $('#st_people').attr('data-count', _graphic.attributes.st_people);
        $('#sp_Buss').attr('data-count', _Status.graphics[_id].Buss.length);
        $('#sp_Cmpy').attr('data-count', _Status.graphics[_id].Cmpy.length);
        $('#sp_Factory').attr('data-count', _Status.graphics[_id].Factory.length);
   
        $('.counter').each(function () {
            var $this = $(this),
                countTo = $this.attr('data-count');
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            },
                {
                    duration: 500,
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
    var _ShowPointInfoTemplate = function (graphic, screenPoint) {
        var _symbol
        if (_Status.tempPt) {
            _symbol = _Status.tempPt.symbol;
            _symbol.url = window.location.href + '/Content/img/' + _Status.tempPt.attributes.type + 'Pt_off.svg';
            _Status.tempPt.setSymbol(_symbol);
        }
        _symbol = graphic.symbol;
        _symbol.url = window.location.href + '/Content/img/' + graphic.attributes.type + 'Pt_on.svg';
        graphic.setSymbol(_symbol);
        _Status.tempPt = graphic;
        Hackathon.Map.SetInfowindow(
            {
                title: "名稱",
                content: graphic.attributes.name
            },
            {
                WinWidth: 200,
                WinHeight: 70,
                screenPoint: screenPoint,
                placement: 'upperright'
            });
    }
    var _ChangeColor = function (_id) {
        if (_Status.tempID) {
            var _graphic = _Status.graphics[_Status.tempID].Graphic;
            var _symbol = _graphic.symbol;
            _symbol.color.r = 255;
            _symbol.color.g = 0;
            _symbol.color.b = 0;
            _graphic.setSymbol(_symbol);
        }
        _Status.tempID = _id;
        var _graphic = _Status.graphics[_Status.tempID].Graphic;
        var _symbol = _graphic.symbol;
        _symbol.color.r = 0;
        _symbol.color.g = 255;
        _symbol.color.b = 255;
        _graphic.setSymbol(_symbol);
    }
    var _Close = function () {
        var _symbol = _Status.tempPt.symbol;
        _symbol.url = window.location.href + '/Content/img/' + _Status.tempPt.attributes.type + 'Pt_off.svg';
        _Status.tempPt.setSymbol(_symbol);
        _Status.tempPt = undefined;
    }
    //////////////對外Func//////////////////
    var module = {
        Add: _Add,
        SetCenter: _SetCenter,
        AddPoint: _AddPoint,
        RemovePoint: _RemovePoint,
        Close: _Close
    };
    return module;
});