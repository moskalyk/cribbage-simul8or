/*
    auth, message_link_secret_password
*/
module.exports.serverless = async function (myPatP, invited_patp, message_link, freq1, freq2) {
    const dec = new TextDecoder();

    function decrypt(msg, freqs, scalar = 1, timeout=1000) {

        let msgArr = [];
        
        let g = 0;
        let f = 0;

        while(g<timeout){

            for(let w = 0; w < freqs.length; w++){
                for(let i = 0; i < scalar*freqs[w].length; i++){
                    if(i%freqs.length){
                        for(let j = 0; j < scalar*freqs[i%freqs.length][i]; j++){
                            f++;
                        };
                    } else {
                        for(let j = 0; j < scalar*freqs[w].length; j++){
                            f++;
                        };
                    };
                };
            };
            g++;
            msgArr.push(msg[f++]);
        };

        return dec.decode(new Uint8Array(msgArr)).replaceAll(String.fromCharCode(0), '');
    }
    
    const sig = await db.kv('/data').get('bas:'+message_link);
    const sigPatP = decrypt(JSON.parse(sig).v, [freq2, freq1], 0.1);
    
    if(myPatP == sigPatP){
        const message_link_two = await db.kv('/data').get(message_link+':'+invited_patp);
        let game_id = message_link_two;
        console.log('g',JSON.parse(game_id).v)
        await db.kv('/data').put(JSON.parse(game_id).v+":game_state", 0);
        
        console.log(JSON.stringify({message_link_two: message_link_two}));
        return JSON.stringify({message_link_two: message_link_two})
    } else {
        console.log(false);
    }
};
