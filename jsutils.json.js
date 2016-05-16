_define_("jsutils.json",function(jsonutil){
	
	//_require_(":webmodules/dummy-json");
	var dummyJson = _module_('dummyJson');
	
    var BRACKET_RE_S = /\['([^']+)'\]/g,
	BRACKET_RE_D = /\["([^"]+)"\]/g,
	BRACKET_RE_N = /\[([0-9]+)\]/g;
    
    if(dummyJson ===undefined){
    	console.warn("dummyJson is not installed, to compile json, dummyJson is recommended.")
    }

	function normalizeKeypath (key) {
	    return key.indexOf('[') < 0
	        ? key
	        : key.replace(BRACKET_RE_S, '.$1')
	             .replace(BRACKET_RE_D, '.$1')
	             .replace(BRACKET_RE_N, '.$1')
	}
	
	jsonutil.get = function (obj, key) {
	    /* jshint eqeqeq: false */
	    key = normalizeKeypath(key);
	    if (key.indexOf('.') < 0) {
	        return obj[key]
	    }
	    var path = key.split('.'),
	        d = -1, l = path.length
	    while (++d < l && obj != null) {
	        obj = obj[path[d]]
	    }
	    return obj
	};
	
	/**
	 *  set a value to an object keypath
	 */
	jsonutil.set = function (obj, key, val) {
	    /* jshint eqeqeq: false */
	    key = normalizeKeypath(key)
	    if (key.indexOf('.') < 0) {
	        obj[key] = val
	        return
	    }
	    var path = key.split('.'),
	        d = -1, l = path.length - 1
	    while (++d < l) {
	        if (obj[path[d]] == null) {
	            obj[path[d]] = {}
	        }
	        obj = obj[path[d]]
	    }
	    obj[path[d]] = val
	    return obj[path[d]];
	};
	
	jsonutil.stringify = function(obj) {
	    //if(!errorList) var errorList = [];
	    try {
	        return JSON.stringify(obj);
	    } catch (err) {
	        //errorList.push(err)
	        return jsonutil.stringify({
	            msg: "cannot convert JSON to string",
	            error: [err]
	        });
	    }
	};
	
	var parse = function(str, throwExcep) {
	    if (typeof (str) == 'object')
	        return str;
	    try {
	        return JSON.parse(str);
	    } catch (err) {
	        try {
	            return $.parseJSON(str);
	        } catch (err2) {
	            var errorMSG = {msg: "cannot convert to JSON object", error: [err, err2], str: str};
	            if (throwExcep)
	                throw err2;
	            else
	               console.log(errorMSG);
	            return errorMSG;
	        }
	    }
	};
	
	jsonutil.parse = function(_json_string_, data) {
		if (!_json_string_) {
			return _json_string_;
		}
		if (typeof _json_string_ === 'string') {
			var _json_string_2 = _json_string_;
			if (data !== undefined && dummyJson!==undefined) {
				_json_string_2 = dummyJson.parse(_json_string_, {
					data : { data : data }
				})
			}
			return parse(_json_string_2)
		} else {
			return _json_string_;
		}
	};
	
	jsonutil.duplicate = function(obj){
		var retObj = obj;
		if(!obj){
			console.warn("Cannot dubplicate",obj);
			return retObj;
		}
		try {
			var newString = JSON.stringify(obj);
			retObj = JSON.parse(newString);
		} catch(err) {
			console.error("NOT SAFE",obj,newString);
			retObj = jsonutil.makeCopy(obj,10);
		}
		return retObj;
	};
	jsonutil.makeCopy = function(obj, level){
		if(level){
			if(jQuery.isPlainObject(obj)){
				var newObj = {};
			} else if(jQuery.isArray(obj)){
				var newObj = [];
			} else return obj;
			for(var key in obj){
				newObj[key] = jsonutil.makeCopy(obj[key],level-1)
			}
			return newObj;
		} else {
			return obj;
		}
	};
});
