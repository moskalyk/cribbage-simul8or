/*
    auth
*/
module.exports.serverless = async function (myPatP, otherPatP, message_link, freq1, freq2) {

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
        // console.log('sig', sigPatP)
        const message_link = await db.kv('/data').get(sigPatP);
        const gameLinkSolNotNull = await db.kv('/data').get(JSON.parse(JSON.parse(message_link).v)+':'+otherPatP);

        if('v' in JSON.parse(gameLinkSolNotNull)){
            
            console.log(true);
            return true
        } else {
            console.log(false);
            return false
        }
    } else {
        console.log(false);
        return false
    }
};
