 jQuery Extended Cookie Plugin v1.1 (2014)
============

Rewritten plugin to support better integration with $.cookie and $.super_cookie plugins and options
 
Removed console guff and optimised code to reduce size further

Included minified version for those who want to use it right now

 
Tom Taylor - 04/06/14 - http://tommytaylor.co.uk


*Based on the original https://github.com/fgiasson/jquery-enhanced-cookie by Frederick Giasson (2012)
*Most if not all of this version of the plugin should be backwards compatable! (*maybe)


Introduction
============

The enhanced version of the jQuery Cookie plugin is based on Klaus Hartl's [jQuery Cookie pluging](https://github.com/carhartl/jquery-cookie) and Frederick Giasson original version [jquery-enhanced-cookie](https://github.com/fgiasson/jquery-enhanced-cookie/) ~~The code of the <code>chunkedcookie</code> function comes from the original jQuery Cookie plugin.~~ This plugin will now reuse $.cookie plugin methods.

This extension to the jQuery Cookie plugin adds the capability to save content that is bigger than 4096 bytes long using two different mechanism: the usage of HTML5's localStorage, or the usage of a series of cookies where the content is chunked and saved. This extension is backward compatible with the jQuery Cookie plugin and its usage should be transparent to the users. Even if existing cookies have been created with the normal Cookie plugin, they will still be usable by this new extension. The usage syntax is the same, but ~~3~~ 5 new options have been created - compared with the original $.cookie plugin.


New-ish Default Options
===========

* <code>mcs</code> - Set the default value (3000) of the maxChunkSize (mcs) option, set average for all browsers (see http://browsercookielimits.x64.me/).
* <code>mnc</code> - Set the default value (20) of the maxNumCookies (mnc) option, set average for all browsers, IE8+ set to 30 or 50+.
* <code>cpf</code> - Set the default postfix value ('-cc' followed by int) of cookie name when data is chunked into multiple cookies (eg: 'testDetails-cc1', etc).

New Main Options
===========

* <code>uls</code> - Enable the use of Local/Session Storage (default: true - its 2014!), can be disabled if only enhanced cookie support is required.
* <code>ucc</code> - Enable the chunked cookie reader and remover when Local/Session Storage is enabled (default: false) to work with older cookies as a temporary measure.

Any of the above options can be set globally before $.cookie is requested (to disable this by default instead of it being enabled) and when you create or read a cookie - similar to the $.cookie options like 'raw' and 'json' which will also still work:

```javascript
$.cookie.uls = 0; //false, disable
```



How Does This Extension Works?
==============================

* It uses the HTML5 <code>localStorage</code> capabilities of the browser if this feature is available instead of relying on the cookies. However, if cookies are needed by the developer, this feature can be turned off with the <code>useLocalStorage = false</code> option
* If the <code>localStorage</code> option is disable, or simply not available on a browser, and if the content is bigger than the limit of the size of a cookie, then this extension will chunk the input content, and save it in multiple cookies

If the <code>useLocalStorage (uls)</code> is <code>true</code>, then the plugin will try to see if the HTML5 <code>localStorage</code> mechanism is available on the browser. If it is, then it will use that local storage to save and retrieve content to the browser. If it is not, then the plugin will act like if <code>useLocalStorage</code> is <code>false</code> and the process will continue by using cookies to save and read that content from the browser.

If <code>useLocalStorage (uls)</code> is <code>false</code>, or if the HTML5 <code>localStorage</code> mechanism is not available on the browser, then the plugin will check if the content is bigger than the <code>maxChunkSize (mcs)</code> option, than all the chunks will be saved in different cookies until it reaches the limit imposed by the <code>maxNumberOfCookies (mnc)</code> option.

If cookies are used, then two use-cases can happen:

* The content is smaller than or equal to <code>maxChunkSize</code>
* The content is bigger than <code>maxChunkSize</code>

If the content is smaller than or equal to <code>maxChunkSize</code> than only one cookie will be created by the browser. The name of the cookie will be the value provided to the key parameter.

If the content is bigger than <code>maxChunkSize (mcs)</code> than multiple cookies will be created, one per chunk. The convention is that the name of the first cookie is the value provided to the <code>key</code> parameter. The name of the other chunks is the value provided to the <code>key</code> parameter with the chunk indicator <code>-ccChunkNum</code> append to it. For example, if we have a cookie with a content of 10000 bytes that has <code>maxChunkSize</code> defined to 4000 bytes, then these three cookies would be created:

* <code>cookie-name</code>
* <code>cookie-name-cc1</code>
* <code>cookie-name-cc2</code>


The prefix <code>-cc</code> can be changed by setting <code>cookiePostFix (cpf)</code> value


Usage
=====

Create a Cookie
---------------



```javascript
$.cookie('my-cookie', "the-content-of-my-cookie", { expires: 365, path: "/" });
```

By default, this value will be persisted in the localStorage if the browser supports it, and not in a cookie. So, let's see how to force the plugin to save the content in a cookie by using the useLocalStorage (uls) option:

```javascript
$.cookie('my-cookie', "the-content-of-my-cookie", {uls: 0, expires: 365, path: "/" });
```

Delete a Cookie
---------------

```javascript
$.cookie('my-cookie', null);
```

You really should use $.removeCookie thats available in the latest $.cookie plugins:

```javascript
$.removeCookie('my-cookie');
```

With that call, the plugin will try to remove my-cookie both in the localStorage and in the cookies.

Read a Cookie
-------------

```javascript
var value = $.cookie('my-cookie');
```

With this call, value will get the content that has been saved in the localStorage, or the cookies. This will depend if the localStorage was available in the browser.

Now, let's see how to force reading the cookies by bypassing the localStorage mechanism:

```javascript
var value = $.cookie('my-cookie', {uls: 0});
```

Note that if the cookie is not existing for a <code>key</code>, then the <code>$.cookie()</code> function will return ~~<code>null</code>~~ <code>undefined</code> - just like the $.coookie plugin would.

Using Limitations
-----------------

Let's see how to use the <code>maxNumberOfCookies (mnc)</code> and <code>maxChunkSize (mcs)</code> options to limit the size and the number of cookies to be created.

With this example, the content will be saved in multiple cookies of 1000 bytes each up to 30 cookies:

```javascript
var value = $.cookie('my-cookie', "the-content-of-my-cookie-is-10000-bytes-long...", {uls: 0, mcs : 1000, mnc : 30, expires: 365, path: "/" });
```
