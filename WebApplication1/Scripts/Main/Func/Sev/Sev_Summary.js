define(['Data/Data_Summary'], function (_Data) {
    var _Status = {
        LayerName: 'GraphicLayer',
        POILayerName: 'POIGraphicLayer',
        graphics: {},
        VueData: {},
        VueObj: {}
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
                _Status.graphics[_id] = _graphic;

                if (res[j].IsShow === 1)
                    _ChangeBaseColor(_id);
            }
        })
    }

    var _ChangeBaseColor = function (_id) {
        _Status.tempID = _id;
        var _graphic1 = _Status.graphics[_Status.tempID].Graphic;
        var _symbol = _graphic1.symbol;
        _symbol.color.r = 206;
        _symbol.color.g = 191;
        _symbol.color.b = 242;
        _symbol.color.a = 0.4;
        _graphic1.setSymbol(_symbol);
    }
    //
    var _ShowSummaryData = function (_vill_id) {
        /// <summary>
        /// 取回資料
        /// </summary>
        /// <param name="_townId" type="type"></param>
        $.when(_Data.GetSummaryData(_vill_id)).then(function (data) {
            _Status['VueData'] = data[0];
            _CreateVue();
        })
    }

    // **** 左邊選單 ****
    var _CreateVue = function () {
        _Status['VueObj'] = new Vue({
            el: '#summary',
            data: _Status['VueData'],
            computed: {
                Industry_all: function () {
                    if (this.Industry_Nocard >= 0 && this.Industry_card >= 0)
                        return this.Industry_Nocard + this.Industry_card;
                    else return 0;
                }
            },
            filters: {
                CheckValue: function (val) {
                    return (val == null) ? 0 : val;
                }
            }
        });
    }
    var _ShowData = function (_id) {
        //Get id
        var _g = _Status.graphics[_id].Graphic;
        _ShowSummaryData(_g.attributes.VLG_ID);

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
        _symbol.color.a = 0.8;
        _graphic.setSymbol(_symbol);
    }
    var _add = function () {
        _AddLayer();
        _AddChyPolygon();
    }
    return {
        Clear: _Clear,
        _add: _add,
    }
})