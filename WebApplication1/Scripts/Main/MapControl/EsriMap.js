Hackathon.namespace('Hackathon.Map');
define(function (module) {
    var _Status = {
        map: undefined,
        layList: {},
    };
    //////////////////////////////////////////////////////////
    var _SetMap = function (HTMLMap) {
        var dtd = $.Deferred();
        require(["esri/map", "esri/geometry/Extent", "esri/SpatialReference", "esri/toolbars/draw", "esri/dijit/InfoWindowLite", "dojo/dom-construct", "dojo/domReady!"],
            function (Map, Extent, SpatialReference, Draw, InfoWindowLite, domConstruct) {
                _Status.SR = new SpatialReference({ wkid: 3826 });
                var _info = new InfoWindowLite({}, domConstruct.create("div"));
                _Status.map = new Map(HTMLMap, {
                    autoResize: true,
                    logo: false,
                    wrapAround180: true,
                    infoWindow: _info,
                    SpatialReference: _Status.SR,
                    slider: false,
                });
                _Status.map.infoWindow.startup();
                _Status.map.on('load', function () {
                    Hackathon.Map.CenterAt(281016, 2770090, 7);
                });
                if (_Status.map != undefined) {
                    dtd.resolve();
                }
            });
        return dtd.promise();
    };
    var _LoadTgosMap = function(){
        require(['AjaxAgent','Framework','SGSJS'], function () {
                var _url = "http://api.tgos.tw/Agent/TWD97/Agent_TGOSMAP3826.aspx";
                var sgsLayer = new SGSTileLayer(_url, "", 0);
                _Status.map.addLayer(sgsLayer);			//加入圖層
           });
    }
    var _AddLayer = function (LayerType, LayerURL, LayerOption) {
        if (_Status.map == undefined) {
            setTimeout(function () {
                _AddLayer(LayerType, LayerURL, LayerOption);
            }, 50);
            return;
        }
        var _servicesURL = LayerURL;
        if (LayerOption.Token && LayerOption.Token != "") { _servicesURL += "?token=" + LayerOption.Token };
        var _layer;
        switch (LayerType) {
            case "Graphic":
                require(["esri/map", "esri/layers/GraphicsLayer"],
                    function (Map, GraphicsLayer) {
                        var _optionObject = {};
                        if (LayerOption.ID) {
                            _optionObject.id = LayerOption.ID;
                        }
                        _layer = new GraphicsLayer(_optionObject);
                        _layer.DefinedType = "GraphicsLayer";
                        _layer.DefinedName = LayerOption.ID;
                        _layer = _AddLayerEvent(_layer, LayerOption);
                        _Status.map.addLayer(_layer);
                        _Status.layList[_layer.id] = _layer;
                    });
                break;
        }
    };
    var _AddLayerEvent = function (_layer, LayerOption) {
        if (LayerOption != undefined && LayerOption.AddEvent) {
            for (var i = 0; i < LayerOption.AddEvent.length; i++) {
                var _Event = LayerOption.AddEvent[i];
                require(["esri/map", "esri/layers/GraphicsLayer", "dojo/domReady!"], function (Map, GraphicsLayer) {
                    _layer.on(_Event.EventType, _Event.CallBack);
                });
            }
        }
        return _layer;
    };
    var _AddPoint = function (LayerName, GraphicData) {
        GraphicData.Geometry.X = Number(GraphicData.Geometry.X);
        GraphicData.Geometry.Y = Number(GraphicData.Geometry.Y);
        var _Geometry;
        require(["esri/geometry/Point"], function (Point) {
            _Geometry = new Point(GraphicData.Geometry.X, GraphicData.Geometry.Y, _Status.SR);
        });
        var _Symbol;
        require(["esri/symbols/PictureMarkerSymbol"], function (PictureMarkerSymbol) {
            _Symbol = new PictureMarkerSymbol(GraphicData.Symbol.Url, GraphicData.Symbol.Width, GraphicData.Symbol.Height);
        });
        var _Attribute = GraphicData.Attribute;
        var _NewGraphic;
        require(["esri/graphic", "esri/InfoTemplate"], function (Graphic, InfoTemplate) {
            _NewGraphic = new Graphic(_Geometry, _Symbol, _Attribute);
        });
        if (GraphicData.id || GraphicData.ID) {
            _NewGraphic.id = (GraphicData.id) ? GraphicData.id : GraphicData.ID;
        }
        var _graphicInfo = { Status: Boolean, Graphic: new Object() };
        _Status.layList[LayerName].add(_NewGraphic);
        _graphicInfo.Graphic = _NewGraphic;
        return _graphicInfo;
    };
    var _AddPolygon = function (LayerName, GraphicData) {
        var _Geometry;
        var _Symbol;
        require(["esri/geometry/Polygon",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/Color"], function (Polygon, SimpleFillSymbol, SimpleLineSymbol, Color) {
                _Geometry = new Polygon(_Status.SR);
                _Geometry.addRing(GraphicData.Ring);
                switch (GraphicData.Symbol.Type) {
                    case "SimpleFillSymbol":
                        //預設值
                        var _borderColor = (GraphicData.Symbol.BorderColor) ? GraphicData.Symbol.BorderColor : [255, 255, 255, 1];
                        var _borderWeight = (GraphicData.Symbol.BorderWeight) ? GraphicData.Symbol.BorderWeight : 2;
                        _Symbol = new SimpleFillSymbol(
                            SimpleFillSymbol.STYLE_SOLID,
                            SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(_borderColor), _borderWeight),
                            new Color(GraphicData.Symbol.Color));
                        break;
                }
            });
        //圖層屬性
        var _Attribute = GraphicData.Attribute;
        //其他需設定參數
        var _Option = GraphicData.Option;
        var _NewGraphic;
        require(["esri/graphic"], function (Graphic) {
            _NewGraphic = new Graphic(_Geometry, _Symbol, _Attribute);
        });
        if (GraphicData.id || GraphicData.ID) {
            _NewGraphic.id = (GraphicData.id) ? GraphicData.id : GraphicData.ID;
        }

        //加入Graphic
        var _graphicInfo = {Graphic: new Object() };
        _Status.layList[LayerName].add(_NewGraphic);
        _graphicInfo.Graphic = _NewGraphic;
        return _graphicInfo;
    };
    var _SetZoom = function (zoomLevel) {
        require(["esri/map"], function (Map) {
            if (zoomLevel == "-1") {
                zoomLevel = _Status.map.getZoom() - 1;
            }
            else if (zoomLevel == "+1") {
                zoomLevel = _Status.map.getZoom() + 1;
            }
            _Status.map.setZoom(zoomLevel);
        });
    };
    var _SetInfowindow = function (_InfoContent, _Option) {
        require(["esri/dijit/InfoWindow", "esri/graphic", "esri/layers/GraphicsLayer", "esri/InfoTemplate", "dojo/dom-construct", "dojo/domReady!"],
            function (InfoWindow, Graphic, GraphicsLayer, InfoTemplate, domConstruct) {
                var _title = _InfoContent.title;
                var _content = _InfoContent.content;
                var _window = _Status.map.infoWindow;
                _window.setTitle(_title);
                _window.setContent(_content);
                _window.resize(_Option.WinWidth, _Option.WinHeight);
                _window.fixedAnchor = _Option.placement;
                _window.show(_Option.screenPoint);
                                   
            });
    };
    var _CenterAt = function (x, y, scale) {
        require(["esri/map", "esri/geometry/Point", "dojo/domReady!"], function (Map, Point) {
            var _spatialReference = _Status.SR;
            var _location = new Point(x, y, _spatialReference);
            if (scale) {
                _Status.map.centerAndZoom(_location, scale);
            }
            else {
                _Status.map.centerAt(_location);
            }
        });
    };
    module.GetScreenPoint = function (geometry) {
        return _Status.map.toScreen(geometry);
    };
    //////////////////////////////////////////////////////////

    module.init = function (HTMLMap) {
        var dtd = $.Deferred();
        $.when(_SetMap(HTMLMap)).then(function () {
           _LoadTgosMap();
            return dtd.resolve();
        });
        return dtd.promise();
    }

    module.AddLayer = function (layerType, layerURL, layerOption) {
        //新增圖層
        _AddLayer(layerType, layerURL, layerOption);
    };
    ////加入-面圖示
    module.AddPolygon = function (LayerName, arrGraphicData) {
        return _AddPolygon(LayerName, arrGraphicData);
    };
    module.AddPoint = function (layerName, graphicData) {
        return _AddPoint(layerName, graphicData);
    };
    ////放大
    module.ZoomIn = function () {
        _SetZoom("+1");
    };
    ////縮小
    module.ZoomOut = function () {
        _SetZoom("-1");
    };
    module.GetStatus = function () {
        return _Status;
    }
    module.SetInfowindow = function (_InfoContent, _Option) {
        _SetInfowindow(_InfoContent, _Option);
    };
    module.CenterAt = function (x, y, scale) {
        _CenterAt(x, y, scale);
    };
    return module;
}(Hackathon.Map))