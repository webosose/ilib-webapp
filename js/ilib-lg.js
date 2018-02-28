/*
 * ilibglobal.js - define the ilib name space
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @namespace The global namespace that contains all ilib functions and classes.
 */
var ilib = ilib || {};

/**
 * Return the current version of ilib.
 * 
 * @static
 * @return {string} a version string for this instance of ilib
 */
ilib.getVersion = function () {
    // increment this for each release
    return "10.0"
    ;
};

/**
 * Place where resources and such are eventually assigned.
 */
ilib.data = {
    norm: {
        nfc: {},
        nfd: {},
        nfkd: {},
        ccc: {}
    },
    zoneinfo: {
        "Etc/UTC":{"o":"0:0","f":"UTC"},
        "local":{"f":"local"}
    },
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_c: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_l: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_m: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_p: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_z: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ scriptToRange: null,
    /** @type {null|Object.<string,string|Object.<string|Object.<string,string>>>} */ dateformats: null
};

if (typeof(window) !== 'undefined') {
    window["ilib"] = ilib;
}

// export ilib for use as a module in nodejs
if (typeof(exports) !== 'undefined') {
    exports.ilib = ilib;
}

ilib.pseudoLocales = ["zxx-XX"];

/**
 * Sets the pseudo locale. Pseudolocalization (or pseudo-localization) is used for testing
 * internationalization aspects of software. Instead of translating the text of the software
 * into a foreign language, as in the process of localization, the textual elements of an application
 * are replaced with an altered version of the original language.These specific alterations make
 * the original words appear readable, but include the most problematic characteristics of 
 * the world's languages: varying length of text or characters, language direction, and so on.
 * Regular Latin pseudo locale: eu-ES and RTL pseudo locale: ps-AF
 * 
 * @param {string|undefined|null} localename the locale specifier for the pseudo locale
 */
ilib.setAsPseudoLocale = function (localename) {
   if (localename) {
	   ilib.pseudoLocales.push(localename)
   }
};

/**
 * Reset the list of pseudo locales back to the default single locale of zxx-XX.
 */
ilib.clearPseudoLocales = function() {
	ilib.pseudoLocales = ["zxx-XX"];
};

/**
 * Return the name of the platform
 * @private
 * @static
 * @return {string} string naming the platform
 */
ilib._getPlatform = function () {
    if (!ilib._platform) {
        if (typeof(environment) !== 'undefined') {
            ilib._platform = "rhino";
        } else if (typeof(process) !== 'undefined' || typeof(require) !== 'undefined') {
            ilib._platform = "nodejs";
        } else if (typeof(window) !== 'undefined') {
            ilib._platform = (typeof(PalmSystem) !== 'undefined') ? "webos" : "browser";
        } else {
            ilib._platform = "unknown";
        }
    }    
    return ilib._platform;
};

/**
 * If this ilib is running in a browser, return the name of that browser.
 * @private
 * @static
 * @return {string|undefined} the name of the browser that this is running in ("firefox", "chrome", "ie", 
 * "safari", or "opera"), or undefined if this is not running in a browser or if
 * the browser name could not be determined 
 */
ilib._getBrowser = function () {
	var browser = undefined;
	if (ilib._getPlatform() === "browser") {
		if (navigator && navigator.userAgent) {
			if (navigator.userAgent.indexOf("Firefox") > -1) {
				browser = "firefox";
			}
			if (navigator.userAgent.indexOf("Opera") > -1) {
				browser = "opera";
			}
			if (navigator.userAgent.indexOf("Chrome") > -1) {
				browser = "chrome";
			}
			if (navigator.userAgent.indexOf(" .NET") > -1) {
				browser = "ie";
			}
			if (navigator.userAgent.indexOf("Safari") > -1) {
				// chrome also has the string Safari in its userAgent, but the chrome case is 
				// already taken care of above
				browser = "safari";
			}
		}
	}
	return browser;
};

/**
 * Return true if the global variable is defined on this platform.
 * @private
 * @static
 * @return {boolean} true if the global variable is defined on this platform, false otherwise
 */
ilib._isGlobal = function(name) {
    switch (ilib._getPlatform()) {
        case "rhino":
            var top = (function() {
              return (typeof global === 'object') ? global : this;
            })();
            return typeof(top[name]) !== undefined;
        case "nodejs":
            var root = typeof(global) !== 'undefined' ? global : this;
            return root && typeof(root[name]) !== undefined;
            
        default:
            return typeof(window[name]) !== undefined;
    }
};

/**
 * Sets the default locale for all of ilib. This locale will be used
 * when no explicit locale is passed to any ilib class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US". If a type of parameter is string, 
 * ilib will take only well-formed BCP-47 tag  <p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @static
 * @param {string|undefined|null} spec the locale specifier for the default locale
 */
ilib.setLocale = function (spec) {
    if (typeof(spec) === 'string' || !spec) {
        ilib.locale = spec;
    }
    // else ignore other data types, as we don't have the dependencies
    // to look into them to find a locale
};

/**
 * Return the default locale for all of ilib if one has been set. This 
 * locale will be used when no explicit locale is passed to any ilib 
 * class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US".<p>
 * 
 * Depends directive: !depends ilibglobal.js 
 * 
 * @static
 * @return {string} the locale specifier for the default locale
 */
ilib.getLocale = function () {
    if (typeof(ilib.locale) !== 'string') {
        if (typeof(navigator) !== 'undefined' && typeof(navigator.language) !== 'undefined') {
            // running in a browser
            ilib.locale = navigator.language.substring(0,3) + navigator.language.substring(3,5).toUpperCase();  // FF/Opera/Chrome/Webkit
            if (!ilib.locale) {
                // IE on Windows
                var lang = typeof(navigator.browserLanguage) !== 'undefined' ? 
                    navigator.browserLanguage : 
                    (typeof(navigator.userLanguage) !== 'undefined' ? 
                        navigator.userLanguage : 
                        (typeof(navigator.systemLanguage) !== 'undefined' ?
                            navigator.systemLanguage :
                            undefined));
                if (typeof(lang) !== 'undefined' && lang) {
                    // for some reason, MS uses lower case region tags
                    ilib.locale = lang.substring(0,3) + lang.substring(3,5).toUpperCase();
                }
            }
        } else if (typeof(PalmSystem) !== 'undefined' && typeof(PalmSystem.locales) !== 'undefined') {
            // webOS
            if (typeof(PalmSystem.locales.UI) != 'undefined' && PalmSystem.locales.UI.length > 0) {
                ilib.locale = PalmSystem.locales.UI;
            }
        } else if (typeof(environment) !== 'undefined' && typeof(environment.user) !== 'undefined') {
            // running under rhino
            if (typeof(environment.user.language) === 'string' && environment.user.language.length > 0) {
                ilib.locale = environment.user.language;
                if (typeof(environment.user.country) === 'string' && environment.user.country.length > 0) {
                    ilib.locale += '-' + environment.user.country;
                }
            }
        } else if (typeof(process) !== 'undefined' && typeof(process.env) !== 'undefined') {
            // running under nodejs
            var lang = process.env.LANG || process.env.LC_ALL;
            // the LANG variable on unix is in the form "lang_REGION.CHARSET"
            // where language and region are the correct ISO codes separated by
            // an underscore. This translate it back to the BCP-47 form.
            if (lang && lang !== 'undefined') {
                ilib.locale = lang.substring(0,2).toLowerCase() + '-' + lang.substring(3,5).toUpperCase();
            }
        }
             
        ilib.locale = typeof(ilib.locale) === 'string' ? ilib.locale : 'en-US';
    }
    return ilib.locale;
};

/**
 * Sets the default time zone for all of ilib. This time zone will be used when
 * no explicit time zone is passed to any ilib class. If the default time zone
 * is not set, ilib will attempt to use the time zone of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the UTC zone "Etc/UTC".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @static
 * @param {string} tz the name of the time zone to set as the default time zone
 */
ilib.setTimeZone = function (tz) {
    ilib.tz = tz || ilib.tz;
};

/**
 * Return the default time zone for all of ilib if one has been set. This 
 * time zone will be used when no explicit time zone is passed to any ilib 
 * class. If the default time zone
 * is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the zone "local".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @static
 * @return {string} the default time zone for ilib
 */
ilib.getTimeZone = function() {
    if (typeof(ilib.tz) === 'undefined') {
        if (typeof(navigator) !== 'undefined' && typeof(navigator.timezone) !== 'undefined') {
            // running in a browser
            if (navigator.timezone.length > 0) {
                ilib.tz = navigator.timezone;
            }
        } else if (typeof(PalmSystem) !== 'undefined' && typeof(PalmSystem.timezone) !== 'undefined') {
            // running in webkit on webOS
            if (PalmSystem.timezone.length > 0) {
                ilib.tz = PalmSystem.timezone;
            }
        } else if (typeof(environment) !== 'undefined' && typeof(environment.user) !== 'undefined') {
            // running under rhino
            if (typeof(environment.user.timezone) !== 'undefined' && environment.user.timezone.length > 0) {
                ilib.tz = environment.user.timezone;
            }
        } else if (typeof(process) !== 'undefined' && typeof(process.env) !== 'undefined') {
            // running in nodejs
            if (process.env.TZ && process.env.TZ !== "undefined") {
                ilib.tz = process.env.TZ;
            }
        }
        
        ilib.tz = ilib.tz || "local"; 
    }

    return ilib.tz;
};

/**
 * @class
 * Defines the interface for the loader class for ilib. The main method of the
 * loader object is loadFiles(), which loads a set of requested locale data files
 * from where-ever it is stored.
 * @interface
 */
ilib.Loader = function() {};

/**
 * Load a set of files from where-ever it is stored.<p>
 * 
 * This is the main function define a callback function for loading missing locale 
 * data or resources.
 * If this copy of ilib is assembled without including the required locale data
 * or resources, then that data can be lazy loaded dynamically when it is 
 * needed by calling this method. Each ilib class will first
 * check for the existence of data under ilib.data, and if it is not there, 
 * it will attempt to load it by calling this method of the laoder, and then place
 * it there.<p>
 * 
 * Suggested implementations of this method might load files 
 * directly from disk under nodejs or rhino, or within web pages, to load 
 * files from the server with XHR calls.<p>
 * 
 * The first parameter to this method, paths, is an array of relative paths within 
 * the ilib dir structure for the 
 * requested data. These paths will already have the locale spec integrated 
 * into them, so no further tweaking needs to happen to load the data. Simply
 * load the named files. The second
 * parameter tells the loader whether to load the files synchronously or asynchronously.
 * If the sync parameters is false, then the onLoad function must also be specified.
 * The third parameter gives extra parameters to the loader passed from the calling
 * code. This may contain any property/value pairs.  The last parameter, callback,
 * is a callback function to call when all of the data is finishing loading. Make
 * sure to call the callback with the context of "this" so that the caller has their 
 * context back again.<p>
 * 
 * The loader function must be able to operate either synchronously or asychronously. 
 * If the loader function is called with an undefined callback function, it is
 * expected to load the data synchronously, convert it to javascript
 * objects, and return the array of json objects as the return value of the 
 * function. If the loader 
 * function is called with a callback function, it may load the data 
 * synchronously or asynchronously (doesn't matter which) as long as it calls
 * the callback function with the data converted to a javascript objects
 * when it becomes available. If a particular file could not be loaded, the 
 * loader function should put undefined into the corresponding entry in the
 * results array. 
 * Note that it is important that all the data is loaded before the callback
 * is called.<p>
 * 
 * An example implementation for nodejs might be:
 * 
 * <pre>
 * var fs = require("fs");
 * 
 * var myLoader = function() {};
 * myLoader.prototype = new ilib.Loader();
 * myLoader.prototype.constructor = myLoader;
 * myLoader.prototype.loadFiles = function(paths, sync, params, callback) {
 *    if (sync) {
 *        var ret = [];
 *        // synchronous load -- just return the result
 *        paths.forEach(function (path) {
 *            var json = fs.readFileSync(path, "utf-8");
 *            ret.push(json ? JSON.parse(json) : undefined);
 *        });
 *        
 *        return ret;
 *    }
 *    this.callback = callback;
 *
 *    // asynchronous
 *    this.results = [];
 *    this._loadFilesAsync(paths);
 * }
 * myLoader.prototype._loadFilesAsync = function (paths) {
 *    if (paths.length > 0) {
 *        var file = paths.shift();
 *        fs.readFile(file, "utf-8", function(err, json) {
 *            this.results.push(err ? undefined : JSON.parse(json));
 *            // call self recursively so that the callback is only called at the end
 *            // when all the files are loaded sequentially
 *            if (paths.length > 0) {
 *                this._loadFilesAsync(paths);
 *            } else {
 *                this.callback(this.results);
 *            }
 *        });
 *     }
 * }
 * 
 * // bind to "this" so that "this" is relative to your own instance
 * ilib.setLoaderCallback(new myLoader());
 * </pre>

 * @param {Array.<string>} paths An array of paths to load from wherever the files are stored 
 * @param {Boolean} sync if true, load the files synchronously, and false means asynchronously
 * @param {Object} params an object with any extra parameters for the loader. These can be 
 * anything. The caller of the ilib class passes these parameters in. Presumably, the code that
 * calls ilib and the code that provides the loader are together and can have a private 
 * agreement between them about what the parameters should contain.
 * @param {function(Object)} callback function to call when the files are all loaded. The 
 * parameter of the callback function is the contents of the files.
 */
ilib.Loader.prototype.loadFiles = function (paths, sync, params, callback) {};

/**
 * Return all files available for loading using this loader instance.
 * This method returns an object where the properties are the paths to
 * directories where files are loaded from and the values are an array
 * of strings containing the relative paths under the directory of each
 * file that can be loaded.<p>
 * 
 * Example:
 *  <pre>
 *  {
 *      "/usr/share/javascript/ilib/locale": [
 *          "dateformats.json",
 *          "aa/dateformats.json",
 *          "af/dateformats.json",
 *          "agq/dateformats.json",
 *          "ak/dateformats.json",
 *          ...
 *          "zxx/dateformats.json"
 *      ]
 *  }
 *  </pre>
 * @returns {Object} a hash containing directory names and
 * paths to file that can be loaded by this loader 
 */
ilib.Loader.prototype.listAvailableFiles = function() {};

/**
 * Return true if the file in the named path is available for loading using
 * this loader. The path may be given as an absolute path, in which case
 * only that file is checked, or as a relative path, in which case, the
 * relative path may appear underneath any of the directories that the loader
 * knows about.
 * @returns {boolean} true if the file in the named path is available for loading, and
 * false otherwise
 */
ilib.Loader.prototype.isAvailable = function(path) {};

/**
 * Set the custom loader used to load ilib's locale data in your environment. 
 * The instance passed in must implement the ilib.Loader interface. See the
 * ilib.Loader class documentation for more information about loaders. 
 * 
 * @static
 * @param {ilib.Loader} loader class to call to access the requested data.
 * @return {boolean} true if the loader was installed correctly, or false
 * if not
 */
ilib.setLoaderCallback = function(loader) {
    // only a basic check
    if ((typeof(loader) === 'object' && loader instanceof ilib.Loader) || 
            typeof(loader) === 'function' || typeof(loader) === 'undefined') {
        // console.log("setting callback loader to " + (loader ? loader.name : "undefined"));
        ilib._load = loader;
        return true;
    }
    return false;
};

/*
 * locale.js - Locale specifier definition
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

/**
 * @class
 * Create a new locale instance. Locales are specified either with a specifier string 
 * that follows the BCP-47 convention (roughly: "language-region-script-variant") or 
 * with 4 parameters that specify the language, region, variant, and script individually.<p>
 * 
 * The language is given as an ISO 639-1 two-letter, lower-case language code. You
 * can find a full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes</a><p>
 * 
 * The region is given as an ISO 3166-1 two-letter, upper-case region code. You can
 * find a full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2</a>.<p>
 * 
 * The variant is any string that does not contain a dash which further differentiates
 * locales from each other.<p>
 * 
 * The script is given as the ISO 15924 four-letter script code. In some locales,
 * text may be validly written in more than one script. For example, Serbian is often
 * written in both Latin and Cyrillic, though not usually mixed together. You can find a
 * full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/ISO_15924#List_of_codes">http://en.wikipedia.org/wiki/ISO_15924#List_of_codes</a>.<p>
 * 
 * As an example in ilib, the script can be used in the date formatter. Dates formatted 
 * in Serbian could have day-of-week names or month names written in the Latin
 * or Cyrillic script. Often one script is default such that sr-SR-Latn is the same
 * as sr-SR so the script code "Latn" can be left off of the locale spec.<p> 
 * 
 * Each part is optional, and an empty string in the specifier before or after a 
 * dash or as a parameter to the constructor denotes an unspecified value. In this
 * case, many of the ilib functions will treat the locale as generic. For example
 * the locale "en-" is equivalent to "en" and to "en--" and denotes a locale
 * of "English" with an unspecified region and variant, which typically matches
 * any region or variant.<p>
 * 
 * Without any arguments to the constructor, this function returns the locale of
 * the host Javascript engine.<p>
 * 
 * Depends directive: !depends locale.js
 * 
 * @constructor
 * @param {?string|ilib.Locale=} language the ISO 639 2-letter code for the language, or a full 
 * locale spec in BCP-47 format, or another ilib.Locale instance to copy from
 * @param {string=} region the ISO 3166 2-letter code for the region
 * @param {string=} variant the name of the variant of this locale, if any
 * @param {string=} script the ISO 15924 code of the script for this locale, if any
 */
ilib.Locale = function(language, region, variant, script) {
	if (typeof(region) === 'undefined') {
		var spec = language || ilib.getLocale();

		if (typeof(spec) === 'string') {
			var parts = spec.split('-');


	        for ( var i = 0; i < parts.length; i++ ) {
	        	if (ilib.Locale._isLanguageCode(parts[i])) {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.language = parts[i];
	        	} else if (ilib.Locale._isRegionCode(parts[i])) {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.region = parts[i];
	        	} else if (ilib.Locale._isScriptCode(parts[i])) {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.script = parts[i];
	        	} else {
	    			/** 
	    			 * @private
	    			 * @type {string|undefined}
	    			 */
	        		this.variant = parts[i];
	        	}
	        }
	        this.language = this.language || undefined;
	        this.region = this.region || undefined;
	        this.script = this.script || undefined;
	        this.variant = this.variant || undefined;
		} else if (typeof(spec) === 'object') {
	        this.language = spec.language || undefined;
	        this.region = spec.region || undefined;
	        this.script = spec.script || undefined;
	        this.variant = spec.variant || undefined;
		}
	} else {
		if (language) {
			language = language.trim();
			this.language = language.length > 0 ? language.toLowerCase() : undefined;
		} else {
			this.language = undefined;
		}
		if (region) {
			region = region.trim();
			this.region = region.length > 0 ? region.toUpperCase() : undefined;
		} else {
			this.region = undefined;
		}
		if (variant) {
			variant = variant.trim();
			this.variant = variant.length > 0 ? variant : undefined;
		} else {
			this.variant = undefined;
		}
		if (script) {
			script = script.trim();
			this.script = script.length > 0 ? script : undefined;
		} else {
			this.script = undefined;
		}
	}
	this._genSpec();
};

// from http://en.wikipedia.org/wiki/ISO_3166-1
ilib.Locale.a2toa3regmap = {
	"AF": "AFG",
	"AX": "ALA",
	"AL": "ALB",
	"DZ": "DZA",
	"AS": "ASM",
	"AD": "AND",
	"AO": "AGO",
	"AI": "AIA",
	"AQ": "ATA",
	"AG": "ATG",
	"AR": "ARG",
	"AM": "ARM",
	"AW": "ABW",
	"AU": "AUS",
	"AT": "AUT",
	"AZ": "AZE",
	"BS": "BHS",
	"BH": "BHR",
	"BD": "BGD",
	"BB": "BRB",
	"BY": "BLR",
	"BE": "BEL",
	"BZ": "BLZ",
	"BJ": "BEN",
	"BM": "BMU",
	"BT": "BTN",
	"BO": "BOL",
	"BQ": "BES",
	"BA": "BIH",
	"BW": "BWA",
	"BV": "BVT",
	"BR": "BRA",
	"IO": "IOT",
	"BN": "BRN",
	"BG": "BGR",
	"BF": "BFA",
	"BI": "BDI",
	"KH": "KHM",
	"CM": "CMR",
	"CA": "CAN",
	"CV": "CPV",
	"KY": "CYM",
	"CF": "CAF",
	"TD": "TCD",
	"CL": "CHL",
	"CN": "CHN",
	"CX": "CXR",
	"CC": "CCK",
	"CO": "COL",
	"KM": "COM",
	"CG": "COG",
	"CD": "COD",
	"CK": "COK",
	"CR": "CRI",
	"CI": "CIV",
	"HR": "HRV",
	"CU": "CUB",
	"CW": "CUW",
	"CY": "CYP",
	"CZ": "CZE",
	"DK": "DNK",
	"DJ": "DJI",
	"DM": "DMA",
	"DO": "DOM",
	"EC": "ECU",
	"EG": "EGY",
	"SV": "SLV",
	"GQ": "GNQ",
	"ER": "ERI",
	"EE": "EST",
	"ET": "ETH",
	"FK": "FLK",
	"FO": "FRO",
	"FJ": "FJI",
	"FI": "FIN",
	"FR": "FRA",
	"GF": "GUF",
	"PF": "PYF",
	"TF": "ATF",
	"GA": "GAB",
	"GM": "GMB",
	"GE": "GEO",
	"DE": "DEU",
	"GH": "GHA",
	"GI": "GIB",
	"GR": "GRC",
	"GL": "GRL",
	"GD": "GRD",
	"GP": "GLP",
	"GU": "GUM",
	"GT": "GTM",
	"GG": "GGY",
	"GN": "GIN",
	"GW": "GNB",
	"GY": "GUY",
	"HT": "HTI",
	"HM": "HMD",
	"VA": "VAT",
	"HN": "HND",
	"HK": "HKG",
	"HU": "HUN",
	"IS": "ISL",
	"IN": "IND",
	"ID": "IDN",
	"IR": "IRN",
	"IQ": "IRQ",
	"IE": "IRL",
	"IM": "IMN",
	"IL": "ISR",
	"IT": "ITA",
	"JM": "JAM",
	"JP": "JPN",
	"JE": "JEY",
	"JO": "JOR",
	"KZ": "KAZ",
	"KE": "KEN",
	"KI": "KIR",
	"KP": "PRK",
	"KR": "KOR",
	"KW": "KWT",
	"KG": "KGZ",
	"LA": "LAO",
	"LV": "LVA",
	"LB": "LBN",
	"LS": "LSO",
	"LR": "LBR",
	"LY": "LBY",
	"LI": "LIE",
	"LT": "LTU",
	"LU": "LUX",
	"MO": "MAC",
	"MK": "MKD",
	"MG": "MDG",
	"MW": "MWI",
	"MY": "MYS",
	"MV": "MDV",
	"ML": "MLI",
	"MT": "MLT",
	"MH": "MHL",
	"MQ": "MTQ",
	"MR": "MRT",
	"MU": "MUS",
	"YT": "MYT",
	"MX": "MEX",
	"FM": "FSM",
	"MD": "MDA",
	"MC": "MCO",
	"MN": "MNG",
	"ME": "MNE",
	"MS": "MSR",
	"MA": "MAR",
	"MZ": "MOZ",
	"MM": "MMR",
	"NA": "NAM",
	"NR": "NRU",
	"NP": "NPL",
	"NL": "NLD",
	"NC": "NCL",
	"NZ": "NZL",
	"NI": "NIC",
	"NE": "NER",
	"NG": "NGA",
	"NU": "NIU",
	"NF": "NFK",
	"MP": "MNP",
	"NO": "NOR",
	"OM": "OMN",
	"PK": "PAK",
	"PW": "PLW",
	"PS": "PSE",
	"PA": "PAN",
	"PG": "PNG",
	"PY": "PRY",
	"PE": "PER",
	"PH": "PHL",
	"PN": "PCN",
	"PL": "POL",
	"PT": "PRT",
	"PR": "PRI",
	"QA": "QAT",
	"RE": "REU",
	"RO": "ROU",
	"RU": "RUS",
	"RW": "RWA",
	"BL": "BLM",
	"SH": "SHN",
	"KN": "KNA",
	"LC": "LCA",
	"MF": "MAF",
	"PM": "SPM",
	"VC": "VCT",
	"WS": "WSM",
	"SM": "SMR",
	"ST": "STP",
	"SA": "SAU",
	"SN": "SEN",
	"RS": "SRB",
	"SC": "SYC",
	"SL": "SLE",
	"SG": "SGP",
	"SX": "SXM",
	"SK": "SVK",
	"SI": "SVN",
	"SB": "SLB",
	"SO": "SOM",
	"ZA": "ZAF",
	"GS": "SGS",
	"SS": "SSD",
	"ES": "ESP",
	"LK": "LKA",
	"SD": "SDN",
	"SR": "SUR",
	"SJ": "SJM",
	"SZ": "SWZ",
	"SE": "SWE",
	"CH": "CHE",
	"SY": "SYR",
	"TW": "TWN",
	"TJ": "TJK",
	"TZ": "TZA",
	"TH": "THA",
	"TL": "TLS",
	"TG": "TGO",
	"TK": "TKL",
	"TO": "TON",
	"TT": "TTO",
	"TN": "TUN",
	"TR": "TUR",
	"TM": "TKM",
	"TC": "TCA",
	"TV": "TUV",
	"UG": "UGA",
	"UA": "UKR",
	"AE": "ARE",
	"GB": "GBR",
	"US": "USA",
	"UM": "UMI",
	"UY": "URY",
	"UZ": "UZB",
	"VU": "VUT",
	"VE": "VEN",
	"VN": "VNM",
	"VG": "VGB",
	"VI": "VIR",
	"WF": "WLF",
	"EH": "ESH",
	"YE": "YEM",
	"ZM": "ZMB",
	"ZW": "ZWE"
};


ilib.Locale.a1toa3langmap = {
	"ab": "abk",
	"aa": "aar",
	"af": "afr",
	"ak": "aka",
	"sq": "sqi",
	"am": "amh",
	"ar": "ara",
	"an": "arg",
	"hy": "hye",
	"as": "asm",
	"av": "ava",
	"ae": "ave",
	"ay": "aym",
	"az": "aze",
	"bm": "bam",
	"ba": "bak",
	"eu": "eus",
	"be": "bel",
	"bn": "ben",
	"bh": "bih",
	"bi": "bis",
	"bs": "bos",
	"br": "bre",
	"bg": "bul",
	"my": "mya",
	"ca": "cat",
	"ch": "cha",
	"ce": "che",
	"ny": "nya",
	"zh": "zho",
	"cv": "chv",
	"kw": "cor",
	"co": "cos",
	"cr": "cre",
	"hr": "hrv",
	"cs": "ces",
	"da": "dan",
	"dv": "div",
	"nl": "nld",
	"dz": "dzo",
	"en": "eng",
	"eo": "epo",
	"et": "est",
	"ee": "ewe",
	"fo": "fao",
	"fj": "fij",
	"fi": "fin",
	"fr": "fra",
	"ff": "ful",
	"gl": "glg",
	"ka": "kat",
	"de": "deu",
	"el": "ell",
	"gn": "grn",
	"gu": "guj",
	"ht": "hat",
	"ha": "hau",
	"he": "heb",
	"hz": "her",
	"hi": "hin",
	"ho": "hmo",
	"hu": "hun",
	"ia": "ina",
	"id": "ind",
	"ie": "ile",
	"ga": "gle",
	"ig": "ibo",
	"ik": "ipk",
	"io": "ido",
	"is": "isl",
	"it": "ita",
	"iu": "iku",
	"ja": "jpn",
	"jv": "jav",
	"kl": "kal",
	"kn": "kan",
	"kr": "kau",
	"ks": "kas",
	"kk": "kaz",
	"km": "khm",
	"ki": "kik",
	"rw": "kin",
	"ky": "kir",
	"kv": "kom",
	"kg": "kon",
	"ko": "kor",
	"ku": "kur",
	"kj": "kua",
	"la": "lat",
	"lb": "ltz",
	"lg": "lug",
	"li": "lim",
	"ln": "lin",
	"lo": "lao",
	"lt": "lit",
	"lu": "lub",
	"lv": "lav",
	"gv": "glv",
	"mk": "mkd",
	"mg": "mlg",
	"ms": "msa",
	"ml": "mal",
	"mt": "mlt",
	"mi": "mri",
	"mr": "mar",
	"mh": "mah",
	"mn": "mon",
	"na": "nau",
	"nv": "nav",
	"nb": "nob",
	"nd": "nde",
	"ne": "nep",
	"ng": "ndo",
	"nn": "nno",
	"no": "nor",
	"ii": "iii",
	"nr": "nbl",
	"oc": "oci",
	"oj": "oji",
	"cu": "chu",
	"om": "orm",
	"or": "ori",
	"os": "oss",
	"pa": "pan",
	"pi": "pli",
	"fa": "fas",
	"pl": "pol",
	"ps": "pus",
	"pt": "por",
	"qu": "que",
	"rm": "roh",
	"rn": "run",
	"ro": "ron",
	"ru": "rus",
	"sa": "san",
	"sc": "srd",
	"sd": "snd",
	"se": "sme",
	"sm": "smo",
	"sg": "sag",
	"sr": "srp",
	"gd": "gla",
	"sn": "sna",
	"si": "sin",
	"sk": "slk",
	"sl": "slv",
	"so": "som",
	"st": "sot",
	"az": "azb",
	"es": "spa",
	"su": "sun",
	"sw": "swa",
	"ss": "ssw",
	"sv": "swe",
	"ta": "tam",
	"te": "tel",
	"tg": "tgk",
	"th": "tha",
	"ti": "tir",
	"bo": "bod",
	"tk": "tuk",
	"tl": "tgl",
	"tn": "tsn",
	"to": "ton",
	"tr": "tur",
	"ts": "tso",
	"tt": "tat",
	"tw": "twi",
	"ty": "tah",
	"ug": "uig",
	"uk": "ukr",
	"ur": "urd",
	"uz": "uzb",
	"ve": "ven",
	"vi": "vie",
	"vo": "vol",
	"wa": "wln",
	"cy": "cym",
	"wo": "wol",
	"fy": "fry",
	"xh": "xho",
	"yi": "yid",
	"yo": "yor",
	"za": "zha",
	"zu": "zul"
};

/**
 * Tell whether or not the str does not start with a lower case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is not a lower case ASCII char
 */
ilib.Locale._notLower = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 97 || ch > 122;
};

/**
 * Tell whether or not the str does not start with an upper case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
ilib.Locale._notUpper = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 65 || ch > 90;
};

/**
 * Tell whether or not the str does not start with a digit char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
ilib.Locale._notDigit = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 48 || ch > 57;
};

/**
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
ilib.Locale._isLanguageCode = function(str) {
	if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
		return false;
	}

	for (var i = 0; i < str.length; i++) {
		if (ilib.Locale._notLower(str.charAt(i))) {
			return false;
		}
	}
	
	return true;
};

/**
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 3166 2-letter region code or M.49 3-digit region code.
 * 
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
ilib.Locale._isRegionCode = function (str) {
	if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
		return false;
	}
	
	if (str.length === 2) {
		for (var i = 0; i < str.length; i++) {
			if (ilib.Locale._notUpper(str.charAt(i))) {
				return false;
			}
		}
	} else {
		for (var i = 0; i < str.length; i++) {
			if (ilib.Locale._notDigit(str.charAt(i))) {
				return false;
			}
		}
	}
	
	return true;
};

/**
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
ilib.Locale._isScriptCode = function(str)
{
	if (typeof(str) === 'undefined' || str.length !== 4 || ilib.Locale._notUpper(str.charAt(0))) {
		return false;
	}
	
	for (var i = 1; i < 4; i++) {
		if (ilib.Locale._notLower(str.charAt(i))) {
			return false;
		}
	}
	
	return true;
};

/**
 * Return the ISO-3166 alpha3 equivalent region code for the given ISO 3166 alpha2
 * region code. If the given alpha2 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha2 the alpha2 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha2 code, or the alpha2
 * parameter if the alpha2 value is not found
 */
ilib.Locale.regionAlpha2ToAlpha3 = function(alpha2) {
	return ilib.Locale.a2toa3regmap[alpha2] || alpha2;
};

/**
 * Return the ISO-639 alpha3 equivalent language code for the given ISO 639 alpha1
 * language code. If the given alpha1 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha1 the alpha1 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha1 code, or the alpha1
 * parameter if the alpha1 value is not found
 */
ilib.Locale.languageAlpha1ToAlpha3 = function(alpha1) {
	return ilib.Locale.a1toa3langmap[alpha1] || alpha1;
};

ilib.Locale.prototype = {
	/**
	 * @private
	 */
	_genSpec: function () {
		this.spec = this.language || "";
		
		if (this.script) {
			if (this.spec.length > 0) {
				this.spec += "-";
			}
			this.spec += this.script;
		}
		
		if (this.region) {
			if (this.spec.length > 0) {
				this.spec += "-";
			}
			this.spec += this.region;
		}
		
		if (this.variant) {
			if (this.spec.length > 0) {
				this.spec += "-";
			}
			this.spec += this.variant;
		}
	},

	/**
	 * Return the ISO 639 language code for this locale. 
	 * @return {string|undefined} the language code for this locale 
	 */
	getLanguage: function() {
		return this.language;
	},
	
	/**
	 * Return the language of this locale as an ISO-639-alpha3 language code
	 * @return {string|undefined} the alpha3 language code of this locale
	 */
	getLanguageAlpha3: function() {
		return ilib.Locale.languageAlpha1ToAlpha3(this.language);
	},
	
	/**
	 * Return the ISO 3166 region code for this locale.
	 * @return {string|undefined} the region code of this locale
	 */
	getRegion: function() {
		return this.region;
	},
	
	/**
	 * Return the region of this locale as an ISO-3166-alpha3 region code
	 * @return {string|undefined} the alpha3 region code of this locale
	 */
	getRegionAlpha3: function() {
		return ilib.Locale.regionAlpha2ToAlpha3(this.region);
	},
	
	/**
	 * Return the ISO 15924 script code for this locale
	 * @return {string|undefined} the script code of this locale
	 */
	getScript: function () {
		return this.script;
	},
	
	/**
	 * Return the variant code for this locale
	 * @return {string|undefined} the variant code of this locale, if any
	 */
	getVariant: function() {
		return this.variant;
	},
	
	/**
	 * Return the whole locale specifier as a string.
	 * @return {string} the locale specifier
	 */
	getSpec: function() {
		return this.spec;
	},
	
	/**
	 * Express this locale object as a string. Currently, this simply calls the getSpec
	 * function to represent the locale as its specifier.
	 * 
	 * @return {string} the locale specifier
	 */
	toString: function() {
		return this.getSpec();
	},
	
	/**
	 * Return true if the the other locale is exactly equal to the current one.
	 * @return {boolean} whether or not the other locale is equal to the current one 
	 */
	equals: function(other) {
		return this.language === other.language &&
			this.region === other.region &&
			this.script === other.script &&
			this.variant === other.variant;
	},

	/**
	 * Return true if the current locale is the special pseudo locale.
	 * @return {boolean} true if the current locale is the special pseudo locale
	 */
	isPseudo: function () {
		var localeName = this.language + "-" + this.region;
		return ilib.pseudoLocales.indexOf(localeName) > -1;
	}
};

// static functions
/**
 * @private
 */
ilib.Locale.locales = [
	"en-US","en-GB","de-DE","es-ES","it-IT","fr-FR","fr-CA","pt-BR","ko-KR","zh-Hans-CN","ja-JP","ru-RU"
];

/**
 * Return the list of available locales that this iLib file was assembled
 * with. The list that this file was assembled with may be much smaller
 * than the list of all available locales in the iLib repository. The
 * assembly tool will automatically fill in the list.
 * 
 * @return {Array.<string>} this is an array of locale specs for which 
 * this iLib file has locale data for
 */
ilib.Locale.getAvailableLocales = function () {
	return ilib.Locale.locales;
};

ilib.data.localeinfo = {"calendar":"gregorian","clock":"24","currency":"USD","delimiter":{"quotationStart":"“","quotationEnd":"”","alternateQuotationStart":"‘","alternateQuotationEnd":"’"},"firstDayOfWeek":1,"numfmt":{"script":"Latn","decimalChar":",","groupChar":".","prigroupSize":3,"pctFmt":"{n}%","pctChar":"%","roundingMode":"halfdown","exponential":"e","currencyFormats":{"common":"{s}{n}","commonNegative":"{s}-{n}"}},"timezone":"Etc/UTC","units":"metric","weekendEnd":0,"weekendStart":6};
ilib.data.localeinfo_en = {"clock":"12","language.name":"English","numfmt":{"decimalChar":".","groupChar":",","currencyFormats":{"commonNegative":"({s}{n})"}},"scripts":["Latn","Dsrt","Shaw"],"locale":"en"};
ilib.data.localeinfo_US = {"currency":"USD","firstDayOfWeek":0,"paperSizes":{"regular":"8x11"},"region.name":"United States","timezone":"America/New_York","units":"uscustomary","locale":"US"};
ilib.data.localeinfo_en_GB = {"clock":"24","locale":"en-GB"};
ilib.data.localeinfo_GB = {"currency":"GBP","firstDayOfWeek":1,"paperSizes":{"regular":"A4","photo":"24x16"},"region.name":"United Kingdom","timezone":"Europe/London","units":"imperial","locale":"GB"};
ilib.data.localeinfo_de = {"delimiter":{"quotationStart":"„","quotationEnd":"“","alternateQuotationStart":"‚","alternateQuotationEnd":"‘"},"language.name":"German","numfmt":{"exponential":"E","currencyFormats":{"common":"{n} {s}"},"pctFmt":"{n} %"},"paperSizes":{"regular":"A4","photo":"4x6"},"scripts":["Latn","Runr"],"locale":"de"};
ilib.data.localeinfo_DE = {"currency":"EUR","firstDayOfWeek":1,"region.name":"Germany","timezone":"Europe/Berlin","locale":"DE"};
ilib.data.localeinfo_es = {"delimiter":{"alternateQuotationStart":"«","alternateQuotationEnd":"»"},"language.name":"Spanish","numfmt":{"exponential":"E","currencyFormats":{"common":"{n} {s}"}},"paperSizes":{"regular":"A4","photo":"4x6"},"scripts":["Latn"],"locale":"es"};
ilib.data.localeinfo_ES = {"currency":"EUR","firstDayOfWeek":1,"region.name":"Spain","timezone":"Europe/Madrid","locale":"ES"};
ilib.data.localeinfo_it = {"delimiter":{"quotationStart":"«","quotationEnd":"»","alternateQuotationStart":"“","alternateQuotationEnd":"”"},"language.name":"Italian","numfmt":{"exponential":"E","currencyFormats":{"common":"{s} {n}"}},"paperSizes":{"regular":"A4","photo":"4x6"},"scripts":["Latn"],"locale":"it"};
ilib.data.localeinfo_IT = {"currency":"EUR","firstDayOfWeek":1,"region.name":"Italy","timezone":"Europe/Rome","locale":"IT"};
ilib.data.localeinfo_fr = {"delimiter":{"quotationStart":"«","quotationEnd":"»","alternateQuotationStart":"«","alternateQuotationEnd":"»"},"language.name":"French","numfmt":{"groupChar":" ","exponential":"E","currencyFormats":{"common":"{n} {s}","commonNegative":"({n} {s})"},"pctFmt":"{n} %"},"paperSizes":{"regular":"A4","photo":"4x6"},"scripts":["Latn"],"locale":"fr"};
ilib.data.localeinfo_FR = {"currency":"EUR","firstDayOfWeek":1,"region.name":"France","timezone":"Europe/Paris","locale":"FR"};
ilib.data.localeinfo_fr_CA = {"delimiter":{"alternateQuotationStart":"‹","alternateQuotationEnd":"›"},"paperSizes":{"regular":"8x11","photo":"3x5"},"locale":"fr-CA"};
ilib.data.localeinfo_CA = {"currency":"CAD","firstDayOfWeek":0,"paperSizes":{"regular":"8x11"},"region.name":"Canada","timezone":"America/Toronto","locale":"CA"};
ilib.data.localeinfo_pt = {"language.name":"Portuguese","numfmt":{"exponential":"E","currencyFormats":{"commonNegative":"({s}{n})"}},"scripts":["Latn"],"locale":"pt"};
ilib.data.localeinfo_BR = {"currency":"BRL","firstDayOfWeek":0,"region.name":"Brazil","timezone":"America/Sao_Paulo","locale":"BR"};
ilib.data.localeinfo_ko = {"clock":"12","language.name":"Korean","numfmt":{"decimalChar":".","groupChar":",","exponential":"E","currencyFormats":{"commonNegative":"({s}{n})"}},"paperSizes":{"regular":"A4","photo":"3R"},"scripts":["Kore"],"locale":"ko"};
ilib.data.localeinfo_KR = {"currency":"KRW","firstDayOfWeek":0,"region.name":"South Korea","timezone":"Asia/Seoul","locale":"KR"};
ilib.data.localeinfo_zh = {"clock":"12","language.name":"Chinese","native_numfmt":{"script":"Hani","decimalChar":".","groupChar":",","pctChar":"%","exponential":"E","prigroupSize":3,"currencyFormats":{"common":"{s}{n}","commonNegative":"({s}{n})"},"pctFmt":"{n}%","roundingMode":"halfdown","useNative":true,"digits":"〇一二三四五六七八九"},"numfmt":{"decimalChar":".","groupChar":",","exponential":"E","useNative":false,"currencyFormats":{"commonNegative":"({s}{n})"}},"scripts":["Hans","Hant","Bopo","Phag"],"locale":"zh"};
ilib.data.localeinfo_CN = {"currency":"CNY","firstDayOfWeek":0,"region.name":"China","timezone":"Asia/Shanghai","locale":"CN"};
ilib.data.localeinfo_ja = {"delimiter":{"quotationStart":"「","quotationEnd":"」","alternateQuotationStart":"『","alternateQuotationEnd":"』"},"language.name":"Japanese","numfmt":{"decimalChar":".","groupChar":",","exponential":"E"},"paperSizes":{"regular":"A4","photo":"L"},"scripts":["Jpan"],"locale":"ja"};
ilib.data.localeinfo_JP = {"currency":"JPY","firstDayOfWeek":0,"region.name":"Japan","timezone":"Asia/Tokyo","locale":"JP"};
ilib.data.localeinfo_ru = {"delimiter":{"quotationStart":"«","quotationEnd":"»","alternateQuotationStart":"„","alternateQuotationEnd":"“"},"language.name":"Russian","numfmt":{"groupChar":" ","exponential":"E","currencyFormats":{"common":"{n} {s}"},"pctFmt":"{n} %"},"scripts":["Cyrl"],"locale":"ru"};
ilib.data.localeinfo_RU = {"currency":"RUB","firstDayOfWeek":1,"region.name":"Russia","timezone":"Europe/Moscow","locale":"RU"};
/*
 * localeinfo.js - Encode locale-specific defaults
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js

// !data localeinfo

/**
 * @class
 * Create a new locale info instance. Locale info instances give information about
 * the default settings for a particular locale. These settings may be overridden
 * by various parts of the code, and should be used as a fall-back setting of last
 * resort. <p>
 * 
 * The optional options object holds extra parameters if they are necessary. The
 * current list of supported options are:
 * 
 * <ul>
 * <li><i>onLoad</i> - a callback function to call when the locale info object is fully 
 * loaded. When the onLoad option is given, the localeinfo object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * If this copy of ilib is pre-assembled and all the data is already available, 
 * or if the data was already previously loaded, then this constructor will call
 * the onLoad callback immediately when the initialization is done. 
 * If the onLoad option is not given, this class will only attempt to load any
 * missing locale data synchronously.
 * 
 * Depends directive: !depends localeinfo.js
 * 
 * @constructor
 * @see {ilib.setLoaderCallback} for information about registering a loader callback
 * function
 * @param {ilib.Locale|string=} locale the locale for which the info is sought, or undefined for
 * @param {Object=} options the locale for which the info is sought, or undefined for
 * the current locale
 */
ilib.LocaleInfo = function(locale, options) {
	var sync = true,
	    loadParams = undefined;
	
	/* these are all the defaults. Essentially, en-US */
	/**
	  @private 
	  @type {{
		scripts:Array.<string>,
		timezone:string,
		units:string,
		calendar:string,
		clock:string,
		currency:string,
		firstDayOfWeek:number,
		weekendStart:number,
		weekendEnd:number,
		meridiems:string,
		unitfmt: {long:string,short:string},
		numfmt:Object.<{
			currencyFormats:Object.<{common:string,commonNegative:string,iso:string,isoNegative:string}>,
			script:string,
			decimalChar:string,
			groupChar:string,
			prigroupSize:number,
			secgroupSize:number,
			negativenumFmt:string,
			pctFmt:string,
			negativepctFmt:string,
			pctChar:string,
			roundingMode:string,
			exponential:string,
			digits:string
		}>
	  }}
	*/
	this.info = ilib.LocaleInfo.defaultInfo;
	
	switch (typeof(locale)) {
		case "string":
			this.locale = new ilib.Locale(locale);
			break;
		default:
		case "undefined":
			this.locale = new ilib.Locale();
			break;
		case "object":
			this.locale = locale;
			break;
	}
	
	if (options) {
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}

	if (!ilib.LocaleInfo.cache) {
		ilib.LocaleInfo.cache = {};
	}

	ilib.loadData({
		object: ilib.LocaleInfo, 
		locale: this.locale, 
		name: "localeinfo.json", 
		sync: sync, 
		loadParams: loadParams, 
		callback: ilib.bind(this, function (info) {
			if (!info) {
				info = ilib.LocaleInfo.defaultInfo;
				var spec = this.locale.getSpec().replace(/-/g, "_");
				ilib.LocaleInfo.cache[spec] = info;
			}
			this.info = info;
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

ilib.LocaleInfo.defaultInfo = /** @type {{
	scripts:Array.<string>,
	timezone:string,
	units:string,
	calendar:string,
	clock:string,
	currency:string,
	firstDayOfWeek:number,
	weekendStart:number,
	weekendEnd:number,
	meridiems:string,
	unitfmt: {long:string,short:string},
	numfmt:Object.<{
		currencyFormats:Object.<{
			common:string,
			commonNegative:string,
			iso:string,
			isoNegative:string
		}>,
		script:string,
		decimalChar:string,
		groupChar:string,
		prigroupSize:number,
		secgroupSize:number,
		negativenumFmt:string,
		pctFmt:string,
		negativepctFmt:string,
		pctChar:string,
		roundingMode:string,
		exponential:string,
		digits:string
	}>
}}*/ ilib.data.localeinfo;
ilib.LocaleInfo.defaultInfo = ilib.LocaleInfo.defaultInfo || {
	"scripts": ["Latn"],
    "timezone": "Etc/UTC",
    "units": "metric",
    "calendar": "gregorian",
    "clock": "24",
    "currency": "USD",
    "firstDayOfWeek": 1,
    "meridiems": "gregorian",
    "numfmt": {
        "currencyFormats": {
            "common": "{s}{n}",
            "commonNegative": "{s}-{n}",
            "iso": "{s}{n}",
            "isoNegative": "{s}-{n}"
        },
        "script": "Latn",
        "decimalChar": ",",
        "groupChar": ".",
        "prigroupSize": 3,
        "secgroupSize": 0,
        "pctFmt": "{n}%",
        "negativepctFmt": "-{n}%",
        "pctChar": "%",
        "roundingMode": "halfdown",
        "exponential": "e",
        "digits": ""
    }
};

ilib.LocaleInfo.prototype = {
    /**
     * Return the name of the locale's language in English.
     * @returns {string} the name of the locale's language in English
     */
    getLanguageName: function () {
    	return this.info["language.name"];	
    },
    
    /**
     * Return the name of the locale's region in English. If the locale
     * has no region, this returns undefined.
     * 
     * @returns {string|undefined} the name of the locale's region in English
     */
    getRegionName: function () {
    	return this.info["region.name"];	
    },

    /**
	 * Return whether this locale commonly uses the 12- or the 24-hour clock.
	 *  
	 * @returns {string} "12" if the locale commonly uses a 12-hour clock, or "24"
	 * if the locale commonly uses a 24-hour clock. 
	 */
	getClock: function() {
		return this.info.clock;
	},

	/**
	 * Return the locale that this info object was created with.
	 * @returns {ilib.Locale} The locale spec of the locale used to construct this info instance
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the name of the measuring system that is commonly used in the given locale.
	 * Valid values are "uscustomary", "imperial", and "metric".
	 * 
	 * @returns {string} The name of the measuring system commonly used in the locale
	 */
	getUnits: function () {
		return this.info.units;
	},
        
        getUnitFormat: function () {
                return this.info.unitfmt;
        },
	
	/**
	 * Return the name of the calendar that is commonly used in the given locale.
	 * 
	 * @returns {string} The name of the calendar commonly used in the locale
	 */
	getCalendar: function () {
		return this.info.calendar;
	},
	
	/**
	 * Return the day of week that starts weeks in the current locale. Days are still
	 * numbered the standard way with 0 for Sunday through 6 for Saturday, but calendars 
	 * should be displayed and weeks calculated with the day of week returned from this 
	 * function as the first day of the week.
	 * 
	 * @returns {number} the day of the week that starts weeks in the current locale.
	 */
	getFirstDayOfWeek: function () {
		return this.info.firstDayOfWeek;
	},
	
	/**
	 * Return the day of week that starts weekend in the current locale. Days are still
	 * numbered the standard way with 0 for Sunday through 6 for Saturday.
	 * 
	 * @returns {number} the day of the week that starts weeks in the current locale.
	 */
	getWeekEndStart: function () {
		return this.info.weekendStart;
	},

	/**
	 * Return the day of week that starts weekend in the current locale. Days are still
	 * numbered the standard way with 0 for Sunday through 6 for Saturday.
	 * 
	 * @returns {number} the day of the week that starts weeks in the current locale.
	 */
	getWeekEndEnd: function () {
		return this.info.weekendEnd;
	},

	/**
	 * Return the default time zone for this locale. Many locales span across multiple
	 * time zones. In this case, the time zone with the largest population is chosen
	 * to represent the locale. This is obviously not that accurate, but then again,
	 * this method's return value should only be used as a default anyways.
	 * @returns {string} the default time zone for this locale.
	 */
	getTimeZone: function () {
		return this.info.timezone;
	},
	
	/**
	 * Return the decimal separator for formatted numbers in this locale.
	 * @returns {string} the decimal separator char
	 */
	getDecimalSeparator: function () {
		return this.info.numfmt.decimalChar;
	},
	
	/**
	 * Return the decimal separator for formatted numbers in this locale for native script.
	 * @returns {string} the decimal separator char
	 */
	getNativeDecimalSeparator: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.decimalChar) || this.info.numfmt.decimalChar;
	},
	
	/**
	 * Return the separator character used to separate groups of digits on the 
	 * integer side of the decimal character.
	 * @returns {string} the grouping separator char
	 */
	getGroupingSeparator: function () {
		return this.info.numfmt.groupChar;
	},

	/**
	 * Return the separator character used to separate groups of digits on the 
	 * integer side of the decimal character for the native script if present other than the default script.
	 * @returns {string} the grouping separator char
	 */
	getNativeGroupingSeparator: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.groupChar) || this.info.numfmt.groupChar;
	},
	
	/**
	 * Return the minimum number of digits grouped together on the integer side 
	 * for the first (primary) group. 
	 * In western European cultures, groupings are in 1000s, so the number of digits
	 * is 3. 
	 * @returns {number} the number of digits in a primary grouping, or 0 for no grouping
	 */
	getPrimaryGroupingDigits: function () {
		return (typeof(this.info.numfmt.prigroupSize) !== 'undefined' && this.info.numfmt.prigroupSize) || 0;
	},

	/**
	 * Return the minimum number of digits grouped together on the integer side
	 * for the second or more (secondary) group.<p>
	 *   
	 * In western European cultures, all groupings are by 1000s, so the secondary
	 * size should be 0 because there is no secondary size. In general, if this 
	 * method returns 0, then all groupings are of the primary size.<p> 
	 * 
	 * For some other cultures, the first grouping (primary)
	 * is 3 and any subsequent groupings (secondary) are two. So, 100000 would be
	 * written as: "1,00,000".
	 * 
	 * @returns {number} the number of digits in a secondary grouping, or 0 for no 
	 * secondary grouping. 
	 */
	getSecondaryGroupingDigits: function () {
		return this.info.numfmt.secgroupSize || 0;
	},

	/**
	 * Return the format template used to format percentages in this locale.
	 * @returns {string} the format template for formatting percentages
	 */
	getPercentageFormat: function () {
		return this.info.numfmt.pctFmt;
	},

	/**
	 * Return the format template used to format percentages in this locale
	 * with negative amounts.
	 * @returns {string} the format template for formatting percentages
	 */
	getNegativePercentageFormat: function () {
		return this.info.numfmt.negativepctFmt;
	},

	/**
	 * Return the symbol used for percentages in this locale.
	 * @returns {string} the symbol used for percentages in this locale
	 */
	getPercentageSymbol: function () {
		return this.info.numfmt.pctChar || "%";
	},

	/**
	 * Return the symbol used for exponential in this locale.
	 * @returns {string} the symbol used for exponential in this locale
	 */
	getExponential: function () {
		return this.info.numfmt.exponential;
	},

	/**
	 * Return the symbol used for exponential in this locale for native script.
	 * @returns {string} the symbol used for exponential in this locale for native script
	 */
	getNativeExponential: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.exponential) || this.info.numfmt.exponential;
	},

	/**
	 * Return the symbol used for percentages in this locale for native script.
	 * @returns {string} the symbol used for percentages in this locale for native script
	 */
	getNativePercentageSymbol: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.pctChar) || this.info.numfmt.pctChar || "%";
	
	},
	/**
	 * Return the format template used to format negative numbers in this locale.
	 * @returns {string} the format template for formatting negative numbers
	 */
	getNegativeNumberFormat: function () { 
		return this.info.numfmt.negativenumFmt;
	},
	
	/**
	 * Return an object containing the format templates for formatting currencies
	 * in this locale. The object has a number of properties in it that each are
	 * a particular style of format. Normally, this contains a "common" and an "iso"
	 * style, but may contain others in the future.
	 * @returns {Object} an object containing the format templates for currencies
	 */
	getCurrencyFormats: function () {
		return this.info.numfmt.currencyFormats;
	},
	
	/**
	 * Return the currency that is legal in the locale, or which is most commonly 
	 * used in regular commerce.
	 * @returns {string} the ISO 4217 code for the currency of this locale
	 */
	getCurrency: function () {
		return this.info.currency;
	},
	
	/**
	 * Return a string that describes the style of digits used by this locale.
	 * Possible return values are:
	 * <ul>
	 * <li><i>western</i> - uses the regular western 10-based digits 0 through 9
	 * <li><i>optional</i> - native 10-based digits exist, but in modern usage,
	 * this locale most often uses western digits
	 * <li><i>native</i> - native 10-based native digits exist and are used
	 * regularly by this locale
	 * <li><i>custom</i> - uses native digits by default that are not 10-based
	 * </ul>
	 * @returns {string} string that describes the style of digits used in this locale
	 */
	getDigitsStyle: function () {
		if (this.info.numfmt.useNative) {
			return "native";
		}
		if (typeof(this.info.native_numfmt) !== 'undefined') {
			return "optional";
		}
		return "western";
	},
	
	/**
	 * Return the digits of the default script if they are defined.
	 * If not defined, the default should be the regular "Arabic numerals"
	 * used in the Latin script. (0-9)
	 * @returns {string|undefined} the digits used in the default script 
	 */
	getDigits: function () {
		return this.info.numfmt.digits;
	},
	
	/**
	 * Return the digits of the native script if they are defined. 
	 * @returns {string|undefined} the digits used in the default script 
	 */
	getNativeDigits: function () {
		return (this.info.numfmt.useNative && this.info.numfmt.digits) || (this.info.native_numfmt && this.info.native_numfmt.digits);
	},
	
	/**
	 * If this locale typically uses a different type of rounding for numeric
	 * formatting other than halfdown, especially for currency, then it can be 
	 * specified in the localeinfo. If the locale uses the default, then this 
	 * method returns undefined. The locale's rounding method overrides the 
	 * rounding method for the currency itself, which can sometimes shared 
	 * between various locales so it is less specific.
	 * @returns {string} the name of the rounding mode typically used in this
	 * locale, or "halfdown" if the locale does not override the default
	 */
	getRoundingMode: function () {
		return this.info.numfmt.roundingMode;
	},
	
	/**
	 * Return the default script used to write text in the language of this 
	 * locale. Text for most languages is written in only one script, but there
	 * are some languages where the text can be written in a number of scripts,
	 * depending on a variety of things such as the region, ethnicity, religion, 
	 * etc. of the author. This method returns the default script for the
	 * locale, in which the language is most commonly written.<p> 
	 * 
	 * The script is returned as an ISO 15924 4-letter code.
	 * 
	 * @returns {string} the ISO 15924 code for the default script used to write
	 * text in this locale 
	 */
	getDefaultScript: function() {
		return (this.info.scripts) ? this.info.scripts[0] : "Latn";
	},
	
	/**
	 * Return the script used for the current locale. If the current locale
	 * explicitly defines a script, then this script is returned. If not, then 
	 * the default script for the locale is returned.
	 * 
	 * @see ilib.LocaleInfo.getDefaultScript
	 * @returns {string} the ISO 15924 code for the script used to write
	 * text in this locale
	 */
	getScript: function() {
		return this.locale.getScript() || this.getDefaultScript(); 
	},
	
	/**
	 * Return an array of script codes which are used to write text in the current
	 * language. Text for most languages is written in only one script, but there
	 * are some languages where the text can be written in a number of scripts,
	 * depending on a variety of things such as the region, ethnicity, religion, 
	 * etc. of the author. This method returns an array of script codes in which 
	 * the language is commonly written.
	 * 
	 * @returns {Array.<string>} an array of ISO 15924 codes for the scripts used 
	 * to write text in this language
	 */
	getAllScripts: function() {
		return this.info.scripts || ["Latn"];
	},
	
	/**
	 * Return the default style of meridiems used in this locale. Meridiems are 
	 * times of day like AM/PM. In a few locales with some calendars, for example
	 * Amharic/Ethiopia using the Ethiopic calendar, the times of day may be
	 * split into different segments than simple AM/PM as in the Gregorian 
	 * calendar. Only a few locales are like that. For most locales, formatting 
	 * a Gregorian date will use the regular Gregorian AM/PM meridiems.
	 *  
	 * @returns {string} the default meridiems style used in this locale. Possible
	 * values are "gregorian", "chinese", and "ethiopic"
	 */
	getMeridiemsStyle: function () {
		return this.info.meridiems || "gregorian";
	}	
};

/*
 * date.js - Represent a date in any calendar. This class is subclassed for each calendar.
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends ilibglobal.js localeinfo.js */

/**
 * @class
 * Construct a new date object. Each parameter is a numeric value, but its 
 * accepted range can vary depending on the subclass of this date. For example,
 * Gregorian months can be from 1 to 12, whereas months in the Hebrew calendar
 * can be from 1 to 13.<p>
 * 
 * Note that this really calls the newInstance factory method underneath in 
 * order to instantiate the correct subclass of ilib.Date.
 * 
 * Depends directive: !depends date.js
 * 
 * @constructor
 * @param {Object=} options The date components to initialize this date with
 */
ilib.Date = function(options) {
	if (!options || typeof(options.noinstance) === 'undefined') {
		return ilib.Date.newInstance(options);
	}
};

/**
 * Factory method to create a new instance of a date subclass.<p>
 * 
 * The options parameter can be an object that contains the following
 * properties:
 * 
 * <ul>
 * <li><i>type</i> - specify the type/calendar of the date desired. The
 * list of valid values changes depending on which calendars are 
 * defined. When assembling your iliball.js, include those date type 
 * you wish to use in your program or web page, and they will register 
 * themselves with this factory method. The "gregorian",
 * and "julian" calendars are all included by default, as they are the
 * standard calendars for much of the world. If not specified, the type
 * of the date returned is the one that is appropriate for the locale.
 * This property may also be given as "calendar" instead of "type".
 * </ul>
 * 
 * The options object is also passed down to the date constructor, and 
 * thus can contain the the properties as the date object being instantiated.
 * See the documentation for {@link ilib.Date.GregDate}, and other
 * subclasses for more details on other parameter that may be passed in.<p>
 * 
 * Please note that if you do not give the type parameter, this factory
 * method will create a date object that is appropriate for the calendar
 * that is most commonly used in the specified or current ilib locale. 
 * For example, in Thailand, the most common calendar is the Thai solar 
 * calendar. If the current locale is "th-TH" (Thai for Thailand) and you 
 * use this factory method to construct a new date without specifying the
 * type, it will automatically give you back an instance of 
 * {@link ilib.Date.ThaiSolarDate}. This is convenient because you do not 
 * need to know which locales use which types of dates. In fact, you 
 * should always use this factory method to make new date instances unless
 * you know that you specifically need a date in a particular calendar.<p>
 * 
 * Also note that when you pass in the date components such as year, month,
 * day, etc., these components should be appropriate for the given date
 * being instantiated. That is, in our Thai example in the previous
 * paragraph, the year and such should be given as a Thai solar year, not
 * the Gregorian year that you get from the Javascript Date class. In
 * order to initialize a date instance when you don't know what subclass
 * will be instantiated for the locale, use a parameter such as "unixtime" 
 * or "julianday" which are unambiguous and based on UTC time, instead of
 * the year/month/date date components. The date components for that UTC 
 * time will be calculated and the time zone offset will be automatically 
 * factored in.
 *  
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {ilib.Date} an instance of a calendar object of the appropriate type 
 */
ilib.Date.newInstance = function(options) {
	var locale = options && options.locale,
		type = options && (options.type || options.calendar),
		cons;

	if (!locale) {
		locale = new ilib.Locale();	// default locale
	}
	
	if (!type) {
		var info = new ilib.LocaleInfo(locale);
		type = info.getCalendar();
	}

	cons = ilib.Date._constructors[type];
	
	// pass the same options through to the constructor so the subclass
	// has the ability to do something with if it needs to
	return cons && new cons(options);
};

/**
 * Convert JavaScript Date objects and other types into native ilib Dates. This accepts any
 * string or number that can be translated by the JavaScript Date class,
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
 * any JavaScript Date classed object, any ilib.Date subclass, an ilib.JulianDay object, an object
 * containing the normal options to initialize an ilib.Date instance, or null (will 
 * return null or undefined if input is null or undefined). Normal output is 
 * a standard native subclass of the ilib Date object as appropriate for the locale.
 * 
 * @static
 * @private
 * @param  {ilib.Date|Object|ilib.JulianDay|Date|string|number=} inDate The input date object, string or Number.
 * @param  {ilib.String|string=} timezone timezone to use if a new date object is created
 * @return {ilib.Date|null|undefined} an ilib.Date subclass equivalent to the given inDate
 */
ilib.Date._dateToIlib = function(inDate, timezone) {
	if (typeof(inDate) === 'undefined' || inDate === null) {
		return inDate;
	}
	if (inDate instanceof ilib.Date) {
		return inDate;
	}
	if (inDate instanceof Date) {
		return ilib.Date.newInstance({
			unixtime: inDate.getTime(),
			timezone: timezone
		});
	}
	if (inDate instanceof ilib.JulianDay) {
		return ilib.Date.newInstance({
			jd: inDate,
			timezone: timezone
		});
	}
	if (typeof(inDate) === 'number') {
		return ilib.Date.newInstance({
			unixtime: inDate,
			timezone: timezone
		});
	}
	if (typeof(inDate) === 'object') {
		return ilib.Date.newInstance(inDate);
	}
	if (typeof(inDate) === 'string') {
		inDate = new Date(inDate);
	}
	return ilib.Date.newInstance({
		unixtime: inDate.getTime(),
		timezone: timezone
	});
};

/* place for the subclasses to put their constructors so that the factory method
 * can find them. Do this to add your date after it's defined: 
 * ilib.Date._constructors["mytype"] = ilib.Date.MyTypeConstructor;
 */
ilib.Date._constructors = {};

ilib.Date.prototype = {
	getType: function() {
		return "ilib.Date";
	},
	
	/**
	 * Return the unix time equivalent to this date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC (Gregorian). This 
	 * method only returns a valid number for dates between midnight, 
	 * Jan 1, 1970 UTC (Gregorian) and Jan 19, 2038 at 3:14:07am UTC (Gregorian) when 
	 * the unix time runs out. If this instance encodes a date outside of that range, 
	 * this method will return -1. For date types that are not Gregorian, the point 
	 * in time represented by this date object will only give a return value if it
	 * is in the correct range in the Gregorian calendar as given previously.
	 * 
	 * @return {number} a number giving the unix time, or -1 if the date is outside the
	 * valid unix time range
	 */
	getTime: function() {
		return this.rd.getTime(); 
	},
	
	/**
	 * Return the extended unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. Traditionally unix time
	 * (or the type "time_t" in C/C++) is only encoded with an unsigned 32 bit integer, and thus 
	 * runs out on Jan 19, 2038. However, most Javascript engines encode numbers well above 
	 * 32 bits and the Date object allows you to encode up to 100 million days worth of time 
	 * after Jan 1, 1970, and even more interestingly, 100 million days worth of time before
	 * Jan 1, 1970 as well. This method returns the number of milliseconds in that extended 
	 * range. If this instance encodes a date outside of that range, this method will return
	 * NaN.
	 * 
	 * @return {number} a number giving the extended unix time, or Nan if the date is outside 
	 * the valid extended unix time range
	 */
	getTimeExtended: function() {
		return this.rd.getTimeExtended();
	},

	/**
	 * Set the time of this instance according to the given unix time. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970.
	 * 
	 * @param {number} millis the unix time to set this date to in milliseconds 
	 */
	setTime: function(millis) {
		this.rd = this.newRd({
			unixtime: millis,
			cal: this.cal
		});
		this._calcDateComponents();
	},
	
	getDays: function() {
		return this.day;
	},
	getMonths: function() {
		return this.month;
	},
	getYears: function() {
		return this.year;
	},
	getHours: function() {
		return this.hour;
	},
	getMinutes: function() {
		return this.minute;
	},
	getSeconds: function() {
		return this.second;
	},
	getMilliseconds: function() {
		return this.millisecond;
	},

	setDays: function(day) {
		this.day = parseInt(day, 10) || 1;
		this.rd._setDateComponents(this);
	},
	setMonths: function(month) {
		this.month = parseInt(month, 10) || 1;
		this.rd._setDateComponents(this);
	},
	setYears: function(year) {
		this.year = parseInt(year, 10) || 0;
		this.rd._setDateComponents(this);
	},
	
	setHours: function(hour) {
		this.hour = parseInt(hour, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setMinutes: function(minute) {
		this.minute = parseInt(minute, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setSeconds: function(second) {
		this.second = parseInt(second, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setMilliseconds: function(milli) {
		this.millisecond = parseInt(milli, 10) || 0;
		this.rd._setDateComponents(this);
	},
	
	/**
	 * Return a new date instance in the current calendar that represents the first instance 
	 * of the given day of the week before the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week before the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	before: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.before(dow, this.offset),
			timezone: this.timezone
		});
	},
	
	/**
	 * Return a new date instance in the current calendar that represents the first instance 
	 * of the given day of the week after the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week after the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	after: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.after(dow, this.offset),
			timezone: this.timezone
		});
	},

	/**
	 * Return a new Gregorian date instance that represents the first instance of the 
	 * given day of the week on or before the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week on or before the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	onOrBefore: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.onOrBefore(dow, this.offset),
			timezone: this.timezone
		});
	},

	/**
	 * Return a new Gregorian date instance that represents the first instance of the 
	 * given day of the week on or after the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week on or after the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	onOrAfter: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.onOrAfter(dow, this.offset),
			timezone: this.timezone
		});
	},
	
	/**
	 * Return a Javascript Date object that is equivalent to this date
	 * object.
	 * 
	 * @return {Date|undefined} a javascript Date object
	 */
	getJSDate: function() {
		var unix = this.rd.getTimeExtended();
		return isNaN(unix) ? undefined : new Date(unix); 
	},
	
	/**
	 * Return the Rata Die (fixed day) number of this date.
	 * 
	 * @protected
	 * @return {number} the rd date as a number
	 */
	getRataDie: function() {
		return this.rd.getRataDie();
	},
	
	/**
	 * Set the date components of this instance based on the given rd.
	 * @protected
	 * @param {number} rd the rata die date to set
	 */
	setRd: function (rd) {
		this.rd = this.newRd({
			rd: rd,
			cal: this.cal
		});
		this._calcDateComponents();
	},
	
	/**
	 * Return the Julian Day equivalent to this calendar date as a number.
	 * 
	 * @return {number} the julian date equivalent of this date
	 */
	getJulianDay: function() {
		return this.rd.getJulianDay();
	},
	
	/**
	 * Set the date of this instance using a Julian Day.
	 * @param {number|ilib.JulianDay} date the Julian Day to use to set this date
	 */
	setJulianDay: function (date) {
		this.rd = this.newRd({
			julianday: (typeof(date) === 'object') ? date.getDate() : date,
			cal: this.cal
		});
		this._calcDateComponents();
	},

	/**
	 * Return the time zone associated with this date, or 
	 * undefined if none was specified in the constructor.
	 * 
	 * @return {string|undefined} the name of the time zone for this date instance
	 */
	getTimeZone: function() {
		return this.timezone || "local";
	},
	
	/**
	 * Set the time zone associated with this date.
	 * @param {string=} tzName the name of the time zone to set into this date instance,
	 * or "undefined" to unset the time zone 
	 */
	setTimeZone: function (tzName) {
		if (!tzName || tzName === "") {
			// same as undefining it
			this.timezone = undefined;
			this.tz = undefined;
		} else if (typeof(tzName) === 'string') {
			this.timezone = tzName;
			this.tz = undefined;
			// assuming the same UTC time, but a new time zone, now we have to 
			// recalculate what the date components are
			this._calcDateComponents();
		}
	},
	
	/**
	 * Return the rd number of the first Sunday of the given ISO year.
	 * @protected
	 * @param {number} year the year for which the first Sunday is being sought
	 * @return {number} the rd of the first Sunday of the ISO year
	 */
	firstSunday: function (year) {
		var firstDay = this.newRd({
			year: year,
			month: 1,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
			cal: this.cal
		});
		var firstThu = this.newRd({
			rd: firstDay.onOrAfter(4),
			cal: this.cal
		});
		return firstThu.before(0);
	},
	
	/**
	 * Return the ISO 8601 week number in the current year for the current date. The week
	 * number ranges from 0 to 55, as some years have 55 weeks assigned to them in some
	 * calendars.
	 * 
	 * @return {number} the week number for the current date
	 */
	getWeekOfYear: function() {
		var rd = Math.floor(this.rd.getRataDie());
		var year = this._calcYear(rd + this.offset);
		var yearStart = this.firstSunday(year);
		var nextYear;
		
		// if we have a January date, it may be in this ISO year or the previous year
		if (rd < yearStart) {
			yearStart = this.firstSunday(year-1);
		} else {
			// if we have a late December date, it may be in this ISO year, or the next year
			nextYear = this.firstSunday(year+1);
			if (rd >= nextYear) {
				yearStart = nextYear;
			}
		}
		
		return Math.floor((rd-yearStart)/7) + 1;
	},
	
	/**
	 * Return the ordinal number of the week within the month. The first week of a month is
	 * the first one that contains 4 or more days in that month. If any days precede this
	 * first week, they are marked as being in week 0. This function returns values from 0
	 * through 6.<p>
	 * 
	 * The locale is a required parameter because different locales that use the same 
	 * Gregorian calendar consider different days of the week to be the beginning of
	 * the week. This can affect the week of the month in which some days are located.
	 * 
	 * @param {ilib.Locale|string} locale the locale or locale spec to use when figuring out 
	 * the first day of the week
	 * @return {number} the ordinal number of the week within the current month
	 */
	getWeekOfMonth: function(locale) {
		var li = new ilib.LocaleInfo(locale);
		
		var first = this.newRd({
			year: this._calcYear(this.rd.getRataDie()+this.offset),
			month: this.getMonths(),
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
			cal: this.cal
		});
		var weekStart = first.onOrAfter(li.getFirstDayOfWeek());
		
		if (weekStart - first.getRataDie() > 3) {
			// if the first week has 4 or more days in it of the current month, then consider
			// that week 1. Otherwise, it is week 0. To make it week 1, move the week start
			// one week earlier.
			weekStart -= 7;
		}
		return Math.floor((this.rd.getRataDie() - weekStart) / 7) + 1;
	}
};

/*
 * util/utils.js - Core utility routines
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

/**
 * If Function.prototype.bind does not exist in this JS engine, this
 * function reimplements it in terms of older JS functions.
 * bind() doesn't exist in many older browsers.
 * 
 * @param {Object} scope object that the method should operate on
 * @param {function(...)} method method to call
 * @return {function(...)|undefined} function that calls the given method 
 * in the given scope with all of its arguments properly attached, or
 * undefined if there was a problem with the arguments
 */
ilib.bind = function(scope, method/*, bound arguments*/){
	if (!scope || !method) {
		return undefined;
	}
	
	/** @protected 
	 * @param {Arguments} inArrayLike
	 * @param {number=} inOffset
	 */
	function cloneArray(inArrayLike, inOffset) {
		var arr = [];
		for(var i = inOffset || 0, l = inArrayLike.length; i<l; i++){
			arr.push(inArrayLike[i]);
		}
		return arr;
	}

	if (typeof(method) === 'function') {
		var func, args = cloneArray(arguments, 2);
		if (typeof(method.bind) === 'function') {
			func = method.bind.apply(method, [scope].concat(args));
		} else {
			func = function() {
				var nargs = cloneArray(arguments);
				// invoke with collected args
				return method.apply(scope, args.concat(nargs));
			};
		}
		return func;
	}
	return undefined;
};

/**
 * Merge the properties of object2 into object1 in a deep manner and return a merged
 * object. If the property exists in both objects, the value in object2 will overwrite 
 * the value in object1. If a property exists in object1, but not in object2, its value
 * will not be touched. If a property exists in object2, but not in object1, it will be 
 * added to the merged result.<p>
 * 
 * Name1 and name2 are for creating debug output only. They are not necessary.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {*} object1 the object to merge into
 * @param {*} object2 the object to merge
 * @param {boolean=} replace if true, replace the array elements in object1 with those in object2.
 * If false, concatenate array elements in object1 with items in object2.
 * @param {string=} name1 name of the object being merged into
 * @param {string=} name2 name of the object being merged in
 * @return {Object} the merged object
 */
ilib.merge = function (object1, object2, replace, name1, name2) {
	var prop = undefined,
		newObj = {};
	for (prop in object1) {
		if (prop && typeof(object1[prop]) !== 'undefined') {
			newObj[prop] = object1[prop];
		}
	}
	for (prop in object2) {
		if (prop && typeof(object2[prop]) !== 'undefined') {
			if (object1[prop] instanceof Array && object2[prop] instanceof Array) {
				if (typeof(replace) !== 'boolean' || !replace) {
					newObj[prop] = new Array();
					newObj[prop] = newObj[prop].concat(object1[prop]);
					newObj[prop] = newObj[prop].concat(object2[prop]);
				} else {
					newObj[prop] = object2[prop];
				}
			} else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
				newObj[prop] = ilib.merge(object1[prop], object2[prop], replace);
			} else {
				// for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
				if (name1 && name2 && newObj[prop] == object2[prop]) {
					console.log("Property " + prop + " in " + name1 + " is being overridden by the same value in " + name2);
				}
				newObj[prop] = object2[prop];
			}
		}
	}
	return newObj;
};

/**
 * Find and merge all the locale data for a particular prefix in the given locale
 * and return it as a single javascript object. This merges the data in the 
 * correct order:
 * 
 * <ol>
 * <li>shared data (usually English)
 * <li>data for language
 * <li>data for language + region
 * <li>data for language + region + script
 * <li>data for language + region + script + variant
 * </ol>
 * 
 * It is okay for any of the above to be missing. This function will just skip the 
 * missing data. However, if everything except the shared data is missing, this 
 * function returns undefined, allowing the caller to go and dynamically load the
 * data instead.
 *  
 * @param {string} prefix prefix under ilib.data of the data to merge
 * @param {ilib.Locale} locale locale of the data being sought
 * @param {boolean=} replaceArrays if true, replace the array elements in object1 with those in object2.
 * If false, concatenate array elements in object1 with items in object2.
 * @param {boolean=} returnOne if true, only return the most locale-specific data. If false,
 * merge all the relevant locale data together.
 * @return {Object?} the merged locale data
 */
ilib.mergeLocData = function (prefix, locale, replaceArrays, returnOne) {
	var data = undefined;
	var loc = locale || new ilib.Locale();
	var foundLocaleData = false;
	var property = prefix;
	var mostSpecific;

	data = ilib.data[prefix] || {};

	mostSpecific = data;

	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	if (loc.getRegion()) {
		property = prefix + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		
		if (loc.getScript()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = ilib.merge(data, ilib.data[property], replaceArrays);
				mostSpecific = ilib.data[property];
			}
		}
		
		if (loc.getRegion()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = ilib.merge(data, ilib.data[property], replaceArrays);
				mostSpecific = ilib.data[property];
			}
		}		
	}
	
	if (loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	return foundLocaleData ? (returnOne ? mostSpecific : data) : undefined;
};

/**
 * Return an array of relative path names for the
 * files that represent the data for the given locale.<p>
 * 
 * Note that to prevent the situation where a directory for
 * a language exists next to the directory for a region where
 * the language code and region code differ only by case, the 
 * plain region directories are located under the special 
 * "undefined" language directory which has the ISO code "und".
 * The reason is that some platforms have case-insensitive 
 * file systems, and you cannot have 2 directories with the 
 * same name which only differ by case. For example, "es" is
 * the ISO 639 code for the language "Spanish" and "ES" is
 * the ISO 3166 code for the region "Spain", so both the
 * directories cannot exist underneath "locale". The region
 * therefore will be loaded from "und/ES" instead.<p>  
 * 
 * <h4>Variations</h4>
 * 
 * With only language and region specified, the following
 * sequence of paths will be generated:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/region
 * </pre>
 * 
 * With only language and script specified:<p>
 * 
 * <pre>
 * language
 * language/script
 * </pre>
 * 
 * With only script and region specified:<p>
 * 
 * <pre>
 * und/region  
 * </pre>
 * 
 * With only region and variant specified:<p>
 * 
 * <pre>
 * und/region
 * region/variant
 * </pre>
 * 
 * With only language, script, and region specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * language/script/region
 * </pre>
 * 
 * With only language, region, and variant specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/region
 * region/variant
 * language/region/variant
 * </pre>
 * 
 * With all parts specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * region/variant
 * language/script/region
 * language/region/variant
 * language/script/region/variant
 * </pre>
 * 
 * @param {ilib.Locale} locale load the files for this locale
 * @param {string?} name the file name of each file to load without
 * any path
 * @return {Array.<string>} An array of relative path names
 * for the files that contain the locale data
 */
ilib.getLocFiles = function(locale, name) {
	var dir = "";
	var files = [];
	var filename = name || "resources.json";
	var loc = locale || new ilib.Locale();
	
	var language = loc.getLanguage();
	var region = loc.getRegion();
	var script = loc.getScript();
	var variant = loc.getVariant();
	
	files.push(filename); // generic shared file
	
	if (language) {
		dir = language + "/";
		files.push(dir + filename);
	}
	
	if (region) {
		dir = "und/" + region + "/";
		files.push(dir + filename);
	}
	
	if (language) {
		if (script) {
			dir = language + "/" + script + "/";
			files.push(dir + filename);
		}
		if (region) {
			dir = language + "/" + region + "/";
			files.push(dir + filename);
		}
	}
	
	if (region && variant) {
		dir = "und/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}

	if (language && script && region) {
		dir = language + "/" + script + "/" + region + "/";
		files.push(dir + filename);
	}

	if (language && region && variant) {
		dir = language + "/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}

	if (language && script && region && variant) {
		dir = language + "/" + script + "/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}
	
	return files;
};

/**
 * Return true if the given object has no properties.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {Object} obj the object to check
 * @return {boolean} true if the given object has no properties, false otherwise
 */
ilib.isEmpty = function (obj) {
	var prop = undefined;
	
	if (!obj) {
		return true;
	}
	
	for (prop in obj) {
		if (prop && typeof(obj[prop]) !== 'undefined') {
			return false;
		}
	}
	return true;
};


/**
 * @private
 */
ilib.hashCode = function(obj) {
	var hash = 0;
	
	function addHash(hash, newValue) {
		// co-prime numbers creates a nicely distributed hash
		hash *= 65543;
		hash += newValue;
		hash %= 2147483647; 
		return hash;
	}
	
	function stringHash(str) {
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			hash = addHash(hash, str.charCodeAt(i));
		}
		return hash;
	}
	
	switch (typeof(obj)) {
		case 'undefined':
			hash = 0;
			break;
		case 'string':
			hash = stringHash(obj);
			break;
		case 'function':
		case 'number':
		case 'xml':
			hash = stringHash(String(obj));
			break;
		case 'boolean':
			hash = obj ? 1 : 0;
			break;
		case 'object':
			var props = [];
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					props.push(p);
				}
			}
			// make sure the order of the properties doesn't matter
			props.sort();
			for (var i = 0; i < props.length; i++) {
				hash = addHash(hash, stringHash(props[i]));
				hash = addHash(hash, ilib.hashCode(obj[props[i]]));
			}
			break;
	}
	
	return hash;
};


/**
 * Load data using the new loader object or via the old function callback.
 * @private
 */
ilib._callLoadData = function (files, sync, params, callback) {
	// console.log("ilib._callLoadData called");
	if (typeof(ilib._load) === 'function') {
		// console.log("ilib._callLoadData: calling as a regular function");
		return ilib._load(files, sync, params, callback);
	} else if (typeof(ilib._load) === 'object' && ilib._load instanceof ilib.Loader) {
		// console.log("ilib._callLoadData: calling as an object");
		return ilib._load.loadFiles(files, sync, params, callback);
	}
	
	// console.log("ilib._callLoadData: not calling. Type is " + typeof(ilib._load) + " and instanceof says " + (ilib._load instanceof ilib.Loader));
	return undefined;
};

/**
 * Find locale data or load it in. If the data with the given name is preassembled, it will
 * find the data in ilib.data. If the data is not preassembled but there is a loader function,
 * this function will call it to load the data. Otherwise, the callback will be called with
 * undefined as the data. This function will create a cache under the given class object.
 * If data was successfully loaded, it will be set into the cache so that future access to 
 * the same data for the same locale is much quicker.<p>
 * 
 * The parameters can specify any of the following properties:<p>
 * 
 * <ul>
 * <li><i>name</i> - String. The name of the file being loaded. Default: resources.json
 * <li><i>object</i> - Object. The class attempting to load data. The cache is stored inside of here.
 * <li><i>locale</i> - ilib.Locale. The locale for which data is loaded. Default is the current locale.
 * <li><i>nonlocale</i> - boolean. If true, the data being loaded is not locale-specific.
 * <li><i>type</i> - String. Type of file to load. This can be "json" or "other" type. Default: "json" 
 * <li><i>replace</i> - boolean. When merging json objects, this parameter controls whether to merge arrays
 * or have arrays replace each other. If true, arrays in child objects replace the arrays in parent 
 * objects. When false, the arrays in child objects are concatenated with the arrays in parent objects.  
 * <li><i>loadParams</i> - Object. An object with parameters to pass to the loader function
 * <li><i>sync</i> - boolean. Whether or not to load the data synchronously
 * <li><i>callback</i> - function(?)=. callback Call back function to call when the data is available.
 * Data is not returned from this method, so a callback function is mandatory.
 * </ul>
 * 
 * @param {Object} params Parameters configuring how to load the files (see above)
 */
ilib.loadData = function(params) {
	var name = "resources.json",
		object = undefined, 
		locale = new ilib.Locale(ilib.getLocale()), 
		sync = false, 
		type = undefined,
		loadParams = {},
		callback = undefined,
		nonlocale = false,
		replace = false,
		basename;
	
	if (!params || typeof(params.callback) !== 'function') {
		return;
	}

	if (params.name) {
		name = params.name;
	}
	if (params.object) {
		object = params.object;
	}
	if (params.locale) {
		locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
	}			
	if (params.type) {
		type = params.type;
	}
	if (params.loadParams) {
		loadParams = params.loadParams;
	}
	if (params.sync) {
		sync = params.sync;
	}
	if (params.nonlocale) {
		nonlocale = !!params.nonlocale;
	}
	if (typeof(params.replace) === 'boolean') {
		replace = params.replace;
	}
	
	callback = params.callback;
	
	if (object && !object.cache) {
		object.cache = {};
	}
	
	if (!type) {
		var dot = name.lastIndexOf(".");
		type = (dot !== -1) ? name.substring(dot+1) : "text";
	}

	var spec = ((!nonlocale && locale.getSpec().replace(/-/g, '_')) || "root") + "," + name + "," + String(ilib.hashCode(loadParams));
	if (!object || typeof(object.cache[spec]) === 'undefined') {
		var data, returnOne = (loadParams && loadParams.returnOne);
		
		if (type === "json") {
			// console.log("type is json");
			basename = name.substring(0, name.lastIndexOf("."));
			if (nonlocale) {
				basename = basename.replace(/\//g, '.').replace(/[\\\+\-]/g, "_");
				data = ilib.data[basename];
			} else {
				data = ilib.mergeLocData(basename, locale, replace, returnOne);
			}
			if (data) {
				// console.log("found assembled data");
				if (object) {
					object.cache[spec] = data;
				}
				callback(data);
				return;
			}
		}
		
		// console.log("ilib._load is " + typeof(ilib._load));
		if (typeof(ilib._load) !== 'undefined') {
			// the data is not preassembled, so attempt to load it dynamically
			var files = nonlocale ? [ name || "resources.json" ] : ilib.getLocFiles(locale, name);
			if (type !== "json") {
				loadParams.returnOne = true;
			}
			
			ilib._callLoadData(files, sync, loadParams, ilib.bind(this, function(arr) {
				if (type === "json") {
					data = ilib.data[basename] || {};
					for (var i = 0; i < arr.length; i++) {
						if (typeof(arr[i]) !== 'undefined') {
							data = loadParams.returnOne ? arr[i] : ilib.merge(data, arr[i], replace);
						}
					}
					
					if (object) {
						object.cache[spec] = data;
					}
					callback(data);
				} else {
					var i = arr.length-1; 
					while (i > -1 && !arr[i]) {
						i--;
					}
					if (i > -1) {
						if (object) {
							object.cache[spec] = arr[i];
						}
						callback(arr[i]);
					} else {
						callback(undefined);
					}
				}
			}));
		} else {
			// no data other than the generic shared data
			if (type === "json") {
				data = ilib.data[basename];
			}
			if (object && data) {
				object.cache[spec] = data;
			}
			callback(data);
		}
	} else {
		callback(object.cache[spec]);
	}
};

/*
 * util/math.js - Misc math utility routines
 * 
 * Copyright © 2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

/**
 * Return the sign of the given number. If the sign is negative, this function
 * returns -1. If the sign is positive or zero, this function returns 1.
 * @static
 * @param {number} num the number to test
 * @return {number} -1 if the number is negative, and 1 otherwise
 */
ilib.signum = function (num) {
	var n = num;
	if (typeof(num) === 'string') {
		n = parseInt(num, 10);
	} else if (typeof(num) !== 'number') {
		return 1;
	}
	return (n < 0) ? -1 : 1;
};


/**
 * @protected
 */
ilib._roundFnc = {
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	floor: function (num) {
		return Math.floor(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	ceiling: function (num) {
		return Math.ceil(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	down: function (num) {
		return (num < 0) ? Math.ceil(num) : Math.floor(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	up: function (num) {
		return (num < 0) ? Math.floor(num) : Math.ceil(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfup: function (num) {
		return (num < 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfdown: function (num) {
		return (num < 0) ? Math.floor(num + 0.5) : Math.ceil(num - 0.5);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfeven: function (num) {
		return (Math.floor(num) % 2 === 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfodd: function (num) {
		return (Math.floor(num) % 2 !== 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	}
};

/**
 * Do a proper modulo function. The Javascript % operator will give the truncated
 * division algorithm, but for calendrical calculations, we need the Euclidean
 * division algorithm where the remainder of any division, whether the dividend
 * is negative or not, is always a positive number in the range [0, modulus).<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {number} dividend the number being divided
 * @param {number} modulus the number dividing the dividend. This should always be a positive number.
 * @return the remainder of dividing the dividend by the modulus.  
 */
ilib.mod = function (dividend, modulus) {
	if (modulus == 0) {
		return 0;
	}
	var x = dividend % modulus;
	return (x < 0) ? x + modulus : x;
};

/**
 * Do a proper adjusted modulo function. The Javascript % operator will give the truncated
 * division algorithm, but for calendrical calculations, we need the Euclidean
 * division algorithm where the remainder of any division, whether the dividend
 * is negative or not, is always a positive number in the range (0, modulus]. The adjusted
 * modulo function differs from the regular modulo function in that when the remainder is
 * zero, the modulus should be returned instead.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {number} dividend the number being divided
 * @param {number} modulus the number dividing the dividend. This should always be a positive number.
 * @return the remainder of dividing the dividend by the modulus.  
 */
ilib.amod = function (dividend, modulus) {
	if (modulus == 0) {
		return 0;
	}
	var x = dividend % modulus;
	return (x <= 0) ? x + modulus : x;
};

ilib.data.plurals_en = {"one":{"is":["n",1]}};
ilib.data.plurals_de = {"one":{"is":["n",1]}};
ilib.data.plurals_es = {"one":{"is":["n",1]}};
ilib.data.plurals_it = {"one":{"is":["n",1]}};
ilib.data.plurals_fr = {"one":{"and":[{"within":["n",[[0,2]]]},{"isnot":["n",2]}]}};
ilib.data.plurals_pt = {"one":{"is":["n",1]}};
ilib.data.plurals_ru = {"few":{"and":[{"inrange":[{"mod":["n",10]},[[2,4]]]},{"notin":[{"mod":["n",100]},[[12,14]]]}]},"many":{"or":[{"or":[{"is":[{"mod":["n",10]},0]},{"inrange":[{"mod":["n",10]},[[5,9]]]}]},{"inrange":[{"mod":["n",100]},[[11,14]]]}]},"one":{"and":[{"is":[{"mod":["n",10]},1]},{"isnot":[{"mod":["n",100]},11]}]}};
/*
 * strings.js - ilib string subclass definition
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js util/utils.js locale.js util/math.js

// !data plurals

/**
 * @class
 * Create a new string instance. This string inherits from the Javascript
 * String class, and adds two more methods, fmt and fmtChoice. It can be
 * used anywhere that a normal Javascript string is used. The formatting
 * methods are of course most useful when localizing strings in an app
 * or web site in combination with the ilib.ResBundle class.<p>
 * 
 * Depends directive: !depends strings.js
 * 
 * @constructor
 * @param {string|ilib.String=} string initialize this instance with this string 
 */
ilib.String = function (string) {
	if (typeof(string) === 'object') {
		if (string instanceof ilib.String) {
			this.str = string.str;	
		} else {
			this.str = string.toString();
		}
	} else if (typeof(string) === 'string') {
		this.str = new String(string);
	} else {
		this.str = "";
	}
	this.length = this.str.length;
	this.cpLength = -1;
	this.localeSpec = ilib.getLocale();
};

/**
 * Return true if the given character is a Unicode surrogate character,
 * either high or low.
 * 
 * @private
 * @static
 * @param {string} ch character to check
 * @return {boolean} true if the character is a surrogate
 */
ilib.String._isSurrogate = function (ch) {
	var n = ch.charCodeAt(0);
	return ((n >= 0xDC00 && n <= 0xDFFF) || (n >= 0xD800 && n <= 0xDBFF));
};

/**
 * Convert a UCS-4 code point to a Javascript string. The codepoint can be any valid 
 * UCS-4 Unicode character, including supplementary characters. Standard Javascript
 * only supports supplementary characters using the UTF-16 encoding, which has 
 * values in the range 0x0000-0xFFFF. String.fromCharCode() will only
 * give you a string containing 16-bit characters, and will not properly convert 
 * the code point for a supplementary character (which has a value > 0xFFFF) into 
 * two UTF-16 surrogate characters. Instead, it will just just give you whatever
 * single character happens to be the same as your code point modulo 0x10000, which
 * is almost never what you want.<p> 
 * 
 * Similarly, that means if you use String.charCodeAt()
 * you will only retrieve a 16-bit value, which may possibly be a single
 * surrogate character that is part of a surrogate pair representing a character
 * in the supplementary plane. It will not give you a code point. Use 
 * ilib.String.codePointAt() to access code points in a string, or use 
 * an iterator to walk through the code points in a string. 
 * 
 * @static
 * @param {number} codepoint UCS-4 code point to convert to a character
 * @return {string} a string containing the character represented by the codepoint
 */
ilib.String.fromCodePoint = function (codepoint) {
	if (codepoint < 0x10000) {
		return String.fromCharCode(codepoint);
	} else {
		var high = Math.floor(codepoint / 0x10000) - 1;
		var low = codepoint & 0xFFFF;
		
		return String.fromCharCode(0xD800 | ((high & 0x000F) << 6) |  ((low & 0xFC00) >> 10)) +
			String.fromCharCode(0xDC00 | (low & 0x3FF));
	}
};

/**
 * Convert the character or the surrogate pair at the given
 * index into the intrinsic Javascript string to a Unicode 
 * UCS-4 code point.
 * 
 * @param {string} str string to get the code point from
 * @param {number} index index into the string
 * @return {number} code point of the character at the
 * given index into the string
 */
ilib.String.toCodePoint = function(str, index) {
	if (!str || str.length === 0) {
		return -1;
	}
	var code = -1, high = str.charCodeAt(index);
	if (high >= 0xD800 && high <= 0xDBFF) {
		if (str.length > index+1) {
			var low = str.charCodeAt(index+1);
			if (low >= 0xDC00 && low <= 0xDFFF) {
				code = (((high & 0x3C0) >> 6) + 1) << 16 |
					(((high & 0x3F) << 10) | (low & 0x3FF));
			}
		}
	} else {
		code = high;
	}
	
	return code;
};

/**
 * Load the plural the definitions of plurals for the locale.
 * @param {boolean=} sync
 * @param {ilib.Locale|string=} locale
 * @param {Object=} loadParams
 * @param {function(*)=} onLoad
 */
ilib.String.loadPlurals = function (sync, locale, loadParams, onLoad) {
	var loc;
	if (locale) {
		loc = (typeof(locale) === 'string') ? new ilib.Locale(locale) : locale;
	} else {
		loc = new ilib.Locale(ilib.getLocale());
	}
	var spec = loc.getLanguage();
	if (!ilib.data["plurals_" + spec]) {
		ilib.loadData({
			name: "plurals.json",
			object: ilib.String,
			locale: loc,
			sync: sync,
			loadParams: loadParams,
			callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(plurals) {
				if (!plurals) {
					ilib.String.cache[spec] = {};
				}
				ilib.data["plurals_" + spec] = plurals || {};
				if (onLoad && typeof(onLoad) === 'function') {
					onLoad(ilib.data["plurals_" + spec]);
				}
			})
		});
	} else {
		if (onLoad && typeof(onLoad) === 'function') {
			onLoad(ilib.data["plurals_" + spec]);
		}
	}
};

/**
 * @private
 * @static
 */
ilib.String._fncs = {
	/**
	 * @private
	 * @param {Object} obj
	 * @return {string|undefined}
	 */
	firstProp: function (obj) {
		for (var p in obj) {
			if (p && obj[p]) {
				return p;
			}
		}
		return undefined; // should never get here
	},
	
	/**
	 * @private
	 * @param {Object} obj
	 * @param {number} n
	 * @return {?}
	 */
	getValue: function (obj, n) {
		if (typeof(obj) === 'object') {
			var subrule = ilib.String._fncs.firstProp(obj);
			return ilib.String._fncs[subrule](obj[subrule], n);
		} else if (typeof(obj) === 'string') {
			return n;
		} else {
			return obj;
		}
	},
	
	/**
	 * @private
	 * @param {number} n
	 * @param {Array.<number|Array.<number>>} range
	 * @return {boolean}
	 */
	matchRangeContinuous: function(n, range) {
		for (var num in range) {
			if (typeof(num) !== 'undefined' && typeof(range[num]) !== 'undefined') {
				var obj = /** @type {Object|null|undefined} */ range[num];
				if (typeof(obj) === 'number') {
					if (n === range[num]) {
						return true;
					}
				} else if (Object.prototype.toString.call(obj) === '[object Array]') {
					if (n >= obj[0] && n <= obj[1]) {
						return true;
					}
				}
			}
		}
		return false;
	},

	/**
	 * @private
	 * @param {number} n
	 * @param {Array.<number|Array.<number>>} range
	 * @return {boolean}
	 */
	matchRange: function(n, range) {
		if (Math.floor(n) !== n) {
			return false;
		}
		return ilib.String._fncs.matchRangeContinuous(n, range);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	is: function(rule, n) {
		var left = ilib.String._fncs.getValue(rule[0], n);
		var right = ilib.String._fncs.getValue(rule[1], n);
		return left == right;
		// return ilib.String._fncs.getValue(rule[0]) == ilib.String._fncs.getValue(rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	isnot: function(rule, n) {
		return ilib.String._fncs.getValue(rule[0], n) != ilib.String._fncs.getValue(rule[1], n);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	inrange: function(rule, n) {
		return ilib.String._fncs.matchRange(ilib.String._fncs.getValue(rule[0], n), rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	notin: function(rule, n) {
		return !ilib.String._fncs.matchRange(ilib.String._fncs.getValue(rule[0], n), rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	within: function(rule, n) {
		return ilib.String._fncs.matchRangeContinuous(ilib.String._fncs.getValue(rule[0], n), rule[1]);		
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {number}
	 */
	mod: function(rule, n) {
		return ilib.mod(ilib.String._fncs.getValue(rule[0], n), ilib.String._fncs.getValue(rule[1], n));
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {number}
	 */
	n: function(rule, n) {
		return n;
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	or: function(rule, n) {
		return ilib.String._fncs.getValue(rule[0], n) || ilib.String._fncs.getValue(rule[1], n);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	and: function(rule, n) {
		return ilib.String._fncs.getValue(rule[0], n) && ilib.String._fncs.getValue(rule[1], n);
	}
};

ilib.String.prototype = {
	/**
	 * Return the length of this string in characters. This function defers to the regular
	 * Javascript string class in order to perform the length function. Please note that this
	 * method is a real method, whereas the length property of Javascript strings is 
	 * implemented by native code and appears as a property.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new ilib.String("this is a string");
	 * console.log("String is " + str._length() + " characters long.");
	 * </pre>
	 * @private
	 */
	_length: function () {
		return this.str.length;
	},
	
	/**
	 * Format this string instance as a message, replacing the parameters with 
	 * the given values.<p>
	 * 
	 * The string can contain any text that a regular Javascript string can
	 * contain. Replacement parameters have the syntax:
	 * 
	 * <pre>
	 * {name}
	 * </pre>
	 * 
	 * Where "name" can be any string surrounded by curly brackets. The value of 
	 * "name" is taken from the parameters argument.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new ilib.String("There are {num} objects.");
	 * console.log(str.format({
	 *   num: 12
	 * });
	 * </pre>
	 * 
	 * Would give the output:
	 * 
	 * <pre>
	 * There are 12 objects.
	 * </pre>
	 * 
	 * If a property is missing from the parameter block, the replacement
	 * parameter substring is left untouched in the string, and a different
	 * set of parameters may be applied a second time. This way, different
	 * parts of the code may format different parts of the message that they
	 * happen to know about.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new ilib.String("There are {num} objects in the {container}.");
	 * console.log(str.format({
	 *   num: 12
	 * });
	 * </pre>
	 * 
	 * Would give the output:<p>
	 * 
	 * <pre>
	 * There are 12 objects in the {container}.
	 * </pre>
	 * 
	 * The result can then be formatted again with a different parameter block that
	 * specifies a value for the container property.
	 * 
	 * @param params a Javascript object containing values for the replacement 
	 * parameters in the current string
	 * @return a new ilib.String instance with as many replacement parameters filled
	 * out as possible with real values.
	 */
	format: function (params) {
		var formatted = this.str;
		if (params) {
			var regex;
			for (var p in params) {
				if (typeof(params[p]) !== 'undefined') {
					regex = new RegExp("\{"+p+"\}", "g");
					formatted = formatted.replace(regex, params[p]);
				}
			}
		}
		return formatted.toString();
	},
	
	/**
	 * Format a string as one of a choice of strings dependent on the value of
	 * a particular argument index.<p>
	 * 
	 * The syntax of the choice string is as follows. The string contains a
	 * series of choices separated by a vertical bar character "|". Each choice
	 * has a value or range of values to match followed by a hash character "#"
	 * followed by the string to use if the variable matches the criteria.<p>
	 * 
	 * Example string:
	 * 
	 * <pre>
	 * var num = 2;
	 * var str = new ilib.String("0#There are no objects.|1#There is one object.|2#There are {number} objects.");
	 * console.log(str.formatChoice(num, {
	 *   number: num
	 * }));
	 * </pre>
	 * 
	 * Gives the output:
	 * 
	 * <pre>
	 * "There are 2 objects."
	 * </pre>
	 * 
	 * The strings to format may contain replacement variables that will be formatted
	 * using the format() method above and the params argument as a source of values
	 * to use while formatting those variables.<p>
	 * 
	 * If the criterion for a particular choice is empty, that choice will be used
	 * as the default one for use when none of the other choice's criteria match.<p>
	 * 
	 * Example string:
	 * 
	 * <pre>
	 * var num = 22;
	 * var str = new ilib.String("0#There are no objects.|1#There is one object.|#There are {number} objects.");
	 * console.log(str.formatChoice(num, {
	 *   number: num
	 * }));
	 * </pre>
	 * 
	 * Gives the output:
	 * 
	 * <pre>
	 * "There are 22 objects."
	 * </pre>
	 * 
	 * If multiple choice patterns can match a given argument index, the first one 
	 * encountered in the string will be used. If no choice patterns match the 
	 * argument index, then the default choice will be used. If there is no default
	 * choice defined, then this method will return an empty string.<p>
	 * 
	 * <b>Special Syntax</b><p>
	 * 
	 * For any choice format string, all of the patterns in the string should be
	 * of a single type: numeric, boolean, or string/regexp. The type of the 
	 * patterns is determined by the type of the argument index parameter.<p>
	 * 
	 * If the argument index is numeric, then some special syntax can be used 
	 * in the patterns to match numeric ranges.<p>
	 * 
	 * <ul>
	 * <li><i>&gt;x</i> - match any number that is greater than x 
	 * <li><i>&gt;=x</i> - match any number that is greater than or equal to x
	 * <li><i>&lt;x</i> - match any number that is less than x
	 * <li><i>&lt;=x</i> - match any number that is less than or equal to x
	 * <li><i>start-end</i> - match any number in the range [start,end)
	 * <li><i>zero</i> - match any number in the class "zero". (See below for
	 * a description of number classes.)
	 * <li><i>one</i> - match any number in the class "one"
	 * <li><i>two</i> - match any number in the class "two"
	 * <li><i>few</i> - match any number in the class "few"
	 * <li><i>many</i> - match any number in the class "many"
	 * </ul>
	 * 
	 * A number class defines a set of numbers that receive a particular syntax
	 * in the strings. For example, in Slovenian, integers ending in the digit
	 * "1" are in the "one" class, including 1, 21, 31, ... 101, 111, etc.
	 * Similarly, integers ending in the digit "2" are in the "two" class. 
	 * Integers ending in the digits "3" or "4" are in the "few" class, and
	 * every other integer is handled by the default string.<p>
	 * 
	 * The definition of what numbers are included in a class is locale-dependent.
	 * They are defined in the data file plurals.json. If your string is in a
	 * different locale than the default for ilib, you should call the setLocale()
	 * method of the string instance before calling this method.<p> 
	 * 
	 * <b>Other Pattern Types</b><p>
	 * 
	 * If the argument index is a boolean, the string values "true" and "false" 
	 * may appear as the choice patterns.<p>
	 * 
	 * If the argument index is of type string, then the choice patterns may contain
	 * regular expressions, or static strings as degenerate regexps.
	 * 
	 * @param {*} argIndex The index into the choice array of the current parameter
	 * @param {Object} params The hash of parameter values that replace the replacement 
	 * variables in the string
	 * @throws "syntax error in choice format pattern: " if there is a syntax error
	 * @return {string} the formatted string
	 */
	formatChoice: function(argIndex, params) {
		var choices = this.str.split("|");
		var type = typeof(argIndex);
		var limits = [];
		var strings = [];
		var i;
		var parts;
		var limit;
		var arg;
		var result = undefined;
		var defaultCase = "";
	
		if (this.str.length === 0) {
			// nothing to do
			return "";
		}
		
		// first parse all the choices
		for (i = 0; i < choices.length; i++) {		
			parts = choices[i].split("#");		
			if (parts.length > 2) {
				limits[i] = parts[0];
				parts = parts.shift();			
				strings[i] = parts.join("#");
			} else if (parts.length === 2) {
				limits[i] = parts[0];
				strings[i] = parts[1];
			} else {
				// syntax error
				throw "syntax error in choice format pattern: " + choices[i];
			}		
		}
		
		// then apply the argument index
		for (i = 0; i < limits.length; i++) {
			if (limits[i].length === 0) {
				// this is default case
				defaultCase = new ilib.String(strings[i]);			
			} else {
				switch (type) {
					case 'number':
						arg = parseInt(argIndex, 10);
											
						if (limits[i].substring(0,2) === "<=") {						
							limit = parseFloat(limits[i].substring(2));
							if (arg <= limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].substring(0,2) === ">=") {						
							limit = parseFloat(limits[i].substring(2));
							if (arg >= limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].charAt(0) === "<") {						
							limit = parseFloat(limits[i].substring(1));
							if (arg < limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].charAt(0) === ">") {						
							limit = parseFloat(limits[i].substring(1));
							if (arg > limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else {
							this.locale = this.locale || new ilib.Locale(this.localeSpec);
							switch (limits[i]) {
								case "zero":
								case "one":
								case "two":
								case "few":
								case "many":
									// CLDR locale-dependent number classes
									var ruleset = ilib.data["plurals_" + this.locale.getLanguage()];
									if (ruleset) {
										var rule = ruleset[limits[i]];
										if (ilib.String._fncs.getValue(rule, arg)) {
											result = new ilib.String(strings[i]);
											i = limits.length;
										}
									}
									break;
								default:
									var dash = limits[i].indexOf("-");
									if (dash !== -1) {							
										// range
										var start = limits[i].substring(0, dash);
										var end = limits[i].substring(dash+1);							
										if (arg >= parseInt(start, 10) && arg <= parseInt(end, 10)) {								
											result = new ilib.String(strings[i]);
											i = limits.length;
										}
									} else if (arg === parseInt(limits[i], 10)) {							
										// exact amount
										result = new ilib.String(strings[i]);
										i = limits.length;
									}
									break;
							}
						}
						break;
					case 'boolean':					
						if (limits[i] === "true" && argIndex === true) {						
							result = new ilib.String(strings[i]);
							i = limits.length;
						} else if (limits[i] === "false" && argIndex === false) {						
							result = new ilib.String(strings[i]);
							i = limits.length;
						}
						break;
					case 'string':					
						var regexp = new RegExp(limits[i], "i");
						if (regexp.test(argIndex)) {
							result = new ilib.String(strings[i]);
							i = limits.length;
						}
						break;
					case 'object':
						throw "syntax error: fmtChoice parameter for the argument index cannot be an object";
				}
			}
		}
		
		if (!result) {		
			result = defaultCase || new ilib.String("");
		}
		
		result = result.format(params);
		
		return result.toString();
	},
	
	// delegates
	/**
	 * Same as String.toString()
	 * @return {string} this instance as regular Javascript string
	 */
	toString: function () {
		return this.str.toString();
	},
	
	/**
	 * Same as String.valueOf()
	 * @return {string} this instance as a regular Javascript string
	 */
	valueOf: function () {
		return this.str.valueOf();
	},
	
	/**
	 * Same as String.charAt()
	 * @param {number} index the index of the character being sought
	 * @return {ilib.String} the character at the given index
	 */
	charAt: function(index) {
		return new ilib.String(this.str.charAt(index));
	},
	
	/**
	 * Same as String.charCodeAt(). This only reports on 
	 * 2-byte UCS-2 Unicode values, and does not take into
	 * account supplementary characters encoded in UTF-16.
	 * If you would like to take account of those characters,
	 * use codePointAt() instead.
	 * @param {number} index the index of the character being sought
	 * @return {number} the character code of the character at the 
	 * given index in the string 
	 */
	charCodeAt: function(index) {
		return this.str.charCodeAt(index);
	},
	
	/**
	 * Same as String.concat()
	 * @param {string} strings strings to concatenate to the current one
	 * @return {ilib.String} a concatenation of the given strings
	 */
	concat: function(strings) {
		return new ilib.String(this.str.concat(strings));
	},
	
	/**
	 * Same as String.indexOf()
	 * @param {string} searchValue string to search for
	 * @param {number} start index into the string to start searching, or
	 * undefined to search the entire string
	 * @return {number} index into the string of the string being sought,
	 * or -1 if the string is not found 
	 */
	indexOf: function(searchValue, start) {
		return this.str.indexOf(searchValue, start);
	},
	
	/**
	 * Same as String.lastIndexOf()
	 * @param {string} searchValue string to search for
	 * @param {number} start index into the string to start searching, or
	 * undefined to search the entire string
	 * @return {number} index into the string of the string being sought,
	 * or -1 if the string is not found 
	 */
	lastIndexOf: function(searchValue, start) {
		return this.str.lastIndexOf(searchValue, start);
	},
	
	/**
	 * Same as String.match()
	 * @param {string} regexp the regular expression to match
	 * @return {Array.<string>} an array of matches
	 */
	match: function(regexp) {
		return this.str.match(regexp);
	},
	
	/**
	 * Same as String.replace()
	 * @param {string} searchValue a regular expression to search for
	 * @param {string} newValue the string to replace the matches with
	 * @return {ilib.String} a new string with all the matches replaced
	 * with the new value
	 */
	replace: function(searchValue, newValue) {
		return new ilib.String(this.str.replace(searchValue, newValue));
	},
	
	/**
	 * Same as String.search()
	 * @param {string} regexp the regular expression to search for
	 * @return {number} position of the match, or -1 for no match
	 */
	search: function(regexp) {
		return this.str.search(regexp);
	},
	
	/**
	 * Same as String.slice()
	 * @param {number} start first character to include in the string
	 * @param {number} end include all characters up to, but not including
	 * the end character
	 * @return {ilib.String} a slice of the current string
	 */
	slice: function(start, end) {
		return new ilib.String(this.str.slice(start, end));
	},
	
	/**
	 * Same as String.split()
	 * @param {string} separator regular expression to match to find
	 * separations between the parts of the text
	 * @param {number} limit maximum number of items in the final 
	 * output array. Any items beyond that limit will be ignored.
	 * @return {Array.<string>} the parts of the current string split 
	 * by the separator
	 */
	split: function(separator, limit) {
		return this.str.split(separator, limit);
	},
	
	/**
	 * Same as String.substr()
	 * @param {number} start the index of the character that should 
	 * begin the returned substring
	 * @param {number} length the number of characters to return after
	 * the start character.
	 * @return {ilib.String} the requested substring 
	 */
	substr: function(start, length) {
		return new ilib.String(this.str.substr(start, length));
	},
	
	/**
	 * Same as String.substring()
	 * @param {number} from the index of the character that should 
	 * begin the returned substring
	 * @param {number} to the index where to stop the extraction. If
	 * omitted, extracts the rest of the string
	 * @return {ilib.String} the requested substring 
	 */
	substring: function(from, to) {
		return this.str.substring(from, to);
	},
	
	/**
	 * Same as String.toLowerCase(). Note that this method is
	 * not locale-sensitive. 
	 * @return {ilib.String} a string with the first character
	 * lower-cased
	 */
	toLowerCase: function() {
		return this.str.toLowerCase();
	},
	
	/**
	 * Same as String.toUpperCase(). Note that this method is
	 * not locale-sensitive. Use toLocaleUpperCase() instead
	 * to get locale-sensitive behaviour. 
	 * @return {ilib.String} a string with the first character
	 * upper-cased
	 */
	toUpperCase: function() {
		return this.str.toUpperCase();
	},
	
	/**
	 * Convert the character or the surrogate pair at the given
	 * index into the string to a Unicode UCS-4 code point.
	 * @protected
	 * @param {number} index index into the string
	 * @return {number} code point of the character at the
	 * given index into the string
	 */
	_toCodePoint: function (index) {
		return ilib.String.toCodePoint(this.str, index);
	},
	
	/**
	 * Call the callback with each character in the string one at 
	 * a time, taking care to step through the surrogate pairs in 
	 * the UTF-16 encoding properly.<p>
	 * 
	 * The standard Javascript String's charAt() method only
	 * returns a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index to charAt() is pointing to a low- or 
	 * high-surrogate character,
	 * it will return the surrogate character rather 
	 * than the the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode. This function will call the callback with the full
	 * character, making sure to join two  
	 * surrogates into one character in the supplementary planes
	 * where necessary.<p>
	 * 
	 * @param {function(string)} callback a callback function to call with each
	 * full character in the current string
	 */
	forEach: function(callback) {
		if (typeof(callback) === 'function') {
			var it = this.charIterator();
			while (it.hasNext()) {
				callback(it.next());
			}
		}
	},

	/**
	 * Call the callback with each numeric code point in the string one at 
	 * a time, taking care to step through the surrogate pairs in 
	 * the UTF-16 encoding properly.<p>
	 * 
	 * The standard Javascript String's charCodeAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index to charCodeAt() is pointing to a low- or 
	 * high-surrogate character,
	 * it will return the code point of the surrogate character rather 
	 * than the code point of the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode. This function will call the callback with the full
	 * code point of each character, making sure to join two  
	 * surrogates into one code point in the supplementary planes.<p>
	 * 
	 * @param {function(string)} callback a callback function to call with each
	 * code point in the current string
	 */
	forEachCodePoint: function(callback) {
		if (typeof(callback) === 'function') {
			var it = this.iterator();
			while (it.hasNext()) {
				callback(it.next());
			}
		}
	},

	/**
	 * Return an iterator that will step through all of the characters
	 * in the string one at a time and return their code points, taking 
	 * care to step through the surrogate pairs in UTF-16 encoding 
	 * properly.<p>
	 * 
	 * The standard Javascript String's charCodeAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index is pointing to a low- or high-surrogate character,
	 * it will return a code point of the surrogate character rather 
	 * than the code point of the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode.<p>
	 * 
	 * The iterator instance returned has two methods, hasNext() which
	 * returns true if the iterator has more code points to iterate through,
	 * and next() which returns the next code point as a number.<p>
	 * 
	 * @return {Object} an iterator 
	 * that iterates through all the code points in the string
	 */
	iterator: function() {
		/**
		 * @constructor
		 */
		function _iterator (istring) {
			this.index = 0;
			this.hasNext = function () {
				return (this.index < istring.str.length);
			};
			this.next = function () {
				if (this.index < istring.str.length) {
					var num = istring._toCodePoint(this.index);
					this.index += ((num > 0xFFFF) ? 2 : 1);
				} else {
					num = -1;
				}
				return num;
			};
		};
		return new _iterator(this);
	},

	/**
	 * Return an iterator that will step through all of the characters
	 * in the string one at a time, taking 
	 * care to step through the surrogate pairs in UTF-16 encoding 
	 * properly.<p>
	 * 
	 * The standard Javascript String's charAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index is pointing to a low- or high-surrogate character,
	 * it will return that surrogate character rather 
	 * than the surrogate pair which represents a character 
	 * in the supplementary planes.<p>
	 * 
	 * The iterator instance returned has two methods, hasNext() which
	 * returns true if the iterator has more characters to iterate through,
	 * and next() which returns the next character.<p>
	 * 
	 * @return {Object} an iterator 
	 * that iterates through all the characters in the string
	 */
	charIterator: function() {
		/**
		 * @constructor
		 */
		function _chiterator (istring) {
			this.index = 0;
			this.hasNext = function () {
				return (this.index < istring.str.length);
			};
			this.next = function () {
				var ch;
				if (this.index < istring.str.length) {
					ch = istring.str.charAt(this.index);
					if (ilib.String._isSurrogate(ch) && 
							this.index+1 < istring.str.length && 
							ilib.String._isSurrogate(istring.str.charAt(this.index+1))) {
						this.index++;
						ch += istring.str.charAt(this.index);
					}
					this.index++;
				}
				return ch;
			};
		};
		return new _chiterator(this);
	},
	
	/**
	 * Return the code point at the given index when the string is viewed 
	 * as an array of code points. If the index is beyond the end of the
	 * array of code points or if the index is negative, -1 is returned.
	 * @param {number} index index of the code point 
	 * @return {number} code point of the character at the given index into
	 * the string
	 */
	codePointAt: function (index) {
		if (index < 0) {
			return -1;
		}
		var count,
			it = this.iterator(),
			ch;
		for (count = index; count >= 0 && it.hasNext(); count--) {
			ch = it.next();
		}
		return (count < 0) ? ch : -1;
	},
	
	/**
	 * Set the locale to use when processing choice formats. The locale
	 * affects how number classes are interpretted. In some cultures,
	 * the limit "few" maps to "any integer that ends in the digits 2 to 9" and
	 * in yet others, "few" maps to "any integer that ends in the digits
	 * 3 or 4".
	 * @param {ilib.Locale|string} locale locale to use when processing choice
	 * formats with this string
	 * @param {boolean=} sync [optional] whether to load the locale data synchronously 
	 * or not
	 * @param {Object=} loadParams [optional] parameters to pass to the loader function
	 * @param {function(*)=} onLoad [optional] function to call when the loading is done
	 */
	setLocale: function (locale, sync, loadParams, onLoad) {
		if (typeof(locale) === 'object') {
			this.locale = locale;
		} else {
			this.localeSpec = locale;
			this.locale = new ilib.Locale(locale);
		}
		
		ilib.String.loadPlurals(typeof(sync) !== 'undefined' ? sync : true, this.locale, loadParams, onLoad);
	},

	/**
	 * Return the locale to use when processing choice formats. The locale
	 * affects how number classes are interpretted. In some cultures,
	 * the limit "few" maps to "any integer that ends in the digits 2 to 9" and
	 * in yet others, "few" maps to "any integer that ends in the digits
	 * 3 or 4".
	 * @return {string} localespec to use when processing choice
	 * formats with this string
	 */
	getLocale: function () {
		return (this.locale ? this.locale.getSpec() : this.localeSpec) || ilib.getLocale();
	},

	/**
	 * Return the number of code points in this string. This may be different
	 * than the number of characters, as the UTF-16 encoding that Javascript
	 * uses for its basis returns surrogate pairs separately. Two 2-byte 
	 * surrogate characters together make up one character/code point in 
	 * the supplementary character planes. If your string contains no
	 * characters in the supplementary planes, this method will return the
	 * same thing as the length() method.
	 * @return {number} the number of code points in this string
	 */
	codePointLength: function () {
		if (this.cpLength === -1) {
			var it = this.iterator();
			this.cpLength = 0;
			while (it.hasNext()) { 
				this.cpLength++;
				it.next();
			};
		}
		return this.cpLength;	
	}
};
/*
 * calendar.js - Represent a calendar object.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends
ilibglobal.js
locale.js
localeinfo.js
*/

/**
 * Interface that all calendars must implement.
 * 
 * Depends directive: !depends calendar.js
 * 
 * @interface
 * @protected
 */
ilib.Cal = function() {
};

/**
 * Factory method to create a new instance of a calendar subclass.<p>
 * 
 * The options parameter can be an object that contains the following
 * properties:
 * 
 * <ul>
 * <li><i>type</i> - specify the type of the calendar desired. The
 * list of valid values changes depending on which calendars are 
 * defined. When assembling your iliball.js, include those calendars 
 * you wish to use in your program or web page, and they will register 
 * themselves with this factory method. The "official", "gregorian",
 * and "julian" calendars are all included by default, as they are the
 * standard calendars for much of the world.
 * <li><i>locale</i> - some calendars vary depending on the locale.
 * For example, the "official" calendar transitions from a Julian-style
 * calendar to a Gregorian-style calendar on a different date for
 * each country, as the governments of those countries decided to
 * adopt the Gregorian calendar at different times. 
 * </ul>
 * 
 * If a locale is specified, but no type, then the calendar that is default for
 * the locale will be instantiated and returned. If neither the type nor
 * the locale are specified, then the calendar for the default locale will
 * be used. 
 * 
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {ilib.Cal} an instance of a calendar object of the appropriate type
 */
ilib.Cal.newInstance = function (options) {
	var locale = options && options.locale,
	type = options && options.type,
	cons;

	if (!locale) {
		locale = new ilib.Locale();	// default locale
	}
	
	if (!type) {
		var info = new ilib.LocaleInfo(locale);
		type = info.getCalendar();
	}
	
	cons = ilib.Cal._constructors[type];
	
	// pass the same options through to the constructor so the subclass
	// has the ability to do something with if it needs to
	return cons && new cons(options);
};

/* place for the subclasses to put their constructors so that the factory method
 * can find them. Do this to add your calendar after it's defined: 
 * ilib.Cal._constructors["mytype"] = ilib.Cal.MyTypeConstructor;
 */
ilib.Cal._constructors = {};

/**
 * Return an array of known calendar types that the factory method can instantiate.
 * 
 * @return {Array.<string>} an array of calendar types
 */
ilib.Cal.getCalendars = function () {
	var arr = [],
		c;
	
	for (c in ilib.Cal._constructors) {
		if (c && ilib.Cal._constructors[c]) {
			arr.push(c); // code like a pirate
		}
	}
	
	return arr;
};

ilib.Cal.prototype = {
	/**
	 * Return the type of this calendar.
	 * 
	 * @return {string} the name of the type of this calendar 
	 */
	getType: function() {
		throw "Cannot call methods of abstract class ilib.Cal";
	},
	
	/**
	 * Return the number of months in the given year. The number of months in a year varies
	 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
	 * days in a year to an entire solar year. The month is represented as a 1-based number
	 * where 1=first month, 2=second month, etc.
	 * 
	 * @param {number} year a year for which the number of months is sought
	 * @return {number} The number of months in the given year
	 */
	getNumMonths: function(year) {
		throw "Cannot call methods of abstract class ilib.Cal";
	},
	
	/**
	 * Return the number of days in a particular month in a particular year. This function
	 * can return a different number for a month depending on the year because of things
	 * like leap years.
	 * 
	 * @param {number} month the month for which the length is sought
	 * @param {number} year the year within which that month can be found
	 * @return {number} the number of days within the given month in the given year
	 */
	getMonLength: function(month, year) {
		throw "Cannot call methods of abstract class ilib.Cal";
	},
	
	/**
	 * Return true if the given year is a leap year in this calendar.
	 * The year parameter may be given as a number.
	 * 
	 * @param {number} year the year for which the leap year information is being sought
	 * @return {boolean} true if the given year is a leap year
	 */
	isLeapYear: function(year) {
		throw "Cannot call methods of abstract class ilib.Cal";
	}
};

/*
 * julianday.js - A Julian date object.
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends locale.js */

/**
 * @class
 * A Julian Day class. A Julian Day is a date based on the Julian Day count
 * of time invented by Joseph Scaliger in 1583 for use with astronomical calculations. 
 * Do not confuse it with a date in the Julian calendar, which it has very
 * little in common with. The naming is unfortunately close, and comes from history.<p>
 * 
 * Depends directive: !depends julianday.js
 * 
 * @constructor
 * @param {number} num the Julian Day expressed as a floating point number 
 */
ilib.JulianDay = function(num) {
	this.jd = num;
	this.days = Math.floor(this.jd);
	this.frac = num - this.days;
};

ilib.JulianDay.prototype = {
	/**
	 * Return the integral portion of this Julian Day instance. This corresponds to
	 * the number of days since the beginning of the epoch.
	 * 
	 * @return {number} the integral portion of this Julian Day
	 */
	getDays: function() {
		return this.days;
	},
	
	/**
	 * Set the date of this Julian Day instance.
	 * 
	 * @param {number} days the julian date expressed as a floating point number
	 */
	setDays: function(days) {
		this.days = Math.floor(days);
		this.jd = this.days + this.frac;
	},
	
	/**
	 * Return the fractional portion of this Julian Day instance. This portion 
	 * corresponds to the time of day for the instance.
	 */
	getDayFraction: function() {
		return this.frac;
	},
	
	/**
	 * Set the fractional part of the Julian Day. The fractional part represents
	 * the portion of a fully day. Julian dates start at noon, and proceed until
	 * noon of the next day. That would mean midnight is represented as a fractional
	 * part of 0.5.
	 * 
	 * @param {number} fraction The fractional part of the Julian date
	 */
	setDayFraction: function(fraction) {
		var t = Math.floor(fraction);
		this.frac = fraction - t;
		this.jd = this.days + this.frac;
	},
	
	/** 
	 * Return the Julian Day expressed as a floating point number.
	 * @return {number} the Julian Day as a number
	 */
	getDate: function () {
		return this.jd;
	},
	
	/**
	 * Set the date of this Julian Day instance.
	 * 
	 * @param {number} num the numeric Julian Day to set into this instance
	 */
	setDate: function (num) {
		this.jd = num;
	},
	
	/**
	 * Add an offset to the current date instance. The offset should be expressed in
	 * terms of Julian days. That is, each integral unit represents one day of time, and
	 * fractional part represents a fraction of a regular 24-hour day.
	 * 
	 * @param {number} offset an amount to add (or subtract) to the current result instance.
	 */
	addDate: function(offset) {
		if (typeof(offset) === 'number') {
			this.jd += offset;
			this.days = Math.floor(this.jd);
			this.frac = this.jd - this.days;
		}
	}
};

/*
 * gregorian.js - Represent a Gregorian calendar object.
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js */

/**
 * @class
 * Construct a new Gregorian calendar object. This class encodes information about
 * a Gregorian calendar.<p>
 * 
 * Depends directive: !depends gregorian.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Gregorian = function() {
	this.type = "gregorian";
};

/**
 * the lengths of each month 
 * @private
 * @const
 * @type Array.<number> 
 */
ilib.Cal.Gregorian.monthLengths = [
	31,  /* Jan */
	28,  /* Feb */
	31,  /* Mar */
	30,  /* Apr */
	31,  /* May */
	30,  /* Jun */
	31,  /* Jul */
	31,  /* Aug */
	30,  /* Sep */
	31,  /* Oct */
	30,  /* Nov */
	31   /* Dec */
];

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 * @return {number} The number of months in the given year
 */
ilib.Cal.Gregorian.prototype.getNumMonths = function(year) {
	return 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
ilib.Cal.Gregorian.prototype.getMonLength = function(month, year) {
	if (month !== 2 || !this.isLeapYear(year)) {
		return ilib.Cal.Gregorian.monthLengths[month-1];
	} else {
		return 29;
	}
};

/**
 * Return true if the given year is a leap year in the Gregorian calendar.
 * The year parameter may be given as a number, or as a GregDate object.
 * @param {number|ilib.Date.GregDate} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Gregorian.prototype.isLeapYear = function(year) {
	var y = (typeof(year) === 'number' ? year : year.getYears());
	var centuries = ilib.mod(y, 400);
	return (ilib.mod(y, 4) === 0 && centuries !== 100 && centuries !== 200 && centuries !== 300);
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Gregorian.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Gregorian.prototype.newDateInstance = function (options) {
	return new ilib.Date.GregDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["gregorian"] = ilib.Cal.Gregorian;

/*
 * ratadie.js - Represent the RD date number in the calendar
 * 
 * Copyright © 2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
util/utils.js
util/math.js
julianday.js 
*/

/**
 * @class
 * Construct a new RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>cycle</i> - any integer giving the number of 60-year cycle in which the date is located.
 * If the cycle is not given but the year is, it is assumed that the year parameter is a fictitious 
 * linear count of years since the beginning of the epoch, much like other calendars. This linear
 * count is never used. If both the cycle and year are given, the year is wrapped to the range 0 
 * to 60 and treated as if it were a year in the regular 60-year cycle.
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means January, 2 means February, etc.
 * 
 * <li><i>day</i> - 1 to 31
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>parts</i> - 0 to 1079. Specify the halaqim parts of an hour. Either specify 
 * the parts or specify the minutes, seconds, and milliseconds, but not both. This is only used
 * in the Hebrew calendar. 
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends ratadie.js
 * 
 * @private
 * @constructor
 * @param {Object=} params parameters that govern the settings and behaviour of this RD date
 */
ilib.Date.RataDie = function(params) {
	if (params) {
		if (typeof(params.date) !== 'undefined') {
			// accept JS Date classes or strings
			var date = params.date;
			if (!(date instanceof Date)) {
				date = new Date(date); // maybe a string initializer?
			}
			this._setTime(date.getTime());
		} else if (typeof(params.unixtime) !== 'undefined') {
			this._setTime(parseInt(params.unixtime, 10));
		} else if (typeof(params.julianday) !== 'undefined') {
			// JD time is defined to be UTC
			this._setJulianDay(parseFloat(params.julianday));
		} else if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond || params.parts || params.cycle) {
			this._setDateComponents(params);
		} else if (typeof(params.rd) !== 'undefined') {
			this.rd = (typeof(params.rd) === 'object' && params.rd instanceof ilib.Date.RataDie) ? params.rd.rd : params.rd;
		}
	}
	
	/**
	 * @type {number} the Rata Die number of this date for this calendar type
	 */
	if (typeof(this.rd) === 'undefined') {
		var now = new Date();
		this._setTime(now.getTime());
	}
};

/**
 * @private
 * @const
 * @type {number}
 */
ilib.Date.RataDie.gregorianEpoch = 1721424.5;

ilib.Date.RataDie.prototype = {
	/**
	 * @protected
	 * @const
	 * @type {number}
	 * the difference between a zero Julian day and the zero Gregorian date. 
	 */
	epoch: ilib.Date.RataDie.gregorianEpoch,
	
	/**
	 * Set the RD of this instance according to the given unix time. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970.
	 *
	 * @protected
	 * @param {number} millis the unix time to set this date to in milliseconds 
	 */
	_setTime: function(millis) {
		// 2440587.5 is the julian day of midnight Jan 1, 1970, UTC (Gregorian)
		this._setJulianDay(2440587.5 + millis / 86400000);
	},

	/**
	 * Set the date of this instance using a Julian Day.
	 * @protected
	 * @param {number} date the Julian Day to use to set this date
	 */
	_setJulianDay: function (date) {
		var jd = (typeof(date) === 'number') ? new ilib.JulianDay(date) : date;
		// round to the nearest millisecond
		this.rd = ilib._roundFnc.halfup((jd.getDate() - this.epoch) * 86400000) / 86400000;
	},

	/**
	 * Return the rd number of the particular day of the week on or before the 
	 * given rd. eg. The Sunday on or before the given rd.
	 * @protected
	 * @param {number} rd the rata die date of the reference date
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the current date
	 * @return {number} the rd of the day of the week
	 */
	_onOrBefore: function(rd, dayOfWeek) {
		return rd - ilib.mod(Math.floor(rd) - dayOfWeek - 2, 7);
	},
	
	/**
	 * Return the rd number of the particular day of the week on or before the current rd.
	 * eg. The Sunday on or before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the current date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the rd of the day of the week
	 */
	onOrBefore: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd + offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week on or before the current rd.
	 * eg. The Sunday on or before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	onOrAfter: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd+6+offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week before the current rd.
	 * eg. The Sunday before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	before: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd-1+offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week after the current rd.
	 * eg. The Sunday after the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	after: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd+7+offset, dayOfWeek) - offset;
	},

	/**
	 * Return the unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. This method only
	 * returns a valid number for dates between midnight, Jan 1, 1970 and  
	 * Jan 19, 2038 at 3:14:07am when the unix time runs out. If this instance 
	 * encodes a date outside of that range, this method will return -1.
	 * 
	 * @return {number} a number giving the unix time, or -1 if the date is outside the
	 * valid unix time range
	 */
	getTime: function() {
		// earlier than Jan 1, 1970
		// or later than Jan 19, 2038 at 3:14:07am
		var jd = this.getJulianDay();
		if (jd < 2440587.5 || jd > 2465442.634803241) { 
			return -1;
		}
	
		// avoid the rounding errors in the floating point math by only using
		// the whole days from the rd, and then calculating the milliseconds directly
		return Math.round((jd - 2440587.5) * 86400000);
	},

	/**
	 * Return the extended unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. Traditionally unix time
	 * (or the type "time_t" in C/C++) is only encoded with a unsigned 32 bit integer, and thus 
	 * runs out on Jan 19, 2038. However, most Javascript engines encode numbers well above 
	 * 32 bits and the Date object allows you to encode up to 100 million days worth of time 
	 * after Jan 1, 1970, and even more interestingly 100 million days worth of time before
	 * Jan 1, 1970 as well. This method returns the number of milliseconds in that extended 
	 * range. If this instance encodes a date outside of that range, this method will return
	 * NaN.
	 * 
	 * @return {number} a number giving the extended unix time, or NaN if the date is outside 
	 * the valid extended unix time range
	 */
	getTimeExtended: function() {
		var jd = this.getJulianDay();
		
		// test if earlier than Jan 1, 1970 - 100 million days
		// or later than Jan 1, 1970 + 100 million days
		if (jd < -97559412.5 || jd > 102440587.5) { 
			return NaN;
		}
	
		// avoid the rounding errors in the floating point math by only using
		// the whole days from the rd, and then calculating the milliseconds directly
		return Math.round((jd - 2440587.5) * 86400000);
	},

	/**
	 * Return the Julian Day equivalent to this calendar date as a number.
	 * This returns the julian day in UTC.
	 * 
	 * @return {number} the julian date equivalent of this date
	 */
	getJulianDay: function() {
		return this.rd + this.epoch;
	},

	/**
	 * Return the Rata Die (fixed day) number of this RD date.
	 * 
	 * @return {number} the rd date as a number
	 */
	getRataDie: function() {
		return this.rd;
	}
};

/*
 * gregratadie.js - Represent the RD date number in the Gregorian calendar
 * 
 * Copyright © 2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
date.js
calendar/gregorian.js
calendar/ratadie.js
util/utils.js
util/math.js
julianday.js 
*/

/**
 * @class
 * Construct a new Gregorian RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means January, 2 means February, etc.
 * 
 * <li><i>day</i> - 1 to 31
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Gregorian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends gregratadie.js
 * 
 * @private
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Gregorian RD date
 */
ilib.Date.GregRataDie = function(params) {
	this.cal = params && params.cal || new ilib.Cal.Gregorian();
	/** @type {number|undefined} */
	this.rd = undefined;
	ilib.Date.RataDie.call(this, params);
};

ilib.Date.GregRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.GregRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.GregRataDie.prototype.constructor = ilib.Date.GregRataDie;

/**
 * the cumulative lengths of each month, for a non-leap year 
 * @private
 * @const
 * @type Array.<number>
 */
ilib.Date.GregRataDie.cumMonthLengths = [
    0,   /* Jan */
	31,  /* Feb */
	59,  /* Mar */
	90,  /* Apr */
	120, /* May */
	151, /* Jun */
	181, /* Jul */
	212, /* Aug */
	243, /* Sep */
	273, /* Oct */
	304, /* Nov */
	334, /* Dec */
	365
];

/**
 * the cumulative lengths of each month, for a leap year 
 * @private
 * @const
 * @type Array.<number>
 */
ilib.Date.GregRataDie.cumMonthLengthsLeap = [
	0,   /* Jan */
	31,  /* Feb */
	60,  /* Mar */
	91,  /* Apr */
	121, /* May */
	152, /* Jun */
	182, /* Jul */
	213, /* Aug */
	244, /* Sep */
	274, /* Oct */
	305, /* Nov */
	335, /* Dec */
	366
];

/**
 * Calculate the Rata Die (fixed day) number of the given date.
 * 
 * @private
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.GregRataDie.prototype._setDateComponents = function(date) {
	var year = parseInt(date.year, 10) || 0;
	var month = parseInt(date.month, 10) || 1;
	var day = parseInt(date.day, 10) || 1;
	var hour = parseInt(date.hour, 10) || 0;
	var minute = parseInt(date.minute, 10) || 0;
	var second = parseInt(date.second, 10) || 0;
	var millisecond = parseInt(date.millisecond, 10) || 0;

	var years = 365 * (year - 1) +
		Math.floor((year-1)/4) -
		Math.floor((year-1)/100) +
		Math.floor((year-1)/400);
	
	var dayInYear = (month > 1 ? ilib.Date.GregRataDie.cumMonthLengths[month-1] : 0) +
		day +
		(ilib.Cal.Gregorian.prototype.isLeapYear.call(this.cal, year) && month > 2 ? 1 : 0);
	var rdtime = (hour * 3600000 +
		minute * 60000 +
		second * 1000 +
		millisecond) / 
		86400000; 
	/*
	debug("getRataDie: converting " +  JSON.stringify(this));
	debug("getRataDie: year is " +  years);
	debug("getRataDie: day in year is " +  dayInYear);
	debug("getRataDie: rdtime is " +  rdtime);
	debug("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	
	/**
	 * @type {number|undefined} the RD number of this Gregorian date
	 */
	this.rd = years + dayInYear + rdtime;
};

/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
ilib.Date.GregRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek, 7);
};

ilib.data.zoneinfo["America/New_York"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Detroit"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Chicago"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"C{c}T","o":"-6:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Central {c} Time"};
ilib.data.zoneinfo["America/Menominee"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"C{c}T","o":"-6:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Central {c} Time"};
ilib.data.zoneinfo["America/Denver"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"M{c}T","o":"-7:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Mountain {c} Time"};
ilib.data.zoneinfo["America/Boise"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"M{c}T","o":"-7:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Mountain {c} Time"};
ilib.data.zoneinfo["America/Phoenix"] = {"f":"MST","o":"-7:0","c":"US","n":"US Mountain {c} Time"};
ilib.data.zoneinfo["America/Los_Angeles"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"P{c}T","o":"-8:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Pacific {c} Time"};
ilib.data.zoneinfo["America/Metlakatla"] = {"f":"PST","o":"-8:0","c":"US"};
ilib.data.zoneinfo["America/Anchorage"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"AK{c}T","o":"-9:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Alaskan {c} Time"};
ilib.data.zoneinfo["America/Juneau"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"AK{c}T","o":"-9:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Alaskan {c} Time"};
ilib.data.zoneinfo["America/Sitka"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"AK{c}T","o":"-9:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Alaskan {c} Time"};
ilib.data.zoneinfo["America/Yakutat"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"AK{c}T","o":"-9:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Alaskan {c} Time"};
ilib.data.zoneinfo["America/Nome"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"AK{c}T","o":"-9:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US","n":"Alaskan {c} Time"};
ilib.data.zoneinfo["America/Adak"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"HA{c}T","o":"-10:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"US"};
ilib.data.zoneinfo["Pacific/Honolulu"] = {"f":"HST","o":"-10:0","c":"US","n":"Hawaiian {c} Time"};
ilib.data.zoneinfo["Europe/London"] = {"e":{"m":10,"r":"l0","t":"2:0"},"f":"GMT/BST","o":"0:0","s":{"c":"S","m":3,"r":"l0","t":"1:0","v":"1:0"},"c":"GB","n":"GMT {c} Time"};
ilib.data.zoneinfo["Europe/Berlin"] = {"e":{"m":10,"r":"l0","t":"3:0"},"f":"CE{c}T","o":"1:0","s":{"c":"S","m":3,"r":"l0","t":"2:0","v":"1:0"},"c":"DE","n":"W. Europe {c} Time"};
ilib.data.zoneinfo["Europe/Madrid"] = {"e":{"m":10,"r":"l0","t":"3:0"},"f":"CE{c}T","o":"1:0","s":{"c":"S","m":3,"r":"l0","t":"2:0","v":"1:0"},"c":"ES","n":"Romance {c} Time"};
ilib.data.zoneinfo["Africa/Ceuta"] = {"e":{"m":10,"r":"l0","t":"3:0"},"f":"CE{c}T","o":"1:0","s":{"c":"S","m":3,"r":"l0","t":"2:0","v":"1:0"},"c":"ES","n":"Romance {c} Time"};
ilib.data.zoneinfo["Atlantic/Canary"] = {"e":{"m":10,"r":"l0","t":"2:0"},"f":"WE{c}T","o":"0:0","s":{"c":"S","m":3,"r":"l0","t":"1:0","v":"1:0"},"c":"ES","n":"GMT {c} Time"};
ilib.data.zoneinfo["Europe/Rome"] = {"e":{"m":10,"r":"l0","t":"3:0"},"f":"CE{c}T","o":"1:0","s":{"c":"S","m":3,"r":"l0","t":"2:0","v":"1:0"},"c":"IT","n":"W. Europe {c} Time"};
ilib.data.zoneinfo["Europe/Paris"] = {"e":{"m":10,"r":"l0","t":"3:0"},"f":"CE{c}T","o":"1:0","s":{"c":"S","m":3,"r":"l0","t":"2:0","v":"1:0"},"c":"FR","n":"Romance {c} Time"};
ilib.data.zoneinfo["America/St_Johns"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"N{c}T","o":"-3:30","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Newfoundland {c} Time"};
ilib.data.zoneinfo["America/Halifax"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"A{c}T","o":"-4:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Atlantic {c} Time"};
ilib.data.zoneinfo["America/Glace_Bay"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"A{c}T","o":"-4:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Atlantic {c} Time"};
ilib.data.zoneinfo["America/Moncton"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"A{c}T","o":"-4:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Atlantic {c} Time"};
ilib.data.zoneinfo["America/Goose_Bay"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"A{c}T","o":"-4:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Atlantic {c} Time"};
ilib.data.zoneinfo["America/Blanc-Sablon"] = {"f":"AST","o":"-4:0","c":"CA","n":"SA Western {c} Time"};
ilib.data.zoneinfo["America/Toronto"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Nipigon"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Thunder_Bay"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Iqaluit"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Pangnirtung"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Resolute"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"C{c}T","o":"-6:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Central {c} Time"};
ilib.data.zoneinfo["America/Atikokan"] = {"f":"EST","o":"-5:0","c":"CA","n":"SA Pacific {c} Time"};
ilib.data.zoneinfo["America/Rankin_Inlet"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"C{c}T","o":"-6:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Central {c} Time"};
ilib.data.zoneinfo["America/Winnipeg"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"C{c}T","o":"-6:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Central {c} Time"};
ilib.data.zoneinfo["America/Rainy_River"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"C{c}T","o":"-6:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Central {c} Time"};
ilib.data.zoneinfo["America/Regina"] = {"f":"CST","o":"-6:0","c":"CA","n":"Canada Central {c} Time"};
ilib.data.zoneinfo["America/Swift_Current"] = {"f":"CST","o":"-6:0","c":"CA","n":"Canada Central {c} Time"};
ilib.data.zoneinfo["America/Edmonton"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"M{c}T","o":"-7:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Mountain {c} Time"};
ilib.data.zoneinfo["America/Cambridge_Bay"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"M{c}T","o":"-7:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Mountain {c} Time"};
ilib.data.zoneinfo["America/Yellowknife"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"M{c}T","o":"-7:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Mountain {c} Time"};
ilib.data.zoneinfo["America/Inuvik"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"M{c}T","o":"-7:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Mountain {c} Time"};
ilib.data.zoneinfo["America/Creston"] = {"f":"MST","o":"-7:0","c":"CA","n":"US Mountain {c} Time"};
ilib.data.zoneinfo["America/Dawson_Creek"] = {"f":"MST","o":"-7:0","c":"CA","n":"US Mountain {c} Time"};
ilib.data.zoneinfo["America/Vancouver"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"P{c}T","o":"-8:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Pacific {c} Time"};
ilib.data.zoneinfo["America/Whitehorse"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"P{c}T","o":"-8:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Pacific {c} Time"};
ilib.data.zoneinfo["America/Dawson"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"P{c}T","o":"-8:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"c":"CA","n":"Pacific {c} Time"};
ilib.data.zoneinfo["America/Montreal"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"n":"Eastern {c} Time"};
ilib.data.zoneinfo["America/Noronha"] = {"f":"FNT","o":"-2:0","c":"BR","n":"UTC-02"};
ilib.data.zoneinfo["America/Belem"] = {"f":"BRT","o":"-3:0","c":"BR","n":"SA Eastern {c} Time"};
ilib.data.zoneinfo["America/Fortaleza"] = {"f":"BRT","o":"-3:0","c":"BR","n":"SA Eastern {c} Time"};
ilib.data.zoneinfo["America/Recife"] = {"f":"BRT","o":"-3:0","c":"BR","n":"SA Eastern {c} Time"};
ilib.data.zoneinfo["America/Araguaina"] = {"f":"BRT","o":"-3:0","c":"BR","n":"SA Eastern {c} Time"};
ilib.data.zoneinfo["America/Maceio"] = {"f":"BRT","o":"-3:0","c":"BR","n":"SA Eastern {c} Time"};
ilib.data.zoneinfo["America/Bahia"] = {"f":"BRT","o":"-3:0","c":"BR","n":"Bahia {c} Time"};
ilib.data.zoneinfo["America/Sao_Paulo"] = {"e":{"m":2,"r":"0>22","t":"0:0"},"f":"BR{c}T","o":"-3:0","s":{"c":"S","m":10,"r":"0>15","t":"0:0","v":"1:0"},"c":"BR","n":"E. South America {c} Time"};
ilib.data.zoneinfo["America/Campo_Grande"] = {"e":{"m":2,"r":"0>22","t":"0:0"},"f":"AM{c}T","o":"-4:0","s":{"c":"S","m":10,"r":"0>15","t":"0:0","v":"1:0"},"c":"BR","n":"Central Brazilian {c} Time"};
ilib.data.zoneinfo["America/Cuiaba"] = {"e":{"m":2,"r":"0>22","t":"0:0"},"f":"AM{c}T","o":"-4:0","s":{"c":"S","m":10,"r":"0>15","t":"0:0","v":"1:0"},"c":"BR","n":"Central Brazilian {c} Time"};
ilib.data.zoneinfo["America/Santarem"] = {"f":"BRT","o":"-3:0","c":"BR","n":"SA Eastern {c} Time"};
ilib.data.zoneinfo["America/Porto_Velho"] = {"f":"AMT","o":"-4:0","c":"BR","n":"SA Western {c} Time"};
ilib.data.zoneinfo["America/Boa_Vista"] = {"f":"AMT","o":"-4:0","c":"BR","n":"SA Western {c} Time"};
ilib.data.zoneinfo["America/Manaus"] = {"f":"AMT","o":"-4:0","c":"BR","n":"SA Western {c} Time"};
ilib.data.zoneinfo["America/Eirunepe"] = {"f":"ACT","o":"-5:0","c":"BR","n":"SA Pacific {c} Time"};
ilib.data.zoneinfo["America/Rio_Branco"] = {"f":"ACT","o":"-5:0","c":"BR","n":"SA Pacific {c} Time"};
ilib.data.zoneinfo["Asia/Seoul"] = {"f":"KST","o":"9:0","c":"KR","n":"Korea {c} Time"};
ilib.data.zoneinfo["Asia/Shanghai"] = {"f":"CST","o":"8:0","c":"CN","n":"China {c} Time"};
ilib.data.zoneinfo["Asia/Harbin"] = {"f":"CST","o":"8:0","c":"CN"};
ilib.data.zoneinfo["Asia/Chongqing"] = {"f":"CST","o":"8:0","c":"CN"};
ilib.data.zoneinfo["Asia/Urumqi"] = {"f":"XJT","o":"6:0","c":"CN","n":"Central Asia {c} Time"};
ilib.data.zoneinfo["Asia/Kashgar"] = {"f":"CST","o":"8:0","c":"CN"};
ilib.data.zoneinfo["Asia/Tokyo"] = {"f":"JST","o":"9:0","c":"JP","n":"Tokyo {c} Time"};
ilib.data.zoneinfo["Europe/Kaliningrad"] = {"f":"EET","o":"2:0","c":"RU","n":"Kaliningrad {c} Time"};
ilib.data.zoneinfo["Europe/Moscow"] = {"f":"MSK","o":"3:0","c":"RU","n":"Russian {c} Time"};
ilib.data.zoneinfo["Europe/Simferopol"] = {"f":"MSK","o":"3:0","c":"RU","n":"Russian {c} Time"};
ilib.data.zoneinfo["Europe/Volgograd"] = {"f":"MSK","o":"3:0","c":"RU","n":"Russian {c} Time"};
ilib.data.zoneinfo["Europe/Samara"] = {"f":"SAMT","o":"4:0","c":"RU","n":"Russian {c} Time"};
ilib.data.zoneinfo["Asia/Yekaterinburg"] = {"f":"YEKT","o":"5:0","c":"RU","n":"Ekaterinburg {c} Time"};
ilib.data.zoneinfo["Asia/Omsk"] = {"f":"OMST","o":"6:0","c":"RU","n":"N. Central Asia {c} Time"};
ilib.data.zoneinfo["Asia/Novosibirsk"] = {"f":"NOVT","o":"6:0","c":"RU","n":"N. Central Asia {c} Time"};
ilib.data.zoneinfo["Asia/Novokuznetsk"] = {"f":"KRAT","o":"7:0","c":"RU","n":"N. Central Asia {c} Time"};
ilib.data.zoneinfo["Asia/Krasnoyarsk"] = {"f":"KRAT","o":"7:0","c":"RU","n":"North Asia {c} Time"};
ilib.data.zoneinfo["Asia/Irkutsk"] = {"f":"IRKT","o":"8:0","c":"RU","n":"North Asia East {c} Time"};
ilib.data.zoneinfo["Asia/Chita"] = {"f":"IRKT","o":"8:0","c":"RU","n":"Yakutsk {c} Time"};
ilib.data.zoneinfo["Asia/Yakutsk"] = {"f":"YAKT","o":"9:0","c":"RU","n":"Yakutsk {c} Time"};
ilib.data.zoneinfo["Asia/Khandyga"] = {"f":"YAKT","o":"9:0","c":"RU","n":"Yakutsk {c} Time"};
ilib.data.zoneinfo["Asia/Vladivostok"] = {"f":"VLAT","o":"10:0","c":"RU","n":"Vladivostok {c} Time"};
ilib.data.zoneinfo["Asia/Sakhalin"] = {"f":"SAKT","o":"10:0","c":"RU","n":"Vladivostok {c} Time"};
ilib.data.zoneinfo["Asia/Ust-Nera"] = {"f":"VLAT","o":"10:0","c":"RU","n":"Vladivostok {c} Time"};
ilib.data.zoneinfo["Asia/Magadan"] = {"f":"MAGT","o":"10:0","c":"RU","n":"Magadan {c} Time"};
ilib.data.zoneinfo["Asia/Srednekolymsk"] = {"f":"SRET","o":"11:0","c":"RU","n":"Magadan {c} Time"};
ilib.data.zoneinfo["Asia/Kamchatka"] = {"f":"PETT","o":"12:0","c":"RU","n":"Magadan {c} Time"};
ilib.data.zoneinfo["Asia/Anadyr"] = {"f":"ANAT","o":"12:0","c":"RU","n":"Magadan {c} Time"};
ilib.data.zoneinfo["WET"] = {"e":{"m":10,"r":"l0","t":"2:0"},"f":"WE{c}T","o":"0:0","s":{"c":"S","m":3,"r":"l0","t":"1:0","v":"1:0"}};
ilib.data.zoneinfo["PST8PDT"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"P{c}T","o":"-8:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"n":"Pacific {c} Time"};
ilib.data.zoneinfo["Iceland"] = {"f":"GMT","o":"0:0","c":"IS"};
ilib.data.zoneinfo["MST7MDT"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"M{c}T","o":"-7:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"n":"Mountain {c} Time"};
ilib.data.zoneinfo["EST5EDT"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"E{c}T","o":"-5:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"n":"Eastern {c} Time"};
ilib.data.zoneinfo["MET"] = {"e":{"m":10,"r":"l0","t":"3:0"},"f":"ME{c}T","o":"1:0","s":{"c":"S","m":3,"r":"l0","t":"2:0","v":"1:0"}};
ilib.data.zoneinfo["CET"] = {"e":{"m":10,"r":"l0","t":"3:0"},"f":"CE{c}T","o":"1:0","s":{"c":"S","m":3,"r":"l0","t":"2:0","v":"1:0"}};
ilib.data.zoneinfo["CST6CDT"] = {"e":{"c":"S","m":11,"r":"0>1","t":"2:0"},"f":"C{c}T","o":"-6:0","s":{"c":"D","m":3,"r":"0>8","t":"2:0","v":"1:0"},"n":"Central {c} Time"};
ilib.data.zoneinfo["MST"] = {"f":"MST","o":"-7:0"};
ilib.data.zoneinfo["EET"] = {"e":{"m":10,"r":"l0","t":"4:0"},"f":"EE{c}T","o":"2:0","s":{"c":"S","m":3,"r":"l0","t":"3:0","v":"1:0"}};
ilib.data.zoneinfo["zonetab"] = {"AD":["Europe/Andorra"],"AE":["Asia/Dubai"],"AF":["Asia/Kabul"],"AG":["America/Antigua"],"AI":["America/Anguilla"],"AL":["Europe/Tirane"],"AM":["Asia/Yerevan"],"AO":["Africa/Luanda"],"AQ":["Antarctica/McMurdo","Antarctica/Rothera","Antarctica/Palmer","Antarctica/Mawson","Antarctica/Davis","Antarctica/Casey","Antarctica/Vostok","Antarctica/DumontDUrville","Antarctica/Syowa","Antarctica/Troll"],"AR":["America/Argentina/Buenos_Aires","America/Argentina/Cordoba","America/Argentina/Salta","America/Argentina/Jujuy","America/Argentina/Tucuman","America/Argentina/Catamarca","America/Argentina/La_Rioja","America/Argentina/San_Juan","America/Argentina/Mendoza","America/Argentina/San_Luis","America/Argentina/Rio_Gallegos","America/Argentina/Ushuaia"],"AS":["Pacific/Pago_Pago"],"AT":["Europe/Vienna"],"AU":["Australia/Lord_Howe","Antarctica/Macquarie","Australia/Hobart","Australia/Currie","Australia/Melbourne","Australia/Sydney","Australia/Broken_Hill","Australia/Brisbane","Australia/Lindeman","Australia/Adelaide","Australia/Darwin","Australia/Perth","Australia/Eucla"],"AW":["America/Aruba"],"AX":["Europe/Mariehamn"],"AZ":["Asia/Baku"],"BA":["Europe/Sarajevo"],"BB":["America/Barbados"],"BD":["Asia/Dhaka"],"BE":["Europe/Brussels"],"BF":["Africa/Ouagadougou"],"BG":["Europe/Sofia"],"BH":["Asia/Bahrain"],"BI":["Africa/Bujumbura"],"BJ":["Africa/Porto-Novo"],"BL":["America/St_Barthelemy"],"BM":["Atlantic/Bermuda"],"BN":["Asia/Brunei"],"BO":["America/La_Paz"],"BQ":["America/Kralendijk"],"BR":["America/Noronha","America/Belem","America/Fortaleza","America/Recife","America/Araguaina","America/Maceio","America/Bahia","America/Sao_Paulo","America/Campo_Grande","America/Cuiaba","America/Santarem","America/Porto_Velho","America/Boa_Vista","America/Manaus","America/Eirunepe","America/Rio_Branco"],"BS":["America/Nassau"],"BT":["Asia/Thimphu"],"BW":["Africa/Gaborone"],"BY":["Europe/Minsk"],"BZ":["America/Belize"],"CA":["America/St_Johns","America/Halifax","America/Glace_Bay","America/Moncton","America/Goose_Bay","America/Blanc-Sablon","America/Toronto","America/Nipigon","America/Thunder_Bay","America/Iqaluit","America/Pangnirtung","America/Resolute","America/Atikokan","America/Rankin_Inlet","America/Winnipeg","America/Rainy_River","America/Regina","America/Swift_Current","America/Edmonton","America/Cambridge_Bay","America/Yellowknife","America/Inuvik","America/Creston","America/Dawson_Creek","America/Vancouver","America/Whitehorse","America/Dawson","America/Montreal"],"CC":["Indian/Cocos"],"CD":["Africa/Kinshasa","Africa/Lubumbashi"],"CF":["Africa/Bangui"],"CG":["Africa/Brazzaville"],"CH":["Europe/Zurich"],"CI":["Africa/Abidjan"],"CK":["Pacific/Rarotonga"],"CL":["America/Santiago","Pacific/Easter"],"CM":["Africa/Douala"],"CN":["Asia/Shanghai","Asia/Harbin","Asia/Chongqing","Asia/Urumqi","Asia/Kashgar"],"CO":["America/Bogota"],"CR":["America/Costa_Rica"],"CU":["America/Havana"],"CV":["Atlantic/Cape_Verde"],"CW":["America/Curacao"],"CX":["Indian/Christmas"],"CY":["Asia/Nicosia"],"CZ":["Europe/Prague"],"DE":["Europe/Berlin","Europe/Busingen"],"DJ":["Africa/Djibouti"],"DK":["Europe/Copenhagen"],"DM":["America/Dominica"],"DO":["America/Santo_Domingo"],"DZ":["Africa/Algiers"],"EC":["America/Guayaquil","Pacific/Galapagos"],"EE":["Europe/Tallinn"],"EG":["Africa/Cairo"],"EH":["Africa/El_Aaiun"],"ER":["Africa/Asmara"],"ES":["Europe/Madrid","Africa/Ceuta","Atlantic/Canary"],"ET":["Africa/Addis_Ababa"],"FI":["Europe/Helsinki"],"FJ":["Pacific/Fiji"],"FK":["Atlantic/Stanley"],"FM":["Pacific/Chuuk","Pacific/Pohnpei","Pacific/Kosrae"],"FO":["Atlantic/Faroe"],"FR":["Europe/Paris"],"GA":["Africa/Libreville"],"GB":["Europe/London"],"GD":["America/Grenada"],"GE":["Asia/Tbilisi"],"GF":["America/Cayenne"],"GG":["Europe/Guernsey"],"GH":["Africa/Accra"],"GI":["Europe/Gibraltar"],"GL":["America/Godthab","America/Danmarkshavn","America/Scoresbysund","America/Thule"],"GM":["Africa/Banjul"],"GN":["Africa/Conakry"],"GP":["America/Guadeloupe"],"GQ":["Africa/Malabo"],"GR":["Europe/Athens"],"GS":["Atlantic/South_Georgia"],"GT":["America/Guatemala"],"GU":["Pacific/Guam"],"GW":["Africa/Bissau"],"GY":["America/Guyana"],"HK":["Asia/Hong_Kong"],"HN":["America/Tegucigalpa"],"HR":["Europe/Zagreb"],"HT":["America/Port-au-Prince"],"HU":["Europe/Budapest"],"ID":["Asia/Jakarta","Asia/Pontianak","Asia/Makassar","Asia/Jayapura"],"IE":["Europe/Dublin"],"IL":["Asia/Jerusalem"],"IM":["Europe/Isle_of_Man"],"IN":["Asia/Kolkata"],"IO":["Indian/Chagos"],"IQ":["Asia/Baghdad"],"IR":["Asia/Tehran"],"IS":["Atlantic/Reykjavik"],"IT":["Europe/Rome"],"JE":["Europe/Jersey"],"JM":["America/Jamaica"],"JO":["Asia/Amman"],"JP":["Asia/Tokyo"],"KE":["Africa/Nairobi"],"KG":["Asia/Bishkek"],"KH":["Asia/Phnom_Penh"],"KI":["Pacific/Tarawa","Pacific/Enderbury","Pacific/Kiritimati"],"KM":["Indian/Comoro"],"KN":["America/St_Kitts"],"KP":["Asia/Pyongyang"],"KR":["Asia/Seoul"],"KW":["Asia/Kuwait"],"KY":["America/Cayman"],"KZ":["Asia/Almaty","Asia/Qyzylorda","Asia/Aqtobe","Asia/Aqtau","Asia/Oral"],"LA":["Asia/Vientiane"],"LB":["Asia/Beirut"],"LC":["America/St_Lucia"],"LI":["Europe/Vaduz"],"LK":["Asia/Colombo"],"LR":["Africa/Monrovia"],"LS":["Africa/Maseru"],"LT":["Europe/Vilnius"],"LU":["Europe/Luxembourg"],"LV":["Europe/Riga"],"LY":["Africa/Tripoli"],"MA":["Africa/Casablanca"],"MC":["Europe/Monaco"],"MD":["Europe/Chisinau"],"ME":["Europe/Podgorica"],"MF":["America/Marigot"],"MG":["Indian/Antananarivo"],"MH":["Pacific/Majuro","Pacific/Kwajalein"],"MK":["Europe/Skopje"],"ML":["Africa/Bamako"],"MM":["Asia/Rangoon"],"MN":["Asia/Ulaanbaatar","Asia/Hovd","Asia/Choibalsan"],"MO":["Asia/Macau"],"MP":["Pacific/Saipan"],"MQ":["America/Martinique"],"MR":["Africa/Nouakchott"],"MS":["America/Montserrat"],"MT":["Europe/Malta"],"MU":["Indian/Mauritius"],"MV":["Indian/Maldives"],"MW":["Africa/Blantyre"],"MX":["America/Mexico_City","America/Cancun","America/Merida","America/Monterrey","America/Matamoros","America/Mazatlan","America/Chihuahua","America/Ojinaga","America/Hermosillo","America/Tijuana","America/Santa_Isabel","America/Bahia_Banderas"],"MY":["Asia/Kuala_Lumpur","Asia/Kuching"],"MZ":["Africa/Maputo"],"NA":["Africa/Windhoek"],"NC":["Pacific/Noumea"],"NE":["Africa/Niamey"],"NF":["Pacific/Norfolk"],"NG":["Africa/Lagos"],"NI":["America/Managua"],"NL":["Europe/Amsterdam"],"NO":["Europe/Oslo"],"NP":["Asia/Kathmandu"],"NR":["Pacific/Nauru"],"NU":["Pacific/Niue"],"NZ":["Pacific/Auckland","Pacific/Chatham"],"OM":["Asia/Muscat"],"PA":["America/Panama"],"PE":["America/Lima"],"PF":["Pacific/Tahiti","Pacific/Marquesas","Pacific/Gambier"],"PG":["Pacific/Port_Moresby","Pacific/Bougainville"],"PH":["Asia/Manila"],"PK":["Asia/Karachi"],"PL":["Europe/Warsaw"],"PM":["America/Miquelon"],"PN":["Pacific/Pitcairn"],"PR":["America/Puerto_Rico"],"PS":["Asia/Gaza","Asia/Hebron"],"PT":["Europe/Lisbon","Atlantic/Madeira","Atlantic/Azores"],"PW":["Pacific/Palau"],"PY":["America/Asuncion"],"QA":["Asia/Qatar"],"RE":["Indian/Reunion"],"RO":["Europe/Bucharest"],"RS":["Europe/Belgrade"],"RU":["Europe/Kaliningrad","Europe/Moscow","Europe/Simferopol","Europe/Volgograd","Europe/Samara","Asia/Yekaterinburg","Asia/Omsk","Asia/Novosibirsk","Asia/Novokuznetsk","Asia/Krasnoyarsk","Asia/Irkutsk","Asia/Chita","Asia/Yakutsk","Asia/Khandyga","Asia/Vladivostok","Asia/Sakhalin","Asia/Ust-Nera","Asia/Magadan","Asia/Srednekolymsk","Asia/Kamchatka","Asia/Anadyr"],"RW":["Africa/Kigali"],"SA":["Asia/Riyadh"],"SB":["Pacific/Guadalcanal"],"SC":["Indian/Mahe"],"SD":["Africa/Khartoum"],"SE":["Europe/Stockholm"],"SG":["Asia/Singapore"],"SH":["Atlantic/St_Helena"],"SI":["Europe/Ljubljana"],"SJ":["Arctic/Longyearbyen"],"SK":["Europe/Bratislava"],"SL":["Africa/Freetown"],"SM":["Europe/San_Marino"],"SN":["Africa/Dakar"],"SO":["Africa/Mogadishu"],"SR":["America/Paramaribo"],"SS":["Africa/Juba"],"ST":["Africa/Sao_Tome"],"SV":["America/El_Salvador"],"SX":["America/Lower_Princes"],"SY":["Asia/Damascus"],"SZ":["Africa/Mbabane"],"TC":["America/Grand_Turk"],"TD":["Africa/Ndjamena"],"TF":["Indian/Kerguelen"],"TG":["Africa/Lome"],"TH":["Asia/Bangkok"],"TJ":["Asia/Dushanbe"],"TK":["Pacific/Fakaofo"],"TL":["Asia/Dili"],"TM":["Asia/Ashgabat"],"TN":["Africa/Tunis"],"TO":["Pacific/Tongatapu"],"TR":["Europe/Istanbul"],"TT":["America/Port_of_Spain"],"TV":["Pacific/Funafuti"],"TW":["Asia/Taipei"],"TZ":["Africa/Dar_es_Salaam"],"UA":["Europe/Kiev","Europe/Uzhgorod","Europe/Zaporozhye"],"UG":["Africa/Kampala"],"UM":["Pacific/Johnston","Pacific/Midway","Pacific/Wake"],"US":["America/New_York","America/Detroit","America/Kentucky/Louisville","America/Kentucky/Monticello","America/Indiana/Indianapolis","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Vevay","America/Chicago","America/Indiana/Tell_City","America/Indiana/Knox","America/Menominee","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/North_Dakota/Beulah","America/Denver","America/Boise","America/Phoenix","America/Los_Angeles","America/Metlakatla","America/Anchorage","America/Juneau","America/Sitka","America/Yakutat","America/Nome","America/Adak","Pacific/Honolulu"],"UY":["America/Montevideo"],"UZ":["Asia/Samarkand","Asia/Tashkent"],"VA":["Europe/Vatican"],"VC":["America/St_Vincent"],"VE":["America/Caracas"],"VG":["America/Tortola"],"VI":["America/St_Thomas"],"VN":["Asia/Ho_Chi_Minh"],"VU":["Pacific/Efate"],"WF":["Pacific/Wallis"],"WS":["Pacific/Apia"],"YE":["Asia/Aden"],"YT":["Indian/Mayotte"],"ZA":["Africa/Johannesburg"],"ZM":["Africa/Lusaka"],"ZW":["Africa/Harare"]};
ilib.data.zoneinfo["EST"] = {"f":"EST","o":"-5:0"};
ilib.data.zoneinfo["Factory"] = {"f":"\"Local","o":"0:0"};
ilib.data.zoneinfo["HST"] = {"f":"HST","o":"-10:0"};
ilib.data.zoneinfo["Etc/GMT+2"] = {"f":"GMT+2","o":"-2:0","n":"UTC-02"};
ilib.data.zoneinfo["Etc/GMT+12"] = {"f":"GMT+12","o":"-12:0","n":"Dateline {c} Time"};
ilib.data.zoneinfo["Etc/GMT"] = {"f":"GMT","o":"0:0","n":"UTC"};
ilib.data.zoneinfo["Etc/GMT+4"] = {"f":"GMT+4","o":"-4:0","n":"SA Western {c} Time"};
ilib.data.zoneinfo["Etc/GMT-8"] = {"f":"GMT-8","o":"8:0","n":"Singapore {c} Time"};
ilib.data.zoneinfo["Etc/GMT-10"] = {"f":"GMT-10","o":"10:0","n":"West Pacific {c} Time"};
ilib.data.zoneinfo["Etc/GMT+7"] = {"f":"GMT+7","o":"-7:0","n":"US Mountain {c} Time"};
ilib.data.zoneinfo["Etc/GMT-6"] = {"f":"GMT-6","o":"6:0","n":"Central Asia {c} Time"};
ilib.data.zoneinfo["Etc/UTC"] = {"f":"UTC","o":"0:0"};
ilib.data.zoneinfo["Etc/GMT-13"] = {"f":"GMT-13","o":"13:0","n":"Tonga {c} Time"};
ilib.data.zoneinfo["Etc/GMT+1"] = {"f":"GMT+1","o":"-1:0","n":"Cape Verde {c} Time"};
ilib.data.zoneinfo["Etc/GMT-14"] = {"f":"GMT-14","o":"14:0","n":"Line Islands {c} Time"};
ilib.data.zoneinfo["Etc/GMT+8"] = {"f":"GMT+8","o":"-8:0"};
ilib.data.zoneinfo["Etc/GMT-12"] = {"f":"GMT-12","o":"12:0","n":"UTC+12"};
ilib.data.zoneinfo["Etc/GMT-4"] = {"f":"GMT-4","o":"4:0","n":"Arabian {c} Time"};
ilib.data.zoneinfo["Etc/GMT-3"] = {"f":"GMT-3","o":"3:0","n":"E. Africa {c} Time"};
ilib.data.zoneinfo["Etc/GMT-7"] = {"f":"GMT-7","o":"7:0","n":"SE Asia {c} Time"};
ilib.data.zoneinfo["Etc/GMT-11"] = {"f":"GMT-11","o":"11:0","n":"Central Pacific {c} Time"};
ilib.data.zoneinfo["Etc/GMT+6"] = {"f":"GMT+6","o":"-6:0","n":"Central America {c} Time"};
ilib.data.zoneinfo["Etc/GMT-9"] = {"f":"GMT-9","o":"9:0","n":"Tokyo {c} Time"};
ilib.data.zoneinfo["Etc/GMT+11"] = {"f":"GMT+11","o":"-11:0","n":"UTC-11"};
ilib.data.zoneinfo["Etc/GMT-1"] = {"f":"GMT-1","o":"1:0","n":"W. Central Africa {c} Time"};
ilib.data.zoneinfo["Etc/UCT"] = {"f":"UCT","o":"0:0"};
ilib.data.zoneinfo["Etc/GMT+9"] = {"f":"GMT+9","o":"-9:0"};
ilib.data.zoneinfo["Etc/GMT-2"] = {"f":"GMT-2","o":"2:0","n":"South Africa {c} Time"};
ilib.data.zoneinfo["Etc/GMT+3"] = {"f":"GMT+3","o":"-3:0","n":"SA Eastern {c} Time"};
ilib.data.zoneinfo["Etc/GMT+10"] = {"f":"GMT+10","o":"-10:0","n":"Hawaiian {c} Time"};
ilib.data.zoneinfo["Etc/GMT-5"] = {"f":"GMT-5","o":"5:0","n":"West Asia {c} Time"};
ilib.data.zoneinfo["Etc/GMT+5"] = {"f":"GMT+5","o":"-5:0","n":"SA Pacific {c} Time"};
/*
 * timezone.js - Definition of a time zone class
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js
localeinfo.js
util/utils.js
util/math.js
calendar/gregratadie.js
*/

// !data localeinfo zoneinfo

/**
 * @class
 * Create a time zone instance. 
 * 
 * This class reports and transforms
 * information about particular time zones.<p>
 * 
 * The options parameter may contain any of the following properties:
 * 
 * <ul>
 * <li><i>id</i> - The id of the requested time zone such as "Europe/London" or 
 * "America/Los_Angeles". These are taken from the IANA time zone database. (See
 * http://www.iana.org/time-zones for more information.) <p>
 * 
 * There is one special 
 * time zone that is not taken from the IANA database called simply "local". In
 * this case, this class will attempt to discover the current time zone and
 * daylight savings time settings by calling standard Javascript classes to 
 * determine the offsets from UTC. 
 * 
 * <li><i>locale</i> - The locale for this time zone.
 * 
 * <li><i>offset</i> - Choose the time zone based on the offset from UTC given in
 * number of minutes (negative is west, positive is east).
 * 
 * <li><i>onLoad</i> - a callback function to call when the data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the data is loaded, the onLoad function is called with the current 
 * instance as a parameter. 
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * There is currently no way in the ECMAscript
 * standard to tell which exact time zone is currently in use. Choosing the
 * id "locale" or specifying an explicit offset will not give a specific time zone, 
 * as it is impossible to tell with certainty which zone the offsets 
 * match.<p>
 * 
 * When the id "local" is given or the offset option is specified, this class will
 * have the following behaviours:
 * <ul>
 * <li>The display name will always be given as the RFC822 style, no matter what
 * style is requested
 * <li>The id will also be returned as the RFC822 style display name
 * <li>When the offset is explicitly given, this class will assume the time zone 
 * does not support daylight savings time, and the offsets will be calculated 
 * the same way year round.
 * <li>When the offset is explicitly given, the inDaylightSavings() method will 
 * always return false.
 * <li>When the id "local" is given, this class will attempt to determine the 
 * daylight savings time settings by examining the offset from UTC on Jan 1
 * and June 1 of the current year. If they are different, this class assumes
 * that the local time zone uses DST. When the offset for a particular date is
 * requested, it will use the built-in Javascript support to determine the 
 * offset for that date.
 * </ul> 
 * 
 * If a more specific time zone is 
 * needed with display names and known start/stop times for DST, use the "id" 
 * property instead to specify the time zone exactly. You can perhaps ask the
 * user which time zone they prefer so that your app does not need to guess.<p>
 * 
 * If the id and the offset are both not given, the default time zone for the 
 * locale is retrieved from
 * the locale info. If the locale is not specified, the default locale for the
 * library is used.<p>
 * 
 * Because this class was designed for use in web sites, and the vast majority
 * of dates and times being formatted are recent date/times, this class is simplified
 * by not implementing historical time zones. That is, when governments change the 
 * time zone rules for a particular zone, only the latest such rule is implemented 
 * in this class. That means that determining the offset for a date that is prior 
 * to the last change may give the wrong result. Historical time zone calculations
 * may be implemented in a later version of iLib if there is enough demand for it,
 * but it would entail a much larger set of time zone data that would have to be
 * loaded.  
 * 
 * Depends directive: !depends timezone.js
 * 
 * @constructor
 * @param {Object} options Options guiding the construction of this time zone instance
 */
ilib.TimeZone = function(options) {
	this.sync = true;
	this.locale = new ilib.Locale();
	this.isLocal = false;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.id) {
			var id = options.id.toString();
			if (id === 'local') {
				this.isLocal = true;
				
				// use standard Javascript Date to figure out the time zone offsets
				var now = new Date(), 
					jan1 = new Date(now.getFullYear(), 0, 1),  // months in std JS Date object are 0-based
					jun1 = new Date(now.getFullYear(), 5, 1);
				
				// Javascript's method returns the offset backwards, so we have to
				// take the negative to get the correct offset
				this.offsetJan1 = -jan1.getTimezoneOffset();
				this.offsetJun1 = -jun1.getTimezoneOffset();
				// the offset of the standard time for the time zone is always the one that is closest 
				// to negative infinity of the two, no matter whether you are in the northern or southern 
				// hemisphere, east or west
				this.offset = Math.min(this.offsetJan1, this.offsetJun1);
			}
			this.id = id;
		} else if (options.offset) {
			this.offset = (typeof(options.offset) === 'string') ? parseInt(options.offset, 10) : options.offset;
			this.id = this.getDisplayName(undefined, undefined);
		}
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = !!options.sync;
		}
		
		this.loadParams = options.loadParams;
		this.onLoad = options.onLoad;
	}

	//console.log("timezone: locale is " + this.locale);
	
	if (!this.id) {
		new ilib.LocaleInfo(this.locale, {
			sync: this.sync,
			onLoad: ilib.bind(this, function (li) {
				this.id = li.getTimeZone() || "Etc/UTC";
				this._loadtzdata();
			})
		});
	} else {
		this._loadtzdata();
	}

	//console.log("localeinfo is: " + JSON.stringify(this.locinfo));
	//console.log("id is: " + JSON.stringify(this.id));
};

/*
 * Explanation of the compressed time zone info properties.
 * {
 *     "o": "8:0",      // offset from UTC
 *     "f": "W{c}T",    // standard abbreviation. For time zones that observe DST, the {c} replacement is replaced with the 
 *                      // letter in the e.c or s.c properties below 
 *     "e": {           // info about the end of DST
 *         "j": 78322.5 // Julian day when the transition happens. Either specify the "j" property or all of the "m", "r", and 
 *                      // "t" properties, but not both sets.
 *         "m": 3,      // month that it ends
 *         "r": "l0",   // rule for the day it ends "l" = "last", numbers are Sun=0 through Sat=6. Other syntax is "0>7". 
 *                      // This means the 0-day (Sun) after the 7th of the month. Other possible operators are <, >, <=, >=
 *         "t": "2:0",  // time of day that the DST turns off, hours:minutes
 *         "c": "S"     // character to replace into the abbreviation for standard time 
 *     },
 *     "s": {           // info about the start of DST
 *         "j": 78189.5 // Julian day when the transition happens. Either specify the "j" property or all of the "m", "r", and 
 *                      // "t" properties, but not both sets.
 *         "m": 10,     // month that it starts
 *         "r": "l0",   // rule for the day it starts "l" = "last", numbers are Sun=0 through Sat=6. Other syntax is "0>7".
 *                      // This means the 0-day (Sun) after the 7th of the month. Other possible operators are <, >, <=, >=
 *         "t": "2:0",  // time of day that the DST turns on, hours:minutes
 *         "v": "1:0",  // amount of time saved in hours:minutes
 *         "c": "D"     // character to replace into the abbreviation for daylight time
 *     },
 *     "c": "AU",       // ISO code for the country that contains this time zone
 *     "n": "W. Australia {c} Time"
 *                      // long English name of the zone. The {c} replacement is for the word "Standard" or "Daylight" as appropriate
 * }
 */
ilib.TimeZone.prototype._loadtzdata = function () {
	// console.log("id is: " + JSON.stringify(this.id));
	// console.log("zoneinfo is: " + JSON.stringify(ilib.data.zoneinfo[this.id]));
	if (!ilib.data.zoneinfo[this.id] && typeof(this.offset) === 'undefined') {
		ilib.loadData({
			object: ilib.TimeZone, 
			nonlocale: true,	// locale independent 
			name: "zoneinfo/" + this.id + ".json", 
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function (tzdata) {
				if (tzdata && !ilib.isEmpty(tzdata)) {
					ilib.data.zoneinfo[this.id] = tzdata;
				}
				this._initZone();
			})
		});
	} else {
		this._initZone();
	}
};

ilib.TimeZone.prototype._initZone = function() {
	/** 
	 * @private
	 * @type {{o:string,f:string,e:Object.<{m:number,r:string,t:string,z:string}>,s:Object.<{m:number,r:string,t:string,z:string,v:string,c:string}>,c:string,n:string}} 
	 */
	this.zone = ilib.data.zoneinfo[this.id];
	if (!this.zone && typeof(this.offset) === 'undefined') {
		this.id = "Etc/UTC";
		this.zone = ilib.data.zoneinfo[this.id];
	}
	
	this._calcDSTSavings();
	
	if (typeof(this.offset) === 'undefined' && this.zone.o) {
		var offsetParts = this._offsetStringToObj(this.zone.o);
		/**
		 * @private
		 * @type {number} raw offset from UTC without DST, in minutes
		 */
		this.offset = (Math.abs(offsetParts.h || 0) * 60 + (offsetParts.m || 0)) * ilib.signum(offsetParts.h || 0);
	}
	
	if (this.onLoad && typeof(this.onLoad) === 'function') {
		this.onLoad(this);
	}
};

ilib.data.timezone = {};

/**
 * Return an array of available zone ids that the constructor knows about.
 * The country parameter is optional. If it is not given, all time zones will
 * be returned. If it specifies a country code, then only time zones for that
 * country will be returned.
 * 
 * @param {string} country country code for which time zones are being sought
 * @return {Array.<string>} an array of zone id strings
 */
ilib.TimeZone.getAvailableIds = function (country) {
	var tz, ids = [];
	
	if (!ilib.data.timezone.list) {
		ilib.data.timezone.list = [];
		if (ilib._load instanceof ilib.Loader) {
			var hash = ilib._load.listAvailableFiles();
			for (var dir in hash) {
				var files = hash[dir];
				if (typeof(files) === 'object' && files instanceof Array) {
					files.forEach(function (filename) {
						if (filename && filename.match(/^zoneinfo/)) {
							ilib.data.timezone.list.push(filename.replace(/^zoneinfo\//, "").replace(/\.json$/, ""));
						}
					});
				}
			}
		} else {
			for (tz in ilib.data.zoneinfo) {
				if (ilib.data.zoneinfo[tz]) {
					ilib.data.timezone.list.push(tz);
				}
			}
		}
	}
	
	if (!country) {
		// special zone meaning "the local time zone according to the JS engine we are running upon"
		ids.push("local");
		for (tz in ilib.data.timezone.list) {
			if (ilib.data.timezone.list[tz]) {
				ids.push(ilib.data.timezone.list[tz]);
			}
		}
	} else {
		if (!ilib.data.zoneinfo.zonetab) {
			ilib.loadData({
				object: ilib.TimeZone, 
				nonlocale: true,	// locale independent 
				name: "zoneinfo/zonetab.json", 
				sync: true, 
				callback: ilib.bind(this, function (tzdata) {
					if (tzdata) {
						ilib.data.zoneinfo.zonetab = tzdata;
					}
				})
			});
		}
		ids = ilib.data.zoneinfo.zonetab[country];
	}
	
	return ids;
};

/**
 * Return the id used to uniquely identify this time zone.
 * @return {string} a unique id for this time zone
 */
ilib.TimeZone.prototype.getId = function () {
	return this.id.toString();
};

/**
 * Return the abbreviation that is used for the current time zone on the given date.
 * The date may be in DST or during standard time, and many zone names have different
 * abbreviations depending on whether or not the date is falls within DST.<p>
 * 
 * There are two styles that are supported:
 * 
 * <ol>
 * <li>standard - returns the 3 to 5 letter abbreviation of the time zone name such 
 * as "CET" for "Central European Time" or "PDT" for "Pacific Daylight Time"
 * <li>rfc822 - returns an RFC 822 style time zone specifier, which specifies more
 * explicitly what the offset is from UTC
 * <li>long - returns the long name of the zone in English
 * </ol>
 *  
 * @param {ilib.Date=} date a date to determine if it is in daylight time or standard time
 * @param {string=} style one of "standard" or "rfc822". Default if not specified is "standard"
 * @return {string} the name of the time zone, abbreviated according to the style 
 */
ilib.TimeZone.prototype.getDisplayName = function (date, style) {
	style = (this.isLocal || typeof(this.zone) === 'undefined') ? "rfc822" : (style || "standard");
	switch (style) {
		default:
		case 'standard':
			if (this.zone.f && this.zone.f !== "zzz") {
				if (this.zone.f.indexOf("{c}") !== -1) {
					var letter = "";
					letter = this.inDaylightTime(date) ? this.zone.s && this.zone.s.c : this.zone.e && this.zone.e.c; 
					var temp = new ilib.String(this.zone.f);
					return temp.format({c: letter || ""});
				}
				return this.zone.f;
			} 
			var temp = "GMT" + this.zone.o;
			if (this.inDaylightTime(date)) {
				temp += "+" + this.zone.s.v;
			}
			return temp;
			break;
		case 'rfc822':
			var offset = this.getOffset(date), // includes the DST if applicable
				ret = "UTC",
				hour = offset.h || 0,
				minute = offset.m || 0;
			
			if (hour !== 0) {
				ret += (hour > 0) ? "+" : "-";
				if (Math.abs(hour) < 10) {
					ret += "0";
				}
				ret += (hour < 0) ? -hour : hour;
				if (minute < 10) {
					ret += "0";
				}
				ret += minute;
			}
			return ret; 
		case 'long':
			if (this.zone.n) {
				if (this.zone.n.indexOf("{c}") !== -1) {
					var str = this.inDaylightTime(date) ? "Daylight" : "Standard"; 
					var temp = new ilib.String(this.zone.n);
					return temp.format({c: str || ""});
				}
				return this.zone.n;
			}
			var temp = "GMT" + this.zone.o;
			if (this.inDaylightTime(date)) {
				temp += "+" + this.zone.s.v;
			}
			return temp;
			break;
	}
};

/**
 * Convert the offset string to an object with an h, m, and possibly s property
 * to indicate the hours, minutes, and seconds.
 * 
 * @private
 * @param {string} str the offset string to convert to an object
 * @return {Object.<{h:number,m:number,s:number}>} an object giving the offset for the zone at 
 * the given date/time, in hours, minutes, and seconds
 */
ilib.TimeZone.prototype._offsetStringToObj = function (str) {
	var offsetParts = (typeof(str) === 'string') ? str.split(":") : [],
		ret = {h:0},
		temp;
	
	if (offsetParts.length > 0) {
		ret.h = parseInt(offsetParts[0], 10);
		if (offsetParts.length > 1) {
			temp = parseInt(offsetParts[1], 10);
			if (temp) {
				ret.m = temp;
			}
			if (offsetParts.length > 2) {
				temp = parseInt(offsetParts[2], 10);
				if (temp) {
					ret.s = temp;
				}
			}
		}
	}

	return ret;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving.
 * @param {ilib.Date=} date the date for which the offset is needed
 * @return {Object.<{h:number,m:number}>} an object giving the offset for the zone at 
 * the given date/time, in hours, minutes, and seconds  
 */
ilib.TimeZone.prototype.getOffset = function (date) {
	if (!date) {
		return this.getRawOffset();
	}
	var offset = this.getOffsetMillis(date)/60000;
	
	var hours = ilib._roundFnc.down(offset/60),
		minutes = Math.abs(offset) - Math.abs(hours)*60;

	var ret = {
		h: hours
	};
	if (minutes != 0) {
		ret.m = minutes;
	}
	return ret;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time expressed in 
 * milliseconds. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving. Negative numbers indicate offsets west
 * of UTC and conversely, positive numbers indicate offset east of UTC.
 *  
 * @param {ilib.Date=} date the date for which the offset is needed, or null for the
 * present date
 * @return {number} the number of milliseconds of offset from UTC that the given date is
 */
ilib.TimeZone.prototype.getOffsetMillis = function (date) {
	var ret;
	
	// check if the dst property is defined -- the intrinsic JS Date object doesn't work so
	// well if we are in the overlap time at the end of DST
	if (this.isLocal && typeof(date.dst) === 'undefined') {
		var d = (!date) ? new Date() : new Date(date.getTimeExtended());
		return -d.getTimezoneOffset() * 60000;
	} 
	
	ret = this.offset;
	
	if (date && this.inDaylightTime(date)) {
		ret += this.dstSavings;
	}
	
	return ret * 60000;
};

/**
 * Return the offset in milliseconds when the date has an RD number in wall
 * time rather than in UTC time.
 * @protected
 * @param date the date to check in wall time
 * @returns {number} the number of milliseconds of offset from UTC that the given date is
 */
ilib.TimeZone.prototype._getOffsetMillisWallTime = function (date) {
	var ret;
	
	ret = this.offset;
	
	if (date && this.inDaylightTime(date, true)) {
		ret += this.dstSavings;
	}
	
	return ret * 60000;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving.
 * @param {ilib.Date=} date the date for which the offset is needed
 * @return {string} the offset for the zone at the given date/time as a string in the 
 * format "h:m:s" 
 */
ilib.TimeZone.prototype.getOffsetStr = function (date) {
	var offset = this.getOffset(date),
		ret;
	
	ret = offset.h;
	if (typeof(offset.m) !== 'undefined') {
		ret += ":" + offset.m;
		if (typeof(offset.s) !== 'undefined') {
			ret += ":" + offset.s;
		}
	} else {
		ret += ":0";
	}
	
	return ret;
};

/**
 * Gets the offset from UTC for this time zone.
 * @return {Object.<{h:number,m:number,s:number}>} an object giving the offset from 
 * UTC for this time zone, in hours, minutes, and seconds 
 */
ilib.TimeZone.prototype.getRawOffset = function () {
	var hours = ilib._roundFnc.down(this.offset/60),
		minutes = Math.abs(this.offset) - Math.abs(hours)*60;
	
	var ret = {
		h: hours
	};
	if (minutes != 0) {
		ret.m = minutes;
	}
	return ret;
};

/**
 * Gets the offset from UTC for this time zone expressed in milliseconds. Negative numbers
 * indicate zones west of UTC, and positive numbers indicate zones east of UTC.
 * 
 * @return {number} an number giving the offset from 
 * UTC for this time zone in milliseconds 
 */
ilib.TimeZone.prototype.getRawOffsetMillis = function () {
	return this.offset * 60000;
};

/**
 * Gets the offset from UTC for this time zone without DST savings.
 * @return {string} the offset from UTC for this time zone, in the format "h:m:s" 
 */
ilib.TimeZone.prototype.getRawOffsetStr = function () {
	var off = this.getRawOffset();
	return off.h + ":" + (off.m || "0");
};

/**
 * Return the amount of time in hours:minutes that the clock is advanced during
 * daylight savings time.
 * @return {Object.<{h:number,m:number,s:number}>} the amount of time that the 
 * clock advances for DST in hours, minutes, and seconds 
 */
ilib.TimeZone.prototype.getDSTSavings = function () {
	if (this.isLocal) {
		// take the absolute because the difference in the offsets may be positive or
		// negative, depending on the hemisphere
		var savings = Math.abs(this.offsetJan1 - this.offsetJun1);
		var hours = ilib._roundFnc.down(savings/60),
			minutes = savings - hours*60;
		return {
			h: hours,
			m: minutes
		};
	} else if (this.zone && this.zone.s) {
		return this._offsetStringToObj(this.zone.s.v);	// this.zone.start.savings
	}
	return {h:0};
};

/**
 * Return the amount of time in hours:minutes that the clock is advanced during
 * daylight savings time.
 * @return {string} the amount of time that the clock advances for DST in the
 * format "h:m:s"
 */
ilib.TimeZone.prototype.getDSTSavingsStr = function () {
	if (this.isLocal) {
		var savings = this.getDSTSavings();
		return savings.h + ":" + savings.m;
	} else if (typeof(this.offset) !== 'undefined' && this.zone && this.zone.s) {
		return this.zone.s.v;	// this.zone.start.savings
	}
	return "0:0";
};

/**
 * return the rd of the start of DST transition for the given year
 * @protected
 * @param {Object} rule set of rules
 * @param {number} year year to check
 * @return {number} the rd of the start of DST for the year
 */
ilib.TimeZone.prototype._calcRuleStart = function (rule, year) {
	var type = "=", 
		weekday = 0, 
		day, 
		refDay, 
		cal, 
		hour = 0, 
		minute = 0, 
		second = 0,
		time,
		i;
	
	if (typeof(rule.j) !== 'undefined') {
		refDay = new ilib.Date.GregRataDie({
			julianday: rule.j
		});
	} else {
		if (rule.r.charAt(0) == 'l' || rule.r.charAt(0) == 'f') {
			cal = ilib.Cal.newInstance({type: "gregorian"});
			type = rule.r.charAt(0);
			weekday = parseInt(rule.r.substring(1), 10);
			day = (type === 'l') ? cal.getMonLength(rule.m, year) : 1;
			//console.log("_calcRuleStart: Calculating the " + 
			//		(rule.r.charAt(0) == 'f' ? "first " : "last ") + weekday + 
			//		" of month " + rule.m);
		} else {
			i = rule.r.indexOf('<');
			if (i == -1) {
				i = rule.r.indexOf('>');
			}
			
			if (i != -1) {
				type = rule.r.charAt(i);
				weekday = parseInt(rule.r.substring(0, i), 10);
				day = parseInt(rule.r.substring(i+1), 10); 
				//console.log("_calcRuleStart: Calculating the " + weekday + 
				//		type + day + " of month " + rule.m);
			} else {
				day = parseInt(rule.r, 10);
				//console.log("_calcRuleStart: Calculating the " + day + " of month " + rule.m);
			}
		}
	
		if (rule.t) {
			time = rule.t.split(":");
			hour = parseInt(time[0], 10);
			if (time.length > 1) {
				minute = parseInt(time[1], 10);
				if (time.length > 2) {
					second = parseInt(time[2], 10);
				}
			}
		}
		//console.log("calculating rd of " + year + "/" + rule.m + "/" + day);
		refDay = new ilib.Date.GregRataDie({
			year: year, 
			month: rule.m, 
			day: day, 
			hour: hour, 
			minute: minute, 
			second: second
		});
	}
	//console.log("refDay is " + JSON.stringify(refDay));
	var d = refDay.getRataDie();
	
	switch (type) {
		case 'l':
		case '<':
			//console.log("returning " + refDay.onOrBefore(rd, weekday));
			d = refDay.onOrBefore(weekday); 
			break;
		case 'f':
		case '>':
			//console.log("returning " + refDay.onOrAfterRd(rd, weekday));
			d = refDay.onOrAfter(weekday); 
			break;
	}
	return d;
};

/**
 * @private
 */
ilib.TimeZone.prototype._calcDSTSavings = function () {
	var saveParts = this.getDSTSavings();
	
	/**
	 * @private
	 * @type {number} savings in minutes when DST is in effect 
	 */
	this.dstSavings = (Math.abs(saveParts.h || 0) * 60 + (saveParts.m || 0)) * ilib.signum(saveParts.h || 0);
};

/**
 * @private
 */
ilib.TimeZone.prototype._getDSTStartRule = function (year) {
	// TODO: update this when historic/future zones are supported
	return this.zone.s;
};

/**
 * @private
 */
ilib.TimeZone.prototype._getDSTEndRule = function (year) {
	// TODO: update this when historic/future zones are supported
	return this.zone.e;
};

/**
 * Returns whether or not the given date is in daylight saving time for the current
 * zone. Note that daylight savings time is observed for the summer. Because
 * the seasons are reversed, daylight savings time in the southern hemisphere usually
 * runs from the end of the year through New Years into the first few months of the
 * next year. This method will correctly calculate the start and end of DST for any
 * location.
 * 
 * @param {ilib.Date=} date a date for which the info about daylight time is being sought,
 * or undefined to tell whether we are currently in daylight savings time
 * @param {boolean=} wallTime if true, then the given date is in wall time. If false or
 * undefined, it is in the usual UTC time.
 * @return {boolean} true if the given date is in DST for the current zone, and false
 * otherwise.
 */
ilib.TimeZone.prototype.inDaylightTime = function (date, wallTime) {
	var rd, startRd, endRd;

	if (this.isLocal) {
		// check if the dst property is defined -- the intrinsic JS Date object doesn't work so
		// well if we are in the overlap time at the end of DST, so we have to work around that
		// problem by adding in the savings ourselves
		var offset = 0;
		if (typeof(date.dst) !== 'undefined' && !date.dst) {
			offset = this.dstSavings * 60000;
		}
		
		var d = new Date(date ? date.getTimeExtended() + offset: undefined);
		// the DST offset is always the one that is closest to positive infinity, no matter 
		// if you are in the northern or southern hemisphere, east or west
		var dst = Math.max(this.offsetJan1, this.offsetJun1);
		return (-d.getTimezoneOffset() === dst);
	}
	
	if (!date) {
		date = new ilib.Date.GregDate(); // right now
	} else if (!(date instanceof ilib.Date.GregDate)) {
		// convert to Gregorian so that we can tell if it is in DST or not
		date = new ilib.Date.GregDate({
			julianday: date.getJulianDay(),
			timezone: date.getTimeZone()
		});
	}
	
	// if we aren't using daylight time in this zone for the given year, then we are 
	// not in daylight time
	if (!this.useDaylightTime(date.year)) {
		return false;
	}
	
	// this should be a Gregorian RD number now, in UTC
	rd = date.rd.getRataDie();
	
	// these calculate the start/end in local wall time
	var startrule = this._getDSTStartRule(date.year);
	var endrule = this._getDSTEndRule(date.year);
	startRd = this._calcRuleStart(startrule, date.year);
	endRd = this._calcRuleStart(endrule, date.year);
	
	if (wallTime) {
		// rd is in wall time, so we have to make sure to skip the missing time
		// at the start of DST when standard time ends and daylight time begins
		startRd += this.dstSavings/1440;
	} else {
		// rd is in UTC, so we have to convert the start/end to UTC time so 
		// that they can be compared directly to the UTC rd number of the date
		
		// when DST starts, time is standard time already, so we only have
		// to subtract the offset to get to UTC and not worry about the DST savings
		startRd -= this.offset/1440;  
		
		// when DST ends, time is in daylight time already, so we have to
		// subtract the DST savings to get back to standard time, then the
		// offset to get to UTC
		endRd -= (this.offset + this.dstSavings)/1440;
	}
	
	// In the northern hemisphere, the start comes first some time in spring (Feb-Apr), 
	// then the end some time in the fall (Sept-Nov). In the southern
	// hemisphere, it is the other way around because the seasons are reversed. Standard
	// time is still in the winter, but the winter months are May-Aug, and daylight 
	// savings time usually starts Aug-Oct of one year and runs through Mar-May of the 
	// next year.
	if (rd < endRd && endRd - rd <= this.dstSavings/1440 && typeof(date.dst) === 'boolean') {
		// take care of the magic overlap time at the end of DST
		return date.dst;
	}
	if (startRd < endRd) {
		// northern hemisphere
		return (rd >= startRd && rd < endRd) ? true : false;
	} 
	// southern hemisphere
	return (rd >= startRd || rd < endRd) ? true : false;
};

/**
 * Returns true if this time zone switches to daylight savings time at some point
 * in the year, and false otherwise.
 * @param {number} year Whether or not the time zone uses daylight time in the given year. If
 * this parameter is not given, the current year is assumed.
 * @return {boolean} true if the time zone uses daylight savings time
 */
ilib.TimeZone.prototype.useDaylightTime = function (year) {
	
	// this zone uses daylight savings time iff there is a rule defining when to start
	// and when to stop the DST
	return (this.isLocal && this.offsetJan1 !== this.offsetJun1) ||
		(typeof(this.zone) !== 'undefined' && 
		typeof(this.zone.s) !== 'undefined' && 
		typeof(this.zone.e) !== 'undefined');
};

/**
 * Returns the ISO 3166 code of the country for which this time zone is defined.
 * @return {string} the ISO 3166 code of the country for this zone
 */
ilib.TimeZone.prototype.getCountry = function () {
	return this.zone.c;
};
ilib.data.pseudomap = {"a":"à","c":"ç","d":"ð","e":"ë","g":"ğ","h":"ĥ","i":"í","j":"ĵ","k":"ķ","l":"ľ","n":"ñ","o":"õ","p":"þ","r":"ŕ","s":"š","t":"ţ","u":"ü","w":"ŵ","y":"ÿ","z":"ž","A":"Ã","B":"ß","C":"Ç","D":"Ð","E":"Ë","G":"Ĝ","H":"Ħ","I":"Ï","J":"Ĵ","K":"ĸ","L":"Ľ","N":"Ň","O":"Ø","R":"Ŗ","S":"Š","T":"Ť","U":"Ú","W":"Ŵ","Y":"Ŷ","Z":"Ż"};
/*
 * resources.js - Resource bundle definition
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js localeinfo.js strings.js util/utils.js

// !data pseudomap

/**
 * @class
 * Create a new resource bundle instance. The resource bundle loads strings
 * appropriate for a particular locale and provides them via the getString 
 * method.<p>
 * 
 * The options object may contain any (or none) of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - The locale of the strings to load. If not specified, the default
 * locale is the the default for the web page or app in which the bundle is 
 * being loaded.
 * 
 * <li><i>name</i> - Base name of the resource bundle to load. If not specified the default
 * base name is "resources".
 * 
 * <li><i>type</i> - Name the type of strings this bundle contains. Valid values are 
 * "xml", "html", "text", or "raw". The default is "text". If the type is "xml" or "html",
 * then XML/HTML entities and tags are not pseudo-translated. During a real translation, 
 * HTML character entities are translated to their corresponding characters in a source
 * string before looking that string up in the translations. Also, the characters "<", ">",
 * and "&" are converted to entities again in the output, but characters are left as they
 * are. If the type is "xml", "html", or "text" types, then the replacement parameter names
 * are not pseudo-translated as well so that the output can be used for formatting with 
 * the ilib.String class. If the type is raw, all characters are pseudo-translated, 
 * including replacement parameters as well as XML/HTML tags and entities.
 * 
 * <li><i>lengthen</i> - when pseudo-translating the string, tell whether or not to 
 * automatically lengthen the string to simulate "long" languages such as German
 * or French. This is a boolean value. Default is false.
 * 
 * <li><i>missing</i> - what to do when a resource is missing. The choices are:
 * <ul>
 *   <li><i>source</i> - return the source string unchanged
 *   <li><i>pseudo</i> - return the pseudo-translated source string, translated to the
 *   script of the locale if the mapping is available, or just the default Latin 
 *   pseudo-translation if not
 *   <li><i>empty</i> - return the empty string 
 * </ul>
 * The default behaviour is the same as before, which is to return the source string
 * unchanged.
 * 
 * <li><i>onLoad</i> - a callback function to call when the resources are fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * The locale option may be given as a locale spec string or as an 
 * ilib.Locale object. If the locale option is not specified, then strings for
 * the default locale will be loaded.<p> 
 * 
 * The name option can be used to put groups of strings together in a
 * single bundle. The strings will then appear together in a JS object in
 * a JS file that can be included before the ilib.<p>
 * 
 * A resource bundle with a particular name is actually a set of bundles
 * that are each specific to a language, a language plus a region, etc. 
 * All bundles with the same base name should
 * contain the same set of source strings, but with different translations for 
 * the given locale. The user of the bundle does not need to be aware of 
 * the locale of the bundle, as long as it contains values for the strings 
 * it needs.<p>
 * 
 * Strings in bundles for a particular locale are inherited from parent bundles
 * that are more generic. In general, the hierarchy is as follows (from 
 * least locale-specific to most locale-specific):
 * 
 * <ol>
 * <li> language
 * <li> region
 * <li> language_script
 * <li> language_region
 * <li> region_variant
 * <li> language_script_region
 * <li> language_region_variant
 * <li> language_script_region_variant
 * </ol>
 * 
 * That is, if the translation for a string does not exist in the current
 * locale, the more-generic parent locale is searched for the string. In the
 * worst case scenario, the string is not found in the base locale's strings. 
 * In this case, the missing option guides this class on what to do. If
 * the missing option is "source", then the original source is returned as 
 * the translation. If it is "empty", the empty string is returned. If it
 * is "pseudo", then the pseudo-translated string that is appropriate for
 * the default script of the locale is returned.<p> 
 * 
 * This allows developers to create code with new or changed strings in it and check in that
 * code without waiting for the translations to be done first. The translated
 * version of the app or web site will still function properly, but will show 
 * a spurious untranslated string here and there until the translations are 
 * done and also checked in.<p>   
 *  
 * The base is whatever language your developers use to code in. For
 * a German web site, strings in the source code may be written in German 
 * for example. Often this base is English, as many web sites are coded in
 * English, but that is not required.<p>
 * 
 * The strings can be extracted with the ilib localization tool (which will be
 * shipped at some future time.) Once the strings
 * have been translated, the set of translated files can be generated with the
 * same tool. The output from the tool can be used as input to the ResBundle
 * object. It is up to the web page or app to make sure the JS file that defines
 * the bundle is included before creating the ResBundle instance.<p>
 * 
 * A special locale "zxx-XX" is used as the pseudo-translation locale because
 * zxx means "no linguistic information" in the ISO 639 standard, and the region 
 * code XX is defined to be user-defined in the ISO 3166 standard. 
 * Pseudo-translation is a locale where the translations are generated on
 * the fly based on the contents of the source string. Characters in the source 
 * string are replaced with other characters and returned. 
 * 
 * Example. If the source string is:
 * 
 * <pre>
 * "This is a string"
 * </pre>
 * 
 * then the pseudo-translated version might look something like this: 
 * 
 * <pre>
 * "Ţħïş ïş á şţřïñĝ"
 * </pre>
 * <p>
 * 
 * Pseudo-translation can be used to test that your app or web site is translatable
 * before an actual translation has happened. These bugs can then be fixed 
 * before the translation starts, avoiding an explosion of bugs later when
 * each language's tester registers the same bug complaining that the same 
 * string is not translated. When pseudo-localizing with
 * the Latin script, this allows the strings to be readable in the UI in the 
 * source language (if somewhat funky-looking), 
 * so that a tester can easily verify that the string is properly externalized 
 * and loaded from a resource bundle without the need to be able to read a
 * foreign language.<p> 
 * 
 * If one of a list of script tags is given in the pseudo-locale specifier, then the
 * pseudo-localization can map characters to very rough transliterations of
 * characters in the given script. For example, zxx-Hebr-XX maps strings to
 * Hebrew characters, which can be used to test your UI in a right-to-left
 * language to catch bidi bugs before a translation is done. Currently, the
 * list of target scripts includes Hebrew (Hebr), Chinese Simplified Han (Hans),
 * and Cyrillic (Cyrl) with more to be added later. If no script is explicitly
 * specified in the locale spec, or if the script is not supported,
 * then the default mapping maps Latin base characters to accented versions of
 * those Latin characters as in the example above.
 *  
 * When the "lengthen" property is set to true in the options, the 
 * pseudotranslation code will add digits to the end of the string to simulate
 * the lengthening that occurs when translating to other languages. The above 
 * example will come out like this:
 * 
 * <pre>
 * "Ţħïş ïş á şţřïñĝ76543210"
 * </pre>
 * 
 * The string is lengthened according to the length of the source string. If
 * the source string is less than 20 characters long, the string is lengthened 
 * by 50%. If the source string is 20-40 
 * characters long, the string is lengthened by 33%. If te string is greater
 * than 40 characters long, the string is lengthened by 20%.<p>
 * 
 * The pseudotranslation always ends a string with the digit "0". If you do
 * not see the digit "0" in the UI for your app, you know that truncation
 * has occurred, and the number you see at the end of the string tells you 
 * how many characters were truncated.<p>
 * 
 * Depends directive: !depends resources.js
 * 
 * @constructor
 * @param {?Object} options Options controlling how the bundle is created
 */
ilib.ResBundle = function (options) {
	var lookupLocale, spec;
	
	this.locale = new ilib.Locale();	// use the default locale
	this.baseName = "strings";
	this.type = "text";
	this.loadParams = {};
	this.missing = "source";
	this.sync = true;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? 
					new ilib.Locale(options.locale) :
					options.locale;
		}
		if (options.name) {
			this.baseName = options.name;
		}
		if (options.type) {
			this.type = options.type;
		}
		this.lengthen = options.lengthen || false;
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			this.loadParams = options.loadParams;
		}
		if (typeof(options.missing) !== 'undefined') {
			if (options.missing === "pseudo" || options.missing === "empty") {
				this.missing = options.missing;
			}
		}
	}
	
	this.map = {};

	if (!ilib.ResBundle[this.baseName]) {
		ilib.ResBundle[this.baseName] = {};
	}

	lookupLocale = this.locale.isPseudo() ? new ilib.Locale("en-US") : this.locale;

	ilib.loadData({
		object: ilib.ResBundle[this.baseName], 
		locale: lookupLocale, 
		name: this.baseName + ".json", 
		sync: this.sync, 
		loadParams: this.loadParams, 
		callback: ilib.bind(this, function (map) {
			if (!map) {
				map = ilib.data[this.baseName] || {};
				spec = lookupLocale.getSpec().replace(/-/g, '_');
				ilib.ResBundle[this.baseName].cache[spec] = map;
			}
			this.map = map;
			if (this.locale.isPseudo()) {
				if (!ilib.ResBundle.pseudomap) {
					ilib.ResBundle.pseudomap = {};
				}
	
				this._loadPseudo(this.locale, options.onLoad);
			} else if (this.missing === "pseudo") {
				if (!ilib.ResBundle.pseudomap) {
					ilib.ResBundle.pseudomap = {};
				}
	
				new ilib.LocaleInfo(this.locale, {
					sync: this.sync,
					loadParams: this.loadParams,
					onLoad: ilib.bind(this, function (li) {
						var pseudoLocale = new ilib.Locale("zxx", "XX", undefined, li.getDefaultScript());
						this._loadPseudo(pseudoLocale, options.onLoad);
					})
				});
			} else {
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			}
		})
	});

	// console.log("Merged resources " + this.locale.toString() + " are: " + JSON.stringify(this.map));
	//if (!this.locale.isPseudo() && ilib.isEmpty(this.map)) {
	//	console.log("Resources for bundle " + this.baseName + " locale " + this.locale.toString() + " are not available.");
	//}
};

ilib.ResBundle.defaultPseudo = ilib.data.pseudomap || {
	"a": "à",
	"e": "ë",
	"i": "í",
	"o": "õ",
	"u": "ü",
	"y": "ÿ",
	"A": "Ã",
	"E": "Ë",
	"I": "Ï",
	"O": "Ø",
	"U": "Ú",
	"Y": "Ŷ"
};

ilib.ResBundle.prototype = {
    /**
     * @protected
     */
    _loadPseudo: function (pseudoLocale, onLoad) {
		ilib.loadData({
			object: ilib.ResBundle.pseudomap, 
			locale: pseudoLocale, 
			name: "pseudomap.json", 
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function (map) {
				if (!map || ilib.isEmpty(map)) {
					map = ilib.ResBundle.defaultPseudo;
					var spec = pseudoLocale.getSpec().replace(/-/g, '_');
					ilib.ResBundle.pseudomap.cache[spec] = map;
				}
				this.pseudomap = map;
				if (typeof(onLoad) === 'function') {
					onLoad(this);
				}	
			})
		});
    },
    
	/**
	 * Return the locale of this resource bundle.
	 * @return {ilib.Locale} the locale of this resource bundle object 
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the name of this resource bundle. This corresponds to the name option
	 * given to the constructor.
	 * @return {string} name of the the current instance
	 */
	getName: function () {
		return this.baseName;
	},
	
	/**
	 * Return the type of this resource bundle. This corresponds to the type option
	 * given to the constructor.
	 * @return {string} type of the the current instance
	 */
	getType: function () {
		return this.type;
	},

	/*
	 * @private
	 * Pseudo-translate a string
	 */
	pseudo: function (str) {
		if (!str) {
			return undefined;
		}
		var ret = "", i;
		for (i = 0; i < str.length; i++) {
			if (this.type !== "raw") {
				if (this.type === "html" || this.type === "xml") {
					if (str.charAt(i) === '<') {
						ret += str.charAt(i++);
						while (i < str.length && str.charAt(i) !== '>') {
							ret += str.charAt(i++);
						}
						if (i < str.length) {
							ret += str.charAt(i++);
						}
					} else if (str.charAt(i) === '&') {
						ret += str.charAt(i++);
						while (i < str.length && str.charAt(i) !== ';' && str.charAt(i) !== ' ') {
							ret += str.charAt(i++);
						}
						if (i < str.length) {
							ret += str.charAt(i++);
						}
					}
				}
				if (i < str.length) { 
					if (str.charAt(i) === '{') {
						ret += str.charAt(i++);
						while (i < str.length && str.charAt(i) !== '}') {
							ret += str.charAt(i++);
						}
						if (i < str.length) {
							ret += str.charAt(i);
						}
					} else {
						ret += this.pseudomap[str.charAt(i)] || str.charAt(i);
					}
				}
			} else {
				ret += this.pseudomap[str.charAt(i)] || str.charAt(i);
			}
		}
		if (this.lengthen) {
			var add;
			if (ret.length <= 20) {
				add = Math.round(ret.length / 2);
			} else if (ret.length > 20 && ret.length <= 40) {
				add = Math.round(ret.length / 3);
			} else {
				add = Math.round(ret.length / 5);
			}
			for (i = add-1; i >= 0; i--) {
				ret += (i % 10);
			}
		}
		if (this.locale.getScript() === "Hans" || this.locale.getScript() === "Hant" ||
				this.locale.getScript() === "Hani" ||
				this.locale.getScript() === "Hrkt" || this.locale.getScript() === "Jpan" ||
				this.locale.getScript() === "Hira" || this.locale.getScript() === "Kana" ) {
			// simulate Asian languages by getting rid of all the spaces
			ret = ret.replace(/ /g, "");
		}
		return ret;
	},
	
	/*
	 * @private
	 * Escape html characters in the output.
	 */
	escapeXml: function (str) {
		str = str.replace(/&/g, '&amp;');
		str = str.replace(/</g, '&lt;');
		str = str.replace(/>/g, '&gt;');
		return str;
	},

	/*
	 * @private
	 * @param {string} str the string to unescape
	 */
	unescapeXml: function (str) {
		str = str.replace(/&amp;/g, '&');
		str = str.replace(/&lt;/g, '<');
		str = str.replace(/&gt;/g, '>');
		return str;
	},
	
	/*
	 * @private
	 * Create a key name out of a source string. All this does so far is 
	 * compress sequences of white space into a single space on the assumption
	 * that this doesn't really change the meaning of the string, and therefore
	 * all such strings that compress to the same thing should share the same
	 * translation.
	 * @param {string} source the source string to make a key out of
	 */
	makeKey: function (source) {
		var key = source.replace(/\s+/gm, ' ');
		return (this.type === "xml" || this.type === "html") ? this.unescapeXml(key) : key;
	},
	
	/**
	 * Return a localized string. If the string is not found in the loaded set of
	 * resources, the original source string is returned. If the key is not given,
	 * then the source string itself is used as the key. In the case where the 
	 * source string is used as the key, the whitespace is compressed down to 1 space
	 * each, and the whitespace at the beginning and end of the string is trimmed.<p>
	 * 
	 * The escape mode specifies what type of output you are escaping the returned
	 * string for. Modes are similar to the types: 
	 * 
	 * <ul>
	 * <li>"html" -- prevents HTML injection by escaping the characters &lt &gt; and &amp;
	 * <li>"xml" -- currently same as "html" mode
	 * <li>"js" -- prevents breaking Javascript syntax by backslash escaping all quote and 
	 * double-quote characters
	 * <li>"attribute" -- meant for HTML attribute values. Currently this is the same as
	 * "js" escape mode.
	 * <li>"default" -- use the type parameter from the constructor as the escape mode as well
	 * <li>"none" or undefined -- no escaping at all.
	 * </ul>
	 * 
	 * The type parameter of the constructor specifies what type of strings this bundle
	 * is operating upon. This allows pseudo-translation and automatic key generation
	 * to happen properly by telling this class how to parse the string. The escape mode 
	 * for this method is different in that it specifies how this string will be used in 
	 * the calling code and therefore how to escape it properly.<p> 
	 * 
	 * For example, a section of Javascript code may be constructing an HTML snippet in a 
	 * string to add to the web page. In this case, the type parameter in the constructor should
	 * be "html" so that the source string can be parsed properly, but the escape mode should
	 * be "js" so that the output string can be used in Javascript without causing syntax
	 * errors.
	 * 
	 * @param {?string=} source the source string to translate
	 * @param {?string=} key optional name of the key, if any
	 * @param {?string=} escapeMode escape mode, if any
	 * @return {ilib.String|undefined} the translation of the given source/key or undefined 
	 * if the translation is not found and the source is undefined 
	 */
	getString: function (source, key, escapeMode) {
		if (!source && !key) return new ilib.String("");

		var trans;
		if (this.locale.isPseudo()) {
			var str = source ? source : this.map[key];
			trans = this.pseudo(str || key);
		} else {
			var keyName = key || this.makeKey(source);
			if (typeof(this.map[keyName]) !== 'undefined') {
				trans = this.map[keyName];
			} else if (this.missing === "pseudo") {
				trans = this.pseudo(source || key);
			} else if (this.missing === "empty") {
				trans = "";
			} else {
				trans = source;
			}
		}

		if (escapeMode && escapeMode !== "none") {
			if (escapeMode == "default") {
				escapeMode = this.type;
			}
			if (escapeMode === "xml" || escapeMode === "html") {
				trans = this.escapeXml(trans);
			} else if (escapeMode == "js" || escapeMode === "attribute") {
				trans = trans.replace(/'/g, "\\\'").replace(/"/g, "\\\"");
			}
		}
		if (trans === undefined) {
			return undefined;
		} else {
			var ret = new ilib.String(trans);
			ret.setLocale(this.locale.getSpec(), true, this.loadParams); // no callback
			return ret;
		}
	},
	
	/**
	 * Return a localized string as a Javascript object. This does the same thing as
	 * the getString() method, but it returns a regular Javascript string instead of
	 * and ilib.String instance. This means it cannot be formatted with the format()
	 * method without being wrapped in an ilib.String instance first.
	 * 
	 * @param {?string=} source the source string to translate
	 * @param {?string=} key optional name of the key, if any
	 * @param {?string=} escapeMode escape mode, if any
	 * @return {string|undefined} the translation of the given source/key or undefined 
	 * if the translation is not found and the source is undefined
	 */
	getStringJS: function(source, key, escapeMode) {
		return this.getString(source, key, escapeMode).toString();
	},
	
	/**
	 * Return true if the current bundle contains a translation for the given key and
	 * source. The
	 * getString method will always return a string for any given key and source 
	 * combination, so it cannot be used to tell if a translation exists. Either one
	 * or both of the source and key must be specified. If both are not specified,
	 * this method will return false.
	 * 
	 * @param {?string=} source source string to look up
	 * @param {?string=} key key to look up
	 * @return {boolean} true if this bundle contains a translation for the key, and 
	 * false otherwise
	 */
	containsKey: function(source, key) {
		if (typeof(source) === 'undefined' && typeof(key) === 'undefined') {
			return false;
		}
		
		var keyName = key || this.makeKey(source);
		return typeof(this.map[keyName]) !== 'undefined';
	},
	
	/**
	 * Return the merged resources as an entire object. When loading resources for a
	 * locale that are not just a set of translated strings, but instead an entire 
	 * structured javascript object, you can gain access to that object via this call. This method
	 * will ensure that all the of the parts of the object are correct for the locale.<p>
	 * 
	 * For pre-assembled data, it starts by loading <i>ilib.data[name]</i>, where 
	 * <i>name</i> is the base name for this set of resources. Then, it successively 
	 * merges objects in the base data using progressively more locale-specific data. 
	 * It loads it in this order from <i>ilib.data</i>:
	 * 
	 * <ol>
	 * <li> language
	 * <li> region
	 * <li> language_script
	 * <li> language_region
	 * <li> region_variant
	 * <li> language_script_region
	 * <li> language_region_variant
	 * <li> language_script_region_variant
	 * </ol>
	 * 
	 * For dynamically loaded data, the code attempts to load the same sequence as
	 * above, but with slash path separators instead of underscores.<p>
	 *  
	 * Loading the resources this way allows the program to share resources between all
	 * locales that share a common language, region, or script. As a 
	 * general rule-of-thumb, resources should be as generic as possible in order to
	 * cover as many locales as possible.
	 * 
	 * @return {Object} returns the object that is the basis for this resources instance
	 */
	getResObj: function () {
		return this.map;
	}
};

/*
 * util/jsutils.js - Misc utilities to work around Javascript engine differences
 * 
 * Copyright © 2013-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

/**
 * Perform a shallow copy of the source object to the target object. This only 
 * copies the assignments of the source properties to the target properties, 
 * but not recursively from there.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @static
 * @param {Object} source the source object to copy properties from
 * @param {Object} target the target object to copy properties into
 */
ilib.shallowCopy = function (source, target) {
	var prop = undefined;
	if (source && target) {
		for (prop in source) {
			if (prop !== undefined && typeof(source[prop]) !== 'undefined') {
				target[prop] = source[prop];
			}
		}
	}
};

/** [Need Comment]
 * 
 */
ilib.deepCopy = function(from, to) {
	var prop;

	for (prop in from) {
		if (prop) {
			if (typeof(from[prop]) === 'object') {
				to[prop] ={};
				ilib.deepCopy(from[prop], to[prop]);
			} else {
				to[prop] = from[prop];
			}
		}
	}
	return to;
};

/**
 * Map a string to the given set of alternate characters. If the target set
 * does not contain a particular character in the input string, then that
 * character will be copied to the output unmapped.
 * 
 * @static
 * @param {string} str a string to map to an alternate set of characters
 * @param {Array.<string>|Object} map a mapping to alternate characters
 * @return {string} the source string where each character is mapped to alternate characters
 */
ilib.mapString = function (str, map) {
	var mapped = "";
	if (map && str) {
		for (var i = 0; i < str.length; i++) {
			var c = str.charAt(i); // TODO use a char iterator?
			mapped += map[c] || c; 
		}
	} else {
		mapped = str;
	}
	return mapped;
};

/**
 * Check if an object is a member of the given array. If this javascript engine
 * support indexOf, it is used directly. Otherwise, this function implements it
 * itself. The idea is to make sure that you can use the quick indexOf if it is
 * available, but use a slower implementation in older engines as well.
 * 
 * @static
 * @param {Array.<Object>} array array to search
 * @param {Object} obj object being sought. This should be of the same type as the
 * members of the array being searched. If not, this function will not return
 * any results.
 * @return {number} index of the object in the array, or -1 if it is not in the array.
 */
ilib.indexOf = function(array, obj) {
	if (!array || !obj) {
		return -1;
	}
	if (typeof(array.indexOf) === 'function') {
		return array.indexOf(obj);
	} else {
		for (var i = 0; i < array.length; i++) {
	        if (array[i] === obj) {
	            return i;
	        }
	    }
	    return -1;
	}
};

/**
 * @static
 * Convert a string into the hexadecimal representation
 * of the Unicode characters in that string.
 * 
 * @param {string} string The string to convert
 * @param {number=} limit the number of digits to use to represent the character (1 to 8)
 * @return {string} a hexadecimal representation of the
 * Unicode characters in the input string
 */
ilib.toHexString = function(string, limit) {
	var i, 
		result = "", 
		lim = (limit && limit < 9) ? limit : 4;
	
	if (!string) {
		return "";
	}
	for (i = 0; i < string.length; i++) {
		var ch = string.charCodeAt(i).toString(16);
		result += "00000000".substring(0, lim-ch.length) + ch;
	}
	return result.toUpperCase();
};

ilib.data.dateformats = {"gregorian":{"order":"{date} {time}","date":{"dmwy":{"s":"EE d/M/yy","m":"EEE d/MM/yyyy","l":"EEE d MMM yyyy","f":"EEEE d MMMM yyyy"},"dmy":{"s":"d/M/yy","m":"d/MM/yyyy","l":"d MMM yyyy","f":"d MMMM yyyy"},"dmw":{"s":"EE d/M","m":"EE d/MM","l":"EEE d MMM","f":"EEEE d MMMM"},"dm":{"s":"d/M","m":"d/MM","l":"d MMM","f":"d MMMM"},"my":{"s":"M/yy","m":"MM/yyyy","l":"MMM yyyy","f":"MMMM yyyy"},"dw":{"s":"EE d","m":"EE d","l":"EEE d","f":"EEEE d"},"d":"dd","m":{"s":"M","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"},"w":{"s":"E","m":"EE","l":"EEE","f":"EEEE"}},"time":{"12":{"ahmsz":"h:mm:ssa z","ahms":"h:mm:ssa","hmsz":"h:mm:ss z","hms":"h:mm:ss","ahmz":"h:mma z","ahm":"h:mma","hmz":"h:mm z","ah":"ha","hm":"h:mm","ms":"mm:ss","h":"h","m":"mm","s":"ss"},"24":{"ahmsz":"H:mm:ss z","ahms":"H:mm:ss","hmsz":"H:mm:ss z","hms":"H:mm:ss","ahmz":"H:mm z","ahm":"H:mm","hmz":"H:mm z","ah":"H","hm":"H:mm","ms":"mm:ss","h":"H","m":"mm","s":"ss"}},"range":{"c00":{"s":"{st} - {et} {sd}/{sm}/{sy}","m":"{st} - {et}, {sd}/{sm}/{sy}","l":"{st} - {et}, {sd} {sm} {sy}","f":"{st} - {et}, {sd} {sm} {sy}"},"c01":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm} {st} - {ed}/{em} {et}, {sy}","l":"{sd} {st} - {ed} {et}, {sm} {sy}","f":"{sd} {st} - {ed} {et}, {sm} {sy}"},"c02":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm} {st} - {ed}/{em} {et}, {sy}","l":"{sd} {sm} {st} - {ed} {em} {et}, {sy}","f":"{sd} {sm} {st} - {ed} {em} {et}, {sy}"},"c03":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","l":"{sd} {sm} {sy} {st} - {ed} {em} {ey} {et}","f":"{sd} {sm} {sy} {st} - {ed} {em} {ey} {et}"},"c10":{"s":"{sd}-{ed}/{sm}/{sy}","m":"{sd}-{ed}/{sm}/{sy}","l":"{sd}-{ed} {sm} {sy}","f":"{sd}-{ed} {sm} {sy}"},"c11":{"s":"{sd}/{sm}-{ed}/{em} {sy}","m":"{sd}/{sm} - {ed}/{em} {sy}","l":"{sd} {sm} - {ed} {em} {sy}","f":"{sd} {sm} - {ed} {em} {sy}"},"c12":{"s":"{sd}/{sm}/{sy}-{ed}/{em}/{ey}","m":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","l":"{sd} {sm} {sy} - {ed} {em} {ey}","f":"{sd} {sm} {sy} - {ed} {em} {ey}"},"c20":{"s":"{sm}/{sy}-{em}/{ey}","m":"{sm}/{sy} - {em}/{ey}","l":"{sm} {sy} - {em} {ey}","f":"{sm} {sy} - {em} {ey}"},"c30":"{sy} - {ey}"}},"islamic":"gregorian","hebrew":"gregorian","julian":"gregorian","thaisolar":"gregorian","persian":"gregorian","persian-algo":"gregorian","han":"gregorian","ethiopic":{"order":"{date} {time}","date":{"dmwy":{"s":"E, dd/MM/yyyy","m":"EE, d MMM yyyy","l":"EEE, d MMM yyyy","f":"EEEE, d MMMM yyyy"},"dmy":{"s":"dd/MM/yyyy","m":"d MMM yyyy","l":"d MMM yyyy","f":"d MMMM yyyy"},"dmw":{"s":"E, dd/MM","m":"EE, d MMM","l":"EEE, d MMM","f":"EEEE, d MMMM"},"dm":{"s":"MM/dd","m":"MMM d","l":"MMM d","f":"MMMM d"},"my":{"s":"MM/yyyy","m":"MMM yyyy","l":"MMM yyyy","f":"MMMM yyyy"},"dw":{"s":"E d","m":"EE d","l":"EEE d","f":"EEEE d"},"d":"d","m":{"s":"MM","m":"MMM","l":"MMM","f":"MMMM"},"y":{"s":"yyyy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"},"w":{"s":"E","m":"EE","l":"EEE","f":"EEEE"}},"time":{"12":{"ahmsz":"h:mm:ss a z","ahms":"h:mm:ss a","hmsz":"h:mm:ss z","hms":"h:mm:ss","ahmz":"h:mm a z","ahm":"h:mm a","hmz":"h:mm z","ah":"h a","hm":"h:mm","ms":"mm:ss","h":"h","m":"mm","s":"ss"},"24":{"ahmsz":"H:mm:ss z","ahms":"H:mm:ss","hmsz":"H:mm:ss z","hms":"H:mm:ss","ahmz":"H:mm z","ahm":"H:mm","hmz":"H:mm z","ah":"H","hm":"H:mm","ms":"mm:ss","h":"H","m":"mm","s":"ss"}},"range":{"c00":{"s":"{st} – {et} {sd}/{sm}/{sy}","m":"{st} – {et}, {sd} {sm} {sy}","l":"{st} – {et}, {sd} {sm} {sy}","f":"{st} – {et}, {sd} {sm} {sy}"},"c01":{"s":"{sd}/{sm}/{sy} {st} – {ed}/{em}/{ey} {et}","m":"{sd} {sm} {st} – {ed} {em} {et} {sy}","l":"{sd} {st} – {ed} {et} {sm} {sy}","f":"{sd} {st} – {ed} {et} {sm} {sy}"},"c02":{"s":"{sd}/{sm}/{sy} {st} – {ed}/{em}/{ey} {et}","m":"{sd} {sm} {st} – {ed} {em} {et} {sy}","l":"{sd} {sm} {st} – {ed} {em} {et} {sy}","f":"{sd} {sm} {st} – {ed} {em} {et} {sy}"},"c03":{"s":"{sd}/{sm}/{sy} {st} – {ed}/{em}/{ey} {et}","m":"{sd} {sm} {sy} {st} – {ed} {em} {ey} {et}","l":"{sd} {sm} {sy} {st} – {ed} {em} {ey} {et}","f":"{sd} {sm} {sy} {st} – {ed} {em} {ey} {et}"},"c10":{"s":"{sd}–{ed}/{sm}/{sy}","m":"{sd}–{ed} {sm} {sy}","l":"{sd}–{ed} {sm} {sy}","f":"{sd}–{ed} {sm} {sy}"},"c11":{"s":"{sd}/{sm}/{sy} – {ed}/{em}/{ey}","m":"{sd} {sm} – {ed} {em} {sy}","l":"{sd} {sm} – {ed} {em} {sy}","f":"{sd} {sm} – {ed} {em} {sy}"},"c12":{"s":"{sd}/{sm}/{sy}–{ed}/{em}/{ey}","m":"{sd} {sm} {sy} – {ed} {em} {ey}","l":"{sd} {sm} {sy} – {ed} {em} {ey}","f":"{sd} {sm} {sy} – {ed} {em} {ey}"},"c20":{"s":"{sm}/{sy}–{em}/{ey}","m":"{sm} {sy} – {em} {ey}","l":"{sm} {sy} – {em} {ey}","f":"{sm} {sy} – {em} {ey}"},"c30":"{sy} – {ey}"}},"coptic":"gregorian"};
ilib.data.dateformats_en_US = {"gregorian":{"date":{"dmwy":{"s":"EE M/d/yy","m":"EEE M/dd/yyyy","l":"EEE MMM d, yyyy","f":"EEEE MMMM d, yyyy"},"dmy":{"s":"M/d/yy","m":"M/d/yyyy","l":"MMM d, yyyy","f":"MMMM d, yyyy"},"dmw":{"s":"EE M/d","m":"EE M/d","l":"EEE MMM d","f":"EEEE MMMM d"},"dm":{"s":"M/d","m":"M/d","l":"MMM d","f":"MMMM d"}},"range":{"c00":{"s":"{st} - {et} {sm}/{sd}/{sy}","m":"{st} - {et}, {sm}/{sd}/{sy}","l":"{st} - {et}, {sm} {sd}, {sy}","f":"{st} - {et}, {sm} {sd}, {sy}"},"c01":{"s":"{sm}/{sd}/{sy} {st} - {em}/{ed}/{ey} {et}","m":"{sm}/{sd}/{sy} {st} - {em}/{ed}/{ey} {et}","l":"{sm} {sd} {st} - {ed} {et}, {sy}","f":"{sm} {sd} {st} - {ed} {et}, {sy}"},"c02":{"s":"{sm}/{sd}/{sy} {st} - {em}/{ed}/{ey} {et}","m":"{sm}/{sd} {st} - {em}/{ed} {et}, {sy}","l":"{sm} {sd} {st} - {em} {ed} {et}, {sy}","f":"{sm} {sd} {st} - {em} {ed} {et}, {sy}"},"c03":{"s":"{sm}/{sd}/{sy} {st} - {em}/{ed}/{ey} {et}","m":"{sm}/{sd}/{sy} {st} - {em}/{ed}/{ey} {et}","l":"{sm} {sd}, {sy} {st} - {em} {ed}, {ey} {et}","f":"{sm} {sd}, {sy} {st} - {em} {ed}, {ey} {et}"},"c10":{"s":"{sm}/{sd}/{sy} - {em}/{ed}/{ey}","m":"{sm}/{sd}/{sy} - {em}/{ed}/{ey}","l":"{sm} {sd}-{ed}, {sy}","f":"{sm} {sd}-{ed}, {sy}"},"c11":{"s":"{sm}/{sd}/{sy} - {em}/{ed}/{ey}","m":"{sm}/{sd} - {em}/{ed}, {sy}","l":"{sm} {sd} - {em} {ed}, {sy}","f":"{sm} {sd} - {em} {ed}, {sy}"},"c12":{"s":"{sm}/{sd}/{sy} - {em}/{ed}/{ey}","m":"{sm}/{sd}/{sy} - {em}/{ed}/{ey}","l":"{sm} {sd}, {sy} - {em} {ed}, {ey}","f":"{sm} {sd}, {sy} - {em} {ed}, {ey}"},"c20":{"s":"{sm}/{sy} - {em}/{ey}","m":"{sm}/{sy} - {em}/{ey}","l":"{sm} {sy} - {em} {ey}","f":"{sm} {sy} - {em} {ey}"},"c30":"{sy} - {ey}"}}};
ilib.data.dateformats_de = {"gregorian":{"order":"{time} {date}","date":{"dmwy":{"s":"EE dd.MM.yy","m":"EE dd.MM.yyyy","l":"EEE dd. MMM yyyy","f":"EEEE dd. MMMM yyyy"},"dmy":{"s":"dd.MM.yy","m":"dd.MM.yyyy","l":"dd. MMM yyyy","f":"dd. MMMM yyyy"},"dmw":{"s":"EE dd.MM","m":"EE dd.MM","l":"EEE dd. MMM","f":"EEEE dd. MMMM"},"dm":{"s":"dd.MM","m":"dd.MM","l":"dd. MMM","f":"dd. MMMM"},"my":{"s":"MM.yy","m":"MM.yyyy","l":"MMM yyyy","f":"MMMM yyyy"},"dw":{"s":"EE dd","m":"EEE dd","l":"EEE dd","f":"EEEE dd"},"d":"dd.","m":{"s":"MM","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"hh:mm:ss a z","ahms":"hh:mm:ss a","hmsz":"hh:mm:ss z","hms":"hh:mm:ss","ahmz":"hh:mm a z","ahm":"hh:mm a","hmz":"hh:mm z","ah":"hh a","hm":"hh:mm","h":"hh"},"24":{"ahmsz":"HH:mm:ss z","ahms":"HH:mm:ss","hmsz":"HH:mm:ss z","hms":"HH:mm:ss","ahmz":"HH:mm z","ahm":"HH:mm","hmz":"HH:mm z","ah":"HH","hm":"HH:mm","h":"HH"}},"range":{"c00":{"s":"{st} - {et} {sd}{sm}.{sy}","m":"{st} - {et} {sd}{sm}.{sy}","l":"{st} - {et} {sd} {sm} {sy}","f":"{st} - {et} {sd} {sm} {sy}"},"c01":{"s":"{st} {sd}{sm}.{sy} - {et} {ed}{em}.{ey}","m":"{st} {sd}{sm} - {et} {ed}{em} {sy}","l":"{st} {sd} {sm} - {et} {ed} {em} {sy}","f":"{st} {sd} {sm} - {et} {ed} {em} {sy}"},"c02":{"s":"{st} {sd}{sm}.{sy} - {et} {ed}{em}.{ey}","m":"{st} {sd}{sm} - {et} {ed}{em} {sy}","l":"{st} {sd} {sm} - {et} {ed} {em} {sy}","f":"{st} {sd} {sm} - {et} {ed} {em} {sy}"},"c03":{"s":"{st} {sd}{sm}.{sy} - {et} {ed}{em}.{ey}","m":"{st} {sd}{sm}.{sy} - {et} {ed}{em}.{ey}","l":"{st} {sd} {sm} {sy} - {et} {ed} {em} {ey}","f":"{st} {sd} {sm} {sy} - {et} {ed} {em} {ey}"},"c10":{"s":"{sd}{sm}.{sy} - {ed}{em}.{ey}","m":"{sd}{sm}.{sy} - {ed}{em}.{ey}","l":"{sd}-{ed} {sm} {sy}","f":"{sd}-{ed} {sm} {sy}"},"c11":{"s":"{sd}{sm}.{sy} - {ed}{em}.{ey}","m":"{sd}{sm} - {ed}{em} {sy}","l":"{sd} {sm} - {ed} {em} {sy}","f":"{sd} {sm} - {ed} {em} {sy}"},"c12":{"s":"{sd}{sm}.{sy} - {ed}{em}.{ey}","m":"{sd}{sm}.{sy} - {ed}{em}.{ey}","l":"{sd} {sm} {sy} - {ed} {em} {ey}","f":"{sd} {sm} {sy} - {ed} {em} {ey}"},"c20":{"s":"{sm}.{sy} - {em}.{ey}","m":"{sm}.{sy} - {em}.{ey}","l":"{sm} {sy} - {em} {ey}","f":"{sm} {sy} - {em} {ey}"},"c30":"{sy} - {ey}"}}};
ilib.data.dateformats_es = {"gregorian":{"order":"{date} {time}","date":{"dmwy":{"s":"EE dd/MM/yy","m":"EEE dd/MM/yyyy","l":"EEE dd 'de' MMM yyyy","f":"EEEE dd 'de' MMMM yyyy"},"dmy":{"s":"dd/MM/yy","m":"dd/MM/yyyy","l":"dd 'de' MMM yyyy","f":"dd 'de' MMMM yyyy"},"dmw":{"s":"EE dd/MM","m":"EE dd/MM","l":"EEE dd 'de' MMM","f":"EEEE dd 'de' MMMM"},"dm":{"s":"dd/MM","m":"dd/MM","l":"dd 'de' MMM","f":"dd 'de' MMMM"},"my":{"s":"MM/yy","m":"MM/yyyy","l":"MMM yy","f":"MMMM yyyy"},"dw":{"s":"EE dd","m":"EEE dd","l":"EEE dd","f":"EEEE dd"},"d":"dd","m":{"s":"M","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yy","l":"yyyy","f":"yyyy G"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"hh:mm:ssa z","ahms":"hh:mm:ssa","hmsz":"hh:mm:ss z","hms":"hh:mm:ss","ahmz":"hh:mma z","ahm":"hh:mma","hmz":"hh:mm z","ah":"hha","hm":"hh:mm","h":"hh"},"24":{"ahmsz":"HH:mm:ss z","ahms":"HH:mm:ss","hmsz":"HH:mm:ss z","hms":"HH:mm:ss","ahmz":"HH:mm z","ahm":"HH:mm","hmz":"HH:mm z","ah":"HH","hm":"HH:mm","h":"HH"}}}};
ilib.data.dateformats_it = {"gregorian":{"order":"{date} {time}","date":{"dmwy":{"s":"EE dd/MM/yy","m":"EEE dd/MM/yyyy","l":"EEE dd MMM yyyy","f":"EEEE dd MMMM yyyy"},"dmy":{"s":"dd/MM/yy","m":"dd/MM/yyyy","l":"dd MMM yyyy","f":"dd MMMM yyyy"},"dmw":{"s":"EE dd/MM","m":"EE dd/MM","l":"EEE dd MMM","f":"EEEE dd MMMM"},"dm":{"s":"dd/MM","m":"dd/MM","l":"dd MMM","f":"dd MMMM"},"my":{"s":"MM/yy","m":"MM/yyyy","l":"MMM yy","f":"MMMM yyyy"},"dw":{"s":"EE dd","m":"EEE dd","l":"EEE dd","f":"EEEE dd"},"d":"dd","m":{"s":"M","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yy","l":"yyyy","f":"yyyy G"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"hh.mm.ss a z","ahms":"hh.mm.ss a","hmsz":"hh.mm.ss z","hms":"hh.mm.ss","ahmz":"hh.mm a z","ahm":"hh.mm a","hmz":"hh.mm z","ah":"hh a","hm":"hh.mm","ms":"mm.ss","h":"hh"},"24":{"ahmsz":"HH.mm.ss z","ahms":"HH.mm.ss","hmsz":"HH.mm.ss z","hms":"HH.mm.ss","ahmz":"HH.mm z","ahm":"HH.mm","hmz":"HH.mm z","ah":"HH","hm":"HH.mm","ms":"mm.ss","h":"HH"}},"range":{"c00":{"s":"{st} - {et} {sd}/{sm}/{sy}","m":"{st} - {et} {sd}/{sm}/{sy}","l":"{st} - {et} {sd} {sm} {sy}","f":"{st} - {et} {sd} {sm} {sy}"},"c01":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm} {st} - {ed}/{em} {et} {sy}","l":"{sd} {st} - {ed} {et} {sm} {sy}","f":"{sd} {st} - {ed} {et} {sm} {sy}"},"c02":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm} {st} - {ed}/{em} {et} {sy}","l":"{sd} {sm} {st} - {ed} {em} {et} {sy}","f":"{sd} {sm} {st} - {ed} {em} {et} {sy}"},"c03":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","l":"{sd} {sm} {sy} {st} - {ed} {em} {ey} {et}","f":"{sd} {sm} {sy} {st} - {ed} {em} {ey} {et}"},"c10":{"s":"{sd}-{ed}/{sm}/{sy}","m":"{sd}-{ed}/{sm}/{sy}","l":"{sd}-{ed} {sm} {sy}","f":"{sd}-{ed} {sm} {sy}"},"c11":{"s":"{sd}/{sm}-{ed}/{em} {sy}","m":"{sd}/{sm} - {ed}/{em} {sy}","l":"{sd} {sm} - {ed} {em} {sy}","f":"{sd} {sm} - {ed} {em} {sy}"},"c12":{"s":"{sd}/{sm}/{sy}-{ed}/{em}/{ey}","m":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","l":"{sd} {sm} {sy} - {ed} {em} {ey}","f":"{sd} {sm} {sy} - {ed} {em} {ey}"},"c20":{"s":"{sm}/{sy}-{em}/{ey}","m":"{sm}/{sy} - {em}/{ey}","l":"{sm} {sy} - {em} {ey}","f":"{sm} {sy} - {em} {ey}"},"c30":"{sy} - {ey}"}}};
ilib.data.dateformats_fr = {"gregorian":{"order":"{time} {date}","date":{"dmwy":{"s":"EE d/MM/yy","m":"EE d/MM/yyyy","l":"EEE d MMM yyyy","f":"EEEE d MMMM yyyy"},"dmy":{"s":"d/MM/yy","m":"d/MM/yyyy","l":"d MMM yyyy","f":"d MMMM yyyy"},"dmw":{"s":"EE d/MM","m":"EE d/MM","l":"EEE d MMM","f":"EEEE d MMMM"},"dm":{"s":"d/MM","m":"d/MM","l":"d MMM","f":"d MMMM"},"my":{"s":"MM/yy","m":"MM/yyyy","l":"MMM yyyy","f":"MMMM yyyy"},"d":"dd","m":{"s":"MM","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"hh:mm:ss a z","ahms":"hh:mm:ss a","hmsz":"hh:mm:ss z","hms":"hh:mm:ss","ahmz":"hh:mm a z","ahm":"hh:mm a","hmz":"hh:mm z","ah":"hh a","hm":"hh:mm","h":"hh"},"24":{"ahmsz":"HH:mm:ss z","ahms":"HH:mm:ss","hmsz":"HH:mm:ss z","hms":"HH:mm:ss","ahmz":"HH:mm z","ahm":"HH:mm","hmz":"HH:mm z","ah":"HH","hm":"HH:mm","h":"HH"}},"range":{"c00":{"s":"{st} - {et} {sd}/{sm}/{sy}","m":"{st} - {et} {sd}/{sm}/{sy}","l":"{st} - {et} {sd} {sm} {sy}","f":"{st} - {et} {sd} {sm} {sy}"},"c01":{"s":"{st} {sd}/{sm} - {et} {ed}/{em}/{ey}","m":"{st} {sd}/{sm} - {et} {ed}/{em}/{sy}","l":"{st} {sd} {sm} - {et} {ed} {em} {sy}","f":"{st} {sd} {sm} - {et} {ed} {em} {sy}"},"c02":{"s":"{st} {sd}/{sm} - {et} {ed}/{em}/{ey}","m":"{st} {sd}/{sm} - {et} {ed}/{em}/{sy}","l":"{st} {sd} {sm} - {et} {ed} {em} {sy}","f":"{st} {sd} {sm} - {et} {ed} {em} {sy}"},"c03":{"s":"{st} {sd}/{sm}/{sy} - {et} {ed}/{em}/{ey}","m":"{st} {sd}/{sm}/{sy} - {et} {ed}/{em}/{ey}","l":"{st} {sd} {sm} {sy} - {et} {ed} {em} {ey}","f":"{st} {sd} {sm} {sy} - {et} {ed} {em} {ey}"},"c10":{"s":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","m":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","l":"{sd}-{ed} {sm} {sy}","f":"{sd}-{ed} {sm} {sy}"},"c11":{"s":"{sd}/{sm} - {ed}/{em}/{ey}","m":"{sd}/{sm} - {ed}/{em}/{sy}","l":"{sd} {sm} - {ed} {em} {sy}","f":"{sd} {sm} - {ed} {em} {sy}"},"c12":{"s":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","m":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","l":"{sd} {sm} {sy} - {ed} {em} {ey}","f":"{sd} {sm} {sy} - {ed} {em} {ey}"},"c20":{"s":"{sm}/{sy} - {em}/{ey}","m":"{sm}/{sy} - {em}/{ey}","l":"{sm} {sy} - {em} {ey}","f":"{sm} {sy} - {em} {ey}"},"c30":"{sy} - {ey}"}}};
ilib.data.dateformats_pt = {"gregorian":{"date":{"dmwy":{"s":"E, dd/MM/yy","m":"EE, dd/MM/yyyy","l":"EEE, dd 'de' MMM 'de' yyyy","f":"EEEE, dd 'de' MMMM 'de' yyyy"},"dmy":{"s":"dd/MM/yy","m":"dd/MM/yyyy","l":"dd 'de' MMM 'de' yyyy","f":"dd 'de' MMMM 'de' yyyy"},"dmw":{"s":"E, dd/MM","m":"EE, dd/MM","l":"EEE, dd 'de' MMM","f":"EEEE, dd 'de' MMMM"},"dm":{"s":"dd/MM","m":"dd/MM","l":"dd 'de' MMM","f":"dd 'de' MMMM"},"my":{"s":"MM/yy","m":"MM/yyyy","l":"MMM yyyy","f":"MMMM yyyy"},"dw":{"s":"EE, dd","m":"EE, dd","l":"EEE, dd","f":"EEEE, dd"},"d":{"s":"dd","m":"dd","l":"dd","f":"dd"},"m":{"s":"M","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"hh'h'mm'min'ss's' a z","ahms":"hh'h'mm'min'ss's' a","hmsz":"hh'h'mm'min'ss's' z","ahmz":"hh'h'mm'min' a z","hms":"hh'h'mm'min'ss's'","ahm":"hh'h'mm'min' a","hmz":"hh'h'mm'min' z","ah":"hh'h' a","hm":"hh'h'mm'min'","ms":"mm'min'ss's'","h":"hh"},"24":{"ahmsz":"HH'h'mm'min'ss's' z","ahms":"HH'h'mm'min'ss's'","hmsz":"HH'h'mm'min'ss's' z","ahmz":"HH'h'mm'min' z","hms":"HH'h'mm'min'ss's'","ahm":"HH'h'mm'min'","hmz":"HH'h'mm'min' z","ah":"HH'h'","hm":"HH'h'mm'min'","ms":"mm'min'ss's'","h":"HH"}},"range":{"c00":{"s":"{sd}/{sm}/{sy} {st} - {et}","m":"{sd}/{sm}/{sy} {st} - {et}","l":"{sd}/{sm}/{sy} {st} - {et}","f":"{sd} de {sm} de {sy} {st} - {et}"},"c01":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm} {st} - {ed}/{em} {et}, {sy}","l":"{sd} {st} - {ed} {et}, {sm} {sy}","f":"{sd} {st} - {ed} {et},  de {sm} {sy}"},"c02":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm} {st} - {ed}/{em} {et}, {sy}","l":"{sd} de {sm} {st} - {ed} de {em} {et}, {sy}","f":"{sd} de {sm} {st} - {ed} de {em} {et}, {sy}"},"c03":{"s":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","m":"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}","l":"{sd} de {sm} de {sy} {st} - {ed} de {em} de {ey} {et}","f":"{sd} de {sm} de {sy} {st} - {ed} de {em} de {ey} {et}"},"c10":{"s":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","m":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","l":"{sd}-{ed} de {sm} de {sy}","f":"{sd}-{ed} de {sm} de {sy}"},"c11":{"s":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","m":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","l":"{sd} de {sm} - {ed} de {em} de {sy}","f":"{sd} de {sm} - {ed} de {em} de {sy}"},"c12":{"s":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","m":"{sd}/{sm}/{sy} - {ed}/{em}/{ey}","l":"{sd} de {sm} de {sy} - {ed} de {em} de {ey}","f":"{sd} de {sm} de {sy} - {ed} de {em} de {ey}"},"c20":{"s":"{sm}/{sy} - {em}/{ey}","m":"{sm}/{sy} - {em}/{ey}","l":"{sm} de {sy} - {em} de {ey}","f":"{sm} de {sy} - {em} de {ey}"},"c30":"{sy} - {ey}"}}};
ilib.data.dateformats_ko = {"gregorian":{"order":"{date} {time}","date":{"dmwy":{"s":"E, yy. MM. dd","m":"EE, yyyy. MM. dd","l":"EEE, yyyy년 MMM월 d일","f":"yyyy년 MMM월 d일 (EEEE)"},"dmy":{"s":"yy. MM. dd","m":"yyyy. MM. dd","l":"yyyy년 MMM월 d일","f":"yyyy년 MMM월 d일"},"dmw":{"s":"E, MM. dd","m":"EE, MM. dd","l":"EEE, MMM월 d일","f":"MMM월 d일 (EEEE)"},"dm":{"s":"MM. dd","m":"MM. dd","l":"MMM월 d일","f":"MMM월 d일"},"my":{"s":"yy. MM.","m":"yyyy. MM.","l":"yyyy년 MMM월","f":"yyyy년 MMM월"},"dw":{"s":"EE, dd","m":"EE, dd","l":"EEE, d일","f":"d일(EEEE)"},"d":"dd","m":{"s":"M","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"a h:mm:ss z","ahms":"a h:mm:ss","ahmz":"a h:mm z","ahm":"a h:mm","ah":"a h"}},"range":{"c00":{"s":"{sy}. {sm}. {sd} {st}에서 {et}까지","m":"{sy}. {sm}. {sd} {st}에서 {et}까지","l":"{sy}년 {sm}월 {sd}일 {st}에서 {et}까지","f":"{sy}년 {sm}월 {sd}일 {st}에서 {et}까지"},"c01":{"s":"{sy}. {sm}. {sd} {st}에서 {ed} {et}까지","m":"{sy}. {sm}. {sd} {st}에서 {ed} {et}까지","l":"{sy}년 {sm}월 {sd}일 {st}에서 {ed}일 {et}까지","f":"{sy}년 {sm}월 {sd}일 {st}에서 {ed}일 {et}까지"},"c02":{"s":"{sy}. {sm}. {sd} {st}에서 {em}. {ed} {et}까지","m":"{sy}. {sm}. {sd} {st}에서 {em}. {ed} {et}까지","l":"{sy}년 {sm}월 {sd}일 {st}에서 {em}월 {ed}일 {et}까지","f":"{sy}년 {sm}월 {sd}일 {st}에서 {em}월 {ed}일 {et}까지"},"c03":{"s":"{sy}. {sm}. {sd} {st}에서 {ey}. {em}. {ed} {et}까지","m":"{sy}. {sm}. {sd} {st}에서 {ey}. {em}. {ed} {et}까지","l":"{sy}년 {sm}월 {sd}일 {st}에서 {ey}년 {em}월 {ed}일 {et}까지","f":"{sy}년 {sm}월 {sd}일 {st}에서 {ey}년 {em}월 {ed}일 {et}까지"},"c10":{"s":"{sy}. {sm}. {sd}에서 {ed}까지","m":"{sy}. {sm}. {sd}에서 {ed}까지","l":"{sy}년 {sm}월 {sd}일에서 {ed}일까지","f":"{sy}년 {sm}월 {sd}일에서 {ed}일까지"},"c11":{"s":"{sy}. {sm}. {sd}에서 {em}. {ed}까지","m":"{sy}. {sm}. {sd}에서 {em}. {ed}까지","l":"{sy}년 {sm}월 {sd}일에서 {em}월 {ed}일까지","f":"{sy}년 {sm}월 {sd}일에서 {em}월 {ed}일까지"},"c12":{"s":"{sy}. {sm}. {sd}에서 {ey}. {em}. {ed}까지","m":"{sy}. {sm}. {sd}에서 {ey}. {em}. {ed}까지","l":"{sy}년 {sm}월 {sd}일에서 {ey}년 {em}월 {ed}일까지","f":"{sy}년 {sm}월 {sd}일에서 {ey}년 {em}월 {ed}일까지"},"c20":{"s":"{sy}. {sm}.에서 {ey}. {em}.까지","m":"{sy}. {sm}.에서 {ey}. {em}.까지","l":"{sy}년 {sm}월에서 {ey}년 {em}월까지","f":"{sy}년 {sm}월에서 {ey}년 {em}월까지"},"c30":"{sy}년에서 {ey}년까지"}}};
ilib.data.dateformats_zh = {"gregorian":{"order":{"s":"{date} {time}","m":"{date} {time}","l":"{date}{time}","f":"{date}{time}"},"date":{"dmwy":{"s":"yy-MM-dd(E)","m":"yyyy-MM-dd(EE)","l":"yyyy年MMM月d日(EEE)","f":"yyyy年MMMM月d日(EEEE)"},"dmy":{"s":"yy-MM-dd","m":"yyyy-MM-dd","l":"yyyy年MMM月d日","f":"yyyy年MMMM月d日"},"dmw":{"s":"MM-dd(E)","m":"MM-dd(EE)","l":"MMM月d日(EEE)","f":"MMMM月d日(EEEE)"},"dm":{"s":"MM-dd","m":"MM-dd","l":"MMM月d日","f":"MMMM月d日"},"my":{"s":"yy-MM","m":"yyyy-MM","l":"yyyy年MMM月","f":"yyyy年MMMM月"},"dw":{"s":"d日(E)","m":"d日(EE)","l":"d日(EEE)","f":"d日(EEEE)"},"d":{"s":"d","m":"dd","l":"d日","f":"d日"},"m":{"s":"M","m":"MM","l":"MMM月","f":"MMMM月"},"y":{"s":"yy","m":"yyyy","l":"yyyy年","f":"yyyy年"},"n":{"s":"N","m":"NN","l":"MMM月","f":"MMMM月"}},"time":{"12":{"ahmsz":"ahh:mm:ssz","ahms":"ahh:mm:ss","hmsz":"hh:mm:ssz","hms":"hh:mm:ss","ahmz":"ahh:mmz","ahm":"ahh:mm","hmz":"hh:mmz","ah":"ahh","hm":"hh:mm","h":"hh"},"24":{"ahmsz":"HH:mm:ssz","ahms":"HH:mm:ss","hmsz":"HH:mm:ssz","hms":"HH:mm:ss","ahmz":"HH:mmz","ahm":"HH:mm","hmz":"HH:mmz","ah":"HH","hm":"HH:mm","h":"HH"}},"range":{"c00":{"s":"{sy}-{sm}-{sd}，{st}至{et}","m":"{sy}-{sm}-{sd}，{st}至{et}","l":"{sy}{sm}{sd}，{st}至{et}","f":"{sy}{sm}{sd}，{st}至{et}"},"c01":{"s":"{sy}-{sm}-{sd}，{st}至{ey}-{em}-{ed}，{et}","m":"{sy}-{sm}-{sd}，{st}至{ey}-{em}-{ed}，{et}","l":"{sy}{sm}{sd}{st}至{ed}{et}","f":"{sy}{sm}{sd}{st}至{ed}{et}"},"c02":{"s":"{sy}-{sm}-{sd}，{st}至{ey}-{em}-{ed}，{et}","m":"{sy}-{sm}-{sd}，{st}至{ey}-{em}-{ed}，{et}","l":"{sy}{sm}{sd}，{st}至{em}{ed}日，{et}","f":"{sy}{sm}{sd}，{st}至{em}{ed}日，{et}"},"c03":{"s":"{sy}-{sm}-{sd}，{st}至{ey}-{em}-{ed}，{et}","m":"{sy}-{sm}-{sd}，{st}至{ey}-{em}-{ed}，{et}","l":"{sy}{sm}{sd}，{st}至{ey}{em}{ed}，{et}","f":"{sy}{sm}{sd}，{st}至{ey}{em}{ed}，{et}"},"c10":{"s":"{sy}-{sm}-{sd}至{ed}","m":"{sy}-{sm}-{sd}至{ed}","l":"{sy}{sm}{sd}至{ed}","f":"{sy}{sm}{sd}至{ed}"},"c11":{"s":"{sy}-{sm}-{sd}至{em}-{ed}","m":"{sy}-{sm}-{sd}至{em}-{ed}","l":"{sy}{sm}{sd}至{em}{ed}","f":"{sy}{sm}{sd}至{em}{ed}"},"c12":{"s":"{sy}-{sm}-{sd}至{ey}-{em}-{ed}","m":"{sy}-{sm}-{sd}至{ey}-{em}-{ed}","l":"{sy}{sm}{sd}至{ey}{em}{ed}","f":"{sy}{sm}{sd}至{ey}{em}{ed}"},"c20":{"s":"{sy}-{sm}至{ey}-{em}","m":"{sy}-{sm}至{ey}-{em}","l":"{sy}{sm}至{ey}{em}","f":"{sy}{sm}至{ey}{em}"},"c30":"{sy}至{ey}"}}};
ilib.data.dateformats_ja = {"gregorian":{"order":"{date} {time}","date":{"dmwy":{"s":"yy/MM/dE","m":"yyyy/MM/dEE","l":"yyyy年MMM月d日EEE","f":"yyyy年MMMM月d日（EEEE）"},"dmy":{"s":"yy/MM/dd","m":"yyyy/MM/dd","l":"yyyy年MMM月d日","f":"yyyy年MMMM月d日"},"dmw":{"s":"MM/dE","m":"MM/dEE","l":"MMM月d日EEE","f":"MMMM月d日（EEEE）"},"dm":{"s":"MM/dd","m":"MM/dd","l":"MMM月d日","f":"MMMM月d日"},"my":{"s":"yy/MM","m":"yyyy/MM","l":"yyyy年MMM月","f":"yyyy年MMMM月"},"dw":{"s":"dEE","m":"dEE","l":"dEEE","f":"dEEEE"},"d":"dd","m":{"s":"M","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"ahh:mm:ss z","ahms":"ahh:mm:ss","hmsz":"hh:mm:ss z","hms":"hh:mm:ss","ahmz":"ahh:mm z","ahm":"ahh:mm","hmz":"hh:mm z","ah":"ahh","hm":"hh:mm","h":"hh"},"24":{"ahmsz":"HH:mm:ss z","ahms":"HH:mm:ss","hmsz":"HH:mm:ss z","hms":"HH:mm:ss","ahmz":"HH:mm z","ahm":"HH:mm","hmz":"HH:mm z","ah":"HH","hm":"HH:mm","h":"HH"}},"range":{"c00":{"s":"{sy}/{sm}/{sd} {st}-{et}","m":"{sy}/{sm}/{sd} {st}-{et}","l":"{sy}年{sm}月{sd}日{st}-{et}","f":"{sy}年{sm}月{sd}日{st}-{et}"},"c01":{"s":"{sy}/{sm}/{sd} {st}-{ey}/{em}/{ed} {et}","m":"{sy}/{sm}/{sd} {st}-{ey}/{em}/{ed} {et}","l":"{sy}年{sm}月{sd}日{st}-{ed}日{et}","f":"{sy}年{sm}月{sd}日{st}-{ed}日{et}"},"c02":{"s":"{sy}/{sm}/{sd} {st}-{ey}/{em}/{ed} {et}","m":"{sy}/{sm}/{sd} {st}-{ey}/{em}/{ed} {et}","l":"{sy}年{sm}月{sd}日{st}-{em}月{ed}日{et}","f":"{sy}年{sm}月{sd}日{st}-{em}月{ed}日{et}"},"c03":{"s":"{sy}/{sm}/{sd} {st}-{ey}/{em}/{ed} {et}","m":"{sy}/{sm}/{sd} {st}-{ey}/{em}/{ed} {et}","l":"{sy}年{sm}月{sd}日{st}-{ey}年{em}月{ed}日{et}","f":"{sy}年{sm}月{sd}日{st}-{ey}年{em}月{ed}日{et}"},"c10":{"s":"{sy}/{sm}/{sd}-{ed}","m":"{sy}/{sm}/{sd}-{ed}","l":"{sy}年{sm}月{sd}-{ed}日","f":"{sy}年{sm}月{sd}-{ed}日"},"c11":{"s":"{sy}/{sm}/{sd}-{ey}/{em}/{ed}","m":"{sy}/{sm}/{sd}-{ey}/{em}/{ed}","l":"{sy}年{sm}月{sd}日-{em}月{ed}日","f":"{sy}年{sm}月{sd}日-{em}月{ed}日"},"c12":{"s":"{sy}/{sm}/{sd}-{ey}/{em}/{ed}","m":"{sy}/{sm}/{sd}-{ey}/{em}/{ed}","l":"{sy}年{sm}月{sd}日-{ey}年{em}月{ed}日","f":"{sy}年{sm}月{sd}日-{ey}年{em}月{ed}日"},"c20":{"s":"{sy}/{sm}-{ey}/{em}","m":"{sy}/{sm}-{ey}/{em}","l":"{sy}年{sm}月-{ey}年{em}月","f":"{sy}年{sm}月-{ey}年{em}月"},"c30":"{sy}-{ey}"}}};
ilib.data.dateformats_ru = {"gregorian":{"date":{"dmwy":{"s":"E, dd.MM.yy","m":"EE, dd.MM.yyyy","l":"EEE, d MMM yyyy","f":"EEEE, d MMMM yyyy 'г.'"},"dmy":{"s":"dd.MM.yy","m":"dd.MM.yyyy","l":"d MMM yyyy","f":"d MMMM yyyy 'г.'"},"dmw":{"s":"E, dd.MM","m":"EE, dd.MM","l":"EEE, d MMM","f":"EEEE, d MMMM"},"dm":{"s":"dd.MM","m":"dd.MM","l":"d MMM","f":"d MMMM"},"my":{"s":"MM.yy","m":"MM.yyyy","l":"MMM yyyy","f":"MMMM yyyy 'г.'"},"dw":{"s":"EE, d","m":"EE, d","l":"EEE, d","f":"EEEE, d"},"d":{"s":"d","m":"d","l":"d","f":"d"},"m":{"s":"MM","m":"MM","l":"MMM","f":"MMMM"},"y":{"s":"yy","m":"yyyy","l":"yyyy","f":"yyyy"},"n":{"s":"N","m":"NN","l":"MMM","f":"MMMM"}},"time":{"12":{"ahmsz":"h:mm:ss a z","ahms":"h:mm:ss a","ahmz":"h:mm a z","ahm":"h:mm a","ah":"h a"}},"range":{"c00":{"s":"{sd}.{sm}.{sy} {st}-{et}","m":"{sd}.{sm}.{sy} {st}-{et}","l":"{sd}.{sm}.{sy} {st}-{et}","f":"{sd} {sm} {sy} г. {st}-{et}"},"c01":{"s":"{sd}.{sm} {st} - {ed}.{em} {et}, {sy}","m":"{sd}.{sm} {st} - {ed}.{em} {et}, {sy}","l":"{sd} {st} - {ed} {et}, {sm} {sy}","f":"{sd} {st} - {ed} {et}, {sm} {sy} г."},"c02":{"s":"{sd}.{sm}.{sy} {st} - {ed}.{em}.{ey} {et}","m":"{sd}.{sm} {st} - {ed}.{em} {et}, {sy}","l":"{sd} {sm} {st} - {ed} {em} {et}, {sy}","f":"{sd} {sm} {st} - {ed} {em} {et}, {sy} г."},"c03":{"s":"{sd}.{sm}.{sy} {st} - {ed}.{em}.{ey} {et}","m":"{sd}.{sm}.{sy} {st} - {ed}.{em}.{ey} {et}","l":"{sd} {sm} {sy} {st} - {ed} {em} {ey} {et}","f":"{sd} {sm} {sy} г. {st} - {ed} {em} {ey} г. {et}"},"c10":{"s":"{sd}.{sm}.{sy} - {ed}.{em}.{ey}","m":"{sd}.{sm}.{sy} - {ed}.{em}.{ey}","l":"{sd}-{ed} {sm} {sy} г.","f":"{sd}-{ed} {sm} {sy} г."},"c11":{"s":"{sd}.{sm}.{sy} - {ed}.{em}.{ey}","m":"{sd}.{sm}.{sy} - {ed}.{em}.{ey}","l":"{sd} {sm} - {ed} {em} {sy} г.","f":"{sd} {sm} - {ed} {em} {sy} г."},"c12":{"s":"{sd}.{sm}.{sy} - {ed}.{em}.{ey}","m":"{sd}.{sm}.{sy} - {ed}.{em}.{ey}","l":"{sd} {sm} {sy} - {ed} {em} {ey} г.","f":"{sd} {sm} {sy} - {ed} {em} {ey} г."},"c20":{"s":"{sm}.{sy} - {em}.{ey}","m":"{sm}.{sy} - {em}.{ey}","l":"{sm} {sy} - {em} {ey} г.","f":"{sm} {sy} - {em} {ey} г."},"c30":"{sy}-{ey}"}}};
ilib.data.sysres = {"MMMM1":"January","MMM1":"Jan","NN1":"Ja","N1":"J","MMMM2":"February","MMM2":"Feb","NN2":"Fe","N2":"F","MMMM3":"March","MMM3":"Mar","NN3":"Ma","N3":"M","MMMM4":"April","MMM4":"Apr","NN4":"Ap","N4":"A","MMMM5":"May","MMM5":"May","NN5":"Ma","N5":"M","MMMM6":"June","MMM6":"Jun","NN6":"Ju","N6":"J","MMMM7":"July","MMM7":"Jul","NN7":"Ju","N7":"J","MMMM8":"August","MMM8":"Aug","NN8":"Au","N8":"A","MMMM9":"September","MMM9":"Sep","NN9":"Se","N9":"S","MMMM10":"October","MMM10":"Oct","NN10":"Oc","N10":"O","MMMM11":"November","MMM11":"Nov","NN11":"No","N11":"N","MMMM12":"December","MMM12":"Dec","NN12":"De","N12":"D","EEEE0":"Sunday","EEE0":"Sun","EE0":"Su","E0":"S","EEEE1":"Monday","EEE1":"Mon","EE1":"Mo","E1":"M","EEEE2":"Tuesday","EEE2":"Tue","EE2":"Tu","E2":"T","EEEE3":"Wednesday","EEE3":"Wed","EE3":"We","E3":"W","EEEE4":"Thursday","EEE4":"Thu","EE4":"Th","E4":"T","EEEE5":"Friday","EEE5":"Fri","EE5":"Fr","E5":"F","EEEE6":"Saturday","EEE6":"Sat","EE6":"Sa","E6":"S","ordinalChoice":"1#1st|2#2nd|3#3rd|21#21st|22#22nd|23#23rd|31#31st|#{num}th","a0":"AM","a1":"PM","azh0":"AM","azh1":"AM","azh2":"AM","azh3":"PM","azh4":"PM","azh5":"PM","azh6":"PM","a0-ethiopic":"morning","a1-ethiopic":"noon","a2-ethiopic":"afternoon","a3-ethiopic":"evening","a4-ethiopic":"night","G-1":"BCE","G1":"CE","separatorFull":", ","finalSeparatorFull":", and ","separatorShort":" ","separatorMedium":" ","separatorLong":", ","N1-hebrew":"N","N2-hebrew":"I","N3-hebrew":"S","N4-hebrew":"T","N5-hebrew":"A","N6-hebrew":"E","N7-hebrew":"T","N8-hebrew":"Ḥ","N9-hebrew":"K","N10-hebrew":"T","N11-hebrew":"S","N12-hebrew":"A","N13-hebrew":"A","NN1-hebrew":"Ni","NN2-hebrew":"Iy","NN3-hebrew":"Si","NN4-hebrew":"Ta","NN5-hebrew":"Av","NN6-hebrew":"El","NN7-hebrew":"Ti","NN8-hebrew":"Ḥe","NN9-hebrew":"Ki","NN10-hebrew":"Te","NN11-hebrew":"Sh","NN12-hebrew":"Ad","NN13-hebrew":"A2","MMM1-hebrew":"Nis","MMM2-hebrew":"Iyy","MMM3-hebrew":"Siv","MMM4-hebrew":"Tam","MMM5-hebrew":"Av","MMM6-hebrew":"Elu","MMM7-hebrew":"Tis","MMM8-hebrew":"Ḥes","MMM9-hebrew":"Kis","MMM10-hebrew":"Tev","MMM11-hebrew":"She","MMM12-hebrew":"Ada","MMM13-hebrew":"Ad2","MMMM1-hebrew":"Nisan","MMMM2-hebrew":"Iyyar","MMMM3-hebrew":"Sivan","MMMM4-hebrew":"Tammuz","MMMM5-hebrew":"Av","MMMM6-hebrew":"Elul","MMMM7-hebrew":"Tishri","MMMM8-hebrew":"Ḥeshvan","MMMM9-hebrew":"Kislev","MMMM10-hebrew":"Teveth","MMMM11-hebrew":"Shevat","MMMM12-hebrew":"Adar","MMMM13-hebrew":"Adar II","E0-hebrew":"R","E1-hebrew":"S","E2-hebrew":"S","E3-hebrew":"R","E4-hebrew":"Ḥ","E5-hebrew":"S","E6-hebrew":"S","EE0-hebrew":"ri","EE1-hebrew":"se","EE2-hebrew":"sl","EE3-hebrew":"rv","EE4-hebrew":"ḥa","EE5-hebrew":"si","EE6-hebrew":"sa","EEE0-hebrew":"ris","EEE1-hebrew":"she","EEE2-hebrew":"shl","EEE3-hebrew":"rvi","EEE4-hebrew":"ḥam","EEE5-hebrew":"shi","EEE6-hebrew":"sha","EEEE0-hebrew":"yom rishon","EEEE1-hebrew":"yom sheni","EEEE2-hebrew":"yom shlishi","EEEE3-hebrew":"yom r'vi‘i","EEEE4-hebrew":"yom ḥamishi","EEEE5-hebrew":"yom shishi","EEEE6-hebrew":"yom shabbat","N1-islamic":"M","N2-islamic":"Ṣ","N3-islamic":"R","N4-islamic":"R","N5-islamic":"J","N6-islamic":"J","N7-islamic":"R","N8-islamic":"Š","N9-islamic":"R","N10-islamic":"Š","N11-islamic":"Q","N12-islamic":"Ḥ","NN1-islamic":"Mu","NN2-islamic":"Ṣa","NN3-islamic":"Rb","NN4-islamic":"R2","NN5-islamic":"Ju","NN6-islamic":"J2","NN7-islamic":"Ra","NN8-islamic":"Šh","NN9-islamic":"Ra","NN10-islamic":"Ša","NN11-islamic":"Qa","NN12-islamic":"Ḥi","MMM1-islamic":"Muḥ","MMM2-islamic":"Ṣaf","MMM3-islamic":"Rab","MMM4-islamic":"Ra2","MMM5-islamic":"Jum","MMM6-islamic":"Ju2","MMM7-islamic":"Raj","MMM8-islamic":"Šha","MMM9-islamic":"Ram","MMM10-islamic":"Šaw","MMM11-islamic":"Qad","MMM12-islamic":"Ḥij","MMMM1-islamic":"Muḥarram","MMMM2-islamic":"Ṣafar","MMMM3-islamic":"Rabī‘ I","MMMM4-islamic":"Rabī‘ II","MMMM5-islamic":"Jumādā I","MMMM6-islamic":"Jumādā II","MMMM7-islamic":"Rajab","MMMM8-islamic":"Šha'bān","MMMM9-islamic":"Ramaḍān","MMMM10-islamic":"Šawwāl","MMMM11-islamic":"Ḏu al-Qa‘da","MMMM12-islamic":"Ḏu al-Ḥijja","E0-islamic":"A","E1-islamic":"I","E2-islamic":"T","E3-islamic":"A","E4-islamic":"K","E5-islamic":"J","E6-islamic":"S","EE0-islamic":"ah","EE1-islamic":"it","EE2-islamic":"th","EE3-islamic":"ar","EE4-islamic":"kh","EE5-islamic":"ju","EE6-islamic":"sa","EEE0-islamic":"aha","EEE1-islamic":"ith","EEE2-islamic":"tha","EEE3-islamic":"arb","EEE4-islamic":"kha","EEE5-islamic":"jum","EEE6-islamic":"sab","EEEE0-islamic":"yawn al-ahad","EEEE1-islamic":"yawn al-ithnaya","EEEE2-islamic":"yawn uth-thalathaa","EEEE3-islamic":"yawn al-arba‘a","EEEE4-islamic":"yawn al-khamis","EEEE5-islamic":"yawn al-jum‘a","EEEE6-islamic":"yawn as-sabt","N1-persian":"F","N2-persian":"O","N3-persian":"K","N4-persian":"T","N5-persian":"M","N6-persian":"S","N7-persian":"M","N8-persian":"A","N9-persian":"A","N10-persian":"D","N11-persian":"B","N12-persian":"E","NN1-persian":"Fa","NN2-persian":"Or","NN3-persian":"Kh","NN4-persian":"Ti","NN5-persian":"Mo","NN6-persian":"Sh","NN7-persian":"Me","NN8-persian":"Ab","NN9-persian":"Az","NN10-persian":"De","NN11-persian":"Ba","NN12-persian":"Es","MMM1-persian":"Far","MMM2-persian":"Ord","MMM3-persian":"Kho","MMM4-persian":"Tir","MMM5-persian":"Mor","MMM6-persian":"Sha","MMM7-persian":"Meh","MMM8-persian":"Aba","MMM9-persian":"Aza","MMM10-persian":"Dey","MMM11-persian":"Bah","MMM12-persian":"Esf","MMMM1-persian":"Farvardin","MMMM2-persian":"Ordibehesht","MMMM3-persian":"Khordad","MMMM4-persian":"Tir","MMMM5-persian":"Mordad","MMMM6-persian":"Shahrivar","MMMM7-persian":"Mehr","MMMM8-persian":"Aban","MMMM9-persian":"Azar","MMMM10-persian":"Dey","MMMM11-persian":"Bahman","MMMM12-persian":"Esfand","EE0-persian":"Ye","EE1-persian":"Do","EE2-persian":"Se","EE3-persian":"Ch","EE4-persian":"Pa","EE5-persian":"Jo","EE6-persian":"Sh","EEE0-persian":"Yek","EEE1-persian":"Dos","EEE2-persian":"Ses","EEE3-persian":"Cha","EEE4-persian":"Pan","EEE5-persian":"Jom","EEE6-persian":"Sha","EEEE0-persian":"Yekshanbeh","EEEE1-persian":"Doshanbeh","EEEE2-persian":"Seshhanbeh","EEEE3-persian":"Chaharshanbeh","EEEE4-persian":"Panjshanbeh","EEEE5-persian":"Jomeh","EEEE6-persian":"Shanbeh","N1-persian-algo":"F","N2-persian-algo":"O","N3-persian-algo":"K","N4-persian-algo":"T","N5-persian-algo":"M","N6-persian-algo":"S","N7-persian-algo":"M","N8-persian-algo":"A","N9-persian-algo":"A","N10-persian-algo":"D","N11-persian-algo":"B","N12-persian-algo":"E","NN1-persian-algo":"Fa","NN2-persian-algo":"Or","NN3-persian-algo":"Kh","NN4-persian-algo":"Ti","NN5-persian-algo":"Mo","NN6-persian-algo":"Sh","NN7-persian-algo":"Me","NN8-persian-algo":"Ab","NN9-persian-algo":"Az","NN10-persian-algo":"De","NN11-persian-algo":"Ba","NN12-persian-algo":"Es","MMM1-persian-algo":"Far","MMM2-persian-algo":"Ord","MMM3-persian-algo":"Kho","MMM4-persian-algo":"Tir","MMM5-persian-algo":"Mor","MMM6-persian-algo":"Sha","MMM7-persian-algo":"Meh","MMM8-persian-algo":"Aba","MMM9-persian-algo":"Aza","MMM10-persian-algo":"Dey","MMM11-persian-algo":"Bah","MMM12-persian-algo":"Esf","MMMM1-persian-algo":"Farvardin","MMMM2-persian-algo":"Ordibehesht","MMMM3-persian-algo":"Khordad","MMMM4-persian-algo":"Tir","MMMM5-persian-algo":"Mordad","MMMM6-persian-algo":"Shahrivar","MMMM7-persian-algo":"Mehr","MMMM8-persian-algo":"Aban","MMMM9-persian-algo":"Azar","MMMM10-persian-algo":"Dey","MMMM11-persian-algo":"Bahman","MMMM12-persian-algo":"Esfand","EE0-persian-algo":"Ye","EE1-persian-algo":"Do","EE2-persian-algo":"Se","EE3-persian-algo":"Ch","EE4-persian-algo":"Pa","EE5-persian-algo":"Jo","EE6-persian-algo":"Sh","EEE0-persian-algo":"Yek","EEE1-persian-algo":"Dos","EEE2-persian-algo":"Ses","EEE3-persian-algo":"Cha","EEE4-persian-algo":"Pan","EEE5-persian-algo":"Jom","EEE6-persian-algo":"Sha","EEEE0-persian-algo":"Yekshanbeh","EEEE1-persian-algo":"Doshanbeh","EEEE2-persian-algo":"Seshhanbeh","EEEE3-persian-algo":"Chaharshanbeh","EEEE4-persian-algo":"Panjshanbeh","EEEE5-persian-algo":"Jomeh","EEEE6-persian-algo":"Shanbeh","M1-thaisolar":"M","M2-thaisolar":"K","M3-thaisolar":"M","M4-thaisolar":"M","M5-thaisolar":"P","M6-thaisolar":"M","M7-thaisolar":"K","M8-thaisolar":"S","M9-thaisolar":"K","M10-thaisolar":"T","M11-thaisolar":"P","M12-thaisolar":"T","MM1-thaisolar":"MaK","MM2-thaisolar":"KP","MM3-thaisolar":"MiK","MM4-thaisolar":"MY","MM5-thaisolar":"PK","MM6-thaisolar":"MY","MM7-thaisolar":"KK","MM8-thaisolar":"SK","MM9-thaisolar":"KY","MM10-thaisolar":"TuK","MM11-thaisolar":"PY","MM12-thaisolar":"ThK","MMM1-thaisolar":"Ma.K.","MMM2-thaisolar":"Ku.P.","MMM3-thaisolar":"Mi.K.","MMM4-thaisolar":"Me.Y.","MMM5-thaisolar":"Ph.K.","MMM6-thaisolar":"Mi.Y.","MMM7-thaisolar":"Ka.K.","MMM8-thaisolar":"Si.K.","MMM9-thaisolar":"Ka.Y.","MMM10-thaisolar":"Tu.K.","MMM11-thaisolar":"Ph.Y.","MMM12-thaisolar":"Th.K.","MMMM1-thaisolar":"Makarakhom","MMMM2-thaisolar":"Kumphaphan","MMMM3-thaisolar":"Minakhom","MMMM4-thaisolar":"Mesayon","MMMM5-thaisolar":"Phruetsaphakhom","MMMM6-thaisolar":"Mithunayon","MMMM7-thaisolar":"Karakadakhom","MMMM8-thaisolar":"Singhakhom","MMMM9-thaisolar":"Kanyayon","MMMM10-thaisolar":"Tulakhom","MMMM11-thaisolar":"Phruetsachikayon","MMMM12-thaisolar":"Thanwakhom","E0-thaisolar":"A","E1-thaisolar":"C","E2-thaisolar":"A","E3-thaisolar":"P","E4-thaisolar":"P","E5-thaisolar":"S","E6-thaisolar":"S","EE0-thaisolar":"at","EE1-thaisolar":"ch","EE2-thaisolar":"an","EE3-thaisolar":"pu","EE4-thaisolar":"pr","EE5-thaisolar":"su","EE6-thaisolar":"sa","EEE0-thaisolar":"ath","EEE1-thaisolar":"cha","EEE2-thaisolar":"ang","EEE3-thaisolar":"phu","EEE4-thaisolar":"phr","EEE5-thaisolar":"suk","EEE6-thaisolar":"sao","EEEE0-thaisolar":"wan athit","EEEE1-thaisolar":"wan chan","EEEE2-thaisolar":"wan angkhan","EEEE3-thaisolar":"wan phut","EEEE4-thaisolar":"wan phruehatsabodi","EEEE5-thaisolar":"wan suk","EEEE6-thaisolar":"wan sao","N1-coptic":"T","N2-coptic":"P","N3-coptic":"A","N4-coptic":"K","N5-coptic":"T","N6-coptic":"M","N7-coptic":"P","N8-coptic":"P","N9-coptic":"P","N10-coptic":"P","N11-coptic":"E","N12-coptic":"M","N13-coptic":"E","NN1-coptic":"Th","NN2-coptic":"Pa","NN3-coptic":"At","NN4-coptic":"Ko","NN5-coptic":"To","NN6-coptic":"Me","NN7-coptic":"Pa","NN8-coptic":"Pa","NN9-coptic":"Pa","NN10-coptic":"Pa","NN11-coptic":"Ep","NN12-coptic":"Me","NN13-coptic":"Ep","MMM1-coptic":"Tho","MMM2-coptic":"Pao","MMM3-coptic":"Ath","MMM4-coptic":"Koi","MMM5-coptic":"Tob","MMM6-coptic":"Mes","MMM7-coptic":"Par","MMM8-coptic":"Par","MMM9-coptic":"Pas","MMM10-coptic":"Pao","MMM11-coptic":"Epe","MMM12-coptic":"Mes","MMM13-coptic":"Epa","MMMM1-coptic":"Thoout","MMMM2-coptic":"Paope","MMMM3-coptic":"Athor","MMMM4-coptic":"Koiak","MMMM5-coptic":"Tobe","MMMM6-coptic":"Meshir","MMMM7-coptic":"Paremotep","MMMM8-coptic":"Parmoute","MMMM9-coptic":"Pashons","MMMM10-coptic":"Paoone","MMMM11-coptic":"Epeep","MMMM12-coptic":"Mesore","MMMM13-coptic":"Epagomene","E0-coptic":"T","E1-coptic":"P","E2-coptic":"P","E3-coptic":"P","E4-coptic":"P","E5-coptic":"P","E6-coptic":"P","EE0-coptic":"Tk","EE1-coptic":"Pe","EE2-coptic":"Ps","EE3-coptic":"Pe","EE4-coptic":"Pt","EE5-coptic":"Ps","EE6-coptic":"Ps","EEE0-coptic":"Tky","EEE1-coptic":"Pes","EEE2-coptic":"Psh","EEE3-coptic":"Pef","EEE4-coptic":"Pti","EEE5-coptic":"Pso","EEE6-coptic":"Psa","EEEE0-coptic":"Tkyriake","EEEE1-coptic":"Pesnau","EEEE2-coptic":"Pshoment","EEEE3-coptic":"Peftoou","EEEE4-coptic":"Ptiou","EEEE5-coptic":"Psoou","EEEE6-coptic":"Psabbaton","N1-ethiopic":"M","N2-ethiopic":"T","N3-ethiopic":"H","N4-ethiopic":"T","N5-ethiopic":"T","N6-ethiopic":"Y","N7-ethiopic":"M","N8-ethiopic":"M","N9-ethiopic":"G","N10-ethiopic":"S","N11-ethiopic":"H","N12-ethiopic":"N","N13-ethiopic":"P","NN1-ethiopic":"Ma","NN2-ethiopic":"Te","NN3-ethiopic":"He","NN4-ethiopic":"Ta","NN5-ethiopic":"Te","NN6-ethiopic":"Ya","NN7-ethiopic":"Ma","NN8-ethiopic":"Mi","NN9-ethiopic":"Ge","NN10-ethiopic":"Sa","NN11-ethiopic":"Ha","NN12-ethiopic":"Na","NN13-ethiopic":"Pa","MMM1-ethiopic":"Mas","MMM2-ethiopic":"Teq","MMM3-ethiopic":"Hed","MMM4-ethiopic":"Tak","MMM5-ethiopic":"Ter","MMM6-ethiopic":"Yak","MMM7-ethiopic":"Mag","MMM8-ethiopic":"Miy","MMM9-ethiopic":"Gen","MMM10-ethiopic":"San","MMM11-ethiopic":"Ham","MMM12-ethiopic":"Nah","MMM13-ethiopic":"Pag","MMMM1-ethiopic":"Maskaram","MMMM2-ethiopic":"Teqemt","MMMM3-ethiopic":"Hedar","MMMM4-ethiopic":"Takhsas","MMMM5-ethiopic":"Ter","MMMM6-ethiopic":"Yakatit","MMMM7-ethiopic":"Magabit","MMMM8-ethiopic":"Miyazya","MMMM9-ethiopic":"Genbot","MMMM10-ethiopic":"Sane","MMMM11-ethiopic":"Hamle","MMMM12-ethiopic":"Nahase","MMMM13-ethiopic":"Paguemen","E0-ethiopic":"I","E1-ethiopic":"S","E2-ethiopic":"M","E3-ethiopic":"R","E4-ethiopic":"H","E5-ethiopic":"A","E6-ethiopic":"K","EE0-ethiopic":"Ih","EE1-ethiopic":"Sa","EE2-ethiopic":"Ma","EE3-ethiopic":"Ro","EE4-ethiopic":"Ha","EE5-ethiopic":"Ar","EE6-ethiopic":"Ki","EEE0-ethiopic":"Ihu","EEE1-ethiopic":"San","EEE2-ethiopic":"Mak","EEE3-ethiopic":"Rob","EEE4-ethiopic":"Ham","EEE5-ethiopic":"Arb","EEE6-ethiopic":"Kid","EEEE0-ethiopic":"Ihud","EEEE1-ethiopic":"Sanyo","EEEE2-ethiopic":"Maksanyo","EEEE3-ethiopic":"Rob/Rabu'e","EEEE4-ethiopic":"Hamus","EEEE5-ethiopic":"Arb","EEEE6-ethiopic":"Kidamme"};
ilib.data.sysres_en_US = {"a0":"am","a1":"pm","G-1":"BC","G1":"AD","finalSeparatorFull":" and "};
ilib.data.sysres_de = {"MMMM1":"Januar","MMM1":"Jan.","MMMM2":"Februar","MMM2":"Feb.","MMMM3":"März","MMM3":"Mär.","NN3":"Mä","MMM4":"Apr.","MMMM5":"Mai","MMM5":"Mai","MMMM6":"Juni","MMM6":"Jun.","MMMM7":"Juli","MMM7":"Jul.","MMM8":"Aug.","MMM9":"Sep.","MMMM10":"Oktober","MMM10":"Okt.","NN10":"Ok","MMM11":"Nov.","MMMM12":"Dezember","MMM12":"Dez.","EEEE0":"Sonntag","EEE0":"So.","EE0":"So","EEEE1":"Montag","EEE1":"Mo.","EEEE2":"Dienstag","EEE2":"Di.","EE2":"Di","E2":"D","EEEE3":"Mittwoch","EEE3":"Mi.","EE3":"Mi","E3":"M","EEEE4":"Donnerstag","EEE4":"Do.","EE4":"Do","E4":"D","EEEE5":"Freitag","EEE5":"Fr.","EEEE6":"Samstag","EEE6":"Sa.","ordinalChoice":"#{num}.","a0":"vorm.","a1":"nachm.","G-1":"v. Chr.","G1":"n. Chr.","durationShortMillis":"#{num}Ms","#{num}s":"#{num}S","durationShortMinutes":"#{num}M","#{num}h":"#{num}St","#{num}d":"#{num}T","#{num}w":"#{num}W","durationShortMonths":"#{num}Mo","#{num}y":"#{num}J","#{num} ms":"#{num} Ms.","1#1 se|#{num} sec":"#{num} Se.","1#1 mi|#{num} min":"#{num} Mi.","durationMediumHours":"#{num} St.","1#1 dy|#{num} dys":"#{num} Ta.","durationMediumWeeks":"#{num} Wo.","1#1 mo|#{num} mos":"#{num} Mo.","durationMediumYears":"#{num} Ja.","1#1 sec|#{num} sec":"#{num} Sek.","1#1 min|#{num} min":"#{num} Min.","1#1 hr|#{num} hrs":"#{num} Std.","durationLongDays":"1#{num} Tag|#{num} Tage","1#1 wk|#{num} wks":"#{num} Wch.","1#1 mon|#{num} mons":"#{num} Mon.","1#1 yr|#{num} yrs":"#{num} Jhr.","1#1 millisecond|#{num} milliseconds":"1#{num} Millisekunde|#{num} Millisekunden","1#1 second|#{num} seconds":"1#{num} Sekunde|#{num} Sekunden","1#1 minute|#{num} minutes":"1#{num} Minute|#{num} Minuten","1#1 hour|#{num} hours":"1#{num} Stunde|#{num} Stunden","1#1 day|#{num} days":"1#{num} Tag|#{num} Tage","1#1 week|#{num} weeks":"1#{num} Woche|#{num} Wochen","1#1 month|#{num} months":"1#{num} Monat|#{num} Monate","1#1 year|#{num} years":"1#{num} Jahr|#{num} Jahre","{duration} ago":"vor {duration}","in {duration}":"in {duration}","separatorShort":" ","separatorMedium":" ","separatorLong":", ","separatorFull":", ","finalSeparatorFull":" und "};
ilib.data.sysres_es = {"MMMM1":"enero","MMM1":"ene","NN1":"en","N1":"E","MMMM2":"febrero","MMM2":"feb","NN2":"fe","MMMM3":"marzo","MMM3":"mar","NN3":"ma","MMMM4":"abril","MMM4":"abr","NN4":"ab","MMMM5":"mayo","MMM5":"may","NN5":"ma","MMMM6":"junio","MMM6":"jun","NN6":"ju","MMMM7":"julio","MMM7":"jul","NN7":"ju","MMMM8":"agosto","MMM8":"ago","NN8":"ag","MMMM9":"septiembre","MMM9":"sep","NN9":"se","MMMM10":"octubre","MMM10":"oct","NN10":"oc","MMMM11":"noviembre","MMM11":"nov","NN11":"no","MMMM12":"diciembre","MMM12":"dic","NN12":"di","EEEE0":"domingo","EEE0":"dom","EE0":"do","E0":"D","EEEE1":"lunes","EEE1":"lun","EE1":"lu","E1":"L","EEEE2":"martes","EEE2":"mar","EE2":"ma","E2":"M","EEEE3":"miércoles","EEE3":"mié","EE3":"mi","E3":"M","EEEE4":"jueves","EEE4":"jue","EE4":"ju","E4":"J","EEEE5":"viernes","EEE5":"vie","EE5":"vi","E5":"V","EEEE6":"sábado","EEE6":"sáb","EE6":"sá","ordinalChoice":"#{num} º","a0":"a.m.","a1":"p.m.","G-1":"a.C.","G1":"d.C.","durationShortMillis":"#{num}ms","#{num}s":"#{num}s","durationShortMinutes":"#{num}m","#{num}h":"#{num}h","#{num}d":"#{num}d","#{num}w":"#{num}sm","durationShortMonths":"#{num}me","#{num}y":"#{num}a","#{num} ms":"#{num} ms","1#1 se|#{num} sec":"1#{num} sg|#{num} sgs","1#1 mi|#{num} min":"1#{num} mn|#{num} mns","durationMediumHours":"1#{num} hr|#{num} hrs","1#1 dy|#{num} dys":"1#{num} dí|#{num} dís","durationMediumWeeks":"1#{num} sm|#{num} sms","1#1 mo|#{num} mos":"1#{num} me|#{num} mss","durationMediumYears":"1#{num} añ|#{num} añs","1#1 sec|#{num} sec":"1#{num} seg|#{num} segs","1#1 min|#{num} min":"1#{num} min|#{num} mins","1#1 hr|#{num} hrs":"1#{num} hor|#{num} hors","durationLongDays":"1#{num} día|#{num} días","1#1 wk|#{num} wks":"1#{num} sem|#{num} sems","1#1 mon|#{num} mons":"1#{num} mes|#{num} mss","1#1 yr|#{num} yrs":"1#{num} año|#{num} años","1#1 millisecond|#{num} milliseconds":"1#{num} millisegundo|#{num} millisegundos","1#1 second|#{num} seconds":"1#{num} segundo|#{num} segundos","1#1 minute|#{num} minutes":"1#{num} minuto|#{num} minutos","1#1 hour|#{num} hours":"1#{num} hora|#{num} horas","1#1 day|#{num} days":"1#{num} día|#{num} días","1#1 week|#{num} weeks":"1#{num} semana|#{num} semanas","1#1 month|#{num} months":"1#{num} mes|#{num} meses","1#1 year|#{num} years":"1#{num} año|#{num} años","{duration} ago":"hace {duration}","in {duration}":"en {duration}","separatorShort":" ","separatorMedium":" ","separatorLong":" ","separatorFull":", ","finalSeparatorFull":" y "};
ilib.data.sysres_es_ES = {"E3":"X","in {duration}":"dentro de {duration}"};
ilib.data.sysres_it = {"MMMM1":"gennaio","MMM1":"gen","NN1":"ge","N1":"G","MMMM2":"febbraio","MMM2":"feb","NN2":"fe","MMMM3":"marzo","MMM3":"mar","NN3":"ma","MMMM4":"aprile","MMM4":"apr","NN4":"ap","MMMM5":"maggio","MMM5":"mag","NN5":"ma","MMMM6":"giugno","MMM6":"giu","NN6":"gi","N6":"G","MMMM7":"luglio","MMM7":"lug","NN7":"lu","N7":"L","MMMM8":"agosto","MMM8":"ago","NN8":"ag","MMMM9":"settembre","MMM9":"set","NN9":"se","MMMM10":"ottobre","MMM10":"ott","NN10":"ot","MMMM11":"novembre","MMM11":"nov","NN11":"no","MMMM12":"dicembre","MMM12":"dic","NN12":"di","EEEE0":"domenica","EEE0":"dom","EE0":"do","E0":"D","EEEE1":"lunedì","EEE1":"lun","EE1":"lu","E1":"L","EEEE2":"martedì","EEE2":"mar","EE2":"ma","E2":"M","EEEE3":"mercoledì","EEE3":"mer","EE3":"me","E3":"M","EEEE4":"giovedì","EEE4":"gio","EE4":"gi","E4":"G","EEEE5":"venerdì","EEE5":"ven","EE5":"ve","E5":"V","EEEE6":"sabato","EEE6":"sab","EE6":"sa","ordinalChoice":"#{num} º","a0":"AM","a1":"PM","G-1":"aC","G1":"dC","durationShortMillis":"#{num}ms","#{num}s":"#{num}s","durationShortMinutes":"#{num}m","#{num}h":"#{num}o","#{num}d":"#{num}g","#{num}w":"#{num}st","durationShortMonths":"#{num}me","#{num}y":"#{num}a","#{num} ms":"#{num} ms","1#1 se|#{num} sec":"#{num} se","1#1 mi|#{num} min":"#{num} mn","durationMediumHours":"#{num} h","1#1 dy|#{num} dys":"1#{num} g|#{num} gg","durationMediumWeeks":"#{num} set","1#1 mo|#{num} mos":"#{num} me","durationMediumYears":"#{num} an","1#1 sec|#{num} sec":"#{num} sec","1#1 min|#{num} min":"#{num} min","1#1 hr|#{num} hrs":"#{num} h","durationLongDays":"1#{num} g|#{num} gg","1#1 wk|#{num} wks":"#{num} sett","1#1 mon|#{num} mons":"1#{num} mese|#{num} mesi","1#1 yr|#{num} yrs":"1#{num} anno|#{num} anni","1#1 millisecond|#{num} milliseconds":"1#{num} millisecondo|#{num} millisecondi","1#1 second|#{num} seconds":"1#{num} secondo|#{num} secondi","1#1 minute|#{num} minutes":"1#{num} minuto|#{num} minuti","1#1 hour|#{num} hours":"1#{num} ora|#{num} ore","1#1 day|#{num} days":"1#{num} giorno|#{num} giorni","1#1 week|#{num} weeks":"1#{num} settimana|#{num} settimane","1#1 month|#{num} months":"1#{num} mese|#{num} mesi","1#1 year|#{num} years":"1#{num} anno|#{num} anni","in {duration}":"tra {duration}","{duration} ago":"{duration} fa","separatorShort":" ","separatorMedium":" ","separatorLong":" ","separatorFull":", ","finalSeparatorFull":", e "};
ilib.data.sysres_fr = {"MMMM1":"janvier","MMM1":"janv","NN1":"ja","MMMM2":"février","MMM2":"févr","NN2":"fé","MMMM3":"mars","MMM3":"mars","NN3":"ma","MMMM4":"avril","MMM4":"avr","NN4":"av","MMMM5":"mai","MMM5":"mai","NN5":"ma","MMMM6":"juin","MMM6":"juin","NN6":"ju","MMMM7":"juillet","MMM7":"juil","NN7":"ju","MMMM8":"août","MMM8":"août","NN8":"ao","MMMM9":"septembre","MMM9":"sept","NN9":"se","MMMM10":"octobre","MMM10":"oct","NN10":"oc","MMMM11":"novembre","MMM11":"nov","NN11":"no","MMMM12":"décembre","MMM12":"déc","NN12":"dé","EEEE0":"dimanche","EEE0":"dim.","EE0":"di","E0":"D","EEEE1":"lundi","EEE1":"lun.","EE1":"lu","E1":"L","EEEE2":"mardi","EEE2":"mar.","EE2":"ma","E2":"M","EEEE3":"mercredi","EEE3":"mer.","EE3":"me","E3":"M","EEEE4":"jeudi","EEE4":"jeu.","EE4":"je","E4":"J","EEEE5":"vendredi","EEE5":"ven.","EE5":"ve","E5":"V","EEEE6":"samedi","EEE6":"sam.","EE6":"sa","ordinalChoice":"1#1er|#{num}e","a0":"matin","a1":"soir","G-1":"av. J.-C.","G1":"ap. J.-C.","durationShortMillis":"#{num}ms","#{num}s":"#{num}s","durationShortMinutes":"#{num}m","#{num}h":"#{num}h","#{num}d":"#{num}j","#{num}w":"#{num}sm","durationShortMonths":"#{num}mo","#{num}y":"#{num}a","#{num} ms":"#{num} Ms","1#1 se|#{num} sec":"1#{num} se|#{num} ses","1#1 mi|#{num} min":"1#{num} mn|#{num} mns","durationMediumHours":"1#{num} hr|#{num} hrs","1#1 dy|#{num} dys":"1#{num} jr|#{num} jrs","durationMediumWeeks":"1#{num} sm|#{num} sms","1#1 mo|#{num} mos":"1#{num} mo|#{num} mos","durationMediumYears":"1#{num} an|#{num} ans","1#1 sec|#{num} sec":"1#{num} sec|#{num} secs","1#1 min|#{num} min":"1#{num} min|#{num} mins","1#1 hr|#{num} hrs":"1#{num} hr|#{num} hrs","durationLongDays":"1#{num} jr|#{num} jrs","1#1 wk|#{num} wks":"1#{num} sem|#{num} sems","1#1 mon|#{num} mons":"1#{num} mois|#{num} mois","1#1 yr|#{num} yrs":"1#{num} an|#{num} ans","1#1 millisecond|#{num} milliseconds":"1#{num} milliseconde|#{num} millisecondes","1#1 second|#{num} seconds":"1#{num} seconde|#{num} secondes","1#1 minute|#{num} minutes":"1#{num} minute|#{num} minutes","1#1 hour|#{num} hours":"1#{num} heure|#{num} heures","1#1 day|#{num} days":"1#{num} jour|#{num} jours","1#1 week|#{num} weeks":"1#{num} semaine|#{num} semaines","1#1 month|#{num} months":"#{num} mois","1#1 year|#{num} years":"1#{num} an|#{num} ans","{duration} ago":"il y a {duration}","in {duration}":"dans {duration}","separatorShort":" ","separatorMedium":" ","separatorLong":" ","separatorFull":", ","finalSeparatorFull":" et "};
ilib.data.sysres_pt = {"MMMM1":"Janeiro","MMM1":"Jan","NN1":"Ja","MMMM2":"Fevereiro","MMM2":"Fev","NN2":"Fe","MMMM3":"Março","MMM3":"Mar","NN3":"Ma","MMMM4":"Abril","MMM4":"Abr","NN4":"Ab","MMMM5":"Maio","MMM5":"Mai","NN5":"Ma","MMMM6":"Junho","MMM6":"Jun","NN6":"Ju","MMMM7":"Julho","MMM7":"Jul","NN7":"Ju","MMMM8":"Agosto","MMM8":"Ago","NN8":"Ag","MMMM9":"Setembro","MMM9":"Set","NN9":"Se","MMMM10":"Outubro","MMM10":"Out","NN10":"Ou","MMMM11":"Novembro","MMM11":"Nov","NN11":"No","MMMM12":"Dezembro","MMM12":"Dez","NN12":"De","EEEE0":"domingo","EEE0":"dom","EE0":"do","E0":"D","EEEE1":"segunda-feira","EEE1":"seg","EE1":"sg","E1":"S","EEEE2":"terça-feira","EEE2":"ter","EE2":"te","EEEE3":"quarta-feira","EEE3":"qua","EE3":"qu","E3":"Q","EEEE4":"quinta-feira","EEE4":"qui","EE4":"qi","E4":"Q","EEEE5":"sexta-feira","EEE5":"sex","EE5":"sx","E5":"S","EEEE6":"sábado","EEE6":"sáb","EE6":"sb","ordinalChoice":"#{num}","a0":"AM","a1":"PM","G-1":"a.C.","G1":"d.C.","durationShortMillis":"#{num}ms","#{num}s":"#{num}s","durationShortMinutes":"#{num}m","#{num}h":"#{num}h","#{num}d":"#{num}d","#{num}w":"#{num}sm","durationShortMonths":"#{num}me","#{num}y":"#{num}a","#{num} ms":"#{num} ms","1#1 se|#{num} sec":"1#{num} sg|#{num} sgs","1#1 mi|#{num} min":"1#{num} mn|#{num} mns","durationMediumHours":"1#{num} hr|#{num} hrs","1#1 dy|#{num} dys":"1#{num} di|#{num} dis","durationMediumWeeks":"1#{num} sm|#{num} sms","1#1 mo|#{num} mos":"1#{num} mê|#{num} mes","durationMediumYears":"1#{num} an|#{num} ans","1#1 sec|#{num} sec":"1#{num} seg|#{num} segs","1#1 min|#{num} min":"1#{num} min|#{num} mins","1#1 hr|#{num} hrs":"1#{num} hor|#{num} hors","durationLongDays":"1#{num} dia|#{num} dias","1#1 wk|#{num} wks":"1#{num} sem|#{num} sems","1#1 mon|#{num} mons":"1#{num} mês|#{num} mss","1#1 yr|#{num} yrs":"1#{num} ano|#{num} anos","1#1 millisecond|#{num} milliseconds":"1#{num} millisegundo|#{num} millisegundos","1#1 second|#{num} seconds":"1#{num} segundo|#{num} segundos","1#1 minute|#{num} minutes":"1#{num} minuto|#{num} minutos","1#1 hour|#{num} hours":"1#{num} hora|#{num} horas","1#1 day|#{num} days":"1#{num} dia|#{num} dias","1#1 week|#{num} weeks":"1#{num} semana|#{num} semanas","1#1 month|#{num} months":"1#{num} mês|#{num} meses","1#1 year|#{num} years":"1#{num} ano|#{num} anos","{duration} ago":"há {duration}","in {duration}":"dentro de {duration}","separatorShort":" ","separatorMedium":" ","separatorLong":" ","separatorFull":", ","finalSeparatorFull":" e "};
ilib.data.sysres_pt_BR = {"NN1":"ja","NN2":"fe","NN3":"ma","NN4":"ab","NN5":"ma","NN6":"ju","NN7":"ju","NN8":"ag","NN9":"se","NN10":"ou","NN11":"no","NN12":"de","MMM1":"jan","MMM2":"fev","MMM3":"mar","MMM4":"abr","MMM5":"mai","MMM6":"jun","MMM7":"jul","MMM8":"ago","MMM9":"set","MMM10":"out","MMM11":"nov","MMM12":"dez","MMMM1":"janeiro","MMMM2":"fevereiro","MMMM3":"março","MMMM4":"abril","MMMM5":"maio","MMMM6":"junho","MMMM7":"julho","MMMM8":"agosto","MMMM9":"setembro","MMMM10":"outubro","MMMM11":"novembro","MMMM12":"dezembro","EE1":"se","EE4":"qu","EE5":"se","EE6":"sá"};
ilib.data.sysres_ko = {"MMMM1":"일","MMM1":"1","NN1":"1","N1":"1","MMMM2":"이","MMM2":"2","NN2":"2","N2":"2","MMMM3":"삼","MMM3":"3","NN3":"3","N3":"3","MMMM4":"사","MMM4":"4","NN4":"4","N4":"4","MMMM5":"오","MMM5":"5","NN5":"5","N5":"5","MMMM6":"유","MMM6":"6","NN6":"6","N6":"6","MMMM7":"칠","MMM7":"7","NN7":"7","N7":"7","MMMM8":"팔","MMM8":"8","NN8":"8","N8":"8","MMMM9":"구","MMM9":"9","NN9":"9","N9":"9","MMMM10":"시","MMM10":"10","NN10":"10","N10":"1O","MMMM11":"십일","MMM11":"11","NN11":"11","N11":"11","MMMM12":"십이","MMM12":"12","NN12":"12","N12":"12","EEEE0":"일요일","EEE0":"일요일","EE0":"일","E0":"일","EEEE1":"월요일","EEE1":"월요일","EE1":"월","E1":"월","EEEE2":"화요일","EEE2":"화요일","EE2":"화","E2":"화","EEEE3":"수요일","EEE3":"수요일","EE3":"수","E3":"수","EEEE4":"목요일","EEE4":"목요일","EE4":"목","E4":"목","EEEE5":"금요일","EEE5":"금요일","EE5":"금","E5":"금","EEEE6":"토요일","EEE6":"토요일","EE6":"토","E6":"토","ordinalChoice":"#{num}","a0":"오전","a1":"오후","G-1":"기원전","G1":"서기","durationShortMillis":"#{num}리초","#{num}s":"#{num}초","durationShortMinutes":"#{num}분","#{num}h":"#{num}시","#{num}d":"#{num}일","#{num}w":"#{num}주","durationShortMonths":"#{num}개","#{num}y":"#{num}년","#{num} ms":"#{num}리초","1#1 se|#{num} sec":"#{num}초","1#1 mi|#{num} min":"#{num}분","durationMediumHours":"#{num}시간","1#1 dy|#{num} dys":"#{num}일","durationMediumWeeks":"#{num}주","1#1 mo|#{num} mos":"#{num}개월","durationMediumYears":"#{num}년","1#1 sec|#{num} sec":"#{num}초","1#1 min|#{num} min":"#{num}분","1#1 hr|#{num} hrs":"#{num}시간","durationLongDays":"#{num}일","1#1 wk|#{num} wks":"#{num}주","1#1 mon|#{num} mons":"#{num}개월","1#1 yr|#{num} yrs":"#{num}년","1#1 millisecond|#{num} milliseconds":"#{num}밀리초","1#1 second|#{num} seconds":"#{num}초","1#1 minute|#{num} minutes":"#{num}분","1#1 hour|#{num} hours":"#{num}시간","1#1 day|#{num} days":"#{num}일","1#1 week|#{num} weeks":"#{num}주","1#1 month|#{num} months":"#{num}개월","1#1 year|#{num} years":"#{num}년","{duration} ago":"{duration}전","in {duration}":"{duration}에","separatorShort":" ","separatorMedium":" ","separatorLong":", ","separatorFull":", ","finalSeparatorFull":" 및 "};
ilib.data.sysres_zh = {"MMMM1":"1","MMM1":"1","NN1":"01","N1":"1","MMMM2":"2","MMM2":"2","NN2":"02","N2":"2","MMMM3":"3","MMM3":"3","NN3":"03","N3":"3","MMMM4":"4","MMM4":"4","NN4":"04","N4":"4","MMMM5":"5","MMM5":"5","NN5":"05","N5":"5","MMMM6":"6","MMM6":"6","NN6":"06","N6":"6","MMMM7":"7","MMM7":"7","NN7":"07","N7":"7","MMMM8":"8","MMM8":"8","NN8":"08","N8":"8","MMMM9":"9","MMM9":"9","NN9":"09","N9":"9","MMMM10":"10","MMM10":"10","NN10":"10","N10":"1O","MMMM11":"11","MMM11":"11","NN11":"11","N11":"11","MMMM12":"12","MMM12":"12","NN12":"12","N12":"12","EEEE0":"星期日","EEE0":"周日","EE0":"周日","E0":"日","EEEE1":"星期一","EEE1":"周一","EE1":"周一","E1":"一","EEEE2":"星期二","EEE2":"周二","EE2":"周二","E2":"二","EEEE3":"星期三","EEE3":"周三","EE3":"周三","E3":"三","EEEE4":"星期四","EEE4":"周四","EE4":"周四","E4":"四","EEEE5":"星期五","EEE5":"周五","EE5":"周五","E5":"五","EEEE6":"星期六","EEE6":"周六","EE6":"周六","E6":"六","ordinalChoice":"#{num}天","a0":"上午","a1":"下午","azh0":"凌晨","azh1":"早上","azh2":"上午","azh3":"中午","azh4":"下午","azh5":"傍晚","azh6":"晚上","G-1":"公元前","G1":"公元","durationShortMillis":"#{num}毫秒","#{num}s":"#{num}秒","durationShortMinutes":"#{num}分钟","#{num}h":"#{num}小时","#{num}d":"#{num}天","#{num}w":"#{num}周","durationShortMonths":"#{num}个月","#{num}y":"#{num}年","#{num} ms":"#{num}毫秒","1#1 se|#{num} sec":"#{num}秒","1#1 mi|#{num} min":"#{num}分钟","durationMediumHours":"#{num}小时","1#1 dy|#{num} dys":"#{num}天","durationMediumWeeks":"#{num}周","1#1 mo|#{num} mos":"#{num}个月","durationMediumYears":"#{num}年","1#1 sec|#{num} sec":"#{num}秒","1#1 min|#{num} min":"#{num}分钟","1#1 hr|#{num} hrs":"#{num}小时","durationLongDays":"#{num}天","1#1 wk|#{num} wks":"#{num}周","1#1 mon|#{num} mons":"#{num}个月","1#1 yr|#{num} yrs":"#{num}年","1#1 millisecond|#{num} milliseconds":"#{num}毫秒","1#1 second|#{num} seconds":"#{num}秒","1#1 minute|#{num} minutes":"#{num}分钟","1#1 hour|#{num} hours":"#{num}小时","1#1 day|#{num} days":"#{num}天","1#1 week|#{num} weeks":"#{num}周","1#1 month|#{num} months":"#{num}个月","1#1 year|#{num} years":"#{num}年","{duration} ago":"{duration}前","in {duration}":"{duration}后","separatorShort":"","separatorMedium":"","separatorLong":"、","separatorFull":"、","finalSeparatorFull":"和"};
ilib.data.sysres_ja = {"MMMM1":"1","MMM1":"1","NN1":"1","N1":"一","MMMM2":"2","MMM2":"2","NN2":"2","N2":"二","MMMM3":"3","MMM3":"3","NN3":"3","N3":"三","MMMM4":"4","MMM4":"4","NN4":"4","N4":"四","MMMM5":"5","MMM5":"5","NN5":"5","N5":"五","MMMM6":"6","MMM6":"6","NN6":"6","N6":"六","MMMM7":"7","MMM7":"7","NN7":"7","N7":"七","MMMM8":"8","MMM8":"8","NN8":"8","N8":"八","MMMM9":"9","MMM9":"9","NN9":"9","N9":"九","MMMM10":"10","MMM10":"10","NN10":"10","N10":"十","MMMM11":"11","MMM11":"11","NN11":"11","N11":"十一","MMMM12":"12","MMM12":"12","NN12":"12","N12":"十二","EEEE0":"日曜日","EEE0":"日曜日","EE0":"日","E0":"日","EEEE1":"月曜日","EEE1":"月曜日","EE1":"月","E1":"月","EEEE2":"火曜日","EEE2":"火曜日","EE2":"火","E2":"火","EEEE3":"水曜日","EEE3":"水曜日","EE3":"水","E3":"水","EEEE4":"木曜日","EEE4":"木曜日","EE4":"木","E4":"木","EEEE5":"金曜日","EEE5":"金曜日","EE5":"金","E5":"金","EEEE6":"土曜日","EEE6":"土曜日","EE6":"土","E6":"土","ordinalChoice":"#{num}","a0":"午前","a1":"午後","G-1":"紀元前","G1":"紀元","durationShortMillis":"#{num}ミリ秒","#{num}s":"#{num}秒","durationShortMinutes":"#{num}分","#{num}h":"#{num}時間","#{num}d":"#{num}日","#{num}w":"#{num}週間","durationShortMonths":"#{num}ヶ月","#{num}y":"#{num}年","#{num} ms":"#{num}ミリ秒","1#1 se|#{num} sec":"#{num}秒","1#1 mi|#{num} min":"#{num}分","durationMediumHours":"#{num}時間","1#1 dy|#{num} dys":"#{num}日","durationMediumWeeks":"#{num}週間","1#1 mo|#{num} mos":"#{num}ヶ月","durationMediumYears":"#{num}年","1#1 sec|#{num} sec":"#{num}秒","1#1 min|#{num} min":"#{num}分","1#1 hr|#{num} hrs":"#{num}時間","durationLongDays":"#{num}日","1#1 wk|#{num} wks":"#{num}週間","1#1 mon|#{num} mons":"#{num}ヶ月","1#1 yr|#{num} yrs":"#{num}年","1#1 millisecond|#{num} milliseconds":"#{num}ミリ秒","1#1 second|#{num} seconds":"#{num}秒","1#1 minute|#{num} minutes":"#{num}分","1#1 hour|#{num} hours":"#{num}時間","1#1 day|#{num} days":"#{num}日","1#1 week|#{num} weeks":"#{num}週間","1#1 month|#{num} months":"#{num}ヶ月","1#1 year|#{num} years":"#{num}年","{duration} ago":"{duration}前","in {duration}":"{duration}で","separatorShort":"","separatorMedium":"","separatorLong":"、","separatorFull":"、","finalSeparatorFull":"、"};
ilib.data.sysres_ru = {"N1":"Я","N2":"Ф","N3":"М","N4":"А","N5":"М","N6":"И","N7":"И","N8":"А","N9":"С","N10":"О","N11":"Н","N12":"Д","NN1":"ян","NN2":"фе","NN3":"ма","NN4":"ап","NN5":"ма","NN6":"ию","NN7":"ию","NN8":"ав","NN9":"се","NN10":"ок","NN11":"но","NN12":"де","MMM1":"янв.","MMM2":"февр.","MMM3":"марта","MMM4":"апр.","MMM5":"мая","MMM6":"июня","MMM7":"июля","MMM8":"авг.","MMM9":"сент.","MMM10":"окт.","MMM11":"нояб.","MMM12":"дек","MMMM1":"января","MMMM2":"февраля","MMMM3":"марта","MMMM4":"апреля","MMMM5":"мая","MMMM6":"июня","MMMM7":"июля","MMMM8":"августа","MMMM9":"сентября","MMMM10":"октября","MMMM11":"ноября","MMMM12":"декабря","E0":"В","E1":"П","E2":"В","E3":"С","E4":"Ч","E5":"П","E6":"С","EE0":"вс","EE1":"пн","EE2":"вт","EE3":"ср","EE4":"чт","EE5":"пт","EE6":"сб","EEE0":"вс","EEE1":"пн","EEE2":"вт","EEE3":"ср","EEE4":"чт","EEE5":"пт","EEE6":"сб","EEEE0":"воскресенье","EEEE1":"понедельник","EEEE2":"вторник","EEEE3":"среда","EEEE4":"четверг","EEEE5":"пятница","EEEE6":"суббота","a0":"до полудня","a1":"после полудня","G-1":"до н.э.","G1":"н.э.","in {duration}":"через {duration}","{duration} ago":"{duration} назад","1#1 year|#{num} years":"one#{num} год|many#{num} лет|#{num} года","1#1 month|#{num} months":"one#{num} месяц|many#{num} месяцев|#{num} месяца","1#1 week|#{num} weeks":"one#{num} неделя|many#{num} недель|#{num} недели","1#1 day|#{num} days":"one#{num} день|many#{num} дней|#{num} дня","1#1 hour|#{num} hours":"one#{num} час|many#{num} часов|#{num} часа","1#1 minute|#{num} minutes":"one#{num} минута|many#{num} минут|#{num} минуты","1#1 second|#{num} seconds":"one#{num} секунда|many#{num} секунд|#{num} секунды","1#1 yr|#{num} yrs":"one#{num} год|many#{num} лет|#{num} года","1#1 mon|#{num} mons":"#{num} мес","1#1 wk|#{num} wks":"#{num} нед","durationLongDays":"one#{num} день|many#{num} дней|#{num} дня","1#1 hr|#{num} hrs":"one#{num} час|many#{num} час|#{num} часа","1#1 min|#{num} min":"#{num} мин","1#1 sec|#{num} sec":"#{num} сек","durationMediumYears":"#{num} г","1#1 mo|#{num} mos":"#{num} ме","durationMediumWeeks":"#{num} не","1#1 dy|#{num} dys":"#{num} дн","durationMediumHours":"#{num} ч","1#1 mi|#{num} min":"#{num} ми","1#1 se|#{num} sec":"#{num} се","#{num}y":"#{num}г","durationShortMonths":"#{num}м","#{num}w":"#{num}н","#{num}d":"#{num}д","#{num}h":"#{num}ч","durationShortMinutes":"#{num}м","#{num}s":"#{num}с","durationShortMillis":"#{num}мс","separatorShort":" ","separatorMedium":" ","separatorLong":" ","separatorFull":", ","finalSeparatorFull":" и "};
/*
 * datefmt.js - Date formatter definition
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
date.js 
strings.js 
resources.js 
calendar.js
localeinfo.js
timezone.js
calendar/gregorian.js
util/jsutils.js
*/

// !data dateformats sysres

/**
 * @class
 * Create a new date formatter instance. The date formatter is immutable once
 * it is created, but can format as many different dates as needed with the same
 * options. Create different date formatter instances for different purposes
 * and then keep them cached for use later if you have more than one date to
 * format.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the date/time. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>calendar</i> - the type of calendar to use for this format. The value should
 * be a sting containing the name of the calendar. Currently, the supported
 * types are "gregorian", "julian", "arabic", "hebrew", or "chinese". If the
 * calendar is not specified, then the default calendar for the locale is used. When the
 * calendar type is specified, then the format method must be called with an instance of
 * the appropriate date type. (eg. Gregorian calendar means that the format method must 
 * be called with a GregDate instance.)
 *  
 * <li><i>timezone</i> - time zone to use when formatting times. This may be a time zone
 * instance or a time zone specifier from the IANA list of time zone database names 
 * (eg. "America/Los_Angeles"), 
 * the string "local", or a string specifying the offset in RFC 822 format. The IANA
 * list of time zone names can be viewed at 
 * <a href="http://en.wikipedia.org/wiki/List_of_tz_database_time_zones">this page</a>.
 * If the time zone is given as "local", the offset from UTC as given by
 * the Javascript system is used. If the offset is given as an RFC 822 style offset
 * specifier, it will parse that string and use the resulting offset. If the time zone
 * is not specified, the
 * default time zone for the locale is used. If both the date object and this formatter
 * instance contain time zones and those time zones are different from each other, the 
 * formatter will calculate the offset between the time zones and subtract it from the 
 * date before formatting the result for the current time zone. The theory is that a date
 * object that contains a time zone specifies a specific instant in time that is valid
 * around the world, whereas a date object without one is a local time and can only be
 * used for doing things in the local time zone of the user.
 * 
 * <li><i>type</i> - Specify whether this formatter should format times only, dates only, or
 * both times and dates together. Valid values are "time", "date", and "datetime". Note that
 * in some locales, the standard format uses the order "time followed by date" and in others, 
 * the order is exactly opposite, so it is better to create a single "datetime" formatter 
 * than it is to create a time formatter and a date formatter separately and concatenate the 
 * results. A "datetime" formatter will get the order correct for the locale.<p>
 * 
 * The default type if none is specified in with the type option is "date".
 * 
 * <li><i>length</i> - Specify the length of the format to use. The length is the approximate size of the 
 * formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the time. This is the most compact format possible for the locale.
 * <li><i>medium</i> - use a medium length representation of the time. This is a slightly longer format.
 * <li><i>long</i> - use a long representation of the time. This is a fully specified format, but some of the textual 
 * components may still be abbreviated
 * <li><i>full</i> - use a full representation of the time. This is a fully specified format where all the textual 
 * components are spelled out completely
 * </ul>
 * 
 * eg. The "short" format for an en_US date may be "MM/dd/yy", whereas the long format might be "d MMM, yyyy". In the long
 * format, the month name is textual instead of numeric and is longer, the year is 4 digits instead of 2, and the format 
 * contains slightly more spaces and formatting characters.<p>
 * 
 * Note that the length parameter does not specify which components are to be formatted. Use the "date" and the "time"
 * properties to specify the components. Also, very few of the components of a time format differ according to the length,
 * so this property has little to no affect on time formatting.
 * 
 * <li><i>date</i> - This property tells
 * which components of a date format to use. For example,
 * sometimes you may wish to format a date that only contains the month and date
 * without the year, such as when displaying a person's yearly birthday. The value
 * of this property allows you to specify only those components you want to see in the
 * final output, ordered correctly for the locale. <p>
 * 
 * Valid values are:
 * 
 * <ul>
 * <li><i>dmwy</i> - format all components, weekday, date, month, and year
 * <li><i>dmy</i> - format only date, month, and year
 * <li><i>dmw</i> - format only weekday, date, and month
 * <li><i>dm</i> - format only date and month
 * <li><i>my</i> - format only month and year
 * <li><i>dw</i> - format only the weekday and date
 * <li><i>d</i> - format only the date
 * <li><i>m</i> - format only the month, in numbers for shorter lengths, and letters for 
 * longer lengths
 * <li><i>n</i> - format only the month, in letters only for all lengths
 * <li><i>y</i> - format only the year
 * </ul>
 * Default components, if this property is not specified, is "dmy". This property may be specified
 * but has no affect if the current formatter is for times only.
 * 
 * <li><i>time</i> - This property gives which components of a time format to use. The time will be formatted 
 * correctly for the locale with only the time components requested. For example, a clock might only display 
 * the hour and minute and not need the seconds or the am/pm component. In this case, the time property should be set 
 * to "hm". <p>
 * 
 * Valid values for this property are:
 * 
 * <ul>
 * <li><i>ahmsz</i> - format the hours, minutes, seconds, am/pm (if using a 12 hour clock), and the time zone
 * <li><i>ahms</i> - format the hours, minutes, seconds, and am/pm (if using a 12 hour clock)
 * <li><i>hmsz</i> - format the hours, minutes, seconds, and the time zone
 * <li><i>hms</i> - format the hours, minutes, and seconds
 * <li><i>ahmz</i> - format the hours, minutes, am/pm (if using a 12 hour clock), and the time zone
 * <li><i>ahm</i> - format the hours, minutes, and am/pm (if using a 12 hour clock)
 * <li><i>hmz</i> - format the hours, minutes, and the time zone
 * <li><i>ah</i> - format only the hours and am/pm if using a 12 hour clock
 * <li><i>hm</i> - format only the hours and minutes
 * <li><i>ms</i> - format only the minutes and seconds
 * <li><i>h</i> - format only the hours
 * <li><i>m</i> - format only the minutes
 * <li><i>s</i> - format only the seconds
 * </ul>
 * 
 * If you want to format a length of time instead of a particular instant
 * in time, use the duration formatter object (ilib.DurFmt) instead because this
 * formatter is geared towards instants. A date formatter will make sure that each component of the 
 * time is within the normal range
 * for that component. That is, the minutes will always be between 0 and 59, no matter
 * what is specified in the date to format. A duration format will allow the number
 * of minutes to exceed 59 if, for example, you were displaying the length of
 * a movie of 198 minutes.<p>
 * 
 * Default value if this property is not specified is "hma".
 * 
 * <li><i>clock</i> - specify that the time formatter should use a 12 or 24 hour clock. 
 * Valid values are "12" and "24".<p>
 * 
 * In some locales, both clocks are used. For example, in en_US, the general populace uses
 * a 12 hour clock with am/pm, but in the US military or in nautical or aeronautical or 
 * scientific writing, it is more common to use a 24 hour clock. This property allows you to
 * construct a formatter that overrides the default for the locale.<p>
 * 
 * If this property is not specified, the default is to use the most widely used convention
 * for the locale.
 *  
 * <li><i>template</i> - use the given template string as a fixed format when formatting 
 * the date/time. Valid codes to use in a template string are as follows:
 * 
 * <ul>
 * <li><i>a</i> - am/pm marker
 * <li><i>d</i> - 1 or 2 digit date of month, not padded
 * <li><i>dd</i> - 1 or 2 digit date of month, 0 padded to 2 digits
 * <li><i>O</i> - ordinal representation of the date of month (eg. "1st", "2nd", etc.)
 * <li><i>D</i> - 1 to 3 digit day of year
 * <li><i>DD</i> - 1 to 3 digit day of year, 0 padded to 2 digits
 * <li><i>DDD</i> - 1 to 3 digit day of year, 0 padded to 3 digits
 * <li><i>M</i> - 1 or 2 digit month number, not padded
 * <li><i>MM</i> - 1 or 2 digit month number, 0 padded to 2 digits
 * <li><i>N</i> - 1 character month name abbreviation
 * <li><i>NN</i> - 2 character month name abbreviation
 * <li><i>MMM</i> - 3 character month month name abbreviation
 * <li><i>MMMM</i> - fully spelled out month name
 * <li><i>yy</i> - 2 digit year
 * <li><i>yyyy</i> - 4 digit year
 * <li><i>E</i> - day-of-week name, abbreviated to a single character
 * <li><i>EE</i> - day-of-week name, abbreviated to a max of 2 characters
 * <li><i>EEE</i> - day-of-week name, abbreviated to a max of 3 characters
 * <li><i>EEEE</i> - day-of-week name fully spelled out 
 * <li><i>G</i> - era designator
 * <li><i>w</i> - week number in year
 * <li><i>ww</i> - week number in year, 0 padded to 2 digits
 * <li><i>W</i> - week in month
 * <li><i>h</i> - hour (12 followed by 1 to 11)
 * <li><i>hh</i> - hour (12, followed by 1 to 11), 0 padded to 2 digits
 * <li><i>k</i> - hour (1 to 24)
 * <li><i>kk</i> - hour (1 to 24), 0 padded to 2 digits
 * <li><i>H</i> - hour (0 to 23)
 * <li><i>HH</i> - hour (0 to 23), 0 padded to 2 digits
 * <li><i>K</i> - hour (0 to 11)
 * <li><i>KK</i> - hour (0 to 11), 0 padded to 2 digits
 * <li><i>m</i> - minute in hour
 * <li><i>mm</i> - minute in hour, 0 padded to 2 digits
 * <li><i>s</i> - second in minute
 * <li><i>ss</i> - second in minute, 0 padded to 2 digits
 * <li><i>S</i> - millisecond (1 to 3 digits)
 * <li><i>SSS</i> - millisecond, 0 padded to 3 digits
 * <li><i>z</i> - general time zone
 * <li><i>Z</i> - RFC 822 time zone
 * </ul>
 * 
 * <li><i>useNative</i> - the flag used to determine whether to use the native script settings 
 * for formatting the numbers.
 *
 * <li><i>meridiems</i> - string that specifies what style of meridiems to use with this 
 * format. The choices are "default", "gregorian", "ethiopic", and "chinese". The "default" 
 * style is often the simple Gregorian AM/PM, but the actual style is chosen by the locale. 
 * (For almost all locales, the Gregorian AM/PM style is most frequently used.)
 * The "ethiopic" style uses 5 different meridiems for "morning", "noon", "afternoon", 
 * "evening", and "night". The "chinese" style uses 7 different meridiems corresponding 
 * to the various parts of the day. N.B. Even for the Chinese locales, the default is "gregorian"
 * when formatting dates in the Gregorian calendar.
 *
 * <li><i>onLoad</i> - a callback function to call when the date format object is fully 
 * loaded. When the onLoad option is given, the DateFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * Any substring containing letters within single or double quotes will be used 
 * as-is in the final output and will not be interpretted for codes as above.<p>
 * 
 * Example: a date format in Spanish might be given as: "'El' d. 'de' MMMM", where
 * the 'El' and the 'de' are left as-is in the output because they are quoted. Typical 
 * output for this example template might be, "El 5. de Mayo".
 * 
 * The following options will be used when formatting a date/time with an explicit
 * template:
 * 
 * <ul>
 * <li>locale - the locale is only used for 
 * translations of things like month names or day-of-week names.
 * <li>calendar - used to translate a date instance into date/time component values 
 * that can be formatted into the template
 * <li>timezone - used to figure out the offset to add or subtract from the time to
 * get the final time component values
 * <li>clock - used to figure out whether to format times with a 12 or 24 hour clock.
 * If this option is specified, it will override the hours portion of a time format.
 * That is, "hh" is switched with "HH" and "kk" is switched with "KK" as appropriate. 
 * If this option is not specified, the 12/24 code in the template will dictate whether 
 * to use the 12 or 24 clock, and the 12/24 default in the locale will be ignored.
 * </ul>
 * 
 * All other options will be ignored and their corresponding getter methods will
 * return the empty string.<p>
 * 
 * Depends directive: !depends datefmt.js
 * 
 * @constructor
 * @param {Object} options options governing the way this date formatter instance works
 */
ilib.DateFmt = function(options) {
	var arr, i, bad, 
		sync = true, 
		loadParams = undefined;
	
	this.locale = new ilib.Locale();
	this.type = "date";
	this.length = "s";
	this.dateComponents = "dmy";
	this.timeComponents = "ahm";
	this.meridiems = "default";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.type) {
			if (options.type === 'date' || options.type === 'time' || options.type === 'datetime') {
				this.type = options.type;
			}
		}
		
		if (options.calendar) {
			this.calName = options.calendar;
		}
		
		if (options.length) {
			if (options.length === 'short' ||
				options.length === 'medium' ||
				options.length === 'long' ||
				options.length === 'full') {
				// only use the first char to save space in the json files
				this.length = options.length.charAt(0);
			}
		}
		
		if (options.date) {
			arr = options.date.split("");
			arr.sort(function (left, right) {
				return (left < right) ? -1 : ((right < left) ? 1 : 0);
			});
			bad = false;
			for (i = 0; i < arr.length; i++) {
				if (arr[i] !== 'd' && arr[i] !== 'm' && arr[i] !== 'y' && arr[i] !== 'w' && arr[i] !== 'n') {
					bad = true;
					break;
				}
			}
			if (!bad) {
				this.dateComponents = arr.join("");
			}
		}

		if (options.time) {
			arr = options.time.split("");
			arr.sort(function (left, right) {
				return (left < right) ? -1 : ((right < left) ? 1 : 0);
			});
			this.badTime = false;
			for (i = 0; i < arr.length; i++) {
				if (arr[i] !== 'h' && arr[i] !== 'm' && arr[i] !== 's' && arr[i] !== 'a' && arr[i] !== 'z') {
					this.badTime = true;
					break;
				}
			}
			if (!this.badTime) {
				this.timeComponents = arr.join("");
			}
		}
		
		if (options.clock && (options.clock === '12' || options.clock === '24')) {
			this.clock = options.clock;
		}
		
		if (options.template) {
			// many options are not useful when specifying the template directly, so zero
			// them out.
			this.type = "";
			this.length = "";
			this.dateComponents = "";
			this.timeComponents = "";
			
			this.template = options.template;
		}
		
		if (options.timezone) {
			if (options.timezone instanceof ilib.TimeZone) {
				this.tz = options.timezone;
			} else {
				this.tz = new ilib.TimeZone({
					locale: this.locale, 
					id: options.timezone
				});
			}
		} else if (options.locale) {
			// if an explicit locale was given, then get the time zone for that locale
			this.tz = new ilib.TimeZone({
				locale: this.locale
			});
		} // else just assume time zone "local"
		
		if (typeof(options.useNative) === 'boolean') {
			this.useNative = options.useNative;
		}
		
		if (typeof(options.meridiems) !== 'undefined' && 
				(options.meridiems === "chinese" || 
				 options.meridiems === "gregorian" || 
				 options.meridiems === "ethiopic")) {
			this.meridiems = options.meridiems;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync === true);
		}
		
		loadParams = options.loadParams;
	}

	if (!ilib.DateFmt.cache) {
		ilib.DateFmt.cache = {};
	}

	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		loadParams: loadParams, 
		onLoad: ilib.bind(this, function (li) {
			this.locinfo = li;
			
			// get the default calendar name from the locale, and if the locale doesn't define
			// one, use the hard-coded gregorian as the last resort
			this.calName = this.calName || this.locinfo.getCalendar() || "gregorian";
			this.cal = ilib.Cal.newInstance({
				type: this.calName
			});
			if (!this.cal) {
				this.cal = new ilib.Cal.Gregorian();
			}
			
			if (this.meridiems === "default") {
				this.meridiems = li.getMeridiemsStyle();
			}

			/*
			if (this.timeComponents &&
					(this.clock === '24' || 
					(!this.clock && this.locinfo.getClock() === "24"))) {
				// make sure we don't have am/pm in 24 hour mode unless the user specifically
				// requested it in the time component option
				this.timeComponents = this.timeComponents.replace("a", "");
			}
			*/

			// load the strings used to translate the components
			new ilib.ResBundle({
				locale: this.locale,
				name: "sysres",
				sync: sync,
				loadParams: loadParams, 
				onLoad: ilib.bind(this, function (rb) {
					this.sysres = rb;
					
					if (!this.template) {
						ilib.loadData({
							object: ilib.DateFmt, 
							locale: this.locale, 
							name: "dateformats.json", 
							sync: sync, 
							loadParams: loadParams, 
							callback: ilib.bind(this, function (formats) {
								if (!formats) {
									formats = ilib.data.dateformats || ilib.DateFmt.defaultFmt;
									var spec = this.locale.getSpec().replace(/-/g, '_');
									ilib.DateFmt.cache[spec] = formats;
								}
								if (typeof(this.clock) === 'undefined') {
									// default to the locale instead
									this.clock = this.locinfo.getClock();
								}
								this._initTemplate(formats);
								this._massageTemplate();
								if (options && typeof(options.onLoad) === 'function') {
									options.onLoad(this);
								}
							})
						});
					} else {
						this._massageTemplate();
						if (options && typeof(options.onLoad) === 'function') {
							options.onLoad(this);
						}
					}
				})
			});	
		})
	});
};

// used in getLength
ilib.DateFmt.lenmap = {
	"s": "short",
	"m": "medium",
	"l": "long",
	"f": "full"
};

ilib.DateFmt.zeros = "0000";

ilib.DateFmt.defaultFmt = {
	"gregorian": {
		"order": "{date} {time}",
		"date": {
			"dmwy": "EEE d/MM/yyyy",
			"dmy": "d/MM/yyyy",
			"dmw": "EEE d/MM",
			"dm": "d/MM",
			"my": "MM/yyyy",
			"dw": "EEE d",
			"d": "dd",
			"m": "MM",
			"y": "yyyy",
			"n": "NN",
			"w": "EEE"
		},
		"time": {
			"12": "h:mm:ssa",
			"24": "H:mm:ss"
		},
		"range": {
			"c00": "{st} - {et}, {sd}/{sm}/{sy}",
			"c01": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
			"c02": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
			"c03": "{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",
			"c10": "{sd}-{ed}/{sm}/{sy}",
			"c11": "{sd}/{sm} - {ed}/{em} {sy}",
			"c12": "{sd}/{sm}/{sy} - {ed}/{em}/{ey}",
			"c20": "{sm}/{sy} - {em}/{ey}",
			"c30": "{sy} - {ey}"
		}
	},
	"islamic": "gregorian",
	"hebrew": "gregorian",
	"julian": "gregorian",
	"buddhist": "gregorian",
	"persian": "gregorian",
	"persian-algo": "gregorian",
	"han": "gregorian"
};

/**
* @static
* @private
*/
ilib.DateFmt.monthNameLenMap = {
	"short" : "N",
	"medium": "NN",
	"long":   "MMM",
	"full":   "MMMM"
};

/**
* @static
* @private
*/
ilib.DateFmt.weekDayLenMap = {
	"short" : "E",
	"medium": "EE",
	"long":   "EEE",
	"full":   "EEEE"
};

/**
	 * @protected
	 * @param {Object.<string, (string|{s:string,m:string,l:string,f:string})>} obj Object to search
	 * @param {string} components Format components to search
	 * @param {string} length Length of the requested format
	 * @return {string|undefined} the requested format
	 */

/**
* @static
* @public
* The options may contain any of the following properties:
*
* <ul>
* <li><i>locale</i> - locale to use when formatting the date/time. If the locale is
* not specified, then the default locale of the app or web page will be used.
* 
* <li><i>meridiems</i> - string that specifies what style of meridiems to use with this 
* format. The choices are "default", "gregorian", "ethiopic", and "chinese". The "default" 
* style is often the simple Gregorian AM/PM, but the actual style is chosen by the locale. 
* (For almost all locales, the Gregorian AM/PM style is most frequently used.)
* The "ethiopic" style uses 5 different meridiems for "morning", "noon", "afternoon", 
* "evening", and "night". The "chinese" style uses 7 different meridiems corresponding 
* to the various parts of the day. N.B. Even for the Chinese locales, the default is "gregorian"
* when formatting dates in the Gregorian calendar.
* </ul>
*
* @param {Object} options options governing the way this date formatter instance works for getting meridiems range
* @return {Array.<{name:string,start:string,end:string}>}
*/
ilib.DateFmt.getMeridiemsRange = function (options) {
	options = options || {};
	var args = {};
	if (options.locale) {
		args.locale = options.locale;
	}

	if (options.meridiems) {
		args.meridiems = options.meridiems;
	}

	var fmt = new ilib.DateFmt(args);

	return fmt.getMeridiemsRange();
};

ilib.DateFmt.prototype = {
	/**
	 * @protected
	 */
	_initTemplate: function (formats) {
		if (formats[this.calName]) {
			/** 
			 * @private
			 * @type {{order:(string|{s:string,m:string,l:string,f:string}),date:Object.<string, (string|{s:string,m:string,l:string,f:string})>,time:Object.<string,(string|{s:string,m:string,l:string,f:string})>,range:Object.<string, (string|{s:string,m:string,l:string,f:string})>}}
			 */
			this.formats = formats[this.calName];
			if (typeof(this.formats) === "string") {
				// alias to another calendar type
				this.formats = formats[this.formats];
			}
			
			this.template = "";
			
			switch (this.type) {
				case "datetime":
					this.template = (this.formats && this._getLengthFormat(this.formats.order, this.length)) || "{date} {time}";
					this.template = this.template.replace("{date}", this._getFormat(this.formats.date, this.dateComponents, this.length) || "");
					this.template = this.template.replace("{time}", this._getFormat(this.formats.time[this.clock], this.timeComponents, this.length) || "");
					break;
				case "date":
					this.template = this._getFormat(this.formats.date, this.dateComponents, this.length);
					break;
				case "time":
					this.template = this._getFormat(this.formats.time[this.clock], this.timeComponents, this.length);
					break;
			}
		} else {
			throw "No formats available for calendar " + this.calName + " in locale " + this.locale.toString();
		}
	},
	
	/**
	 * @protected
	 */
	_massageTemplate: function () {
		var i;
		
		if (this.clock && this.template) {
			// explicitly set the hours to the requested type
			var temp = "";
			switch (this.clock) {
				case "24":
					for (i = 0; i < this.template.length; i++) {
						if (this.template.charAt(i) == "'") {
							temp += this.template.charAt(i++);
							while (i < this.template.length && this.template.charAt(i) !== "'") {
								temp += this.template.charAt(i++);
							}
							if (i < this.template.length) {
								temp += this.template.charAt(i);
							}
						} else if (this.template.charAt(i) == 'K') {
							temp += 'k';
						} else if (this.template.charAt(i) == 'h') {
							temp += 'H';
						} else {
							temp += this.template.charAt(i);
						}
					}
					this.template = temp;
					break;
				case "12":
					for (i = 0; i < this.template.length; i++) {
						if (this.template.charAt(i) == "'") {
							temp += this.template.charAt(i++);
							while (i < this.template.length && this.template.charAt(i) !== "'") {
								temp += this.template.charAt(i++);
							}
							if (i < this.template.length) {
								temp += this.template.charAt(i);
							}
						} else if (this.template.charAt(i) == 'k') {
							temp += 'K';
						} else if (this.template.charAt(i) == 'H') {
							temp += 'h';
						} else {
							temp += this.template.charAt(i);
						}
					}
					this.template = temp;
					break;
			}
		}
		
		// tokenize it now for easy formatting
		this.templateArr = this._tokenize(this.template);

		var digits;
		// set up the mapping to native or alternate digits if necessary
		if (typeof(this.useNative) === "boolean") {
			if (this.useNative) {
				digits = this.locinfo.getNativeDigits();
				if (digits) {
					this.digits = digits;
				}
			}
		} else if (this.locinfo.getDigitsStyle() === "native") {
			digits = this.locinfo.getNativeDigits();
			if (digits) {
				this.useNative = true;
				this.digits = digits;
			}
		}
	},
    
	/**
	 * Convert the template into an array of date components separated by formatting chars.
	 * @protected
	 * @param {string} template Format template to tokenize into components
	 * @return {Array.<string>} a tokenized array of date format components
	 */
	_tokenize: function (template) {
		var i = 0, start, ch, letter, arr = [];
		
		// console.log("_tokenize: tokenizing template " + template);
		if (template) {
			while (i < template.length) {
				ch = template.charAt(i);
				start = i;
				if (ch === "'") {
					// console.log("found quoted string");
					i++;
					// escaped string - push as-is, then dequote later
					while (i < template.length && template.charAt(i) !== "'") {
						i++;
					}
					if (i < template.length) {
						i++;	// grab the other quote too
					}
				} else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
					letter = template.charAt(i);
					// console.log("found letters " + letter);
					while (i < template.length && ch === letter) {
						ch = template.charAt(++i);
					}
				} else {
					// console.log("found other");
					while (i < template.length && ch !== "'" && (ch < 'a' || ch > 'z') && (ch < 'A' || ch > 'Z')) {
						ch = template.charAt(++i);
					}
				}
				arr.push(template.substring(start,i));
				// console.log("start is " + start + " i is " + i + " and substr is " + template.substring(start,i));
			}
		}
		return arr;
	},
                          
	/**
	 * @protected
	 * @param {Object.<string, (string|{s:string,m:string,l:string,f:string})>} obj Object to search
	 * @param {string} components Format components to search
	 * @param {string} length Length of the requested format
	 * @return {string|undefined} the requested format
	 */
	_getFormat: function getFormat(obj, components, length) {
		if (typeof(components) !== 'undefined' && obj && obj[components]) {
			return this._getLengthFormat(obj[components], length);
		}
		return undefined;
	},

	/**
	 * @protected
	 * @param {(string|{s:string,m:string,l:string,f:string})} obj Object to search
	 * @param {string} length Length of the requested format
	 * @return {(string|undefined)} the requested format
	 */
	_getLengthFormat: function getLengthFormat(obj, length) {
		if (typeof(obj) === 'string') {
			return obj;
		} else if (obj[length]) {
			return obj[length];
		}
		return undefined;
	},

	/**
	 * Return the locale used with this formatter instance.
	 * @return {ilib.Locale} the ilib.Locale instance for this formatter
	 */
	getLocale: function() {
		return this.locale;
	},
	
	/**
	 * Return the template string that is used to format date/times for this
	 * formatter instance. This will work, even when the template property is not explicitly 
	 * given in the options to the constructor. Without the template option, the constructor 
	 * will build the appropriate template according to the options and use that template
	 * in the format method. 
	 * 
	 * @return {string} the format template for this formatter
	 */
	getTemplate: function() {
		return this.template;
	},
	
	/**
	 * Return the type of this formatter. The type is a string that has one of the following
	 * values: "time", "date", "datetime".
	 * @return {string} the type of the formatter
	 */
	getType: function() {
		return this.type;
	},
	
	/**
	 * Return the name of the calendar used to format date/times for this
	 * formatter instance.
	 * @return {string} the name of the calendar used by this formatter
	 */
	getCalendar: function () {
		return this.cal.getType();
	},
	
	/**
	 * Return the length used to format date/times in this formatter. This is either the
	 * value of the length option to the constructor, or the default value.
	 * 
	 * @return {string} the length of formats this formatter returns
	 */
	getLength: function () {
		return ilib.DateFmt.lenmap[this.length] || "";
	},
	
	/**
	 * Return the date components that this formatter formats. This is either the 
	 * value of the date option to the constructor, or the default value. If this
	 * formatter is a time-only formatter, this method will return the empty 
	 * string. The date component letters may be specified in any order in the 
	 * constructor, but this method will reorder the given components to a standard 
	 * order.
	 * 
	 * @return {string} the date components that this formatter formats
	 */
	getDateComponents: function () {
		return this.dateComponents || "";
	},

	/**
	 * Return the time components that this formatter formats. This is either the 
	 * value of the time option to the constructor, or the default value. If this
	 * formatter is a date-only formatter, this method will return the empty 
	 * string. The time component letters may be specified in any order in the 
	 * constructor, but this method will reorder the given components to a standard 
	 * order.
	 * 
	 * @return {string} the time components that this formatter formats
	 */
	getTimeComponents: function () {
		return this.timeComponents || "";
	},

	/**
	 * Return the time zone used to format date/times for this formatter
	 * instance.
	 * @return a string naming the time zone
	 */
	getTimeZone: function () {
		// Lazy load the time zone. If it wasn't explicitly set up before, set 
		// it up now, but use the 
		// default TZ for the locale. This way, if the caller never uses the
		// time zone in their format, we never have to load up a TimeZone
		// instance into this formatter.
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: ilib.getTimeZone()});
		}
		return this.tz;
	},
	/**
	 * Return the clock option set in the constructor. If the clock option was
	 * not given, the default from the locale is returned instead.
	 * @return {string} "12" or "24" depending on whether this formatter uses
	 * the 12-hour or 24-hour clock
	 */
	getClock: function () {
		return this.clock || this.locinfo.getClock();
	},
	/**
	 * Return the meridiems range in current locale. 
	 * @return {Array.<{name:string,start:string,end:string}>}
	 */
	getMeridiemsRange: function () {
		var result;
		var _getSysString = function (key) {
			return (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key)).toString();
		};

		switch (this.meridiems) {
		case "chinese":
			result = [
				{
					name: _getSysString.call(this, "azh0"),
					start: "00:00",
					end: "05:59"
				},
				{
					name: _getSysString.call(this, "azh1"),
					start: "06:00",
					end: "08:59"
				},
				{
					name: _getSysString.call(this, "azh2"),
					start: "09:00",
					end: "11:59"
				},
				{
					name: _getSysString.call(this, "azh3"),
					start: "12:00",
					end: "12:59"
				},
				{
					name: _getSysString.call(this, "azh4"),
					start: "13:00",
					end: "17:59"
				},
				{
					name: _getSysString.call(this, "azh5"),
					start: "18:00",
					end: "20:59"
				},
				{
					name: _getSysString.call(this, "azh6"),
					start: "21:00",
					end: "23:59"
				}
			];
			break;
		case "ethiopic":
			result = [
				{
					name: _getSysString.call(this, "a0-ethiopic"),
					start: "00:00",
					end: "05:59"
				},
				{
					name: _getSysString.call(this, "a1-ethiopic"),
					start: "06:00",
					end: "06:00"
				},
				{
					name: _getSysString.call(this, "a2-ethiopic"),
					start: "06:01",
					end: "11:59"
				},
				{
					name: _getSysString.call(this, "a3-ethiopic"),
					start: "12:00",
					end: "17:59"
				},
				{
					name: _getSysString.call(this, "a4-ethiopic"),
					start: "18:00",
					end: "23:59"
				}
			];
			break;
		default:
			result = [
				{
					name: _getSysString.call(this, "a0"),
					start: "00:00",
					end: "11:59"
				},
				{
					name: _getSysString.call(this, "a1"),
					start: "12:00",
					end: "23:59"
				}
			];
			break;
		}

		return result;
	},
	
	/**
	 * @private
	 */
	_getTemplate: function (prefix, calendar) {
		if (calendar !== "gregorian") {
			return prefix + "-" + calendar;
		}
		return prefix;
	},

	/**
	 * Returns an array of the months of the year, formatted to the optional length specified.
	 * i.e. ...getMonthsOfYear() OR ...getMonthsOfYear({length: "short"})
	 * <p>
	 * The options parameter may contain any of the following properties:
	 * 
	 * <ul>
	 * <li><i>length</i> - length of the names of the months being sought. This may be one of
	 * "short", "medium", "long", or "full"
	 * <li><i>date</i> - retrieve the names of the months in the date of the given date
	 * <li><i>year</i> - retrieve the names of the months in the given year. In some calendars,
	 * the months have different names depending if that year is a leap year or not.
	 * </ul>
	 * 
	 * @param  {Object=} options an object-literal that contains any of the above properties
	 * @return {Array} an array of the names of all of the months of the year in the current calendar
	 */
	getMonthsOfYear: function(options) {
		var length = (options && options.length) || this.getLength(),
			template = ilib.DateFmt.monthNameLenMap[length],
			months = [undefined],
			date,
			monthCount;
		
		if (options) {
			if (options.date) {
				date = ilib.Date._dateToIlib(options.date); 	
			}
			
			if (options.year) {
				date = ilib.Date.newInstance({year: options.year, month: 1, day: 1, type: this.cal.getType()});
			}
		}
		
		if (!date) {
			date = this.cal.newDateInstance();
		}

		monthCount = this.cal.getNumMonths(date.getYears());
		for (var i = 1; i <= monthCount; i++) {
			months[i] = this.sysres.getString(this._getTemplate(template + i, this.cal.getType())).toString();
		}
		return months;
	},

	/**
	 * Returns an array of the days of the week, formatted to the optional length specified.
	 * i.e. ...getDaysOfWeek() OR ...getDaysOfWeek({length: "short"})
	 * <p>
	 * The options parameter may contain any of the following properties:
	 * 
	 * <ul>
	 * <li><i>length</i> - length of the names of the months being sought. This may be one of
	 * "short", "medium", "long", or "full"
	 * </ul>
	 * @param  {Object=} options an object-literal that contains one key 
	 *                   "length" with the standard length strings
	 * @return {Array} an array of all of the names of the days of the week
	 */
	getDaysOfWeek: function(options) {
		var length = (options && options.length) || this.getLength(),
			template = ilib.DateFmt.weekDayLenMap[length],
			days = [];
		for (var i = 0; i < 7; i++) {
			days[i] = this.sysres.getString(this._getTemplate(template + i, this.cal.getType())).toString();
		}
		return days;
	},

	
	/**
	 * Convert this formatter to a string representation by returning the
	 * format template. This method delegates to getTemplate.
	 * 
	 * @return {string} the format template
	 */
	toString: function() {
		return this.getTemplate();
	},
	
	/*
	 * @private
	 * Left pad the str to the given length of digits with zeros
	 * @param {string} str the string to pad
	 * @param {number} length the desired total length of the output string, padded 
	 */
	_pad: function (str, length) {
		if (typeof(str) !== 'string') {
			str = "" + str;
		}
		var start = 0;
		if (str.charAt(0) === '-') {
			start++;
		}
		return (str.length >= length+start) ? str : str.substring(0, start) + ilib.DateFmt.zeros.substring(0,length-str.length+start) + str.substring(start);
	},
	
	/*
	 * @private
	 * Format a date according to a sequence of components. 
	 * @param {ilib.Date} date a date/time object to format
	 * @param {Array.<string>} templateArr an array of components to format
	 * @return {string} the formatted date
	 */
	_formatTemplate: function (date, templateArr) {
		var i, key, temp, tz, str = "";
		for (i = 0; i < templateArr.length; i++) {
			switch (templateArr[i]) {
				case 'd':
					str += (date.day || 1);
					break;
				case 'dd':
					str += this._pad(date.day || "1", 2);
					break;
				case 'yy':
					temp = "" + ((date.year || 0) % 100);
					str += this._pad(temp, 2);
					break;
				case 'yyyy':
					str += this._pad(date.year || "0", 4);
					break;
				case 'M':
					str += (date.month || 1);
					break;
				case 'MM':
					str += this._pad(date.month || "1", 2);
					break;
				case 'h':
					temp = (date.hour || 0) % 12;
					if (temp == 0) {
						temp = "12";
					}
					str += temp; 
					break;
				case 'hh':
					temp = (date.hour || 0) % 12;
					if (temp == 0) {
						temp = "12";
					}
					str += this._pad(temp, 2);
					break;
				/*
				case 'j':
					temp = (date.hour || 0) % 12 + 1;
					str += temp; 
					break;
				case 'jj':
					temp = (date.hour || 0) % 12 + 1;
					str += this._pad(temp, 2);
					break;
				*/
				case 'K':
					temp = (date.hour || 0) % 12;
					str += temp; 
					break;
				case 'KK':
					temp = (date.hour || 0) % 12;
					str += this._pad(temp, 2);
					break;

				case 'H':
					str += (date.hour || "0");
					break;
				case 'HH':
					str += this._pad(date.hour || "0", 2);
					break;
				case 'k':
					str += (date.hour == 0 ? "24" : date.hour);
					break;
				case 'kk':
					temp = (date.hour == 0 ? "24" : date.hour);
					str += this._pad(temp, 2);
					break;

				case 'm':
					str += (date.minute || "0");
					break;
				case 'mm':
					str += this._pad(date.minute || "0", 2);
					break;
				case 's':
					str += (date.minute || "0");
					break;
				case 'ss':
					str += this._pad(date.second || "0", 2);
					break;
				case 'S':
					str += (date.millisecond || "0");
					break;
				case 'SSS':
					str += this._pad(date.millisecond || "0", 3);
					break;

				case 'N':
				case 'NN':
				case 'MMM':
				case 'MMMM':
					key = templateArr[i] + (date.month || 1);
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;

				case 'E':
				case 'EE':
				case 'EEE':
				case 'EEEE':
					key = templateArr[i] + date.getDayOfWeek();
					//console.log("finding " + key + " in the resources");
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;
					
				case 'a':
					switch (this.meridiems) {
					case "chinese":
						if (date.hour < 6) {
							key = "azh0";	// before dawn
						} else if (date.hour < 9) {
							key = "azh1";	// morning
						} else if (date.hour < 12) {
							key = "azh2";	// late morning/day before noon
						} else if (date.hour < 13) {
							key = "azh3";	// noon hour/midday
						} else if (date.hour < 18) {
							key = "azh4";	// afternoon
						} else if (date.hour < 21) {
							key = "azh5";	// evening time/dusk
						} else {
							key = "azh6";	// night time
						}
						break;
					case "ethiopic":
						if (date.hour < 6) {
							key = "a0-ethiopic";	// morning
						} else if (date.hour === 6 && date.minute === 0) {
							key = "a1-ethiopic";	// noon
						} else if (date.hour >= 6 && date.hour < 12) {
							key = "a2-ethiopic";	// afternoon
						} else if (date.hour >= 12 && date.hour < 18) {
							key = "a3-ethiopic";	// evening
						} else if (date.hour >= 18) {
							key = "a4-ethiopic";	// night
						}
						break;
					default:
						key = date.hour < 12 ? "a0" : "a1";
						break;
					}
					//console.log("finding " + key + " in the resources");
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;
					
				case 'w':
					str += date.getWeekOfYear();
					break;
				case 'ww':
					str += this._pad(date.getWeekOfYear(), 2);
					break;

				case 'D':
					str += date.getDayOfYear();
					break;
				case 'DD':
					str += this._pad(date.getDayOfYear(), 2);
					break;
				case 'DDD':
					str += this._pad(date.getDayOfYear(), 3);
					break;
				case 'W':
					str += date.getWeekOfMonth(this.locale);
					break;

				case 'G':
					key = "G" + date.getEra();
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;

				case 'O':
					temp = this.sysres.getString("1#1st|2#2nd|3#3rd|21#21st|22#22nd|23#23rd|31#31st|#{num}th", "ordinalChoice");
					str += temp.formatChoice(date.day, {num: date.day});
					break;
					
				case 'z': // general time zone
					tz = this.getTimeZone(); // lazy-load the tz
					str += tz.getDisplayName(date, "standard");
					break;
				case 'Z': // RFC 822 time zone
					tz = this.getTimeZone(); // lazy-load the tz
					str += tz.getDisplayName(date, "rfc822");
					break;

				default:
					str += templateArr[i].replace(/'/g, "");
					break;
			}
		}

		if (this.digits) {
			str = ilib.mapString(str, this.digits);
		}
		return str;
	},
	
	/**
	 * Format a particular date instance according to the settings of this
	 * formatter object. The type of the date instance being formatted must 
	 * correspond exactly to the calendar type with which this formatter was 
	 * constructed. If the types are not compatible, this formatter will
	 * produce bogus results.
	 * 
	 * @param {Date|Number|String|ilib.Date|ilib.JulianDay|null|undefined} dateLike a date-like object to format
	 * @return {string} the formatted version of the given date instance
	 */
	format: function (dateLike) {
		var thisZoneName = this.tz && this.tz.getId() || "local";

		var date = ilib.Date._dateToIlib(dateLike, thisZoneName);
		
		if (!date.getCalendar || !(date instanceof ilib.Date)) {
			throw "Wrong date type passed to ilib.DateFmt.format()";
		}
		
		var dateZoneName = date.timezone || "local";
		
		// convert to the time zone of this formatter before formatting
		if (dateZoneName !== thisZoneName || date.getCalendar() !== this.calName) {
			// console.log("Differing time zones date: " + dateZoneName + " and fmt: " + thisZoneName + ". Converting...");
			// this will recalculate the date components based on the new time zone
			// and/or convert a date in another calendar to the current calendar before formatting it
			var newDate = ilib.Date.newInstance({
				type: this.calName,
				timezone: thisZoneName,
				julianday: date.getJulianDay()
			});
			
			date = newDate;
		}
		return this._formatTemplate(date, this.templateArr);
	},
	
	/**
	 * Return a string that describes a date relative to the given 
	 * reference date. The string returned is text that for the locale that
	 * was specified when the formatter instance was constructed.<p>
	 * 
	 * The date can be in the future relative to the reference date or in
	 * the past, and the formatter will generate the appropriate string.<p>
	 * 
	 * The text used to describe the relative reference depends on the length
	 * of time between the date and the reference. If the time was in the
	 * past, it will use the "ago" phrase, and in the future, it will use
	 * the "in" phrase. Examples:<p>
	 * 
	 * <ul>
	 * <li>within a minute: either "X seconds ago" or "in X seconds"
	 * <li>within an hour: either "X minutes ago" or "in X minutes"
	 * <li>within a day: either "X hours ago" or "in X hours"
	 * <li>within 2 weeks: either "X days ago" or "in X days"
	 * <li>within 12 weeks (~3 months): either "X weeks ago" or "in X weeks"
	 * <li>within two years: either "X months ago" or "in X months"
	 * <li>longer than 2 years: "X years ago" or "in X years"
	 * </ul>
	 * 
	 * @param {Date|Number|String|ilib.Date|ilib.JulianDay|null|undefined} reference a date that the date parameter should be relative to
	 * @param {Date|Number|String|ilib.Date|ilib.JulianDay|null|undefined} date a date being formatted
	 * @throws "Wrong calendar type" when the start or end dates are not the same
	 * calendar type as the formatter itself
	 * @return {string} the formatted relative date
	 */
	formatRelative: function(reference, date) {
		reference = ilib.Date._dateToIlib(reference);
		date = ilib.Date._dateToIlib(date);
		
		var referenceRd, dateRd, fmt, time, diff, num;
		
		if (typeof(reference) !== 'object' || !reference.getCalendar || reference.getCalendar() !== this.calName ||
			typeof(date) !== 'object' || !date.getCalendar || date.getCalendar() !== this.calName) {
			throw "Wrong calendar type";
		}
		
		referenceRd = reference.getRataDie();
		dateRd = date.getRataDie();
		
		if (dateRd < referenceRd) {
			diff = referenceRd - dateRd;
			fmt = this.sysres.getString("{duration} ago");
		} else {
			diff = dateRd - referenceRd;
			fmt = this.sysres.getString("in {duration}");
		}
		
		if (diff < 0.000694444) {
			num = Math.round(diff * 86400);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}s");
					break;
				case 'm':
					time = this.sysres.getString("1#1 se|#{num} sec");
					break;
				case 'l':
					time = this.sysres.getString("1#1 sec|#{num} sec");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 second|#{num} seconds");
					break;
			}
		} else if (diff < 0.041666667) {
			num = Math.round(diff * 1440);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}m", "durationShortMinutes");
					break;
				case 'm':
					time = this.sysres.getString("1#1 mi|#{num} min");
					break;
				case 'l':
					time = this.sysres.getString("1#1 min|#{num} min");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 minute|#{num} minutes");
					break;
			}
		} else if (diff < 1) {
			num = Math.round(diff * 24);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}h");
					break;
				case 'm':
					time = this.sysres.getString("1#1 hr|#{num} hrs", "durationMediumHours");
					break;
				case 'l':
					time = this.sysres.getString("1#1 hr|#{num} hrs");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 hour|#{num} hours");
					break;
			}
		} else if (diff < 14) {
			num = Math.round(diff);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}d");
					break;
				case 'm':
					time = this.sysres.getString("1#1 dy|#{num} dys");
					break;
				case 'l':
					time = this.sysres.getString("1#1 day|#{num} days", "durationLongDays");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 day|#{num} days");
					break;
			}
		} else if (diff < 84) {
			num = Math.round(diff/7);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}w");
					break;
				case 'm':
					time = this.sysres.getString("1#1 wk|#{num} wks", "durationMediumWeeks");
					break;
				case 'l':
					time = this.sysres.getString("1#1 wk|#{num} wks");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 week|#{num} weeks");
					break;
			}
		} else if (diff < 730) {
			num = Math.round(diff/30.4);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}m", "durationShortMonths");
					break;
				case 'm':
					time = this.sysres.getString("1#1 mo|#{num} mos");
					break;
				case 'l':
					time = this.sysres.getString("1#1 mon|#{num} mons");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 month|#{num} months");
					break;
			}
		} else {
			num = Math.round(diff/365);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}y");
					break;
				case 'm':
					time = this.sysres.getString("1#1 yr|#{num} yrs", "durationMediumYears");
					break;
				case 'l':
					time = this.sysres.getString("1#1 yr|#{num} yrs");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 year|#{num} years");
					break;
			}
		}
		return fmt.format({duration: time.formatChoice(num, {num: num})});
	}
};

/*
 * datefmt.js - Date formatter definition
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
date.js 
strings.js 
calendar.js
localeinfo.js
timezone.js
datefmt.js
calendar/gregorian.js
util/jsutils.js
*/

// !data dateformats sysres

/**
 * @class
 * Create a new date range formatter instance. The date range formatter is immutable once
 * it is created, but can format as many different date ranges as needed with the same
 * options. Create different date range formatter instances for different purposes
 * and then keep them cached for use later if you have more than one range to
 * format.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the date/times in the range. If the 
 * locale is not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>calendar</i> - the type of calendar to use for this format. The value should
 * be a sting containing the name of the calendar. Currently, the supported
 * types are "gregorian", "julian", "arabic", "hebrew", or "chinese". If the
 * calendar is not specified, then the default calendar for the locale is used. When the
 * calendar type is specified, then the format method must be called with an instance of
 * the appropriate date type. (eg. Gregorian calendar means that the format method must 
 * be called with a GregDate instance.)
 *  
 * <li><i>timezone</i> - time zone to use when formatting times. This may be a time zone
 * instance or a time zone specifier string in RFC 822 format. If not specified, the
 * default time zone for the locale is used.
 * 
 * <li><i>length</i> - Specify the length of the format to use as a string. The length 
 * is the approximate size of the formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the time. This is the most compact format possible for the locale.
 * <li><i>medium</i> - use a medium length representation of the time. This is a slightly longer format.
 * <li><i>long</i> - use a long representation of the time. This is a fully specified format, but some of the textual 
 * components may still be abbreviated. (eg. "Tue" instead of "Tuesday")
 * <li><i>full</i> - use a full representation of the time. This is a fully specified format where all the textual 
 * components are spelled out completely.
 * </ul>
 * 
 * eg. The "short" format for an en_US range may be "MM/yy - MM/yy", whereas the long format might be 
 * "MMM, yyyy - MMM, yyyy". In the long format, the month name is textual instead of numeric 
 * and is longer, the year is 4 digits instead of 2, and the format contains slightly more 
 * spaces and formatting characters.<p>
 * 
 * Note that the length parameter does not specify which components are to be formatted. The
 * components that are formatted depend on the length of time in the range.
 * 
 * <li><i>clock</i> - specify that formatted times should use a 12 or 24 hour clock if the
 * format happens to include times. Valid values are "12" and "24".<p>
 * 
 * In some locales, both clocks are used. For example, in en_US, the general populace uses
 * a 12 hour clock with am/pm, but in the US military or in nautical or aeronautical or 
 * scientific writing, it is more common to use a 24 hour clock. This property allows you to
 * construct a formatter that overrides the default for the locale.<p>
 * 
 * If this property is not specified, the default is to use the most widely used convention
 * for the locale.
 * <li>onLoad - a callback function to call when the date range format object is fully 
 * loaded. When the onLoad option is given, the DateRngFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * <p>
 * 
 * Depends directive: !depends daterangefmt.js
 * 
 * @constructor
 * @param {Object} options options governing the way this date range formatter instance works
 */
ilib.DateRngFmt = function(options) {
	var sync = true;
	var loadParams = undefined;
	this.locale = new ilib.Locale();
	this.length = "s";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.calendar) {
			this.calName = options.calendar;
		}
		
		if (options.length) {
			if (options.length === 'short' ||
				options.length === 'medium' ||
				options.length === 'long' ||
				options.length === 'full') {
				// only use the first char to save space in the json files
				this.length = options.length.charAt(0);
			}
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
	}
	
	var opts = {};
	ilib.shallowCopy(options, opts);
	opts.sync = sync;
	opts.loadParams = loadParams;
	
	/**
	 * @private
	 */
	opts.onLoad = ilib.bind(this, function (fmt) {
		this.dateFmt = fmt;
		if (fmt) {
			this.locinfo = this.dateFmt.locinfo;

			// get the default calendar name from the locale, and if the locale doesn't define
			// one, use the hard-coded gregorian as the last resort
			this.calName = this.calName || this.locinfo.getCalendar() || "gregorian";
			this.cal = ilib.Cal.newInstance({
				type: this.calName
			});
			if (!this.cal) {
				this.cal = new ilib.Cal.Gregorian();
			}
			
			this.timeTemplate = this.dateFmt._getFormat(this.dateFmt.formats.time[this.dateFmt.clock], this.dateFmt.timeComponents, this.length) || "hh:mm";
			this.timeTemplateArr = this.dateFmt._tokenize(this.timeTemplate);
			
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		}
	});

	// delegate a bunch of the formatting to this formatter
	new ilib.DateFmt(opts);
};

ilib.DateRngFmt.prototype = {
	/**
	 * Return the locale used with this formatter instance.
	 * @return {ilib.Locale} the ilib.Locale instance for this formatter
	 */
	getLocale: function() {
		return this.locale;
	},
	
	/**
	 * Return the name of the calendar used to format date/times for this
	 * formatter instance.
	 * @return {string} the name of the calendar used by this formatter
	 */
	getCalendar: function () {
		return this.dateFmt.getCalendar();
	},
	
	/**
	 * Return the length used to format date/times in this formatter. This is either the
	 * value of the length option to the constructor, or the default value.
	 * 
	 * @return {string} the length of formats this formatter returns
	 */
	getLength: function () {
		return ilib.DateFmt.lenmap[this.length] || "";
	},
	
	/**
	 * Return the time zone used to format date/times for this formatter
	 * instance.
	 * @return {ilib.TimeZone} a string naming the time zone
	 */
	getTimeZone: function () {
		return this.dateFmt.getTimeZone();
	},
	
	/**
	 * Return the clock option set in the constructor. If the clock option was
	 * not given, the default from the locale is returned instead.
	 * @return {string} "12" or "24" depending on whether this formatter uses
	 * the 12-hour or 24-hour clock
	 */
	getClock: function () {
		return this.dateFmt.getClock();
	},
	
	/**
	 * Format a date/time range according to the settings of the current
	 * formatter. The range is specified as being from the "start" date until
	 * the "end" date. <p>
	 * 
	 * The template that the date/time range uses depends on the
	 * length of time between the dates, on the premise that a long date range
	 * which is too specific is not useful. For example, when giving
	 * the dates of the 100 Years War, in most situations it would be more 
	 * appropriate to format the range as "1337 - 1453" than to format it as 
	 * "10:37am November 9, 1337 - 4:37pm July 17, 1453", as the latter format 
	 * is much too specific given the length of time that the range represents.
	 * If a very specific, but long, date range really is needed, the caller 
	 * should format two specific dates separately and put them 
	 * together as you might with other normal strings.<p>
	 * 
	 * The format used for a date range contains the following date components,
	 * where the order of those components is rearranged and the component values 
	 * are translated according to each locale:
	 * 
	 * <ul>
	 * <li>within 3 days: the times of day, dates, months, and years
	 * <li>within 730 days (2 years): the dates, months, and years
	 * <li>within 3650 days (10 years): the months and years
	 * <li>longer than 10 years: the years only 
	 * </ul>
	 * 
	 * In general, if any of the date components share a value between the
	 * start and end date, that component is only given once. For example,
	 * if the range is from November 15, 2011 to November 26, 2011, the 
	 * start and end dates both share the same month and year. The 
	 * range would then be formatted as "November 15-26, 2011". <p>
	 * 
	 * If you want to format a length of time instead of a particular range of
	 * time (for example, the length of an event rather than the specific start time
	 * and end time of that event), then use a duration formatter instance 
	 * (ilib.DurFmt) instead. The formatRange method will make sure that each component 
	 * of the date/time is within the normal range for that component. For example, 
	 * the minutes will always be between 0 and 59, no matter what is specified in 
	 * the date to format, because that is the normal range for minutes. A duration 
	 * format will allow the number of minutes to exceed 59. For example, if you 
	 * were displaying the length of a movie that is 198 minutes long, the minutes
	 * component of a duration could be 198.<p>
	 * 
	 * @param {ilib.Date} start the starting date/time of the range. This must be of 
	 * the same calendar type as the formatter itself. 
	 * @param {ilib.Date} end the ending date/time of the range. This must be of the 
	 * same calendar type as the formatter itself.
	 * @throws "Wrong calendar type" when the start or end dates are not the same
	 * calendar type as the formatter itself
	 * @return {string} a date range formatted for the locale
	 */
	format: function (start, end) {
		var startRd, endRd, fmt = "", yearTemplate, monthTemplate, dayTemplate;
		
		if (typeof(start) !== 'object' || !start.getCalendar || start.getCalendar() !== this.calName ||
			typeof(end) !== 'object' || !end.getCalendar || end.getCalendar() !== this.calName) {
			throw "Wrong calendar type";
		}
		
		startRd = start.getRataDie();
		endRd = end.getRataDie();
		
		// 
		// legend:
		// c00 - difference is less than 3 days. Year, month, and date are same, but time is different
		// c01 - difference is less than 3 days. Year and month are same but date and time are different
		// c02 - difference is less than 3 days. Year is same but month, date, and time are different. (ie. it straddles a month boundary)
		// c03 - difference is less than 3 days. Year, month, date, and time are all different. (ie. it straddles a year boundary)
		// c10 - difference is less than 2 years. Year and month are the same, but date is different.
		// c11 - difference is less than 2 years. Year is the same, but month, date, and time are different.
		// c12 - difference is less than 2 years. All fields are different. (ie. straddles a year boundary)
		// c20 - difference is less than 10 years. All fields are different.
		// c30 - difference is more than 10 years. All fields are different.
		//
		
		if (endRd - startRd < 3) {
			if (start.year === end.year) {
				if (start.month === end.month) {
					if (start.day === end.day) {
						fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c00", this.length));
					} else {
						fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c01", this.length));
					}
				} else {
					fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c02", this.length));
				}
			} else {
				fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c03", this.length));
			}
		} else if (endRd - startRd < 730) {
			if (start.year === end.year) {
				if (start.month === end.month) {
					fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c10", this.length));
				} else {
					fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c11", this.length));
				}
			} else {
				fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c12", this.length));
			}
		} else if (endRd - startRd < 3650) {
			fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c20", this.length));
		} else {
			fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c30", this.length));
		}

		yearTemplate = this.dateFmt._tokenize(this.dateFmt._getFormat(this.dateFmt.formats.date, "y", this.length) || "yyyy");
		monthTemplate = this.dateFmt._tokenize(this.dateFmt._getFormat(this.dateFmt.formats.date, "m", this.length) || "MM");
		dayTemplate = this.dateFmt._tokenize(this.dateFmt._getFormat(this.dateFmt.formats.date, "d", this.length) || "dd");
		
		/*
		console.log("fmt is " + fmt.toString());
		console.log("year template is " + yearTemplate);
		console.log("month template is " + monthTemplate);
		console.log("day template is " + dayTemplate);
		*/
		
		return fmt.format({
			sy: this.dateFmt._formatTemplate(start, yearTemplate),
			sm: this.dateFmt._formatTemplate(start, monthTemplate),
			sd: this.dateFmt._formatTemplate(start, dayTemplate),
			st: this.dateFmt._formatTemplate(start, this.timeTemplateArr),
			ey: this.dateFmt._formatTemplate(end, yearTemplate),
			em: this.dateFmt._formatTemplate(end, monthTemplate),
			ed: this.dateFmt._formatTemplate(end, dayTemplate),
			et: this.dateFmt._formatTemplate(end, this.timeTemplateArr)
		});
	}
};

/*
 * util/search.js - Misc search utility routines
 * 
 * Copyright © 2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

/**
 * Binary search a sorted array for a particular target value.
 * If the exact value is not found, it returns the index of the smallest 
 * entry that is greater than the given target value.<p> 
 * 
 * The comparator
 * parameter is a function that knows how to compare elements of the 
 * array and the target. The function should return a value greater than 0
 * if the array element is greater than the target, a value less than 0 if
 * the array element is less than the target, and 0 if the array element 
 * and the target are equivalent.<p>
 * 
 * If the comparator function is not specified, this function assumes
 * the array and the target are numeric values and should be compared 
 * as such.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @static
 * @param {*} target element being sought 
 * @param {Array} arr the array being searched
 * @param {?function(*,*)=} comparator a comparator that is appropriate for comparing two entries
 * in the array  
 * @return the index of the array into which the value would fit if 
 * inserted, or -1 if given array is not an array or the target is not 
 * a number
 */
ilib.bsearch = function(target, arr, comparator) {
	if (typeof(arr) === 'undefined' || !arr || typeof(target) === 'undefined') {
		return -1;
	}
	
	var high = arr.length - 1,
		low = 0,
		mid = 0,
		value,
		cmp = comparator || ilib.bsearch.numbers;
	
	while (low <= high) {
		mid = Math.floor((high+low)/2);
		value = cmp(arr[mid], target);
		if (value > 0) {
			high = mid - 1;
		} else if (value < 0) {
			low = mid + 1;
		} else {
			return mid;
		}
	}
	
	return low;
};

/**
 * Returns whether or not the given element is greater than, less than,
 * or equal to the given target.<p>
 * 
 * @private
 * @static
 * @param {number} element the element being tested
 * @param {number} target the target being sought
 */
ilib.bsearch.numbers = function(element, target) {
	return element - target;
};

/**
 * Do a bisection search of a function for a particular target value.<p> 
 * 
 * The function to search is a function that takes a numeric parameter, 
 * does calculations, and returns gives a numeric result. The 
 * function should should be smooth and not have any discontinuities 
 * between the low and high values of the parameter.
 *  
 * Depends directive: !depends utils.js
 * 
 * @static
 * @param {number} target value being sought
 * @param {number} low the lower bounds to start searching
 * @param {number} high the upper bounds to start searching
 * @param {number} precision minimum precision to support. Use 0 if you want to use the default.
 * @param {?function(number)=} func function to search 
 * @return an approximation of the input value to the function that gives the desired
 * target output value, correct to within the error range of Javascript floating point 
 * arithmetic, or NaN if there was some error
 */
ilib.bisectionSearch = function(target, low, high, precision, func) {
	if (typeof(target) !== 'number' || 
			typeof(low) !== 'number' || 
			typeof(high) !== 'number' || 
			typeof(func) !== 'function') {
		return NaN;
	}
	
	var mid = 0,
		value,
		pre = precision > 0 ? precision : 1e-13;
	
	function compareSignificantDigits(a, b) {
		var leftParts = a.toExponential().split('e');
		var rightParts = b.toExponential().split('e');
		var left = new Number(leftParts[0]);
		var right = new Number(rightParts[0]);
		
		return leftParts[1] === rightParts[1] && Math.abs(left - right) < pre; 
	}
	
	do {
		mid = (high+low)/2;
		value = func(mid);
		if (value > target) {
			high = mid;
		} else if (value < target) {
			low = mid;
		}
	} while (high - low > pre);
	
	return mid;
};


/*
 * gregoriandate.js - Represent a date in the Gregorian calendar
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
date.js 
calendar/gregorian.js 
util/utils.js
util/search.js
util/math.js
localeinfo.js 
julianday.js
calendar/gregratadie.js
timezone.js
*/

/**
 * @class
 * Construct a new Gregorian date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means January, 2 means February, etc.
 * 
 * <li><i>day</i> - 1 to 31
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>dst</i> - boolean used to specify whether the given time components are
 * intended to be in daylight time or not. This is only used in the overlap
 * time when transitioning from DST to standard time, and the time components are 
 * ambiguous. Otherwise at all other times of the year, this flag is ignored.
 * If you specify the date using unix time (UTC) or a julian day, then the time is
 * already unambiguous and this flag does not need to be specified.
 * <p>
 * For example, in the US, the transition out of daylight savings time 
 * in 2014 happens at Nov 2, 2014 2:00am Daylight Time, when the time falls 
 * back to Nov 2, 2014 1:00am Standard Time. If you give a date/time components as 
 * "Nov 2, 2014 1:30am", then there are two 1:30am times in that day, and you would 
 * have to give the standard flag to indicate which of those two you mean. 
 * (dst=true means daylight time, dst=false means standard time).   
 * 
 * <li><i>timezone</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this gregorian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this gregorian date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale.
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Gregorian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends gregoriandate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Gregorian date
 */
ilib.Date.GregDate = function(params) {
	this.cal = new ilib.Cal.Gregorian();
	this.timezone = "local";

	if (params) {
		if (typeof(params.noinstance) === 'boolean' && params.noinstance) {
			// for doing inheritance, so don't need to fill in the data. The inheriting class only wants the methods.
			return;
		}
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone.toString();
		}
		
		if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond ) {
			this.year = parseInt(params.year, 10) || 0;
			this.month = parseInt(params.month, 10) || 1;
			this.day = parseInt(params.day, 10) || 1;
			this.hour = parseInt(params.hour, 10) || 0;
			this.minute = parseInt(params.minute, 10) || 0;
			this.second = parseInt(params.second, 10) || 0;
			this.millisecond = parseInt(params.millisecond, 10) || 0;
			if (typeof(params.dst) === 'boolean') {
				this.dst = params.dst;
			}
			this.rd = this.newRd(params);
			
			// add the time zone offset to the rd to convert to UTC
			this.offset = 0;
			if (this.timezone === "local" && typeof(params.dst) === 'undefined') {
				// if dst is defined, the intrinsic Date object has no way of specifying which version of a time you mean
				// in the overlap time at the end of DST. Do you mean the daylight 1:30am or the standard 1:30am? In this
				// case, use the ilib calculations below, which can distinguish between the two properly
				var d = new Date(this.year, this.month-1, this.day, this.hour, this.minute, this.second, this.millisecond);
				this.offset = -d.getTimezoneOffset() / 1440;
			} else {
				if (!this.tz) {
					this.tz = new ilib.TimeZone({id: this.timezone});
				}
				// getOffsetMillis requires that this.year, this.rd, and this.dst 
				// are set in order to figure out which time zone rules apply and 
				// what the offset is at that point in the year
				this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
			}
			if (this.offset !== 0) {
				this.rd = this.newRd({
					rd: this.rd.getRataDie() - this.offset
				});
			}
		}
	} 

	if (!this.rd) {
		this.rd = this.newRd(params);
		this._calcDateComponents();
	}
};

ilib.Date.GregDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.GregDate.prototype.parent = ilib.Date;
ilib.Date.GregDate.prototype.constructor = ilib.Date.GregDate;

/**
 * Return a new RD for this date type using the given params.
 * @private
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.GregDate.prototype.newRd = function (params) {
	return new ilib.Date.GregRataDie(params);
};

/**
 * Calculates the Gregorian year for a given rd number.
 * @private
 * @static
 */
ilib.Date.GregDate._calcYear = function(rd) {
	var days400,
		days100,
		days4,
		years400,
		years100,
		years4,
		years1,
		year;

	years400 = Math.floor((rd - 1) / 146097);
	days400 = ilib.mod((rd - 1), 146097);
	years100 = Math.floor(days400 / 36524);
	days100 = ilib.mod(days400, 36524);
	years4 = Math.floor(days100 / 1461);
	days4 = ilib.mod(days100, 1461);
	years1 = Math.floor(days4 / 365);
	
	year = 400 * years400 + 100 * years100 + 4 * years4 + years1;
	if (years100 !== 4 && years1 !== 4) {
		year++;
	}
	return year;
};

/**
 * @private
 */
ilib.Date.GregDate.prototype._calcYear = function(rd) {
	return ilib.Date.GregDate._calcYear(rd);
};

/**
 * Calculate the date components for the current time zone
 * @private
 */
ilib.Date.GregDate.prototype._calcDateComponents = function () {
	if (this.timezone === "local" && this.rd.getRataDie() >= -99280837 && this.rd.getRataDie() <= 100719163) {
		// console.log("using js Date to calculate offset");
		// use the intrinsic JS Date object to do the tz conversion for us, which 
		// guarantees that it follows the system tz database settings 
		var d = new Date(this.rd.getTimeExtended());
	
		/**
		 * Year in the Gregorian calendar.
		 * @type number
		 */
		this.year = d.getFullYear();
		
		/**
		 * The month number, ranging from 1 (January) to 12 (December).
		 * @type number
		 */
		this.month = d.getMonth()+1;
		
		/**
		 * The day of the month. This ranges from 1 to 31.
		 * @type number
		 */
		this.day = d.getDate();
		
		/**
		 * The hour of the day. This can be a number from 0 to 23, as times are
		 * stored unambiguously in the 24-hour clock.
		 * @type number
		 */
		this.hour = d.getHours();
		
		/**
		 * The minute of the hours. Ranges from 0 to 59.
		 * @type number
		 */
		this.minute = d.getMinutes();
		
		/**
		 * The second of the minute. Ranges from 0 to 59.
		 * @type number
		 */
		this.second = d.getSeconds();
		
		/**
		 * The millisecond of the second. Ranges from 0 to 999.
		 * @type number
		 */
		this.millisecond = d.getMilliseconds();
		
		this.offset = -d.getTimezoneOffset() / 1440;
	} else {
		// console.log("using ilib to calculate offset. tz is " + this.timezone);
		// console.log("GregDate._calcDateComponents: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
		if (typeof(this.offset) === "undefined") {
			// console.log("calculating offset");
			this.year = this._calcYear(this.rd.getRataDie());
			
			// now offset the RD by the time zone, then recalculate in case we were 
			// near the year boundary
			if (!this.tz) {
				this.tz = new ilib.TimeZone({id: this.timezone});
			}
			this.offset = this.tz.getOffsetMillis(this) / 86400000;
		// } else {
			// console.log("offset is already defined somehow. type is " + typeof(this.offset));
			// console.trace("Stack is this one");
		}
		// console.log("offset is " + this.offset);
		var rd = this.rd.getRataDie();
		if (this.offset !== 0) {
			rd += this.offset;
		}
		this.year = this._calcYear(rd);
		
		var yearStartRd = this.newRd({
			year: this.year,
			month: 1,
			day: 1,
			cal: this.cal
		});
		
		// remainder is days into the year
		var remainder = rd - yearStartRd.getRataDie() + 1;
		
		var cumulative = ilib.Cal.Gregorian.prototype.isLeapYear.call(this.cal, this.year) ? 
			ilib.Date.GregRataDie.cumMonthLengthsLeap : 
			ilib.Date.GregRataDie.cumMonthLengths; 
		
		this.month = ilib.bsearch(Math.floor(remainder), cumulative);
		remainder = remainder - cumulative[this.month-1];
		
		this.day = Math.floor(remainder);
		remainder -= this.day;
		// now convert to milliseconds for the rest of the calculation
		remainder = Math.round(remainder * 86400000);
		
		this.hour = Math.floor(remainder/3600000);
		remainder -= this.hour * 3600000;
		
		this.minute = Math.floor(remainder/60000);
		remainder -= this.minute * 60000;
		
		this.second = Math.floor(remainder/1000);
		remainder -= this.second * 1000;
		
		this.millisecond = Math.floor(remainder);
	}
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.GregDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return ilib.mod(rd, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, January 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
ilib.Date.GregDate.prototype.getDayOfYear = function() {
	var cumulativeMap = this.cal.isLeapYear(this.year) ? 
		ilib.Date.GregRataDie.cumMonthLengthsLeap : 
		ilib.Date.GregRataDie.cumMonthLengths; 
		
	return cumulativeMap[this.month-1] + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Gregorian 
 * calendars is -1 for "before the common era" (BCE) and 1 for "the common era" (CE). 
 * BCE dates are any date before Jan 1, 1 CE. In the proleptic Gregorian calendar, 
 * there is a year 0, so any years that are negative or zero are BCE. In the Julian
 * calendar, there is no year 0. Instead, the calendar goes straight from year -1 to 
 * 1.
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
ilib.Date.GregDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.GregDate.prototype.getCalendar = function() {
	return "gregorian";
};

// register with the factory method
ilib.Date._constructors["gregorian"] = ilib.Date.GregDate;
/*
 * thaisolar.js - Represent a Thai solar calendar object.
 * 
 * Copyright © 2013-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends calendar.js locale.js date.js julianday.js calendar/gregorian.js util/utils.js util/math.js */

/**
 * @class
 * Construct a new Thai solar calendar object. This class encodes information about
 * a Thai solar calendar.<p>
 * 
 * Depends directive: !depends thaisolar.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.ThaiSolar = function() {
	this.type = "thaisolar";
};

ilib.Cal.ThaiSolar.prototype = new ilib.Cal.Gregorian();
ilib.Cal.ThaiSolar.prototype.parent = ilib.Cal.Gregorian;
ilib.Cal.ThaiSolar.prototype.constructor = ilib.Cal.ThaiSolar;

/**
 * Return true if the given year is a leap year in the Thai solar calendar.
 * The year parameter may be given as a number, or as a ThaiSolarDate object.
 * @param {number|ilib.Date.ThaiSolarDate} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.ThaiSolar.prototype.isLeapYear = function(year) {
	var y = (typeof(year) === 'number' ? year : year.getYears());
	y -= 543;
	var centuries = ilib.mod(y, 400);
	return (ilib.mod(y, 4) === 0 && centuries !== 100 && centuries !== 200 && centuries !== 300);
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.ThaiSolar.prototype.newDateInstance = function (options) {
	return new ilib.Date.ThaiSolarDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["thaisolar"] = ilib.Cal.ThaiSolar;
/*
 * thaisolardate.js - Represent a date in the ThaiSolar calendar
 * 
 * Copyright © 2013-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
date.js 
calendar/gregorian.js 
util/jsutils.js
*/

/**
 * @class
 * Construct a new Thai solar date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means January, 2 means February, etc.
 * 
 * <li><i>day</i> - 1 to 31
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>timezone</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this Thai solar date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this Thai solar date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * </ul>
 *
 * If the constructor is called with another Thai solar date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends thaisolardate.js
 * 
 * @constructor
 * @extends ilib.Date.GregDate
 * @param {Object=} params parameters that govern the settings and behaviour of this Thai solar date
 */
ilib.Date.ThaiSolarDate = function(params) {
	var p = params;
	if (params) {
		// there is 198327 days difference between the Thai solar and 
		// Gregorian epochs which is equivalent to 543 years
		p = {};
		ilib.shallowCopy(params, p);
		if (typeof(p.year) !== 'undefined') {
			p.year -= 543;	
		}
		if (typeof(p.rd) !== 'undefined') {
			p.rd -= 198327;
		}
	}
	this.rd = undefined; // clear these out so that the GregDate constructor can set it
	this.offset = undefined;
	//console.log("ThaiSolarDate.constructor: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
	ilib.Date.GregDate.call(this, p);
	this.cal = new ilib.Cal.ThaiSolar();
	// make sure the year is set correctly
	if (params && typeof(params.year) !== 'undefined') {
		this.year = parseInt(params.year, 10);
	}
};

ilib.Date.ThaiSolarDate.prototype = new ilib.Date.GregDate({noinstance: true});
ilib.Date.ThaiSolarDate.prototype.parent = ilib.Date.GregDate.prototype;
ilib.Date.ThaiSolarDate.prototype.constructor = ilib.Date.ThaiSolarDate;

/**
 * the difference between a zero Julian day and the zero Thai Solar date.
 * This is some 543 years before the start of the Gregorian epoch. 
 * @private
 * @const
 * @type number
 */
ilib.Date.ThaiSolarDate.epoch = 1523097.5;

/**
 * Calculate the date components for the current time zone
 * @protected
 */
ilib.Date.ThaiSolarDate.prototype._calcDateComponents = function () {
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	// console.log("ThaiSolarDate._calcDateComponents: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
	this.parent._calcDateComponents.call(this);
	this.year += 543;
};

/**
 * Return the Rata Die (fixed day) number of this date.
 * 
 * @protected
 * @return {number} the rd date as a number
 */
ilib.Date.ThaiSolarDate.prototype.getRataDie = function() {
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	return this.rd.getRataDie() + 198327;
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week before the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.before = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.before(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.after = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.after(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.onOrBefore = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.onOrBefore(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.onOrAfter = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.onOrAfter(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.ThaiSolarDate.prototype.getCalendar = function() {
	return "thaisolar";
};

//register with the factory method
ilib.Date._constructors["thaisolar"] = ilib.Date.ThaiSolarDate;


ilib.data.astro = {"_EquinoxpTerms":[485,324.96,1934.136,203,337.23,32964.467,199,342.08,20.186,182,27.85,445267.112,156,73.14,45036.886,136,171.52,22518.443,77,222.54,65928.934,74,296.72,3034.906,70,243.58,9037.513,58,119.81,33718.147,52,297.17,150.678,50,21.02,2281.226,45,247.54,29929.562,44,325.15,31555.956,29,60.93,4443.417,18,155.12,67555.328,17,288.79,4562.452,16,198.04,62894.029,14,199.76,31436.921,12,95.39,14577.848,12,287.11,31931.756,12,320.81,34777.259,9,227.73,1222.114,8,15.45,16859.074],"_JDE0tab1000":[[1721139.29189,365242.1374,0.06134,0.00111,-0.00071],[1721233.25401,365241.72562,-0.05323,0.00907,0.00025],[1721325.70455,365242.49558,-0.11677,-0.00297,0.00074],[1721414.39987,365242.88257,-0.00769,-0.00933,-0.00006]],"_JDE0tab2000":[[2451623.80984,365242.37404,0.05169,-0.00411,-0.00057],[2451716.56767,365241.62603,0.00325,0.00888,-0.0003],[2451810.21715,365242.01767,-0.11575,0.00337,0.00078],[2451900.05952,365242.74049,-0.06223,-0.00823,0.00032]],"_deltaTtab":[124,119,115,110,106,102,98,95,91,88,85,82,79,77,74,72,70,67,65,63,62,60,58,57,55,54,53,51,50,49,48,47,46,45,44,43,42,41,40,38,37,36,35,34,33,32,31,30,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,14,13,12,12,11,11,10,10,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,14,14,14,14,14,14,14,15,15,15,15,15,15,15,16,16,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,16,16,16,16,15,15,14,14,13.7,13.4,13.1,12.9,12.7,12.6,12.5,12.5,12.5,12.5,12.5,12.5,12.5,12.5,12.5,12.5,12.5,12.4,12.3,12.2,12,11.7,11.4,11.1,10.6,10.2,9.6,9.1,8.6,8,7.5,7,6.6,6.3,6,5.8,5.7,5.6,5.6,5.6,5.7,5.8,5.9,6.1,6.2,6.3,6.5,6.6,6.8,6.9,7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.7,7.8,7.8,7.88,7.82,7.54,6.97,6.4,6.02,5.41,4.1,2.92,1.82,1.61,0.1,-1.02,-1.28,-2.69,-3.24,-3.64,-4.54,-4.71,-5.11,-5.4,-5.42,-5.2,-5.46,-5.46,-5.79,-5.63,-5.64,-5.8,-5.66,-5.87,-6.01,-6.19,-6.64,-6.44,-6.47,-6.09,-5.76,-4.66,-3.74,-2.72,-1.54,-0.02,1.24,2.64,3.86,5.37,6.14,7.75,9.13,10.46,11.53,13.36,14.65,16.01,17.2,18.24,19.06,20.25,20.95,21.16,22.25,22.41,23.03,23.49,23.62,23.86,24.49,24.34,24.08,24.02,24,23.87,23.95,23.86,23.93,23.73,23.92,23.96,24.02,24.33,24.83,25.3,25.7,26.24,26.77,27.28,27.78,28.25,28.71,29.15,29.57,29.97,30.36,30.72,31.07,31.35,31.68,32.18,32.68,33.15,33.59,34,34.47,35.03,35.73,36.54,37.43,38.29,39.2,40.18,41.17,42.23,43.37,44.49,45.48,46.46,47.52,48.53,49.59,50.54,51.38,52.17,52.96,53.79,54.34,54.87,55.32,55.82,56.3,56.86,57.57,58.31,59.12,59.99,60.78,61.63,62.3,62.97,63.47,63.83,64.09,64.3,64.47,64.57,64.69,64.85,65.15,65.46,65.78,66.07,66.3246,66.603,66.9069,67.281,67.61],"_oterms":[-4680.93,-1.55,1999.25,-51.38,-249.67,-39.05,7.12,27.87,5.79,2.45],"_nutArgMult":[0,0,0,0,1,-2,0,0,2,2,0,0,0,2,2,0,0,0,0,2,0,1,0,0,0,0,0,1,0,0,-2,1,0,2,2,0,0,0,2,1,0,0,1,2,2,-2,-1,0,2,2,-2,0,1,0,0,-2,0,0,2,1,0,0,-1,2,2,2,0,0,0,0,0,0,1,0,1,2,0,-1,2,2,0,0,-1,0,1,0,0,1,2,1,-2,0,2,0,0,0,0,-2,2,1,2,0,0,2,2,0,0,2,2,2,0,0,2,0,0,-2,0,1,2,2,0,0,0,2,0,-2,0,0,2,0,0,0,-1,2,1,0,2,0,0,0,2,0,-1,0,1,-2,2,0,2,2,0,1,0,0,1,-2,0,1,0,1,0,-1,0,0,1,0,0,2,-2,0,2,0,-1,2,1,2,0,1,2,2,0,1,0,2,2,-2,1,1,0,0,0,-1,0,2,2,2,0,0,2,1,2,0,1,0,0,-2,0,2,2,2,-2,0,1,2,1,2,0,-2,0,1,2,0,0,0,1,0,-1,1,0,0,-2,-1,0,2,1,-2,0,0,0,1,0,0,2,2,1,-2,0,2,0,1,-2,1,0,2,1,0,0,1,-2,0,-1,0,1,0,0,-2,1,0,0,0,1,0,0,0,0,0,0,1,2,0,-1,-1,1,0,0,0,1,1,0,0,0,-1,1,2,2,2,-1,-1,2,2,0,0,-2,2,2,0,0,3,2,2,2,-1,0,2,2],"_nutArgCoeff":[-171996,-1742,92095,89,-13187,-16,5736,-31,-2274,-2,977,-5,2062,2,-895,5,1426,-34,54,-1,712,1,-7,0,-517,12,224,-6,-386,-4,200,0,-301,0,129,-1,217,-5,-95,3,-158,0,0,0,129,1,-70,0,123,0,-53,0,63,0,0,0,63,1,-33,0,-59,0,26,0,-58,-1,32,0,-51,0,27,0,48,0,0,0,46,0,-24,0,-38,0,16,0,-31,0,13,0,29,0,0,0,29,0,-12,0,26,0,0,0,-22,0,0,0,21,0,-10,0,17,-1,0,0,16,0,-8,0,-16,1,7,0,-15,0,9,0,-13,0,7,0,-12,0,6,0,11,0,0,0,-10,0,5,0,-8,0,3,0,7,0,-3,0,-7,0,0,0,-7,0,3,0,-7,0,3,0,6,0,0,0,6,0,-3,0,6,0,-3,0,-6,0,3,0,-6,0,3,0,5,0,0,0,-5,0,3,0,-5,0,3,0,-5,0,3,0,4,0,0,0,4,0,0,0,4,0,0,0,-4,0,0,0,-4,0,0,0,-4,0,0,0,3,0,0,0,-3,0,0,0,-3,0,0,0,-3,0,0,0,-3,0,0,0,-3,0,0,0,-3,0,0,0,-3,0,0,0],"_nutCoeffA":[124.9,-1934.134,0.002063],"_nutCoeffB":[201.11,72001.5377,0.00057],"_coeff19th":[-0.00002,0.000297,0.025184,-0.181133,0.55304,-0.861938,0.677066,-0.212591],"_coeff18th":[-0.000009,0.003844,0.083563,0.865736,4.867575,15.845535,31.332267,38.291999,28.316289,11.636204,2.043794],"_solarLongCoeff":[403406,195207,119433,112392,3891,2819,1721,660,350,334,314,268,242,234,158,132,129,114,99,93,86,78,72,68,64,46,38,37,32,29,28,27,27,25,24,21,21,20,18,17,14,13,13,13,12,10,10,10,10],"_solarLongMultipliers":[0.9287892,35999.1376958,35999.4089666,35998.7287385,71998.20261,71998.4403,36000.35726,71997.4812,32964.4678,-19.441,445267.1117,45036.884,3.1008,22518.4434,-19.9739,65928.9345,9038.0293,3034.7684,33718.148,3034.448,-2280.773,29929.992,31556.493,149.588,9037.75,107997.405,-4444.176,151.771,67555.316,31556.08,-4561.54,107996.706,1221.655,62894.167,31437.369,14578.298,-31931.757,34777.243,1221.999,62894.511,-4442.039,107997.909,119.066,16859.071,-4.578,26895.292,-39.127,12297.536,90073.778],"_solarLongAddends":[270.54861,340.19128,63.91854,331.2622,317.843,86.631,240.052,310.26,247.23,260.87,297.82,343.14,166.79,81.53,3.5,132.75,182.95,162.03,29.8,266.4,249.2,157.6,257.8,185.1,69.9,8,197.1,250.4,65.3,162.7,341.5,291.6,98.5,146.7,110,5.2,342.6,230.9,256.1,45.3,242.9,115.2,151.8,285.3,53.3,126.6,205.7,85.9,146.1],"_meanMoonCoeff":[218.3164591,481267.88134236,-0.0013268,0.000001855835023689734,-1.533883486210388e-8],"_elongationCoeff":[297.8502042,445267.1115168,-0.00163,0.000001831944719236152,-8.844469995135542e-9],"_solarAnomalyCoeff":[357.5291092,35999.0502909,-0.0001536,4.083299305839118e-8],"_lunarAnomalyCoeff":[134.9634114,477198.8676313,0.008997,0.00001434740814071938,-6.797172376291463e-8],"_moonFromNodeCoeff":[93.2720993,483202.0175273,-0.0034029,-2.836074872376631e-7,1.158332464583985e-9],"_eCoeff":[1,-0.002516,-0.0000074],"_lunarElongationLongCoeff":[0,2,2,0,0,0,2,2,2,2,0,1,0,2,0,0,4,0,4,2,2,1,1,2,2,4,2,0,2,2,1,2,0,0,2,2,2,4,0,3,2,4,0,2,2,2,4,0,4,1,2,0,1,3,4,2,0,1,2,2],"_solarAnomalyLongCoeff":[0,0,0,0,1,0,0,-1,0,-1,1,0,1,0,0,0,0,0,0,1,1,0,1,-1,0,0,0,1,0,-1,0,-2,1,2,-2,0,0,-1,0,0,1,-1,2,2,1,-1,0,0,-1,0,1,0,1,0,0,-1,2,1,0,0],"_lunarAnomalyLongCoeff":[1,-1,0,2,0,0,-2,-1,1,0,-1,0,1,0,1,1,-1,3,-2,-1,0,-1,0,1,2,0,-3,-2,-1,-2,1,0,2,0,-1,1,0,-1,2,-1,1,-2,-1,-1,-2,0,1,4,0,-2,0,2,1,-2,-3,2,1,-1,3,-1],"_moonFromNodeLongCoeff":[0,0,0,0,0,2,0,0,0,0,0,0,0,-2,2,-2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,-2,2,0,2,0,0,0,0,0,0,-2,0,0,0,0,-2,-2,0,0,0,0,0,0,0,-2],"_sineCoeff":[6288774,1274027,658314,213618,-185116,-114332,58793,57066,53322,45758,-40923,-34720,-30383,15327,-12528,10980,10675,10034,8548,-7888,-6766,-5163,4987,4036,3994,3861,3665,-2689,-2602,2390,-2348,2236,-2120,-2069,2048,-1773,-1595,1215,-1110,-892,-810,759,-713,-700,691,596,549,537,520,-487,-399,-381,351,-340,330,327,-323,299,294,0],"_nmApproxCoeff":[730125.59765,36524.90882283305,0.0001337,-1.5e-7,7.3e-10],"_nmCapECoeff":[1,-0.002516,-0.0000074],"_nmSolarAnomalyCoeff":[2.5534,35998.960422026496,-0.0000218,-1.1e-7],"_nmLunarAnomalyCoeff":[201.5643,477197.67640106793,0.0107438,0.00001239,-5.8e-8],"_nmMoonArgumentCoeff":[160.7108,483200.81131396897,-0.0016341,-0.00000227,1.1e-8],"_nmCapOmegaCoeff":[124.7746,-1934.1313612299998,0.0020691,0.00000215],"_nmEFactor":[0,1,0,0,1,1,2,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0],"_nmSolarCoeff":[0,1,0,0,-1,1,2,0,0,1,0,1,1,-1,2,0,3,1,0,1,-1,-1,1,0],"_nmLunarCoeff":[1,0,2,0,1,1,0,1,1,2,3,0,0,2,1,2,0,1,2,1,1,1,3,4],"_nmMoonCoeff":[0,0,0,2,0,0,0,-2,2,0,0,2,-2,0,0,-2,0,-2,2,2,2,-2,0,0],"_nmSineCoeff":[-0.4072,0.17241,0.01608,0.01039,0.00739,-0.00514,0.00208,-0.00111,-0.00057,0.00056,-0.00042,0.00042,0.00038,-0.00024,-0.00007,0.00004,0.00004,0.00003,0.00003,-0.00003,0.00003,-0.00002,-0.00002,0.00002],"_nmAddConst":[251.88,251.83,349.42,84.66,141.74,207.14,154.84,34.52,207.19,291.34,161.72,239.56,331.55],"_nmAddCoeff":[0.016321,26.641886,36.412478,18.206239,53.303771,2.453732,7.30686,27.261239,0.121824,1.844379,24.198154,25.513099,3.592518],"_nmAddFactor":[0.000165,0.000164,0.000126,0.00011,0.000062,0.00006,0.000056,0.000047,0.000042,0.00004,0.000037,0.000035,0.000023],"_nmExtra":[299.77,132.8475848,-0.009173]};
/*
 * astro.js - Static functions to support astronomical calculations
 * 
 * Copyright © 2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends
ilibglobal.js
date.js
calendar/gregoriandate.js
calendar/gregratadie.js
*/

// !data astro

/*
 * These routines were derived from a public domain set of JavaScript 
 * functions for positional astronomy by John Walker of Fourmilab, 
 * September 1999.
 */

/**
 * Load in all the data needed for astrological calculations.
 * 
 * @param {boolean} sync
 * @param {*} loadParams
 * @param {function(*)|undefined} callback
 */
ilib.Date.initAstro = function(sync, loadParams, callback) {
	if (!ilib.data.astro) {
		ilib.loadData({
			name: "astro.json", // countries in their own language 
			locale: "-", // only need to load the root file 
			nonLocale: true,
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, /** @type function() */ function(astroData) {
				/** 
				 * @type {{
				 *  	_EquinoxpTerms:Array.<number>, 
				 *  	_JDE0tab1000:Array.<number>, 
				 *  	_JDE0tab2000:Array.<number>, 
				 *  	_deltaTtab:Array.<number>,
				 *  	_oterms:Array.<number>,
				 *  	_nutArgMult:Array.<number>, 
				 *  	_nutArgCoeff:Array.<number>, 
				 *  	_nutCoeffA:Array.<number>,
				 *  	_nutCoeffB:Array.<number>,
				 *  	_coeff19th:Array.<number>,
				 *  	_coeff18th:Array.<number>,
				 *  	_solarLongCoeff:Array.<number>, 
				 *  	_solarLongMultipliers:Array.<number>, 
				 *  	_solarLongAddends:Array.<number>, 
				 *  	_meanMoonCoeff:Array.<number>,
				 *  	_elongationCoeff:Array.<number>,
				 *  	_solarAnomalyCoeff:Array.<number>,
				 *  	_lunarAnomalyCoeff:Array.<number>,
				 *  	_moonFromNodeCoeff:Array.<number>,
				 *  	_eCoeff:Array.<number>,
				 *  	_lunarElongationLongCoeff:Array.<number>,
				 *  	_solarAnomalyLongCoeff:Array.<number>,
				 *  	_lunarAnomalyLongCoeff:Array.<number>,
				 *  	_moonFromNodeLongCoeff:Array.<number>,
				 *  	_sineCoeff:Array.<number>,
				 *  	_nmApproxCoeff:Array.<number>,
				 *  	_nmCapECoeff:Array.<number>,
				 *  	_nmSolarAnomalyCoeff:Array.<number>,
				 *  	_nmLunarAnomalyCoeff:Array.<number>,
				 *  	_nmMoonArgumentCoeff:Array.<number>,
				 *  	_nmCapOmegaCoeff:Array.<number>,
				 *  	_nmEFactor:Array.<number>,
				 *  	_nmSolarCoeff:Array.<number>,
				 *  	_nmLunarCoeff:Array.<number>,
				 *  	_nmMoonCoeff:Array.<number>,
				 *  	_nmSineCoeff:Array.<number>,
				 *  	_nmAddConst:Array.<number>,
				 *  	_nmAddCoeff:Array.<number>,
				 *  	_nmAddFactor:Array.<number>,
				 *  	_nmExtra:Array.<number>
				 *  }}
				 */ 	
			 	ilib.data.astro = astroData;
				if (callback && typeof(callback) === 'function') {
					callback(astroData);
				}
			})
		});
	} else {
		if (callback && typeof(callback) === 'function') {
			callback(ilib.data.astro);
		}
	}
};

/**
 * Convert degrees to radians.
 * 
 * @static
 * @param {number} d angle in degrees
 * @return {number} angle in radians 
 */
ilib.Date._dtr = function(d) {
	return (d * Math.PI) / 180.0;
};

/**
 * Convert radians to degrees.
 * 
 * @static
 * @param {number} r angle in radians
 * @return {number} angle in degrees 
 */
ilib.Date._rtd = function(r) {
	return (r * 180.0) / Math.PI;
};

/**
 * Return the cosine of an angle given in degrees.
 * @static
 * @param {number} d angle in degrees
 * @return {number} cosine of the angle.
 */  
ilib.Date._dcos = function(d) {
	return Math.cos(ilib.Date._dtr(d));
};

/**
 * Return the sine of an angle given in degrees.
 * @static
 * @param {number} d angle in degrees
 * @return {number} sine of the angle.
 */  
ilib.Date._dsin = function(d) {
	return Math.sin(ilib.Date._dtr(d));
};

/**
 * Return the tan of an angle given in degrees.
 * @static
 * @param {number} d angle in degrees
 * @return {number} tan of the angle.
 */  
ilib.Date._dtan = function(d) {
	return Math.tan(ilib.Date._dtr(d));
};

/**
 * Range reduce angle in degrees.
 * 
 * @static
 * @param {number} a angle to reduce
 * @return {number} the reduced angle  
 */
ilib.Date._fixangle = function(a) {
	return a - 360.0 * (Math.floor(a / 360.0));
};

/**
 * Range reduce angle in radians.
 * 
 * @static
 * @param {number} a angle to reduce
 * @return {number} the reduced angle  
 */
ilib.Date._fixangr = function(a) {
	return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
};

/**
 * Determine the Julian Ephemeris Day of an equinox or solstice.  The "which" 
 * argument selects the item to be computed:
 * 
 * <ul>
 * <li>0   March equinox
 * <li>1   June solstice
 * <li>2   September equinox
 * <li>3   December solstice
 * </ul>
 * 
 * @static
 * @param {number} year Gregorian year to calculate for
 * @param {number} which Which equinox or solstice to calculate
 */
ilib.Date._equinox = function(year, which) {
	var deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

	/*  Initialize terms for mean equinox and solstices.  We
	    have two sets: one for years prior to 1000 and a second
	    for subsequent years.  */

	if (year < 1000) {
		JDE0tab = ilib.data.astro._JDE0tab1000;
		Y = year / 1000;
	} else {
		JDE0tab = ilib.data.astro._JDE0tab2000;
		Y = (year - 2000) / 1000;
	}

	JDE0 = JDE0tab[which][0] + (JDE0tab[which][1] * Y)
			+ (JDE0tab[which][2] * Y * Y) + (JDE0tab[which][3] * Y * Y * Y)
			+ (JDE0tab[which][4] * Y * Y * Y * Y);

	//document.debug.log.value += "JDE0 = " + JDE0 + "\n";

	T = (JDE0 - 2451545.0) / 36525;
	//document.debug.log.value += "T = " + T + "\n";
	W = (35999.373 * T) - 2.47;
	//document.debug.log.value += "W = " + W + "\n";
	deltaL = 1 + (0.0334 * ilib.Date._dcos(W)) + (0.0007 * ilib.Date._dcos(2 * W));
	//document.debug.log.value += "deltaL = " + deltaL + "\n";

	//  Sum the periodic terms for time T

	S = 0;
	j = 0;
	for (i = 0; i < 24; i++) {
		S += ilib.data.astro._EquinoxpTerms[j]
				* ilib.Date._dcos(ilib.data.astro._EquinoxpTerms[j + 1] + (ilib.data.astro._EquinoxpTerms[j + 2] * T));
		j += 3;
	}

	//document.debug.log.value += "S = " + S + "\n";
	//document.debug.log.value += "Corr = " + ((S * 0.00001) / deltaL) + "\n";

	JDE = JDE0 + ((S * 0.00001) / deltaL);

	return JDE;
};

/* 
 * The table of observed Delta T values at the beginning of
 * years from 1620 through 2014 as found in astro.json is taken from
 * http://www.staff.science.uu.nl/~gent0113/deltat/deltat.htm
 * and
 * ftp://maia.usno.navy.mil/ser7/deltat.data
 */

/**  
 * Determine the difference, in seconds, between dynamical time and universal time.
 * 
 * @static
 * @param {number} year to calculate the difference for
 * @return {number} difference in seconds between dynamical time and universal time  
 */
ilib.Date._deltat = function (year) {
	var dt, f, i, t;

	if ((year >= 1620) && (year <= 2014)) {
		i = Math.floor(year - 1620);
		f = (year - 1620) - i; /* Fractional part of year */
		dt = ilib.data.astro._deltaTtab[i] + ((ilib.data.astro._deltaTtab[i + 1] - ilib.data.astro._deltaTtab[i]) * f);
	} else {
		t = (year - 2000) / 100;
		if (year < 948) {
			dt = 2177 + (497 * t) + (44.1 * t * t);
		} else {
			dt = 102 + (102 * t) + (25.3 * t * t);
			if ((year > 2000) && (year < 2100)) {
				dt += 0.37 * (year - 2100);
			}
		}
	}
	return dt;
};

/**
 * Calculate the obliquity of the ecliptic for a given
 * Julian date.  This uses Laskar's tenth-degree
 * polynomial fit (J. Laskar, Astronomy and
 * Astrophysics, Vol. 157, page 68 [1986]) which is
 * accurate to within 0.01 arc second between AD 1000
 * and AD 3000, and within a few seconds of arc for
 * +/-10000 years around AD 2000.  If we're outside the
 * range in which this fit is valid (deep time) we
 * simply return the J2000 value of the obliquity, which
 * happens to be almost precisely the mean.
 * 
 * @static
 * @param {number} jd Julian Day to calculate the obliquity for
 * @return {number} the obliquity
 */
ilib.Date._obliqeq = function (jd) {
	var eps, u, v, i;

 	v = u = (jd - 2451545.0) / 3652500.0;

 	eps = 23 + (26 / 60.0) + (21.448 / 3600.0);

 	if (Math.abs(u) < 1.0) {
 		for (i = 0; i < 10; i++) {
 			eps += (ilib.data.astro._oterms[i] / 3600.0) * v;
 			v *= u;
 		}
 	}
 	return eps;
};

/**
 * Return the position of the sun.  We return
 * intermediate values because they are useful in a
 * variety of other contexts.
 * @static
 * @param {number} jd find the position of sun on this Julian Day
 * @return {Object} the position of the sun and many intermediate
 * values
 */
ilib.Date._sunpos = function(jd) {
	var ret = {}, 
		T, T2, T3, Omega, epsilon, epsilon0;

	T = (jd - 2451545.0) / 36525.0;
	//document.debug.log.value += "Sunpos.  T = " + T + "\n";
	T2 = T * T;
	T3 = T * T2;
	ret.meanLongitude = ilib.Date._fixangle(280.46646 + 36000.76983 * T + 0.0003032 * T2);
	//document.debug.log.value += "ret.meanLongitude = " + ret.meanLongitude + "\n";
	ret.meanAnomaly = ilib.Date._fixangle(357.52911 + (35999.05029 * T) - 0.0001537 * T2 - 0.00000048 * T3);
	//document.debug.log.value += "ret.meanAnomaly = " + ret.meanAnomaly + "\n";
	ret.eccentricity = 0.016708634 - 0.000042037 * T - 0.0000001267 * T2;
	//document.debug.log.value += "e = " + e + "\n";
	ret.equationOfCenter = ((1.914602 - 0.004817 * T - 0.000014 * T2) * ilib.Date._dsin(ret.meanAnomaly))
			+ ((0.019993 - 0.000101 * T) * ilib.Date._dsin(2 * ret.meanAnomaly))
			+ (0.000289 * ilib.Date._dsin(3 * ret.meanAnomaly));
	//document.debug.log.value += "ret.equationOfCenter = " + ret.equationOfCenter + "\n";
	ret.sunLongitude = ret.meanLongitude + ret.equationOfCenter;
	//document.debug.log.value += "ret.sunLongitude = " + ret.sunLongitude + "\n";
	//ret.sunAnomaly = ret.meanAnomaly + ret.equationOfCenter;
	//document.debug.log.value += "ret.sunAnomaly = " + ret.sunAnomaly + "\n";
	// ret.sunRadius = (1.000001018 * (1 - (ret.eccentricity * ret.eccentricity))) / (1 + (ret.eccentricity * ilib.Date._dcos(ret.sunAnomaly)));
	//document.debug.log.value += "ret.sunRadius = " + ret.sunRadius + "\n";
	Omega = 125.04 - (1934.136 * T);
	//document.debug.log.value += "Omega = " + Omega + "\n";
	ret.apparentLong = ret.sunLongitude + (-0.00569) + (-0.00478 * ilib.Date._dsin(Omega));
	//document.debug.log.value += "ret.apparentLong = " + ret.apparentLong + "\n";
	epsilon0 = ilib.Date._obliqeq(jd);
	//document.debug.log.value += "epsilon0 = " + epsilon0 + "\n";
	epsilon = epsilon0 + (0.00256 * ilib.Date._dcos(Omega));
	//document.debug.log.value += "epsilon = " + epsilon + "\n";
	//ret.rightAscension = ilib.Date._fixangle(ilib.Date._rtd(Math.atan2(ilib.Date._dcos(epsilon0) * ilib.Date._dsin(ret.sunLongitude), ilib.Date._dcos(ret.sunLongitude))));
	//document.debug.log.value += "ret.rightAscension = " + ret.rightAscension + "\n";
	// ret.declination = ilib.Date._rtd(Math.asin(ilib.Date._dsin(epsilon0) * ilib.Date._dsin(ret.sunLongitude)));
	////document.debug.log.value += "ret.declination = " + ret.declination + "\n";
	ret.inclination = ilib.Date._fixangle(23.4392911 - 0.013004167 * T - 0.00000016389 * T2 + 0.0000005036 * T3);
	ret.apparentRightAscension = ilib.Date._fixangle(ilib.Date._rtd(Math.atan2(ilib.Date._dcos(epsilon) * ilib.Date._dsin(ret.apparentLong), ilib.Date._dcos(ret.apparentLong))));
	//document.debug.log.value += "ret.apparentRightAscension = " + ret.apparentRightAscension + "\n";
	//ret.apparentDeclination = ilib.Date._rtd(Math.asin(ilib.Date._dsin(epsilon) * ilib.Date._dsin(ret.apparentLong)));
	//document.debug.log.value += "ret.apparentDecliation = " + ret.apparentDecliation + "\n";

	// Angular quantities are expressed in decimal degrees
	return ret;
};

/**
 * Calculate the nutation in longitude, deltaPsi, and obliquity, 
 * deltaEpsilon for a given Julian date jd. Results are returned as an object
 * giving deltaPsi and deltaEpsilon in degrees.
 * 
 * @static
 * @param {number} jd calculate the nutation of this Julian Day
 * @return {Object} the deltaPsi and deltaEpsilon of the nutation
 */
ilib.Date._nutation = function(jd) {
	var i, j, 
		t = (jd - 2451545.0) / 36525.0, 
		t2, t3, to10, 
		ta = [], 
		dp = 0, 
		de = 0, 
		ang,
		ret = {};

	t3 = t * (t2 = t * t);

	/*
	 * Calculate angles. The correspondence between the elements of our array
	 * and the terms cited in Meeus are:
	 * 
	 * ta[0] = D ta[0] = M ta[2] = M' ta[3] = F ta[4] = \Omega
	 * 
	 */

	ta[0] = ilib.Date._dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2 + t3 / 189474.0);
	ta[1] = ilib.Date._dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2 - t3 / 300000.0);
	ta[2] = ilib.Date._dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2 + t3 / 56250.0);
	ta[3] = ilib.Date._dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2 + t3 / 327270);
	ta[4] = ilib.Date._dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2 + t3 / 450000.0);

	/*
	 * Range reduce the angles in case the sine and cosine functions don't do it
	 * as accurately or quickly.
	 */

	for (i = 0; i < 5; i++) {
		ta[i] = ilib.Date._fixangr(ta[i]);
	}

	to10 = t / 10.0;
	for (i = 0; i < 63; i++) {
		ang = 0;
		for (j = 0; j < 5; j++) {
			if (ilib.data.astro._nutArgMult[(i * 5) + j] != 0) {
				ang += ilib.data.astro._nutArgMult[(i * 5) + j] * ta[j];
			}
		}
		dp += (ilib.data.astro._nutArgCoeff[(i * 4) + 0] + ilib.data.astro._nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
		de += (ilib.data.astro._nutArgCoeff[(i * 4) + 2] + ilib.data.astro._nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
	}

	/*
	 * Return the result, converting from ten thousandths of arc seconds to
	 * radians in the process.
	 */

	ret.deltaPsi = dp / (3600.0 * 10000.0);
	ret.deltaEpsilon = de / (3600.0 * 10000.0);

	return ret;
};

/**
 * Returns the equation of time as a fraction of a day.
 * 
 * @static
 * @param {number} jd the Julian Day of the day to calculate for
 * @return {number} the equation of time for the given day  
 */
ilib.Date._equationOfTime = function(jd) {
	var alpha, deltaPsi, E, epsilon, L0, tau, pos;

	// 2451545.0 is the Julian day of J2000 epoch
	// 365250.0 is the number of days in a Julian millenium
	tau = (jd - 2451545.0) / 365250.0;
	//console.log("equationOfTime.  tau = " + tau);
	L0 = 280.4664567 + (360007.6982779 * tau) + (0.03032028 * tau * tau)
			+ ((tau * tau * tau) / 49931)
			+ (-((tau * tau * tau * tau) / 15300))
			+ (-((tau * tau * tau * tau * tau) / 2000000));
	//console.log("L0 = " + L0);
	L0 = ilib.Date._fixangle(L0);
	//console.log("L0 = " + L0);
	pos = ilib.Date._sunpos(jd);
	alpha = pos.apparentRightAscension;
	//console.log("alpha = " + alpha);
	var nut = ilib.Date._nutation(jd);
	deltaPsi = nut.deltaPsi;
	//console.log("deltaPsi = " + deltaPsi);
	epsilon = ilib.Date._obliqeq(jd) + nut.deltaEpsilon;
	//console.log("epsilon = " + epsilon);
	//console.log("L0 - 0.0057183 = " + (L0 - 0.0057183));
	//console.log("L0 - 0.0057183 - alpha = " + (L0 - 0.0057183 - alpha));
	//console.log("deltaPsi * cos(epsilon) = " + deltaPsi * ilib.Date._dcos(epsilon));
	
	E = L0 - 0.0057183 - alpha + deltaPsi * ilib.Date._dcos(epsilon);
	// if alpha and L0 are in different quadrants, then renormalize
	// so that the difference between them is in the right range
	if (E > 180) {
		E -= 360;
	}
	//console.log("E = " + E);
	// E = E - 20.0 * (Math.floor(E / 20.0));
	E = E * 4;
	//console.log("Efixed = " + E);
	E = E / (24 * 60);
	//console.log("Eday = " + E);

	return E;
};

/**
 * @private
 * @static
 */
ilib.Date._poly = function(x, coefficients) {
	var result = coefficients[0];
	var xpow = x;
	for (var i = 1; i < coefficients.length; i++) {
		result += coefficients[i] * xpow;
		xpow *= x;
	}
	return result;
};

/**
 * Calculate the UTC RD from the local RD given "zone" number of minutes
 * worth of offset.
 * 
 * @static
 * @param {number} local RD of the locale time, given in any calendar
 * @param {number} zone number of minutes of offset from UTC for the time zone 
 * @return {number} the UTC equivalent of the local RD
 */
ilib.Date._universalFromLocal = function(local, zone) {
	return local - zone / 1440;
};

/**
 * Calculate the local RD from the UTC RD given "zone" number of minutes
 * worth of offset.
 * 
 * @static
 * @param {number} local RD of the locale time, given in any calendar
 * @param {number} zone number of minutes of offset from UTC for the time zone 
 * @return {number} the UTC equivalent of the local RD
 */
ilib.Date._localFromUniversal = function(local, zone) {
	return local + zone / 1440;
};

/**
 * @private
 * @static
 * @param {number} c julian centuries of the date to calculate
 * @return {number} the aberration
 */
ilib.Date._aberration = function(c) {
	return 9.74e-05 * ilib.Date._dcos(177.63 + 35999.01847999999 * c) - 0.005575;
};

/**
 * @private
 *
ilib.data.astro._nutCoeffA = [124.90, -1934.134, 0.002063];
ilib.data.astro._nutCoeffB = [201.11, 72001.5377, 0.00057];
*/

/**
 * @private
 * @static
 * @param {number} c julian centuries of the date to calculate
 * @return {number} the nutation for the given julian century in radians
 */
ilib.Date._nutation2 = function(c) {
	var a = ilib.Date._poly(c, ilib.data.astro._nutCoeffA);
	var b = ilib.Date._poly(c, ilib.data.astro._nutCoeffB);
	// return -0.0000834 * ilib.Date._dsin(a) - 0.0000064 * ilib.Date._dsin(b);
	return -0.004778 * ilib.Date._dsin(a) - 0.0003667 * ilib.Date._dsin(b);
};


/**
 * @static
 * @private
 */
ilib.Date._ephemerisCorrection = function(jd) {
	var year = ilib.Date.GregDate._calcYear(jd - 1721424.5);
	
	if (1988 <= year && year <= 2019) {
		return (year - 1933) / 86400;
	}
	
	if (1800 <= year && year <= 1987) {
		var jul1 = new ilib.Date.GregRataDie({
			year: year,
			month: 7,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0
		});
		// 693596 is the rd of Jan 1, 1900
		var theta = (jul1.getRataDie() - 693596) / 36525;
		return ilib.Date._poly(theta, (1900 <= year) ? ilib.data.astro._coeff19th : ilib.data.astro._coeff18th);
	}
	
	if (1620 <= year && year <= 1799) {
		year -= 1600;
		return (196.58333 - 4.0675 * year + 0.0219167 * year * year) / 86400;
	}
	
	// 660724 is the rd of Jan 1, 1810
	var jan1 = new ilib.Date.GregRataDie({
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0
	});
	// var x = 0.5 + (jan1.getRataDie() - 660724);
	var x = 0.5 + (jan1.getRataDie() - 660724);
	
	return ((x * x / 41048480) - 15) / 86400;
};

/**
 * @static
 * @private
 */
ilib.Date._ephemerisFromUniversal = function(jd) {
	return jd + ilib.Date._ephemerisCorrection(jd);
};

/**
 * @static
 * @private
 */
ilib.Date._universalFromEphemeris = function(jd) {
	return jd - ilib.Date._ephemerisCorrection(jd);
};

/**
 * @static
 * @private
 */
ilib.Date._julianCenturies = function(jd) {
	// 2451545.0 is the Julian day of J2000 epoch
	// 730119.5 is the Gregorian RD of J2000 epoch
	// 36525.0 is the number of days in a Julian century
	return (ilib.Date._ephemerisFromUniversal(jd) - 2451545.0) / 36525.0;
};

/**
 * Calculate the solar longitude
 * 
 * @static
 * @param {number} jd julian day of the date to calculate the longitude for 
 * @return {number} the solar longitude in degrees
 */
ilib.Date._solarLongitude = function(jd) {
	var c = ilib.Date._julianCenturies(jd),
		longitude = 0,
		len = ilib.data.astro._solarLongCoeff.length,
		row;
	
	for (var i = 0; i < len; i++) {
		longitude += ilib.data.astro._solarLongCoeff[i] * 
			ilib.Date._dsin(ilib.data.astro._solarLongAddends[i] + ilib.data.astro._solarLongMultipliers[i] * c);
	}
	longitude *= 5.729577951308232e-06;
	longitude += 282.77718340000001 + 36000.769537439999 * c;
	longitude += ilib.Date._aberration(c) + ilib.Date._nutation2(c);
	return ilib.Date._fixangle(longitude);
};

/**
 * @static
 * @protected
 * @param {number} jd
 * @return {number}
 */
ilib.Date._lunarLongitude = function (jd) {
	var c = ilib.Date._julianCenturies(jd),
	    meanMoon = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._meanMoonCoeff)),
	    elongation = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._elongationCoeff)),
	    solarAnomaly = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._solarAnomalyCoeff)),
	    lunarAnomaly = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._lunarAnomalyCoeff)),
	    moonNode = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._moonFromNodeCoeff)),
	    e = ilib.Date._poly(c, ilib.data.astro._eCoeff);
	
	var sum = 0;
	for (var i = 0; i < ilib.data.astro._lunarElongationLongCoeff.length; i++) {
		var x = ilib.data.astro._solarAnomalyLongCoeff[i];

		sum += ilib.data.astro._sineCoeff[i] * Math.pow(e, Math.abs(x)) * 
			ilib.Date._dsin(ilib.data.astro._lunarElongationLongCoeff[i] * elongation + x * solarAnomaly + 
				ilib.data.astro._lunarAnomalyLongCoeff[i] * lunarAnomaly + 
				ilib.data.astro._moonFromNodeLongCoeff[i] * moonNode);
	}
	var longitude = sum / 1000000;
	var venus = 3958.0 / 1000000 * ilib.Date._dsin(119.75 + c * 131.84899999999999);
	var jupiter = 318.0 / 1000000 * ilib.Date._dsin(53.090000000000003 + c * 479264.28999999998);
	var flatEarth = 1962.0 / 1000000 * ilib.Date._dsin(meanMoon - moonNode);
	
	return ilib.Date._fixangle(meanMoon + longitude + venus + jupiter + flatEarth + ilib.Date._nutation2(c));
};

/**
 * @static
 * @param {number} n
 * @return {number} julian day of the n'th new moon
 */
ilib.Date._newMoonTime = function(n) {
	var k = n - 24724;
	var c = k / 1236.8499999999999;
	var approx = ilib.Date._poly(c, ilib.data.astro._nmApproxCoeff);
	var capE = ilib.Date._poly(c, ilib.data.astro._nmCapECoeff);
	var solarAnomaly = ilib.Date._poly(c, ilib.data.astro._nmSolarAnomalyCoeff);
	var lunarAnomaly = ilib.Date._poly(c, ilib.data.astro._nmLunarAnomalyCoeff);
	var moonArgument = ilib.Date._poly(c, ilib.data.astro._nmMoonArgumentCoeff);
	var capOmega = ilib.Date._poly(c, ilib.data.astro._nmCapOmegaCoeff);
	var correction = -0.00017 * ilib.Date._dsin(capOmega);
	for (var i = 0; i < ilib.data.astro._nmSineCoeff.length; i++) {
		correction = correction + ilib.data.astro._nmSineCoeff[i] * Math.pow(capE, ilib.data.astro._nmEFactor[i]) * 
		ilib.Date._dsin(ilib.data.astro._nmSolarCoeff[i] * solarAnomaly + 
				ilib.data.astro._nmLunarCoeff[i] * lunarAnomaly + 
				ilib.data.astro._nmMoonCoeff[i] * moonArgument);
	}
	var additional = 0;
	for (var i = 0; i < ilib.data.astro._nmAddConst.length; i++) {
		additional = additional + ilib.data.astro._nmAddFactor[i] * 
		ilib.Date._dsin(ilib.data.astro._nmAddConst[i] + ilib.data.astro._nmAddCoeff[i] * k);
	}
	var extra = 0.000325 * ilib.Date._dsin(ilib.Date._poly(c, ilib.data.astro._nmExtra));
	return ilib.Date._universalFromEphemeris(approx + correction + extra + additional + ilib.Date.RataDie.gregorianEpoch);
};

/**
 * @static
 * @param {number} jd
 * @return {number}
 */
ilib.Date._lunarSolarAngle = function(jd) {
	var lunar = ilib.Date._lunarLongitude(jd);
	var solar = ilib.Date._solarLongitude(jd)
	return ilib.Date._fixangle(lunar - solar);
};

/**
 * @static
 * @param {number} jd
 * @return {number}
 */
ilib.Date._newMoonBefore = function (jd) {
	var phase = ilib.Date._lunarSolarAngle(jd);
	// 11.450086114414322 is the julian day of the 0th full moon
	// 29.530588853000001 is the average length of a month
	var guess = Math.round((jd - 11.450086114414322 - ilib.Date.RataDie.gregorianEpoch) / 29.530588853000001 - phase / 360) - 1;
	var current, last;
	current = last = ilib.Date._newMoonTime(guess);
	while (current < jd) {
		guess++;
		last = current;
		current = ilib.Date._newMoonTime(guess);
	}
	return last;
};

/**
 * @static
 * @param {number} jd
 * @return {number}
 */
ilib.Date._newMoonAtOrAfter = function (jd) {
	var phase = ilib.Date._lunarSolarAngle(jd);
	// 11.450086114414322 is the julian day of the 0th full moon
	// 29.530588853000001 is the average length of a month
	var guess = Math.round((jd - 11.450086114414322 - ilib.Date.RataDie.gregorianEpoch) / 29.530588853000001 - phase / 360);
	var current;
	while ((current = ilib.Date._newMoonTime(guess)) < jd) {
		guess++;
	}
	return current;
};

/**
 * @static
 * @param {number} jd JD to calculate from
 * @param {number} longitude longitude to seek 
 * @returns {number} the JD of the next time that the solar longitude 
 * is a multiple of the given longitude
 */
ilib.Date._nextSolarLongitude = function(jd, longitude) {
	var rate = 365.242189 / 360.0;
	var tau = jd + rate * ilib.Date._fixangle(longitude - ilib.Date._solarLongitude(jd));
	var start = Math.max(jd, tau - 5.0);
	var end = tau + 5.0;
	
	return ilib.bisectionSearch(0, start, end, 1e-6, function (l) {
		return 180 - ilib.Date._fixangle(ilib.Date._solarLongitude(l) - longitude);
	});
};

/**
 * Floor the julian day to midnight of the current julian day.
 * 
 * @static
 * @protected
 * @param {number} jd the julian to round
 * @return {number} the jd floored to the midnight of the julian day
 */
ilib.Date._floorToJD = function(jd) {
	return Math.floor(jd - 0.5) + 0.5;
};

/**
 * Floor the julian day to midnight of the current julian day.
 * 
 * @static
 * @protected
 * @param {number} jd the julian to round
 * @return {number} the jd floored to the midnight of the julian day
 */
ilib.Date._ceilToJD = function(jd) {
	return Math.ceil(jd + 0.5) - 0.5;
};

/*
 * persratadie.js - Represent a rata die date in the Persian calendar
 * 
 * Copyright © 2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
date.js
util/utils.js
util/math.js
calendar/ratadie.js
calendar/astro.js
calendar/gregoriandate.js
*/

/**
 * Construct a new Persian RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
 * 
 * <li><i>day</i> - 1 to 31
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends persiandate.js
 * 
 * @private
 * @class
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian RD date
 */
ilib.Date.PersAstroRataDie = function(params) {
	this.rd = undefined;
	ilib.Date.initAstro(
		params && typeof(params.sync) === 'boolean' ? params.sync : true,
		params && params.loadParams,
		ilib.bind(this, function (x) {
			ilib.Date.RataDie.call(this, params);
			if (params && typeof(params.callback) === 'function') {
				params.callback(this);
			}
		})
	);
};

ilib.Date.PersAstroRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.PersAstroRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.PersAstroRataDie.prototype.constructor = ilib.Date.PersAstroRataDie;

/**
 * The difference between a zero Julian day and the first Persian date
 * @private
 * @const
 * @type number
 */
ilib.Date.PersAstroRataDie.prototype.epoch = 1948319.5;

/**
 * @protected 
 */
ilib.Date.PersAstroRataDie.prototype._tehranEquinox = function(year) {
    var equJED, equJD, equAPP, equTehran, dtTehran, eot;

    //  March equinox in dynamical time
    equJED = ilib.Date._equinox(year, 0);

    //  Correct for delta T to obtain Universal time
    equJD = equJED - (ilib.Date._deltat(year) / (24 * 60 * 60));

    //  Apply the equation of time to yield the apparent time at Greenwich
    eot = ilib.Date._equationOfTime(equJED) * 360;
    eot = (eot - 20 * Math.floor(eot/20)) / 360;
    equAPP = equJD + eot;

    /*  
     * Finally, we must correct for the constant difference between
     * the Greenwich meridian and the time zone standard for Iran 
     * Standard time, 52 degrees 30 minutes to the East.
     */

    dtTehran = 52.5 / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
};

/**
 * Calculate the year based on the given Julian day.
 * @protected
 * @param {number} jd the Julian day to get the year for
 * @return {{year:number,equinox:number}} the year and the last equinox
 */
ilib.Date.PersAstroRataDie.prototype._getYear = function(jd) {
	var gd = new ilib.Date.GregDate({julianday: jd});
    var guess = gd.getYears() - 2,
    	nexteq,
    	ret = {};

    //ret.equinox = Math.floor(this._tehranEquinox(guess));
    ret.equinox = this._tehranEquinox(guess);
	while (ret.equinox > jd) {
	    guess--;
	    // ret.equinox = Math.floor(this._tehranEquinox(guess));
	    ret.equinox = this._tehranEquinox(guess);
	}
	nexteq = ret.equinox - 1;
	// if the equinox falls after noon, then the day after that is the start of the 
	// next year, so truncate the JD to get the noon of the day before the day with 
	//the equinox on it, then add 0.5 to get the midnight of that day 
	while (!(Math.floor(ret.equinox) + 0.5 <= jd && jd < Math.floor(nexteq) + 0.5)) {
	    ret.equinox = nexteq;
	    guess++;
	    // nexteq = Math.floor(this._tehranEquinox(guess));
	    nexteq = this._tehranEquinox(guess);
	}
	
	// Mean solar tropical year is 365.24219878 days
	ret.year = Math.round((ret.equinox - this.epoch - 1) / 365.24219878) + 1;
	
	return ret;
};

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.PersAstroRataDie.prototype._setDateComponents = function(date) {
    var adr, guess, jd;

    // Mean solar tropical year is 365.24219878 days 
    guess = this.epoch + 1 + 365.24219878 * (date.year - 2);
    adr = {year: date.year - 1, equinox: 0};

    while (adr.year < date.year) {
        adr = this._getYear(guess);
        guess = adr.equinox + (365.24219878 + 2);
    }

    jd = Math.floor(adr.equinox) +
            ((date.month <= 7) ?
                ((date.month - 1) * 31) :
                (((date.month - 1) * 30) + 6)
            ) +
    	    (date.day - 1 + 0.5); // add 0.5 so that we convert JDs, which start at noon to RDs which start at midnight
    
	jd += (date.hour * 3600000 +
			date.minute * 60000 +
			date.second * 1000 +
			date.millisecond) /
			86400000;

    this.rd = jd - this.epoch;
};

/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
ilib.Date.PersAstroRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek - 3, 7);
};

/*
 * persianastro.js - Represent a Persian astronomical (Hijjri) calendar object.
 * 
 * Copyright © 2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends 
calendar/astro.js 
calendar.js 
locale.js 
date.js 
julianday.js 
util/utils.js
calendar/persratadie.js 
*/

/**
 * @class
 * Construct a new Persian astronomical (Hijjri) calendar object. This class encodes 
 * information about a Persian calendar. This class differs from the 
 * Persian calendar in that the leap years are calculated based on the
 * astronomical observations of the sun in Teheran, instead of calculating
 * the leap years based on a regular cyclical rhythm algorithm.<p>
 * 
 * Depends directive: !depends persianastro.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Persian = function() {
	this.type = "persian";
};

/**
 * @private
 * @const
 * @type Array.<number> 
 * the lengths of each month 
 */
ilib.Cal.Persian.monthLengths = [
	31,  // Farvardin
	31,  // Ordibehesht
	31,  // Khordad
	31,  // Tir
	31,  // Mordad
	31,  // Shahrivar
	30,  // Mehr
	30,  // Aban
	30,  // Azar
	30,  // Dey
	30,  // Bahman
	29   // Esfand
];

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 * @return {number} The number of months in the given year
 */
ilib.Cal.Persian.prototype.getNumMonths = function(year) {
	return 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
ilib.Cal.Persian.prototype.getMonLength = function(month, year) {
	if (month !== 12 || !this.isLeapYear(year)) {
		return ilib.Cal.Persian.monthLengths[month-1];
	} else {
		// Month 12, Esfand, has 30 days instead of 29 in leap years
		return 30;
	}
};

/**
 * Return true if the given year is a leap year in the Persian astronomical calendar.
 * @param {number} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Persian.prototype.isLeapYear = function(year) {
	var rdNextYear = new ilib.Date.PersAstroRataDie({
		cal: this,
		year: year + 1,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	var rdThisYear = new ilib.Date.PersAstroRataDie({
		cal: this,
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	}); 
    return (rdNextYear.getRataDie() - rdThisYear.getRataDie()) > 365;
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Persian.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Persian.prototype.newDateInstance = function (options) {
	return new ilib.Date.PersDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["persian"] = ilib.Cal.Persian;

/*
 * persianastrodate.js - Represent a date in the Persian astronomical (Hijjri) calendar
 * 
 * Copyright © 2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
date.js
calendar/persratadie.js
calendar/persianastro.js 
util/utils.js
util/search.js
util/math.js
localeinfo.js 
julianday.js 
*/

// !data astro

/**
 * @class
 * 
 * Construct a new Persian astronomical date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
 * 
 * <li><i>day</i> - 1 to 31
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>timezone</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this persian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this persian date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale.
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends persiandate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian date
 */
ilib.Date.PersDate = function(params) {
	this.cal = new ilib.Cal.Persian();
	this.timezone = "local";
	
	if (params) {
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone;
		}
	}
	
	ilib.Date.initAstro(
		params && typeof(params.sync) === 'boolean' ? params.sync : true,
		params && params.loadParams,
		ilib.bind(this, function (x) {
			if (params && (params.year || params.month || params.day || params.hour ||
					params.minute || params.second || params.millisecond)) {
				/**
				 * Year in the Persian calendar.
				 * @type number
				 */
				this.year = parseInt(params.year, 10) || 0;

				/**
				 * The month number, ranging from 1 to 12
				 * @type number
				 */
				this.month = parseInt(params.month, 10) || 1;

				/**
				 * The day of the month. This ranges from 1 to 31.
				 * @type number
				 */
				this.day = parseInt(params.day, 10) || 1;
				
				/**
				 * The hour of the day. This can be a number from 0 to 23, as times are
				 * stored unambiguously in the 24-hour clock.
				 * @type number
				 */
				this.hour = parseInt(params.hour, 10) || 0;

				/**
				 * The minute of the hours. Ranges from 0 to 59.
				 * @type number
				 */
				this.minute = parseInt(params.minute, 10) || 0;

				/**
				 * The second of the minute. Ranges from 0 to 59.
				 * @type number
				 */
				this.second = parseInt(params.second, 10) || 0;

				/**
				 * The millisecond of the second. Ranges from 0 to 999.
				 * @type number
				 */
				this.millisecond = parseInt(params.millisecond, 10) || 0;
				
				/**
				 * The day of the year. Ranges from 1 to 366.
				 * @type number
				 */
				this.dayOfYear = parseInt(params.dayOfYear, 10);

				if (typeof(params.dst) === 'boolean') {
					this.dst = params.dst;
				}
				
				this.rd = this.newRd(this);
				
				// add the time zone offset to the rd to convert to UTC
				if (!this.tz) {
					this.tz = new ilib.TimeZone({id: this.timezone});
				}
				// getOffsetMillis requires that this.year, this.rd, and this.dst 
				// are set in order to figure out which time zone rules apply and 
				// what the offset is at that point in the year
				this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
				if (this.offset !== 0) {
					this.rd = this.newRd({
						rd: this.rd.getRataDie() - this.offset
					});
				}
			}
			
			if (!this.rd) {
				this.rd = this.newRd(params);
				this._calcDateComponents();
			}
			
			if (params && typeof(params.onLoad) === 'function') {
				params.onLoad(this);
			}
		})
	);
};

ilib.Date.PersDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.PersDate.prototype.parent = ilib.Date;
ilib.Date.PersDate.prototype.constructor = ilib.Date.PersDate;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year 
 */
ilib.Date.PersDate.cumMonthLengths = [
    0,    // Farvardin
	31,   // Ordibehesht
	62,   // Khordad
	93,   // Tir
	124,  // Mordad
	155,  // Shahrivar
	186,  // Mehr
	216,  // Aban
	246,  // Azar
	276,  // Dey
	306,  // Bahman
	336,  // Esfand
	366
];

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.PersDate.prototype.newRd = function (params) {
	return new ilib.Date.PersAstroRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.PersDate.prototype._calcYear = function(rd) {
	var julianday = rd + this.rd.epoch;
	return this.rd._getYear(julianday).year;
};

/**
 * @private
 * Calculate date components for the given RD date.
 */
ilib.Date.PersDate.prototype._calcDateComponents = function () {
	var remainder,
		rd = this.rd.getRataDie();
	
	this.year = this._calcYear(rd);
	
	if (typeof(this.offset) === "undefined") {
		// now offset the RD by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}
	
	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}
	
	//console.log("PersDate.calcComponent: calculating for rd " + rd);
	//console.log("PersDate.calcComponent: year is " + ret.year);
	var yearStart = this.newRd({
		year: this.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	remainder = rd - yearStart.getRataDie() + 1;
	
	this.dayOfYear = remainder;
	
	//console.log("PersDate.calcComponent: remainder is " + remainder);
	
	this.month = ilib.bsearch(Math.floor(remainder), ilib.Date.PersDate.cumMonthLengths);
	remainder -= ilib.Date.PersDate.cumMonthLengths[this.month-1];
	
	//console.log("PersDate.calcComponent: month is " + this.month + " and remainder is " + remainder);
	
	this.day = Math.floor(remainder);
	remainder -= this.day;
	
	//console.log("PersDate.calcComponent: day is " + this.day + " and remainder is " + remainder);
	
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = remainder;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.PersDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return ilib.mod(rd-3, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, Farvardin 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
ilib.Date.PersDate.prototype.getDayOfYear = function() {
	return ilib.Date.PersDate.cumMonthLengths[this.month-1] + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Persian 
 * calendars is -1 for "before the persian era" (BP) and 1 for "the persian era" (anno 
 * persico or AP). 
 * BP dates are any date before Farvardin 1, 1 AP. In the proleptic Persian calendar, 
 * there is a year 0, so any years that are negative or zero are BP.
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
ilib.Date.PersDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.PersDate.prototype.getCalendar = function() {
	return "persian";
};

// register with the factory method
ilib.Date._constructors["persian"] = ilib.Date.PersDate;
/*
 * ethiopic.js - Represent a Ethiopic calendar object.
 * 
 * Copyright © 2015, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js */

/**
 * @class
 * Construct a new Ethiopic calendar object. This class encodes information about
 * a Ethiopic calendar.<p>
 * 
 * Depends directive: !depends ethiopic.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Ethiopic = function() {
	this.type = "ethiopic";
};

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for lunar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=Maskaram, 2=Teqemt, etc. until 13=Paguemen.
 * 
 * @param {number} year a year for which the number of months is sought
 */
ilib.Cal.Ethiopic.prototype.getNumMonths = function(year) {
	return 13;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number|string} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
ilib.Cal.Ethiopic.prototype.getMonLength = function(month, year) {
	var m = month;
	switch (typeof(m)) {
        case "string": 
            m = parseInt(m, 10); 
            break;
        case "function":
        case "object":
        case "undefined":
            return 30;
            break;
    }    
	if (m < 13) {
		return 30;
	} else {
		return this.isLeapYear(year) ? 6 : 5;
	}
};

/**
 * Return true if the given year is a leap year in the Ethiopic calendar.
 * The year parameter may be given as a number, or as a JulDate object.
 * @param {number|ilib.Date.JulDate|string} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Ethiopic.prototype.isLeapYear = function(year) {
	var y = year;
	 switch (typeof(y)) {
        case "string":
            y = parseInt(y, 10);
            break;
        case "object":
            if (typeof(y.year) !== "number") { // in case it is an ilib.Date object
                return false;
            }
            y = y.year;
            break;
        case "function":
        case "undefined":
            return false;
            break;
    }
	return ilib.mod(y, 4) === 3;
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Ethiopic.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Ethiopic.prototype.newDateInstance = function (options) {
	return new ilib.Date.EthiopicDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["ethiopic"] = ilib.Cal.Ethiopic;
/*
 * ethiopicdate.js - Represent a date in the Ethiopic calendar
 * 
 * Copyright © 2015, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
date.js 
calendar/ethiopic.js 
util/utils.js
util/search.js 
util/math.js
localeinfo.js 
julianday.js 
*/

/**
 * @class
 * Construct a new Ethiopic RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Maskaram, 2 means Teqemt, etc., and 13 means Paguemen
 * 
 * <li><i>day</i> - 1 to 30
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Ethiopic date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends ethiopicdate.js
 * 
 * @private
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Ethiopic RD date
 */
ilib.Date.EthiopicRataDie = function(params) {
	this.cal = params && params.cal || new ilib.Cal.Ethiopic();
	this.rd = undefined;
	ilib.Date.RataDie.call(this, params);
};

ilib.Date.EthiopicRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.EthiopicRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.EthiopicRataDie.prototype.constructor = ilib.Date.EthiopicRataDie;

/**
 * The difference between the zero Julian day and the first Ethiopic date
 * of Friday, August 29, 8 CE Julian at 6:00am UTC.<p> 
 * 
 * See <a href="http://us.wow.com/wiki/Time_in_Ethiopia?s_chn=90&s_pt=aolsem&v_t=aolsem"
 * Time in Ethiopia</a> for information about how time is handled in Ethiopia.
 * 
 * @protected
 * @type number
 */
ilib.Date.EthiopicRataDie.prototype.epoch = 1724219.75;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 * 
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.EthiopicRataDie.prototype._setDateComponents = function(date) {
	var year = date.year;
	var years = 365 * (year - 1) + Math.floor(year/4);
	var dayInYear = (date.month-1) * 30 + date.day;
	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) / 
		86400000;
	
	/*
	console.log("calcRataDie: converting " +  JSON.stringify(parts));
	console.log("getRataDie: year is " +  years);
	console.log("getRataDie: day in year is " +  dayInYear);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	
	this.rd = years + dayInYear + rdtime;
};

/**
 * @class
 * Construct a new date object for the Ethiopic Calendar. The constructor can be called
 * with a parameter object that contains any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970 (Gregorian).
 * <li><i>julianday</i> - the Julian Day to set into this date
 * <li><i>year</i> - any integer
 * <li><i>month</i> - 1 to 13, where 1 means Maskaram, 2 means Teqemt, etc., and 13 means Paguemen
 * <li><i>day</i> - 1 to 30
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * <li><i>minute</i> - 0 to 59
 * <li><i>second</i> - 0 to 59
 * <li><i>millisecond<i> - 0 to 999
 * <li><i>locale</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this ethiopic date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * <li><i>timezone</i> - the time zone of this instance. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *  
 * If called with another Ethiopic date argument, the date components of the given
 * date are copied into the current one.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * Depends directive: !depends ethiopicdate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Ethiopic date
 */
ilib.Date.EthiopicDate = function(params) {
	this.cal = new ilib.Cal.Ethiopic();
	
	if (params) {
		if (typeof(params.noinstance) === 'boolean' && params.noinstance) {
			// for doing inheritance, so don't need to fill in the data. The inheriting class only wants the methods.
			return;
		}
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		
		if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond ) {
			/**
			 * Year in the Ethiopic calendar.
			 * @type number
			 */
			this.year = parseInt(params.year, 10) || 0;
			/**
			 * The month number, ranging from 1 (Maskaram) to 13 (Paguemen).
			 * @type number
			 */
			this.month = parseInt(params.month, 10) || 1;
			/**
			 * The day of the month. This ranges from 1 to 30.
			 * @type number
			 */
			this.day = parseInt(params.day, 10) || 1;
			/**
			 * The hour of the day. This can be a number from 0 to 23, as times are
			 * stored unambiguously in the 24-hour clock.
			 * @type number
			 */
			this.hour = parseInt(params.hour, 10) || 0;
			/**
			 * The minute of the hours. Ranges from 0 to 59.
			 * @type number
			 */
			this.minute = parseInt(params.minute, 10) || 0;
			/**
			 * The second of the minute. Ranges from 0 to 59.
			 * @type number
			 */
			this.second = parseInt(params.second, 10) || 0;
			/**
			 * The millisecond of the second. Ranges from 0 to 999.
			 * @type number
			 */
			this.millisecond = parseInt(params.millisecond, 10) || 0;
			
			/**
			 * The day of the year. Ranges from 1 to 366.
			 * @type number
			 */
			this.dayOfYear = parseInt(params.dayOfYear, 10);
			
			if (typeof(params.dst) === 'boolean') {
				this.dst = params.dst;
			}
			
			this.rd = this.newRd(this);
			
			// add the time zone offset to the rd to convert to UTC
			if (!this.tz) {
				this.tz = new ilib.TimeZone({id: this.timezone});
			}
			// getOffsetMillis requires that this.year, this.rd, and this.dst 
			// are set in order to figure out which time zone rules apply and 
			// what the offset is at that point in the year
			this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
			if (this.offset !== 0) {
				this.rd = this.newRd({
					rd: this.rd.getRataDie() - this.offset
				});
			}
		}
	}
	
	if (!this.rd) {
		this.rd = this.newRd(params);
		this._calcDateComponents();
	}
};

ilib.Date.EthiopicDate.prototype = new ilib.Date({ noinstance: true });
ilib.Date.EthiopicDate.prototype.parent = ilib.Date;
ilib.Date.EthiopicDate.prototype.constructor = ilib.Date.EthiopicDate;

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.EthiopicDate.prototype.newRd = function (params) {
	return new ilib.Date.EthiopicRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.EthiopicDate.prototype._calcYear = function(rd) {
	var year = Math.floor((4*(Math.floor(rd)-1) + 1463)/1461);
	
	return year;
};

/**
 * Calculate date components for the given RD date.
 * @protected
 */
ilib.Date.EthiopicDate.prototype._calcDateComponents = function () {
	var remainder,
		cumulative,
		rd = this.rd.getRataDie();
	
	this.year = this._calcYear(rd);

	if (typeof(this.offset) === "undefined") {
		this.year = this._calcYear(rd);
		
		// now offset the RD by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}

	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}
	
	var jan1 = this.newRd({
		year: this.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	remainder = rd + 1 - jan1.getRataDie();
	
	this.month = Math.floor((remainder-1)/30) + 1;
	remainder = remainder - (this.month-1) * 30;
	
	this.day = Math.floor(remainder);
	remainder -= this.day;
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = remainder;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.EthiopicDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return ilib.mod(rd-4, 7);
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.EthiopicDate.prototype.getCalendar = function() {
	return "ethiopic";
};

//register with the factory method
ilib.Date._constructors["ethiopic"] = ilib.Date.EthiopicDate;
ilib.data.ctype = {"ideograph":[[4352,4607],[12353,12447],[12449,12543],[12549,12589],[12593,12686],[12704,12727],[12784,12799],[13312,19893],[19968,40907],[40960,42124],[43360,43388],[44032,55203],[55216,55291],[63744,64217],[65382,65437],[65440,65500]],"ideoother":[[12294,12294],[12348,12348],[12352,12352],[12448,12448],[12544,12548],[12590,12591],[12592,12592],[12687,12687],[12800,13055],[13056,13183],[13184,13311],[40908,40959],[42125,42191],[43389,43391],[55292,55295],[64218,64255]],"ascii":[[32,127]],"digit":[[48,57]],"xdigit":[[48,57],[65,70],[97,102]],"blank":[[9,9],[32,32]],"space":[[9,13],[133],[8232,8233]],"latin":[[0,591],[7680,7935],[11360,11391],[42784,43007]],"ipa":[[592,687],[7424,7551],[7552,7615]],"operators":[[8704,8959],[10752,11007]],"greek":[[880,1023],[7936,8191]],"cyrillic":[[1024,1327],[11744,11775],[42560,42655]],"arabic":[[1536,1791],[1872,1919],[64336,65023],[65136,65279]],"devanagari":[[2304,2431],[43232,43263]],"myanmar":[[4096,4255],[43616,43647]],"hangul":[[4352,4607],[12592,12687],[43360,43391],[44032,55215],[55216,55295]],"ethiopic":[[4608,5023],[11648,11743],[43776,43823]],"canadian":[[5120,5759],[6320,6399]],"combining":[[768,879],[7616,7679],[8400,8447]],"arrows":[[8592,8703],[10224,10239],[10496,10623],[11008,11263]],"cjk":[[12272,12287],[13312,19903],[19968,40959],[131072,173791],[173824,177983],[177984,178207]],"cjkcompatibility":[[13056,13311],[63744,64255],[65072,65103],[194560,195103]],"mathematical":[[10176,10223],[10624,10751],[119808,120831]],"privateuse":[[57344,63743],[983040,1048575],[1048576,1114111]],"variations":[[65024,65039],[917760,917999]],"bamum":[[42656,42751],[92160,92735]],"georgian":[[4256,4351],[11520,11567]],"punctuation":[[8192,8303],[11776,11903]],"katakana":[[12448,12543],[12784,12799],[110592,110847]],"bopomofo":[[12544,12591],[12704,12735]],"enclosedalpha":[[9312,9471],[127232,127487]],"cjkradicals":[[11904,12031],[12032,12255]],"yi":[[40960,42127],[42128,42191]],"linearb":[[65536,65663],[65664,65791]],"enclosedcjk":[[12800,13055],[127488,127743]],"spacing":[[688,767]],"armenian":[[1328,1423]],"hebrew":[[1424,1535]],"syriac":[[1792,1871]],"thaana":[[1920,1983]],"nko":[[1984,2047]],"samaritan":[[2048,2111]],"mandaic":[[2112,2143]],"bengali":[[2432,2559]],"gurmukhi":[[2560,2687]],"gujarati":[[2688,2815]],"oriya":[[2816,2943]],"tamil":[[2944,3071]],"telugu":[[3072,3199]],"kannada":[[3200,3327]],"malayalam":[[3328,3455]],"sinhala":[[3456,3583]],"thai":[[3584,3711]],"lao":[[3712,3839]],"tibetan":[[3840,4095]],"cherokee":[[5024,5119]],"ogham":[[5760,5791]],"runic":[[5792,5887]],"tagalog":[[5888,5919]],"hanunoo":[[5920,5951]],"buhid":[[5952,5983]],"tagbanwa":[[5984,6015]],"khmer":[[6016,6143]],"mongolian":[[6144,6319]],"limbu":[[6400,6479]],"taile":[[6480,6527]],"newtailue":[[6528,6623]],"khmersymbols":[[6624,6655]],"buginese":[[6656,6687]],"taitham":[[6688,6831]],"balinese":[[6912,7039]],"sundanese":[[7040,7103]],"batak":[[7104,7167]],"lepcha":[[7168,7247]],"olchiki":[[7248,7295]],"vedic":[[7376,7423]],"supersub":[[8304,8351]],"currency":[[8352,8399]],"letterlike":[[8448,8527]],"numbers":[[8528,8591]],"misc":[[8960,9215]],"controlpictures":[[9216,9279]],"ocr":[[9280,9311]],"box":[[9472,9599]],"block":[[9600,9631]],"geometric":[[9632,9727]],"miscsymbols":[[9728,9983],[127744,128511]],"dingbats":[[9984,10175]],"braille":[[10240,10495]],"glagolitic":[[11264,11359]],"coptic":[[11392,11519]],"tifinagh":[[11568,11647]],"cjkpunct":[[12288,12351]],"hiragana":[[12352,12447]],"kanbun":[[12688,12703]],"yijing":[[19904,19967]],"cjkstrokes":[[12736,12783]],"lisu":[[42192,42239]],"vai":[[42240,42559]],"modifiertone":[[42752,42783]],"sylotinagri":[[43008,43055]],"indicnumber":[[43056,43071]],"phagspa":[[43072,43135]],"saurashtra":[[43136,43231]],"kayahli":[[43264,43311]],"rejang":[[43312,43359]],"javanese":[[43392,43487]],"cham":[[43520,43615]],"taiviet":[[43648,43743]],"meeteimayek":[[43968,44031]],"presentation":[[64256,64335]],"vertical":[[65040,65055]],"halfmarks":[[65056,65071]],"small":[[65104,65135]],"width":[[65280,65519]],"specials":[[65520,65535]],"aegean":[[65792,65855]],"ancient":[[65936,65999]],"phaistosdisc":[[66000,66047]],"lycian":[[66176,66207]],"carian":[[66208,66271]],"olditalic":[[66304,66351]],"gothic":[[66352,66383]],"ugaritic":[[66432,66463]],"oldpersian":[[66464,66527]],"deseret":[[66560,66639]],"shavian":[[66640,66687]],"osmanya":[[66688,66735]],"cypriot":[[67584,67647]],"aramaic":[[67648,67679]],"phoenician":[[67840,67871]],"lydian":[[67872,67903]],"kharoshthi":[[68096,68191]],"oldsoutharabian":[[68192,68223]],"avestan":[[68352,68415]],"parthian":[[68416,68447]],"pahlavi":[[68448,68479]],"oldturkic":[[68608,68687]],"ruminumerals":[[69216,69247]],"brahmi":[[69632,69759]],"kaithi":[[69760,69839]],"cuneiform":[[73728,74751]],"cuneiformnumbers":[[74752,74879]],"hieroglyphs":[[77824,78895]],"byzantine musical":[[118784,119039]],"musicalsymbols":[[119040,119295]],"taixuanjing":[[119552,119647]],"rodnumerals":[[119648,119679]],"mahjong":[[126976,127023]],"domino":[[127024,127135]],"playingcards":[[127136,127231]],"emoticons":[[128512,128591]],"mapsymbols":[[128640,128767]],"alchemic":[[128768,128895]],"tags":[[917504,917631]],"greeknumbers":[[65856,65935]],"greekmusic":[[119296,119375]]};
/*
 * ctype.js - Character type definitions
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js util/search.js

// !data ctype

/**
 * Provides a set of static routines that return information about characters.
 * These routines emulate the C-library ctype functions. The characters must be 
 * encoded in utf-16, as no other charsets are currently supported. Only the first
 * character of the given string is tested.
 * @namespace
 */
ilib.CType = {
	/**
	 * Actual implementation for withinRange. Searches the given object for ranges.
	 * The range names are taken from the Unicode range names in 
	 * http://www.unicode.org/Public/UNIDATA/extracted/DerivedGeneralCategory.txt
	 * 
	 * <ul>
	 * <li>Cn - Unassigned
	 * <li>Lu - Uppercase_Letter
	 * <li>Ll - Lowercase_Letter
	 * <li>Lt - Titlecase_Letter
	 * <li>Lm - Modifier_Letter
	 * <li>Lo - Other_Letter
	 * <li>Mn - Nonspacing_Mark
	 * <li>Me - Enclosing_Mark
	 * <li>Mc - Spacing_Mark
	 * <li>Nd - Decimal_Number
	 * <li>Nl - Letter_Number
	 * <li>No - Other_Number
	 * <li>Zs - Space_Separator
	 * <li>Zl - Line_Separator
	 * <li>Zp - Paragraph_Separator
	 * <li>Cc - Control
	 * <li>Cf - Format
	 * <li>Co - Private_Use
	 * <li>Cs - Surrogate
	 * <li>Pd - Dash_Punctuation
	 * <li>Ps - Open_Punctuation
	 * <li>Pe - Close_Punctuation
	 * <li>Pc - Connector_Punctuation
	 * <li>Po - Other_Punctuation
	 * <li>Sm - Math_Symbol
	 * <li>Sc - Currency_Symbol
	 * <li>Sk - Modifier_Symbol
	 * <li>So - Other_Symbol
	 * <li>Pi - Initial_Punctuation
	 * <li>Pf - Final_Punctuation
	 * </ul>
	 * 
	 * @protected
	 * @param {number} num code point of the character to examine
	 * @param {string} rangeName the name of the range to check
	 * @param {Object} obj object containing the character range data
	 * @return {boolean} true if the first character is within the named
	 * range
	 */
	_inRange: function(num, rangeName, obj) {
		var range, i;
		if (num < 0 || !rangeName || !obj) {
			return false;
		}
		
		range = obj[rangeName];
		if (!range) {
			return false;
		}
		
		var compare = function(singlerange, target) {
			if (singlerange.length === 1) {
				return singlerange[0] - target;
			} else {
				return target < singlerange[0] ? singlerange[0] - target :
					(target > singlerange[1] ? singlerange[1] - target : 0);
			}
		};
		var result = ilib.bsearch(num, range, compare);
		return result < range.length && compare(range[result], num) === 0;
	},
	
	/**
	 * Return whether or not the first character is within the named range
	 * of Unicode characters. The valid list of range names are taken from 
	 * the Unicode 6.0 spec. Characters in all ranges of Unicode are supported,
	 * including those supported in Javascript via UTF-16. Currently, this method 
	 * supports the following range names:
	 * 
	 * <ul>
	 * <li><i>ascii</i> - basic ASCII
	 * <li><i>latin</i> - Latin, Latin Extended Additional, Latin Extended-C, Latin Extended-D
	 * <li><i>armenian</i>
	 * <li><i>greek</i> - Greek, Greek Extended
	 * <li><i>cyrillic</i> - Cyrillic, Cyrillic Extended-A, Cyrillic Extended-B
	 * <li><i>georgian</i> - Georgian, Georgian Supplement
	 * <li><i>glagolitic</i>
	 * <li><i>gothic</i>
	 * <li><i>ogham</i>
	 * <li><i>oldpersian</i>
	 * <li><i>runic</i>
	 * <li><i>ipa</i> - IPA, Phonetic Extensions, Phonetic Extensions Supplement
	 * <li><i>phonetic</i>
	 * <li><i>modifiertone</i> - Modifier Tone Letters
	 * <li><i>spacing</i>
	 * <li><i>diacritics</i>
	 * <li><i>halfmarks</i> - Combining Half Marks
	 * <li><i>small</i> - Small Form Variants
	 * <li><i>bamum</i> - Bamum, Bamum Supplement
	 * <li><i>ethiopic</i> - Ethiopic, Ethiopic Extended, Ethiopic Extended-A
	 * <li><i>nko</i>
	 * <li><i>osmanya</i>
	 * <li><i>tifinagh</i>
	 * <li><i>val</i>
	 * <li><i>arabic</i> - Arabic, Arabic Supplement, Arabic Presentation Forms-A, 
	 * Arabic Presentation Forms-B
	 * <li><i>carlan</i>
	 * <li><i>hebrew</i>
	 * <li><i>mandaic</i>
	 * <li><i>samaritan</i>
	 * <li><i>syriac</i>
	 * <li><i>mongolian</i>
	 * <li><i>phagspa</i>
	 * <li><i>tibetan</i>
	 * <li><i>bengali</i>
	 * <li><i>devanagari</i> - Devanagari, Devanagari Extended
	 * <li><i>gujarati</i>
	 * <li><i>gurmukhi</i>
	 * <li><i>kannada</i>
	 * <li><i>lepcha</i>
	 * <li><i>limbu</i>
	 * <li><i>malayalam</i>
	 * <li><i>meetaimayek</i>
	 * <li><i>olchiki</i>
	 * <li><i>oriya</i>
	 * <li><i>saurashtra</i>
	 * <li><i>sinhala</i>
	 * <li><i>sylotinagri</i> - Syloti Nagri
	 * <li><i>tamil</i>
	 * <li><i>telugu</i>
	 * <li><i>thaana</i>
	 * <li><i>vedic</i>
	 * <li><i>batak</i>
	 * <li><i>balinese</i>
	 * <li><i>buginese</i>
	 * <li><i>cham</i>
	 * <li><i>javanese</i>
	 * <li><i>kayahli</i>
	 * <li><i>khmer</i>
	 * <li><i>lao</i>
	 * <li><i>myanmar</i> - Myanmar, Myanmar Extended-A
	 * <li><i>newtailue</i>
	 * <li><i>rejang</i>
	 * <li><i>sundanese</i>
	 * <li><i>taile</i>
	 * <li><i>taitham</i>
	 * <li><i>taiviet</i>
	 * <li><i>thai</i>
	 * <li><i>buhld</i>
	 * <li><i>hanunoo</i>
	 * <li><i>tagalog</i>
	 * <li><i>tagbanwa</i>
	 * <li><i>bopomofo</i> - Bopomofo, Bopomofo Extended
	 * <li><i>cjk</i> - the CJK unified ideographs (Han), CJK Unified Ideographs
	 *  Extension A, CJK Unified Ideographs Extension B, CJK Unified Ideographs 
	 *  Extension C, CJK Unified Ideographs Extension D, Ideographic Description 
	 *  Characters (=isIdeo())
	 * <li><i>cjkcompatibility</i> - CJK Compatibility, CJK Compatibility 
	 * Ideographs, CJK Compatibility Forms, CJK Compatibility Ideographs Supplement
	 * <li><i>cjkradicals</i> - the CJK radicals, KangXi radicals
	 * <li><i>hangul</i> - Hangul Jamo, Hangul Syllables, Hangul Jamo Extended-A, 
	 * Hangul Jamo Extended-B, Hangul Compatibility Jamo
	 * <li><i>cjkpunct</i> - CJK symbols and punctuation
	 * <li><i>cjkstrokes</i> - CJK strokes
	 * <li><i>hiragana</i>
	 * <li><i>katakana</i> - Katakana, Katakana Phonetic Extensions, Kana Supplement
	 * <li><i>kanbun</i>
	 * <li><i>lisu</i>
	 * <li><i>yi</i> - Yi Syllables, Yi Radicals
	 * <li><i>cherokee</i>
	 * <li><i>canadian</i> - Unified Canadian Aboriginal Syllabics, Unified Canadian 
	 * Aboriginal Syllabics Extended
	 * <li><i>presentation</i> - Alphabetic presentation forms
	 * <li><i>vertical</i> - Vertical Forms
	 * <li><i>width</i> - Halfwidth and Fullwidth Forms
	 * <li><i>punctuation</i> - General punctuation, Supplemental Punctuation
	 * <li><i>box</i> - Box Drawing
	 * <li><i>block</i> - Block Elements
	 * <li><i>letterlike</i> - Letterlike symbols
	 * <li><i>mathematical</i> - Mathematical alphanumeric symbols, Miscellaneous 
	 * Mathematical Symbols-A, Miscellaneous Mathematical Symbols-B
	 * <li><i>enclosedalpha</i> - Enclosed alphanumerics, Enclosed Alphanumeric Supplement
	 * <li><i>enclosedcjk</i> - Enclosed CJK letters and months, Enclosed Ideographic Supplement
	 * <li><i>cjkcompatibility</i> - CJK compatibility
	 * <li><i>apl</i> - APL symbols
	 * <li><i>controlpictures</i> - Control pictures
	 * <li><i>misc</i> - Miscellaneous technical
	 * <li><i>ocr</i> - Optical character recognition (OCR)
	 * <li><i>combining</i> - Combining Diacritical Marks, Combining Diacritical Marks 
	 * for Symbols, Combining Diacritical Marks Supplement
	 * <li><i>digits</i> - ASCII digits (=isDigit())
	 * <li><i>indicnumber</i> - Common Indic Number Forms
	 * <li><i>numbers</i> - Number dorms
	 * <li><i>supersub</i> - Super- and subscripts
	 * <li><i>arrows</i> - Arrows, Miscellaneous Symbols and Arrows, Supplemental Arrows-A,
	 * Supplemental Arrows-B
	 * <li><i>operators</i> - Mathematical operators, supplemental 
	 * mathematical operators 
	 * <li><i>geometric</i> - Geometric shapes
	 * <li><i>ancient</i> - Ancient symbols
	 * <li><i>braille</i> - Braille patterns
	 * <li><i>currency</i> - Currency symbols
	 * <li><i>dingbats</i>
	 * <li><i>gamesymbols</i>
	 * <li><i>yijing</i> - Yijing Hexagram Symbols
	 * <li><i>specials</i>
	 * <li><i>variations</i> - Variation Selectors, Variation Selectors Supplement
	 * <li><i>privateuse</i> - Private Use Area, Supplementary Private Use Area-A, 
	 * Supplementary Private Use Area-B
	 * <li><i>supplementarya</i> - Supplementary private use area-A
	 * <li><i>supplementaryb</i> - Supplementary private use area-B
	 * <li><i>highsurrogates</i> - High Surrogates, High Private Use Surrogates
	 * <li><i>lowsurrogates</i>
	 * <li><i>reserved</i>
	 * <li><i>noncharacters</i>
	 * </ul><p>
	 * 
	 * Depends directive: !depends ctype.js
	 * 
	 * @param {string|ilib.String|number} ch character or code point to examine
	 * @param {string} rangeName the name of the range to check
	 * @return {boolean} true if the first character is within the named
	 * range
	 */
	withinRange: function(ch, rangeName) {
		if (!rangeName) {
			return false;
		}
		var num;
		switch (typeof(ch)) {
			case 'number':
				num = ch;
				break;
			case 'string':
				num = ilib.String.toCodePoint(ch, 0);
				break;
			case 'undefined':
				return false;
			default:
				num = ch._toCodePoint(0);
				break;
		}

		return ilib.CType._inRange(num, rangeName.toLowerCase(), ilib.data.ctype);
	},
	
	/**
	 * @protected
	 * @param {boolean} sync
	 * @param {Object} loadParams
	 * @param {function(*)|undefined} onLoad
	 */
	_init: function(sync, loadParams, onLoad) {
		ilib.CType._load("ctype", sync, loadParams, onLoad);
	},
	
	/**
	 * @protected
	 * @param {string} name
	 * @param {boolean} sync
	 * @param {Object} loadParams
	 * @param {function(*)|undefined} onLoad
	 */
	_load: function (name, sync, loadParams, onLoad) {
		if (!ilib.data[name]) {
			var loadName = name ? name + ".json" : "ctype.json";
			ilib.loadData({
				name: loadName,
				locale: "-",
				nonlocale: true,
				sync: sync,
				loadParams: loadParams, 
				callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(ct) {
					ilib.data[name] = ct;
					if (onLoad && typeof(onLoad) === 'function') {
						onLoad(ilib.data[name]);
					}
				})
			});
		} else {
			if (onLoad && typeof(onLoad) === 'function') {
				onLoad(ilib.data[name]);
			}
		}
	}
};

/*
 * ctype.isdigit.js - Character type is digit
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is a digit character in the
 * Latin script.<p>
 * 
 * Depends directive: !depends ctype.isdigit.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is a digit character in the
 * Latin script. 
 */
ilib.CType.isDigit = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return ilib.CType._inRange(num, 'digit', ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isDigit._init = function (sync, loadParams, onLoad) {
	ilib.CType._init(sync, loadParams, onLoad);
};

ilib.data.ctype_z = {"Zs":[[32],[160],[5760],[6158],[8192,8202],[8239],[8287],[12288]],"Zl":[[8232]],"Zp":[[8233]]};
/*
 * ctype.isspace.js - Character type is space char
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype ctype_z

/**
 * Return whether or not the first character is a whitespace character.<p>
 * 
 * Depends directive: !depends ctype.isspace.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is a whitespace character.
 */
ilib.CType.isSpace = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, 'space', ilib.data.ctype) ||
		ilib.CType._inRange(num, 'Zs', ilib.data.ctype_z) ||
		ilib.CType._inRange(num, 'Zl', ilib.data.ctype_z) ||
		ilib.CType._inRange(num, 'Zp', ilib.data.ctype_z);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isSpace._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("ctype_z", sync, loadParams, function () {
		ilib.CType._init(sync, loadParams, onLoad);
	});
};

/*
 * numprs.js - Parse a number in any locale
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
strings.js 
ctype.isdigit.js 
ctype.isspace.js
*/

/**
 * @class
 * Parse a string as a number, ignoring all locale-specific formatting.<p>
 * 
 * This class is different from the standard Javascript parseInt() and parseFloat() 
 * functions in that the number to be parsed can have formatting characters in it 
 * that are not supported by those two
 * functions, and it handles numbers written in other locales properly. For example, 
 * if you pass the string "203,231.23" to the parseFloat() function in Javascript, it 
 * will return you the number 203. The ilib.Number class will parse it correctly and 
 * the value() function will return the number 203231.23. If you pass parseFloat() the 
 * string "203.231,23" with the locale set to de-DE, it will return you 203 again. This
 * class will return the correct number 203231.23 again.<p>
 * 
 * The options object may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - specify the locale of the string to parse. This is used to
 * figure out what the decimal point character is. If not specified, the default locale
 * for the app or browser is used.
 * <li><i>type</i> - specify whether this string should be interpretted as a number,
 * currency, or percentage amount. When the number is interpretted as a currency
 * amount, the getCurrency() method will return something useful, otherwise it will
 * return undefined. If
 * the number is to be interpretted as percentage amount and there is a percentage sign
 * in the string, then the number will be returned
 * as a fraction from the valueOf() method. If there is no percentage sign, then the 
 * number will be returned as a regular number. That is "58.3%" will be returned as the 
 * number 0.583 but "58.3" will be returned as 58.3. Valid values for this property 
 * are "number", "currency", and "percentage". Default if this is not specified is
 * "number".
 * <li><i>onLoad</i> - a callback function to call when the locale data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * <p>
 * 
 * Depends directive: !depends numprs.js
 * 
 * @constructor
 * @param {string|number|Number|ilib.Number|undefined} str a string to parse as a number, or a number value
 * @param {Object=} options Options controlling how the instance should be created 
 */
ilib.Number = function (str, options) {
	var i, stripped = "", 
		sync = true,
		loadParams,
		onLoad;
	
	this.locale = new ilib.Locale();
	this.type = "number";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		if (options.type) {
			switch (options.type) {
				case "number":
				case "currency":
				case "percentage":
					this.type = options.type;
					break;
				default:
					break;
			}
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		loadParams = options.loadParams;
		onLoad = options.onLoad;
	}
	
	ilib.CType.isDigit._init(sync, loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
		ilib.CType.isSpace._init(sync, loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
			new ilib.LocaleInfo(this.locale, {
				sync: sync,
				onLoad: ilib.bind(this, function (li) {
					this.decimal = li.getDecimalSeparator();
					
					switch (typeof(str)) {
					case 'string':
						// stripping should work for all locales, because you just ignore all the
						// formatting except the decimal char
						var unary = true; // looking for the unary minus still?
						this.str = str || "0";
						i = 0;
						for (i = 0; i < this.str.length; i++) {
							if (unary && this.str.charAt(i) === '-') {
								unary = false;
								stripped += this.str.charAt(i);
							} else if (ilib.CType.isDigit(this.str.charAt(i))) {
								stripped += this.str.charAt(i);
								unary = false;
							} else if (this.str.charAt(i) === this.decimal) {
								stripped += "."; // always convert to period
								unary = false;
							} // else ignore
						}
						this.value = parseFloat(stripped);
						break;
					case 'number':
						this.str = "" + str;
						this.value = str;
						break;
						
					case 'object':
						this.value = /** @type {number} */ str.valueOf();
						this.str = "" + this.value;
						break;
						
					case 'undefined':
						this.value = 0;
						this.str = "0";
						break;
					}
					
					switch (this.type) {
						default:
							// don't need to do anything special for other types
							break;
						case "percentage":
							if (this.str.indexOf(li.getPercentageSymbol()) !== -1) {
								this.value /= 100;
							}
							break;
						case "currency":
							stripped = "";
							i = 0;
							while (i < this.str.length &&
								   !ilib.CType.isDigit(this.str.charAt(i)) &&
								   !ilib.CType.isSpace(this.str.charAt(i))) {
								stripped += this.str.charAt(i++);
							}
							if (stripped.length === 0) {
								while (i < this.str.length && 
									   ilib.CType.isDigit(this.str.charAt(i)) ||
									   ilib.CType.isSpace(this.str.charAt(i)) ||
									   this.str.charAt(i) === '.' ||
									   this.str.charAt(i) === ',' ) {
									i++;
								}
								while (i < this.str.length && 
									   !ilib.CType.isDigit(this.str.charAt(i)) &&
									   !ilib.CType.isSpace(this.str.charAt(i))) {
									stripped += this.str.charAt(i++);
								}
							}
							new ilib.Currency({
								locale: this.locale, 
								sign: stripped,
								sync: sync,
								onLoad: ilib.bind(this, function (cur) {
									this.currency = cur;
									if (options && typeof(options.onLoad) === 'function') {
										options.onLoad(this);
									}				
								})
							});
							return;
					}
					
					if (options && typeof(options.onLoad) === 'function') {
						options.onLoad(this);
					}
				})
			});
		}));
	}));
};

ilib.Number.prototype = {
	/**
	 * Return the locale for this formatter instance.
	 * @return {ilib.Locale} the locale instance for this formatter
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the original string that this number instance was created with.
	 * @return {string} the original string
	 */
	toString: function () {
		return this.str;
	},
	
	/**
	 * If the type of this Number instance is "currency", then the parser will attempt
	 * to figure out which currency this amount represents. The amount can be written
	 * with any of the currency signs or ISO 4217 codes that are currently
	 * recognized by ilib, and the currency signs may occur before or after the
	 * numeric portion of the string. If no currency can be recognized, then the 
	 * default currency for the locale is returned. If multiple currencies can be
	 * recognized (for example if the currency sign is "$"), then this method 
	 * will prefer the one for the current locale. If multiple currencies can be
	 * recognized, but none are used in the current locale, then the first currency
	 * encountered will be used. This may produce random results, though the larger
	 * currencies occur earlier in the list. For example, if the sign found in the
	 * string is "$" and that is not the sign of the currency of the current locale
	 * then the US dollar will be recognized, as it is the largest currency that uses
	 * the "$" as its sign.
	 * 
	 * @return {ilib.Currency|undefined} the currency instance for this amount, or 
	 * undefined if this Number object is not of type currency
	 */
	getCurrency: function () {
		return this.currency;
	},
	
	/**
	 * Return the value of this number object as a primitive number instance.
	 * @return {number} the value of this number instance
	 */
	valueOf: function () {
		return this.value;
	}
};

ilib.data.currency = {"USD":{"name":"US Dollar","decimals":2,"sign":"$"},"CHF":{"name":"Swiss Franc","decimals":2,"sign":"Fr"},"RON":{"name":"Leu","decimals":2,"sign":"L"},"RUB":{"name":"Russian Ruble","decimals":2,"sign":"руб."},"SEK":{"name":"Swedish Krona","decimals":2,"sign":"kr"},"GBP":{"name":"Pound Sterling","decimals":2,"sign":"£"},"PKR":{"name":"Pakistan Rupee","decimals":2,"sign":"₨"},"KES":{"name":"Kenyan Shilling","decimals":2,"sign":"Sh"},"AED":{"name":"UAE Dirham","decimals":2,"sign":"د.إ"},"KRW":{"name":"Won","decimals":0,"sign":"₩"},"AFN":{"name":"Afghani","decimals":2,"sign":"؋"},"ALL":{"name":"Lek","decimals":2,"sign":"L"},"AMD":{"name":"Armenian Dram","decimals":2,"sign":"դր."},"ANG":{"name":"Netherlands Antillean Guilder","decimals":2,"sign":"ƒ"},"AOA":{"name":"Kwanza","decimals":2,"sign":"Kz"},"ARS":{"name":"Argentine Peso","decimals":2,"sign":"$"},"AUD":{"name":"Australian Dollar","decimals":2,"sign":"$"},"AWG":{"name":"Aruban Florin","decimals":2,"sign":"ƒ"},"AZN":{"name":"Azerbaijanian Manat","decimals":2,"sign":"AZN"},"BAM":{"name":"Convertible Mark","decimals":2,"sign":"КМ"},"BBD":{"name":"Barbados Dollar","decimals":2,"sign":"$"},"BDT":{"name":"Taka","decimals":2,"sign":"৳"},"BGN":{"name":"Bulgarian Lev","decimals":2,"sign":"лв"},"BHD":{"name":"Bahraini Dinar","decimals":3,"sign":".د.ب"},"BIF":{"name":"Burundi Franc","decimals":0,"sign":"Fr"},"BMD":{"name":"Bermudian Dollar","decimals":2,"sign":"$"},"BND":{"name":"Brunei Dollar","decimals":2,"sign":"$"},"BOB":{"name":"Boliviano","decimals":2,"sign":"Bs."},"BRL":{"name":"Brazilian Real","decimals":2,"sign":"R$"},"BSD":{"name":"Bahamian Dollar","decimals":2,"sign":"$"},"BTN":{"name":"Ngultrum","decimals":2,"sign":"Nu."},"BWP":{"name":"Pula","decimals":2,"sign":"P"},"BYR":{"name":"Belarussian Ruble","decimals":0,"sign":"Br"},"BZD":{"name":"Belize Dollar","decimals":2,"sign":"$"},"CAD":{"name":"Canadian Dollar","decimals":2,"sign":"$"},"CDF":{"name":"Congolese Franc","decimals":2,"sign":"Fr"},"CLP":{"name":"Chilean Peso","decimals":0,"sign":"$"},"CNY":{"name":"Yuan Renminbi","decimals":2,"sign":"元"},"COP":{"name":"Colombian Peso","decimals":2,"sign":"$"},"CRC":{"name":"Costa Rican Colon","decimals":2,"sign":"₡"},"CUP":{"name":"Cuban Peso","decimals":2,"sign":"$"},"CVE":{"name":"Cape Verde Escudo","decimals":2,"sign":"$"},"CZK":{"name":"Czech Koruna","decimals":2,"sign":"Kč"},"DJF":{"name":"Djibouti Franc","decimals":0,"sign":"Fr"},"DKK":{"name":"Danish Krone","decimals":2,"sign":"kr"},"DOP":{"name":"Dominican Peso","decimals":2,"sign":"$"},"DZD":{"name":"Algerian Dinar","decimals":2,"sign":"د.ج"},"EGP":{"name":"Egyptian Pound","decimals":2,"sign":"£"},"ERN":{"name":"Nakfa","decimals":2,"sign":"Nfk"},"ETB":{"name":"Ethiopian Birr","decimals":2,"sign":"Br"},"EUR":{"name":"Euro","decimals":2,"sign":"€"},"FJD":{"name":"Fiji Dollar","decimals":2,"sign":"$"},"FKP":{"name":"Falkland Islands Pound","decimals":2,"sign":"£"},"GEL":{"name":"Lari","decimals":2,"sign":"ლ"},"GHS":{"name":"Cedi","decimals":2,"sign":"₵"},"GIP":{"name":"Gibraltar Pound","decimals":2,"sign":"£"},"GMD":{"name":"Dalasi","decimals":2,"sign":"D"},"GNF":{"name":"Guinea Franc","decimals":0,"sign":"Fr"},"GTQ":{"name":"Quetzal","decimals":2,"sign":"Q"},"GYD":{"name":"Guyana Dollar","decimals":2,"sign":"$"},"HKD":{"name":"Hong Kong Dollar","decimals":2,"sign":"$"},"HNL":{"name":"Lempira","decimals":2,"sign":"L"},"HRK":{"name":"Croatian Kuna","decimals":2,"sign":"kn"},"HTG":{"name":"Gourde","decimals":2,"sign":"G"},"HUF":{"name":"Forint","decimals":2,"sign":"Ft"},"IDR":{"name":"Rupiah","decimals":2,"sign":"Rp"},"ILS":{"name":"New Israeli Sheqel","decimals":2,"sign":"₪"},"INR":{"name":"Indian Rupee","decimals":2,"sign":"₹"},"IQD":{"name":"Iraqi Dinar","decimals":3,"sign":"ع.د"},"IRR":{"name":"Iranian Rial","decimals":2,"sign":"﷼"},"ISK":{"name":"Iceland Krona","decimals":0,"sign":"kr"},"JMD":{"name":"Jamaican Dollar","decimals":2,"sign":"$"},"JOD":{"name":"Jordanian Dinar","decimals":3,"sign":"د.ا"},"JPY":{"name":"Yen","decimals":0,"sign":"¥"},"KGS":{"name":"Som","decimals":2,"sign":"лв"},"KHR":{"name":"Riel","decimals":2,"sign":"៛"},"KMF":{"name":"Comoro Franc","decimals":0,"sign":"Fr"},"KPW":{"name":"North Korean Won","decimals":2,"sign":"₩"},"KWD":{"name":"Kuwaiti Dinar","decimals":3,"sign":"د.ك"},"KYD":{"name":"Cayman Islands Dollar","decimals":2,"sign":"$"},"KZT":{"name":"Tenge","decimals":2,"sign":"₸"},"LAK":{"name":"Kip","decimals":2,"sign":"₭"},"LBP":{"name":"Lebanese Pound","decimals":2,"sign":"ل.ل"},"LKR":{"name":"Sri Lanka Rupee","decimals":2,"sign":"Rs"},"LRD":{"name":"Liberian Dollar","decimals":2,"sign":"$"},"LSL":{"name":"Loti","decimals":2,"sign":"L"},"LTL":{"name":"Lithuanian Litas","decimals":2,"sign":"Lt"},"LVL":{"name":"Latvian Lats","decimals":2,"sign":"Ls"},"LYD":{"name":"Libyan Dinar","decimals":3,"sign":"ل.د"},"MAD":{"name":"Moroccan Dirham","decimals":2,"sign":"د.م."},"MDL":{"name":"Moldovan Leu","decimals":2,"sign":"L"},"MGA":{"name":"Malagasy Ariary","decimals":2,"sign":"Ar"},"MKD":{"name":"Denar","decimals":2,"sign":"ден"},"MMK":{"name":"Kyat","decimals":2,"sign":"K"},"MNT":{"name":"Tugrik","decimals":2,"sign":"₮"},"MOP":{"name":"Pataca","decimals":2,"sign":"P"},"MRO":{"name":"Ouguiya","decimals":2,"sign":"UM"},"MUR":{"name":"Mauritius Rupee","decimals":2,"sign":"₨"},"MVR":{"name":"Rufiyaa","decimals":2,"sign":".ރ"},"MWK":{"name":"Kwacha","decimals":2,"sign":"MK"},"MXN":{"name":"Mexican Peso","decimals":2,"sign":"$"},"MYR":{"name":"Malaysian Ringgit","decimals":2,"sign":"RM"},"MZN":{"name":"Metical","decimals":2,"sign":"MT"},"NAD":{"name":"Namibia Dollar","decimals":2,"sign":"$"},"NGN":{"name":"Naira","decimals":2,"sign":"₦"},"NIO":{"name":"Cordoba Oro","decimals":2,"sign":"C$"},"NOK":{"name":"Norwegian Krone","decimals":2,"sign":"kr"},"NPR":{"name":"Nepalese Rupee","decimals":2,"sign":"₨"},"NZD":{"name":"New Zealand Dollar","decimals":2,"sign":"$"},"OMR":{"name":"Rial Omani","decimals":3,"sign":"ر.ع."},"PAB":{"name":"Balboa","decimals":2,"sign":"B/."},"PEN":{"name":"Nuevo Sol","decimals":2,"sign":"S/."},"PGK":{"name":"Kina","decimals":2,"sign":"K"},"PHP":{"name":"Philippine Peso","decimals":2,"sign":"₱"},"PLN":{"name":"Zloty","decimals":2,"sign":"zł"},"PYG":{"name":"Guarani","decimals":0,"sign":"₲"},"QAR":{"name":"Qatari Rial","decimals":2,"sign":"ر.ق"},"RSD":{"name":"Serbian Dinar","decimals":2,"sign":"дин."},"RWF":{"name":"Rwanda Franc","decimals":0,"sign":"Fr"},"SAR":{"name":"Saudi Riyal","decimals":2,"sign":"ر.س"},"SBD":{"name":"Solomon Islands Dollar","decimals":2,"sign":"$"},"SCR":{"name":"Seychelles Rupee","decimals":2,"sign":"₨"},"SDG":{"name":"Sudanese Pound","decimals":2,"sign":"£"},"SGD":{"name":"Singapore Dollar","decimals":2,"sign":"$"},"SHP":{"name":"Saint Helena Pound","decimals":2,"sign":"£"},"SLL":{"name":"Leone","decimals":2,"sign":"Le"},"SOS":{"name":"Somali Shilling","decimals":2,"sign":"Sh"},"SRD":{"name":"Surinam Dollar","decimals":2,"sign":"$"},"SSP":{"name":"South Sudanese Pound","decimals":2,"sign":""},"STD":{"name":"Dobra","decimals":2,"sign":"Db"},"SYP":{"name":"Syrian Pound","decimals":2,"sign":"£"},"SZL":{"name":"Lilangeni","decimals":2,"sign":"L"},"THB":{"name":"Baht","decimals":2,"sign":"฿"},"TJS":{"name":"Somoni","decimals":2,"sign":"ЅМ"},"TMT":{"name":"New Manat","decimals":2,"sign":"m"},"TND":{"name":"Tunisian Dinar","decimals":3,"sign":"د.ت"},"TOP":{"name":"Pa’anga","decimals":2,"sign":"T$"},"TRY":{"name":"Turkish Lira","decimals":2,"sign":"TL"},"TTD":{"name":"Trinidad and Tobago Dollar","decimals":2,"sign":"$"},"TWD":{"name":"New Taiwan Dollar","decimals":2,"sign":"$"},"TZS":{"name":"Tanzanian Shilling","decimals":2,"sign":"Sh"},"UAH":{"name":"Hryvnia","decimals":2,"sign":"₴"},"UGX":{"name":"Uganda Shilling","decimals":2,"sign":"Sh"},"UYU":{"name":"Peso Uruguayo","decimals":2,"sign":"$"},"UZS":{"name":"Uzbekistan Sum","decimals":2,"sign":"лв"},"VEF":{"name":"Bolivar Fuerte","decimals":2,"sign":"Bs F"},"VND":{"name":"Dong","decimals":0,"sign":"₫"},"VUV":{"name":"Vatu","decimals":0,"sign":"Vt"},"WST":{"name":"Tala","decimals":2,"sign":"T"},"XAF":{"name":"CFA Franc BEAC","decimals":0,"sign":"Fr"},"XCD":{"name":"East Caribbean Dollar","decimals":2,"sign":"$"},"XOF":{"name":"CFA Franc BCEAO","decimals":0,"sign":"Fr"},"XPF":{"name":"CFP Franc","decimals":0,"sign":"Fr"},"YER":{"name":"Yemeni Rial","decimals":2,"sign":"﷼"},"ZAR":{"name":"Rand","decimals":2,"sign":"R"},"ZMK":{"name":"Zambian Kwacha","decimals":2,"sign":"ZK"},"ZWL":{"name":"Zimbabwe Dollar","decimals":2,"sign":"$"}};
/*
 * currency.js - Currency definition
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js

// !data currency

/**
 * @class
 * Create a new currency information instance. Instances of this class encode 
 * information about a particular currency.<p>
 * 
 * Note: that if you are looking to format currency for display, please see
 * the number formatting class {ilib.NumFmt}. This class only gives information
 * about currencies.<p> 
 * 
 * The options can contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - specify the locale for this instance
 * <li><i>code</i> - find info on a specific currency with the given ISO 4217 code 
 * <li><i>sign</i> - search for a currency that uses this sign
 * <li><i>onLoad</i> - a callback function to call when the currency data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * When searching for a currency by its sign, this class cannot guarantee 
 * that it will return info about a specific currency. The reason is that currency 
 * signs are sometimes shared between different currencies and the sign is 
 * therefore ambiguous. If you need a 
 * guarantee, find the currency using the code instead.<p>
 * 
 * The way this class finds a currency by sign is the following. If the sign is 
 * unambiguous, then
 * the currency is returned. If there are multiple currencies that use the same
 * sign, and the current locale uses that sign, then the default currency for
 * the current locale is returned. If there are multiple, but the current locale
 * does not use that sign, then the currency with the largest circulation is
 * returned. For example, if you are in the en-GB locale, and the sign is "$",
 * then this class will notice that there are multiple currencies with that
 * sign (USD, CAD, AUD, HKD, MXP, etc.) Since "$" is not used in en-GB, it will 
 * pick the one with the largest circulation, which in this case is the US Dollar
 * (USD).<p>
 * 
 * If neither the code or sign property is set, the currency that is most common 
 * for the locale
 * will be used instead. If the locale is not set, the default locale will be used.
 * If the code is given, but it is not found in the list of known currencies, this
 * constructor will throw an exception. If the sign is given, but it is not found,
 * this constructor will default to the currency for the current locale. If both
 * the code and sign properties are given, then the sign property will be ignored
 * and only the code property used. If the locale is given, but it is not a known
 * locale, this class will default to the default locale instead.<p>
 * 
 * Depends directive: !depends currency.js
 * 
 * @constructor
 * @param options {Object} a set of properties to govern how this instance is constructed.
 * @throws "currency xxx is unknown" when the given currency code is not in the list of 
 * known currencies. xxx is replaced with the requested code.
 */
ilib.Currency = function (options) {
	this.sync = true;
	
	if (options) {
		if (options.code) {
			this.code = options.code;
		}
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		if (options.sign) {
			this.sign = options.sign;
		}
		if (typeof(options.sync) !== 'undefined') {
			this.sync = options.sync;
		}
		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}
	}
	
	this.locale = this.locale || new ilib.Locale();
	if (typeof(ilib.data.currency) === 'undefined') {
		ilib.loadData({
			name: "currency.json",
			object: ilib.Currency, 
			locale: "-",
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(currency) {
				ilib.data.currency = currency;
				this._loadLocinfo(options && options.onLoad);
			})
		});
	} else {
		this._loadLocinfo(options && options.onLoad);
	}
};

/**
 * Return an array of the ids for all ISO 4217 currencies that
 * this copy of ilib knows about.
 * 
 * @static
 * @return {Array.<string>} an array of currency ids that this copy of ilib knows about.
 */
ilib.Currency.getAvailableCurrencies = function() {
	var ret = [],
		cur,
		currencies = new ilib.ResBundle({
			name: "currency"
		}).getResObj();
	
	for (cur in currencies) {
		if (cur && currencies[cur]) {
			ret.push(cur);
		}
	}
	
	return ret;
};

ilib.Currency.prototype = {
	/**
	 * @private
	 */
	_loadLocinfo: function(onLoad) {
		new ilib.LocaleInfo(this.locale, {
			onLoad: ilib.bind(this, function (li) {
				var currInfo;
				
				this.locinfo = li;
		    	if (this.code) {
		    		currInfo = ilib.data.currency[this.code];
		    		if (!currInfo) {
		    			throw "currency " + this.code + " is unknown";
		    		}
		    	} else if (this.sign) {
		    		currInfo = ilib.data.currency[this.sign]; // maybe it is really a code...
		    		if (typeof(currInfo) !== 'undefined') {
		    			this.code = this.sign;
		    		} else {
		    			this.code = this.locinfo.getCurrency();
		    			currInfo = ilib.data.currency[this.code];
		    			if (currInfo.sign !== this.sign) {
		    				// current locale does not use the sign, so search for it
		    				for (var cur in ilib.data.currency) {
		    					if (cur && ilib.data.currency[cur]) {
		    						currInfo = ilib.data.currency[cur];
		    						if (currInfo.sign === this.sign) {
		    							// currency data is already ordered so that the currency with the
		    							// largest circulation is at the beginning, so all we have to do
		    							// is take the first one in the list that matches
		    							this.code = cur;
		    							break;
		    						}
		    					}
		    				}
		    			}
		    		}
		    	}
		    	
		    	if (!currInfo || !this.code) {
		    		this.code = this.locinfo.getCurrency();
		    		currInfo = ilib.data.currency[this.code];
		    	}
		    	
		    	this.name = currInfo.name;
		    	this.fractionDigits = currInfo.decimals;
		    	this.sign = currInfo.sign;
		    	
				if (typeof(onLoad) === 'function') {
					onLoad(this);
				}
			})
		});
	},
	
	/**
	 * Return the ISO 4217 currency code for this instance.
	 * @return {string} the ISO 4217 currency code for this instance
	 */
	getCode: function () {
		return this.code;
	},
	
	/**
	 * Return the default number of fraction digits that is typically used
	 * with this type of currency.
	 * @return {number} the number of fraction digits for this currency
	 */
	getFractionDigits: function () {
		return this.fractionDigits;
	},
	
	/**
	 * Return the sign commonly used to represent this currency.
	 * @return {string} the sign commonly used to represent this currency
	 */
	getSign: function () {
		return this.sign;
	},
	
	/**
	 * Return the name of the currency in English.
	 * @return {string} the name of the currency in English
	 */
	getName: function () {
		return this.name;
	},
	
	/**
	 * Return the locale for this currency. If the options to the constructor 
	 * included a locale property in order to find the currency that is appropriate
	 * for that locale, then the locale is returned here. If the options did not
	 * include a locale, then this method returns undefined.
	 * @return {ilib.Locale} the locale used in the constructor of this instance,
	 * or undefined if no locale was given in the constructor
	 */
	getLocale: function () {
		return this.locale;
	}
};

/*
 * numfmt.js - Number formatter definition
 *
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js strings.js currency.js
/*
!depends 
ilibglobal.js 
locale.js
localeinfo.js
util/utils.js
util/math.js
currency.js
strings.js
util/jsutils.js
*/

// !data localeinfo currency

/**
 * @class
 * Create a new number formatter instance. Locales differ in the way that digits
 * in a formatted number are grouped, in the way the decimal character is represented,
 * etc. Use this formatter to get it right for any locale.<p>
 *
 * This formatter can format plain numbers, currency amounts, and percentage amounts.<p>
 *
 * As with all formatters, the recommended
 * practice is to create one formatter and use it multiple times to format various
 * numbers.<p>
 *
 * The options can contain any of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - use the conventions of the specified locale when figuring out how to
 * format a number.
 * <li><i>type</i> - the type of this formatter. Valid values are "number", "currency", or
 * "percentage". If this property is not specified, the default is "number".
 * <li><i>currency</i> - the ISO 4217 3-letter currency code to use when the formatter type
 * is "currency". This property is required for currency formatting. If the type property
 * is "currency" and the currency property is not specified, the constructor will throw a
 * an exception.
 * <li><i>maxFractionDigits</i> - the maximum number of digits that should appear in the
 * formatted output after the decimal. A value of -1 means unlimited, and 0 means only print
 * the integral part of the number.
 * <li><i>minFractionDigits</i> - the minimum number of fractional digits that should
 * appear in the formatted output. If the number does not have enough fractional digits
 * to reach this minimum, the number will be zero-padded at the end to get to the limit.
 * If the type of the formatter is "currency" and this
 * property is not specified, then the minimum fraction digits is set to the normal number
 * of digits used with that currency, which is almost always 0, 2, or 3 digits.
 * <li><i>useNative</i> - the flag used to determaine whether to use the native script settings
 * for formatting the numbers .
 * <li><i>roundingMode</i> - When the maxFractionDigits or maxIntegerDigits is specified,
 * this property governs how the least significant digits are rounded to conform to that
 * maximum. The value of this property is a string with one of the following values:
 * <ul>
 *   <li><i>up</i> - round away from zero
 *   <li><i>down</i> - round towards zero. This has the effect of truncating the number
 *   <li><i>ceiling</i> - round towards positive infinity
 *   <li><i>floor</i> - round towards negative infinity
 *   <li><i>halfup</i> - round towards nearest neighbour. If equidistant, round up.
 *   <li><i>halfdown</i> - round towards nearest neighbour. If equidistant, round down.
 *   <li><i>halfeven</i> - round towards nearest neighbour. If equidistant, round towards the even neighbour
 *   <li><i>halfodd</i> - round towards nearest neighbour. If equidistant, round towards the odd neighbour
 * </ul>
 * When the type of the formatter is "currency" and the <i>roundingMode</i> property is not
 * set, then the standard legal rounding rules for the locale are followed. If the type
 * is "number" or "percentage" and the <i>roundingMode</i> property is not set, then the
 * default mode is "halfdown".</i>.
 *
 * <li><i>style</i> - When the type of this formatter is "currency", the currency amount
 * can be formatted in the following styles: "common" and "iso". The common style is the
 * one commonly used in every day writing where the currency unit is represented using a
 * symbol. eg. "$57.35" for fifty-seven dollars and thirty five cents. The iso style is
 * the international style where the currency unit is represented using the ISO 4217 code.
 * eg. "USD 57.35" for the same amount. The default is "common" style if the style is
 * not specified.<p>
 *
 * When the type of this formatter is "number", the style can be one of the following:
 * <ul>
 *   <li><i>standard - format a fully specified floating point number properly for the locale
 *   <li><i>scientific</i> - use scientific notation for all numbers. That is, 1 integral 
 *   digit, followed by a number of fractional digits, followed by an "e" which denotes 
 *   exponentiation, followed digits which give the power of 10 in the exponent. 
 *   <li><i>native</i> - format a floating point number using the native digits and 
 *   formatting symbols for the script of the locale. 
 *   <li><i>nogrouping</i> - format a floating point number without grouping digits for
 *   the integral portion of the number
 * </ul>
 * Note that if you specify a maximum number
 * of integral digits, the formatter with a standard style will give you standard
 * formatting for smaller numbers and scientific notation for larger numbers. The default
 * is standard style if this is not specified.
 *
 * <li><i>onLoad</i> - a callback function to call when the format data is fully
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 *
 * <li>sync - tell whether to load any missing locale data synchronously or
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * <p>
 *
 * Depends directive: !depends numfmt.js
 *
 * @constructor
 * @param {Object.<string,*>} options A set of options that govern how the formatter will behave
 */
ilib.NumFmt = function (options) {
	var sync = true;
	this.locale = new ilib.Locale();
	/** 
	 * @private
	 * @type {string} 
	 */
	this.type = "number";
	var loadParams = undefined;

	if (options) {
		if (options.locale) {
			this.locale = (typeof (options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}

		if (options.type) {
			if (options.type === 'number' ||
				options.type === 'currency' ||
				options.type === 'percentage') {
				this.type = options.type;
			}
		}

		if (options.currency) {
			/** 
			 * @private 
			 * @type {string} 
			 */
			this.currency = options.currency;
		}

		if (typeof (options.maxFractionDigits) === 'number') {
			/** 
			 * @private 
			 * @type {number|undefined} 
			 */
			this.maxFractionDigits = this._toPrimitive(options.maxFractionDigits);
		}
		if (typeof (options.minFractionDigits) === 'number') {
			/** 
			 * @private 
			 * @type {number|undefined} 
			 */
			this.minFractionDigits = this._toPrimitive(options.minFractionDigits);
			// enforce the limits to avoid JS exceptions
			if (this.minFractionDigits < 0) {
				this.minFractionDigits = 0;
			}
			if (this.minFractionDigits > 20) {
				this.minFractionDigits = 20;
			}
		}
		if (options.style) {
			/** 
			 * @private 
			 * @type {string} 
			 */
			this.style = options.style;
		}
		if (typeof(options.useNative) === 'boolean') {
			/** 
			 * @private 
			 * @type {boolean} 
			 * */
			this.useNative = options.useNative;
		}
		/** 
		 * @private 
		 * @type {string} 
		 */
		this.roundingMode = options.roundingMode;

		if (typeof (options.sync) !== 'undefined') {
			/** @type {boolean} */
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
	}

	/** 
	 * @private 
	 * @type {ilib.LocaleInfo|undefined} 
	 */
	this.localeInfo = undefined;
	
	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		loadParams: loadParams,
		onLoad: ilib.bind(this, function (li) {
			/** 
			 * @private 
			 * @type {ilib.LocaleInfo|undefined} 
			 */
			this.localeInfo = li;

			if (this.type === "number") {
				this.templateNegative = new ilib.String(this.localeInfo.getNegativeNumberFormat() || "-{n}");
			} else if (this.type === "currency") {
				var templates;

				if (!this.currency || typeof (this.currency) != 'string') {
					throw "A currency property is required in the options to the number formatter constructor when the type property is set to currency.";
				}

				new ilib.Currency({
					locale: this.locale,
					code: this.currency,
					sync: sync,
					loadParams: loadParams,
					onLoad: ilib.bind(this, function (cur) {
						this.currencyInfo = cur;
						if (this.style !== "common" && this.style !== "iso") {
							this.style = "common";
						}
						
						if (typeof(this.maxFractionDigits) !== 'number' && typeof(this.minFractionDigits) !== 'number') {
							this.minFractionDigits = this.maxFractionDigits = this.currencyInfo.getFractionDigits();
						}

						templates = this.localeInfo.getCurrencyFormats();
						this.template = new ilib.String(templates[this.style] || templates.common);
						this.templateNegative = new ilib.String(templates[this.style + "Negative"] || templates["commonNegative"]);
						this.sign = (this.style === "iso") ? this.currencyInfo.getCode() : this.currencyInfo.getSign();
						
						if (!this.roundingMode) {
							this.roundingMode = this.currencyInfo && this.currencyInfo.roundingMode;
						}

						this._init();

						if (options && typeof (options.onLoad) === 'function') {
							options.onLoad(this);
						}
					})
				});
				return;
			} else if (this.type === "percentage") {
				this.template =  new ilib.String(this.localeInfo.getPercentageFormat() || "{n}%");
				this.templateNegative = new ilib.String(this.localeInfo.getNegativePercentageFormat() || this.localeInfo.getNegativeNumberFormat() + "%");
			}

			this._init();

			if (options && typeof (options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

/**
 * Return an array of available locales that this formatter can format
 * @static
 * @return {Array.<ilib.Locale>|undefined} an array of available locales
 */
ilib.NumFmt.getAvailableLocales = function () {
	return undefined;
};

/**
 * @private
 * @const
 * @type string
 */
ilib.NumFmt.zeros = "0000000000000000000000000000000000000000000000000000000000000000000000";

ilib.NumFmt.prototype = {
	/**
	 * Return true if this formatter uses native digits to format the number. If the useNative
	 * option is given to the constructor, then this flag will be honoured. If the useNative
	 * option is not given to the constructor, this this formatter will use native digits if
	 * the locale typically uses native digits.
	 * 
	 *  @return {boolean} true if this formatter will format with native digits, false otherwise
	 */
	getUseNative: function() {
		if (typeof(this.useNative) === "boolean") {
			return this.useNative;
		} 
		return (this.localeInfo.getDigitsStyle() === "native");
	},
	
	/**
	 * @private
	 */
	_init: function () {
		if (this.maxFractionDigits < this.minFractionDigits) {
			this.minFractionDigits = this.maxFractionDigits;
		}

		if (!this.roundingMode) {
			this.roundingMode = this.localeInfo.getRoundingMode();
		}

		if (!this.roundingMode) {
			this.roundingMode = "halfdown";
		}

		// set up the function, so we only have to figure it out once
		// and not every time we do format()
		this.round = ilib._roundFnc[this.roundingMode];
		if (!this.round) {
			this.roundingMode = "halfdown";
			this.round = ilib._roundFnc[this.roundingMode];
		}
		
		if (this.style === "nogrouping") {
			this.prigroupSize = this.secgroupSize = 0;
		} else {
			this.prigroupSize = this.localeInfo.getPrimaryGroupingDigits();
			this.secgroupSize = this.localeInfo.getSecondaryGroupingDigits();
			this.groupingSeparator = this.getUseNative() ? this.localeInfo.getNativeGroupingSeparator() : this.localeInfo.getGroupingSeparator();
		} 
		this.decimalSeparator = this.getUseNative() ? this.localeInfo.getNativeDecimalSeparator() : this.localeInfo.getDecimalSeparator();
		
		if (this.getUseNative()) {
			var nd = this.localeInfo.getNativeDigits() || this.localeInfo.getDigits();
			if (nd) {
				this.digits = nd.split("");
			}
		}
		
		this.exponentSymbol = this.localeInfo.getExponential() || "e";
	},

	/*
	 * @private
	 */
	_pad: function (str, length, left) {
		return (str.length >= length) ?
			str :
			(left ?
			ilib.NumFmt.zeros.substring(0, length - str.length) + str :
			str + ilib.NumFmt.zeros.substring(0, length - str.length));
	},

	/**
	 * @private
	 * @param {Number|ilib.Number|string|number} num object, string, or number to convert to a primitive number
	 * @return {number} the primitive number equivalent of the argument
	 */
	_toPrimitive: function (num) {
		var n = 0;

		switch (typeof (num)) {
		case 'number':
			n = num;
			break;
		case 'string':
			n = parseFloat(num);
			break;
		case 'object':
			// Number.valueOf() is incorrectly documented as being of type "string" rather than "number", so coerse 
			// the type here to shut the type checker up
			n = /** @type {number} */ num.valueOf();
			break;
		}

		return n;
	},

	/**
	 * Format the number using scientific notation as a positive number. Negative
	 * formatting to be applied later.
	 * @private
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */
	_formatScientific: function (num) {
		var n = new Number(num);
		var formatted;
		
		var factor,
			str = n.toExponential(),
			parts = str.split("e"),
			significant = parts[0],
			exponent = parts[1],
			numparts,
			integral,
			fraction;

		if (this.maxFractionDigits > 0) {
			// if there is a max fraction digits setting, round the fraction to 
			// the right length first by dividing or multiplying by powers of 10. 
			// manipulate the fraction digits so as to
			// avoid the rounding errors of floating point numbers
			factor = Math.pow(10, this.maxFractionDigits);
			significant = this.round(significant * factor) / factor;
		}
		numparts = ("" + significant).split(".");
		integral = numparts[0];
		fraction = numparts[1];
		
		if (typeof(this.maxFractionDigits) !== 'undefined') {
			fraction = fraction.substring(0, this.maxFractionDigits);
		}
		if (typeof(this.minFractionDigits) !== 'undefined') {
			fraction = this._pad(fraction || "", this.minFractionDigits, false);
		}
		formatted = integral;
		if (fraction.length) {
			formatted += this.decimalSeparator + fraction;	
		} 
		formatted += this.exponentSymbol + exponent;
		return formatted;
	},

	/**
	 * Formats the number as a positive number. Negative formatting to be applied later.
	 * @private
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */
	_formatStandard: function (num) {
		var i;
		var k;
		
		if (typeof(this.maxFractionDigits) !== 'undefined' && this.maxFractionDigits > -1) {
			var factor = Math.pow(10, this.maxFractionDigits);
			num = this.round(num * factor) / factor;
		}

		num = Math.abs(num);

		var parts = ("" + num).split("."),
			integral = parts[0],
			fraction = parts[1],
			cycle,
			formatted;
		
		integral = integral.toString();

		if (this.minFractionDigits > 0) {
			fraction = this._pad(fraction || "", this.minFractionDigits, false);
		}

		if (this.secgroupSize > 0) {
			if (integral.length > this.prigroupSize) {
				var size1 = this.prigroupSize;
				var size2 = integral.length;
				var size3 = size2 - size1;
				integral = integral.slice(0, size3) + this.groupingSeparator + integral.slice(size3);
				var num_sec = integral.substring(0, integral.indexOf(this.groupingSeparator));
				k = num_sec.length;
				while (k > this.secgroupSize) {
					var secsize1 = this.secgroupSize;
					var secsize2 = num_sec.length;
					var secsize3 = secsize2 - secsize1;
					integral = integral.slice(0, secsize3) + this.groupingSeparator + integral.slice(secsize3);
					num_sec = integral.substring(0, integral.indexOf(this.groupingSeparator));
					k = num_sec.length;
				}
			}

			formatted = integral;
		} else if (this.prigroupSize !== 0) {
			cycle = ilib.mod(integral.length - 1, this.prigroupSize);

			formatted = "";

			for (i = 0; i < integral.length - 1; i++) {
				formatted += integral.charAt(i);
				if (cycle === 0) {
					formatted += this.groupingSeparator;
				}
				cycle = ilib.mod(cycle - 1, this.prigroupSize);
			}
			formatted += integral.charAt(integral.length - 1);
		} else {
			formatted = integral;
		}

		if (fraction && (typeof(this.maxFractionDigits) === 'undefined' || this.maxFractionDigits > 0)) {
			formatted += this.decimalSeparator;
			formatted += fraction;
		}
		
		if (this.digits) {
			formatted = ilib.mapString(formatted, this.digits);
		}
		
		return formatted;
	},

	/**
	 * Format a number according to the settings of this number formatter instance.
	 * @param num {number|string|Number|ilib.Number} a floating point number to format
	 * @return {string} a string containing the formatted number
	 */
	format: function (num) {
		var formatted, n;

		if (typeof (num) === 'undefined') {
			return "";
		}

		// convert to a real primitive number type
		n = this._toPrimitive(num);

		if (this.type === "number") {
			formatted = (this.style === "scientific") ?
				this._formatScientific(n) :
				this._formatStandard(n);

			if (num < 0) {
				formatted = this.templateNegative.format({n: formatted});
			}
		} else {
			formatted = this._formatStandard(n);
			var template = (n < 0) ? this.templateNegative : this.template;
			formatted = template.format({
				n: formatted,
				s: this.sign
			});
		}

		return formatted;
	},

	/**
	 * Return the type of formatter. Valid values are "number", "currency", and
	 * "percentage".
	 *
	 * @return {string} the type of formatter
	 */
	getType: function () {
		return this.type;
	},

	/**
	 * Return the locale for this formatter instance.
	 * @return {ilib.Locale} the locale instance for this formatter
	 */
	getLocale: function () {
		return this.locale;
	},

	/**
	 * Returns true if this formatter groups together digits in the integral
	 * portion of a number, based on the options set up in the constructor. In
	 * most western European cultures, this means separating every 3 digits
	 * of the integral portion of a number with a particular character.
	 *
	 * @return {boolean} true if this formatter groups digits in the integral
	 * portion of the number
	 */
	isGroupingUsed: function () {
		return (this.groupingSeparator !== 'undefined' && this.groupingSeparator.length > 0);
	},

	/**
	 * Returns the maximum fraction digits set up in the constructor.
	 *
	 * @return {number} the maximum number of fractional digits this
	 * formatter will format, or -1 for no maximum
	 */
	getMaxFractionDigits: function () {
		return typeof (this.maxFractionDigits) !== 'undefined' ? this.maxFractionDigits : -1;
	},

	/**
	 * Returns the minimum fraction digits set up in the constructor. If
	 * the formatter has the type "currency", then the minimum fraction
	 * digits is the amount of digits that is standard for the currency
	 * in question unless overridden in the options to the constructor.
	 *
	 * @return {number} the minimum number of fractional digits this
	 * formatter will format, or -1 for no minimum
	 */
	getMinFractionDigits: function () {
		return typeof (this.minFractionDigits) !== 'undefined' ? this.minFractionDigits : -1;
	},

	/**
	 * Returns the ISO 4217 code for the currency that this formatter formats.
	 * IF the typeof this formatter is not "currency", then this method will
	 * return undefined.
	 *
	 * @return {string} the ISO 4217 code for the currency that this formatter
	 * formats, or undefined if this not a currency formatter
	 */
	getCurrency: function () {
		return this.currencyInfo && this.currencyInfo.getCode();
	},

	/**
	 * Returns the rounding mode set up in the constructor. The rounding mode
	 * controls how numbers are rounded when the integral or fraction digits
	 * of a number are limited.
	 *
	 * @return {string} the name of the rounding mode used in this formatter
	 */
	getRoundingMode: function () {
		return this.roundingMode;
	},

	/**
	 * If this formatter is a currency formatter, then the style determines how the
	 * currency is denoted in the formatted output. This method returns the style
	 * that this formatter will produce. (See the constructor comment for more about
	 * the styles.)
	 * @return {string} the name of the style this formatter will use to format
	 * currency amounts, or "undefined" if this formatter is not a currency formatter
	 */
	getStyle: function () {
		return this.style;
	}
};

/*
 * durfmt.js - Date formatter definition
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
date.js 
strings.js 
resources.js 
localeinfo.js
util/jsutils.js
*/

// !data dateformats sysres
// !resbundle sysres

/**
 * @class
 * Create a new duration formatter instance. The duration formatter is immutable once
 * it is created, but can format as many different durations as needed with the same
 * options. Create different duration formatter instances for different purposes
 * and then keep them cached for use later if you have more than one duration to
 * format.<p>
 * 
 * Duration formatters format lengths of time. The duration formatter is meant to format 
 * durations of such things as the length of a song or a movie or a meeting, or the 
 * current position in that song or movie while playing it. If you wish to format a 
 * period of time that has a specific start and end date/time, then use a
 * [ilib.DateRngFmt] instance instead and call its format method.<p>
 *  
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the duration. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>length</i> - Specify the length of the format to use. The length is the approximate size of the 
 * formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the duration. This is the most compact format possible for the locale. eg. 1y 1m 1w 1d 1:01:01
 * <li><i>medium</i> - use a medium length representation of the duration. This is a slightly longer format. eg. 1 yr 1 mo 1 wk 1 dy 1 hr 1 mi 1 se
 * <li><i>long</i> - use a long representation of the duration. This is a fully specified format, but some of the textual 
 * parts may still be abbreviated. eg. 1 yr 1 mo 1 wk 1 day 1 hr 1 min 1 sec
 * <li><i>full</i> - use a full representation of the duration. This is a fully specified format where all the textual 
 * parts are spelled out completely. eg. 1 year, 1 month, 1 week, 1 day, 1 hour, 1 minute and 1 second
 * </ul>
 * 
 * <li><i>style<i> - whether hours, minutes, and seconds should be formatted as a text string
 * or as a regular time as on a clock. eg. text is "1 hour, 15 minutes", whereas clock is "1:15:00". Valid
 * values for this property are "text" or "clock". Default if this property is not specified
 * is "text".
 * 
 *<li><i>useNative</i> - the flag used to determaine whether to use the native script settings 
 * for formatting the numbers .
 * 
 * <li><i>onLoad</i> - a callback function to call when the format data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * <p>
 * 
 * Depends directive: !depends durfmt.js
 * 
 * @constructor
 * @param {?Object} options options governing the way this date formatter instance works
 */
ilib.DurFmt = function(options) {
	var sync = true;
	var loadParams = undefined;
	
	this.locale = new ilib.Locale();
	this.length = "short";
	this.style = "text";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.length) {
			if (options.length === 'short' ||
				options.length === 'medium' ||
				options.length === 'long' ||
				options.length === 'full') {
				this.length = options.length;
			}
		}
		
		if (options.style) {
			if (options.style === 'text' || options.style === 'clock') {
				this.style = options.style;
			}
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.useNative) === 'boolean') {
			this.useNative = options.useNative;
		}
		
		loadParams = options.loadParams;
	}
	
	new ilib.ResBundle({
		locale: this.locale,
		name: "sysres",
		sync: sync,
		loadParams: loadParams,
		onLoad: ilib.bind(this, function (sysres) {
			switch (this.length) {
				case 'short':
					this.components = {
						year: sysres.getString("#{num}y"),
						month: sysres.getString("#{num}m", "durationShortMonths"),
						week: sysres.getString("#{num}w"),
						day: sysres.getString("#{num}d"),
						hour: sysres.getString("#{num}h"),
						minute: sysres.getString("#{num}m", "durationShortMinutes"),
						second: sysres.getString("#{num}s"),
						millisecond: sysres.getString("#{num}m", "durationShortMillis"),
						separator: sysres.getString(" ", "separatorShort"),
						finalSeparator: "" // not used at this length
					};
					break;
					
				case 'medium':
					this.components = {
						year: sysres.getString("1#1 yr|#{num} yrs", "durationMediumYears"),
						month: sysres.getString("1#1 mo|#{num} mos"),
						week: sysres.getString("1#1 wk|#{num} wks", "durationMediumWeeks"),
						day: sysres.getString("1#1 dy|#{num} dys"),
						hour: sysres.getString("1#1 hr|#{num} hrs", "durationMediumHours"),
						minute: sysres.getString("1#1 mi|#{num} min"),
						second: sysres.getString("1#1 se|#{num} sec"),
						millisecond: sysres.getString("#{num} ms"),
						separator: sysres.getString(" ", "separatorMedium"),
						finalSeparator: "" // not used at this length
					};
					break;
					
				case 'long':
					this.components = {
						year: sysres.getString("1#1 yr|#{num} yrs"),
						month: sysres.getString("1#1 mon|#{num} mons"),
						week: sysres.getString("1#1 wk|#{num} wks"),
						day: sysres.getString("1#1 day|#{num} days", "durationLongDays"),
						hour: sysres.getString("1#1 hr|#{num} hrs"),
						minute: sysres.getString("1#1 min|#{num} min"),
						second: sysres.getString("1#1 sec|#{num} sec"),
						millisecond: sysres.getString("#{num} ms"),
						separator: sysres.getString(", ", "separatorLong"),
						finalSeparator: "" // not used at this length
					};
					break;
					
				case 'full':
					this.components = {
						year: sysres.getString("1#1 year|#{num} years"),
						month: sysres.getString("1#1 month|#{num} months"),
						week: sysres.getString("1#1 week|#{num} weeks"),
						day: sysres.getString("1#1 day|#{num} days"),
						hour: sysres.getString("1#1 hour|#{num} hours"),
						minute: sysres.getString("1#1 minute|#{num} minutes"),
						second: sysres.getString("1#1 second|#{num} seconds"),
						millisecond: sysres.getString("1#1 millisecond|#{num} milliseconds"),
						separator: sysres.getString(", ", "separatorFull"),
						finalSeparator: sysres.getString(" and ", "finalSeparatorFull")
					};
					break;
			}
			
			if (this.style === 'clock') {
				new ilib.DateFmt({
					locale: this.locale,
					calendar: "gregorian",
					type: "time",
					time: "ms",
					sync: sync,
					loadParams: loadParams,
					useNative: this.useNative,
					onLoad: ilib.bind(this, function (fmtMS) {
						this.timeFmtMS = fmtMS;
						new ilib.DateFmt({
							locale: this.locale,
							calendar: "gregorian",
							type: "time",
							time: "hm",
							sync: sync,
							loadParams: loadParams,
							useNative: this.useNative,
							onLoad: ilib.bind(this, function (fmtHM) {
								this.timeFmtHM = fmtHM;		
								new ilib.DateFmt({
									locale: this.locale,
									calendar: "gregorian",
									type: "time",
									time: "hms",
									sync: sync,
									loadParams: loadParams,
									useNative: this.useNative,
									onLoad: ilib.bind(this, function (fmtHMS) {
										this.timeFmtHMS = fmtHMS;		

										// munge with the template to make sure that the hours are not formatted mod 12
										this.timeFmtHM.template = this.timeFmtHM.template.replace(/hh?/, 'H');
										this.timeFmtHM.templateArr = this.timeFmtHM._tokenize(this.timeFmtHM.template);
										this.timeFmtHMS.template = this.timeFmtHMS.template.replace(/hh?/, 'H');
										this.timeFmtHMS.templateArr = this.timeFmtHMS._tokenize(this.timeFmtHMS.template);
										
										this._init(this.timeFmtHM.locinfo, options && options.onLoad);
									})
								});
							})
						});
					})
				});
				return;
			}

			new ilib.LocaleInfo(this.locale, {
				sync: sync,
				loadParams: loadParams,
				onLoad: ilib.bind(this, function (li) {
					this._init(li, options && options.onLoad);
				})
			});
		})
	});
};

/**
 * @private
 * @static
 */
ilib.DurFmt.complist = {
	"text": ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"],
	"clock": ["year", "month", "week", "day"]
};

/**
 * @private
 */
ilib.DurFmt.prototype._mapDigits = function(str) {
	if (this.useNative && this.digits) {
		return ilib.mapString(str.toString(), this.digits);
	}
	return str;
};

/**
 * @private
 * @param {ilib.LocaleInfo} locinfo
 * @param {function(ilib.DurFmt)|undefined} onLoad
 */
ilib.DurFmt.prototype._init = function(locinfo, onLoad) {
	var digits;
	if (typeof(this.useNative) === 'boolean') {
		// if the caller explicitly said to use native or not, honour that despite what the locale data says...
		if (this.useNative) {
			digits = locinfo.getNativeDigits();
			if (digits) {
				this.digits = digits;
			}
		}
	} else if (locinfo.getDigitsStyle() === "native") {
		// else if the locale usually uses native digits, then use them 
		digits = locinfo.getNativeDigits();
		if (digits) {
			this.useNative = true;
			this.digits = digits;
		}
	} // else use western digits always

	if (typeof(onLoad) === 'function') {
		onLoad(this);
	}
};

/**
 * Format a duration according to the format template of this formatter instance.<p>
 * 
 * The components parameter should be an object that contains any or all of these 
 * numeric properties:
 * 
 * <ul>
 * <li>year
 * <li>month
 * <li>week
 * <li>day
 * <li>hour
 * <li>minute
 * <li>second
 * </ul>
 * <p>
 *
 * When a property is left out of the components parameter or has a value of 0, it will not
 * be formatted into the output string, except for times that include 0 minutes and 0 seconds.
 * 
 * This formatter will not ensure that numbers for each component property is within the
 * valid range for that component. This allows you to format durations that are longer
 * than normal range. For example, you could format a duration has being "33 hours" rather
 * than "1 day, 9 hours".
 * 
 * @param {Object} components date/time components to be formatted into a duration string
 * @return {ilib.String} a string with the duration formatted according to the style and 
 * locale set up for this formatter instance. If the components parameter is empty or 
 * undefined, an empty string is returned.
 */
ilib.DurFmt.prototype.format = function (components) {
	var i, list, temp, fmt, secondlast = true, str = "";
	
	list = ilib.DurFmt.complist[this.style];
	//for (i = 0; i < list.length; i++) {
	for (i = list.length-1; i >= 0; i--) {
		//console.log("Now dealing with " + list[i]);
		if (typeof(components[list[i]]) !== 'undefined' && components[list[i]] != 0) {
			if (str.length > 0) {
				str = ((this.length === 'full' && secondlast) ? this.components.finalSeparator : this.components.separator) + str;
				secondlast = false;
			}
			str = this.components[list[i]].formatChoice(components[list[i]], {num: this._mapDigits(components[list[i]])}) + str;
		}
	}

	if (this.style === 'clock') {
		if (typeof(components.hour) !== 'undefined') {
			fmt = (typeof(components.second) !== 'undefined') ? this.timeFmtHMS : this.timeFmtHM;
		} else {
			fmt = this.timeFmtMS;
		}
				
		if (str.length > 0) {
			str += this.components.separator;
		}
		str += fmt._formatTemplate(components, fmt.templateArr);
	}
	
	return new ilib.String(str);
};

/**
 * Return the locale that was used to construct this duration formatter object. If the
 * locale was not given as parameter to the constructor, this method returns the default
 * locale of the system.
 * 
 * @return {ilib.Locale} locale that this duration formatter was constructed with
 */
ilib.DurFmt.prototype.getLocale = function () {
	return this.locale;
};

/**
 * Return the length that was used to construct this duration formatter object. If the
 * length was not given as parameter to the constructor, this method returns the default
 * length. Valid values are "short", "medium", "long", and "full".
 * 
 * @return {string} length that this duration formatter was constructed with
 */
ilib.DurFmt.prototype.getLength = function () {
	return this.length;
};

/**
 * Return the style that was used to construct this duration formatter object. Returns
 * one of "text" or "clock".
 * 
 * @return {string} style that this duration formatter was constructed with
 */
ilib.DurFmt.prototype.getStyle = function () {
	return this.style;
};

ilib.data.scripts = {"Afak":{"nb":439,"nm":"Afaka","lid":"Afaka"},"Aghb":{"nb":239,"nm":"Caucasian Albanian","lid":"Caucasian_Albanian"},"Arab":{"nb":160,"nm":"Arabic","lid":"Arabic","rtl":true,"ime":false,"casing":false},"Armi":{"nb":124,"nm":"Imperial Aramaic","lid":"Imperial_Aramaic","rtl":true,"ime":false,"casing":false},"Armn":{"nb":230,"nm":"Armenian","lid":"Armenian","rtl":false,"ime":false,"casing":true},"Avst":{"nb":134,"nm":"Avestan","lid":"Avestan","rtl":true,"ime":false,"casing":false},"Bali":{"nb":360,"nm":"Balinese","lid":"Balinese","rtl":false,"ime":false,"casing":false},"Bamu":{"nb":435,"nm":"Bamum","lid":"Bamum","rtl":false,"ime":true,"casing":false},"Bass":{"nb":259,"nm":"Bassa Vah","lid":"Bassa_Vah"},"Batk":{"nb":365,"nm":"Batak","lid":"Batak","rtl":false,"ime":false,"casing":false},"Beng":{"nb":325,"nm":"Bengali","lid":"Bengali","rtl":false,"ime":false,"casing":false},"Blis":{"nb":550,"nm":"Blissymbols","lid":"Blissymbols"},"Bopo":{"nb":285,"nm":"Bopomofo","lid":"Bopomofo","rtl":false,"ime":false,"casing":false},"Brah":{"nb":300,"nm":"Brahmi","lid":"Brahmi","rtl":false,"ime":false,"casing":false},"Brai":{"nb":570,"nm":"Braille","lid":"Braille","rtl":false,"ime":false,"casing":false},"Bugi":{"nb":367,"nm":"Buginese","lid":"Buginese","rtl":false,"ime":false,"casing":false},"Buhd":{"nb":372,"nm":"Buhid","lid":"Buhid","rtl":false,"ime":false,"casing":false},"Cakm":{"nb":349,"nm":"Chakma","lid":"Chakma","rtl":false,"ime":false,"casing":false},"Cans":{"nb":440,"nm":"Unified Canadian Aboriginal Syllabics","lid":"Canadian_Aboriginal","rtl":false,"ime":true,"casing":false},"Cari":{"nb":201,"nm":"Carian","lid":"Carian","rtl":false,"ime":false,"casing":false},"Cham":{"nb":358,"nm":"Cham","lid":"Cham","rtl":false,"ime":false,"casing":false},"Cher":{"nb":445,"nm":"Cherokee","lid":"Cherokee","rtl":false,"ime":false,"casing":false},"Cirt":{"nb":291,"nm":"Cirth","lid":"Cirth"},"Copt":{"nb":204,"nm":"Coptic","lid":"Coptic","rtl":false,"ime":false,"casing":true},"Cprt":{"nb":403,"nm":"Cypriot","lid":"Cypriot","rtl":true,"ime":false,"casing":false},"Cyrl":{"nb":220,"nm":"Cyrillic","lid":"Cyrillic","rtl":false,"ime":false,"casing":true},"Cyrs":{"nb":221,"nm":"Cyrillic (Old Church Slavonic variant)","lid":"Cyrillic_(Old_Church_Slavonic_variant)"},"Deva":{"nb":315,"nm":"Devanagari (Nagari)","lid":"Devanagari","rtl":false,"ime":false,"casing":false},"Dsrt":{"nb":250,"nm":"Deseret (Mormon)","lid":"Deseret","rtl":false,"ime":false,"casing":true},"Dupl":{"nb":755,"nm":"Duployan shorthand, Duployan stenography","lid":"Duployan_shorthand,_Duployan_stenography"},"Egyd":{"nb":70,"nm":"Egyptian demotic","lid":"Egyptian_demotic"},"Egyh":{"nb":60,"nm":"Egyptian hieratic","lid":"Egyptian_hieratic"},"Egyp":{"nb":50,"nm":"Egyptian hieroglyphs","lid":"Egyptian_Hieroglyphs","rtl":false,"ime":true,"casing":false},"Elba":{"nb":226,"nm":"Elbasan","lid":"Elbasan"},"Ethi":{"nb":430,"nm":"Ethiopic (Geʻez)","lid":"Ethiopic","rtl":false,"ime":true,"casing":false},"Geor":{"nb":240,"nm":"Georgian (Mkhedruli)","lid":"Georgian","rtl":false,"ime":false,"casing":false},"Geok":{"nb":241,"nm":"Khutsuri (Asomtavruli and Nuskhuri)","lid":"Georgian"},"Glag":{"nb":225,"nm":"Glagolitic","lid":"Glagolitic","rtl":false,"ime":false,"casing":true},"Goth":{"nb":206,"nm":"Gothic","lid":"Gothic","rtl":false,"ime":false,"casing":false},"Gran":{"nb":343,"nm":"Grantha","lid":"Grantha"},"Grek":{"nb":200,"nm":"Greek","lid":"Greek","rtl":false,"ime":false,"casing":true},"Gujr":{"nb":320,"nm":"Gujarati","lid":"Gujarati","rtl":false,"ime":false,"casing":false},"Guru":{"nb":310,"nm":"Gurmukhi","lid":"Gurmukhi","rtl":false,"ime":false,"casing":false},"Hang":{"nb":286,"nm":"Hangul (Hangŭl, Hangeul)","lid":"Hangul","rtl":false,"ime":true,"casing":false},"Hani":{"nb":500,"nm":"Han (Hanzi, Kanji, Hanja)","lid":"Han","rtl":false,"ime":true,"casing":false},"Hano":{"nb":371,"nm":"Hanunoo (Hanunóo)","lid":"Hanunoo","rtl":false,"ime":false,"casing":false},"Hans":{"nb":501,"nm":"Han (Simplified variant)","lid":"Han_(Simplified_variant)","rtl":false,"ime":true,"casing":false},"Hant":{"nb":502,"nm":"Han (Traditional variant)","lid":"Han_(Traditional_variant)","rtl":false,"ime":true,"casing":false},"Hebr":{"nb":125,"nm":"Hebrew","lid":"Hebrew","rtl":true,"ime":false,"casing":false},"Hira":{"nb":410,"nm":"Hiragana","lid":"Hiragana","rtl":false,"ime":false,"casing":false},"Hluw":{"nb":80,"nm":"Anatolian Hieroglyphs (Luwian Hieroglyphs, Hittite Hieroglyphs)","lid":"Anatolian_Hieroglyphs_(Luwian_Hieroglyphs,_Hittite_Hieroglyphs)"},"Hmng":{"nb":450,"nm":"Pahawh Hmong","lid":"Pahawh_Hmong"},"Hrkt":{"nb":412,"nm":"Japanese syllabaries (alias for Hiragana + Katakana)","lid":"Katakana_Or_Hiragana"},"Hung":{"nb":176,"nm":"Old Hungarian (Hungarian Runic)","lid":"Old_Hungarian_(Hungarian_Runic)"},"Inds":{"nb":610,"nm":"Indus (Harappan)","lid":"Indus_(Harappan)"},"Ital":{"nb":210,"nm":"Old Italic (Etruscan, Oscan, etc.)","lid":"Old_Italic","rtl":false,"ime":false,"casing":false},"Java":{"nb":361,"nm":"Javanese","lid":"Javanese","rtl":false,"ime":false,"casing":false},"Jpan":{"nb":413,"nm":"Japanese (alias for Han + Hiragana + Katakana)","lid":"Japanese_(alias_for_Han_+_Hiragana_+_Katakana)","rtl":false,"ime":false,"casing":false},"Jurc":{"nb":510,"nm":"Jurchen","lid":"Jurchen"},"Kali":{"nb":357,"nm":"Kayah Li","lid":"Kayah_Li","rtl":false,"ime":false,"casing":false},"Kana":{"nb":411,"nm":"Katakana","lid":"Katakana","rtl":false,"ime":false,"casing":false},"Khar":{"nb":305,"nm":"Kharoshthi","lid":"Kharoshthi","rtl":true,"ime":false,"casing":false},"Khmr":{"nb":355,"nm":"Khmer","lid":"Khmer","rtl":false,"ime":false,"casing":false},"Khoj":{"nb":322,"nm":"Khojki","lid":"Khojki"},"Knda":{"nb":345,"nm":"Kannada","lid":"Kannada","rtl":false,"ime":false,"casing":false},"Kore":{"nb":287,"nm":"Korean (alias for Hangul + Han)","lid":"Korean_(alias_for_Hangul_+_Han)","rtl":false,"ime":true,"casing":false},"Kpel":{"nb":436,"nm":"Kpelle","lid":"Kpelle"},"Kthi":{"nb":317,"nm":"Kaithi","lid":"Kaithi","rtl":false,"ime":false,"casing":false},"Lana":{"nb":351,"nm":"Tai Tham (Lanna)","lid":"Tai_Tham","rtl":false,"ime":false,"casing":false},"Laoo":{"nb":356,"nm":"Lao","lid":"Lao","rtl":false,"ime":false,"casing":false},"Latf":{"nb":217,"nm":"Latin (Fraktur variant)","lid":"Latin_(Fraktur_variant)"},"Latg":{"nb":216,"nm":"Latin (Gaelic variant)","lid":"Latin_(Gaelic_variant)"},"Latn":{"nb":215,"nm":"Latin","lid":"Latin","rtl":false,"ime":false,"casing":true},"Lepc":{"nb":335,"nm":"Lepcha (Róng)","lid":"Lepcha","rtl":false,"ime":false,"casing":false},"Limb":{"nb":336,"nm":"Limbu","lid":"Limbu","rtl":false,"ime":false,"casing":false},"Lina":{"nb":400,"nm":"Linear A","lid":"Linear_A"},"Linb":{"nb":401,"nm":"Linear B","lid":"Linear_B","rtl":false,"ime":true,"casing":false},"Lisu":{"nb":399,"nm":"Lisu (Fraser)","lid":"Lisu","rtl":false,"ime":true,"casing":false},"Loma":{"nb":437,"nm":"Loma","lid":"Loma"},"Lyci":{"nb":202,"nm":"Lycian","lid":"Lycian","rtl":false,"ime":false,"casing":false},"Lydi":{"nb":116,"nm":"Lydian","lid":"Lydian","rtl":true,"ime":false,"casing":false},"Mahj":{"nb":314,"nm":"Mahajani","lid":"Mahajani"},"Mand":{"nb":140,"nm":"Mandaic, Mandaean","lid":"Mandaic","rtl":true,"ime":false,"casing":false},"Mani":{"nb":139,"nm":"Manichaean","lid":"Manichaean"},"Maya":{"nb":90,"nm":"Mayan hieroglyphs","lid":"Mayan_hieroglyphs"},"Mend":{"nb":438,"nm":"Mende","lid":"Mende"},"Merc":{"nb":101,"nm":"Meroitic Cursive","lid":"Meroitic_Cursive","rtl":true,"ime":false,"casing":false},"Mero":{"nb":100,"nm":"Meroitic Hieroglyphs","lid":"Meroitic_Hieroglyphs","rtl":true,"ime":false,"casing":false},"Mlym":{"nb":347,"nm":"Malayalam","lid":"Malayalam","rtl":false,"ime":false,"casing":false},"Moon":{"nb":218,"nm":"Moon (Moon code, Moon script, Moon type)","lid":"Moon_(Moon_code,_Moon_script,_Moon_type)"},"Mong":{"nb":145,"nm":"Mongolian","lid":"Mongolian","rtl":false,"ime":false,"casing":false},"Mroo":{"nb":199,"nm":"Mro, Mru","lid":"Mro,_Mru"},"Mtei":{"nb":337,"nm":"Meitei Mayek (Meithei, Meetei)","lid":"Meetei_Mayek","rtl":false,"ime":false,"casing":false},"Mymr":{"nb":350,"nm":"Myanmar (Burmese)","lid":"Myanmar","rtl":false,"ime":false,"casing":false},"Narb":{"nb":106,"nm":"Old North Arabian (Ancient North Arabian)","lid":"Old_North_Arabian_(Ancient_North_Arabian)"},"Nbat":{"nb":159,"nm":"Nabataean","lid":"Nabataean"},"Nkgb":{"nb":420,"nm":"Nakhi Geba ('Na-'Khi ²Ggŏ-¹baw, Naxi Geba)","lid":"Nakhi_Geba_('Na-'Khi_²Ggŏ-¹baw,_Naxi_Geba)"},"Nkoo":{"nb":165,"nm":"N’Ko","lid":"Nko","rtl":true,"ime":false,"casing":false},"Nshu":{"nb":499,"nm":"Nüshu","lid":"Nüshu"},"Ogam":{"nb":212,"nm":"Ogham","lid":"Ogham","rtl":false,"ime":false,"casing":false},"Olck":{"nb":261,"nm":"Ol Chiki (Ol Cemet’, Ol, Santali)","lid":"Ol_Chiki","rtl":false,"ime":false,"casing":false},"Orkh":{"nb":175,"nm":"Old Turkic, Orkhon Runic","lid":"Old_Turkic","rtl":true,"ime":false,"casing":false},"Orya":{"nb":327,"nm":"Oriya","lid":"Oriya","rtl":false,"ime":false,"casing":false},"Osma":{"nb":260,"nm":"Osmanya","lid":"Osmanya","rtl":false,"ime":false,"casing":false},"Palm":{"nb":126,"nm":"Palmyrene","lid":"Palmyrene"},"Perm":{"nb":227,"nm":"Old Permic","lid":"Old_Permic"},"Phag":{"nb":331,"nm":"Phags-pa","lid":"Phags_Pa","rtl":false,"ime":false,"casing":false},"Phli":{"nb":131,"nm":"Inscriptional Pahlavi","lid":"Inscriptional_Pahlavi","rtl":true,"ime":false,"casing":false},"Phlp":{"nb":132,"nm":"Psalter Pahlavi","lid":"Psalter_Pahlavi"},"Phlv":{"nb":133,"nm":"Book Pahlavi","lid":"Book_Pahlavi"},"Phnx":{"nb":115,"nm":"Phoenician","lid":"Phoenician","rtl":true,"ime":false,"casing":false},"Plrd":{"nb":282,"nm":"Miao (Pollard)","lid":"Miao","rtl":false,"ime":false,"casing":false},"Prti":{"nb":130,"nm":"Inscriptional Parthian","lid":"Inscriptional_Parthian","rtl":true,"ime":false,"casing":false},"Qaaa":{"nb":900,"nm":"Reserved for private use (start)","lid":"Reserved_for_private_use_(start)"},"Qabx":{"nb":949,"nm":"Reserved for private use (end)","lid":"Reserved_for_private_use_(end)"},"Rjng":{"nb":363,"nm":"Rejang (Redjang, Kaganga)","lid":"Rejang","rtl":false,"ime":false,"casing":false},"Roro":{"nb":620,"nm":"Rongorongo","lid":"Rongorongo"},"Runr":{"nb":211,"nm":"Runic","lid":"Runic","rtl":false,"ime":false,"casing":false},"Samr":{"nb":123,"nm":"Samaritan","lid":"Samaritan","rtl":true,"ime":false,"casing":false},"Sara":{"nb":292,"nm":"Sarati","lid":"Sarati"},"Sarb":{"nb":105,"nm":"Old South Arabian","lid":"Old_South_Arabian","rtl":true,"ime":false,"casing":false},"Saur":{"nb":344,"nm":"Saurashtra","lid":"Saurashtra","rtl":false,"ime":false,"casing":false},"Sgnw":{"nb":95,"nm":"SignWriting","lid":"SignWriting"},"Shaw":{"nb":281,"nm":"Shavian (Shaw)","lid":"Shavian","rtl":false,"ime":false,"casing":false},"Shrd":{"nb":319,"nm":"Sharada, Śāradā","lid":"Sharada","rtl":false,"ime":false,"casing":false},"Sind":{"nb":318,"nm":"Khudawadi, Sindhi","lid":"Khudawadi,_Sindhi"},"Sinh":{"nb":348,"nm":"Sinhala","lid":"Sinhala","rtl":false,"ime":false,"casing":false},"Sora":{"nb":398,"nm":"Sora Sompeng","lid":"Sora_Sompeng","rtl":false,"ime":false,"casing":false},"Sund":{"nb":362,"nm":"Sundanese","lid":"Sundanese","rtl":false,"ime":false,"casing":false},"Sylo":{"nb":316,"nm":"Syloti Nagri","lid":"Syloti_Nagri","rtl":false,"ime":false,"casing":false},"Syrc":{"nb":135,"nm":"Syriac","lid":"Syriac","rtl":true,"ime":false,"casing":false},"Syre":{"nb":138,"nm":"Syriac (Estrangelo variant)","lid":"Syriac_(Estrangelo_variant)"},"Syrj":{"nb":137,"nm":"Syriac (Western variant)","lid":"Syriac_(Western_variant)"},"Syrn":{"nb":136,"nm":"Syriac (Eastern variant)","lid":"Syriac_(Eastern_variant)"},"Tagb":{"nb":373,"nm":"Tagbanwa","lid":"Tagbanwa","rtl":false,"ime":false,"casing":false},"Takr":{"nb":321,"nm":"Takri, Ṭākrī, Ṭāṅkrī","lid":"Takri","rtl":false,"ime":false,"casing":false},"Tale":{"nb":353,"nm":"Tai Le","lid":"Tai_Le","rtl":false,"ime":false,"casing":false},"Talu":{"nb":354,"nm":"New Tai Lue","lid":"New_Tai_Lue","rtl":false,"ime":false,"casing":false},"Taml":{"nb":346,"nm":"Tamil","lid":"Tamil","rtl":false,"ime":false,"casing":false},"Tang":{"nb":520,"nm":"Tangut","lid":"Tangut"},"Tavt":{"nb":359,"nm":"Tai Viet","lid":"Tai_Viet","rtl":false,"ime":false,"casing":false},"Telu":{"nb":340,"nm":"Telugu","lid":"Telugu","rtl":false,"ime":false,"casing":false},"Teng":{"nb":290,"nm":"Tengwar","lid":"Tengwar"},"Tfng":{"nb":120,"nm":"Tifinagh (Berber)","lid":"Tifinagh","rtl":false,"ime":false,"casing":false},"Tglg":{"nb":370,"nm":"Tagalog (Baybayin, Alibata)","lid":"Tagalog","rtl":false,"ime":false,"casing":false},"Thaa":{"nb":170,"nm":"Thaana","lid":"Thaana","rtl":true,"ime":false,"casing":false},"Thai":{"nb":352,"nm":"Thai","lid":"Thai","rtl":false,"ime":false,"casing":false},"Tibt":{"nb":330,"nm":"Tibetan","lid":"Tibetan","rtl":false,"ime":false,"casing":false},"Tirh":{"nb":326,"nm":"Tirhuta","lid":"Tirhuta"},"Ugar":{"nb":40,"nm":"Ugaritic","lid":"Ugaritic","rtl":false,"ime":false,"casing":false},"Vaii":{"nb":470,"nm":"Vai","lid":"Vai","rtl":false,"ime":true,"casing":false},"Visp":{"nb":280,"nm":"Visible Speech","lid":"Visible_Speech"},"Wara":{"nb":262,"nm":"Warang Citi (Varang Kshiti)","lid":"Warang_Citi_(Varang_Kshiti)"},"Wole":{"nb":480,"nm":"Woleai","lid":"Woleai"},"Xpeo":{"nb":30,"nm":"Old Persian","lid":"Old_Persian","rtl":false,"ime":false,"casing":false},"Xsux":{"nb":20,"nm":"Cuneiform, Sumero-Akkadian","lid":"Cuneiform","rtl":false,"ime":true,"casing":false},"Yiii":{"nb":460,"nm":"Yi","lid":"Yi","rtl":false,"ime":true,"casing":false},"Zinh":{"nb":994,"nm":"Code for inherited script","lid":"Inherited","rtl":false,"ime":false,"casing":false},"Zmth":{"nb":995,"nm":"Mathematical notation","lid":"Mathematical_notation"},"Zsym":{"nb":996,"nm":"Symbols","lid":"Symbols"},"Zxxx":{"nb":997,"nm":"Code for unwritten documents","lid":"Code_for_unwritten_documents"},"Zyyy":{"nb":998,"nm":"Code for undetermined script","lid":"Common","rtl":false,"ime":false,"casing":false},"Zzzz":{"nb":999,"nm":"Code for uncoded script","lid":"Unknown","rtl":false,"ime":false,"casing":false}};
/*
 * scriptinfo.js - information about scripts
 * 
 * Copyright © 2012-2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

// !data scripts

/**
 * @class
 * Create a new script info instance. This class encodes information about
 * scripts, which are sets of characters used in a writing system.<p>
 * 
 * The options object may contain any of the following properties:
 * 
 * <ul>
 * <li><i>onLoad</i> - a callback function to call when the script info object is fully 
 * loaded. When the onLoad option is given, the script info object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * Depends directive: !depends scriptinfo.js
 * 
 * @constructor
 * @param {string} script The ISO 15924 4-letter identifier for the script
 * @param {Object} options parameters to initialize this matcher 
 */
ilib.ScriptInfo = function(script, options) {
	var sync = true,
	    loadParams = undefined;
	
	this.script = script;
	
	if (options) {
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}

	if (!ilib.ScriptInfo.cache) {
		ilib.ScriptInfo.cache = {};
	}

	if (!ilib.data.scripts) {
		ilib.loadData({
			object: ilib.ScriptInfo, 
			locale: "-", 
			name: "scripts.json", 
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, function (info) {
				if (!info) {
					info = {"Latn":{"nb":215,"nm":"Latin","lid":"Latin","rtl":false,"ime":false,"casing":true}};
					var spec = this.locale.getSpec().replace(/-/g, "_");
					ilib.ScriptInfo.cache[spec] = info;
				}
				ilib.data.scripts = info;
				this.info = script && ilib.data.scripts[script];
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
	} else {
		this.info = ilib.data.scripts[script];
	}

};

/**
 * Return an array of all ISO 15924 4-letter identifier script identifiers that
 * this copy of ilib knows about.
 * @static
 * @return {Array.<string>} an array of all script identifiers that this copy of
 * ilib knows about
 */
ilib.ScriptInfo.getAllScripts = function() {
	var ret = [],
		script = undefined,
		scripts = ilib.data.scripts;
	
	for (script in scripts) {
		if (script && scripts[script]) {
			ret.push(script);
		}
	}
	
	return ret;
};

ilib.ScriptInfo.prototype = {
	/**
	 * Return the 4-letter ISO 15924 identifier associated
	 * with this script.
	 * @return {string} the 4-letter ISO code for this script
	 */
	getCode: function () {
		return this.info && this.script;
	},
	
	/**
	 * Get the ISO 15924 code number associated with this
	 * script.
	 * 
	 * @return {number} the ISO 15924 code number
	 */
	getCodeNumber: function () {
		return this.info && this.info.nb || 0;
	},
	
	/**
	 * Get the name of this script in English.
	 * 
	 * @return {string} the name of this script in English
	 */
	getName: function () {
		return this.info && this.info.nm;
	},
	
	/**
	 * Get the long identifier assciated with this script.
	 * 
	 * @return {string} the long identifier of this script
	 */
	getLongCode: function () {
		return this.info && this.info.lid;
	},
	
	/**
	 * Return the usual direction that text in this script is written
	 * in. Possible return values are "rtl" for right-to-left,
	 * "ltr" for left-to-right, and "ttb" for top-to-bottom.
	 * 
	 * @return {string} the usual direction that text in this script is
	 * written in
	 */
	getScriptDirection: function() {
		return (this.info && typeof(this.info.rtl) !== 'undefined' && this.info.rtl) ? "rtl" : "ltr";
	},
	
	/**
	 * Return true if this script typically requires an input method engine
	 * to enter its characters.
	 * 
	 * @return {boolean} true if this script typically requires an IME
	 */
	getNeedsIME: function () {
		return this.info && this.info.ime ? true : false; // converts undefined to false
	},
	
	/**
	 * Return true if this script uses lower- and upper-case characters.
	 * 
	 * @return {boolean} true if this script uses letter case
	 */
	getCasing: function () {
		return this.info && this.info.casing ? true : false; // converts undefined to false
	}
};
/*
 * casemapper.js - define upper- and lower-case mapper
 * 
 * Copyright © 2014-2015, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends locale.js util/utils.js

/**
 * @class
 * Create a new string mapper instance that maps strings to upper or
 * lower case. This mapping will work for any string as characters 
 * that have no case will be returned unchanged.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when loading the mapper. Some maps are 
 * locale-dependent, and this locale selects the right one. Default if this is
 * not specified is the current locale.
 * 
 * <li><i>direction</i> - "toupper" for upper-casing, or "tolower" for lower-casing.
 * Default if not specified is "toupper".
 * </ul>
 * 
 * Depends directive: !depends casemapper.js
 * 
 * @constructor
 * @param {Object=} options options to initialize this mapper 
 */
ilib.CaseMapper = function (options) {
	this.up = true;
	this.locale = new ilib.Locale();
	
	if (options) {
		if (typeof(options.locale) !== 'undefined') {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		this.up = (!options.direction || options.direction === "toupper");
	}

	this.mapData = this.up ? {
		"ß": "SS",		// German
		'ΐ': 'Ι',		// Greek
		'ά': 'Α',
		'έ': 'Ε',
		'ή': 'Η',
		'ί': 'Ι',
		'ΰ': 'Υ',
		'ϊ': 'Ι',
		'ϋ': 'Υ',
		'ό': 'Ο',
		'ύ': 'Υ',
		'ώ': 'Ω',
		'Ӏ': 'Ӏ',		// Russian and slavic languages
		'ӏ': 'Ӏ'
	} : {
		'Ӏ': 'Ӏ'		// Russian and slavic languages
	};

	switch (this.locale.getLanguage()) {
		case "az":
		case "tr":
		case "crh":
		case "kk":
		case "krc":
		case "tt":
			var lower = "iı";
			var upper = "İI";
			this._setUpMap(lower, upper);
			break;
		case "fr":
			if (this.up && this.locale.getRegion() !== "CA") {
				this._setUpMap("àáâãäçèéêëìíîïñòóôöùúûü", "AAAAACEEEEIIIINOOOOUUUU");
			}
			break;
	}
	
	if (ilib._getBrowser() === "ie") {
		// IE is missing these mappings for some reason
		if (this.up) {
			this.mapData['ς'] = 'Σ';
		}
		this._setUpMap("ⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗⲙⲛⲝⲟⲡⲣⲥⲧⲩⲫⲭⲯⲱⳁⳉⳋ", "ⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⳀⳈⳊ"); // Coptic
		// Georgian Nuskhuri <-> Asomtavruli
		this._setUpMap("ⴀⴁⴂⴃⴄⴅⴆⴇⴈⴉⴊⴋⴌⴍⴎⴏⴐⴑⴒⴓⴔⴕⴖⴗⴘⴙⴚⴛⴜⴝⴞⴟⴠⴡⴢⴣⴤⴥ", "ႠႡႢႣႤႥႦႧႨႩႪႫႬႭႮႯႰႱႲႳႴႵႶႷႸႹႺႻႼႽႾႿჀჁჂჃჄჅ");	
	}
};

ilib.CaseMapper.prototype = {
	/** 
	 * @private 
	 */
	_charMapper: function(string) {
		if (!string) {
			return string;
		}
		var input = (typeof(string) === 'string') ? new ilib.String(string) : string.toString();
		var ret = "";
		var it = input.charIterator();
		var c;
		
		while (it.hasNext()) {
			c = it.next();
			if (!this.up && c === 'Σ') {
				if (it.hasNext()) {
					c = it.next();
					var code = c.charCodeAt(0);
					// if the next char is not a greek letter, this is the end of the word so use the
					// final form of sigma. Otherwise, use the mid-word form.
					ret += ((code < 0x0388 && code !== 0x0386) || code > 0x03CE) ? 'ς' : 'σ';
					ret += c.toLowerCase();
				} else {
					// no next char means this is the end of the word, so use the final form of sigma
					ret += 'ς';
				}
			} else {
				if (this.mapData[c]) {
					ret += this.mapData[c];
				} else {
					ret += this.up ? c.toUpperCase() : c.toLowerCase();
				}
			}
		}
		
		return ret;
	},

	/** @private */
	_setUpMap: function(lower, upper) {
		var from, to;
		if (this.up) {
			from = lower;
			to = upper;
		} else {
			from = upper;
			to = lower;
		}
		for (var i = 0; i < upper.length; i++) {
			this.mapData[from[i]] = to[i];
		}
	},

	/**
	 * Return the locale that this mapper was constructed with. 
	 * @returns {ilib.Locale} the locale that this mapper was constructed with
	 */
	getLocale: function () {
		return this.locale;
	},
		
	/**
	 * Map a string to lower case in a locale-sensitive manner.
	 * 
	 * @param {string|undefined} string
	 * @return {string|undefined}
	 */
	map: function (string) {
		return this._charMapper(string);
	}
};
/**
 * @license
 * Copyright © 2012-2015, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * ilib-lg-inc.js - metafile that includes a reasonable set of other js files
 */

/* !depends
ilibglobal.js
daterangefmt.js
date.js
calendar/gregorian.js
calendar/gregoriandate.js
calendar/thaisolar.js
calendar/thaisolardate.js
calendar/persianastro.js
calendar/persianastrodate.js
calendar/ethiopic.js
calendar/ethiopicdate.js
numprs.js
numfmt.js
julianday.js
datefmt.js
calendar.js
util/utils.js
locale.js
strings.js
durfmt.js
resources.js
localeinfo.js
daterangefmt.js
scriptinfo.js
maps/casemapper.js
*/
