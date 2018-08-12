//@version=2
// this draws the divergence 2 candles after the divergence. Best use is for 60 minute. Ignore for Daily as it is not that useful
// Title:   [STRATEGY][UL]Price Divergence Strategy V1
// Author:  JustUncleL
// Date:    23-Oct-2016
// Version: v1.0
//
// Description:
//  A trend trading strategy the uses Price Divergence detection signals, that
//  are confirmed by the "Murrey's Math Oscillator" (Donchanin Channel based).
//
//  *** USE AT YOUR OWN RISK ***
//
// Mofidifications:
//  1.0 - original
//
// References:
//  Strategy Based on:f
//  - [RS]Price Divergence Detector V2 by RicardoSantos
//  - UCS_Murrey's Math Oscillator by Ucsgears
//  Some Code borrowed from:
//  - "Strategy Code Example by JayRogers"
//  Information on Divergence Trading:
//  - http://www.babypips.com/school/high-school/trading-divergences
//
study(title='Brian Divergence Overlay Indicator', overlay=true)
//  ||  General Input:
method = input(title='Method (0=rsi, 1=macd, 2=stoch, 3=volume, 4=acc/dist, 5=fisher, 6=cci):', type=integer, defval=0, minval=0, maxval=6)
SHOW_LABEL = input(title='Show Labels', type=bool, defval=true)
SHOW_CHANNEL = input(title='Show Channel', type=bool, defval=false)
uHid = input(true,title="Use Hidden Divergence in Strategy")
uReg = input(true,title="Use Regular Divergence in Strategy")
//  ||  RSI / STOCH / VOLUME / ACC/DIST Input:
rsi_smooth = input(title='RSI/STOCH/Volume/ACC-DIST/Fisher/cci Smooth:', type=integer, defval=2)
//  ||  MACD Input:
macd_src = input(title='MACD Source:', type=source, defval=close)
macd_fast = input(title='MACD Fast:', type=integer, defval=12)
macd_slow = input(title='MACD Slow:', type=integer, defval=26)
macd_smooth = input(title='MACD Smooth Signal:', type=integer, defval=9)
//  ||  Functions:
f_top_fractal(_src)=>_src[4] < _src[2] and _src[3] < _src[2] and _src[2] > _src[1] and _src[2] > _src[0]
f_bot_fractal(_src)=>_src[4] > _src[2] and _src[3] > _src[2] and _src[2] < _src[1] and _src[2] < _src[0]
f_fractalize(_src)=>f_top_fractal(_src) ? 1 : f_bot_fractal(_src) ? -1 : 0

//  ||••>   START MACD FUNCTION
f_macd(_src, _fast, _slow, _smooth)=>
    _fast_ma = sma(_src, _fast)
    _slow_ma = sma(_src, _slow)
    _macd = _fast_ma-_slow_ma
    _signal = ema(_macd, _smooth)
    _hist = _macd - _signal
//  ||<••   END MACD FUNCTION

//  ||••>   START ACC/DIST FUNCTION
f_accdist(_smooth)=>_return=sma(cum(close==high and close==low or high==low ? 0 : ((2*close-low-high)/(high-low))*volume), _smooth)
//  ||<••   END ACC/DIST FUNCTION

//  ||••>   START FISHER FUNCTION
f_fisher(_src, _window)=>
    _h = highest(_src, _window)
    _l = lowest(_src, _window)
    _value0 = .66 * ((_src - _l) / max(_h - _l, .001) - .5) + .67 * nz(_value0[1])
    _value1 = _value0 > .99 ? .999 : _value0 < -.99 ? -.999 : _value0
    _fisher = .5 * log((1 + _value1) / max(1 - _value1, .001)) + .5 * nz(_fisher[1])
//  ||<••   END FISHER FUNCTION

method_high = method == 0 ? rsi(high, rsi_smooth) :
  method == 1 ? f_macd(macd_src, macd_fast, macd_slow, macd_smooth) :
  method == 2 ? stoch(close, high, low, rsi_smooth) :
  method == 3 ? sma(volume, rsi_smooth) :
  method == 4 ? f_accdist(rsi_smooth) :
  method == 5 ? f_fisher(high, rsi_smooth) :
  method == 6 ? cci(high, rsi_smooth) :
  na

method_low = method == 0 ? rsi(low, rsi_smooth) :
  method == 1 ? f_macd(macd_src, macd_fast, macd_slow, macd_smooth) :
  method == 2 ? stoch(close, high, low, rsi_smooth) :
  method == 3 ? sma(volume, rsi_smooth) :
  method == 4 ? f_accdist(rsi_smooth) :
  method == 5 ? f_fisher(low, rsi_smooth) :
  method == 6 ? cci(low, rsi_smooth) :
  na

fractal_top = f_fractalize(method_high) > 0 ? method_high[2] : na
fractal_bot = f_fractalize(method_low) < 0 ? method_low[2] : na

high_prev = valuewhen(fractal_top, method_high[2], 1)
high_price = valuewhen(fractal_top, high[2], 1)
low_prev = valuewhen(fractal_bot, method_low[2], 1)
low_price = valuewhen(fractal_bot, low[2], 1)

regular_bearish_div = fractal_top and high[2] > high_price and method_high[2] < high_prev
hidden_bearish_div = fractal_top and high[2] < high_price and method_high[2] > high_prev
regular_bullish_div = fractal_bot and low[2] < low_price and method_low[2] > low_prev
hidden_bullish_div = fractal_bot and low[2] > low_price and method_low[2] < low_prev

plot(title='H F', series=fractal_top ? high[2] : na, color=regular_bearish_div or hidden_bearish_div ? maroon : not SHOW_CHANNEL ? na : silver, offset=-2)
plot(title='L F', series=fractal_bot ? low[2] : na, color=regular_bullish_div or hidden_bullish_div ? green : not SHOW_CHANNEL ? na : silver, offset=-2)
plot(title='H D', series=fractal_top ? high[2] : na, style=circles, color=regular_bearish_div or hidden_bearish_div ? maroon : not SHOW_CHANNEL ? na : silver, linewidth=5, offset=-2)
plot(title='L D', series=fractal_bot ? low[2] : na, style=circles, color=regular_bullish_div or hidden_bullish_div ? green : not SHOW_CHANNEL ? na : silver, linewidth=5, offset=-2)

plotshape(title='+RBD', series=not SHOW_LABEL ? na : regular_bearish_div ? high[2] : na, text='R', style=shape.labeldown, location=location.absolute, color=maroon, textcolor=white, offset=-2)
plotshape(title='+HBD', series=not SHOW_LABEL ? na : hidden_bearish_div ? high[2] : na, text='H', style=shape.labeldown, location=location.absolute, color=maroon, textcolor=white, offset=-2)
plotshape(title='-RBD', series=not SHOW_LABEL ? na : regular_bullish_div ? low[2] : na, text='R', style=shape.labelup, location=location.absolute, color=green, textcolor=white, offset=-2)
plotshape(title='-HBD', series=not SHOW_LABEL ? na : hidden_bullish_div ? low[2] : na, text='H', style=shape.labelup, location=location.absolute, color=green, textcolor=white, offset=-2)
