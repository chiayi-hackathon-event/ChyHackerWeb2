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
     //   $('body').removeClass('menu-show panel-empty');
       // $('.info-block').hide();
       // $('.info-block[id=' + $(this).attr('name') + ']').show();
    //    $('body').addClass('panel-show');
    }
    var _Event_Click_Lodging = function () {
        if (Hackathon.UIMain.Lodging) {
            _Clear();
            Hackathon.UIMain.Lodging.Reset();
        }else{
            require(['UI/UI_Lodging'], function (UI_Lodging) {
                UI_Lodging.Init();
            })
        }
    }
    var _Event_Click_Transport = function () {
        if (Hackathon.UIMain.Transport) {
            _Clear();
            Hackathon.UIMain.Transport.Reset();
        } else {
            require(['UI/UI_Transport'], function (UI_Transport) {
                UI_Transport.Init();
            })
        }
    }
    var _Event_Click_Industry = function () {

    }

    var _Clear = function () {
        if (Hackathon.UIMain.Lodging) { Hackathon.UIMain.Lodging.Clear(); };
        if (Hackathon.UIMain.Industry) { Hackathon.UIMain.Industry.Clear(); };
        if (Hackathon.UIMain.Transport) { Hackathon.UIMain.Transport.Clear(); };
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