const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer') // v1
const shortid = require('shortid')
const path = require('path')
const fs = require('fs')
const demofile = require('demofile')

const upload = multer() // for parsing multipart/form-data

const app = express()
const port = 3030

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, XMLHttpRequest");
  next();
})
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/kill-feed', upload.single('teste'), async (req, res) => {
  console.log(req.file)
  const buffer = req.file.buffer

  const demoFile = new demofile.DemoFile();
  
  let playerDeath = []

  demoFile.gameEvents.on("player_death", e => {
    const victim = demoFile.entities.getByUserId(e.userid);
    const victimName = victim ? victim.name : "unnamed";
  
    // Attacker may have disconnected so be aware.
    // e.g. attacker could have thrown a grenade, disconnected, then that grenade
    // killed another player.
    const attacker = demoFile.entities.getByUserId(e.attacker);
    const attackerName = attacker ? attacker.name : "unnamed";
  
    const headshotText = e.headshot ? " HS" : "";
  
    playerDeath.push({ 
      attackerName,
      weapon: e.weapon,
      headshotText: headshotText,
      victimName: victimName
    })

    console.log(`${attackerName} [${e.weapon}${headshotText}] ${victimName}`);
  });

  demoFile.on("end", e => {
    res.json(playerDeath)
  });

  demoFile.parse(buffer);
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))