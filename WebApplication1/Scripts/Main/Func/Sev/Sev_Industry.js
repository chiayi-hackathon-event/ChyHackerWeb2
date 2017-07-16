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
                ///   if (evt.graphic.attributes.type === 'Poi') {
                _DrawCircle(evt.graphic.geometry.x, evt.graphic.geometry.y);
                _AddFactPoint(evt.graphic.geometry.x, evt.graphic.geometry.y);

                $('body').removeClass('menu-show panel-empty');
                $('body').addClass('panel-show');
                _BindUI(evt.graphic.attributes);
                ///    }
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
        // *** Layer 2 ***
        _LayerOption = { ID: _Status.IndustryFactoryLayer, AddEvent: [] };
        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
               
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
    }
    var _BindUI = function (_attr) {
        console.log(_attr);
        for (var key in _attr) {
            if (_attr.hasOwnProperty(key)) {
                _Status['VueData'][key] = _attr[key];
            }
        }
    }
    var _DrawCircle = function (_x, _y) {
        Hackathon.Map.ClearLayer(_Status.IndustryGraphicLayer);
        var GraphicData = { Geometry: {}, Symbol: {}, Attribute: {}, Attributes: {} };
        GraphicData.Geometry.X = _x;
        GraphicData.Geometry.Y = _y;
        GraphicData.Attributes.Radius = 500;
        GraphicData.Symbol.Type = "SimpleFillSymbol";
        Hackathon.Map.DrawCircle(_Status.IndustryGraphicLayer, GraphicData);
    }
    var _AddFactPoint = function (_x, _y) {
        $.when(_Data.GetFactoryData(_x, _y), _Data.GetBUSMData(_x, _y)).then(function (FactoryData, BUSMData) {
            debugger
            for (let i = 0; i < FactoryData.length; i++) {
                var graphicData = { ID: 'F_' + i, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = FactoryData[i].X;
                graphicData.Geometry.Y = FactoryData[i].Y;
                graphicData.Attribute = {
                    //名稱
                    name: FactoryData[i].LandMark,
                }
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/Industry/HaoXing.svg',
                    Width: 20,
                    Height: 20,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.IndustryFactoryLayer, graphicData);
            }
            for (let i = 0; i < BUSMData.length; i++) {
                var graphicData = { ID: 'B_' + i, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = BUSMData[i].X97;
                graphicData.Geometry.Y = BUSMData[i].Y97;
                graphicData.Attribute = {
                    //名稱
                    name: BUSMData[i].LandMark,
                }
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/Industry/HaoXing.svg',
                    Width: 20,
                    Height: 20,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.IndustryFactoryLayer, graphicData);
            }
        })
    }
    var _AddPoint = function () {
        $.when(_Data.GetAllPoiData(), _Data.GetTaiwanAskData(), _Data.GetTaiwanIsGoodData()).then(function (Poi, TaiwanAsk, TaiwanIsGood) {
            debugger
            for (let i = 0; i < TaiwanAsk.length; i++) {
                var graphicData = { ID: 'TA_' + i, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = TaiwanAsk[i].X97;
                graphicData.Geometry.Y = TaiwanAsk[i].Y97;
                graphicData.Attribute = {
                    type: 'TaiwanAsk',
                    //名稱
                    name: TaiwanAsk[i].name,
                    //景點類別
                    class: '-',
                    //地址
                    description: TaiwanAsk[i].address,
                    //電話
                    tel: TaiwanAsk[i].tel,
                    //網站
                    web: TaiwanAsk[i].website == '無' ? null : TaiwanAsk[i].website,
                    img: TaiwanAsk[i].image
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
                    type: 'TaiwanIsGood',
                    //名稱
                    name: TaiwanIsGood[i].SITENAME,
                    //景點類別
                    class: '-',
                    //地址
                    description: TaiwanIsGood[i].ROADLINENAME,
                    //電話
                    tel: '-',
                    //網站
                    web: null,
                    img: null
                }
                graphicData.Symbol = {
                    Url: window.location.href + '/Content/img/Industry/HaoXing.svg',
                    Width: 20,
                    Height: 20,
                    yoffset: 5,
                    Type: 'PictureMarkerSymbol'
                };
                var _g = Hackathon.Map.AddPoint(_Status.IndustryFactoryLayer, graphicData);
            }
            for (let i = 0; i < Poi.length; i++) {
                var graphicData = { ID: 'POI_' + i, Geometry: {}, Symbol: {}, Attribute: {}, AddEvent: [] };
                graphicData.Geometry.X = Poi[i].X;
                graphicData.Geometry.Y = Poi[i].Y;
                graphicData.Attribute = {
                    type: 'Poi',
                    //名稱
                    name: Poi[i].Name,
                    //景點類別
                    class: Poi[i].Class,
                    ////縣市
                    //coun: Poi[i].COUN_NA + Poi[i].TOWN_NA,
                    //地址
                    description: (Poi[i].ADD && (Poi[i].ADD).indexOf('嘉義') == -1 )? Poi[i].Description : Poi[i].ADD,
                    //電話
                    tel: Poi[i].TEL,
                    //網站
                    web: Poi[i].Web,
                    img: Poi[i].Pic
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
                    return (this.sum.img == null);
                },
                showWeb: function () {
                    return (this.sum.web == null);
                }
            },
            //filters: {
            //    CheckValue: function (val) {
            //        return (val == null) ? 0 : val;
            //    }
            //}
        });
    }

    return {
        Add: _Add,
        Clear: _Clear,
        CreateVue: _CreateVue
    }
})