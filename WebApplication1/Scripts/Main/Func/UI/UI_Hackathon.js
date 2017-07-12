define(['Sev/Sev_Hackathon'], function (Sev) {
    var _Status = {};

    var _SetEvent = function () {
        $(document).on('click', '#map .btn-zoom-in', _Event_btnZoomIn);
        $(document).on('click', '#map .btn-zoom-out', _Event_btnZoomOut);
        $(document).on('click', '#btn-slide', _Event_Slide_Panel);
        $(document).on('click', '#btn-menu', _Event_Click_BtnMenu);
        $(document).on('click', '#btn-close-menu', _Event_Click_BtnCloseMenu);
        $(document).on('click', 'nav .nav-item', _Event_Click_NavItem);
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
        $('body').removeClass('menu-show panel-empty');
        $('.info-block').hide();
        $('.info-block[id=' + $(this).attr('name') + ']').show();
        $('body').addClass('panel-show');
    }

    var _init = function () {
        _SetEvent();
    }

    return {
        init: _init
    }
})