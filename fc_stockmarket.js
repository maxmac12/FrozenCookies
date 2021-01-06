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

    createStockTip(i);
    updateStockTip(i);
}

function createStockTip(i)
{
    bankGoodElement = document.getElementById('bankGood-' + i);

    var costElement    = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">Cost:    <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].cost">-</span></div>';
    var avgCostElement = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">AvgCost: <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].avgCost">-</span></div>';
    var avgHighElement = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">AvgHigh: <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].avgHigh">-</span></div>';
    var avgLowElement  = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">AvgLow:  <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].avgLow">-</span></div>';    

    bankGoodElement.insertAdjacentHTML('beforeend', costElement);
    bankGoodElement.insertAdjacentHTML('beforeend', avgCostElement);
    bankGoodElement.insertAdjacentHTML('beforeend', avgHighElement);
    bankGoodElement.insertAdjacentHTML('beforeend', avgLowElement);
}

function updateStockTip(i)
{
    var color = 'white';
    if (stockData[i].cost >= stockData[i].avgHigh) color = 'lime';
    if (stockData[i].cost <= stockData[i].avgLow) color  = 'red';
    document.getElementById('stockData['+i+'].cost').textContent = stockData[i].cost.toFixed(2);
    document.getElementById('stockData['+i+'].cost').style.color = color;

    document.getElementById('stockData['+i+'].avgCost').textContent = stockData[i].avgCost.toFixed(2);
    document.getElementById('stockData['+i+'].avgHigh').textContent = stockData[i].avgHigh.toFixed(2);
    document.getElementById('stockData['+i+'].avgLow').textContent  = stockData[i].avgLow.toFixed(2);
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

                updateStockTip(i);
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


