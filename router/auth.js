const router = require("express").Router();
const fetch = require('node-fetch');
const settings = require("../settings.json");
const CLIENT_ID = settings.discord.client_id
const CLIENT_SECRET = settings.discord.client_secret

module.exports.run = async (userdb) => {
  router.get("/login", async (req, res) => {
    res.redirect("https://discord.com/api/oauth2/authorize?client_id=886274617994535013&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code&scope=identify%20email")
  });

  router.get("/logout", async (req, res) => {
    req.session.destroy()
    res.redirect("/")
  });

  router.get("/callback", async (req, res) => {
    if (!req.query.code) res.send("No code was provided!")
    const code = req.query.code;
    let json = await fetch(
      'https://discord.com/api/oauth2/token',
      {
        method: 'post',
        body: "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&grant_type=authorization_code&code=" + encodeURIComponent(req.query.code) + "&redirect_uri=" + encodeURIComponent(settings.discord.oauth2.link + settings.discord.oauth2.callbackpath),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    if (json.ok === true) {
      let codeinfo = JSON.parse(await json.text());
      let scopes = codeinfo.scope;
      let missingscopes = [];

      if (scopes.replace(/identify/g, "") == scopes) missingscopes.push("identify");
      if (scopes.replace(/email/g, "") == scopes) missingscopes.push("email");
      //if (newsettings.api.client.bot.joinguild.enabled == true) if (scopes.replace(/guilds.join/g, "") == scopes) missingscopes.push("guilds.join");
      if (missingscopes.length !== 0) return res.send("ERROR MISSINGSCOPES Scopes: " + missingscopes.join("%20"));
      let userjson = await fetch(
        'https://discord.com/api/users/@me',
        {
          method: "get",
          headers: {
            "Authorization": `Bearer ${codeinfo.access_token}`
          }
        }
      );
      let userinfo = JSON.parse(await userjson.text());

      let check_if_banned = (await fetch(
        `https://discord.com/api/guilds/${settings.discord.guildID}/bans/${userinfo.id}`,
        {
          method: "get",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bot ${settings.discord.bot.token}`
          }
        }
      )).status;

      if (check_if_banned == 200) {
        return res.send("You are banned from the hosts discord so you cannot use this dashboard.")
      } else if (check_if_banned == 404) {
        await fetch(
          `https://discord.com/api/guilds/${settings.discord.guildID}/members/${userinfo.id}`,
          {
            method: "put",
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bot ${settings.discord.bot.token}`
            },
            body: JSON.stringify({
              access_token: codeinfo.access_token
            })
          }
        );
      } else {
        console.log(chalk.red("[ERROR] The status code contacting discord was " + check_if_banned + ", instead of 200 or 404. This means that your machine has some serious internet issues."));
      }

      if (userinfo.verified == true) {

        let ip = (settings.ip["trust x-forwarded-for"] == true ? (req.headers['x-forwarded-for'] || req.connection.remoteAddress) : req.connection.remoteAddress);
        ip = (ip ? ip : "::1").replace(/::1/g, "::ffff:127.0.0.1").replace(/^.*:/, '');

        if (settings.ip.block.includes(ip)) return res.send("ERROR IP BLOCKED")

        const userInDB = await userdb.get(userinfo.id)

        if (userInDB === null) {
          let addedPanelUser_raw = await fetch(
            `${settings.pterodactyl.domain}/api/application/users`,
            {
              method: "post",
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.pterodactyl.apikey}`, 'Accept': 'application/json' },
              body: JSON.stringify({
                "email": userinfo.email,
                "username": userinfo.id,
                "first_name": userinfo.username,
                "last_name": userinfo.discriminator
              }),
            }
          );

          const addedPanelUser = await addedPanelUser_raw.json()

          console.log(addedPanelUser.attributes.id)

          const addedUser = await users.insertMany([{ userid: userinfo.id, username: userinfo.username, useremail: userinfo.email, panelid: addedPanelUser.attributes.id, paneluuid: addedPanelUser.attributes.uuid, panelusercreatedat: addedPanelUser.attributes.created_at, availableRam: settings.dashboard.defaultRam, usedRam: 0, availableCPU: settings.dashboard.defaultCPU, usedCPU: 0, availableStorage: settings.dashboard.defaultStorage, usedStorage: 0 }]);
          console.log('Added a user to the database: ' + addedUser);
        }

        const panel_id = userInDB.panelid

        let panelinfo_raw = await fetch(
          `${settings.pterodactyl.domain}/api/application/users/${panel_id}?include=servers`,
          {
            method: "get",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.pterodactyl.apikey}` }
          }
        );

        if (await panelinfo_raw.statusText == "Not Found") return functions.doRedirect(req, res, redirects.cannotgetinfo);

        panelinfo = (await panelinfo_raw.json()).attributes;

        req.session.data = {
          userinfo: userinfo,
          panelinfo: panelinfo
        };

        res.redirect(`/dashboard`);
      }
    }
  });
}
module.exports.router = router;