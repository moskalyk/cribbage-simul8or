/*
    deal to crib
*/
module.exports.serverless = async function (game_id, message_link, message_link_two, invited_patp, player_count) {
    game_id = message_link_two;
    
    const gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    console.log('ml2',JSON.parse(messageLinkTwo).v)
    console.log(JSON.parse(messageLinkTwo).v)
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 3){
        let crib = await db.kv('/data').get(game_id+":crib");
        const cards = JSON.parse(await db.kv('/data').get(game_id+":dealing")).v;
        console.log('cards', cards)
        const deck = JSON.parse(await db.kv('/data').get(game_id+":dealing")).v;
        const index = deck[Math.floor(Math.random()*deck.length)];
        console.log('index',index)
        console.log(JSON.parse(crib).status)
        cards.splice(index, 1)
        await db.kv('/data').put(game_id+":dealing", cards);

        if(JSON.parse(crib).status == false){
            const card = cards[index];
            await db.kv('/data').put(game_id+":crib", [card]);
            if(player_count == 3) {
                await db.kv('/data').put(game_id+":game_state", 4);
            }
        } else if(player_count == 2){
            const card = cards[index];
            const newCrib = JSON.parse(crib).v
            newCrib.push(card)
            await db.kv('/data').put(game_id+":crib", newCrib);
            await db.kv('/data').put(game_id+":game_state", 4);
        }
        console.log(true);
        return deck[index];
    } else {
        console.log(false);
    }
};
