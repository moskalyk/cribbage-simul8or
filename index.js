const { f } = require('./serverless/code/62482.js')
const createOneTimeLink = require('./serverless/code/793564.js')
const acceptOTL = require('./serverless/code/238580.js')
const authApproved = require('./serverless/code/820768.js')
const shuffleAndAssign = require('./serverless/code/179640.js'); const messageLinkSecret = require('./serverless/code/206098.js');
const goFirst = require('./serverless/code/568678.js')
const addPlayerScore = require('../cribbage/app/serverless/code/755005.js')
const context = require('./vfaasContext.js')
const shuffle = require('./serverless/code/994920.js')

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

    console.log('card1',await goFirst.serverless.apply(context, [null, host, player2, JSON.parse(otp).ref,JSON.parse(JSON.parse(getLink).message_link_two).v, 2]))
    console.log('card2',await goFirst.serverless.apply(context, [null, host, player2, JSON.parse(otp).ref,JSON.parse(JSON.parse(getLink).message_link_two).v, 2]))
    
    // shuffle
    console.log('shuffled', await shuffle.serverless.apply(context, [null,JSON.parse(otp).ref, player2, JSON.parse(JSON.parse(getLink).message_link_two).v]))
})()
