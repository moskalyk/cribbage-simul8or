const { f } = require('./serverless/code/62482.js')
const goFirst = require('../cribbage/app/serverless/code/568678.js')
const addPlayerScore = require('../cribbage/app/serverless/code/755005.js')
const context = require('./vfaasContext.js')

;(async () => {
    
    // auth
    
    // find dealer card
    // console.log(await goFirst.serverless.apply(context, [null, '~zod', '~ten', [1,2,5], [7,3,3], 2]))
    
    // test
    await f.apply(context, [null, '~zod'])
})()
