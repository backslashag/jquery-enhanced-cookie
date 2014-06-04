/**
 * jQuery Extended Cookie Plugin v1.1 (2014)
 * 
 *	Rewritten plugin to support better integration with $.cookie and $.super_cookie plugins and options
 *  Removed console guff and optimised code to reduce size further
 *	Tom Taylor - 04/06/14 - http://tommytaylor.co.uk
 * 
 *  Based on the original https://github.com/fgiasson/jquery-enhanced-cookie by Frederick Giasson (2012)
 *  Most if not all of this version of the plugin should be backwards compatable! (*maybe)
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
    var w = window, s = {}, g = {
			ls: 0, 
			ss: 0, 
			jse: w.JSON && w.JSON.parse, 
			u: undefined
		},
		encode = function(s) {
			return config.raw ? s : encodeURIComponent(s);
		},
		decode = function(s) {
			return config.raw ? s : decodeURIComponent(s);
		},
		starse = function(v,m) {
			return (g.jse && config.json ? (m ? encode(w.JSON.stringify(v)) : decode(w.JSON.parse(v))) : String(v));
		},
		imp = {
			read: {
				storage : function(k) {
					if (g.ls||g.ss) {
						var cs = (k in g.ls? g.ls : (k in g.ss ? g.ss : 0));
						if (cs) {
							s.v = cs.getItem(decode(k))
							if (s.v !== s.u && s.v !== null) {
								return(starse(s.v,0)); 
							}  
						}							
					}
				},
				cookie : function(k) {
					if ((!s.st || !s.o.uls || s.st && s.o.ucc) && $.cookie) {
						var v = "",
							n = s.o.mnc;
						for (i = 0; i < n; i++) {
							v = $.cCookie(k + (i !== 0 ? s.o.cpf + i : ''));
							if (v !== s.u) {
								s.v += v;
							} else {
								if(i === 0) {
									return(s.u);
								}
								break;
							}
						}
					}
				}
			},
			add : {
				storage : function(k, v) {
					if (s.o.uls && s.st) {
						s.d = starse(v,1);
						s.st.setItem(encode(k), s.d);
					} 
				},
				cookie : function(k, v) {
					if ($.cCookie) {
						var vm = v.match(new RegExp(".{1,"+s.o.mcs+"}","g"));
						if (vm !== s.u) {
							var n = vm.length;
							for (i = 0; i < n; i++) {
								s.d = $.cCookie(k + (i !== 0 ? s.o.cpf + i : ''), vm[i], s.o);
							}
						} else {
							s.d = $.cCookie(k, v, s.o); 
						}      
					} 		
				}
			},
			remove : {
				storage : function(k) {
					if (s.st && k in s.st) {
						s.st.removeItem(decode(k));
					}
				},
				cookie : function(k) {
					if ((!s.st || !s.o.uls || s.st && s.o.ucc) && $.cCookie) {
						var o = $.extend(1, s.o, { expires: -1 }),
							n = s.o.mnc,tc; 
						for (i = 0; i < n; i++) {
							tc = k + (i !== 0 ? o.cpf + i : '');
							
							if ($.cCookie(tc) !== s.u) {
								$.cCookie(tc, null, o);
							} else {
								break;
							}
						}    
					}
				}
			}
		},
		config = $.enhancedCookie = function(k, v, o) {
		
			if (!arguments.length > 0 || $.isFunction(v)) {
				return;
			}
			
			s = {};
			
			s.u = g.u;
			
			if (o === s.u && v !== s.u) {
				o = v;
			}

			s.o = $.extend({}, config.defaults, $.extend(1, config.options, $.extend(1, config, o))) || {}; //get default options, and set overrides
			
			s.st = (s.o.expires !== s.u ? g.ls : g.ss); //switch local storage type, regardless of state

			
			if (String(v) !== "[object Object]" && v !== s.u) {// set or remove data
			
				s.d = null;
				
				if (v === null || v === s.u) {
					imp.remove.storage(k);
					imp.remove.cookie(k);
				} else {
					if (s.o.uls && s.st) {
						imp.add.storage(k, v);
						if (s.o.ucc) {
							imp.remove.cookie(k);
						}
					} else {
						imp.add.cookie(k, v);
					}
				}

				return(s.d);
				
			} else {// retrieve data
			
				imp.read.storage(k);
				imp.read.cookie(k);

				// Return the entire content from all the cookies that may have been used for that value.
				return(s.v);
			}
			
		};

	config.defaults = {
		// Set the default value (3000) of the maxChunkSize (mcs) option, set average for all browsers (see http://browsercookielimits.x64.me/).
		'mcs' : 3000,
		// Set the default value (20) of the maxNumCookies (mnc) option, set average for all browsers, IE8+ set to 30 or 50+.
		'mnc' : 20,
		// Set the default postfix value ('-cc' followed by int) of cookie name when data is chunked into multiple cookies (eg: 'testDetails-cc1', etc).
		'cpf' : '-cc'
	};
	config.options = {
		// Enable the use of Local/Session Storage (default: true - its 2014!), can be disabled if only enhanced cookie support is required.
		'uls' : 1,
		// Enable the chunked cookie reader and remover when Local/Session Storage is enabled (default: false) to work with older cookies as a temporary measure.
		'ucc' : 0
	};
	
	(function(w,g){
		var s = [{n: 'local',t: 'ls'},{n: 'session',t: 'ss'}],
			i,o,r,ts,l = s.length;
		for (i = 0; i < l; i++) {
			o = s[i];
			r = o.n+"Storage";
			if (!g[o.t] && r in w) {
				try {
					ts = w[r]; //lets reuse init of localStorage :)
					ts.setItem(r, 1);
					ts.removeItem(r);
					g[o.t] = ts;
				} catch (e) { //PrivateBrowsingError
					// iOS Private Browsing mode will throw a "QUOTA_EXCEEDED_ERRROR DOM Exception 22" error
				}
			}
		}
	})(w,g);
	
	if ($.cookie) { //set cCookie as the cookie plugin if exists, as we'll replace cookie with enhancedCookie ;)
		$.cCookie = (function($){
			return $.cookie;
		}($));
		$.cookie = $.extend(1, $.cookie, $.enhancedCookie);
		$.cookie = $.enhancedCookie;
		
		if ($.removeCookie) {
			$.removeCookie = function(k, o) {
				return $.cookie(k, null, o || {expires: -1});
			};
		}
	}

}));
