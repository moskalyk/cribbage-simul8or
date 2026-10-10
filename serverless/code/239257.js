/*
    pegging
*/
module.exports.serverless = async function (placed_card, host_patp, player_id, message_link_two, invited_patp, /*players*/) {
    game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);

    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 7){
        /// place carrd
        // get card from deck, is valid
        const hand = await db.kv('/data').get(game_id + ':hand:' + player_id);
    
        if(JSON.parse(hand).v.includes(placed_card)){
            const placedIndex = hand.indexOf(placed_card);
            
            await db.kv('/data').put(game_id+':pegging_hand:' + player_id, cards.splice(index, 1));
            
            /* add to shown cards */
            await db.kv('/data').put(game_id+':pegging', placed_card);
            
            if(player_id == invited_patp){
                await db.kv('/data').put(game_id+':pegging_turn', host_patp);
            } else {
                await db.kv('/data').put(game_id+':pegging_turn', invited_patp);
            }
            /* check score */
            const score = await vm('1687').serverless(game_id, hand, null, true);
            /* asign score */
            if(score > 0) await vm('755005').serverless(game_id, player_id, score);
            
            
            /* check equals 31, assign points */
            const count = await vm('486294').serverless(game_id, hand);
            if(count == 31) await vm('755005').serverless(game_id, player_id, score);
            
            /* check for end of pegging */
            const hostCards = await db.kv('/data').get(game_id+':pegging_hand:' + host_patp);
            const invitedCards = await db.kv('/data').get(game_id+':pegging_hand:' + invited_patp);
            
            if((hostCards.length + invitedCards.length) == 0) await db.kv('/data').put(game_id+":game_state", 8);
        } else {    
            console.log(false);
        }
        
        
    } else {
        console.log(false);
    }
};
