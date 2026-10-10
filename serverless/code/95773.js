/*
    check if can go in pegging
*/
module.exports.serverless = async function (game_id, host, invited_patp, player_id, message_link, message_link_two) {
    game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 7){
            const hand = JSON.parse(await db.kv('/data').get(game_id + ':hand_dealt:' + player_id)).v;
            let placedCards = JSON.parse(await db.kv('/data').get(game_id+':pegging_hand:' + player_id));
            console.log('ha',hand)
            console.log('ha',placedCards)
            
            if(placedCards.status == false){
                await db.kv('/data').put(game_id+':pegging_hand:' + player_id, []);
                placedCards = {v: []}
            }
            
            for(let i = 0; i < hand.length; i++){
                console.log('pc',placedCards)
                const init = placedCards.v.includes(hand[i])
                if(init){
                    const index = hand.indexOf(hand[i])
                    hand.splice(index, 1)
                }
            }
            
            const leftover = hand
            console.log(leftover)
            
            let shownCards = JSON.parse(await db.kv('/data').get(game_id+':pegging'));
            console.log('shownCards')
            console.log(shownCards)
            
            if(shownCards.status == false){
                shownCards = {v: []}
                await db.kv('/data').put(game_id+':pegging:', shownCards);
            }
                        console.log(shownCards)

            const count = await vm('486294').serverless(game_id, shownCards.v);
            console.log('count', count)
            if(leftover.map(c => {return count + (c % 13) <= 31}).includes(true)){
                return true
            } else {
                return false
            }
    }
};
