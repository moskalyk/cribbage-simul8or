/*
    has everyone scored    
*/
module.exports.serverless = async function (game_id, host_patp, invited_patp, message_link, message_link_two, /*players*/) {
    game_id = message_link_two;
    
    const gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);

    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 8){
        /* check for both to complete scoring and crib */
        const boolHost = await db.kv('/data').get(game_id+":game_state_scored:" + host_patp);
        const boolInvited = await db.kv('/data').get(game_id+":game_state_scored:" + invited_patp);

        if(boolHost && boolInvited) {
            await db.kv('/data').put(game_id+":game_state", 9);
        } else {
            console.log(false)
        }
    } else {
        console.log(false);
    }
};
