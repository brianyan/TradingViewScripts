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
ss = (not isUp) and (upperwick >= 2*body) and (lowerwick <= 0.1*body)
plotshape(ss, color=red, style=shape.triangledown, location=location.abovebar, title='shooting star',text='ss')


data4=(open[1] < close[1] and open > close[1] and high - max(open, close) >= abs(open - close) * 3 and min(close, open) - low <= abs(open - close))
plotshape(data4, title= "Shooting Star", color=red, style=shape.triangledown, text="Shooting\nStar")


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


#
#
# // new candlesticks from other thread
#
# DojiSize = input(0.05, minval=0.01, title="Doji size")
# data=(abs(open - close) <= (high - low) * DojiSize)
# plotchar(data, title="Doji", text='Doji', color=white)
#
#
# data3=(close[2] < open[2] and max(open[1], close[1]) < close[2] and open > max(open[1], close[1]) and close > open )
# plotshape(data3,  title= "Morning Star", location=location.belowbar, color=lime, style=shape.arrowup, text="Morning\nStar")
#
# data4=(open[1] < close[1] and open > close[1] and high - max(open, close) >= abs(open - close) * 3 and min(close, open) - low <= abs(open - close))
# plotshape(data4, title= "Shooting Star", color=red, style=shape.arrowdown, text="Shooting\nStar")
#
# data5=(((high - low)>3*(open -close)) and  ((close - low)/(.001 + high - low) > 0.6) and ((open - low)/(.001 + high - low) > 0.6))
# plotshape(data5, title= "Hammer", location=location.belowbar, color=white, style=shape.diamond, text="H")
#
# data5b=(((high - low)>3*(open -close)) and  ((high - close)/(.001 + high - low) > 0.6) and ((high - open)/(.001 + high - low) > 0.6))
# plotshape(data5b, title= "Inverted Hammer", location=location.belowbar, color=white, style=shape.diamond, text="IH")
#
#
# data6=(close[1] > open[1] and open > close and open <= close[1] and open[1] <= close and open - close < close[1] - open[1] )
# plotshape(data6, title= "Bearish Harami",  color=red, style=shape.arrowdown, text="Bearish\nHarami")
#
# data7=(open[1] > close[1] and close > open and close <= open[1] and close[1] <= open and close - open < open[1] - close[1] )
# plotshape(data7,  title= "Bullish Harami", location=location.belowbar, color=lime, style=shape.arrowup, text="Bullish\nHarami")
#
# data8=(close[1] > open[1] and open > close and open >= close[1] and open[1] >= close and open - close > close[1] - open[1] )
# plotshape(data8,  title= "Bearish Engulfing", color=red, style=shape.arrowdown, text="Bearish\nEngulfing")
#
# data9=(open[1] > close[1] and close > open and close >= open[1] and close[1] >= open and close - open > open[1] - close[1] )
# plotshape(data9, title= "Bullish Engulfing", location=location.belowbar, color=lime, style=shape.arrowup, text="Bullish\nEngulfling")
#
# upper = highest(10)[1]
# data10=(close[1] < open[1] and  open < low[1] and close > close[1] + ((open[1] - close[1])/2) and close < open[1])
# plotshape(data10, title= "Piercing Line", location=location.belowbar, color=lime, style=shape.arrowup, text="Piercing\nLine")
#
# lower = lowest(10)[1]
# data11=(low == open and  open < lower and open < close and close > ((high[1] - low[1]) / 2) + low[1])
# plotshape(data11, title= "Bullish Belt", location=location.belowbar, color=lime, style=shape.arrowup, text="Bullish\nBelt")
#
# data12=(open[1]>close[1] and open>=open[1] and close>open)
# plotshape(data12, title= "Bullish Kicker", location=location.belowbar, color=lime, style=shape.arrowup, text="Bullish\nKicker")
#
# data13=(open[1]<close[1] and open<=open[1] and close<=open)
# plotshape(data13, title= "Bearish Kicker", color=red, style=shape.arrowdown, text="Bearish\nKicker")
#
# data14=(((high-low>4*(open-close))and((close-low)/(.001+high-low)>=0.75)and((open-low)/(.001+high-low)>=0.75)) and high[1] < open and high[2] < open)
# plotshape(data14,  title= "Hanging Man", color=red, style=shape.arrowdown, text="Hanging\nMan")
#
# data15=((close[1]>open[1])and(((close[1]+open[1])/2)>close)and(open>close)and(open>close[1])and(close>open[1])and((open-close)/(.001+(high-low))>0.6))
# plotshape(data15, title= "Dark Cloud Cover", color=red, style=shape.arrowdown, text="Dark\nCloudCover")
