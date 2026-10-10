const { f } = require('./serverless/code/62482.js')
const createOneTimeLink = require('./serverless/code/793564.js')
const acceptOTL = require('./serverless/code/238580.js')
const authApproved = require('./serverless/code/820768.js')
const shuffleAndAssign = require('./serverless/code/179640.js'); const messageLinkSecret = require('./serverless/code/206098.js');
const goFirst = require('./serverless/code/568678.js')
const addPlayerScore = require('../cribbage/app/serverless/code/755005.js')
const context = require('./vfaasContext.js')
const shuffle = require('./serverless/code/994920.js')
const dealCards = require('./serverless/code/994949.js')
const dealToCrib = require('./serverless/code/259942.js')
const withdrawToCrib = require('./serverless/code/626516.js')
const returnAccessCard = require('./serverless/code/86318.js')
const pegging = require('./serverless/code/239257.js')
const awardGo = require('./serverless/code/52865.js')
const canGo = require('./serverless/code/95773.js')
const cardCanGo = require('./serverless/code/286095.js')
const peggingReset = require('./serverless/code/539841.js')
const getScore = require('./serverless/code/452610.js')

;(async () => {
    
    const host = '~zod'
    const player2 = '~ten'
    
    const password1 = 'password21'
    const password2 = 'paward3'
    
    const basSignature = await f.apply(context, [null, '~zod', host, password1, password2])
    
    // auth
    const otp = await createOneTimeLink.serverless.apply(context, [host, basSignature])
    console.log('db is working', JSON.stringify(JSON.parse(JSON.parse(await db.kv('/data').get(JSON.parse(otp).ref)).v)) == JSON.stringify(JSON.parse(otp).otl))
    
    const passKey = await acceptOTL.serverless.apply(context, [host, JSON.parse(otp).ref, player2])
    console.log(passKey)
    
    const sig = await db.kv('/data').get('bas:'+JSON.parse(otp).ref);

    const approved = await authApproved.serverless.apply(context, [host, player2, JSON.parse(otp).ref, password1, password2])
    console.log(approved)
    
    if(approved) console.log('both authenticated')
    const getLink = await messageLinkSecret.serverless.apply(context, [host, player2, JSON.parse(otp).ref, password1, password2])

    // find dealer card
    console.log(JSON.parse(JSON.parse(getLink).message_link_two))
    console.log(await shuffleAndAssign.serverless.apply(context, [null, player2, JSON.parse(otp).ref,JSON.parse(JSON.parse(getLink).message_link_two).v]))

    const deal1 = await goFirst.serverless.apply(context, [null, host, player2, JSON.parse(otp).ref,JSON.parse(JSON.parse(getLink).message_link_two).v, 2])
    const deal2 = await goFirst.serverless.apply(context, [null, host, player2, JSON.parse(otp).ref,JSON.parse(JSON.parse(getLink).message_link_two).v, 2])
    
    console.log('card1', deal1)
    console.log('card2', deal2)
    
    // shuffle
    console.log('shuffled', await shuffle.serverless.apply(context, [null,JSON.parse(otp).ref, player2, JSON.parse(JSON.parse(getLink).message_link_two).v]))
    
    const player1Hand = []
    const player2Hand = []
    const crib = []
    
    for(let i = 0; i < 2; i ++) {
        console.log('deal card')
        player2Hand.push(await dealCards.serverless.apply(context, [null, player2, 2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2]))
        console.log('deal crib')
        crib.push(await dealToCrib.serverless.apply(context, [null, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2, 2]))
        player1Hand.push(await dealCards.serverless.apply(context, [null, host, 2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2]))
    }
    
    console.log('--- dealing rest ---')
    
    for(let i = 0; i < 3; i++){
        console.log('deal card')
        player2Hand.push(await dealCards.serverless.apply(context, [null, player2, 2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2]))
        player1Hand.push(await dealCards.serverless.apply(context, [null, host, 2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2]))
    }
    
    console.log(player2Hand)
    console.log(player1Hand)
    console.log(crib)
    
    // withdraw to crib
    const withd1 = player2Hand[Math.floor(Math.random()*player2Hand.length)]
    const withd2 = player1Hand[Math.floor(Math.random()*player1Hand.length)]
    
    console.log(withd1)
    console.log(withd2)
    
    const ind2 = player2Hand.indexOf(withd2)
    player2Hand.splice(ind2, 1)
    
    const ind1 = player1Hand.indexOf(withd1)
    player1Hand.splice(ind1, 1)
    
    crib.push(withd1)
    crib.push(withd2)
    
    // module.exports.serverless = async function (game_id, player_id, card, message_link_two, message_link, invited_patp, player_count) {
    console.log(await withdrawToCrib.serverless.apply(context, [null, player2, withd1, JSON.parse(JSON.parse(getLink).message_link_two).v, JSON.parse(otp).ref, player2, 2]))
    console.log(await withdrawToCrib.serverless.apply(context, [null, host, withd2, JSON.parse(JSON.parse(getLink).message_link_two).v, JSON.parse(otp).ref, player2, 2]))
    
    //module.exports.serverless = async function (game_id, player_ids, player_dealer, message_link, invited_patp, message_link_two) {
    let dealer;
    
    if(deal2 > deal1) {
        dealer = player2
    } else {
        dealer = host
    }
    
    console.log(await returnAccessCard.serverless.apply(context, [null, [host, player2], dealer, JSON.parse(otp).ref, player2,JSON.parse(JSON.parse(getLink).message_link_two).v]))

    // peggging // check for dealer
    const peggingCard = player2Hand[Math.floor(Math.random()*player2Hand.length)]
    const peg2 = player2Hand.indexOf(peggingCard)
    player2Hand.splice(peg2, 1)
    
    // await pegging.serverless.apply(context, [peggingCard, host, player2, JSON.parse(JSON.parse(getLink).message_link_two).v, player2])
    const wait = (ms) => new Promise((res) => setTimeout(res, ms))
    
    while(player2Hand.length > 0 && (player1Hand.length > 0 || player2Hand.length > 0)) {
        await wait(1000)
        // can go
        const canGoBool = await canGo.serverless.apply(context, [null, host, player2, host, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v])
        console.log('cango',canGoBool)
        let loop = true;
        
        console.log('player1Hand', player1Hand)
        console.log('player2Hand', player2Hand)
        
        if(!canGoBool) {
            const canGoBool = await canGo.serverless.apply(context, [null, host, player2, player2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v])
            console.log('2nd player cant go', canGoBool)
            
            if(!canGoBool) {
                await wait(1000)

                await awardGo.serverless.apply(context, [null, host, player2, JSON.parse(otp).ref, player2, JSON.parse(JSON.parse(getLink).message_link_two).v,])
                loop = false
                //module.exports.serverless = async function (host_patp, player_id, message_link, message_link_two, invited_patp) {

                const pegReset = await peggingReset.serverless.apply(context, [null, host, player2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2])
                console.log('RESET',pegReset)
            }
            
        } 
        
        if(loop){
            
            let hasPlayed = false
            let indexCardCheck = 0
            
            while(!hasPlayed && indexCardCheck < player1Hand.length){
                console.log('playing card player 1')
                const peggingCard = player1Hand[indexCardCheck]
                await wait(1000)

                // module.exports.serverless = async function (game_id, host, invited_patp, player_id, message_link, message_link_two, card) {

                const canGoWithCard = await cardCanGo.serverless.apply(context, [null, host, player2, host, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, peggingCard])
                console.log('card check')
                console.log(canGoWithCard)
                if(!canGoWithCard){ 
                    indexCardCheck++
                } else {
                    hasPlayed = true
                    const peg1 = player1Hand.indexOf(peggingCard)
                    player1Hand.splice(peg1, 1)
                }
            }
            
            console.log('player 1 hand after play',player1Hand)
            await wait(1000)

            if(hasPlayed == false){
                // award go
                
            } else {
                // do a round of card checks
                let indexCardCheck = 0
                let hasPlayed = false

                 while(!hasPlayed && indexCardCheck < player2Hand.length){
                    console.log('playing card player 2')
                            await wait(1000)

                    const peggingCard = player2Hand[indexCardCheck]
                    
                    // module.exports.serverless = async function (game_id, host, invited_patp, player_id, message_link, message_link_two, card) {

                    const canGoWithCard = await cardCanGo.serverless.apply(context, [null, host, player2, player2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, peggingCard])
                    console.log('card check')
                    console.log(canGoWithCard)
                    if(!canGoWithCard){ 
                        indexCardCheck++
                    } else {
                        hasPlayed = true
                        const peg2 = player2Hand.indexOf(peggingCard)
                        player2Hand.splice(peg2, 1)
                    }
                }
                
            }
            
            console.log('player 2 hand after play',player2Hand)
            await wait(1000)

            let peggingCard = player1Hand[Math.floor(Math.random()*player1Hand.length)]
            console.log('last pgcard',peggingCard)

            console.log('pegging')

            const peggingDone1 = await pegging.serverless.apply(context, [peggingCard, host, host, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2])
            console.log('pegging 1')
            await wait(1000)
            const peg1 = player1Hand.indexOf(peggingCard)
            player1Hand.splice(peg1, 1)
            console.log(player1Hand)
                        
            peggingCard = player2Hand[Math.floor(Math.random()*player2Hand.length)]
            
            console.log('last pgcard',peggingCard)

            const peggingDone2 = await pegging.serverless.apply(context, [peggingCard, host, player2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2])
            console.log('pd',peggingDone1, peggingDone2)
            const peg2 = player2Hand.indexOf(peggingCard)
            player2Hand.splice(peg2, 1)
            
            if(peggingDone1 && peggingDone2){
                break;
            } 
        
        }
        console.log('player1Hand', player1Hand)
        console.log('player2Hand', player2Hand)
    }
    
    //module.exports.serverless = async function (game_id, player_id, message_link, message_link_two, invited_patp) {

    const score1 = await getScore.serverless.apply(context, [null, host, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2])
    const score2 = await getScore.serverless.apply(context, [null, player2, JSON.parse(otp).ref, JSON.parse(JSON.parse(getLink).message_link_two).v, player2])
    
    const currentScore = await db.kv('/data').get(JSON.parse(JSON.parse(getLink).message_link_two).v+":score:"+host);
    console.log('cs', currentScore)
    console.log('host', score1)
    console.log('player', score2)
    
    console.log('time to score');
})()
