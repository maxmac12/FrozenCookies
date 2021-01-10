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
    purStock    : 0,  // Purchased stock.
    maxStock    : 0,  // Maximum purchaseable stock.
    ppHigh      : 0,  // Highest Price of purchased stock.
    rawValues   : []  // History of costs.
}

// Retrieve stock data from local storage.
var stockData = JSON.parse(localStorage.getItem("stockData") || "[]");

// Check retrieved data.
for (var i = 0; i < Game.Objects['Bank'].minigame.goodsById.length; i++)
{
    // Initialize data if necessary.
    if (!stockData[i]) 
    {
        // Initialize stock data.
        stockData[i] = JSON.parse(JSON.stringify(data));
        console.log("Created stockData[" + i + "]");
    }

    // Initialize any newly added data properties.
    for (const property in data)
    {
        if (!(property in stockData[i]))
        {
            stockData[i][property] = data[property];
            console.log("Created stockData[" + i + "][" + property + "]");
        }
    }

    // Remove any unused properties.
    for (const property in stockData[i])
    {
        if (!(property in data))
        {
            delete stockData[i][property];
            console.log("stockData[" + i + "][" + property + "] removed");
        }
    }
    
    createStockTip(i);
    updateStockTip(i);
}

function createStockTip(i)
{
    bankGoodElement = document.getElementById('bankGood-' + i);

    var costElement    = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">Cost:  <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].cost">-</span></div>';
    var highElement    = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">High:  <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].highCost">-</span></div>';
    var avgHighElement = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">Avg H: <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].avgHigh">-</span></div>';
    var avgCostElement = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">Avg:   <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].avgCost">-</span></div>';
    var avgLowElement  = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">Avg L: <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].avgLow">-</span></div>';    
    var lowElement     = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">Low:   <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].lowCost">-</span></div>';
    var ppHighElement  = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">PP H:  <span style="font-weight:bold;color:#fff;" id="stockData['+i+'].ppHigh">-</span></div>';
    var modeElement    = '<div class="bankSymbol" style="margin:1px 0px;display:block;font-size:10px;width:100%;background:linear-gradient(to right,transparent,#333,#333,transparent);padding:2px 0px;overflow:hidden;white-space:nowrap;">Mode:  <span style="font-weight:bold;color:#fff;" id="stockMode-'+i+'">-</span></div>';

    bankGoodElement.insertAdjacentHTML('beforeend', costElement);
    bankGoodElement.insertAdjacentHTML('beforeend', highElement);
    bankGoodElement.insertAdjacentHTML('beforeend', avgHighElement);
    bankGoodElement.insertAdjacentHTML('beforeend', avgCostElement);
    bankGoodElement.insertAdjacentHTML('beforeend', avgLowElement);
    bankGoodElement.insertAdjacentHTML('beforeend', lowElement);
    bankGoodElement.insertAdjacentHTML('beforeend', ppHighElement);
    bankGoodElement.insertAdjacentHTML('beforeend', modeElement)
    bankGoodElement.style.margin = '5px';  // Add separation between elements for better readability.
}

function updateStockTip(i, purStock, maxStock, mode)
{
    // Update color, text, and buy/sell info for the current stock price.
    if ((stockData[i].cost > stockData[i].avgHigh) &&
        (purStock > 0))
    {
        // Indicate to SELL stock.
        document.getElementById('stockData['+i+'].cost').textContent = stockData[i].cost.toFixed(2) + ' (SELL)';

        // Highlight current cost and average high.
        document.getElementById('stockData['+i+'].cost').style.color    = 'cyan';
        document.getElementById('stockData['+i+'].avgHigh').style.color = 'cyan';

        // Highlight high stock price if cost is at its highest.
        if (stockData[i].cost >= stockData[i].highCost)
        {
            document.getElementById('stockData['+i+'].highCost').style.color = 'cyan';
        }
        else
        {
            document.getElementById('stockData['+i+'].highCost').style.color = 'white';
        }
    } 
    else if ((stockData[i].cost < stockData[i].avgLow) &&
             (purStock < maxStock))
    {
        // Indicate to BUY stock.
        document.getElementById('stockData['+i+'].cost').textContent = stockData[i].cost.toFixed(2) + ' (BUY)';

        // Highlight current cost and average low.
        document.getElementById('stockData['+i+'].cost').style.color   = 'orange';
        document.getElementById('stockData['+i+'].avgLow').style.color = 'orange';

        // Highlight low stock price if cost is at its lowest.
        if (stockData[i].cost <= stockData[i].lowCost)
        {
            document.getElementById('stockData['+i+'].lowCost').style.color = 'orange';
        }
        else
        {
            document.getElementById('stockData['+i+'].lowCost').style.color = 'white';
        }
    }
    else
    {
        // Neutral stock indication.
        document.getElementById('stockData['+i+'].cost').textContent = stockData[i].cost.toFixed(2);

        // Remove any potential highlighting.
        document.getElementById('stockData['+i+'].cost').style.color     = 'white';
        document.getElementById('stockData['+i+'].highCost').style.color = 'white';
        document.getElementById('stockData['+i+'].avgHigh').style.color  = 'white';
        document.getElementById('stockData['+i+'].avgLow').style.color   = 'white';
        document.getElementById('stockData['+i+'].lowCost').style.color  = 'white';
    }

    // Update color and text for high purchase price.
    if (stockData[i].ppHigh > 0)
    {
        document.getElementById('stockData['+i+'].ppHigh').textContent = stockData[i].ppHigh.toFixed(2);
        
        // Highlight purchase price to show if a profit or loss would occur with a SELL.
        if (stockData[i].ppHigh > stockData[i].cost)
        {
            // Indicate a loss.
            document.getElementById('stockData['+i+'].ppHigh').textContent += " (-" + Math.abs(stockData[i].ppHigh - stockData[i].cost).toFixed(2) + ")";
            document.getElementById('stockData['+i+'].ppHigh').style.color = 'orange';
        }
        else if (stockData[i].ppHigh < stockData[i].cost)
        {
            // Indicate a profit.
            document.getElementById('stockData['+i+'].ppHigh').textContent += " (+" + Math.abs(stockData[i].ppHigh - stockData[i].cost).toFixed(2) + ")";
            document.getElementById('stockData['+i+'].ppHigh').style.color = 'cyan';
        }
        else
        {
            // Indicate no gain.
            document.getElementById('stockData['+i+'].ppHigh').style.color = 'white';
        }
    }
    else
    {
        document.getElementById('stockData['+i+'].ppHigh').textContent = "-";
        document.getElementById('stockData['+i+'].ppHigh').style.color = 'white';
    }

    // Update text for remaining stock information.
    document.getElementById('stockData['+i+'].highCost').textContent = stockData[i].highCost.toFixed(2);
    document.getElementById('stockData['+i+'].avgHigh').textContent  = stockData[i].avgHigh.toFixed(2);
    document.getElementById('stockData['+i+'].avgCost').textContent  = stockData[i].avgCost.toFixed(2);
    document.getElementById('stockData['+i+'].avgLow').textContent   = stockData[i].avgLow.toFixed(2);
    document.getElementById('stockData['+i+'].lowCost').textContent  = stockData[i].lowCost.toFixed(2);
    document.getElementById('stockMode-'+i).textContent = getStockMode(mode);
    document.getElementById('stockMode-'+i).style.color = getStockModeColor(mode);
}

function saveStockData()
{
    localStorage.setItem("stockData", JSON.stringify(stockData));
}

const STOCK_MODES = ['Stable', 'Slow Rise', 'Slow Fall', 'Fast Rise', 'Fast Fall', 'Chaotic'];
function getStockMode(mode)
{
    if ((mode >= 0) && (mode < STOCK_MODES.length))
    {
        return STOCK_MODES[mode];
    }
    
    return 'Unknown';
}

const STOCK_MODE_CLR = ['white', 'lime', 'red', 'lime', 'red', 'yellow'];
function getStockModeColor(mode)
{
    if ((mode >= 0) && (mode < STOCK_MODES.length))
    {
        return STOCK_MODE_CLR[mode];
    }
    
    return 'white';
}

function logic() 
{
    var M = Game.Objects['Bank'];
    
    // Check if stock minigame has been loaded.
    if(M.minigameLoaded)
    {
        var updateSave = false;   // Flag indicating if stock information should be saved.
        var market = M.minigame;  // Retrieve market minigame.
        
        // Check stock goods for changes.
        for (var i = 0; i < market.goodsById.length; i++)
        {
            var refreshStockTip = false;                                 // Flag indicating stock tooltip should be refreshed.

            var good     = stockData[i];                                 // Retrieve stock record.
            var currCost = market.goodsById[i].val;                      // Get current stock price.
            var purStock = market.goodsById[i].stock;                    // Get purchased stock amount.
            var maxStock = market.getGoodMaxStock(market.goodsById[i]);  // Get maximum purchaseable stock amount.
            var mode     = market.goodsById[i].mode;

            // Check if stock has been purchased or sold.
            if (good.purStock != purStock) 
            {
                // Check if stock has been purchased.
                if (purStock > good.purStock)  
                {
                    // Stock has been purchased. Check if the high purchase price has changed.
                    if (good.ppHigh < good.cost)
                    {
                        good.ppHigh = good.cost;   
                    }                 
                }
                else if (purStock == 0)  // Check if all stock has been sold.
                {
                    // All stock has been sold. Reset the high purchase price.
                    good.ppHigh = 0;
                }

                refreshStockTip = true;      // Purchased stock has changed.  Refresh stock tooltip.
                good.purStock   = purStock;  // Update purchased stock amount.
            }

            // Check if buildings have been bough or sold resulting in the purchaseable stock amount to change.
            if (good.maxStock != maxStock)
            {
                refreshStockTip = true;      // Maximum purchaseable stock has changed. Refresh stock tooltip. 
                good.maxStock   = maxStock;  // Update maximum purchaseable stock amount.
            }
            
            // Check if stock cost has changed.
            if (currCost != good.prevCost)
            {
                refreshStockTip = true;  // Stock cost has changed. Refresh stock tooltip.               
                updateSave      = true;  // Update saved stock information.

                good.prevCost = good.cost;        // Update previous stock cost.                
                good.cost     = currCost;         // Update current stock cost.
                good.rawValues.push(good.cost);   // Store raw cost values.

                // Check if stock information has been previously sampled.
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
                    // Initialize stock information.
                    good.highCost = good.cost;
                    good.avgHigh  = good.cost;
                    good.avgCost  = good.cost;
                    good.avgLow   = good.cost;                
                    good.lowCost  = good.cost;
                }

                good.samples++;
            }

            // Update stock tip if the price has changed or if stock has been purchased or sold.
            if (refreshStockTip)
            {
                updateStockTip(i, purStock, maxStock, mode);
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


