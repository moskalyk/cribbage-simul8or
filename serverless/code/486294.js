/*
    count cards
*/
module.exports.serverless = async function (game_id, shown_cards) {
    const denominationsShownCardsUnsorted = shown_cards.map(sc => sc % 13).reduce((cu, total) => cu + total, 0);
    console.log(denominationsShownCardsUnsorted);
    return denominationsShownCardsUnsorted;
};
