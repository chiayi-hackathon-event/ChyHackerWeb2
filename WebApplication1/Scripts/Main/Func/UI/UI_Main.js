define(function () {
  Hackathon.namespace('UIMain');
  var _Status = {},
    JSList = {};

  var _SetEvent = function () {
    $(document).on('click', '#map .btn-zoom-in', _Event_btnZoomIn);
    $(document).on('click', '#map .btn-zoom-out', _Event_btnZoomOut);
    $(document).on('click', '#btn-slide', _Event_Slide_Panel);
    $(document).on('click', '#btn-menu', _Event_Click_BtnMenu);
    $(document).on('click', '#btn-close-menu', _Event_Click_BtnCloseMenu);
    $(document).on('click', 'nav .nav-item', _Event_Click_NavItem);
    $(document).on('click', 'nav .nav-item[name="lodging"]', _Event_Click_Lodging);
    $(document).on('click', 'nav .nav-item[name="transport"]', _Event_Click_Transport);
    $(document).on('click', 'nav .nav-item[name="industry"]', _Event_Click_Industry);
    $(document).on('click', 'nav .nav-item[name="summary"]', _Event_Click_Summary);
  }

  var _Event_btnZoomIn = function () {
    Hackathon.Map.ZoomIn();
  }
  var _Event_btnZoomOut = function () {
    Hackathon.Map.ZoomOut();
  }
  var _Event_Slide_Panel = function () {
    $('body').toggleClass('panel-show');
  }
  var _Event_Click_BtnMenu = function () {
    $('body').addClass('menu-show');
  }
  var _Event_Click_BtnCloseMenu = function () {
    $('body').removeClass('menu-show');
  }
  var _Event_Click_NavItem = function () {
    $('.nav-item.active').removeClass('active');
    $(this).addClass('active');
    $('body').removeClass('menu-show');
  }
  var _Event_Click_Lodging = function () {
      _Clear();
    if (Hackathon.UIMain.Lodging) {
      Hackathon.UIMain.Lodging.Init();
    } else {
      require(['UI/UI_Lodging'], function (UI_Lodging) {
        UI_Lodging.Init();
      })
    }
  }
  var _Event_Click_Transport = function () {
      _Clear();
    if (Hackathon.UIMain.Transport) {
        Hackathon.UIMain.Transport.Reset();
    } else {
      require(['UI/UI_Transport'], function (UI_Transport) {
        UI_Transport.Init();
      })
    }
  }
  var _Event_Click_Industry = function () {
      _Clear();
      if (Hackathon.UIMain.Industry) {
          Hackathon.UIMain.Industry.Reset();
      } else {
          require(['UI/UI_Industry'], function (UI_Industry) {
              UI_Industry.Init();
          })
      }
  }
  var _Event_Click_Summary = function () {
      _Clear();
    if (Hackathon.UIMain.Summary) {
      Hackathon.UIMain.Summary.Reset();
    } else {
      require(['UI/UI_Summary'], function (UI_Summary) {
        UI_Summary.Init();
      })
    }
  }
  var _Clear = function () {
    if (Hackathon.UIMain.Lodging) { Hackathon.UIMain.Lodging.Clear(); };
    if (Hackathon.UIMain.Industry) { Hackathon.UIMain.Industry.Clear(); };
    if (Hackathon.UIMain.Transport) { Hackathon.UIMain.Transport.Clear(); };
    if (Hackathon.UIMain.Summary) { Hackathon.UIMain.Summary.Clear(); };
    //$('body').addClass('panel-empty').removeClass('menu-show panel-show');
    //   $('body').removeClass('panel-show');
  }

  var _init = function () {
    _SetEvent();
  }
  Hackathon.UIMain = {
    init: _init
  }
  return Hackathon.UIMain;
})