module.exports.f = async (mod1, v, hostPatP, password1, password2) => {
    // console.log(await vm('755005').serverless(null, '~zod', 120));
    console.log(db);
    console.log(await db.kv('/data').put('sigil', v));
    console.log(await db.kv('/data').get('sigil'));
    console.log(true);
    
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
    
    return encrypt(hostPatP, [password1, password2], 0.01);
}
