var http = require('http')
var fs = require('fs');
var demofile = require('demofile');

http.createServer((req, res) => {
  fs.readFile('demo.dem', function(err, buffer) {
    const demoFile = new demofile.DemoFile();
   
    demoFile.gameEvents.on("player_death", e => {
      const victim = demoFile.entities.getByUserId(e.userid);
      const victimName = victim ? victim.name : "unnamed";
   
      // Attacker may have disconnected so be aware.
      // e.g. attacker could have thrown a grenade, disconnected, then that grenade
      // killed another player.
      const attacker = demoFile.entities.getByUserId(e.attacker);
      const attackerName = attacker ? attacker.name : "unnamed";
   
      const headshotText = e.headshot ? " HS" : "";
   
      console.log(`${attackerName} [${e.weapon}${headshotText}] ${victimName}`);
    });
   
    demoFile.parse(buffer);
  });
}).listen(8080);