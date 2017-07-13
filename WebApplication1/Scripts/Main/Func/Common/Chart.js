define(['HighCharts/highcharts'], function (_HighCharts) {
    //#region預設值
    var _options;
    // 圖表預設值
    var _Presets = function () {
        this.chart = {};
        this.title = { text: '' };
        this.credits = { enabled: false };
        this.exporting = { enabled: false };
        this.series = [];
        this.colors = ['#45CFF0', '#A35B2E', '#97EC71', '#F9CB62', '#8C90FC', '#FA6A52', '#7C96FF', '#46C755', '#DE9DD6', '#F79376', '#F756D6', '#42BDA0'];
    };
    // 圓餅圖
    var _PieChart = function () {
        this.chart = {
            type: 'pie'
        };
        this.tooltip = {
            headerFormat: '',
            pointFormat: '<b>{point.name} ({point.y})<br>{point.percentage:.1f}%</b>'
        };
        this.plotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                innerSize: '50%',
                dataLabels:{ enabled: false},
                showInLegend: true
            }
        }
    }
    // 折線圖
    var _LineChart = function () {
        this.chart = {
            type: 'line'
        };
    }
    // 直方圖
    var _ColumnChart = function () {
        this.chart = { type: 'column' };
        this.tooltip = {
            formatter: function () {
                return '<b>' + this.series.name + ':' + this.y + '</b>';
            }
        };
        this.colors = ['#BF82B0', '#71BAEB', '#B29F85', '#E57C71'];
    }
    //#endregion

    // 畫圖
    var _DrawChart = function (type, id, series, custom) {
        _options = new _Presets();
        _SetOptions(type);
        _SetContainer(id); 
        _SetSeries(series);
        
        if (custom != null) {
            _MergeObjects(custom);
        }
        _SetChartGlobal();
        var chart = $('#' + id).highcharts(_options);
        
    }
    // 語言設定
    var _SetChartGlobal = function () {
        Highcharts.setOptions({
            lang: {
                //numericSymbols: ['000'],
                thousandsSep: ',',
                shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                resetZoom: "復原",
                contextButtonTitle: "輸出",
                downloadJPEG: "下載 JPEG",
                downloadPDF: "下載 PDF",
                downloadPNG: "下載 PNG",
                downloadSVG: "下載 SVG",
                printChart: "列印圖表",
                noData: "查無資料"
            }
        });
    }
    // 依照圖表類型作設定
    var _SetOptions = function (type) {
        var typePresets;
        switch (type.toLowerCase()) {
            case 'pie':
                typePresets = new _PieChart();
                break;
            case 'line':
                typePresets = new _LineChart();
                break;
            case 'column':
                typePresets = new _ColumnChart();
                break;
        }
        _MergeObjects(typePresets);
    }
    // 資料設定(多筆)
    var _SetSeries = function (series) {
        $.extend(_options.series, series);
    }
    // 指定圖表render容器
    var _SetContainer = function (id) {
        if (id.indexOf('#') == 0) id = id.substring(1, id.length);
        _options.chart.renderTo = id;
    }
    // 將_options與參數物件結合
    var _MergeObjects = function (obj) {
        for (var prop in obj) {
            if (_options[prop] !== undefined) {
                $.extend(_options[prop], obj[prop]);
            } else {
                _options[prop] = obj[prop];
            }
        }
        //$.extend(_options, obj);
    }

    return {
        DrawChart: _DrawChart
    }
})