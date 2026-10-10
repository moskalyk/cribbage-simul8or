/*
    score crib
*/
module.exports.serverless = async function (game_id, crib_cards, access_card, invited_patp, message_link, message_link_two, player_id) {
    game_id = message_link_two;
    
    const gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);

    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 9){
        const score = await vm('1687').serverless(game_id, crib_cards, access_card, false);
        
        /* asign score */
        await vm('755005').serverless(game_id, player_id, score);
        await db.kv('/data').put(game_id+":game_state", 2);
        
        console.log(true)
        return true;
    } else {
        console.log(false);
        return false;
    }
};
