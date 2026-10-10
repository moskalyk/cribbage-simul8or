/*
    check if can go in pegging
*/
module.exports.serverless = async function (game_id, host, invited_patp, player_id, message_link, message_link_two) {
    game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 7){
            const hand = JSON.parse(await db.kv('/data').get(game_id + ':hand:' + player_id)).v;
            const placedCards = JSON.parse(await db.kv('/data').get(game_id+':pegging_hand:' + player_id)).v;
            
            for(let i < 0; i < hand.length; i++){
                const init = placedCards.includes(hand[i])
                if(init){
                    const index = hand.indexOf(hand[i])
                    hand.splice(index, 1)
                }
            }
            
            const leftover = hand
            console.log(leftover)
            
            const shownCards = await db.kv('/data').get(game_id+':pegging');
            console.log('shownCards')
            console.log(shownCards)
            
            const count = await vm('486294').serverless(game_id, JSON.parse(shownCards).v);
            
            if(JSON.parse(leftover).v.map(c => {return count + (c % 13) <= 31}).contains(true)){
                console.log('condo');
                return true
            } else {
                return false
            }
    }
};
