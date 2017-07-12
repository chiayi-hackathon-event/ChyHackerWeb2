define(function () {
    return {
        load: function (name, req, onLoad) {
            //**** todo 待整理
            var _href = window.location.href;
            var _url = _href.substr(_href.length - 1, 1) === '/' ? _href : _href + '/';
            $.ajax( {
                url: _url + 'GetPartialView/getPartialView',
                dataType: 'html',
                success: onLoad,
                data: {
                    _path:name
                }
            });
        }
    };
});