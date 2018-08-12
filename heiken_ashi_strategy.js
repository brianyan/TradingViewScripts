//@version=2
//Heikin Ashi Strategy  V2 Strategy 5minute time interval

strategy("Heikin Ashi Strategy 1hr",shorttitle="HAS V3",overlay=true,default_qty_type=strategy.cash, default_qty_value=8, commission_type=strategy.commission.percent, commission_value=0.25)
res = input(title="Heikin Ashi Candle Time Frame", type=resolution, defval="60")
hshift = input(1,title="Heikin Ashi Candle Time Frame Shift")
res1 = input(title="Heikin Ashi EMA Time Frame", type=resolution, defval="180")
mhshift = input(0,title="Heikin Ashi EMA Time Frame Shift")
fama = input(1,"Heikin Ashi EMA Period")
test = input(1,"Heikin Ashi EMA Shift")
sloma = input(20,"Slow EMA Period")
slomas = input(1,"Slow EMA Shift")
macdf = input(false,title="With MACD filter")
res2 = input(title="MACD Time Frame", type=resolution, defval="15")
macds = input(1,title="MACD Shift")

fast_trend_ema = ema(close, 7)
fast_trend_sma = sma(close, 7)
medium_trend_ema = ema(close, 50)
medium_trend_sma = sma(close, 50)
slow_trend_ema = ema(close, 77)
slow_trend_sma = sma(close, 77)

// plot(fast_trend_ema, title = "fast trend ema", color=blue, linewidth=2, style=line)
// plot(medium_trend_ema, title = "medium trend ema", color=yellow, linewidth=2, style=line)
// plot(slow_trend_ema, title = "slow trend ema", color=orange, linewidth=2, style=line)
plot(slow_trend_sma, title="slow trend sma", color=fuchsia, linewidth=2, style=line)
plot(medium_trend_sma, title="slow trend sma", color=yellow, linewidth=2, style=line)



//Heikin Ashi Open/Close Price
ha_t = heikinashi(tickerid)
ha_open = security(ha_t, res, open[hshift])
ha_close = security(ha_t, res, close[hshift])
mha_close = security(ha_t, res1, close[mhshift])

//macd
[macdLine, signalLine, histLine] = macd(close, 6, 15, 3)
macdl = security(ha_t,res2,macdLine[macds])
macdsl= security(ha_t,res2,signalLine[macds])

//Moving Average
// fma_uptrend = fma >fma[1]
fma = ema(mha_close[test],fama)
sma = ema(ha_close[slomas],sloma)
plot(fma,title="MA",color=lime,linewidth=2,style=line)
plot(sma,title="SMA",color=red,linewidth=2,style=line)

testStartYear = input(2017, "Backtest Start Year")
testStartMonth = input(5, "Backtest Start Month")
testStartDay = input(15, "Backtest Start Day")
testPeriodStart = timestamp(testStartYear,testStartMonth,testStartDay,23,0)

testStopYear = input(2018, "Backtest Stop Year")
testStopMonth = input(8, "Backtest Stop Month")
testStopDay = input(17, "Backtest Stop Day")
testPeriodStop = timestamp(testStopYear,testStopMonth,testStopDay,0,0)

// A switch to control background coloring of the test period
testPeriodBackground = input(title="Color Background?", type=bool, defval=true)
testPeriodBackgroundColor = testPeriodBackground and (time >= testPeriodStart) and (time <= testPeriodStop) ? #00FF00 : na
bgcolor(testPeriodBackgroundColor, transp=97)

// uptrend = rising(open,5)
testPeriod() =>
    time >= testPeriodStart and time <= testPeriodStop ? true : false

// moving averages
src = close
useCurrentRes = input(true, title="Use Current Chart Resolution?")
resCustom = input(title="Use Different Timeframe? Uncheck Box Above", type=resolution, defval="D")
len = input(20, title="Moving Average Length - LookBack Period")
atype = input(1,minval=1,maxval=7,title="1=SMA, 2=EMA, 3=WMA, 4=HullMA, 5=VWMA, 6=RMA, 7=TEMA")
cc = input(true,title="Change Color Based On Direction?")
smoothe = input(2, minval=1, maxval=10, title="Color Smoothing - 1 = No Smoothing")


res_ma = useCurrentRes ? period : resCustom
//hull ma definition
hullma = wma(2*wma(src, len/2)-wma(src, len), round(sqrt(len)))
//TEMA definition
ema1 = ema(src, len)
ema2 = ema(ema1, len)
ema3 = ema(ema2, len)
tema = 3 * (ema1 - ema2) + ema3

avg = atype == 1 ? sma(src,len) : atype == 2 ? ema(src,len) : atype == 3 ? wma(src,len) : atype == 4 ? hullma : atype == 5 ? vwma(src, len) : atype == 6 ? rma(src,len) : tema
out = avg
out1 = security(tickerid, res_ma, out)
ma_up = out1 >= out1[smoothe] // determines if it is in uptrend
ma_down = out1 < out1[smoothe] // determines if it is in downtrend

col = cc ? ma_up ? lime : ma_down ? red : aqua : aqua
plot(out1, title="Multi-Timeframe Moving Avg", style=line, linewidth=4, color = col)

//Strategy
rising_medium_sma = rising(medium_trend_sma, 4)
ema_uptrend = rising(fast_trend_ema,5) and rising(medium_trend_ema,5) and  rising(slow_trend_ema, 5)
golong = crossover(fma,sma)
golong1 = (crossover(fma,sma) and (macdl > macdsl or macdf == false) and ma_up and rising_medium_sma) // and rising_medium_sma) /// and ema_uptrend) or (fma > sma and crossover(fast_trend_ema, medium_trend_ema))
golong2 =   crossover(fast_trend_sma, slow_trend_sma) and fma > sma and rising_medium_sma // this is the later second confirmation. you usually want this to be pretty reliable
// golong3 = fma > fast_trend_sma and fma > // all trends point upwards
// golong2 = crossover(fast_trend_sma, slow_trend_sma) and fma > sma// buy entries
// don't buy when sma is not on upward trend. // only buy when sma is downward trend but 2-3 other indicators tell you to buy.
// fma crosses over sma, in a ranging trend. Ranging trends are more likely to make a big move up so I'm willing to wager
goshort1 = crossunder(fma,sma) and (macdl < macdsl or macdf == false) and ma_down // and (medium_trend_ema > fast_trend_ema)
goshort2 = crossunder(fast_trend_sma, slow_trend_sma) and fma < sma and ma_down
// I want it to sell when a signal is given. I am willing to wait for the system to tell me to sell. I'm willing to sacrifice profit until the signal is given.
// I'm willing to stay in a trade as long as possible. I'm willing to exit when an exit signal is given.
// I want to sell when the RSI is high and another indicator is high, I don't want to exit until I HAVE to exit.

buycondition =  ma_up // and medium_trend_sma > slow_trend_sma
sellcondition = ma_down  // and medium_trend_sma < slow_trend_sma
if strategy.position_size == 0
    strategy.order("Buy",strategy.long, qty=8, when = buycondition)
if strategy.position_size > 0
    strategy.order("Sell",strategy.short,qty=8, when = (sellcondition))
