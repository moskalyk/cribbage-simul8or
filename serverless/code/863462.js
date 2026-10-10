/*
    check for winner
*/
module.exports.serverless = async function (game_id, player_id) {
    const currentScore = await db.kv('/data').get(game_id+":score:"+player_id);
    if(JSON.parse(currentScore).status != false && JSON.parse(currentScore).v.leading >= 121) {
        /*const currentScore = await db.kv('/data').put();*/
        console.log(true);
    }
    else console.log(false);
};
