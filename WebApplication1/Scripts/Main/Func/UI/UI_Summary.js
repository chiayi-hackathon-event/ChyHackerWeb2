define(['Sev/Sev_Summary', 'UILoader!_Summary'], function (_Sev, _html) {
  Hackathon.namespace('Hackathon.UIMain.Summary');
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
  Hackathon.UIMain.Summary = {
    Init: _Init,
    Clear: _Clear,
    Reset: _Reset
  }
  //   Hackathon.UI.Summary.Init();
  return Hackathon.UIMain.Summary;
})