//@version=3

study("Candle Structure", overlay=true)
body = abs(close - open)
oc2 = min(close, open) + body/2
upperwick = high - max(open, close)
lowerwick = min(open, close) - low

isUp = close > open
isDoji = abs(close-open)/(high-low) < 0.05

// Single Candlestick Pattern

// white marubozu
wm = (isUp) and (upperwick <= 0.05*body) and (lowerwick <= 0.05*body)
plotshape(wm, color=green, style=shape.triangleup, location=location.belowbar, title='white marubozu',text='wm')

// black marubozu
bm = (not isUp) and (upperwick <= 0.05*body) and (lowerwick <= 0.05*body)
plotshape(bm, color=red, style=shape.triangledown, location=location.abovebar, title='black marubozu',text='bm')

// hammer
h = (isUp) and (lowerwick >= 2*body) and (upperwick <= 0.1*body)
plotshape(h, color=green, style=shape.triangleup, location=location.belowbar, title='hammer',text='h')

// hanging man
hm = (not isUp) and (lowerwick >= 2*body) and (upperwick <= 0.1*body)
plotshape(hm, color=red, style=shape.triangledown, location=location.abovebar, title='hanging man',text='hm')

// inverted hammer
ih = (isUp) and (upperwick >= 2*body) and (lowerwick <= 0.1*body)
plotshape(ih, color=green, style=shape.triangleup, location=location.belowbar, title='inverted hammer',text='ih')

// shooting star
// ss = (not isUp) and (upperwick >= 2*body) and (lowerwick <= 0.1*body)
// plotshape(ss, color=red, style=shape.triangledown, location=location.abovebar, title='shooting star',text='ss')


data4=(open[1] < close[1] and open > close[1] and high - max(open, close) >= abs(open - close) * 3 and min(close, open) - low <= abs(open - close))
plotshape(data4, title= "Shooting Star", color=red, style=shape.triangledown, text="HUGEEEEEEEE")


// Double Candlestick Pattern

// bullish engulfing
bulle = not isDoji[1] and (not isUp[1] and isUp) and (close >= open[1] and open <= close[1])
plotshape(bulle, color=green, style=shape.triangleup, location=location.belowbar, title='bullish engulfing', text='e')

// bearish engulfing
beare = not isDoji[1] and (isUp[1] and not isUp) and (open > close[1] and close <= open[1])
plotshape(beare, color=red, style=shape.triangledown, location=location.abovebar, title='bearish engulfing',text='e')

// tweezer bottom
twb = (not isUp[1] and isUp) and (min(lowerwick,lowerwick[1])/max(lowerwick,lowerwick[1]) >= 0.99) and (min(low,low[1])/max(low,low[1]) >= 0.99)
plotshape(twb, color=green, style=shape.triangleup, location=location.belowbar, title='tweezer bottom', text='tb')

// tweezer top
twt = (isUp[1] and not isUp) and (min(upperwick,upperwick[1])/max(upperwick,upperwick[1]) >= 0.99) and (min(high,high[1])/max(high,high[1]) >= 0.99)
plotshape(twt, color=red, style=shape.triangledown, location=location.abovebar, title='tweezer top',text='tt')

// Triple Candlestick Pattern

// three white soldier
tws = (not isUp[3] and isUp[2] and isUp[1] and isUp) and (body[1]>body[2]) and (upperwick<0.1*body and lowerwick<0.1*body)
plotshape(tws, color=green, style=shape.triangleup, location=location.belowbar, title='three white soldiers',text='tws')

// three black crows
tbc = (isUp[3] and not isUp[2] and not isUp[1] and not isUp) and (body[1]>body[2]) and (upperwick<0.1*body and lowerwick<0.1*body)
plotshape(tbc, color=red, style=shape.triangledown, location=location.abovebar, title='three black crows',text='tbc')

// morning star
ms = (not isUp[1]) and (abs(close[1]-open[1])/(high[1]-low[1]) < 0.1) and (close > oc2[2] and close < open[2])
plotshape(ms, color=green, style=shape.triangleup, location=location.belowbar, title='morning star',text='ms')

// evening star
es = (isUp[1]) and (abs(close[1]-open[1])/(high[1]-low[1]) < 0.1) and (close < oc2[2] and close > open[2])
plotshape(es, color=red, style=shape.triangledown, location=location.abovebar, title='evening star',text='es')

// three inside up
tiu = (not isUp[2]) and (close[1] > oc2[2] and close[1] < open[2]) and (close > high[2])
plotshape(tiu, color=green, style=shape.triangleup, location=location.belowbar, title='three inside up',text='tiu')

// three inside down
tid = (isUp[2]) and (close[1] < oc2[2] and close[1] > open[2]) and (close < low[2])
plotshape(tid, color=red, style=shape.triangledown, location=location.abovebar, title='three inside down',text='tid')


//Created By ChrisMoody on 1-20-2014
//Credit Goes To Chris Capre from 2nd Skies Forex

study("CM_Price-Action-Bars", overlay=true)

pctP = input(66, minval=1, maxval=99, title="Percentage Input For PBars, What % The Wick Of Candle Has To Be")
pblb = input(6, minval=1, maxval=100, title="PBars Look Back Period To Define The Trend of Highs and Lows")
pctS = input(5, minval=1, maxval=99, title="Percentage Input For Shaved Bars, Percent of Range it Has To Close On The Lows or Highs")
spb = input(false, title="Show Pin Bars?")
ssb = input(false, title="Show Shaved Bars?")
sib = input(false, title="Show Inside Bars?")
sob = input(false, title="Show Outside Bars?")
sgb = input(false, title="Check Box To Turn Bars Gray?")

//PBar Percentages
pctCp = pctP * .01
pctCPO = 1 - pctCp

//Shaved Bars Percentages
pctCs = pctS * .01
pctSPO = pctCs

range = high - low

///PinBars
pBarUp() => spb and open > high - (range * pctCPO) and close > high - (range * pctCPO) and low <= lowest(pblb) ? 1 : 0
pBarDn() => spb and open < high - (range *  pctCp) and close < high-(range * pctCp) and high >= highest(pblb) ? 1 : 0

//Shaved Bars
sBarUp() => ssb and (close >= (high - (range * pctCs)))
sBarDown() => ssb and close <= (low + (range * pctCs))

//Inside Bars
insideBar() => sib and high <= high[1] and low >= low[1] ? 1 : 0
outsideBar() => sob and (high > high[1] and low < low[1]) ? 1 : 0

//PinBars
barcolor(pBarUp() ? lime : na)
barcolor(pBarDn() ? red : na)
//Shaved Bars
barcolor(sBarDown() ? fuchsia : na)
barcolor(sBarUp() ? aqua : na)
//Inside and Outside Bars
barcolor(insideBar() ? yellow : na )
barcolor(outsideBar() ? orange : na )

barcolor(sgb and close ? gray : na)
