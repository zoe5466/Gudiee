// 通過 API 添加假貼文的腳本
// 使用方式: npx ts-node scripts/seed-posts-api.ts

const mockPosts = [
  {
    title: '台北101不只是地標，更是美食寶庫！',
    content: `<h2>發現台北101的隱藏美食</h2>
<p>來台北101不只是看夜景，更要品嚐這裡的美食！我帶大家發現了幾家必吃的餐廳。</p>
<h3>信義區美食地圖</h3>
<ul>
<li>頂樓餐廳享受 360 度夜景</li>
<li>購物中心美食街的在地小吃</li>
<li>附近巷弄的隱藏版咖啡館</li>
</ul>
<p>最推薦的是登頂後在88樓的觀景台咖啡廳，一邊欣賞夜景一邊品茶，真的是人生必體驗！</p>`,
    category: 'food',
    tags: ['台北', '美食', '台北101', '信義區'],
    location: '台北市信義區',
    coverImage: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800',
  },
  {
    title: '九份老街尋找千與千尋的場景',
    content: `<h2>漫步在九份老街的童話世界</h2>
<p>如果你是千與千尋的粉絲，九份老街絕對不能錯過！每個角落都像是電影場景的重現。</p>
<h3>不可錯過的景點</h3>
<ul>
<li>豎崎路的紅燈籠街道</li>
<li>茶樓享受傳統台灣茶文化</li>
<li>老街的懷舊商店和古董街</li>
<li>山城的遠眺視野</li>
</ul>
<p>建議黃昏時分造訪，看著紅燈籠逐漸亮起，整條街道彷彿進入了魔幻世界。記得穿著舒適的鞋子，因為老街的階梯很多！</p>`,
    category: 'culture',
    tags: ['九份', '台灣文化', '千與千尋', '新北'],
    location: '新北市瑞芳鎮',
    coverImage: 'https://images.unsplash.com/photo-1609137144814-36cffb26db91?w=800',
  },
  {
    title: '陽明山花季：台灣北部最壯觀的花海',
    content: `<h2>春天必訪：陽明山花季指南</h2>
<p>每年春天，陽明山都會迎來壯觀的花季，杜鵑花、繡球花、櫻花輪番開放。作為導遊，我來分享最佳的賞花路線。</p>
<h3>花季時間表</h3>
<ul>
<li>2月-3月：櫻花季</li>
<li>3月-4月：杜鵑花季</li>
<li>5月-6月：繡球花季</li>
</ul>
<h3>推薦路線</h3>
<p>從竹子湖開始，沿著環山公路走，可以欣賞不同的花卉景觀。記得帶著相機，因為每一處都是拍照的好地點！</p>`,
    category: 'nature',
    tags: ['陽明山', '花季', '台灣自然', '台北景點'],
    location: '台北市北投區',
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
  },
  {
    title: '台灣第一次旅遊，我選擇跟著在地導遊',
    content: `<h2>跟著台灣導遊的收穫</h2>
<p>第一次來台灣旅遊時，我決定預訂了一位導遊。這個決定改變了我整個旅遊體驗！</p>
<h3>為什麼推薦跟導遊</h3>
<ul>
<li>了解景點背後的故事和文化</li>
<li>避免遊客陷阱，找到地道美食</li>
<li>語言不通時有人幫忙</li>
<li>安全性更有保障</li>
<li>節省時間規劃行程</li>
</ul>
<p>我的導遊不僅展示了景點，更讓我深入了解了台灣的人文與文化。下次來台灣，我一定還要再找她！</p>`,
    category: 'culture',
    tags: ['旅遊心得', '台灣導遊', '客戶推薦'],
    location: '台灣',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
  },
  {
    title: '基隆廟口夜市美食全攻略',
    content: `<h2>基隆廟口：台灣最道地的夜市體驗</h2>
<p>基隆廟口是台灣必訪的美食聖地。每天傍晚，這裡就人山人海，只為了品嚐各種道地小吃。</p>
<h3>必吃美食清單</h3>
<ul>
<li>鼎邊銼：台灣特色小吃</li>
<li>天婦羅：日式炸物傳統</li>
<li>螺蚶：海鮮食材</li>
<li>蝦捲：口感酥脆</li>
<li>味噌湯：暖和身子</li>
</ul>
<p>來廟口的訣竅是一定要空著肚子來，因為美食太多，吃不完會後悔！建議傍晚5點左右到達，既能避免人潮最多的時段，又能品嚐到最新鮮的食物。</p>`,
    category: 'food',
    tags: ['基隆', '夜市', '台灣美食', '海鮮'],
    location: '基隆市',
    coverImage: 'https://images.unsplash.com/photo-1568458847403-e91d3c1b6e23?w=800',
  },
  {
    title: '台中宮原眼科：打卡必去的冰淇淋天堂',
    content: `<h2>宮原眼科的甜蜜誘惑</h2>
<p>台中宮原眼科已經不只是景點，更是台灣冰淇淋愛好者的聖殿。這棟百年建築裡有著驚人的冰淇淋選擇。</p>
<h3>必嚐口味</h3>
<ul>
<li>古早味芋頭：台灣傳統風味</li>
<li>手工餅乾：搭配冰淇淋的完美搭檔</li>
<li>季節限定：每月都有新驚喜</li>
</ul>
<p>建議一早就去排隊，因為中午以後往往要等很久。而且宮原眼科不只有冰淇淋，還有咖啡、伴手禮，值得花個2-3小時細細品嚐。</p>`,
    category: 'food',
    tags: ['台中', '甜點', '打卡景點', '冰淇淋'],
    location: '台中市中區',
    coverImage: 'https://images.unsplash.com/photo-1563805042-7684c019e157?w=800',
  },
  {
    title: '蘭嶼生態之旅：台灣的隱藏寶石',
    content: `<h2>探索蘭嶼的秘境之美</h2>
<p>蘭嶼是台灣最後的原始寶石。這個小島有著獨特的達悟文化和壯麗的自然景觀。</p>
<h3>蘭嶼必體驗</h3>
<ul>
<li>飛魚季：了解達悟文化</li>
<li>環島之旅：海邊風景絕美</li>
<li>野銀冷泉：天然溫泉</li>
<li>傳統地下屋：獨特建築</li>
</ul>
<h3>旅遊貼士</h3>
<p>蘭嶼不適合跟團旅遊，最好是自由行或找在地導遊帶領。尊重當地文化，不要打擾飛魚季的作業。最佳遊訪時間是4-10月，避免冬季的強風。</p>`,
    category: 'nature',
    tags: ['蘭嶼', '達悟文化', '離島', '台灣最美'],
    location: '蘭嶼',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    title: '台灣溫泉之鄉：北投溫泉終極指南',
    content: `<h2>泡湯聖地北投完全攻略</h2>
<p>台灣的溫泉文化聞名世界，而北投更是溫泉的代表。作為在地導遊，我帶你深入探索北投溫泉的每個角落。</p>
<h3>北投溫泉區域分佈</h3>
<ul>
<li>地熱谷：免費的天然溫泉溪</li>
<li>溫泉博物館：了解溫泉歷史</li>
<li>硫磺谷：看到真實的地熱活動</li>
<li>中山路溫泉街：各式溫泉旅館</li>
</ul>
<h3>泡湯禮儀</h3>
<p>台灣溫泉講究禮儀。進入溫泉前要沐浴，毛巾不可入池。冬天泡湯最舒服，但夏天也能體驗不同的感受。</p>`,
    category: 'nature',
    tags: ['北投', '溫泉', '台北景點', '養生'],
    location: '台北市北投區',
    coverImage: 'https://images.unsplash.com/photo-1577720643272-265f434898b9?w=800',
  },
  {
    title: '騎機車環島是台灣最自由的旅遊方式',
    content: `<h2>我的台灣機車環島初體驗</h2>
<p>作為第一次來台灣的旅客，我決定挑戰騎機車環島。這是我做過最勇敢的決定之一！</p>
<h3>為什麼選擇機車環島</h3>
<ul>
<li>自由度最高，想停就停</li>
<li>可以發現許多不在旅遊書上的景點</li>
<li>與當地人互動的機會更多</li>
<li>成本最低，適合背包客</li>
</ul>
<h3>環島心得</h3>
<p>雖然有點危險（騎機車對我來說是新挑戰），但沿途的風景和人情味讓我深深愛上台灣。每個小鎮都有故事，每個海灣都有驚喜。下次還要再來！</p>`,
    category: 'city',
    tags: ['環島', '機車', '冒險', '旅遊心得'],
    location: '台灣',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  },
  {
    title: '日月潭自行車道：台灣最美的騎行路線',
    content: `<h2>日月潭自行車環湖完全指南</h2>
<p>日月潭自行車道被譽為全世界最美的自行車路線之一。今天我來分享如何最好地體驗這條路線。</p>
<h3>路線資訊</h3>
<ul>
<li>全長：約30公里，可分段騎行</li>
<li>難度：輕鬆，適合全年齡層</li>
<li>最佳騎行時間：清晨或傍晚</li>
<li>所需時間：3-4小時（視路段而定）</li>
</ul>
<h3>騎行貼士</h3>
<p>租借電動自行車是明智之舉，尤其如果你不是專業騎手。沿途有許多驛站可以休息和補給。日落時分騎向日月潭，看著天色漸變，是人生必體驗之一。</p>`,
    category: 'nature',
    tags: ['日月潭', '自行車', '南投', '台灣必訪'],
    location: '南投縣日月潭',
    coverImage: 'https://images.unsplash.com/photo-1534787494881-6ea4628fb277?w=800',
  },
  {
    title: '淡水老街的浪漫與歷史',
    content: `<h2>淡水老街的前世今生</h2>
<p>淡水不只是情侶約會的地點，更是台灣歷史的縮影。老街的每一塊磚頭都訴說著故事。</p>
<h3>必去景點</h3>
<ul>
<li>紅毛城：清末建築的見證</li>
<li>淡水老街：古蹟與美食並存</li>
<li>漁人碼頭：現代與傳統的結合</li>
<li>馬偕雕像與公園：追憶歷史</li>
</ul>
<h3>美食推薦</h3>
<p>淡水的阿給、鐵蛋和鮮魚湯是必吃的三寶。晚上來淡水看夕陽，在老街享用小吃，這是台北居民的日常幸福。</p>`,
    category: 'culture',
    tags: ['淡水', '台灣文化', '新北', '歷史古蹟'],
    location: '新北市淡水區',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    title: '高雄駁二藝術特區：創意文化的聚落',
    content: `<h2>駁二變身記：廢棄倉庫到藝術天堂</h2>
<p>高雄駁二藝術特區是都市更新的成功典範。曾經的廢棄倉庫，如今成了藝術家和遊客的天堂。</p>
<h3>駁二必體驗</h3>
<ul>
<li>街頭藝術：每個角落都是藝術作品</li>
<li>展覽館：定期更新的當代藝術展</li>
<li>創意市集：文青小物販售</li>
<li>藝文表演：不定期的現場表演</li>
</ul>
<p>駁二最美的時候是傍晚，當夕陽灑在紅磚倉庫上，你會理解為什麼高雄人為這地方感到驕傲。建議留足時間細細品味，拍照打卡之外，更要體會藝術的溫度。</p>`,
    category: 'culture',
    tags: ['高雄', '藝術', '都市更新', '文創'],
    location: '高雄市鹽埕區',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800',
  },
]

async function seedPosts() {
  const baseUrl = 'http://localhost:3000'
  let successCount = 0
  let failCount = 0

  console.log('🌱 開始通過 API 添加假貼文...')
  console.log(`📝 準備添加 ${mockPosts.length} 篇貼文\n`)

  for (const post of mockPosts) {
    try {
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          status: 'published',
          authorType: 'guide', // API 需要此字段
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`❌ 失敗: ${post.title}`)
        console.error(`   Status: ${response.status}`)
        console.error(`   Error: ${errorData.error || 'Unknown error'}`)
        failCount++
      } else {
        const data = await response.json()
        console.log(`✅ 成功: ${post.title} (ID: ${data.data?.id || 'unknown'})`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ 錯誤: ${post.title}`)
      console.error(`   ${error instanceof Error ? error.message : 'Unknown error'}`)
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 結果統計:`)
  console.log(`   ✅ 成功: ${successCount}`)
  console.log(`   ❌ 失敗: ${failCount}`)
  console.log(`   📝 總計: ${successCount + failCount}`)
  console.log('='.repeat(60))

  if (failCount > 0) {
    console.log(
      '\n⚠️  部分貼文添加失敗。請確保：'
    )
    console.log('   1. 開發服務器正在運行 (npm run dev)')
    console.log('   2. 數據庫已連接')
    console.log('   3. 系統中已有用戶存在')
  }
}

seedPosts().catch((error) => {
  console.error('❌ 種子腳本失敗:', error)
  process.exit(1)
})
