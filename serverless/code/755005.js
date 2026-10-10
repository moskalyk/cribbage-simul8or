/*
    add player score
*/
module.exports.serverless = async function (game_id, player_id, score) {
    const currentScore = await db.kv('/data').get(game_id+":score:"+player_id);
    if(JSON.parse(currentScore).status == false){
        await db.kv('/data').put(game_id+":score:"+player_id, JSON.stringify({leading: score, trailing: 0}));
        console.log(JSON.stringify({leading: score, trailing: 0}));
        return JSON.stringify({leading: score, trailing: 0})
    } else {
        await db.kv('/data').put(game_id+":score:"+player_id, JSON.stringify({leading: score+JSON.parse(currentScore).v.leading, trailing: JSON.parse(currentScore).v.leading}));

        console.log(JSON.stringify({leading: score+JSON.parse(currentScore).v, trailing: 0}));
    }
};
