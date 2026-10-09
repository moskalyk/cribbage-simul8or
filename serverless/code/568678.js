/*
    find dealer card
*/
module.exports.serverless = async function (game_id, player_id, invited_patp, message_link, message_link_two, player_count) {
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    game_id = message_link_two;
    
    const gameState = await db.kv('/data').get(game_id+":game_state");
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 1){
        const cards = await db.kv('/data').get(game_id+":dealer_choice");
        const card = JSON.parse(cards).v.pop();
        await db.kv('/data').put(game_id+":dealer_choice", JSON.parse(cards).v.slice(0, JSON.parse(cards).v.length -1));
        
        let hand = await db.kv('/data').get(game_id+":dealing"+":"+player_id);
        if(JSON.parse(hand).status == false){
            await db.kv('/data').put(game_id+":dealing"+":"+player_id, [card]);
        } else {
            hand = JSON.parse(hand).v
            hand.push(card);
            await db.kv('/data').put(game_id+":dealing"+":"+player_id, hand);
            if(player_count == hand.length){
                await db.kv('/data').put(game_id+":game_state", 2);
            }
        }
        
        return card;
    } else {
        console.log(false);
    }
};
