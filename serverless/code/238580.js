/*
    accept one time link
*/
module.exports.serverless = async function (hostPatP, message_link, myPatP) {
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
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
        }

        return dec.decode(new Uint8Array(msgArr)).replaceAll(String.fromCharCode(0), '');
    }
    
    const message_link_two = makeid(6);
    
    var _ = encrypt(hostPatP, [message_link, message_link_two], 0.01);
    console.log('mes', message_link+':'+myPatP)
    await db.kv('/data').put(message_link+':'+myPatP, message_link_two);

    console.log(JSON.stringify({
        passKey: message_link_two+':'+myPatP
    }));
    
    // extra
    return JSON.stringify({
        passKey: message_link_two+':'+myPatP
    })
};
