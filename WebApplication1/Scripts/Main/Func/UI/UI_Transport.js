define(['Sev/Sev_Transport', 'UILoader!_Transport'], function (_Sev, _html) {
    Hackathon.namespace('Hackathon.UIMain.Transport');
    var _Status = {};
    var _Set_Event = function () {
        $(document).on('click', '#btn_DrawPoly', _Event_DrawPoly_Click);
        $(document).on('click', '#btn_Reset', _Event_Reset_Click);
        $(document).on('click', '#btn_Landmine', _Set_Landmine_Mode);
    }
    var _Event_DrawPoly_Click = function () {
        _Sev.DrawPoly();
    }
    var _Event_Reset_Click = function () {
        _Sev.Reset();
    }
    var _Set_Landmine_Mode = function () {
        var _IsOn;
        if ($(this).hasClass('btn-blue')) {
            _IsOn = false;
        }
        else {
            _IsOn = true;
        }
        $(this).toggleClass('btn-blue').toggleClass('btn-blue-inverse');
        _Sev.SetLandmineMode(_IsOn);
    }
    var _Clear = function () {
        _Sev.Clear();
    }
    var _Init = function () {
        Hackathon.Common.Set_UI(_html);
        _Set_Event();
        _Sev.Add();
        
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