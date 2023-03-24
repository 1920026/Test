import matplotlib.pyplot as plt
import numpy as np
import math
from decimal import Decimal
from fractions import Fraction
import clipboard
import console

'''
実験結果から
オシロスコープと同じ結果　を出力する

発信周波数が計算結果の周波数と一致しているか　
測定値によるVmが計算結果のVmと一致しているか　を出力する
'''


a = input()
l = a.split(',')
f = '' # 発信周波数
waveform = '' # 全波・半波・三角波・その他
attenuator = '' # アッテネータ比
volts_div = '' # VOLTS/DIV
time_div = '' # SEC/DIV
top = '' # 波の最大値の位置
bottom = '' # 波の最小値の位置
baseline = '' # 基線の位置
beside = '' # 1周期のDIV数
ve = '' # 測定値

#vertical = '' # ピーク・デイップ間のDIV数

if len(l) == 10:
	f = l[0]
	waveform = l[1]
	attenuator = float(l[2])
	volts_div = l[3]
	time_div = l[4]
	top = l[5]
	bottom = l[6]
	baseline = l[7]
	beside = float(l[8])
	ve = l[9]
	
	#vertical = float(l[5])


'''
f = input('周波数（任意） = ') # 発信周波数
print('\n')
waveform = input('波形 = ') # 全波・半波
print('\n')
# アッテネータ比
attenuator = input('アッテネータ比 = 1：')
print('\n')
volts_div = input('VOLTS/DIV = ') # VOLTS/DIV
time_div = input('TIME/DIV = ') # SEC/DIV
print('\n')
# 波の最大値の位置
top = input('波の最大値の位置 = ')
# 波の最小値の位置
bottom = input('波の最小値の位置 = ')
# 基線の位置
baseline = input('基線の位置 = ')
print('\n')
# ピーク・デイップ間のDIV数
#vertical = float(input('ピーク・デイップ間のDIV数 = '))
# 1周期のDIV数
beside = input('1周期のDIV数 = ')
print('\n')
ve = input('測定値（任意） = ') # 測定値（実効値）
print('\n')

clipboard.set(str(f)+','+str(waveform)+','+str(attenuator) +','+ str(volts_div)+','+str(time_div)+','+str(top)+','+str(bottom)+','+str(baseline)+','+str(beside)+','+str(ve))
console.hud_alert('コピーしました')

attenuator = float(attenuator)
beside = float(beside)
'''



# f
f2 = ''
if f != '':
	k = f
	if k[-1] == 'k':
		f2 = float(''.join(k[:-1])) * 1000
	else :
		f2 = float(f)

# volts_div
l = volts_div
if l[-1] == 'm':
	volts_div2 = float(''.join(l[:-1])) / 1000
else :
	volts_div2 = float(volts_div)

# time_div
j = time_div
if j[-1] == 'm':
	time_div2 = float(''.join(j[:-1])) / 1000
elif j[-1] == 'μ':
	time_div2 = float(''.join(j[:-1])) / 1000000
else :
	time_div2 = float(time_div)

# Ve
ve2 = ''
if ve != '':	
	h = ve
	if h[-1] == 'm':
		ve2 = float(''.join(h[:-1])) / 1000
	else :
		ve2 = float(ve)
	
	
	
print('\n'*10)
print('VOLTS/DIV =', volts_div, '[V/DIV]')
print('TIME/DIV =', time_div, '[s/DIV]')
print('\n')
print('ピーク・デイップ間のDIV数 = ', Decimal(top)-Decimal(bottom))
print('1周期のDIV数 = ', beside)


# Vp-p
print('\n')
print('Vp-p = VOLTS/DIV × アッテネータ比 × p-pDIV数')
print('　　　= ' + volts_div + '[V/DIV]' + ' × ' + str(attenuator) + ' × ' + str(Decimal(top)-Decimal(bottom)) + '[DIV]')
v_pp = volts_div2 * attenuator * float(Decimal(top)-Decimal(bottom))
print('     =', v_pp, '[V]')
print('　　　=', v_pp * 1000, '[mV]')

# Vmax
print('\n')
print('Vmax = VOLTS/DIV × アッテネータ比 × maxDIV数')
print('     = ' + volts_div + '[V/DIV]' + ' × ' + str(attenuator) + ' × ' + str(Decimal(top)-Decimal(baseline)) + '[DIV]')
vm = volts_div2 * attenuator * float(Decimal(top)-Decimal(baseline))
print('     =', vm, '[V]')
print('     =', vm * 1000, '[mV]')


# Vmin
print('\n')
print('Vmin = VOLTS/DIV × アッテネータ比 × minDIV数')
print('     = ' + volts_div + '[V/DIV]' + ' × ' + str(attenuator) + ' × ' + str(Decimal(bottom)-Decimal(baseline)) + '[DIV]')
vmin = volts_div2 * attenuator * float(Decimal(bottom)-Decimal(baseline))
print('     =', vmin, '[V]')
print('     =', vmin * 1000, '[mV]')


'''
print('\n')
if waveform == '全波' or waveform == '半波':
	print('Vm = Vp-p')
	print('   = ' + str(v_pp) + '[V]')
	vm = v_pp
else:
	print('Vm = Vp-p ÷ 2')
	print('   = ' + str(v_pp) + '[V]' + ' ÷ 2')
	vm = v_pp / 2
print('   =', vm, '[V]')
print('   =', vm * 1000, '[mV]')
'''


# Ve
print('\n')
if waveform == '三角波':
	print('Ve = Vmin + Vp-p ÷ √3')
	print('   = ' + str(vmin) + '[V] + ' + str(v_pp) + ' ÷ √3')
	vee = vmin + (v_pp / math.sqrt(3))
elif waveform == '半波':
	print('Ve = Vmin + Vp-p ÷ 2')
	print('   = ' + str(vmin) + '[V] + ' + str(v_pp) + ' ÷ 2')
	vee = vmin + (v_pp / 2)
else:
	print('Ve = Vmin + Vp-p ÷ √2')
	print('   = ' + str(vmin) + '[V] + ' + str(v_pp) + ' ÷ √2')
	vee = vmin + (v_pp / math.sqrt(2))
print('   =', format(vee, '.4f'), '[V]')
print('   =', format(vee * 1000, '.1f'), '[mV]')
	

'''
print('\n')
if waveform != '半波':
	print('Ve = Vm ÷ √2')
	print('   = ' + str(vm) + '[V]' + '÷ √2')
	vee = vm / math.sqrt(2)
elif waveform == '半波':
	print('Ve = Vm ÷ 2')
	print('   = ' + str(vm) + '[V]' + '÷ 2')
	vee = vm / 2
print('   =', format(vee, '.4f'), '[V]')
print('   =', format(vee * 1000, '.1f'), '[mV]')
'''

if ve2 != '':
	print('\n', '測定値 =', ve2, '[V]')
	print('　　　  =', ve2 * 1000, '[mV]')
	print('\n', 'Veの誤差 =', format(math.fabs(vee - ve2), '.3f'), '[V]')
	print('         =', format(math.fabs((vee - ve2)*1000), '.1f'), '[mV]')

'''
if ve2 != '':
	vm2 = math.sqrt(2) * ve2
	print('\n', '測定値によるVm =', format(vm2, '.5f'), '[V]')
	print('　　　　　　　　 =', format(vm2 * 1000, '.3f'), '[mV]')
	print('\n', 'Vmの誤差 =', format(vm - vm2, '.5f'), '[V]')
	print('　　　　  =', format((vm - vm2)*1000, '.3f'), '[mV]')
'''
	

print('\n')
print('T = TIME/DIV × 横DIV数')
print('  = ' + time_div + '[s/DIV]' +' × ' +  str(beside) + '[DIV]')
t = time_div2 * beside
print('  =', format(t, '.8f').rstrip('0'), '[s]')
print('  =', format(t * 1000, '.2f'),  '[ms]')
print('  =', format(t * 1000000, '.2f'), '[μs]' )

print('\n')
print('f = 1 ÷ T')
print('  = 1 ÷ ' + str(format(t, '.8f').rstrip('0')) + '[s]')
f = 1 / t
print('  =', format(f, '.4f').rstrip('0'), '[Hz]')
print('  =', format(f / 1000, '.4f').rstrip('0'), '[kHz]')

if f2 != '':
	print('\n', '周波数の誤差 =', format(f - f2, '.4f'), '[Hz]')
	print('　　　　　　  =', format(math.fabs((f - f2)/1000), '.8f'), '[kHz]')
	
print('\n'*10)
	





w = 2 * np.pi * f # 角周波数
d = t # 周期

d2 = str(format(d, '.8f')).split('.')
d3 = d2[-1].strip('0')
d4 = float(d3[0])
d5 = d / (100 * d4)

range = [-6*time_div2, 6*time_div2+d5] # 範囲

t = np.arange(range[0], range[1], d5) # 周期（配列）

y = []
list = vm * np.sin(w * t + 0)
if waveform == '全波':
	for i in list:
		if i < 0:
			i = math.fabs(i)
		y.append(i)
elif waveform == '半波':
	for i in list:
		if i < 0:
			i = 0
		y.append(i)	
else:
	y = list
	

a = -1 * 4 * (vm / float(Decimal(top)-Decimal(baseline)))



plt.plot(t, y)
plt.xlabel('T[s]')
plt.ylabel('V[V]')
plt.xticks(np.arange(range[0], range[1], time_div2)) # TIME/DIV
plt.yticks(np.arange(a, math.fabs(a)+1, volts_div2*attenuator))
#plt.yticks(np.arange(-2*vm, 2.1*vm, volts_div2*attenuator))
plt.axvline(x = 0, color = 'k')
plt.axvline(x = 5*time_div2, color = 'k')
plt.axvline(x = -5*time_div2, color = 'k')
plt.axhline(y = 0, color = 'k')
plt.grid()
plt.show()
