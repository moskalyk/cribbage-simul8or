/*
    flip or return access card
*/
module.exports.serverless = async function (game_id, player_ids, player_dealer, message_link, invited_patp, message_link_two) {

    game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 6){
        const accessCard = await db.kv('/data').get(game_id+":access_card");
        
        if(JSON.parse(accessCard).status == false){
            const deck = JSON.parse(await db.kv('/data').get(game_id+":dealing")).v;
            const index = Math.floor(Math.random()*deck.length);
            const accessCard = deck[index];
            deck.splice(index,1);
            
            await db.kv('/data').put(game_id+":dealing", deck);
            await db.kv('/data').put(game_id+":access_card", deck[index]);
            
            if(accessCard%13 == 10){
                const currentScore = await db.kv('/data').get(game_id+":score:"+player_dealer);
                if(JSON.parse(currentScore).status == false){
                    await db.kv('/data').put(game_id+":score:"+player_dealer, JSON.stringify({leading: 1, trailing: 0}));
                } else {
                    await db.kv('/data').put(game_id+":score:"+player_dealer, JSON.stringify({leading: 1+JSON.parse(currentScore).v, trailing: JSON.parse(currentScore).v}));
                }
            }

            await db.kv('/data').put(game_id+":game_state", 7);

            console.log(accessCard);
            return accessCard
        } else {
            const accessCard = await db.kv('/data').get(game_id+":access_card");
            console.log(JSON.parse(accessCard).v);
            return JSON.parse(accessCard).v
        }
    } else {
        console.log(false);
    }
};
