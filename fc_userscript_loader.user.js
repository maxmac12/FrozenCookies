// ==UserScript==
// @name           Frozen Cookies
// @version        github-latest
// @description    Userscript to load Frozen Cookies written by maxmac12, forked from by darkroman
// @author         maxmac12
// @homepage       https://github.com/maxmac12/FrozenCookies
// @include        http://orteil.dashnet.org/cookieclicker/
// @updateURL      https://maxmac12.github.io/FrozenCookies/fc_userscript_loader.user.js
// @downloadURL    https://maxmac12.github.io/FrozenCookies/fc_userscript_loader.user.js
// @run-at         document-start
// ==/UserScript==

// Master:    https://github.com/maxmac12/FrozenCookies/master/
// Github.io: http://maxmac12.github.io/FrozenCookies/

function LoadFrozenCookies() {
    Game.LoadMod('https://maxmac12.github.io/FrozenCookies/frozen_cookies.js');
}

window.addEventListener("load", LoadFrozenCookies, false);
// It's not the best way but Chrome doesn't work with addEventListener... :(
// Delay load by 5 seconds to allow the site to load itself first.)
window.setTimeout(LoadFrozenCookies, 5000);
