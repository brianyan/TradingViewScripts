


// === STRATEGY - Long POSITION EXECUTION ===

enterLong() => bullish
exitLong() => bearish
strategy.entry(id = "Buy", long = true, when = enterLong() )// use function or simple condition to decide when to get in
strategy.close(id = "Buy", when = exitLong() )// ...and when to get out

// === STRATEGY - SHORT POSITION EXECUTION ===
enterShort() => bearish
exitShort() => bullish
strategy.entry(id = "Sell", long = false, when = enterShort())
strategy.close(id = "Sell", when = exitShort() )


// // === STRATEGY RISK MANAGEMENT EXECUTION ===
// // finally, make use of all the earlier values we got prepped

inpStopLoss     = input(defval = 0, title = "Stop Loss Points", minval = 0)
useStopLoss     = inpStopLoss    >= 1 ? inpStopLoss    : na

strategy.exit("Exit Buy", from_entry = "Buy", loss = useStopLoss)
strategy.exit("Exit Sell", from_entry = "Sell", loss = useStopLoss)


// STRATEGY TIME setInterval(function () {


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
