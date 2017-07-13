define(['Sev/Sev_Transport', 'UILoader!_Transport'], function (_Sev, _html) {
    Hackathon.namespace('Hackathon.UIMain.Transport');
    var _Status = {};
    var _Set_Event = function () {
        $(document).on('click', '#btn_DrawPoly', _Event_DrawPoly_Click);
    }
    var _Event_DrawPoly_Click = function () {
        _Sev.DrawPoly();
    }
    var _Clear = function () {
        _Sev.Clear();
    }
    var _Init = function () {
        Hackathon.Common.Set_UI(_html);
        _Set_Event();
        _Sev.Add();
        $('body').removeClass('menu-show panel-empty');
        $('body').addClass('panel-show');
    }
    var _Reset = function () {
        _Clear();
        _Init();
    }
    Hackathon.UIMain.Transport = {
        Init: _Init,
        Clear: _Clear,
        Reset: _Reset
    }
    return Hackathon.UIMain.Transport;
})