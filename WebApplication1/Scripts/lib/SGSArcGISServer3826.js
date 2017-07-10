dojo.declare("SGSTileLayer", esri.layers.TiledMapServiceLayer,
{
	constructor: function(sUrl, serviceRes, nLayer)
	{
		this._url = sUrl;
		this._resource = null;
		this._layer = nLayer;

		var pThis = this;
		var url = sUrl + "/GetCacheConfig?FORMAT=JSON";
		LoadScript(url, function()
		{
			var pNodeRes = result.Infomation;
			if (!pNodeRes)
				return;
			this._resource = pNodeRes.ResourceName;			//取得TGOS圖磚服務名稱
			var ImgWidth = parseInt(pNodeRes.TileWidth);
			var ImgHeight = parseInt(pNodeRes.TileHeight);
			var dCLeft = parseFloat(pNodeRes.CornerLeft);
			var dCLower = parseFloat(pNodeRes.CornerLower);

			var pEnv = pNodeRes.Envelope;
			var dCacheLeft = parseFloat(pEnv.Left);
			var dCacheTop = parseFloat(pEnv.Top);
			var dCacheRight = parseFloat(pEnv.Right);
			var dCacheBottom = parseFloat(pEnv.Bottom);

			pThis.spatialReference = new esri.SpatialReference({ wkid:3826 });

			pThis.initialExtent = (pThis.fullExtent = new esri.geometry.Extent(dCacheLeft, dCacheBottom, dCacheRight, dCacheTop, pThis.spatialReference));

			var resolutions = new Array();
			var pSclss = pNodeRes.Scales;
			var pScls = pSclss.Scale;
			if (pScls)
			{
				if (pScls.length > 0)
				{
					for (var i = 0 ; i < pScls.length ; i++)
					{
						var pScl = pScls[i];
						var dem;
						if (pScl.Denominator)
							dem = parseFloat(pScl.Denominator);
						else
							dem = parseFloat(pScl._text);
						var fac = parseFloat(pScl.Factor);
						resolutions.push({ level: i, scale: dem, resolution: fac});
					}
				}
			}

			pThis.tileInfo = new esri.layers.TileInfo(
			{
				"dpi": "96",
				"format": "image/png",
				"compressionQuality": 0,
				"spatialReference": { "wkid": "3826" },
				"rows": ImgWidth,
				"cols": ImgHeight,
				"origin": { "x": dCLeft, "y": dCLower },
				"lods": resolutions
			});
			pThis.loaded = true;
			pThis.onLoad(pThis);
		});
	},
	getTileUrl: function(level, row, col)
	{
	    var _APPID ="WusC33Pv0/+wYTKYBg428ilMGimNwPpSbdxJMU0nP+9kiGWs65urIQ==";
	    var _APIKEY = "cGEErDNy5yN/1fQ0vyTOZrghjE+jIU6u5F5HodqJJs7FjFpqIsobwEacQpW7wA+KFPDY43fjC6EBKjvmVPDZ6uJQ1fkfcicIcs9a6Qwt3/zFpcbFmTffvD7v83O+hrQxI0mnBeHeHo6gcopnzSSCRoe3w+oXEK1n6daG8mbK5s0oGaMW2mR1z+76kzWXLP4RrSk5YIwIsH6EzipiRPCJM08wrg3TR09xIDTZDf8YwSO1Koy9t3yOWEMtcnp321bWBrdB+S0bjK6VQfAHuXHjoyo4WpzluFfuX5Ntj9N5jG/KZNxJW0gaqkKQQ9uZslEYRY7mGjA1TH2blP1/9CFXhw==";
		var scnt = this.tileInfo.lods.length;
		//var sUrl = this._url + "/GetCacheImage?APPID=" + _APPID + "&APIKEY=" + _APIKEY + "&S=" + level + "&X=" + (col - 1) + "&Y=" + (-row - 1) + "&L=" + this._layer;
	    var sUrl = this._url + "/GetCacheImage?APPID=" + _APPID + "&APIKEY=" + _APIKEY + "&S=" + level + "&X=" + col + "&Y=" + (-row - 1) + "&L=" + this._layer;
		return sUrl;
	}
});