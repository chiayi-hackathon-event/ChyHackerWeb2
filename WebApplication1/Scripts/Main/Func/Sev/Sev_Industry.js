define(['Data/Data_Industry'], function (_Data) {
    var _Status = {
      layerName :'IndustryLayer'
    };
    var _AddLayer = function () {
        var _LayerOption = { ID: _Status.LayerName, AddEvent: [] };
        _LayerOption.AddEvent.push({
            'EventType': 'click', 'CallBack': function (evt) {
            }
        });
        Hackathon.Map.AddLayer('Graphic', '', _LayerOption);
    }
    var _AddPoint = function () {
        $.when(_Data.GetAllPoiData(), _Data.GetTaiwanAskData(), _Data.GetTaiwanIsGoodData()).then(function (Poi, TaiwanAsk, TaiwanIsGood) {
            debugger
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



    }
    return {
        Add: _Add,
        Clear:_Clear
    }
})