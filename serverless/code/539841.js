/*
    reset pegging
*/
module.exports.serverless = async function (game_id, host_patp, player_id, message_link, message_link_two, invited_patp) {
    
    game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    console.log('messageLinkTwo')
    console.log(message_link)
    console.log(invited_patp)
    console.log('msl',messageLinkTwo)
    console.log(JSON.parse(messageLinkTwo).v)
    console.log(JSON.parse(messageLinkTwo).v == message_link_two)
    console.log('game state', JSON.parse(gameState).v == 7)
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 7){
        console.log('ready to reset')
        await db.kv('/data').put(game_id+':pegging', []);
        console.log(true);
        return true;
    }
};
