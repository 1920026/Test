import tkinter.ttk as ttk
import tkinter as tk
import tkinter.scrolledtext as st
import tkinter.filedialog as dlg
from tkinter.font import Font
import traceback
import mojimoji
import re
from tkinter import messagebox
import shelve


# 保存
sh = shelve.open("mydate")
s_list_keys = list(sh.keys())
if not len(s_list_keys) == 9:
    sh["分野"] = "分野"
    sh["番号"] = "番号"
    sh["国試"] = False
    sh["回数"] = "回数"
    sh["AMPM"] = "AM"
    sh["国試番号"] = "国試番号"
    sh["ページ"] = "ページ"
    sh["選択問題"] = "選択問題"
    sh["選択肢数"] = 5

field_dic = {
  "物理・生体物性": 1,
  "電気・電子工学": 2,
  "生体計測": 3,
  "治療機器": 4,
  "呼吸・麻酔": 5,
  "体外循環": 6,
  "血液浄化法": 7,
  "画像診断": 8,
  "安全管理学": 9,
  "消毒・滅菌": 10,
  "医学的知識": 11
}


# 子要素 すべて取得
def get_allchildren(frame):
    list = []
    for child in frame.winfo_children():
        if "frame" in child.widgetName: list += get_allchildren(child)
        else:list.append(child)
    return list



# ウィンドウ
root = tk.Tk()
root.title("作成機")
root.geometry("1270x700+0+0")  # 大きさ、配置
root.configure(bg="gray70") # 背景色





# フレーム スタンプ
frame0 = ttk.Frame(root, relief="groove")
frame0.grid(row=0, column=0, columnspan=2, padx=20, pady=20)

# コンボボックス 分野
combobox = ttk.Combobox(frame0, textvariable=tk.StringVar(),
                        values=[i for i in field_dic.keys()], state="readonly", justify="center")
combobox.set(sh["分野"])
combobox.configure(font=Font(family='游ゴシック', size=10))
combobox.grid(row=0, column=0, padx=5, pady=5)

# 半角数字のみ
def validation_number(d, i, P, s, S, v, V, W):
    # print(f'{d}, {i}, {P}, {s}, {S}, {v}, {V}, {W}')
    if V == "focusin":
        # 半角数字でないなら、消す
        if not re.fullmatch('[0-9]+', P): root.nametowidget(W).set("")
        return True
    elif V == "focusout":
        # 空欄なら、番号を入れる
        if not P:
            name = W.split(".")[-1]
            root.nametowidget(W).set(name)
        return True
    elif V == "key":
        # 半角数字、または、""なら続行
        if re.fullmatch('[0-9]*', P): return True
        else: return False
tcl_validation_number = root.register(validation_number) # tcl関数 作成
# スピンボックス 番号
spinbox = ttk.Spinbox(frame0, textvariable=tk.StringVar(), from_=1, to=99, width=8, justify="center",
                      name="番号", validate="all",
                      validatecommand=(tcl_validation_number, '%d', '%i', '%P', '%s', '%S', '%v', '%V', '%W'))
spinbox.set(sh["番号"])
spinbox.configure(font=Font(family='游ゴシック', size=10))
spinbox.grid(row=0, column=1, padx=5, pady=5)

# チェックボックス
val = tk.BooleanVar()
def check():
    for child in get_allchildren(frame_ne): # 子要素 すべて取得
        if val.get(): child["state"] = "normal"
        else: child["state"] = "disable"
val.set(sh["国試"])
state = "normal" if sh["国試"] else "disable" # グループ化
checkbox0 = ttk.Checkbutton(frame0, text="国試", variable=val, command=check)
checkbox0.grid(row=0, column=2, padx=5, pady=5)

# フレーム 国試
frame_ne = ttk.Frame(frame0, relief="groove")
frame_ne.grid(row=0, column=3, padx=5, pady=5)

# ラベル
label0 = ttk.Label(frame_ne, state=state, text="第　　　　　　　回")
group0 = 0 # グループ化
label0.grid(row=0, column=group0, padx=5, pady=5)

# スピンボックス 第x回
spinbox0 = ttk.Spinbox(frame_ne, state=state, textvariable=tk.StringVar(), from_=1, to=99, width=8, justify="center",
                       name="回数", validate="all",
                       validatecommand=(tcl_validation_number, '%d', '%i', '%P', '%s', '%S', '%v', '%V', '%W'))
spinbox0.set(sh["回数"])
spinbox0.configure(font=Font(family='游ゴシック', size=10))
spinbox0.grid(row=0, column=group0, padx=5, pady=5)

# フレーム 午前・午後
frame_ampm = ttk.Frame(frame_ne, relief="groove")
frame_ampm.grid(row=0, column=1, padx=5, pady=5)
# ラジオボタン
v1 = tk.StringVar() # グループ化
radiobutton0 = ttk.Radiobutton(frame_ampm, state=state, variable=v1, text="午前", value="AM")
v1.set(sh["AMPM"])
radiobutton0.grid(row=0, column=0, padx=5, pady=0)
# ラジオボタン
radiobutton1 = ttk.Radiobutton(frame_ampm, state=state, variable=v1, text="午後", value="PM")
radiobutton1.grid(row=1, column=0, padx=5, pady=0)

# スピンボックス 国試番号
spinbox1 = ttk.Spinbox(frame_ne, state=state, textvariable=tk.StringVar(), from_=1, to=99, width=10, justify="center",
                       name="国試番号", validate="all",
                       validatecommand=(tcl_validation_number, '%d', '%i', '%P', '%s', '%S', '%v', '%V', '%W'))
spinbox1.set(sh["国試番号"])
spinbox1.configure(font=Font(family='游ゴシック', size=10))
spinbox1.grid(row=0, column=2, padx=5, pady=5)

# スタンプ
def stamp():
    # 例外処理
    message = []
    try: field = str(field_dic[combobox.get()]) # 分野を番号へ変換
    except Exception: message.append('「分野」')
    check = lambda text: text if re.fullmatch('[0-9]+', text) else message.append('「'+text+'」') # 半角数字が入力されているか
    number = check(spinbox.get())
    if val.get(): 
        times = check(spinbox0.get())
        timezone = v1.get()
        number_ne = check(spinbox1.get())
    if message:
        messagebox.showerror("エラー", ','.join(message) + "を選択してください。")
        return
    
    edges_clear(textfield0)
    han(textfield0)
    blank_clear(textfield0)
    adjust(textfield0)
    
    firstline = textfield0.get(1.0, '1.end')
    # 1行目が、x-xまたは、x-x（x-xx-x）なら1行目削除
    if re.fullmatch('.+-.+(（.+-(AM|PM)-.+）)?', firstline): textfield0.delete(1.0, 2.0)
        
    text = field+"-"+number
    if val.get(): text += "（"+times+"-"+timezone+"-"+number_ne+"）" # チェックがあるなら
    textfield0.insert(1.0, text+"\n") # 挿入
    edges_clear(textfield0)
# スタンプボタン
button_stamp = tk.Button(root, text='整形',command=stamp)
button_stamp.grid(row=2, column=0, padx=5, pady=5)





# テキストボックス 問題
textfield0 = st.ScrolledText(root, width=27, height=15, undo="true")
textfield0.configure(font=Font(family='游ゴシック', size=20))
textfield0.grid(row=1, column=0, padx=10, pady=10)







# フレーム
frame1 = ttk.Frame(frame0, relief="groove")
frame1.grid(row=0, column=5, columnspan=1, padx=5, pady=5)

# ラベル
label1 = ttk.Label(frame1, text="P.　　　　　　", font=Font(family='游ゴシック', size=10))
group1 = 0 # グループ化
label1.grid(row=0, column=group1, padx=5, pady=5, sticky=tk.W)
# スピンボックス
spinbox_page = ttk.Spinbox(frame1, textvariable=tk.StringVar(),from_=1, to=999, width=8, justify="center",
                           name="ページ", validate="all",
                           validatecommand=(tcl_validation_number, '%d', '%i', '%P', '%s', '%S', '%v', '%V', '%W'))
spinbox_page.set(sh["ページ"])
spinbox_page.configure(font=Font(family='游ゴシック', size=10))
spinbox_page.grid(row=0, column=group1, padx=5, pady=5, sticky=tk.E)

# コンボボックスで選択されたとき
def form_select(event=None):
    form = combobox_form.get()
    spinbox_choices["state"] = "normal"
    frame_select.grid_remove()
    frame_correction.grid_remove()
    frame_other.grid_remove()
    
    if form == "選択問題": frame_select.grid()
    elif form == "正誤問題": frame_correction.grid()
    elif form == "その他":
        spinbox_choices["state"] = "disable"
        frame_other.grid()
# コンボボックス
combobox_form = ttk.Combobox(frame1, textvariable=tk.StringVar(), values=["選択問題", "正誤問題", "その他"],
                             state="readonly", justify="center", width=10)
combobox_form.bind("<<ComboboxSelected>>", form_select)
combobox_form.set(sh["選択問題"])
combobox_form.configure(font=Font(family='游ゴシック', size=10))
combobox_form.grid(row=0, column=1, padx=5, pady=5)




# キャンバス
canvas0 = tk.Canvas(root, background="gray93", width=269, height= 145)
canvas0.grid(row=1, column=2, padx=5, pady=5, sticky=tk.N)

# フレーム 解答形式
frame_form = ttk.Frame()
canvas0.create_window((0,0), window=frame_form, anchor=tk.NW)


# フレーム 選択問題
frame_select = ttk.Frame(frame_form)
frame_select.grid(row=1, column=0, columnspan=2, padx=5, pady=5)

# リストボックス
listbox_select = tk.Listbox(frame_select, listvariable=tk.StringVar(), exportselection=False, selectmode="multiple",
                            height=5, width=22)
listbox_select.configure(font=Font(family='游ゴシック', size=15))
group2 = 0 # グループ化
listbox_select.grid(row=group2, column=group2)
# スクロールバー
scrollbar_ls = ttk.Scrollbar(frame_select, orient="vertical", command=listbox_select.yview)
listbox_select["yscrollcommand"] = scrollbar_ls.set
scrollbar_ls.grid(row=group2, column=group2+1, sticky=tk.NS)


# フレーム 正誤問題
frame_correction = ttk.Frame(frame_form)
frame_correction.grid(row=1, column=0, columnspan=2, padx=5, pady=7)

# キャンバス 正誤問題
canvas = tk.Canvas(frame_correction, background="gray93", width=242, height= 130)
group3 = 0 # グループ化
canvas.grid(row=0, column=group3, padx=0, pady=0)
# スクロールバー
scrollbar_c = ttk.Scrollbar(frame_correction, orient="vertical", command=canvas.yview)
scrollbar_c.grid(row=group3, column=group3+1, sticky=tk.NS)
canvas["yscrollcommand"] = scrollbar_c.set # キャンバスにスクロールバーをセット
canvas.yview_moveto(0) # スクロールバーの初期位置

# スクロール操作
def y_scroll(event):
    if event.delta > 0:canvas.yview_scroll(-1, 'units')
    elif event.delta < 0:canvas.yview_scroll(1, 'units')
# テキストボックス
textbox_correction = tk.Text(canvas, undo="true")
textbox_correction.configure(font=Font(family='游ゴシック', size=15))
textbox_correction.bind("<MouseWheel>", y_scroll)
textbox_correction.tag_configure("Color", background="gray90") # タグ
textbox_correction["state"] = "disable" # 読み取り専用

# フレーム 〇✕ボタン
frame_cb = ttk.Frame(canvas)
# 〇✕ボタン アクション✕
def correction(event):
    event.widget["text"] = "✕" if event.widget.cget("text") == "〇" else "〇"
# 〇✕ボタン 作成
def button_create(times):
    for i in range(times):
        button_name = "button_correction" + str(i+1)
        button_name = tk.Button(frame_cb, text="〇", width=2, height=1)
        button_name.bind("<ButtonPress>", correction)
        button_name.bind("<space>", correction)
        button_name.bind("<MouseWheel>", y_scroll)
        button_name.grid(row=i, column=0)

# キャンバスに追加
canvas.create_window((0,0), window=textbox_correction, anchor=tk.NW, width=243)
canvas.create_window((canvas.cget("width"),2), window=frame_cb, anchor=tk.NE)


# フレーム その他
frame_other = ttk.Frame(frame_form)
frame_other.grid(row=1, column=0, columnspan=2, padx=5, pady=59)

# テキストボックス
textbox_other = tk.Entry(frame_other, width=23)
textbox_other.configure(font=Font(family='游ゴシック', size=15))
textbox_other.grid(row=0, column=0, padx=3, pady=0)


# スタンプ2
def stamp2():
    form = combobox_form.get()
    # 例外処理
    answer = "答え"
    if form == "選択問題":
        if not listbox_select.curselection():
            messagebox.showerror("エラー", "答えを選択してください。")
            return
        selection = [listbox_select.get(i) if i != '' else None for i in listbox_select.curselection()] # 選択されたリスト
        selection2 = ['\n　　'+o if i >= 3 and i%3 == 0 else o for i, o in enumerate(selection)] # 改行 追加
        answer += ','.join(selection2)
    elif form == "正誤問題":
        correction = [child["text"] for child in get_allchildren(frame_cb)]
        htzp1 = lambda i, o: '（' + mojimoji.han_to_zen(str(i+1)) +'）'+ o
        correction2 = ['\n　　'+htzp1(i, o) if i >= 3 and i%3 == 0 else htzp1(i, o) for i, o in enumerate(correction)]
        answer += ''.join(correction2)
    elif form == "その他":
        if not textbox_other.get():
            messagebox.showerror("エラー", "答えを入力してください。")
            return
        text = textbox_other.get()
        answer += "　" + text
    
    edges_clear(textfield1)
    
    flag_a = True
    flag_z = True
    # テキストボックスの行数 繰り返す
    for i in range(1, int(float(textfield1.index("end-1lines")))+1):
        firstline = textfield1.get(1.0, '1.end')
        # 1行目の最初が、"答え"、または、'　　（ｘ）'なら
        if flag_a and (re.match("(答え|　　（[０-９]+）)", firstline)): textfield1.delete(1.0, 2.0) # 1行目を消す
        else: flag_a = False # それ以外が来たら、止める
    
    e = float(textfield1.index("end-1lines"))
    endline = textfield1.get(e, 'end-1c')
    if flag_z and (re.search('P.[0-9]+', endline)): textfield1.delete(e, 'end') # 最終行が、"P.x"なら、最終行を消す
    
    edges_clear(textfield1)
    
    # 挿入
    textfield1.insert(1.0, answer + '\n'*2)
    check = lambda text: text if re.fullmatch('[0-9]+', text) else None # 半角数字が入力されているか
    try:
        page = check(spinbox_page.get())
        if len(page) == 1: textfield1.insert('end', '\n' + '　'*14 + ' '*2 + 'P.' + page)
        elif len(page) == 2: textfield1.insert('end', '\n' + '　'*14 + ' '*0 + 'P.' + page)
        elif len(page) == 3: textfield1.insert('end', '\n' + '　'*13 + ' '*1 + 'P.' + page)
    except: None
# スタンプボタン2
button_stamp2 = tk.Button(root, text='整形',command=stamp2)
button_stamp2.grid(row=2, column=1, padx=5, pady=7)
# canvas0.create_window((int(canvas0["width"])/2,canvas0["height"]), window=button_stamp2, anchor=tk.S)


# 選択肢 更新
def update_choices(event=None):
    choices = spinbox_choices.get()
    if not choices: return # ""なら終了
    choices = int(choices)
    choices_list = ["（" + mojimoji.han_to_zen(str(i+1)) + "）" for i in range(choices)]
    # リストボックス 選択肢 更新
    listbox_select["listvariable"] = tk.StringVar(value=choices_list) # 選択肢 更新
    for i in range(1,choices,2): listbox_select.itemconfig(i, background="gray90") # 色 交互
    # テキストボックス 選択肢 更新
    textbox_correction["state"] = "normal"
    textbox_correction.delete(1.0, 'end') # テキスト 全削除
    for i in choices_list: textbox_correction.insert("end", i+'\n') # 選択肢 更新
    for i in range(2,choices+1,2): textbox_correction.tag_add("Color", str(i)+".0", str(i+1)+".0") # 色 交互
    textbox_correction["state"] = "disable" # 読み取り専用
    # 〇✕ボタン 更新
    for child in get_allchildren(frame_cb): # 子要素 すべて取得
        child.destroy() # 〇✕ボタン 全削除
    button_create(choices)
    canvas.config(scrollregion=(0, 0, 0, choices*26)) # スクロールバーの限度
# スピンボックス 選択肢数
spinbox_choices = ttk.Spinbox(frame1, textvariable=tk.StringVar(), from_=1, to=99, width=5, justify="center",
                              name="5",validate="all", command=update_choices,
                              validatecommand=(tcl_validation_number, '%d', '%i', '%P', '%s', '%S', '%v', '%V', '%W'))
spinbox_choices.configure(font=Font(family='游ゴシック', size=10))
spinbox_choices.grid(row=0, column=2, padx=5, pady=5)
spinbox_choices.bind("<KeyRelease>", update_choices)
spinbox_choices.bind("<FocusOut>", update_choices)

# 選択肢数 初期値
spinbox_choices.set(sh["選択肢数"])
update_choices()
# 非表示
form_select()
    



    
    




# テキストボックス 解答
textfield1 = st.ScrolledText(root, width=27, height=15, undo="true", wrap="word")
textfield1.configure(font=Font(family='游ゴシック', size=20))
textfield1.grid(row=1, column=1, padx=10, pady=10)







# フレーム ボタン
frame_button = ttk.Frame(root, relief="groove")
frame_button.grid(row=2, column=0, columnspan=2, padx=5, pady=5)

# 改行
def indention(qa=None):
    if not qa: qa = root.focus_displayof()
    try: qa.insert("insert", "　　")
    except: None
# 改行ボタン
button = tk.Button(frame_button, text="改行", command=indention)
button.grid(row=0, column=0, padx=5, pady=5)

# コピー
def copy(qa=None):
    if not qa: qa = root.focus_displayof()
    root.clipboard_clear()
    try: root.clipboard_append(qa.get(1.0, 'end-1c'))
    except: None
# コピーボタン
button7 = tk.Button(frame_button, text='コピー', command=copy)
button7.grid(row=0, column=1, padx=5, pady=5)

# ペースト
def paste(qa=None):
    if not qa: qa = root.focus_displayof()
    try: qa.insert("insert", root.clipboard_get())
    except: None
# ペーストボタン
button1 = tk.Button(frame_button, text='ペースト', command=paste)
button1.grid(row=0, column=2, padx=5, pady=5)

# 削除
def all_clear(qa=None):
    if not qa: qa = root.focus_displayof()
    try: qa.delete(1.0, 'end')
    except: None
# 削除ボタン
button3 = tk.Button(frame_button, text='削除',command=all_clear)
button3.grid(row=0, column=3, padx=5, pady=5)

# 両端の空白削除
def edges_clear(qa=None):
    if not qa: qa = root.focus_displayof()
    try:
        text_strip = qa.get(1.0, 'end').strip()
        qa.delete(1.0, 'end')
        qa.insert(1.0, text_strip)
    except: None

# 空白削除
def blank_clear(qa=None):
    if not qa: qa = root.focus_displayof()
    try:
        text = qa.get(1.0, 'end-1c')
        l = "".join([i if i != ' ' else "" for i in text])
        
        qa.delete(1.0, 'end')
        qa.insert(1.0, l)
    except: None
# 空白削除ボタン
button2 = tk.Button(frame_button, text='空白削除',command=blank_clear)
# button2.grid(row=0, column=5, padx=5, pady=5)

# 半角
def han(qa=None):
    if not qa: qa = root.focus_displayof()
    try:
        text = mojimoji.zen_to_han(qa.get(1.0, 'end-1c'), kana=False)
        qa.delete(1.0, 'end')
        qa.insert(1.0, text)
    except: None
# 半角ボタン
button4 = tk.Button(frame_button, text='半角',command=han)
# button4.grid(row=0, column=4, padx=5, pady=5)

# 整形　(1) →（１）、並べ替え
def adjust(qa=None):
    if not qa: qa = root.focus_displayof()
    try:
        text = qa.get(1.0, 'end-1c')
        list_han = re.findall('\n*\([0-9]+\)', text) # 文字列から一致する要素をすべて取得 リスト化
        list_zen = ["\n"+mojimoji.han_to_zen(re.sub('\n+', '', i)) for i in list_han] # 全角 リスト化 改行 削除→追加
        list_zen[0] = '\n' + list_zen[0] # 最初の選択肢は、改行2回
        for l, l3 in zip(list_han, list_zen): text = text.replace(l, l3) # 半角リスト → 全角リスト 置換
        
        before_sort = re.findall('\n*（[０-９]+）.*', text) # 各行 取得
        bt = ''.join(before_sort) # 選択肢を１つの文字列に
        
        selection_dic = {}
        for i in before_sort:
            number = re.sub('\n*(（[０-９]+）).*', '\\1', i) # （１）
            string = re.sub('\n*（[０-９]+）', '', i) # 選択肢の内容
            selection_dic[number] = string
        selection_dic = sorted(selection_dic.items()) # 辞書をキーで昇順に並べ替え
        
        after_sort = ['\n'+l for l in [''.join(i) for i in selection_dic]]
        after_sort[0] = '\n' + after_sort[0]
        at = '\n'.join(after_sort) # ソート後の選択肢を１つの文字列に
        # at = ''.join(after_sort) # 改行なし
        text = text.replace(bt, at) # 置換
        qa.delete(1.0, 'end')
        qa.insert(1.0, text)        
    except: None
# 整形ボタン
button5 = tk.Button(frame_button, text='整形0',command=adjust)
# button5.grid(row=0, column=6, padx=5, pady=5)

# 全部
def all_round():
    stamp()
    stamp2()
# 全部ボタン
button8 = tk.Button(root, text='どっちも', command=all_round)
button8.grid(row=2, column=2, padx=5, pady=5)



# リセット
def reset():
    combobox.set("分野")
    spinbox.set("番号")
    val.set(False)
    spinbox0.set("回数")
    v1.set("AM")
    check()
    spinbox1.set("国試番号")
    spinbox_page.set("ページ")
    combobox_form.set("選択問題")
    spinbox_choices.set(5)
    sh.clear()
# リセットボタン
button9 = tk.Button(root, text="リセット" , command=reset)
button9.grid(row=0, column=2, padx=5, pady=5)


# ショートカットキー
# Alt + Enter　→　特殊改行
def alt_return(event):
    indention()
    return "break"
root.bind("<Alt-Return>", alt_return)
# Alt_Left + C　→　左コピー
def left_copy(event):
    copy(textfield0)
root.bind("<Alt_L><c>", left_copy)
# Alt_Rihgt + C　→　右コピー
def right_copy(event):
    copy(textfield1)
root.bind("<Alt_R><c>", right_copy)
# Alt_Left + V　→　左ペースト
def left_paste(event):
    paste(textfield0)
root.bind("<Alt_L><v>", left_paste)
# Alt_Right + V　→　右ペースト
def right_paste(event):
    paste(textfield1)
root.bind("<Alt_R><v>", right_paste)

# カーソル操作
def move_focus(event):
    print(event.keysym)
    p = root.focus_displayof()
    if p == spinbox_choices and event.keysym == "Right":
        listbox_select.focus_set()
        textbox_correction.focus_set()
    elif (p == listbox_select or p == textbox_correction) and event.keysym == "Left":
        spinbox_choices.focus_set()
    elif p == combobox_form and event.keysym == "Right": textbox_other.focus_set()
    elif p == textbox_other and event.keysym == "Left": combobox_form.focus_set()
    
    """ l = [
        combobox, spinbox, checkbox0,
        [spinbox0, radiobutton0, radiobutton1, spinbox1],
        spinbox_page, combobox_form, spinbox_choices, listbox_select]
    if str(p) == ".": combobox.focus_set()
    elif p == combobox: spinbox.focus_set() """
root.bind("<Key>", move_focus)


# 閉じるとき
def click_close():
    # 保存
    sh["分野"] = combobox.get()
    sh["番号"] = spinbox.get() if spinbox.get() != "" else "番号"
    sh["国試"] = val.get()
    sh["回数"] = spinbox0.get() if spinbox0.get() != "" else "回数"
    sh["AMPM"] = v1.get()
    sh["国試番号"] = spinbox1.get() if spinbox1.get() != "" else "国試番号"
    sh["ページ"] = spinbox_page.get() if spinbox_page.get() != "" else "ページ"
    sh["選択問題"] = combobox_form.get()
    sh["選択肢数"] = spinbox_choices.get() if spinbox_choices.get() != "" else 5
    root.destroy()
root.protocol("WM_DELETE_WINDOW", click_close) # ウィンドウを閉じるとき

root.mainloop()
sh.close()