define(['Data/Data_Industry'], function (_Data) {
    var _Status = {
        LayerName: 'IndustryPoiLayer',
        IndustryGraphicLayer: 'IndustryGraphicLayer',
        IndustryFactoryLayer: 'IndustryFactoryLayer',
        VueObj: {},
        VueData: {
            name: '',
            class: '-',
            description: '-',
            tel: '-',
            web: null,
            img: null
        }
    };
    var _AddLayer = function () {
        // *** Layer 1 ***
        var _LayerOption = { ID: _Status.IndustryGraphicLayer, AddEvent: [] };
        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);

        // *** Layer 2 ***
        _LayerOption = { ID: _Status.LayerName, AddEvent: [] };
        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
                // *** 目前規劃Poi才開圓
                if (evt.graphic.attributes.type === 'Poi') {
                    _DrawCircle(evt.graphic.geometry.x, evt.graphic.geometry.y);
                    _AddFactPoint(evt.graphic.geometry.x, evt.graphic.geometry.y);
                }
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
    }
    var _DrawCircle = function (_x, _y) {
        debugger
        Hackathon.Map.ClearLayer(_Status.IndustryGraphicLayer);
        var GraphicData = { Geometry: {}, Symbol: {}, Attribute: {}, Attributes: {} };
        GraphicData.Geometry.X = _x;
        GraphicData.Geometry.Y = _y;
        GraphicData.Attributes.Radius = 500;
        GraphicData.Symbol.Type = "SimpleFillSymbol";
        Hackathon.Map.DrawCircle(_Status.IndustryGraphicLayer, GraphicData);
    }
    var _AddFactPoint = function (_x, _y) {
        $.when(_Data.GetFactoryData(_x, _y)).then(function (FactoryData) {
            
        })
    }
    var _AddPoint = function () {
        $.when(_Data.GetAllPoiData(), _Data.GetTaiwanAskData(), _Data.GetTaiwanIsGoodData()).then(function (Poi, TaiwanAsk, TaiwanIsGood) {
            for (let i = 0; i < TaiwanAsk.length; i++) {
                var graphicData = { ID: 'TA_' + i, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = TaiwanAsk[i].X97;
                graphicData.Geometry.Y = TaiwanAsk[i].Y97;
                graphicData.Attribute = {
                    type: 'TaiwanAsk'
                }
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/Industry/JieWen.svg',
                    Width: 20,
                    Height: 20,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.LayerName, graphicData);
            }
            for (let i = 0; i < TaiwanIsGood.length; i++) {
                var graphicData = { ID: 'TIG_' + i, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = TaiwanIsGood[i].X97;
                graphicData.Geometry.Y = TaiwanIsGood[i].Y97;
                graphicData.Attribute = {
                    type: 'TaiwanIsGood'
                }
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/Industry/HaoXing.svg',
                    Width: 20,
                    Height: 20,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.LayerName, graphicData);
            }
            for (let i = 0; i < Poi.length; i++) {
                var graphicData = { ID: 'POI_' + i, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = Poi[i].X;
                graphicData.Geometry.Y = Poi[i].Y;
                graphicData.Attribute = {
                    type: 'Poi'
                }
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/Industry/POI.svg',
                    Width: 20,
                    Height: 20,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.LayerName, graphicData);
            }
        })
    }
    var _Add = function () {
        _AddLayer();
        _AddPoint();
        // *** 加入Draw Tool事件
        //Hackathon.Map.MapDraw(function (evt) {
        //    // *** CallBack Function ***
        //    debugger
        //}, 3, 'POINT');
    }

    var _Clear = function () {
        Hackathon.Map.RemoveLayer(_Status.LayerName);
        Hackathon.Map.RemoveLayer(_Status.IndustryGraphicLayer);
        Hackathon.Map.RemoveLayer(_Status.IndustryFactoryLayer);
    }
    // **** 左邊選單 ****
    var _CreateVue = function () {
        _Status['VueObj'] = new Vue({
            el: '#industry',
            data: {
                sum: _Status['VueData']
            },
            computed: {
                showImg: function () {
                    return (sum.img == null);
                },
                showWeb: function () {
                    return (sum.web == null);
                }
            },
            filters: {
                CheckValue: function (val) {
                    return (val == null) ? 0 : val;
                }
            }
        });
    }

    return {
        Add: _Add,
        Clear: _Clear,
        CreateVue: _CreateVue
    }
})