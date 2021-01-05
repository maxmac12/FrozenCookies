// running average calculation
function calcRunningAvg(prevAverage, currValue, index) {
    // [ avg' * (n-1) + x ] / n
    return ( prevAverage * (index - 1) + currValue ) / index;
}

// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);

// sum of array
const sum = arr => arr.reduce((a, b) => a + b, 0);

// average of array
const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

const q25 = arr => quantile(arr, .25);
const q50 = arr => quantile(arr, .50);
const q75 = arr => quantile(arr, .75);
const median = arr => q50(arr);

// Stock data prototype.
const data =
{
    samples     : 0,  // Number of samples for average cost.
    samplesLow  : 1,  // Number of samples for average low cost.
    samplesHigh : 1,  // Number of samples for average high cost.
    avgCost     : 0,  // Average Cost.
    avgLow      : 0,  // Average Low Cost. Average of values less than overall average cost.
    avgHigh     : 0,  // Average High Cost. Average of values greater than overall average cost.
    lowCost     : 0,  // Lowest Cost.
    highCost    : 0,  // Highest Cost.
    cost        : 0,  // Stock cost.
    prevCost    : 0,  // Previous cost.
    rawValues   : []  // History of costs.
}

// Retrieve stock data from local storage.
var stockData = JSON.parse(localStorage.getItem("stockData") || "[]");

for (var i = 0; i < Game.Objects['Bank'].minigame.goodsById.length; i++)
{
    if (!stockData[i]) 
    {
        // Initialize stock data.
        stockData[i] = JSON.parse(JSON.stringify(data));
        console.log("Created stockData[" + i + "]");
    }
}

function saveStockData()
{
    localStorage.setItem("stockData", JSON.stringify(stockData));
}

function logic() 
{
    var M = Game.Objects['Bank'];
    
    if(M.minigameLoaded)
    {
        var market = M.minigame;
        var updateSave = false;

        for (var i = 0; i < market.goodsById.length; i++)
        {
            var good = stockData[i];  // Retrieve good record.

            good.cost = market.goodsById[i].val;  // Get current stock price.
            
            if (good.cost != good.prevCost)
            {
                updateSave = true;
                good.prevCost = good.cost;
                good.rawValues.push(good.cost);

                if (good.samples)
                {
                    // Calculate average cost.
                    good.avgCost = calcRunningAvg(good.avgCost, good.cost, good.samples);

                    // Calculate average low cost.
                    if (good.cost < good.avgCost)
                    {
                        good.avgLow = calcRunningAvg(good.avgLow, good.cost, good.samplesLow++);
                    }
                    
                    // Calculate average high cost.
                    if (good.cost > good.avgCost)
                    {
                        good.avgHigh = calcRunningAvg(good.avgHigh, good.cost, good.samplesHigh++);
                    }

                    // Calculate low cost.
                    if (good.cost < good.lowCost)
                    {
                        good.lowCost = good.cost;    
                    }

                    // Calculate high cost.
                    if (good.cost > good.highCost)
                    {
                        good.highCost = good.cost;    
                    }
                }
                else
                {
                    // Initial sample.
                    good.avgCost  = good.cost;
                    good.avgLow   = good.cost;
                    good.avgHigh  = good.cost;
                    good.highCost = good.cost;
                    good.lowCost  = good.cost;
                }

                good.samples++;
            }            
        }

        if (updateSave)
        {    
          saveStockData();
        }
    }
};

// Run stock market bot.
stockBot = setInterval(logic, 1000);


