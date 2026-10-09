/*
    deal a card
*/
module.exports.serverless = async function (game_id, player_id, player_count, message_link, message_link_two, invited_patp) {
    game_id = message_link_two;
    
    const gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);

    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 3 || JSON.parse(gameState).v == 4){
        await db.kv('/data').put(game_id+":dealing"+":"+"selecting", true);

        let sp;
        do{
            sp = await db.kv('/data').get(game_id+":dealing"+":"+"selecting");
            console.log(sp)
            if(JSON.parse(sp).status != false){
                await db.kv('/data').put(game_id+":dealing"+":"+"selecting", true);

                const cards = JSON.parse(await db.kv('/data').get(game_id+":dealing")).v
                console.log(cards.length)
                if(cards.length == 52){
                    const deck = JSON.parse(await db.kv('/data').get(game_id+":dealing")).v;

                    const index = Math.floor(Math.random()*deck.length);

                    await db.kv('/data').put(game_id+':hand_dealt:' + player_id, [cards[index]]);

                    cards.splice(index, 1)
                    await db.kv('/data').put(game_id+":dealing", cards);
                    
                    /* semaphore */
                    await db.kv('/data').put(game_id+":dealing"+":"+"selecting", false);
                    sp = await db.kv('/data').get(game_id+":dealing"+":"+"selecting");
                    
                    return deck[index]
                } else if(player_count == 2){
                    const deck = JSON.parse(await db.kv('/data').get(game_id+":dealing")).v;
                    // console.log(deck)
                    const index = Math.floor(Math.random()*deck.length);

                    const hand = await db.kv('/data').get(game_id + ':hand_dealt:' + player_id);
                    if(JSON.parse(hand).status == true){
                        const newHand = JSON.parse(hand).v
                        newHand.push(cards[index])
                        const invHand = await db.kv('/data').get(game_id+':hand_dealt:' + invited_patp, newHand);
                        await db.kv('/data').put(game_id+':hand_dealt:' + player_id, newHand);

                        if(newHand.length == 5 && JSON.parse(invHand).status && JSON.parse(invHand).v.length == 5){
                            await db.kv('/data').put(game_id+":game_state", 5);
                        }
                        cards.splice(index, 1)
                        await db.kv('/data').put(game_id+":dealing", cards);
                    } else {
                        await db.kv('/data').put(game_id + ':hand_dealt:' + player_id, [cards[index]]);
                        cards.splice(index, 1)
                        await db.kv('/data').put(game_id+":dealing", cards);
                    }

                    await db.kv('/data').put(game_id+":dealing"+":"+"selecting", false);
                    sp = await db.kv('/data').get(game_id+":dealing"+":"+"selecting");
                    console.log(deck[index]);
                    return deck[index]
                } else {
                    const deck = JSON.parse(await db.kv('/data').get(game_id+":dealing")).v;
                    const index = deck[Math.floor(Math.random()*deck.length)];
                    const hand = await db.kv('/data').get(game_id + ':hand_dealt:' + player_id);

                    if(JSON.parse(hand).status == true){
                        await db.kv('/data').put(game_id+':hand:' + player_id, JSON.parse(hand).v.push(cards[index]));
                    } else {
                        await db.kv('/data').put(game_id+':hand:' + player_id, [cards[index]]);
                    }

                    await db.kv('/data').put(game_id+":dealer_choice", cards.splice(index, 1));

                    await db.kv('/data').put(game_id+":dealer_choice"+":"+"selecting", false);
                    sp = await db.kv('/data').get(game_id+":dealer_choice"+":"+"selecting");

                    console.log(deck[index]);
                    return deck[index]
                }
            } else {
                await db.kv('/data').put(game_id+":game_state", 5);
                sp = await db.kv('/data').put(game_id+":dealer_choice"+":"+"selecting", true);
            }
        }while(JSON.parse(sp).v == true);
    } else {
        console.log(false);
        return false
    }
};
