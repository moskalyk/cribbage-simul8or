/*
    score hand and set score
*/
module.exports.serverless = async function (game_id, player_id, cards, access_card, message_link, invited_patp, message_link_two) {
     game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    console.log('gamesss state',JSON.parse(gameState).v)
    console.log(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 8)
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 8){
        /* get score */
        const score = await vm('1687').serverless(game_id, cards, access_card, false);
        
        /* assign score */
        console.log('scoringgg', score);
        await vm('755005').serverless(game_id, player_id, score);
        await db.kv('/data').put(game_id+":game_state", 9);

        console.log(score);
        return score;
    } else {
        console.log(true);
        
    }
};
