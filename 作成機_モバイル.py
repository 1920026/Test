import ui
import clipboard
import console
import keyboard

#作成後、新たなスクロール作成、追加


# 全角・半角 変換
ZEN = "".join(chr(0xff01 + i) for i in range(94))
HAN = "".join(chr(0x21 + i) for i in range(94))

ZEN2HAN = str.maketrans(ZEN, HAN)
HAN2ZEN = str.maketrans(HAN, ZEN)



def SegmentedControl(sender):
	global question_flag, answer_flag, other_flag
	

	
	if sender.selected_index == 0:
		
		question_flag = True
		answer_flag = False
		for i in question_list:
			sv.add_subview(i)
		if not switch1.value:
			v.remove_subview(scrollview1)
		for i in answer_list:
			v.remove_subview(i)
		if other_flag:
			v.remove_subview(textfield_1)
			
		#label1.text = '問題番号'
		label2.text = '－'
		label3.text = '問題'
		

	
			
	if sender.selected_index == 1:
			
		question_flag = False
		answer_flag = True
		for i in question_list:
			v.remove_subview(i)
		for i in answer_list:
			sv.add_subview(i)
		if other_flag:
			sv.add_subview(textfield_1)
			v.remove_subview(scrollview2)
			
		for q, a in zip(textview_q, textview_a):
			a.text = q.text
			a.editable = False
		
		#label1.text = 'ページ'
		label2.text = 'P.'
		label3.text = '解説'
		



				
def SegmentedControl2(sender):
	global select_flag, cw_flag, other_flag
	
	if sender.selected_index == 0:
		select_flag = True
		cw_flag = False
		other_flag = False
		sv.add_subview(scrollview2)
		for i in button_dict1.keys():
			scrollview2.add_subview(i)
		for i in button_dict1.values():
			scrollview2.add_subview(i)
		for i in button_dict2.keys():
			scrollview2.remove_subview(i)
		for i in button_dict2.values():
			scrollview2.remove_subview(i)
		v.remove_subview(textfield_1)
		
	if sender.selected_index == 1:
		select_flag = False
		cw_flag = True
		other_flag = False
		sv.add_subview(scrollview2)
		for i in button_dict1.keys():
			scrollview2.remove_subview(i)
		for i in button_dict1.values():
			scrollview2.remove_subview(i)
		for i in button_dict2.keys():
			scrollview2.add_subview(i)
		for i in button_dict2.values():
			scrollview2.add_subview(i)
		v.remove_subview(textfield_1)
		
	if sender.selected_index == 2:
		select_flag = False
		cw_flag = False
		other_flag = True
		v.remove_subview(scrollview2)
		for i in button_dict1.keys():
			scrollview2.remove_subview(i)
		for i in button_dict1.values():
			scrollview2.remove_subview(i)
		for i in button_dict2.keys():
			scrollview2.remove_subview(i)
		for i in button_dict2.values():
			scrollview2.remove_subview(i)
		sv.add_subview(textfield_1)
		
	

		
						
def Switch1(sender):
	global select_flag, cw_flag, other_flag
	if sender.value:
		sv.add_subview(scrollview1)
		segmentedcontrol2.enabled = True
	else:
		v.remove_subview(scrollview1)
		segmentedcontrol2.selected_index = 2
		#segmentedcontrol2.enabled = False
		select_flag = False
		cw_flag = False
		other_flag = True
		


				
def Button1(sender):
	if button_dict1[sender].text == '':
		button_dict1[sender].text = '✔︎'
	elif button_dict1[sender].text == '✔︎':
		button_dict1[sender].text = ''		

def Button2(sender):
	if button_dict2[sender].text == '○':
		button_dict2[sender].text = '✗'
	elif button_dict2[sender].text == '✗':
		button_dict2[sender].text = '○'
		
def Button0(sender):
	v.remove_subview(textview0)
	v.remove_subview(button0)
	v.remove_subview(button0_1)
	
def Button0_1(sender):
	clipboard.set(textview0.text)
	console.hud_alert('コピーしました')
	
	
	


def Button3(sender):
	global select_count, textview_eq, textview_ea, button_eq, label_eq, button_ea, label_ea, textview_eq_l, textview_ea_l, button_eq_l, label_eq_l, button_ea_l, label_ea_l, select_flag, cw_flag
	
	select_count += 1
	#問題
	textview_eq = ui.TextView()
	textview_eq.name = 'textview_' + str(select_count+1)
	text_han = '(' + str(select_count+1) + ')'
	textview_eq.text = text_han.translate(HAN2ZEN)
	textview_eq.font = ('<System>', 17)
	textview_eq.border_color = 'black'
	textview_eq.border_width = 1
	textview_eq.bounds = (0, 0, 402, 40)
	textview_eq.center = (201, 20 + 39 * select_count)
	scrollview1.add_subview(textview_eq)
	textview_q.append(textview_eq)
	textview_eq_l.append(textview_eq)
	
	scrollview1.content_size = (320, 235 + 39 * (select_count - 4))
	
	#解答
	textview_ea = ui.TextView()
	textview_ea.name = 'textview_1-' + str(select_count+1)
	textview_ea.text = '(' + str(select_count+1) + ')　'
	textview_ea.font = ('<System>', 17)
	textview_ea.border_color = 'black'
	textview_ea.border_width = 1
	textview_ea.bounds = (0, 0, 348, 40)
	textview_ea.center = (174, 20 + 39 * select_count)
	scrollview2.add_subview(textview_ea)
	textview_a.append(textview_ea)
	textview_ea_l.append(textview_ea)
	
	scrollview2.content_size = (320, 235 + 39 * (select_count - 4))
	
	#✔︎ボタン
	button_eq = ui.Button()
	button_eq.name = 'button_' + str(select_count+1)
	button_eq.title = ''
	button_eq.bounds = (0, 0, 56, 40)
	button_eq.center = (375, 20 + 39 * select_count)
	button_eq.action = Button1
	button_eq_l.append(button_eq)
	if select_flag:
		scrollview2.add_subview(button_eq)
	
	label_eq = ui.Label()
	label_eq.name = 'label_' + str(select_count+1)
	label_eq.text = ''
	label_eq.alignment = 1
	label_eq.bounds = (0, 0, 56, 40)
	label_eq.center = (375, 20 + 39 * select_count)
	label_eq.border_color = 'black'
	label_eq.border_width = 1
	label_eq.background_color = 'white'
	label_eq_l.append(label_eq)
	if select_flag:
		scrollview2.add_subview(label_eq)
	
	button_dict1[button_eq] = label_eq
	
	#○✗ボタン
	button_ea = ui.Button()
	button_ea.name = 'button_' + str(select_count+1)
	button_ea.title = ''
	button_ea.bounds = (0, 0, 56, 40)
	button_ea.center = (375, 20 + 39 * select_count)
	button_ea.action = Button2
	button_ea_l.append(button_ea)
	if cw_flag:
		scrollview2.add_subview(button_ea)
	
	label_ea = ui.Label()
	label_ea.name = 'label_' + str(select_count+1)
	label_ea.text = '○'
	label_ea.alignment = 1
	label_ea.bounds = (0, 0, 56, 40)
	label_ea.center = (375, 20 + 39 * select_count)
	label_ea.border_color = 'black'
	label_ea.border_width = 1
	label_ea.background_color = 'white'
	label_ea_l.append(label_ea)
	if cw_flag:
		scrollview2.add_subview(label_ea)
	
	button_dict2[button_ea] = label_ea	


def Button4(sender):
	global select_count, textview_eq, textview_ea, button_eq, label_eq, button_ea, label_ea, textview_eq_l, textview_ea_l, button_eq_l, label_eq_l, button_ea_l, label_ea_l
	
	if select_count > 4:
		select_count += -1
		
		#問題
		scrollview1.remove_subview(textview_eq_l[-1])
		del textview_eq_l[-1]
		del textview_q[-1]
	
		scrollview1.content_size = (320, 235 + 39 * (select_count - 4))
	
		#解答
		scrollview2.remove_subview(textview_ea_l[-1])
		del textview_ea_l[-1]
		del textview_a[-1]
	
		scrollview2.content_size = (320, 235 + 39 * (select_count - 4))
	
		#✔︎ボタン
		scrollview2.remove_subview(button_eq_l[-1])
		del button_dict1[button_eq_l[-1]]
		del button_eq_l[-1]
		scrollview2.remove_subview(label_eq_l[-1])
		del label_eq_l[-1]
	
		#○✗ボタン
		scrollview2.remove_subview(button_ea_l[-1])
		del button_dict2[button_ea_l[-1]]
		del button_ea_l[-1]
		scrollview2.remove_subview(label_ea_l[-1])
		del label_ea_l[-1]
		
		
	










		
						
# 作成ボタン(問題)
def create_button1(sender):
	
	sv.add_subview(textview0)
	sv.add_subview(button0)
	sv.add_subview(button0_1)
	
	#問題番号
	textview0.text = \
	textfield1.text + '-' + textfield2.text + '\n' \
	+ textview1.text
	
		
	#選択肢
	if switch1.value:
		textview0.text += '\n' + '\n'
		for n in textview_q:
			textview0.text += n.text + '\n' * 2
		textview0.text = textview0.text.rstrip('\n')
		
	
	#注意書き
	if switch2.value:
		textview0.text += '※解答する場合、' + '\n' \
		+ '「' + textfield1.text + textfield2.text \
		+ '解答」と入力してください。'
		
		

#作成ボタン(解答)
def create_button2(sender):
	global select_flag, cw_flag, other_flag
	
	sv.add_subview(textview0)
	sv.add_subview(button0)
	sv.add_subview(button0_1)
	
	textview0.text = '答え'
	
	#答え
	##選択問題
	if select_flag:
		c = 0
		length = 0
		text = []
		for x in button_dict1.values():
			c += 1
			if x.text == '✔︎':
				length += 1
				if length >= 4 and length%3 == 1:
					text_han = '　　' + '（' + str(c) + '）'
					text_zen = text_han.translate(HAN2ZEN)
					text.append('\n' + text_zen)
				else:
					text_han = '（' + str(c) + '）'
					text_zen = text_han.translate(HAN2ZEN)
					text.append(text_zen)
		textview0.text += ','.join(text)	
	##正誤問題
	if cw_flag:
		c = 0
		for x in button_dict2.values():
			c += 1
			if c >= 4 and c%3 == 1:
				text_han = '　　' + '（' + str(c) + '）'
				text_zen = text_han.translate(HAN2ZEN)
				textview0.text += '\n' + text_zen + x.text
			else:	
				text_han = '（' + str(c) + '）'
				text_zen = text_han.translate(HAN2ZEN)
				textview0.text += text_zen + x.text
	##その他		
	if other_flag:
		textview0.text += '　' + textfield_1.text	
	
	#解説
	if textview2.text != '':
		textview0.text += '\n' * 2 + textview2.text	
	
	#ページ
	if len(textfield3.text) >= 1:
		textview0.text += '\n' * 2 \
		+ '　' * (13 - len(textfield3.text)) \
		+ '  Ｐ.' + textfield3.text.translate(HAN2ZEN)








v = ui.load_view()
#問題
question_list = []

sv = v['scrollview']

label1 = v['label1']
label2 = v['label2']
label3 = v['label3']
label4 = v['label4']
label5 = v['label5']
textfield1 = v['textfield1']
textfield2 = v['textfield2']
textview1 = v['textview1']
switch1 = v['switch1']
switch2 = v['switch2']
scrollview1 = v['scrollview1']
button1 = v['button1']
button3 = v['button3']
button4 = v['button4']

#question_list.append(label1)
#question_list.append(label2)
#question_list.append(label3)
question_list.append(label4)
question_list.append(label5)
question_list.append(textfield1)
question_list.append(textfield2)
question_list.append(textview1)
question_list.append(switch1)
question_list.append(switch2)
question_list.append(scrollview1)
question_list.append(button1)
question_list.append(button3)
question_list.append(button4)



##選択肢
textview_a = []
for n in range(0, 5):
	textview = ui.TextView()
	textview.name = 'textview_1-' + str(n+1)
	text_han = '(' + str(n+1) + ')'
	textview.text = text_han.translate(HAN2ZEN)
	textview.font = ('<System>', 17)
	textview.border_color = 'black'
	textview.border_width = 1
	textview.bounds = (0, 0, 348, 40)
	textview.center = (174, 20 + 39 * n)
	scrollview2.add_subview(textview)
	textview_a.append(textview)


###✔︎ボタン
button_dict1 = {}
for n in range(0, 5):
	button = ui.Button()
	button.name = 'button_' + str(n+1)
	button.title = ''
	button.bounds = (0, 0, 56, 40)
	button.center = (375, 20 + 39 * n)
	button.action = Button1
	scrollview2.add_subview(button)
	
	label = ui.Label()
	label.name = 'label_' + str(n+1)
	label.text = ''
	label.alignment = 1
	label.bounds = (0, 0, 56, 40)
	label.center = (375, 20 + 39 * n)
	label.border_color = 'black'
	label.border_width = 1
	label.background_color = 'white'
	scrollview2.add_subview(label)
	
	button_dict1[button] = label


###○✗ボタン
button_dict2 = {}
for n in range(0, 5):
	button = ui.Button()
	button.name = 'button_' + str(n+1)
	button.title = ''
	button.bounds = (0, 0, 56, 40)
	button.center = (375, 20 + 39 * n)
	button.action = Button2
	scrollview2.add_subview(button)
	
	label = ui.Label()
	label.name = 'label_' + str(n+1)
	label.text = '○'
	label.alignment = 1
	label.bounds = (0, 0, 56, 40)
	label.center = (375, 20 + 39 * n)
	label.border_color = 'black'
	label.border_width = 1
	label.background_color = 'white'
	scrollview2.add_subview(label)
	
	button_dict2[button] = label
	

textfield_1 = ui.TextField()
textfield_1.name = 'textfield_1'
textfield_1.bounds = (0, 0, 402, 32)
textfield_1.center = (207, 342)
textfield_1.border_color = 'black'
textfield_1.border_width = 1



#スクロール以外全部をスクロールに追加
for i in v.subviews:
	if not i.name == 'scrollview':
		sv.add_subview(i)




#解答消し
for i in answer_list:
	v.remove_subview(i)


for i in button_dict2.keys():
	scrollview2.remove_subview(i)
for i in button_dict2.values():
	scrollview2.remove_subview(i)




question_flag = True
answer_flag = False
select_flag = True
cw_flag = False
other_flag = False

select_count = 4
textview_eq_l = []
textview_ea_l = []
button_eq_l = []
label_eq_l = []
button_ea_l = []
label_ea_l = []

textview_eq = ui.TextView()
textview_ea = ui.TextView()
button_eq = ui.Button()
label_eq = ui.Label()
button_ea = ui.Button()
label_ea = ui.Label()







#作成後
textview0 = ui.TextView()
textview0.name = 'textview0'
textview0.bounds = (0, 0, 249, 804)# 265
textview0.center = (207, 402)
textview0.font = ('<System>', 17)

button0 = ui.Button()
button0.name = 'button0'
button0.title = '戻る'
button0.tint_color = 'black'
button0.bounds = (0, 0, 100, 32)
button0.center = (132, 600)
button0.background_color = '#9cd8ff'
button0.action = Button0

button0_1 = ui.Button()
button0_1.name = 'button0_1'
button0_1.title = 'コピー'
button0_1.tint_color = 'black'
button0_1.bounds = (0, 0, 100, 32)
button0_1.center = (282, 600)
button0_1.background_color = '#9cd8ff'
button0_1.action = Button0_1




v.present('popover', orientations = ['portrait'])
