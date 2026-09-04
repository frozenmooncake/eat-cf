// 菜单与价位数据
import { isNoodle, isRice } from './data.js';
//
// floors: 每个楼层一组，windows 里按窗口号列出该窗口的菜品与价格
//   窗口结构: { num, name, range, photos?: [{ src, alt }], items: [{ dish, price, photos? }] }
// snackStreet: 小吃街摊位，entries 里按摊位列出
//   摊位结构: { name: 摊位名, range: 价格区间, items: [{ dish, price }] }
export const menuData = {
  canteens: [
    {
      id: 'jianghuai',
      label: '1餐厅',
      floors: [
        { floor: 1, label: '一楼', windows: [
            { num: 1, name: "油饼母鸡汤/砂锅土豆粉", items: [
              { dish: "招牌葱油饼", price: "2元/3元/4元" },
              { dish: "滋补母鸡汤", price: "3元" },
              { dish: "鸡蛋饼", price: "2元" },
              { dish: "鸡蛋饼卷烤肠", price: "2.5元" },
              { dish: "茶叶蛋", price: "1.5元" },
              { dish: "砂锅土豆粉", price: "10元" },
              { dish: "砂锅方便面", price: "10元" },
              { dish: "砂锅面", price: "10元" },
              { dish: "酥肉砂锅土豆粉", price: "12元" },
              { dish: "酥肉砂锅方便面", price: "12元" },
              { dish: "酥肉砂锅面", price: "12元" },
            ] },
            { num: 2, name: "中式套餐饭", items: [
              { dish: "荤素任选四个菜", price: "12.5元/份" },
              { dish: "素拼", price: "9.0元/份" },
              { dish: "米饭", price: "0.6元/份" },
            ] },
            { num: 3, name: "潮汕猪肘饭", items: [
              { dish: "粤式腊肠饭", price: "11元" },
              { dish: "秘卤鸡腿饭", price: "12元" },
              { dish: "秘卤鸭腿饭", price: "12.5元" },
              { dish: "秘卤鸡排饭", price: "12.5元" },
              { dish: "潮汕猪肘饭", price: "13.5元" },
              { dish: "鸡腿(单加)", price: "5元/个" },
              { dish: "卤鸭腿(单加)", price: "6元/个" },
              { dish: "卤鸡蛋(单加)", price: "1.5元/个" },
            ] },
            { num: 4, name: "韩式滑蛋饭/手工水饺", items: [
              { dish: "滑蛋饭双拼", price: "13.5元" },
              { dish: "小酥肉滑蛋饭", price: "12.5元" },
              { dish: "番茄肥牛滑蛋饭", price: "12.5元" },
              { dish: "孜然鸡丝滑蛋饭", price: "12.5元" },
              { dish: "黑椒肥牛滑蛋饭", price: "12.5元" },
              { dish: "麻辣鸡丝滑蛋饭", price: "12.5元" },
              { dish: "番茄牛柳滑蛋饭", price: "12.5元" },
              { dish: "鱼香鸡丝滑蛋饭", price: "12.5元" },
              { dish: "黑椒牛柳滑蛋饭", price: "12.5元" },
              { dish: "黑椒培根滑蛋饭", price: "11.0元" },
              { dish: "黑椒五花肉滑蛋饭", price: "12.5元" },
              { dish: "麻辣培根滑蛋饭", price: "11.0元" },
              { dish: "麻辣五花肉滑蛋饭", price: "12.5元" },
              { dish: "麻辣香肠滑蛋饭", price: "10.5元" },
              { dish: "雪花鸡柳滑蛋饭", price: "12.5元" },
              { dish: "黑椒香肠滑蛋饭", price: "10.5元" },
              { dish: "椒麻鸡滑蛋饭", price: "12.5元" },
              { dish: "素菜滑蛋饭", price: "9.5元" },
              { dish: "猪肉香菇饺子", price: "13.5元" },
              { dish: "猪肉萝卜饺子", price: "13.5元" },
              { dish: "素馅饺子", price: "12.5元" },
              { dish: "猪肉白菜饺子", price: "13.5元" },
              { dish: "小笼包", price: "6元/份" },
              { dish: "蒸饺", price: "6元/份" },
              { dish: "煎饺", price: "6元/份" },
              { dish: "玉米糊", price: "2元" },
              { dish: "肉夹馍", price: "待确认" },
            ] },
            { num: 5, name: "豫老饕肉酱面", items: [
              { dish: "招牌肉酱面", price: "10元" },
              { dish: "椒麻肉酱面", price: "10元" },
              { dish: "招牌黑鸭面", price: "11元" },
              { dish: "酱香黑鸭拌面", price: "11元" },
              { dish: "香菇鸡丁拌面", price: "10元" },
              { dish: "糖醋麻辣肉酱面", price: "10元" },
              { dish: "小龙虾风味肉酱面", price: "10元" },
              { dish: "西红柿鸡蛋拌面", price: "9元" },
              { dish: "经典麻酱拌面", price: "8元" },
              { dish: "香菇鸡丁汤面", price: "10元" },
              { dish: "香辣黑鸭汤面", price: "11元" },
              { dish: "麻酱鸡丝汤面", price: "10元" },
              { dish: "茄汁鸡蛋汤面", price: "9元" },
              { dish: "经典油泼面", price: "8元" },
              { dish: "招牌油泼面", price: "10元" },
              { dish: "香菇鸡油泼面", price: "10元" },
              { dish: "酱香鸭油泼面", price: "11元" },
              { dish: "招牌辣炒面", price: "10元" },
              { dish: "炸香肠配酱", price: "2元" },
              { dish: "网红淀粉肠", price: "2.5元" },
              { dish: "卤蛋", price: "1.5元" },
              { dish: "卤豆干", price: "1.5元" },
            ] },
            { num: 6, name: "辉夫人猪肚鸡", items: [{ dish: "招牌猪肚鸡", price: "11.7元" }, { dish: "金汤猪肚鸡", price: "11.7元" }, { dish: "番茄猪肚鸡", price: "11.7元" }, { dish: "酱香猪肚鸡", price: "11.7元" }, { dish: "麻辣猪肚鸡", price: "11.7元" }, { dish: "藤椒猪肚鸡", price: "11.7元" }, { dish: "素三鲜米饭", price: "7.6元" }, { dish: "招牌肥牛捞饭", price: "11.4元" }, { dish: "金汤肥牛捞饭", price: "11.4元" }, { dish: "番茄肥牛捞饭", price: "11.4元" }, { dish: "酱香肥牛捞饭", price: "11.4元" }, { dish: "麻辣肥牛捞饭", price: "11.4元" }, { dish: "藤椒肥牛捞饭", price: "8.5元" }, { dish: "菌三鲜米饭", price: "8.55元" }, { dish: "招牌鱼米饭", price: "11.7元" }, { dish: "金汤鱼米饭", price: "11.7元" }, { dish: "番茄鱼米饭", price: "11.7元" }, { dish: "酱香鱼米饭", price: "11.7元" }, { dish: "麻辣鱼米饭", price: "11.7元" }, { dish: "藤椒鱼米饭", price: "11.7元" }, { dish: "台湾卤肉拌饭", price: "13.5元" }, { dish: "招牌黑鸭煲+米饭", price: "11.7元" }, { dish: "招牌黑鸭煲+面条", price: "11.4元/份" }, { dish: "招牌酥肉捞饭", price: "12.15元" }, { dish: "金汤酥肉捞饭", price: "12.15元" }, { dish: "番茄酥肉捞饭", price: "12.15元" }, { dish: "酱香酥肉捞饭", price: "12.15元" }, { dish: "麻辣酥肉捞饭", price: "12.15元" }, { dish: "藤椒酥肉捞饭", price: "12.15元" }] },
            { num: 8, name: "川锦汇", items: [{ dish: "麻辣拌", price: "1.7元/50g" }, { dish: "羊肉烩面", price: "12.8元" }, { dish: "牛肉烩面", price: "12.8元" }, { dish: "羊杂面粉", price: "11.8元" }, { dish: "香辣板面粉", price: "10元" }, { dish: "羊汤面粉", price: "9元" }, { dish: "肉沫酸豆角面粉", price: "9元" }, { dish: "云吞面粉", price: "10元" }, { dish: "饺子面粉", price: "10元" }, { dish: "川香麻辣肉沫面粉", price: "9元" }, { dish: "三鲜番茄汤面粉", price: "9元" }, { dish: "鸡肉面粉", price: "10元" }, { dish: "黑椒肉片拌面粉", price: "11.6元" }, { dish: "青椒肉片拌面粉", price: "11.6元" }, { dish: "剁椒肉片拌面粉", price: "11.6元" }, { dish: "椒麻肉片拌面粉", price: "11.6元" }, { dish: "老北京炸酱面", price: "10元" }, { dish: "油泼面", price: "9.5元" }, { dish: "肉片油泼面粉", price: "11.6元" }, { dish: "咸蛋黄拌面粉", price: "9.5元" }, { dish: "麻酱拌面粉", price: "8.5元" }, { dish: "肉沫酸豆角拌面粉", price: "9元" }, { dish: "拌方便面粉", price: "9元" }, { dish: "三鲜番茄拌面粉", price: "9元" }, { dish: "小龙虾拌面粉", price: "9元" }, { dish: "蟹黄拌面粉", price: "9元" }, { dish: "凉捞面粉", price: "9元" }, { dish: "卤蛋", price: "1.5元" }, { dish: "豆干", price: "1.5元" }, { dish: "香肠", price: "1.5元" }] },
            { num: 9, name: "掉渣饼", items: [{ dish: "掉渣饼", price: "3.5元" }, { dish: "烤肠", price: "1元" }, { dish: "海带丝", price: "1元" }, { dish: "火腿片", price: "1元" }, { dish: "土豆片", price: "1元" }, { dish: "培根", price: "1元" }, { dish: "鸡蛋", price: "1.5元" }, { dish: "金针菇", price: "1元" }, { dish: "豆干", price: "1.5元" }, { dish: "青椒", price: "1元" }, { dish: "鸡柳", price: "2元" }, { dish: "辣条", price: "1元" }, { dish: "淀粉肠", price: "2.5元" }, { dish: "卤蛋", price: "1.5元" }, { dish: "豆浆", price: "2元" }] },
            { num: 10, name: "茄煌饭/红米家饭", items: [{ dish: "原味茄煌饭", price: "9元" }, { dish: "新派甜辣茄煌饭", price: "12元" }, { dish: "西域风味茄煌饭", price: "12元" }, { dish: "黑椒风味茄煌饭", price: "12元" }, { dish: "秘制酱鸡茄煌饭", price: "12元" }, { dish: "红烧肉茄煌饭", price: "13元" }, { dish: "花雕醉鸡茄煌饭", price: "13元" }, { dish: "农家小炒肉茄煌饭", price: "13元" }, { dish: "任意双拼组合", price: "13元" }] },
            { num: 11, name: "馋嘴鱼", items: [{ dish: "招牌馋嘴鱼", price: "13元" }, { dish: "金牌馋嘴鸡", price: "13元" }, { dish: "馋嘴香梅肉", price: "13元" }, { dish: "馋嘴肥牛卷", price: "13元" }, { dish: "馋嘴小酥肉", price: "12元" }, { dish: "馋嘴椒麻鸡", price: "12元" }, { dish: "精品五花肉", price: "11元" }, { dish: "馋嘴鱼豆腐", price: "10元" }, { dish: "馋嘴培根", price: "10元" }, { dish: "香辣菜丁钵面/拌饭", price: "11.9元" }, { dish: "香脆鸡柳饭", price: "待确认" }, { dish: "馋嘴小土豆", price: "待确认" }, { dish: "馋嘴千叶豆腐", price: "待确认" }, { dish: "馋嘴砂锅土豆粉", price: "待确认" }, { dish: "馋嘴砂锅方便面", price: "待确认" }] },
            { num: 12, name: "知麦现炒浇头面", items: [] },
            { num: 13, name: "王小撒炸鸡腿", items: [{ dish: "黄金炸鸡腿", price: "6元/个" }, { dish: "黄金炸鸡腿3个", price: "15元" }, { dish: "黄金翅根", price: "5元/2个" }, { dish: "豆皮肉卷", price: "1元/个" }, { dish: "豆皮肉卷10个", price: "9元" }, { dish: "黄金鸡肉条", price: "8.73元/份" }, { dish: "黄金鸡叉骨", price: "7.94元/份" }, { dish: "薯香四溢", price: "8.73元/份" }, { dish: "黄金地瓜条", price: "9.92元/份" }, { dish: "套餐A(鸡腿1个+鸡叉骨250g)", price: "11.8元" }, { dish: "套餐B(鸡腿1个+鸡肉条200g)", price: "13.5元" }, { dish: "套餐C(鸡腿1个+香骨鸡200g)", price: "13.8元" }, { dish: "套餐D(鸡翅3个+鸡叉骨250克)", price: "13.8元" }, { dish: "套餐E", price: "9.9元" }] },
            { num: 14, name: "好粥道", items: [{ dish: "香芋牛奶燕麦", price: "3元" }, { dish: "皮蛋瘦肉粥", price: "3元" }, { dish: "热牛奶", price: "3元" }, { dish: "养生八宝粥", price: "3元" }, { dish: "小米南瓜粥(无糖)", price: "3元" }, { dish: "果粒椰奶", price: "2元" }, { dish: "米酒小汤圆", price: "2元" }, { dish: "红豆黑米粥", price: "2元" }, { dish: "红枣银耳粥", price: "2元" }, { dish: "紫薯粥", price: "2元" }] },
            { num: 15, name: "麦多馅饼", items: [{ dish: "照烧鸡腿", price: "5元" }, { dish: "藤椒鸡腿", price: "5元" }, { dish: "麻辣鸡肉", price: "5元" }, { dish: "黑椒牛肉", price: "6元" }, { dish: "美味土豆", price: "3元" }, { dish: "麻婆豆腐", price: "3元" }, { dish: "豆浆", price: "2元" }, { dish: "绿豆沙", price: "2.5元" }] },
            { num: 16, name: "麻辣烫", items: [{ dish: "骨汤麻辣烫(荤素同价)", price: "1.58元/50g" }, { dish: "豆浆", price: "2元" }, { dish: "绿豆沙", price: "2.5元" }] },
            { num: 18, name: "重庆小面", items: [{ dish: "千里香馄饨", price: "7元" }, { dish: "重庆小面/粉", price: "8.55元" }, { dish: "干溜豌杂面", price: "11.4元" }, { dish: "豌杂小面/粉", price: "11.4元" }, { dish: "原汤肥肠面/粉", price: "11.8元" }, { dish: "原汤牛肉面/粉", price: "13.5元" }] },
            { num: 19, name: "花小甲老碗面", items: [{ dish: "花甲手工面", price: "12.5元" }, { dish: "花甲方便面", price: "12.5元" }, { dish: "锡纸花甲粉", price: "12.5元" }, { dish: "锡纸肥牛面/粉", price: "12.5元" }, { dish: "酥肉手工面", price: "11.5元" }, { dish: "酥肉方便面", price: "11.5元" }, { dish: "酥肉粉", price: "11.5元" }, { dish: "锡纸手工面", price: "9元" }, { dish: "锡纸方便面", price: "9元" }, { dish: "锡纸粉", price: "9元" }, { dish: "酱香鲜炒鸡拌饭", price: "12.0元" }, { dish: "麻辣鲜炒鸡拌饭", price: "12.0元" }, { dish: "花椒小炒鸡拌饭", price: "12.0元" }, { dish: "招牌口水鸡（酸甜麻）", price: "12.8元" }, { dish: "百媚口水鸡（酸甜辣）", price: "12.8元" }, { dish: "红油口水鸡（香、辣）", price: "13元" }, { dish: "枝鸡拌饭", price: "11.8元" }, { dish: "武汉酱烧黑鸭拌饭", price: "12.2元" }, { dish: "香菇小炒鸡拌饭", price: "12.2元" }] },
            { num: 20, name: "鸡蛋灌饼/山东杂粮煎饼", items: [{ dish: "鸡蛋灌饼+鸡蛋+生菜(原味)", price: "5元" }, { dish: "杂粮煎饼+鸡蛋+脆饼+生菜", price: "5元" }, { dish: "烤肠", price: "1元" }, { dish: "淀粉肠", price: "2元" }, { dish: "辣条", price: "1元" }, { dish: "肉松", price: "2元" }, { dish: "火腿片", price: "1元" }, { dish: "鸡柳", price: "2元" }, { dish: "土豆丝", price: "1元" }] },
            { num: 21, name: "秘制铁板炒饭/面", items: [{ dish: "蛋炒饭/面/粉", price: "7.6元" }, { dish: "沙拉蛋炒饭/面/粉", price: "9.5元" }, { dish: "孜然蛋炒饭/面/粉", price: "8.55元" }, { dish: "咖喱蛋炒饭/面/粉", price: "9.5元" }, { dish: "黑胡椒蛋炒饭/面/粉", price: "8.55元" }, { dish: "老干妈蛋炒饭/面/粉", price: "9.5元" }, { dish: "广式香肠蛋炒饭/面/粉", price: "9.5元" }, { dish: "肉沫蛋炒饭/面/粉", price: "10.45元" }, { dish: "广式腊肠蛋炒饭/面/粉", price: "9.5元" }, { dish: "培根蛋炒饭/面/粉", price: "9.5元" }, { dish: "奥尔良腌肉蛋炒饭/面/粉", price: "10.45元" }, { dish: "加肉末", price: "3元" }, { dish: "加肉丝", price: "4元" }, { dish: "加培根", price: "2元" }, { dish: "加腊肠", price: "2元" }, { dish: "加香肠", price: "2元" }, { dish: "加老干妈", price: "2元" }, { dish: "加鸡蛋", price: "1.5元" }, { dish: "加奥尔良腌肉", price: "3元" }] },
            { num: 23, name: "面世家", items: [{ dish: "煎蛋汤面/米线/方便面", price: "10.5元" }, { dish: "丸子汤面/米线/方便面", price: "11.5元" }, { dish: "酥肉汤面/米线/方便面", price: "11.5元" }, { dish: "辣肉汤面/米线/方便面", price: "12元" }, { dish: "卤肉汤面/米线/方便面", price: "12元" }, { dish: "红油热干面", price: "7元" }, { dish: "麻酱拌面", price: "8.55元" }, { dish: "鸡蛋炸酱面", price: "8.55元" }, { dish: "肉沫炸酱面", price: "9.5元" }, { dish: "卤蛋", price: "1.5元" }, { dish: "豆干", price: "1.5元" }, { dish: "狮子头", price: "1.5元" }, { dish: "肉肠", price: "3元" }, { dish: "绝味鸡土豆泥拌饭", price: "12.2元" }, { dish: "法式黑椒鸡土豆泥拌饭", price: "11.8元" }, { dish: "韩式孜然鸡土豆泥拌饭", price: "12.2元" }, { dish: "泰式咖喱鸡土豆泥拌饭", price: "12.2元" }, { dish: "双椒鸡丁土豆泥拌饭", price: "12元" }, { dish: "香辣猪扒土豆泥拌饭", price: "12.2元" }, { dish: "肉松鸡蛋土豆泥拌饭", price: "9.5元" }, { dish: "菌香菌菇土豆泥拌饭", price: "11.8元" }, { dish: "蒜蓉鸡土豆泥拌饭", price: "12元" }, { dish: "辣肉鸡蛋土豆泥拌饭", price: "12元" }, { dish: "麻辣干锅鸭土豆泥拌饭", price: "12元" }] },
            { num: 24, name: "0090汉堡工厂", items: [] },
            { num: 7, name: "手撕烩面", items: [
              { dish: "羊肉烩面/粉", price: "12.8元" },
              { dish: "牛肉烩面/粉", price: "12.8元" },
              { dish: "羊杂面/粉", price: "11.8元" },
              { dish: "香辣板面/粉", price: "10元" },
              { dish: "羊汤面/粉", price: "9元" },
              { dish: "肉沫酸豆角面/粉", price: "9元" },
              { dish: "云吞面/粉", price: "10元" },
              { dish: "饺子面/粉", price: "10元" },
              { dish: "川香麻辣肉沫面/粉", price: "9元" },
              { dish: "三鲜番茄汤面/粉", price: "9元" },
              { dish: "鸡肉面/粉", price: "10元" },
              { dish: "黑椒肉片拌面/粉", price: "11.6元" },
              { dish: "青椒肉片拌面/粉", price: "11.6元" },
              { dish: "剁椒肉片拌面/粉", price: "11.6元" },
              { dish: "椒麻肉片拌面/粉", price: "11.6元" },
              { dish: "老北京炸酱面", price: "10元" },
              { dish: "油泼面", price: "10元" },
              { dish: "肉片油泼面/粉", price: "11.6元" },
              { dish: "咸蛋黄拌面/粉", price: "9.5元" },
              { dish: "麻酱拌面/粉", price: "8.5元" },
              { dish: "肉沫酸豆角拌面/粉", price: "9元" },
              { dish: "拌方便面/粉", price: "9元" },
              { dish: "三鲜番茄拌面/粉", price: "9元" },
              { dish: "小龙虾拌面/粉", price: "9元" },
              { dish: "蟹黄拌面/粉", price: "9元" },
              { dish: "凉拌面/粉", price: "9元" },
              { dish: "卤蛋", price: "1.5元" },
              { dish: "豆干", price: "1.5元" },
              { dish: "香肠", price: "1.5元" },
            ] },
            { num: 22, name: "玖灵猫土豆泥拌饭", items: [
              { dish: "绝味辣土豆泥拌饭", price: "12.2元/份" },
              { dish: "肉沫茄子土豆泥拌饭", price: "9.5元/份" },
              { dish: "糖醋浇鸡土豆泥拌饭", price: "11.8元/份" },
              { dish: "法式黑椒鸡土豆泥拌饭", price: "11.8元/份" },
              { dish: "韩式孜然鸡土豆泥拌饭", price: "12.2元/份" },
              { dish: "泰式咖喱鸡土豆泥拌饭", price: "12.2元/份" },
              { dish: "双椒鸡丁土豆泥拌饭", price: "12元/份" },
              { dish: "荔枝鸡土豆泥拌饭", price: "12元/份" },
              { dish: "辣卤鸭腿土豆泥拌饭", price: "11.8元/份" },
              { dish: "麻辣干锅鸭土豆泥拌饭", price: "12元/份" },
            ] }
          ] },
        { floor: 2, label: '二楼', windows: [
            { num: 1, name: "学长自选菜", items: [{ dish: "荤素菜品统一称重", price: "14.0元/斤" }, { dish: "红烧肉", price: "14.0元/斤" }, { dish: "辣子鸡", price: "14.0元/斤" }, { dish: "红烧鸡块", price: "14.0元/斤" }, { dish: "番茄炒蛋", price: "14.0元/斤" }, { dish: "狼牙土豆", price: "14.0元/斤" }, { dish: "糖醋锅包肉", price: "14.0元/斤" }, { dish: "火鸡面", price: "14.0元/斤" }, { dish: "酱拌面筋头", price: "14.0元/斤" }, { dish: "卤大鸭腿", price: "14.0元/斤" }, { dish: "红烧鸡腿", price: "14.0元/斤" }, { dish: "酸辣土豆丝", price: "14.0元/斤" }] },
            { num: 2, name: "晴莘莘高汤烩面", items: [{ dish: "高汤牛肉烩面", price: "11.5元" }, { dish: "香辣牛肉烩面", price: "11.5元" }, { dish: "香菇鸡块烩面", price: "11.5元" }, { dish: "高汤牛肉米粉", price: "12.6元" }, { dish: "香辣牛肉米粉", price: "12.6元" }, { dish: "香菇鸡块米粉", price: "12.6元" }, { dish: "高汤牛肉面", price: "11.5元" }, { dish: "香辣牛肉面", price: "11.5元" }, { dish: "香菇鸡块面", price: "11.5元" }, { dish: "酥肉砂锅", price: "11.5元" }, { dish: "丸子砂锅", price: "11.5元" }, { dish: "鸡块砂锅", price: "11.5元" }, { dish: "排骨砂锅", price: "12.6元" }, { dish: "肥牛砂锅", price: "13.5元" }, { dish: "全锅", price: "13.5元" }] },
            { num: 3, name: "隆江猪脚饭", items: [{ dish: "猪脚饭", price: "12.6元/份" }, { dish: "叉烧饭", price: "11.7元/份" }, { dish: "鸡腿饭", price: "12.6元/份" }, { dish: "满肉猪脚饭", price: "16.2元/份" }, { dish: "加一份猪脚肉", price: "4元/份" }, { dish: "加一份叉烧", price: "47元/份" }, { dish: "加一份潮汕肉卷", price: "4元/份" }, { dish: "加鸡腿", price: "3元/份" }, { dish: "加卤蛋", price: "1元/份" }, { dish: "加牛肉丸", price: "1元/份" }] },
            { num: 5, name: "奉天朱家小馆", items: [{ dish: "小馆特色羊杂面", price: "11.5元/份" }, { dish: "小馆卤肉面", price: "12.6元/份" }, { dish: "小馆猪排面", price: "12.6元/份" }, { dish: "小馆鸡柳面", price: "11.7元/份" }, { dish: "小馆辣肉面", price: "11.7元/份" }, { dish: "小馆肉燥汤面", price: "9.5元/份" }, { dish: "小馆酸豆角汤面", price: "9.5元/份" }, { dish: "小馆酸菜汤面", price: "9.5元/份" }, { dish: "小馆清汤面", price: "7.0元/份" }, { dish: "小馆辣肉拌面", price: "11.7元/份" }, { dish: "小馆麻酱鸡丝拌面", price: "10.5元/份" }, { dish: "小馆肉燥拌面", price: "9.5元/份" }, { dish: "小馆酸豆角拌面", price: "9.5元/份" }, { dish: "小馆酸菜拌面", price: "9.5元/份" }, { dish: "鸡柳麻辣拌面", price: "11.7元/份" }, { dish: "小馆麻辣拌面", price: "8.5元/份" }, { dish: "猪排麻辣拌面", price: "12.6元/份" }, { dish: "小馆招牌炸酱面", price: "9.5元/份" }, { dish: "辣番茄鸡蛋拌面", price: "9.5元/份" }, { dish: "小馆混合炸酱面", price: "9.5元/份" }, { dish: "小馆鸡蛋炸酱面", price: "8.5元/份" }, { dish: "加鸡丝", price: "4元/份" }, { dish: "加羊杂", price: "5元/份" }, { dish: "加辣肉", price: "6元/份" }, { dish: "加肉肠", price: "2元/份" }, { dish: "加狮子头", price: "2元/份" }, { dish: "加炸蛋", price: "2元/份" }, { dish: "卤豆腐", price: "1.5元/片" }, { dish: "卤蛋", price: "1.5元/个" }, { dish: "黄金鸡柳", price: "5元/份" }, { dish: "日式猪排", price: "6元/片" }, { dish: "卤五花肉", price: "6元/片" }] },
            { num: 8, name: "炒鸡拌饭/麻辣香锅", items: [{ dish: "香辣炒鸡", price: "12.6元" }, { dish: "小炒鸡", price: "12.6元" }, { dish: "辣子鸡", price: "12.6元" }, { dish: "孜然炒鸡", price: "12.6元" }, { dish: "肉肠拌饭", price: "12.6元" }, { dish: "酸甜锅包肉", price: "12.6元" }, { dish: "香酥小酥肉", price: "12.6元" }, { dish: "鲜椒小炒鸡", price: "12.6元" }, { dish: "红烧肉拼炒鸡", price: "13元" }, { dish: "米饭", price: "1元" }, { dish: "小油条", price: "1元/根" }, { dish: "荷包蛋", price: "1.5元/个" }] },
            { num: 9, name: "椒麻鸡汤/粉/面", items: [{ dish: "椒麻鸡汤红薯粉", price: "10元" }, { dish: "鸡汤红薯粉", price: "8元" }, { dish: "椒麻鸡汤土豆粉", price: "11元" }, { dish: "鸡汤土豆粉", price: "9元" }, { dish: "椒麻鸡汤米线", price: "10元" }, { dish: "鸡汤米线", price: "8元" }, { dish: "椒麻鸡汤面", price: "10元" }, { dish: "鸡汤面", price: "8元" }, { dish: "椒麻鸡汤方便面", price: "10元" }, { dish: "鸡汤方便面", price: "8元" }] },
            { num: 10, name: "自选水饺/烤盘饭", items: [{ dish: "水饺自选称重", price: "13元/斤" }, { dish: "猪肉白菜馅", price: "13元/斤" }, { dish: "猪肉大葱馅", price: "13元/斤" }, { dish: "猪肉芹菜馅", price: "13元/斤" }, { dish: "牛肉大葱馅", price: "13元/斤" }, { dish: "羊肉大葱馅", price: "13元/斤" }, { dish: "鸡排饭", price: "11.7元/份" }] },
            { num: 12, name: "盖浇饭/套餐饭", items: [{ dish: "炒拉条", price: "9.5元" }, { dish: "西红柿鸡蛋盖浇饭", price: "9.5元" }, { dish: "肉沫茄子盖浇饭", price: "11.5元" }, { dish: "青椒肉丝盖浇饭", price: "11.5元" }, { dish: "香菇腊肠盖浇饭", price: "11.5元" }, { dish: "咖喱鸡肉盖浇饭", price: "11.5元" }, { dish: "宫保鸡丁盖浇饭", price: "11.5元" }, { dish: "回锅肉盖浇饭", price: "12.5元" }, { dish: "孜然肉片盖浇饭", price: "12.5元" }, { dish: "加鸡蛋", price: "1.5元/个" }, { dish: "加肉", price: "3元/份" }] },
            { num: 15, name: "派乐汉堡", items: [{ dish: "半只烤鸡", price: "9.9元" }, { dish: "2个墨西哥鸡肉卷", price: "9.9元" }, { dish: "香脆鸡腿堡+上校鸡块+果珍/可乐", price: "9.9元" }, { dish: "香脆鸡腿堡+香辣紫薯球+果珍/可乐", price: "9.9元" }, { dish: "香脆鸡腿堡+香辣翅根+果珍/可乐", price: "9.9元" }, { dish: "香脆鸡腿堡+开花淀粉肠+果珍/可乐", price: "9.9元" }, { dish: "香脆鸡腿堡+黄金蝴蝶酥+果珍/可乐", price: "9.9元" }, { dish: "香脆鸡腿堡+卤香鸡贝页+果珍/可乐", price: "9.9元" }] },
            { num: 19, name: "姥姥家面饭馆", items: [{ dish: "北京炸酱面", price: "10元" }, { dish: "暖汤鸡米线", price: "10元" }, { dish: "水晶肉滑面", price: "10元" }, { dish: "老武汉炒鸡热干面", price: "10元" }, { dish: "沙县拌面", price: "10元" }, { dish: "小土鸡米饭", price: "13元" }, { dish: "至尊方便面", price: "10元" }, { dish: "福建大馄饨", price: "10元" }, { dish: "四喜丸子面", price: "10元" }, { dish: "手工水饺", price: "11元" }, { dish: "福鼎肉片", price: "10元" }, { dish: "鸡蛋肉丝炒米饭", price: "8元" }, { dish: "虎皮鸡蛋", price: "2元" }, { dish: "红肠/玉米肠/脆骨肠", price: "2元" }, { dish: "肉肠", price: "3元" }, { dish: "烤丸子3个", price: "2元" }] },
            { num: 20, name: "王小胖自助小火锅", items: [{ dish: "麻辣烫/麻辣拌(荤素搭配)", price: "1.50元/两" }, { dish: "冒菜", price: "1.68元/50g" }, { dish: "米饭", price: "1元" }] },
            { num: 21, name: "螺蛳粉/螺当铺", items: [{ dish: "经典螺蛳粉", price: "9.5元" }, { dish: "螺蛳方便面", price: "9.5元" }, { dish: "粉面两掺", price: "11元" }, { dish: "大炸蛋经典螺蛳粉", price: "12元" }, { dish: "腊肠经典螺蛳粉", price: "12元" }, { dish: "大份经典螺蛳粉", price: "11.5元" }, { dish: "大炸蛋", price: "3元" }, { dish: "响铃卷", price: "3元" }, { dish: "淀粉肠", price: "3元" }, { dish: "鸡爪", price: "3元" }, { dish: "腊肠", price: "3元" }, { dish: "豆泡", price: "2元" }, { dish: "卤蛋", price: "2元" }] },
            { num: 22, name: "王小胖麻辣烫", items: [{ dish: "元气骨汤", price: "1.5元/两" }, { dish: "清新红番茄", price: "1.5元/两" }, { dish: "阳光金番茄", price: "1.5元/两" }, { dish: "开胃金汤", price: "1.5元/两" }, { dish: "川渝藤椒", price: "1.5元/两" }, { dish: "营养菌汤", price: "1.5元/两" }, { dish: "川渝干拌冒菜", price: "1.68元/50克" }, { dish: "川渝红汤冒菜", price: "1.68元/50克" }] },
            { num: 23, name: "螺簸箕螺蛳粉", items: [{ dish: "螺蛳粉", price: "9.5元" }, { dish: "螺蛳方便面", price: "9.5元" }, { dish: "粉面两掺", price: "11元" }, { dish: "大炸蛋经典螺蛳粉", price: "12元" }, { dish: "腊肠经典螺蛳粉", price: "12元" }, { dish: "大份经典螺蛳粉", price: "11.5元" }, { dish: "加料大炸蛋", price: "3元" }, { dish: "响铃卷", price: "3元" }, { dish: "淀粉肠", price: "3元" }, { dish: "鸡爪", price: "3元" }, { dish: "腊肠", price: "3元" }, { dish: "豆泡", price: "2元" }, { dish: "卤蛋", price: "2元" }] },
            { num: 24, name: "姥姥家面饭馆", items: [{ dish: "北京炸酱面", price: "10元" }, { dish: "水晶肉滑面", price: "10元" }, { dish: "沙县拌面", price: "10元" }, { dish: "至尊方便面", price: "10元" }, { dish: "四喜丸子面", price: "10元" }, { dish: "福鼎肉片", price: "10元" }, { dish: "暖汤鸡米线", price: "10元" }, { dish: "老武汉炒鸡热干面", price: "10元" }, { dish: "小土鸡米饭", price: "13元" }, { dish: "福建大馄饨", price: "10元" }, { dish: "手工水饺", price: "11元" }, { dish: "鸡蛋肉丝炒米饭", price: "8元" }, { dish: "加料虎皮鸡蛋", price: "2元" }, { dish: "红肠/玉米肠/脆骨肠", price: "2元" }, { dish: "肉肠", price: "3元" }, { dish: "烤丸子3个", price: "2元" }] }
          ] },
      ],
    },
    { id: 'canting2', label: '2餐厅', floors: [{ floor: 1, label: '一楼', windows: [] }] },
  ],
  snackStreet: {
    label: '小吃街',
    entries: [
      {
        name: '沈阳喷醋鸡架',
        range: '9.9-19元',
        items: [
          { dish: '正宗沈阳铁板大鸡架', price: '9.9元/份' },
          { dish: '正宗沈阳铁板大鸡架2份', price: '19元' },
        ],
        note: '口味：糖醋（招牌）、香辣、孜然、麻辣',
      },
      {
        name: '酥饼/合子摊',
        range: '2-5元',
        items: [
          { dish: '香葱酥饼', price: '2元' },
          { dish: '豆沙酥饼', price: '2元' },
          { dish: '梅菜扣肉饼', price: '4元' },
          { dish: '酥饼加凉拌菜', price: '5元' },
          { dish: '烤韭菜合子', price: '3元' },
          { dish: '烤茄子豆腐合子', price: '3元' },
        ],
      },
      {
        name: '烧烤串摊A',
        range: '2-10元',
        items: [
          { dish: '脆骨香肠', price: '3元/串' },
          { dish: '掌中宝', price: '3元/串' },
          { dish: '鸡软骨', price: '3元/串' },
          { dish: '泡椒脆肚', price: '3元/串' },
          { dish: '黑胡椒肠', price: '4元/串' },
          { dish: '羊肉串', price: '10元/5串' },
          { dish: '小黄鱼', price: '10元/3条' },
          { dish: '小腊肠', price: '8元/把' },
        ],
      },
      {
        name: '烧烤串摊B',
        range: '2-5元',
        items: [
          { dish: '原味香肠', price: '2元/串' },
          { dish: '玉米香肠', price: '3元/串' },
          { dish: '包浆豆腐', price: '2元/串' },
          { dish: '脆骨香肠', price: '3元/串' },
          { dish: '五花肉', price: '2元/串' },
          { dish: '掌中宝', price: '3元/串' },
          { dish: '包心鱼丸', price: '2元/串' },
          { dish: '鸡软骨', price: '3元/串' },
          { dish: '臭豆腐', price: '2元/串' },
          { dish: '泡椒脆肚', price: '3元/串' },
          { dish: '猪皮', price: '2元/串' },
          { dish: '鸡胗', price: '5元/2串' },
        ],
      },
      {
        name: '烧烤串摊C',
        range: '2-5元',
        items: [
          { dish: '面筋', price: '2元/串' },
          { dish: '鱼豆腐', price: '2元/串' },
          { dish: '甜不辣', price: '2元/串' },
          { dish: '脆皮年糕', price: '2元/串' },
          { dish: '烤饼', price: '2元/串' },
          { dish: '奶香小馒头', price: '2元/串' },
        ],
      },
      {
        name: '搞杯喝嘞（柠檬茶）',
        range: '4-13元',
        items: [
          { dish: '柠檬水(小)', price: '4元' },
          { dish: '柠檬水(大)', price: '5元' },
          { dish: '柠檬百香果(小)', price: '6元' },
          { dish: '柠檬百香果(大)', price: '8元' },
          { dish: '柠檬香橙汁(小)', price: '6元' },
          { dish: '柠檬香橙汁(大)', price: '8元' },
          { dish: '柠檬西瓜汁(小)', price: '6元' },
          { dish: '柠檬西瓜汁(大)', price: '8元' },
          { dish: '柠檬火龙果(小)', price: '6元' },
          { dish: '柠檬火龙果(大)', price: '8元' },
          { dish: '柠檬芒果汁(小)', price: '7元' },
          { dish: '柠檬芒果汁(大)', price: '9元' },
          { dish: '茉莉花柠檬茶(小)', price: '6元' },
          { dish: '茉莉花柠檬茶(大)', price: '8元' },
          { dish: '鸭屎香柠檬茶(小)', price: '6元' },
          { dish: '鸭屎香柠檬茶(大)', price: '8元' },
          { dish: '洛神花柠檬茶(小)', price: '6元' },
          { dish: '洛神花柠檬茶(大)', price: '8元' },
          { dish: '柠檬红茶(小)', price: '6元' },
          { dish: '柠檬红茶(大)', price: '8元' },
          { dish: '火龙果柠檬茶(小)', price: '7元' },
          { dish: '火龙果柠檬茶(大)', price: '9元' },
          { dish: '香橙柠檬茶(小)', price: '7元' },
          { dish: '香橙柠檬茶(大)', price: '9元' },
          { dish: '百香果柠檬茶(小)', price: '7元' },
          { dish: '百香果柠檬茶(大)', price: '9元' },
          { dish: '青提暴柠茶(小)', price: '10元' },
          { dish: '青提暴柠茶(大)', price: '12元' },
          { dish: '芒果青柠茶(小)', price: '10元' },
          { dish: '芒果青柠茶(大)', price: '12元' },
          { dish: '鸭屎香牛乳(小)', price: '7元' },
          { dish: '鸭屎香牛乳(大)', price: '9元' },
          { dish: '椰奶柠檬茶(小)', price: '8元' },
          { dish: '椰奶柠檬茶(大)', price: '10元' },
          { dish: '白月光柠檬茶(小)', price: '8元' },
          { dish: '白月光柠檬茶(大)', price: '10元' },
          { dish: '洛神赋(小)', price: '8元' },
          { dish: '洛神赋(大)', price: '10元' },
          { dish: '柠檬养乐多(小)', price: '10元' },
          { dish: '柠檬养乐多(大)', price: '13元' },
          { dish: '原味奶茶(小)', price: '6元' },
          { dish: '原味奶茶(大)', price: '8元' },
          { dish: '抹茶茉莉(小)', price: '6元' },
          { dish: '抹茶茉莉(大)', price: '8元' },
          { dish: '香芋奶茶(小)', price: '6元' },
          { dish: '香芋奶茶(大)', price: '8元' },
          { dish: '草莓奶茶(小)', price: '6元' },
          { dish: '草莓奶茶(大)', price: '8元' },
          { dish: '燕麦牛奶(小)', price: '6元' },
          { dish: '燕麦牛奶(大)', price: '8元' },
          { dish: '红糖珍珠奶茶(小)', price: '7元' },
          { dish: '红糖珍珠奶茶(大)', price: '9元' },
          { dish: '布丁奶茶(小)', price: '7元' },
          { dish: '布丁奶茶(大)', price: '9元' },
          { dish: '烧仙草奶茶(小)', price: '7元' },
          { dish: '烧仙草奶茶(大)', price: '9元' },
        ],
      },
      {
        name: '福鼎肉片',
        range: '5-15元',
        items: [
          { dish: '福鼎肉片(小份)', price: '8元' },
          { dish: '福鼎肉片(大份)', price: '10元' },
          { dish: '福鼎肉片+面和粉(小份)', price: '11元' },
          { dish: '福鼎肉片+面和粉(大份)', price: '13元' },
          { dish: '馄饨(小份)', price: '8元' },
          { dish: '馄饨(大份)', price: '12元' },
          { dish: '肉丸汤(小份)', price: '8元' },
          { dish: '肉丸汤(大份)', price: '15元' },
          { dish: '桂林米粉', price: '5元' },
          { dish: '泡面', price: '5元' },
          { dish: '三角粑', price: '5元/2个' },
          { dish: '香甜蛋酒', price: '3元' },
        ],
      },
      {
        name: '牛大嘴炒饭',
        range: '10元',
        items: [
          { dish: '10元自选炒饭', price: '10元' },
        ],
        note: '图片信息较少，具体菜品待补充',
      },
      {
        name: '小陈大福馄饨',
        range: '8-16元',
        items: [
          { dish: '鲜肉馄饨(小份)', price: '8元' },
          { dish: '鲜肉馄饨(大份)', price: '10元' },
          { dish: '玉米鲜肉馄饨(小份)', price: '9元' },
          { dish: '玉米鲜肉馄饨(大份)', price: '11元' },
          { dish: '贡菜鲜肉馄饨(小份)', price: '9元' },
          { dish: '贡菜鲜肉馄饨(大份)', price: '11元' },
          { dish: '皮蛋鲜肉馄饨(小份)', price: '10元' },
          { dish: '皮蛋鲜肉馄饨(大份)', price: '12元' },
          { dish: '咸蛋黄鲜肉馄饨(小份)', price: '12元' },
          { dish: '咸蛋黄鲜肉馄饨(大份)', price: '15元' },
          { dish: '虾仁鲜肉馄饨(小份)', price: '13元' },
          { dish: '虾仁鲜肉馄饨(大份)', price: '16元' },
          { dish: '方便面馄饨(方便面口味自选)', price: '13元' },
          { dish: '火鸡面拌馄饨', price: '13元' },
          { dish: '全家福(所有口味都有)', price: '15元' },
        ],
      },
      {
        name: '手工水饺/千里香馄饨',
        range: '7-13元',
        items: [
          { dish: '大葱鲜肉水饺(小份/15个)', price: '8元' },
          { dish: '大葱鲜肉水饺(大份/20个)', price: '10元' },
          { dish: '大葱鲜肉水饺(超大份/25个)', price: '12元' },
          { dish: '荠菜鲜肉水饺(小份/15个)', price: '8元' },
          { dish: '荠菜鲜肉水饺(大份/20个)', price: '10元' },
          { dish: '荠菜鲜肉水饺(超大份/25个)', price: '12元' },
          { dish: '韭菜鸡蛋水饺(小份/15个)', price: '8元' },
          { dish: '韭菜鸡蛋水饺(大份/20个)', price: '10元' },
          { dish: '韭菜鸡蛋水饺(超大份/25个)', price: '12元' },
          { dish: '纯鲜肉馄饨(小份/15个)', price: '8元' },
          { dish: '纯鲜肉馄饨(大份/20个)', price: '10元' },
          { dish: '蛋黄鲜肉馄饨(小份/15个)', price: '10元' },
          { dish: '蛋黄鲜肉馄饨(大份/20个)', price: '13元' },
          { dish: '皮蛋鲜肉馄饨(小份/15个)', price: '10元' },
          { dish: '皮蛋鲜肉馄饨(大份/20个)', price: '13元' },
          { dish: '全家福馄饨(小份/15个)', price: '9元' },
          { dish: '全家福馄饨(大份/20个)', price: '12元' },
          { dish: '肉沫酸辣粉(小份)', price: '8元' },
          { dish: '肉沫酸辣粉(大份)', price: '9元' },
          { dish: '肉沫米线(小份)', price: '7元' },
          { dish: '肉沫米线(大份)', price: '8元' },
        ],
      },
      {
        name: '华水老字号肉夹馍',
        range: '5-8元',
        items: [
          { dish: '肉夹馍(鸡蛋豆皮)', price: '5元' },
          { dish: '肉夹馍(肥瘦)', price: '7元' },
          { dish: '肉夹馍(纯瘦)', price: '8元' },
          { dish: '凉皮', price: '8元' },
        ],
      },
      {
        name: '口口香炒饭',
        range: '8元起',
        items: [
          { dish: '鸡蛋炒饭(炒粉/炒面/炒饼/炒饭)', price: '8元' },
          { dish: '香菇肉丝(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '扬州炒饭(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '腊肠(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '老干妈炒饭(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '回锅肉(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '羊油炒饭(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '培根(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '火腿鸡蛋(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '牛肉炒饭(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
        ],
        note: '订餐电话：15839740826，图片中未显示具体价格',
      },
      {
        name: '方家炒饭',
        range: '8元起',
        items: [
          { dish: '鸡蛋(炒粉/炒面/炒饼/炒饭)', price: '8元' },
          { dish: '香菇肉丝(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '老干妈(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '香辣牛肉(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '火腿鸡蛋(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '腊肠(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '扬州鸡蛋(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '回锅肉(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '羊油鸡蛋(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
          { dish: '青椒肉丝(炒粉/炒面/炒饼/炒饭)', price: '待确认' },
        ],
        note: '订餐电话：16692881897，图片中未显示具体价格',
      },
      {
        name: '华姐炒馅小笼包',
        range: '1.5-7元',
        items: [
          { dish: '烧麦', price: '1.5元/个' },
          { dish: '芝麻红枣豆浆', price: '2元/杯' },
          { dish: '酸梅汤', price: '4元/杯' },
          { dish: '玉米猪肉蒸饺', price: '6元/笼' },
          { dish: '鲜肉小笼包', price: '6元/笼' },
          { dish: '酱肉小笼包', price: '7元/笼' },
          { dish: '青椒小炒肉小笼包', price: '7元/笼' },
          { dish: '梅干菜肉包', price: '7元/笼' },
        ],
      },
      {
        name: '哇噻柠檬（冰粉奶茶果汁）',
        range: '4-12元',
        items: [
          { dish: '招牌手工红糖冰粉(小)', price: '6元/份' },
          { dish: '招牌手工红糖冰粉(大)', price: '8元/份' },
          { dish: '手工双皮奶', price: '5元/份' },
          { dish: '雪花酪', price: '10元/份' },
          { dish: '现煮冰汤圆', price: '10元/份' },
          { dish: '原味奶茶', price: '6元' },
          { dish: '草莓大果粒奶茶', price: '6元' },
          { dish: '芒果大果粒奶茶', price: '6元' },
          { dish: '香蕉大果粒奶茶', price: '6元' },
          { dish: '荔枝冰奶', price: '8元' },
          { dish: '牛油果冰奶', price: '8元' },
          { dish: '粉桃冰奶', price: '8元' },
          { dish: '蓝柑冰奶', price: '8元' },
          { dish: '抹茶牛乳', price: '10元' },
          { dish: '抹茶耶耶', price: '10元' },
          { dish: '柠檬养乐多', price: '10元' },
          { dish: '草莓养乐多', price: '10元' },
          { dish: '芒果养乐多', price: '10元' },
          { dish: '白桃紫苏养乐多', price: '10元' },
          { dish: '柠檬水(小)', price: '4元' },
          { dish: '柠檬水(大)', price: '5元' },
          { dish: '橙汁(小)', price: '4元' },
          { dish: '橙汁(大)', price: '5元' },
          { dish: '西瓜汁(小)', price: '5元' },
          { dish: '西瓜汁(大)', price: '7元' },
          { dish: '茉莉绿茶(小)', price: '6元' },
          { dish: '茉莉绿茶(大)', price: '8元' },
          { dish: '柠檬红茶(小)', price: '6元' },
          { dish: '柠檬红茶(大)', price: '8元' },
          { dish: '白桃乌龙柠檬茶(小)', price: '6元' },
          { dish: '白桃乌龙柠檬茶(大)', price: '8元' },
          { dish: '鸭屎香柠檬茶(小)', price: '6元' },
          { dish: '鸭屎香柠檬茶(大)', price: '8元' },
          { dish: '百香果爆柠茶(小)', price: '7元' },
          { dish: '百香果爆柠茶(大)', price: '9元' },
          { dish: '西瓜爆柠茶(小)', price: '7元' },
          { dish: '西瓜爆柠茶(大)', price: '9元' },
          { dish: '香橙爆柠茶(小)', price: '7元' },
          { dish: '香橙爆柠茶(大)', price: '9元' },
          { dish: '话梅爆柠茶(小)', price: '7元' },
          { dish: '话梅爆柠茶(大)', price: '9元' },
          { dish: '羽衣甘蓝柠檬茶', price: '9元' },
          { dish: '白桃紫苏柠檬茶', price: '9元' },
          { dish: '蜜桃茉莉柠檬茶', price: '9元' },
          { dish: '西瓜蜜桃啵啵', price: '9元' },
          { dish: '绿豆沙牛乳', price: '5元/杯' },
          { dish: '冰/热美式', price: '8元' },
          { dish: '生椰拿铁', price: '12元' },
          { dish: '牛油果拿铁', price: '12元' },
        ],
        note: '冰粉口味：草莓味、蓝莓味、百香果味、芒果味、青提味、水蜜桃味',
      },
      {
        name: '陈记爆汁黄焖鸡',
        range: '10-18元',
        items: [
          { dish: '黄焖素拼(小份)', price: '10元' },
          { dish: '黄焖素拼(大份)', price: '12元' },
          { dish: '黄焖鸡(小份/送3个配菜)', price: '12元' },
          { dish: '黄焖鸡(大份/送5个配菜)', price: '15元' },
          { dish: '黄焖排骨(小份/送3个配菜)', price: '15元' },
          { dish: '黄焖排骨(大份/送5个配菜)', price: '18元' },
        ],
        note: '口味：酱香、微辣、中辣、麻辣；免费提供米饭、馒头、例汤',
      },
      {
        name: '张记酱肉小笼包',
        range: '1-10元',
        items: [
          { dish: '酱肉包(小份)', price: '6元' },
          { dish: '酱肉包(大份)', price: '8元' },
          { dish: '鲜肉包(小份)', price: '6元' },
          { dish: '鲜肉包(大份)', price: '8元' },
          { dish: '猪肉大葱包(小份)', price: '6元' },
          { dish: '猪肉大葱包(大份)', price: '8元' },
          { dish: '梅菜烧肉包(小份)', price: '6元' },
          { dish: '梅菜烧肉包(大份)', price: '8元' },
          { dish: '蒜香茄子包(小份)', price: '6元' },
          { dish: '蒜香茄子包(大份)', price: '8元' },
          { dish: '三掺包(小份)', price: '6元' },
          { dish: '三掺包(大份)', price: '8元' },
          { dish: '茶树菇包(小份)', price: '6元' },
          { dish: '茶树菇包(大份)', price: '8元' },
          { dish: '手工猪肉玉米蒸饺(小份)', price: '8元' },
          { dish: '手工猪肉玉米蒸饺(大份)', price: '10元' },
          { dish: '手工猪肉芹菜蒸饺(小份)', price: '8元' },
          { dish: '手工猪肉芹菜蒸饺(大份)', price: '10元' },
          { dish: '纸皮蛋黄烧麦', price: '2元/个' },
          { dish: '芝士拉丝烧麦', price: '2元/个' },
          { dish: '猪肉香菇烧麦', price: '1.5元/个' },
          { dish: '水晶虾仁鲜肉烧麦', price: '10元/份' },
          { dish: '水晶蛋黄鲜肉烧麦', price: '10元/份' },
          { dish: '水晶猪肉大葱虾仁烧麦', price: '10元/份' },
          { dish: '水晶猪肉大葱蛋黄烧麦', price: '10元/份' },
          { dish: '云南风味竹筒粽', price: '2元/根' },
          { dish: '茶叶蛋', price: '1元/个' },
        ],
      },
      {
        name: '小廖鸡叉骨',
        range: '15元',
        items: [
          { dish: '鸡叉骨(买一斤送半斤)', price: '15元' },
        ],
        note: '口味：孜然、麻辣、甘梅、柠檬、五香、番茄',
      },
      {
        name: '芝士火鸡面烤冷面（罗山首家）',
        range: '6-20元',
        items: [
          { dish: '爆款芝士火鸡面烤冷面', price: '15元' },
          { dish: '芝士白象火鸡面烤冷面', price: '16元' },
          { dish: '招牌芝士三养火鸡面烤冷面', price: '20元' },
          { dish: '奥尔良鸡排火鸡面烤冷面', price: '15元' },
          { dish: '火鸡面烤冷面', price: '12元' },
          { dish: '白象火鸡面烤冷面', price: '13元' },
          { dish: '经典烤冷面', price: '6元' },
          { dish: '肉松烤冷面', price: '7元' },
          { dish: '培根烤冷面', price: '7元' },
          { dish: '里脊肉烤冷面', price: '7元' },
          { dish: '双蛋烤冷面', price: '8元' },
          { dish: '全家福烤冷面', price: '9元' },
          { dish: '豪华版烤冷面', price: '10元' },
          { dish: '至尊版烤冷面', price: '12元' },
        ],
        note: '口味：酸甜辣',
      },
      {
        name: '烤冷面/蛋包火鸡面',
        range: '6-20元',
        items: [
          { dish: '经典烤冷面', price: '6元' },
          { dish: '鸡柳烤冷面', price: '7元' },
          { dish: '里脊肉烤冷面', price: '7元' },
          { dish: '肉松玉米烤冷面', price: '8元' },
          { dish: '泡菜烤冷面', price: '8元' },
          { dish: '蟹排烤冷面', price: '8元' },
          { dish: '培根烤冷面', price: '8元' },
          { dish: '奥尔良鸡排烤冷面', price: '10元' },
          { dish: '芝士玉米烤冷面', price: '12元' },
          { dish: '芝士奥尔良鸡排烤冷面', price: '15元' },
          { dish: '三养火鸡面烤冷面', price: '16元' },
          { dish: '豪华版烤冷面', price: '18元' },
          { dish: '招牌蛋包火鸡面', price: '12元' },
          { dish: '蛋包芝士火鸡面', price: '15元' },
          { dish: '蛋包白象火鸡面', price: '13元' },
          { dish: '蛋包芝士白象火鸡面', price: '16元' },
          { dish: '蛋包三养火鸡面', price: '16元' },
          { dish: '蛋包芝士三养火鸡面', price: '20元' },
        ],
      },
      {
        name: '杂粮煎饼果子',
        range: '5元起',
        items: [
          { dish: '原味杂粮煎饼', price: '5元' },
          { dish: '原味手抓饼', price: '5元' },
          { dish: '原味鸡蛋灌饼', price: '5元' },
          { dish: '烤冷面(鸡蛋+里脊肉)', price: '5元' },
          { dish: '加鸡柳', price: '1元' },
          { dish: '加培根', price: '1元' },
          { dish: '加里脊肉', price: '1元' },
          { dish: '加香肠', price: '1元' },
          { dish: '加鸡蛋', price: '1元' },
          { dish: '加肉松', price: '1元' },
          { dish: '加蟹排', price: '1元' },
          { dish: '加火腿片', price: '1元' },
          { dish: '加土豆丝辣条', price: '1元' },
          { dish: '加卫龙辣条', price: '1元' },
          { dish: '加麻辣海带丝', price: '1元' },
          { dish: '加王中王火腿肠', price: '2元' },
          { dish: '加双汇玉米肠', price: '2元' },
          { dish: '加黑胡椒肉肠', price: '2元' },
        ],
        note: '免费区：生菜、葱花、咸菜、酱料、番茄酱、辣椒油',
      },
      {
        name: '小厨十里香馄饨',
        range: '8-13元',
        items: [
          { dish: '猪肉大葱水饺(小份)', price: '10元' },
          { dish: '猪肉大葱水饺(大份)', price: '12元' },
          { dish: '猪肉芹菜萝卜水饺(小份)', price: '10元' },
          { dish: '猪肉芹菜萝卜水饺(大份)', price: '12元' },
          { dish: '猪肉香菇白菜水饺(小份)', price: '10元' },
          { dish: '猪肉香菇白菜水饺(大份)', price: '12元' },
          { dish: '韭菜肉水饺(小份)', price: '10元' },
          { dish: '韭菜肉水饺(大份)', price: '12元' },
          { dish: '韭菜鸡蛋水饺(小份)', price: '10元' },
          { dish: '韭菜鸡蛋水饺(大份)', price: '12元' },
          { dish: '鲜肉馄饨(小份)', price: '8元' },
          { dish: '鲜肉馄饨(大份)', price: '10元' },
          { dish: '玉米鲜肉馄饨(小份)', price: '8元' },
          { dish: '玉米鲜肉馄饨(大份)', price: '10元' },
          { dish: '鲜肉皮蛋馄饨(小份)', price: '9元' },
          { dish: '鲜肉皮蛋馄饨(大份)', price: '11元' },
          { dish: '虾仁大馄饨(小份)', price: '11元' },
          { dish: '虾仁大馄饨(大份)', price: '13元' },
          { dish: '全家福馄饨', price: '13元' },
        ],
      },
    ],
  },
};

const jianghuaiSecondFloor = menuData.canteens
  .find((item) => item.id === 'jianghuai')
  ?.floors.find((item) => Number(item.floor) === 2);

if (jianghuaiSecondFloor) {
  const zhuJiaMenu = jianghuaiSecondFloor.windows.find((item) => Number(item.num) === 5);
  if (zhuJiaMenu) zhuJiaMenu.name = '奉天朱家小馆（覆盖3至5号窗口）';

  const replacements = [
    { num: 6, name: '麻辣香锅', items: [{ dish: '麻辣香锅', price: '1.78元/两' }] },
    { num: 7, name: '麻辣拌粉/面', items: [{ dish: '麻辣拌粉', price: '10.5元' }, { dish: '麻辣拌面', price: '10.5元' }] },
    { num: 11, name: '烤鸭拌饭', items: [{ dish: '烤鸭拌饭', price: '11.5元/份' }] },
    { num: 13, name: '大盘鸡', items: [{ dish: '大盘鸡', price: '11.5元/份' }, { dish: '大盘鸡拌面', price: '12.5元' }, { dish: '大盘鸡拌饭', price: '12.5元' }, { dish: '酱香鸡块', price: '12.5元' }] },
    { num: 14, name: '锡纸炒鸡/牛羊肉水饺', items: [{ dish: '香辣锡纸炒鸡', price: '12.6元' }, { dish: '酱香锡纸炒鸡', price: '12.6元' }, { dish: '香辣双拼炒鸡', price: '12.6元' }, { dish: '酱香双拼炒鸡', price: '12.6元' }, { dish: '香辣焖饼炒鸡', price: '12.6元' }, { dish: '锡纸小酥肉', price: '11.6元' }, { dish: '锡纸鸡排', price: '10.8元' }, { dish: '牛羊肉水饺', price: '10元/13元/15元' }, { dish: '牛羊肉水饺（称重）', price: '11元/500克' }] },
    { num: 16, name: '牛羊肉汤', items: [{ dish: '牛肉汤', price: '10元/15元/20元' }, { dish: '羊肉汤', price: '10元/15元/20元' }, { dish: '羊杂汤', price: '8元/10元/15元' }, { dish: '五香油饼', price: '7元/斤' }, { dish: '方便面', price: '1.5元/块' }, { dish: '牛羊丸子汤', price: '7元' }, { dish: '羊肉烩面', price: '11.5元' }] },
  ];
  const replacedNums = new Set([2, 3, ...replacements.map((item) => item.num)]);
  jianghuaiSecondFloor.windows = jianghuaiSecondFloor.windows
    .filter((item) => !replacedNums.has(Number(item.num)))
    .concat(replacements)
    .sort((a, b) => Number(a.num) - Number(b.num));
}

export function getMenuWindow(regionId, floor, num) {
  const canteen = menuData.canteens.find((item) => item.id === regionId);
  const group = canteen?.floors.find((item) => Number(item.floor) === Number(floor));
  const menuNum = regionId === 'jianghuai' && Number(floor) === 2 && [3, 4, 5].includes(Number(num))
    ? 5
    : Number(num);
  return group?.windows.find((item) => Number(item.num) === menuNum) || null;
}

export function dishVoteId(regionId, floor, num, dishIndex) {
  return `dish:${regionId}:${Number(floor)}:${Number(num)}:${Number(dishIndex)}`;
}

const RICE_DISH_PATTERN = /米饭|炒饭|盖浇饭|拌饭|焖饭|烤盘饭|煲仔饭|猪脚饭|猪肘饭|卤肉饭|鸡排饭|鸭腿饭|套餐饭|捞饭/;
const NOODLE_DISH_PATTERN = /面|粉|米线|馄饨|水饺|饺子|抄手|麻辣烫|螺蛳粉|渔粉/;

export function inferDishType(item, context = {}) {
  const dishName = String(item?.dish || '');
  if (RICE_DISH_PATTERN.test(dishName)) return 'rice';
  if (NOODLE_DISH_PATTERN.test(dishName)) return 'noodle';
  if (isRice(context.regionId, Number(context.floor), Number(context.num))) return 'rice';
  if (isNoodle(context.regionId, Number(context.floor), Number(context.num))) return 'noodle';
  return 'other';
}

export function dishTypeMatches(item, type, context = {}) {
  return type === 'all' || inferDishType(item, context) === type;
}

// 从价格字符串解析数值，如 "11.7元" -> 11.7、"1.7元/50g" -> 1.7；无法解析返回 null
export function parsePrice(price) {
  const match = String(price || '').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[0]) : null;
}

// 判断价格是否落在 [min, max]（空字符串表示该侧不限）；无法解析视为不匹配
export function priceInRange(price, min, max) {
  const value = parsePrice(price);
  if (value === null) return false;
  if (min !== '' && value < Number(min)) return false;
  if (max !== '' && value > Number(max)) return false;
  return true;
}

// 窗口菜单中是否存在价格落在区间的菜品
export function windowHasDishInRange(window, min, max) {
  if (min === '' && max === '') return true;
  return (window?.items || []).some((item) => priceInRange(item.price, min, max));
}

export function getAllDishes() {
  const dishes = [];
  for (const canteen of menuData.canteens) {
    for (const group of canteen.floors) {
      for (const window of group.windows) {
        (window.items || []).forEach((item, dishIndex) => {
          dishes.push({
            ...item,
            kind: 'dish',
            id: dishVoteId(canteen.id, group.floor, window.num, dishIndex),
            dishIndex,
            regionId: canteen.id,
            floor: Number(group.floor),
            num: Number(window.num),
            windowName: window.name,
            type: inferDishType(item, {
              regionId: canteen.id,
              floor: group.floor,
              num: window.num,
            }),
          });
        });
      }
    }
  }
  for (const [stallIndex, stall] of menuData.snackStreet.entries.entries()) {
    (stall.items || []).forEach((item, dishIndex) => {
      dishes.push({
        ...item,
        kind: 'dish',
        id: dishVoteId('snack', 1, stallIndex + 1, dishIndex),
        dishIndex,
        regionId: 'snack',
        floor: 1,
        num: stallIndex + 1,
        windowName: stall.name,
        type: inferDishType(item),
      });
    });
  }
  return dishes;
}
