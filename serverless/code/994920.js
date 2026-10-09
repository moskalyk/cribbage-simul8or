/*
    shuffle
*/
module.exports.serverless = async function (game_id, message_link, invited_patp, message_link_two) {
    game_id = message_link_two;
    
    let gameState = await db.kv('/data').get(game_id+":game_state");
    const messageLinkTwo = await db.kv('/data').get(message_link+':'+invited_patp);

    if(JSON.parse(messageLinkTwo).v == message_link_two && JSON.parse(gameState).v == 2){
        const cards = Array.from(Array(52).keys());
        
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array
        }
        
        await db.kv('/data').put(game_id+":dealing", shuffle(cards));
        await db.kv('/data').put(game_id+":game_state", 3);

        console.log(true);
        return true
    } else {
        console.log(false);
    }
};
