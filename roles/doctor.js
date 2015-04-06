module.exports = function() {

  return {

  name: "Docteur",
  desc: "Vous pouvez protéger quelqu'un <strong>chaque nuit</strong>, sauf vous-même. Vous devez aider les villageois à repousser la Mafia...",
  side: "village",

  actions: {
    protect: {
      isAvailable: function(player) {
        return player.room.currentStage === "mafia" && !player.roles.dead && !player.docHasPlayed;
      },
      type: "select",
      options: require("../lib/actions").getPlayerSelectOptions("Protéger"),
      execute: function(player, choice) {
        choice = player.room.resolveUsername(choice);
        if(!choice || player === choice.player)
          return;

        player.docHasPlayed = true;
        choice.player.isSafeByDoc  = true;
        player.sendAvailableActions();
        player.message("<div class='tour_spes'><strong><i>"+ choice.username +" est protégé de la mort pour cette nuit.</i></strong></div>");

      }
    }
  },
  channels: {},

  beforeAll: function(room) {
    room.gameplay.events.on("beforeDawn", function() {
      room.players.forEach(function(p) {
        if(p.player.isSafeByDoc && p.player.pendingDeath)
          p.player.pendingDeath.pop();
      });
    });

    room.gameplay.events.on("afterDusk", function() {
      room.players.forEach(function(p) {
        p.player.isSafeByDoc  = false;
        p.player.docHasPlayed = false;
      });
    });
  }

  }

}