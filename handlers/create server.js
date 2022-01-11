/* eslint-disable camelcase */
/* eslint-disable no-eval */
const fetch = require('node-fetch')
const nodemailer = require('nodemailer')
const functions = require('../functions.js')
const renew_server = require('./renew server.js')

module.exports.load = async function (app, ifValidAPI, ejs) {
  app.post('/servers/create',

    process.rateLimit({
      windowMs: 500,
      max: 1,
      message: 'You have been requesting this endpoint too fast. Please try again.'
    }),

    async (req, res) => {
      const redirects = process.pagesettings.redirectactions.create_server
      if (!req.session.data || !req.session.data.userinfo) return functions.doRedirect(req, res, redirects.notsignedin)

      const { total, current, packageinfo } = await functions.getUserResource(req)

      if (current.servers >= total.servers) return functions.doRedirect(req, res, redirects.exceedsserverplan)

      const location = req.body.location
      if (typeof location !== 'string') return functions.doRedirect(req, res, redirects.locationmustbeastring)
      if (!process.env.locations[location]) return functions.doRedirect(req, res, redirects.invalidlocation)

      if (!process.env.locations[location].enabled) return functions.doRedirect(req, res, redirects.locationdisabled)

      const egg = req.body.egg
      if (typeof egg !== 'string') return functions.doRedirect(req, res, redirects.eggmustbeastring)
      if (!process.env.eggs[egg]) return functions.doRedirect(req, res, redirects.invalidegg)

      if (Array.isArray(process.env.locations[location].package)) {
        if (!process.env.locations[location].package.includes(packageinfo.id)) { return functions.doRedirect(req, res, redirects.lockedlocationfrompackage) }
      }

      const name = req.body.name

      if (typeof name !== 'string') return functions.doRedirect(req, res, redirects.namemustbeastring)
      if (name.length < 1) return functions.doRedirect(req, res, redirects.nameistooshort)
      if (name.length > 191) return functions.doRedirect(req, res, redirects.nameistoolong)

      const memory = await functions.parseNumber(req.body.memory)
      const disk = await functions.parseNumber(req.body.disk)
      const cpu = await functions.parseNumber(req.body.cpu)

      if (!memory || !disk || !cpu) return functions.doRedirect(req, res, redirects.invalidresources)

      if (
        memory + current.memory > total.memory ||
            disk + current.disk > total.disk ||
            cpu + current.cpu > total.cpu
      ) return functions.doRedirect(req, res, redirects.resourcesexceedplan)

      for (const [type, value] of Object.entries(process.env.eggs[egg].minimum)) {
        if (value && eval(type) < value) { return functions.doRedirect(req, res, redirects.toolittleresources) }
      }

      for (const [type, value] of Object.entries(process.env.eggs[egg].maximum)) {
        if (value && eval(type) > value) { return functions.doRedirect(req, res, redirects.toomanyresources) }
      }

      const specs = process.env.eggs[egg].info
      specs.user = req.session.data.panelinfo.id

      if (!specs.limits) {
        specs.limits = {
          swap: 0,
          io: 500,
          backups: 0
        }
      }

      if (process.env.locations[location].renewal) {
        const cost = process.env.renewal.renew_fee
        const coins = await process.db.getCoinsByDiscordID(req.session.data.dbinfo.discord_id)

        if (coins < cost) {
          req.session.variables = {
            cost: cost,
            amount_needed: cost - coins
          }

          return functions.doRedirect(req, res, redirects.insufficientcoins)
        }

        await process.db.addCoinsByDiscordID(req.session.data.dbinfo.discord_id, -cost)
      }

      specs.name = name
      specs.limits.memory = memory
      specs.limits.disk = disk
      specs.limits.cpu = cpu

      if (!specs.deploy) {
        specs.deploy = {
          locations: [],
          dedicated_ip: false,
          port_range: []
        }
      }

      specs.deploy.locations = [parseFloat(location)]

      const serverinfo_req = await fetch(
            `${process.env.pterodactyl.domain}/api/application/servers`,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.pterodactyl.key}`,
                Accept: 'application/json'
              },
              body: JSON.stringify(specs)
            }
      )

      if (serverinfo_req.statusText !== 'Created') {
        console.log(await serverinfo_req.text())
        return functions.doRedirect(req, res, redirects.erroroncreation)
      } else {
      if(process.env.email_system.enabled == true){ //check if email_system is enabled or no.
      
      var contentHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
      <div class="bg-dark">
       <a href="${process.env.email_system.extra.dashboard_url}" style="text-decoration:none"><header class="text-center fs-4 py-3 text-white">
        <img src="https://spiralnodes.xyz/assets/images/icon-modified.png" alt="" width="50" height="50">
        ${process.env.email_system.extra.dashboard_name}
       </header></a>
        </div>
       <div class="ms-0 py-4">
       <h1 class="text-black text-center">Server ${name} Created!</h1>
       <h4 class="text-center">You are receiving this email because you have created a server in SpiralNodes with the following specifications:</h4>
       <center><div class="card text-center justify-content-center" style="width:260px">
       <ul class="list-unstyled">
         <li>RAM: ${memory} MB</li>
         <li>DISK: ${disk} MB</li>
         <li>CPU: ${cpu}%</li>
       </ul>
       </div></center>
       <div class="container text-center my-4">
       <button class="btn btn-primary" onclick="window.location.href = '${process.env.email_system.extra.dashboard_url}'">View more information</button>
       <p>If the button doesnt work <a href="${process.env.email_system.extra.dashboard_url}">Click here</a></p>
         </div>
        </div>
    `; 
      // here is the SMTP configuration 
      async function main() {

        let transporter = nodemailer.createTransport({
          host: `${process.env.email_system.smtp_host}`,
          port: process.env.email_system.smtp_port,
          secure: false, // if your smtp port is 465 you need to enable this.
          auth: {
            user: process.env.email_system.smtp_user, // smtp user
            pass: process.env.email_system.smtp_password, // smtp password
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: process.env.email_system.smtp_user, // email will be send from this email 
          to: req.userinfo.email, // User email
          subject: "Server Created - Dashactyl", // You can change this 
          html: contentHTML, // you can edit the email format in var contentHTML section
        });
      
        console.log("Message sent: %s", info.messageId); // Send a console log with email message id (you can delete this line.)
      }
      
      main().catch(console.error); // this checks for an error
      }

      }

      const serverinfo = await serverinfo_req.json()
      req.session.data.panelinfo.relationships.servers.data.push(serverinfo)

      if (process.env.locations[location].renewal) await renew_server.set(serverinfo.attributes.id)

      setTimeout( // setTimeout() to prevent the renewal timer accidently saying "None."
        () => {
          return functions.doRedirect(req, res, redirects.createdserver)
        }, 250
      )
    })
}
