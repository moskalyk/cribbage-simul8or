/*
    withdraw to crib
*/
module.exports.serverless = async function (game_id, player_id, card, message_link_two, message_link, invited_patp, player_count) {
    game_id = message_link_two;
    
    const gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 5){
        let crib = await db.kv('/data').get(game_id+":crib");
        if(JSON.parse(crib).status == false){
            await db.kv('/data').put(game_id+":crib", [card]);
        } else {
            const newHand = JSON.parse(crib).v
            newHand.push(card)
            await db.kv('/data').put(game_id+":crib", newHand);
            const invHand = await db.kv('/data').get(game_id+':hand_dealt:' + player_id);
            const splicedHand = JSON.parse(invHand).v
            let ind = splicedHand.indexOf(card)
            splicedHand.splice(ind, 1)
            await db.kv('/data').put(game_id+':hand_dealt:' + player_id, splicedHand);
            if(newHand.length == 4){
                await db.kv('/data').put(game_id+":game_state", 6);
            }
        }
        console.log(true);
        return true;
    } else {
        console.log(false);
        return false;
    }
};
