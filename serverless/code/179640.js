/*
    shuffle and assign cards
*/
module.exports.serverless = async function (game_id, invited_patp, message_link, message_link_two) {
    console.log(message_link)
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);
    
    game_id = message_link_two;
    const gameState = await db.kv('/data').get(game_id+":game_state");
    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 0){
        const cards = Array.from(Array(52).keys());
        
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array
        }
        await db.kv('/data').put(game_id+":dealer_choice", shuffle(cards));
        await db.kv('/data').put(game_id+":game_state", 1);
        
        console.log(true);
        return true
    } else {
        console.log(false);
        return false
    }
};
