module.exports.f = async (mod1, v) => {
    console.log(await vm('755005').serverless(null, '~zod', 120));
    console.log(db);
    console.log(await db.kv('/data').put('sigil', v));
    console.log(await db.kv('/data').get('sigil'));
    console.log(true);
}
