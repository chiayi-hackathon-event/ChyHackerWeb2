define(['Sev/Sev_Industry', 'UILoader!_Industry'], function (_Sev, _html) {
    Hackathon.namespace('Hackathon.UIMain.Industry');
    var _Status = {};
    var _Set_Event = function () {
    }
    var _Clear = function () {
        _Sev.Clear();
    }
    var _Init = function () {
        Hackathon.Common.Set_UI(_html);
        _Clear();
        _Sev.Add();
    }
    var _Reset = function () {
        _Clear();
        _Init();
    }

    Hackathon.UIMain.Industry = {
        Init: _Init,
        Clear: _Clear,
        Reset:_Reset
    }
    return Hackathon.UIMain.Industry;
})