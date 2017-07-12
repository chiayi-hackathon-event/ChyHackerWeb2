define(['Sev/Sev_Lodging', 'UILoader!_Lodging'], function (_Sev,_html) {
    Hackathon.namespace('Hackathon.UIMain.Lodging');
    var _Status = {};
    var _Clear = function () {
        _Sev.Clear();
    }
    var _Init = function () {
        _Sev._add();
        Hackathon.Common.Set_UI(_html);
    }
    var _Reset = function () {
        _Clear();
        _Init();
    }
    Hackathon.UIMain.Lodging = {
        Init: _Init,
        Clear: _Clear,
        Reset : _Reset
    }
 //   Hackathon.UI.Lodging.Init();
    return Hackathon.UIMain.Lodging;
})