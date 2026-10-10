/*
    detect score (to be composed)
    aided by: https://github.com/drbr/cribbage/blob/master/src/logic/scoring.js
*/
module.exports.serverless = function (game_id, shown_cards, access_card, is_pegging) {
    let cards = [
        0,
        1, /* ace of spades */
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11, //
        12,
        13,
        14, /* ace of diamonds */
        15, 
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24, //
        25,
        26,
        27, /* ace of clubs */ 
        28, 
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37, //
        38,
        39,
        40, /* ace of hearts */
        41, 
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49, //
        50,
        51
        // 52
    ]
    
    let total_score = 0;
    
    let hand = shown_cards.map(s => s)
    
    if(!is_pegging) {
        // const accessCard = await db.kv('/data').get(game_id+":access_card");
        hand.push(access_card)
    }
    
    // straight
    let longestRun = 1;
    let accumulator = 1;
    let multiplier = 1;
    
    const denominationsShownCards = hand.map(sc => sc % 13).sort()
    console.log(denominationsShownCards)
    // let score = 0
    for(let i = 1; i < denominationsShownCards.length; i++){
        if (denominationsShownCards[i] === denominationsShownCards[i-1]) {
            // A double or triple run
            accumulator++;
        } 
        else if(denominationsShownCards[i] === denominationsShownCards[i-1] + 1){
            longestRun++;
            multiplier *= accumulator;
            accumulator = 1;
            
            continue
        } else if (longestRun < 3) {

            // The run was broken; start scanning from scratch
            longestRun = 1;
            multiplier = 1;
            accumulator = 1;
        } else {
            // Since a run must consist of three or more cards, and a hand
            // contains only five cards, the hand can contain at most one run.
            accumulator = 1;
            break;
        }
        /*if(==), 2x*/
    }
    total_score += (longestRun >= 3) ? longestRun * multiplier * accumulator : 0;
    
    // sort, check differences, count score
    // pair to numbers sans suit
    // pairs and triples
    // temp, aggregate based on equals an index
    let instances = 1;
    let pairs = 0;
    
    for (var index = 1; index < denominationsShownCards.length; index++) {
      if (denominationsShownCards[index] === denominationsShownCards[index-1]) {
        pairs += instances;
        instances++;
      } else {
        instances = 1;
      }
    }

    total_score += pairs * 2;

    // flush
    // temp, aggregate based on equals index
    var score = 0;
    
    var fourPointFlushSpades = shown_cards.every(function(card) {
        return card >= 0 && card <= 13
    });
    
    if (fourPointFlushSpades) {
      score += 4;

      if (!is_pegging && access_card >= 0 && access_card < 13) {
        score += 1;
      }
    }
    
    var fourPointFlushDiamonds = shown_cards.every(function(card) {
        return card >= 14 && card <= 26
    });
    
    if (fourPointFlushDiamonds) {
      score += 4;

      if (!is_pegging && access_card >= 14 && access_card < 27) {
        score += 1;
      }
    }
    
    var fourPointFlushClubs = shown_cards.every(function(card) {
        return card >= 27 && card <= 39
    });
    
    if (fourPointFlushClubs) {
      score += 4;

      if (!is_pegging && access_card >= 27 && access_card <= 39) {
        score += 1;
      }
    }
    
    var fourPointFlushHearts = shown_cards.every(function(card) {
        return card >= 40 && card < 52
    });
    
    if (fourPointFlushHearts) {
      score += 4;

      if (!is_pegging && access_card >= 40 && access_card < 52) {
        score += 1;
      }
    }

    total_score += score;

    // 15 for 2
    // temp, aggregate based on equals index
    
    function subsetsAddingTo(sum, pointValues, pointTotal) {
      if (pointValues.length == 0 || sum <= 0 || pointTotal < sum) {
        return 0;
      }

      var firstElementIsSum = (pointValues[0] == sum);

      var subArray = pointValues.slice(1);
      var subArrayTotal = pointTotal - pointValues[0];

      var subsetFull = subsetsAddingTo(sum, subArray, subArrayTotal);
      var subsetPartial = firstElementIsSum ? 1
          : subsetsAddingTo(sum - pointValues[0], subArray, subArrayTotal);
      return subsetFull + subsetPartial;
    }

    var pointValues = denominationsShownCards.map(i => i+1)
    
    var pointTotal = pointValues.reduce(function(total, value) {
      return total + value;
    });
    
    total_score += subsetsAddingTo(15, pointValues, pointTotal) * 2;

    
    // matching jack
    // aggregate based on equals index
    // const accessCard = await db.kv('/data').get(game_id+":access_card");
    access_card = access_card % 13
    var jackorprin = denominationsShownCards.some(function(card) {
        
      return (card === 10 || card == 23 || card == 36 || card == 49) && (access_card >= 0 && access_card <=13 && card == 10) || (access_card >= 14 && access_card <= 27 && card == 23)  || (access_card >= 27 && access_card <=39 && card == 36)  || (access_card >= 40 && access_card < 52 && card == 49);
    });
    
    // 11, 24, 37, 49
    total_score += jackorprin ? 1 : 0;
    
    return total_score    
};
