/*
    award go when pegging
*/
module.exports.serverless = async function (game_id, player_id, host_patp, invited_patp, message_link, invited_patp, message_link_two) {
    game_id = message_link_two;

    const gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);

    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 7){
        await vm('755005').serverless(game_id, player_id, 1);

        
        if(player_id == invited_patp){
            await db.kv('/data').put(game_id+':pegging_turn', host_patp);
        } else {
            await db.kv('/data').put(game_id+':pegging_turn', invited_patp);
        }
        
        const hostCards = await db.kv('/data').get(game_id+':pegging_hand:' + host_patp);
        const invitedCards = await db.kv('/data').get(game_id+':pegging_hand:' + invited_patp);
            
        /* check for end of pegging */
        if((hostCards.length + invitedCards.length) == 0) await db.kv('/data').put(game_id+":game_state", 8);

    }
};
