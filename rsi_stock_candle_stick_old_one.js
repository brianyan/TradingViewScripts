//@version=2

//Created by Robert Nance on 5/28/16. Additional credit to vdubus.
//This was a special request from rich15stan.  It combines my original RSI Stoch extremes with vdubus’ MACD VXI.
//This script will give you red or green columns as an indication for oversold/overbought,
//based upon the rsi and stochastic both being at certain levels. The default oversold is at 35.
//If Stochastic and RSI fall below 35, you will get a green column.  Play with your levels to see how
//your stock reacts.  It now adds the MACD crossover, plotted as a blue circle.

strategy("RSI-candlestick Strategy", overlay=true)
src = hlc3, len = input(14, minval=1, title="Length")
up = rma(max(change(src), 0), len)
down = rma(-min(change(src), 0), len)
rsi = down == 0 ? 100 : up == 0 ? 0 : 100 - (100 / (1 + up / down))
//plot(rsi, color=purple)
//band1 = hline(70)
//band0 = hline(30)
//band2 = hline(50,linestyle=dotted,color=silver)
//fill(band1, band0, color=#cc99ff, transp=70)
//end premade RSI
oversold = rsi < 30
overbought = rsi > 70
barcolor(oversold? #7fff00 : overbought? red : na )
//
//
level_70 = 70
level_70rsi = rsi > level_70 ? rsi : level_70
level_30 = 30
level_30rsi = rsi < 30 ? rsi : level_30

level_50 = 50
//


//p1 = plot(series=level_70, color=red, linewidth=1, transp=100)
//p2 = plot(series=level_70rsi, color=red, linewidth=1, transp=100)
//p3 = plot(series=level_30, color=green, linewidth=1, transp=100)
//p4 = plot(series=level_30rsi, color=green, linewidth=1, transp=100)
//fill(p1, p2, color=red, transp=50)
//fill(p3, p4, color=#7fff00, transp=50)




/////////////////////////////////////


bullishcriteria = input(title="RSI Bullish Criteria", type=integer, defval=55, minval=50, maxval=100)
bearishcriteria = input(title="RSI Bearish Criteria", type=integer, defval=45, minval=0, maxval=50)

range = high - low
body = abs(close - open)
oc2 = min(close, open) + body/2
upperwick = high - max(open, close)
lowerwick = min(open, close) - low

isUp = close > open
isTrendUp = rsi(close, 14) >= bullishcriteria
isTrendDown = rsi(close, 14) <= bearishcriteria
isDoji = abs(close-open)/(high-low) < 0.05

// RSI/SToch Oversold/Overbought Indicator Along with MACD?
length = input(14, minval=1, title="Stoch Length"), smoothK = input(1, minval=1, title="Stoch K")
k = sma(stoch(close, high, low, length), smoothK)

rsilow = input(35, title="rsi Low value")
rsihigh = input(65, title="rsi High value")
stochlow = input(35, title="stochastic Low value")
stochhigh = input(65, title="stochastic High value")
Buy=rsi<rsilow and k<stochlow
Sell=rsi>rsihigh and k>stochhigh


Buy_background=rsi<rsilow and k<stochlow ? green : na
Sell_background=rsi>rsihigh and k>stochhigh ? red : na

fastLength = input(13, minval=1,title="MACD Fast Length")
slowLength = input(21,minval=1,title="MACD Slow Length")
signalLength = input(8,minval=1,title="MACD Signal Length")
fastMA = ema(src, fastLength)
slowMA = ema(src, slowLength)
macd = fastMA - slowMA
signal = sma(macd, signalLength)

bgcolor(Buy_background, transp=75)
bgcolor(Sell_background, transp=75)


// Single Candlestick Pattern
// white marubozu
wm = (isUp) and (upperwick <= 0.05*body) and (lowerwick <= 0.05*body) and isTrendDown and Buy
plotshape(wm, color=green, style=shape.triangleup, location=location.belowbar, title='white marubozu',text='wm')
// if (not na(rsi))
if (crossover(rsi, level_30) and (wm or wm[1]))
    strategy.entry("RsiLE", strategy.long, comment="RsiLE")
alertcondition(crossover(rsi, level_30), title='Alert on Green Bar', message='Green Bar!')
// black marubozu
bm = (not isUp) and (upperwick <= 0.05*body) and (lowerwick <= 0.05*body) and isTrendUp and Sell
plotshape(bm, color=red, style=shape.triangledown, location=location.abovebar, title='black marubozu',text='bm')

// if (not na(rsi))
if (crossunder(rsi, level_70)and (bm or bm[1]))
    strategy.entry("RsiSE", strategy.short, comment="RsiSE")

// hammer
h = (isUp) and (lowerwick >= 2*body) and (upperwick <= 0.1*body) and isTrendDown and Buy
plotshape(h, color=green, style=shape.triangleup, location=location.belowbar, title='hammer',text='h')

if (not na(rsi))
    if (crossover(rsi, level_30) and (h or h[1]))
        strategy.entry("RsiLE", strategy.long, comment="RsiLE")
// hanging man
hm = (not isUp) and (lowerwick >= 2*body) and (upperwick <= 0.1*body) and isTrendUp and Sell
plotshape(hm, color=red, style=shape.triangledown, location=location.abovebar, title='hanging man',text='hm')

// if (not na(rsi))
if (crossunder(rsi, level_70)and (hm or hm[1]))
    strategy.entry("RsiSE", strategy.short, comment="RsiSE")

// inverted hammer
ih = (isUp) and (upperwick >= 2*body) and (lowerwick <= 0.1*body) and isTrendDown and Buy
plotshape(ih, color=green, style=shape.triangleup, location=location.belowbar, title='inverted hammer',text='ih')

// if (not na(rsi))
if (crossover(rsi, level_30) and (ih or ih[1]))
    strategy.entry("RsiLE", strategy.long, comment="RsiLE")

// shooting star
ss = (not isUp) and (upperwick >= 2*body) and (lowerwick <= 0.1*body) and isTrendUp and Sell
plotshape(ss, color=red, style=shape.triangledown, location=location.abovebar, title='shooting star',text='ss')

// if (not na(rsi))
if (crossunder(rsi, level_70)and (ss or ss[1]))
    strategy.entry("RsiSE", strategy.short, comment="RsiSE")

// Double Candlestick Pattern
// bullish engulfing
bulle = not isDoji[1] and (not isUp[1] and isUp) and (close > open[1] and open < close[1]) and isTrendDown and Buy
plotshape(bulle, color=green, style=shape.triangleup, location=location.belowbar, title='bullish engulfing', text='e')

// if (not na(rsi))
if (crossover(rsi, level_30) and (bulle or bulle[1]))
    strategy.entry("RsiLE", strategy.long, comment="RsiLE")

// bearish engulfing
beare = not isDoji[1] and (isUp[1] and not isUp) and (open > close[1] and close < open[1]) and isTrendUp and Sell
plotshape(beare, color=red, style=shape.triangledown, location=location.abovebar, title='bearish engulfing',text='e')

// if (not na(rsi))
if (crossunder(rsi, level_70)and (beare or beare[1]))
    strategy.entry("RsiSE", strategy.short, comment="RsiSE")

// tweezer bottom
twb = (not isUp[1] and isUp) and (min(lowerwick,lowerwick[1])/max(lowerwick,lowerwick[1]) >= 0.99) and (min(low,low[1])/max(low,low[1]) >= 0.99) and isTrendDown and Buy
plotshape(twb, color=green, style=shape.triangleup, location=location.belowbar, title='tweezer bottom', text='tb')

// if (not na(rsi))
if (crossover(rsi, level_30) and (twb or twb[1]))
    strategy.entry("RsiLE", strategy.long, comment="RsiLE")

// tweezer top
twt = (isUp[1] and not isUp) and (min(upperwick,upperwick[1])/max(upperwick,upperwick[1]) >= 0.99) and (min(high,high[1])/max(high,high[1]) >= 0.99) and isTrendUp and Sell
plotshape(twt, color=red, style=shape.triangledown, location=location.abovebar, title='tweezer top',text='tt')

if (not na(rsi))
    if (crossunder(rsi, level_70)and (twt or twt[1]))
        strategy.entry("RsiSE", strategy.short, comment="RsiSE")
// Trible Candlestick Pattern
// three white soldier
tws = (not isUp[3] and isUp[2] and isUp[1] and isUp) and (body[1]>body[2]) and (upperwick<0.1*body and lowerwick<0.1*body) and isTrendDown and Buy
plotshape(tws, color=green, style=shape.triangleup, location=location.belowbar, title='three white soldiers',text='tws')

if (not na(rsi))
    if (crossover(rsi, level_30) and (tws or tws[1]))
        strategy.entry("RsiLE", strategy.long, comment="RsiLE")

// three black crows
tbc = (isUp[3] and not isUp[2] and not isUp[1] and not isUp) and (body[1]>body[2]) and (upperwick<0.1*body and lowerwick<0.1*body) and isTrendUp and Sell
plotshape(tbc, color=red, style=shape.triangledown, location=location.abovebar, title='three black crows',text='tbc')

if (not na(rsi))
    if (crossunder(rsi, level_70)and (tbc or tbc[1]))
        strategy.entry("RsiSE", strategy.short, comment="RsiSE")

// morning star
ms = (not isUp[1]) and (abs(close[1]-open[1])/(high[1]-low[1]) < 0.1) and (close > oc2[2] and close < open[2]) and isTrendDown and Buy
plotshape(ms, color=green, style=shape.triangleup, location=location.belowbar, title='morning star',text='ms')

if (not na(rsi))
    if (crossover(rsi, level_30) and (ms or ms[1]))
        strategy.entry("RsiLE", strategy.long, comment="RsiLE")

// evening star
es = (isUp[1]) and (abs(close[1]-open[1])/(high[1]-low[1]) < 0.1) and (close < oc2[2] and close > open[2]) and isTrendUp and Sell
plotshape(es, color=red, style=shape.triangledown, location=location.abovebar, title='evening star',text='es')

if (not na(rsi))
    if (crossunder(rsi, level_70)and (es or es[1]))
        strategy.entry("RsiSE", strategy.short, comment="RsiSE")

// three inside up
tiu = (not isUp[2]) and (close[1] > oc2[2] and close[1] < open[2]) and (close > high[2]) and isTrendDown and Buy
plotshape(tiu, color=green, style=shape.triangleup, location=location.belowbar, title='three inside up',text='tiu')

if (not na(rsi))
    if (crossover(rsi, level_30) and (tiu or tiu[1]))
        strategy.entry("RsiLE", strategy.long, comment="RsiLE")

// three inside down
tid = (isUp[2]) and (close[1] < oc2[2] and close[1] > open[2]) and (close < low[2]) and isTrendUp and Sell
plotshape(tid, color=red, style=shape.triangledown, location=location.abovebar, title='three inside down',text='tid')

if (not na(rsi))
    if (crossunder(rsi, level_70)and (tid or tid[1]))
        strategy.entry("RsiSE", strategy.short, comment="RsiSE")

if (not na(rsi))
    if (crossover(rsi, level_70))
        //strategy.exit("RsiSE")
        //if(chk[1]==0 or chk[2]==0 or chk[3]==0 or chk[4]==0 or chk[5]==0 or chk[6]==0 or chk[7]==0 or chk[8]==0 or chk[9]==0 or chk[10]==0)
        //if(crossover(col[1],zero) or crossover(col[2],zero) or crossover(col[3],zero) or crossover(col[4],zero) or crossover(col[5],zero) or crossover(col[6],zero) or crossover(col[7],zero) or crossover(col[8],zero))
        //strategy.entry("RsiLE", strategy.long,0, comment="RsiLE")
        strategy.entry("RsiSE", strategy.short, 0, comment="RsiSE")

    if (crossunder(rsi, level_30))
        //strategy.entry("RsiSE", strategy.short,0, comment="RsiSE")
        strategy.entry("RsiLE", strategy.long, 0, comment="RsiLE")

// if (not na(rsi))
//     if (crossover(rsi, level_50))
//         strategy.exit("RsiSE")
//         if(chk[1]==0 or chk[2]==0 or chk[3]==0 or chk[4]==0 or chk[5]==0 or chk[6]==0 or chk[7]==0 or chk[8]==0 or chk[9]==0 or chk[10]==0)
//             if (crossover(col[1],zero) or crossover(col[2],zero) or crossover(col[3],zero) or crossover(col[4],zero) or crossover(col[5],zero) or crossover(col[6],zero) or crossover(col[7],zero) or crossover(col[8],zero))
//         strategy.entry("RsiSE", strategy.short,0, comment="RsiSE")
//     else
//         strategy.exit("RsiSE")
//     if (crossunder(rsi, level_50))
//         strategy.entry("RsiLE", strategy.long, 0, comment="RsiLE")
//     else
//         strategy.exit("RsiLE")

// len = input(14, minval=1, title="RSI Length")
// up = rma(max(change(src), 0), len)
// down = rma(-min(change(src), 0), len)
// rsi = down == 0 ? 100 : up == 0 ? 0 : 100 - (100 / (1 + up / down))





// plotchar(crossover(signal, macd) ? signal*0+.5 : na, color=green, style = circles, linewidth = 5)
// plot(crossunder(signal, macd) ? signal*0+.5 : na, color=red, style = circles, linewidth = 5)
// es = (isUp[1]) and (abs(close[1]-open[1])/(high[1]-low[1]) < 0.1) and (close < oc2[2] and close > open[2]) and isTrendUp //and Sell
// plotshape(es, color=red, style=shape.triangledown, location=location.abovebar, title='evening star',text='es')

// plotshape(crossunder(signal, macd) ? signal*0+.5 : na, title='MACD BUY', style=circles, location=location.abovebar, color=green, text='MACD BUY')
// plotshape(series=crossunder(signal, macd), title='MACD Sell', style=circles, location=location.abovebar, color=red, text='MACD Sell')
