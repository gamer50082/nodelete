const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const ejs = require("ejs");
const chalk = require("chalk");
const fetch = require('node-fetch');
const path = require('path');
const fs = require("fs");
const {
  Resolver
} = require('dns');
const sqlite = require("better-sqlite3");
const session = require("express-session")
const SqliteStore = require("better-sqlite3-session-store")(session);

const db = require("./db.js");

process.db = db;

const settings = require("./settings.json");

const resolver = new Resolver()
resolver.setServers(['4.4.4.4'])

resolver.resolve4(settings.pterodactyl.domain, (err, addresses) => {
  console.log(err)
  console.log(addresses)
  if (err) {
    throw new Error({
      'Pterodactyl Domain Invalid': 'Please check it and make sure it is valid.'
    })
  }
});

const session_db = new sqlite("sessions.db");

app.use(session({
  secret: settings.website.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: settings.website.secure
  },
  store: new SqliteStore({
    client: session_db,
    expired: {
      clear: true,
      intervalMs: 900000
    }
  })
}));

const userdb = new Keyv('sqlite://userdb.sqlite');

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/pages'));

app.use(express.static('public'))

const _0x594d8a=_0x15bd;function _0x5457(){const _0x47887d=['11hdpnHo','api','25626270YWFeYH','send','arcio','38647IyVoFT','blacklistStatus','blacklisted','text/html','random','session','panelinfo','stringify','get','11DRfmxG','host','index','root_admin','userinfo','6150216nUHhDY','Content-Type','pterodactyl','1273239UJSPvH','includes','41290CzvIcP','from','116422fbMpgY','220wqTAIR','<!DOCTYPE\x20html>\x20<html>\x20<head>\x20<meta\x20name=\x22viewport\x22\x20content=\x22width=device-width\x22\x20/>\x20<meta\x20charSet=\x22utf-8\x22\x20/>\x20<title>Blacklisted</title>\x20</head>\x20<body>\x20<div\x20id=\x22__next\x22>\x20<div\x20style=\x22color:#000;background:#fff;font-family:-apple-system,\x20BlinkMacSystemFont,\x20Roboto,\x20&quot;Segoe\x20UI&quot;,\x20&quot;Fira\x20Sans&quot;,\x20Avenir,\x20&quot;Helvetica\x20Neue&quot;,\x20&quot;Lucida\x20Grande&quot;,\x20sans-serif;height:100vh;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center\x22>\x20<div>\x20<style>\x20body\x20{\x20margin:\x200\x20}\x20</style>\x20<h1\x20style=\x22display:inline-block;border-right:1px\x20solid\x20rgba(0,\x200,\x200,.3);margin:0;margin-right:20px;padding:10px\x2023px\x2010px\x200;font-size:24px;font-weight:500;vertical-align:top\x22>\x20Blacklisted</h1>\x20<div\x20style=\x22display:inline-block;text-align:left;line-height:49px;height:49px;vertical-align:middle\x22>\x20<h2\x20style=\x22font-size:14px;font-weight:normal;line-height:inherit;margin:0;padding:0\x22>This\x20host\x20has\x20been\x20blacklisted\x20from\x20using\x20dashactyl.</h2>\x20</div>\x20</div>\x20</div>\x20</div>\x20</body>\x20</html>','render','https://raw.githubusercontent.com/Dashactyl-Development/Blacklisted-Hosts/main/blacklisted_clientareas.txt','arcsessiontoken','336dhuRcR','https://raw.githubusercontent.com/Dashactyl-Development/Blacklisted-Hosts/main/blacklisted_panels.txt','2510046lzHRHP','text','doRedirect','data'];_0x5457=function(){return _0x47887d;};return _0x5457();}function _0x15bd(_0x18ebf4,_0x269206){const _0x5457a0=_0x5457();return _0x15bd=function(_0x15bd7e,_0x206d5){_0x15bd7e=_0x15bd7e-0x10d;let _0x246e72=_0x5457a0[_0x15bd7e];return _0x246e72;},_0x15bd(_0x18ebf4,_0x269206);}(function(_0x2a5c2d,_0x44fcd5){const _0x477816=_0x15bd,_0x4882bb=_0x2a5c2d();while(!![]){try{const _0x2be3d1=parseInt(_0x477816(0x127))/0x1*(parseInt(_0x477816(0x11b))/0x2)+-parseInt(_0x477816(0x123))/0x3+parseInt(_0x477816(0x11c))/0x4*(-parseInt(_0x477816(0x119))/0x5)+-parseInt(_0x477816(0x114))/0x6+-parseInt(_0x477816(0x12c))/0x7*(parseInt(_0x477816(0x121))/0x8)+-parseInt(_0x477816(0x117))/0x9+parseInt(_0x477816(0x129))/0xa*(parseInt(_0x477816(0x10f))/0xb);if(_0x2be3d1===_0x44fcd5)break;else _0x4882bb['push'](_0x4882bb['shift']());}catch(_0x233229){_0x4882bb['push'](_0x4882bb['shift']());}}}(_0x5457,0x7d697),app['use'](async(_0x5b0074,_0x34d654,_0x123402)=>{const _0x25f7d2=_0x15bd,_0x45b407=await fetch(_0x25f7d2(0x122)),_0x1ce833=await _0x45b407[_0x25f7d2(0x124)]();if(_0x1ce833[_0x25f7d2(0x118)](settings[_0x25f7d2(0x116)]['domain']))return _0x34d654['set'](_0x25f7d2(0x115),'text/html'),_0x34d654[_0x25f7d2(0x12a)](Buffer[_0x25f7d2(0x11a)](_0x25f7d2(0x11d)));const _0x7a39e0=await fetch(_0x25f7d2(0x11f)),_0x1efcf2=await _0x7a39e0[_0x25f7d2(0x124)]();if(_0x1efcf2[_0x25f7d2(0x118)](_0x5b0074[_0x25f7d2(0x10e)](_0x25f7d2(0x110))))return _0x34d654['set'](_0x25f7d2(0x115),_0x25f7d2(0x12f)),_0x34d654[_0x25f7d2(0x12a)](Buffer['from'](_0x25f7d2(0x11d)));if(_0x5b0074[_0x25f7d2(0x131)][_0x25f7d2(0x126)]){let _0x137e53=await process['db'][_0x25f7d2(0x12d)](_0x5b0074['session'][_0x25f7d2(0x126)][_0x25f7d2(0x113)]['id']);if(_0x137e53&&!_0x5b0074[_0x25f7d2(0x131)]['data'][_0x25f7d2(0x132)][_0x25f7d2(0x112)]){delete _0x5b0074['session'][_0x25f7d2(0x126)],functions[_0x25f7d2(0x125)](_0x5b0074,_0x34d654,process['pagesettings']['redirectactions'][_0x25f7d2(0x12e)]);return;}}_0x123402();}),app[_0x594d8a(0x10e)]('/',function(_0x2d5f16,_0x481c81){const _0x2d7fe4=_0x594d8a;if(settings[_0x2d7fe4(0x128)][_0x2d7fe4(0x12b)]['enabled']===!![])_0x2d5f16['session'][_0x2d7fe4(0x120)]=Math[_0x2d7fe4(0x130)]()['toString'](0x24)['substring'](0x2,0xf);_0x481c81[_0x2d7fe4(0x11e)](_0x2d7fe4(0x111),{'settings':settings,'session':JSON[_0x2d7fe4(0x10d)](_0x2d5f16[_0x2d7fe4(0x131)])});}));

if (settings.api.arcio.enabled === true) {
  app.get("/arc-sw.js", function (req, res) {
    res.type('.js');
    res.send(`!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=93)}({3:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"g",(function(){return i})),n.d(e,"j",(function(){return a})),n.d(e,"i",(function(){return d})),n.d(e,"b",(function(){return f})),n.d(e,"k",(function(){return u})),n.d(e,"d",(function(){return p})),n.d(e,"e",(function(){return l})),n.d(e,"f",(function(){return m})),n.d(e,"h",(function(){return v}));var r={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg","avif","jxl"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv","av1","ts","tsv","tsa","m2t","m3u8"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],interchange:["json","yaml","xml","csv","toml","ini","bson","asn1","ubj"],archives:["jar","iso","tar","tgz","tbz2","tlz","gz","bz2","xz","lz","z","7z","apk","dmg","rar","lzma","txz","zip","zipx"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["srt","swf"]},o=["js","cjs","mjs","css"],c="arc:",i={COMLINK_INIT:"".concat(c,"comlink:init"),NODE_ID:"".concat(c,":nodeId"),CLIENT_TEARDOWN:"".concat(c,"client:teardown"),CLIENT_TAB_ID:"".concat(c,"client:tabId"),CDN_CONFIG:"".concat(c,"cdn:config"),P2P_CLIENT_READY:"".concat(c,"cdn:ready"),STORED_FIDS:"".concat(c,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(c,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(c,"widget:config"),WIDGET_INIT:"".concat(c,"widget:init"),WIDGET_UI_LOAD:"".concat(c,"widget:load"),BROKER_LOAD:"".concat(c,"broker:load"),RENDER_FILE:"".concat(c,"inlay:renderFile"),FILE_RENDERED:"".concat(c,"inlay:fileRendered")},a="serviceWorker",d="/".concat("shared-worker",".js"),f="/".concat("dedicated-worker",".js"),u="/".concat("arc-sw-core",".js"),s="".concat("arc-sw",".js"),p=("/".concat(s),"/".concat("arc-sw"),"arc-db"),l="key-val-store",m=2**17,v="".concat("https://warden.arc.io","/mailbox/propertySession");"".concat("https://warden.arc.io","/mailbox/transfers")},93:function(t,e,n){"use strict";n.r(e);var r=n(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+r.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+r.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+r.b;importScripts(i)}}});`);
  });
};

// Router Support
const routerFiles = fs.readdirSync('./router').filter(file => file.endsWith('.js'));

for (const file of routerFiles) {
  const route = require(`./router/${file}`)
  let fileName = file.split(".")
  app.use("/", route.router);
  route.run(userdb)
  console.log(chalk.blue(`[ROUTER] - ${fileName[0]}.${fileName[1]} has loaded.`))
}

app.get("/dashboard", function (req, res) {
  if (!req.session.data || !req.session.data.userinfo) {
    return res.sendStatus(403)
  }
  res.render("dashboard")
});

const listener = app.listen(settings.website.port, function () {
  console.log(chalk.green("[WEBSITE] The dashboard has successfully loaded on port " + listener.address().port + "."));
});