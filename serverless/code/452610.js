/*
    get current score
*/
module.exports.serverless = async function (game_id, player_id, message_link, message_link_two, invited_patp) {
    game_id = message_link_two;

    const gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    if(JSON.parse(messageLinkTwo).v == message_link_two){
        const currentScore = await db.kv('/data').get(game_id+":score:"+player_id);
        return JSON.parse(currentScore).v
    } else {
        console.log(false);
        return false
    }
};
