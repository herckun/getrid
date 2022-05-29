//@name "Get rid of Bots"
//small and simple discord bot to get rid of suspicous accounts
//version 2.0.0

//init client and depen
require('dotenv').config()
const { Client, Intents } = require('discord.js');
const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"]  });

//function to calculate days between two unix timestamps 

function daysDiff(ts){
    var now = Date.now();
    var delta = now - ts;
    var daysDifference = Math.floor(delta/1000/60/60/24);
    return parseInt(daysDifference);
}

//Get rid function
//@param guildId - the guild it the bot should look at (make sure the bot) is in the guild and has appropriate permissions

async function getRid(guildId)
{
    let guild = client.guilds.cache.get(guildId);
    let suspicous = [];
    let members = await guild.members.fetch();
    let promises = members.map(async(m) =>{
        let threat = 0;
        let user = await client.users.fetch(m.id);
        
        //@Define threat conditions

        //user has default pfp
        if(user.avatarURL() == null){
            threat++;
        }
        //member joined the server today
        if(daysDiff(m.joinedTimestamp) < 1){
            threat++;
        }
        //user created his account today
        if(daysDiff(user.createdTimestamp) < 1){
            threat++;
        }

        //@Define action to be taken for suspicious members
        
        if(threat >= 2)
        {
            //member.kick({reason:"Reason for kick"});
            //member.ban({reason:"Reason for ban"});
            suspicous.push({threatScore:threat, member : m});
        }
        return new Promise((res, rej) => {res()});
    });
    await Promise.all(promises);
}

client.on("ready", () => {
    client.user.setActivity("KILLING",{type: "PLAYING"});
    getRid(GUILD_ID);
});

client.login(process.env.BOT_TOKEN);
