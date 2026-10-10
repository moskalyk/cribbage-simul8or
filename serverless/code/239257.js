/*
    pegging
*/
module.exports.serverless = async function (placed_card, host_patp, player_id, message_link, message_link_two, invited_patp, /*players*/) {
    game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);

    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 7){
        /// place carrd
        // get card from deck, is valid
        const hand = JSON.parse(await db.kv('/data').get(game_id + ':hand_dealt:' + player_id)).v;
    
        if(hand.includes(placed_card)){
            const placedIndex = hand.indexOf(placed_card);
            hand.splice(placedIndex, 1)
            
            let peggingHand = JSON.parse(await db.kv('/data').get(game_id+':pegging_hand:' + player_id));
            if(peggingHand.status == false) peggingHand = {v: []}
            console.log('phv', peggingHand)
            peggingHand.v.push(placed_card)
            const newPeggingHand = peggingHand.v
            
            await db.kv('/data').put(game_id+':pegging_hand:' + player_id, newPeggingHand);
            
            /* add to shown cards */
            let peggingShown = JSON.parse(await db.kv('/data').get(game_id+':pegging'));
            if(peggingShown.status == false) peggingShown = {v: []}

            console.log('ann',[...peggingShown.v, placed_card])
            
            await db.kv('/data').put(game_id+':pegging', [...peggingShown.v, placed_card]);
            
            if(player_id == invited_patp){
                await db.kv('/data').put(game_id+':pegging_turn', host_patp);
            } else {
                await db.kv('/data').put(game_id+':pegging_turn', invited_patp);
            }
            /* check score */
            const score = await vm('1687').serverless(game_id, hand, null, true);
            /* asign score */
            console.log('SCORE', score)
            if(score > 0) await vm('755005').serverless(game_id, player_id, score);
            
            
            /* check equals 31, assign points */
            const count = await vm('486294').serverless(game_id, hand);
            if(count == 31) await vm('755005').serverless(game_id, player_id, 2);
            
            /* check for end of pegging */
            const hostCards = await db.kv('/data').get(game_id+':pegging_hand:' + host_patp);
            const invitedCards = await db.kv('/data').get(game_id+':pegging_hand:' + invited_patp);
            
            if((hostCards.length + invitedCards.length) == 0) {
                await db.kv('/data').put(game_id+":game_state", 8);
                return true
            }
            return false;
        } else {    
            console.log(false);
            return false;
        }
        
        
    } else {
        console.log(false);
    }
};
