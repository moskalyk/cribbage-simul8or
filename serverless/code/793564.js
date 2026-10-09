/*
    create invite one time link
*/
module.exports.serverless = async function (patp, basSignature) {
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
    const message_link = makeid(6);
    const enc = new TextEncoder();
    
    function encrypt(msg, freqs, scalar = 1) {
        const rawEnc = enc.encode(msg);
        let encrypted = [];
        for(let k = 0; k < rawEnc.length; k++){
            for(let w = 0; w < freqs.length; w++){
                for(let i = 0; i < scalar*freqs[w].length; i++){
                    if(i%freqs.length){
                        for(let j = 0; j < scalar*freqs[i%freqs.length][i]; j++){
                                encrypted.push(Math.floor(Math.random()*128));
                        };
                    }else {
                        for(let j = 0; j < scalar*freqs[w].length; j++){
                                encrypted.push(Math.floor(Math.random()*128));
                        };
                    };
                };
            };
            encrypted.push(rawEnc[k]);
        };
        return encrypted;
    };

    const oneTimeLink = encrypt(patp, [basSignature, message_link], 0.1);
    
    await db.kv('/data').put('bas:'+message_link, basSignature);
    await db.kv('/data').put('bas:'+message_link, basSignature);
    await db.kv('/data').put(patp, JSON.stringify(message_link));
    await db.kv('/data').put(message_link, JSON.stringify(oneTimeLink));
    
    console.log(JSON.stringify({ref: message_link, otl: oneTimeLink}));
    return JSON.stringify({ref: message_link, otl: oneTimeLink});
};
