let backgroundImage; // 儲存畫布背景圖片。
let idleSprite; // 儲存角色 1 的站立動畫精靈圖。
let runSprite; // 儲存角色 1 的跑步動畫精靈圖。
let blinkSprite; // 儲存角色一的眨眼動畫精靈圖。
let correctSprite; // 儲存角色一答對時的動畫精靈圖。
let wrongSprite; // 儲存角色一答錯時的動畫精靈圖。
let characterX; // 儲存角色 1 目前的水平位置。
let facingDirection = 1; // 記錄角色 1 朝向，1 代表右方，-1 代表左方。
let quizActive = false; // 記錄選擇題是否正在顯示。
let questionAsked = false; // 記錄角色 1 是否已在本次接近時觸發過題目。
let answerResult = null; // 儲存角色一目前的反應，null 代表尚未作答。
const idleFrameCount = 5; // 設定角色 1 站立精靈圖實際可見的完整影格數。
const runFrameCount = 9; // 設定角色 1 跑步精靈圖的影格數。
const blinkFrameCount = 18; // 設定角色一眨眼精靈圖的影格數。
const answerFrameCount = 7; // 設定角色一答對與答錯精靈圖的影格數。
const movementSpeed = 240; // 設定角色 1 每秒移動的像素數。
const interactionDistance = 150; // 設定角色 1 靠近或離開角色一的互動距離。
const answerOptions = ['A. 6', 'B. 8', 'C. 9']; // 設定選擇題的三個答案選項。
const correctOptionIndex = 1; // 設定第二個選項為正確答案。

function preload() { // 在畫布建立前載入背景與全部角色精靈圖。
  backgroundImage = loadImage('bg/bg1.png'); // 載入背景圖片。
  idleSprite = loadImage('1/stop/stop合併.png'); // 載入角色 1 站立動畫精靈圖。
  runSprite = loadImage('1/run/run合併.png'); // 載入角色 1 跑步動畫精靈圖。
  blinkSprite = loadImage('一/眨眼/眨眼合併.png'); // 載入角色一眨眼動畫精靈圖。
  correctSprite = loadImage('一/答對/答對合併.png'); // 載入角色一答對動畫精靈圖。
  wrongSprite = loadImage('一/答錯/答錯合併.png'); // 載入角色一答錯動畫精靈圖。
} // 結束精靈圖載入函式。

function setup() { // 設定全螢幕畫布與角色起始位置。
  createCanvas(windowWidth, windowHeight); // 建立符合目前視窗大小的畫布。
  imageMode(CENTER); // 讓精靈影格以指定位置為中心繪製。
  frameRate(60); // 將畫面更新頻率設定為每秒 60 張。
  characterX = width * 2 / 3; // 將角色 1 放在畫布由左算起三分之二的位置。
} // 結束畫布初始化函式。

function draw() { // 每一畫格更新背景、角色位置、動畫與題目。
  image(backgroundImage, width / 2, height / 2, width, height); // 將背景圖片拉伸至完整填滿畫布。
  let movement = 0; // 預設角色 1 本畫格不移動。
  if (!quizActive && keyIsDown(LEFT_ARROW)) movement = -1; // 未作答且按住左方向鍵時設定向左移動。
  if (!quizActive && keyIsDown(RIGHT_ARROW)) movement = 1; // 未作答且按住右方向鍵時設定向右移動。
  const isRunning = movement !== 0; // 根據移動方向判斷角色 1 是否播放跑步動畫。
  const roleOneSprite = isRunning ? runSprite : idleSprite; // 移動時使用跑步精靈，否則使用站立精靈。
  const roleOneFrameCount = isRunning ? runFrameCount : idleFrameCount; // 依目前動作選擇角色 1 的影格數。
  const roleOneFrameWidth = roleOneSprite.width / roleOneFrameCount; // 計算角色 1 每個影格的原始寬度。
  const roleOneFrameHeight = roleOneSprite.height; // 取得角色 1 精靈圖的原始高度。
  const roleOneScale = min(4, (height * 0.9) / roleOneFrameHeight); // 將角色 1 放大並限制在畫布高度範圍內。
  const roleOneWidth = roleOneFrameWidth * roleOneScale; // 計算角色 1 目前影格的顯示寬度。
  const roleOneHeight = roleOneFrameHeight * roleOneScale; // 計算角色 1 目前影格的顯示高度。
  characterX += movement * movementSpeed * (deltaTime / 1000); // 依方向與經過時間更新角色 1 的水平位置。
  characterX = constrain(characterX, roleOneWidth / 2, width - roleOneWidth / 2); // 限制角色 1 不超出畫布左右邊界。
  if (isRunning) facingDirection = movement; // 跑步時依移動方向更新角色 1 朝向。
  const distanceToCharacterOne = abs(characterX - width / 3); // 計算角色 1 與角色一的水平距離。
  if (distanceToCharacterOne <= interactionDistance && !questionAsked) { // 角色 1 首次進入互動距離時觸發題目。
    quizActive = true; // 顯示選擇題並暫停角色 1 移動。
    questionAsked = true; // 標記本次接近已觸發題目，避免重複彈出。
    answerResult = null; // 清除上一次的作答動畫結果。
  } // 結束接近角色一的題目觸發判斷。
  if (distanceToCharacterOne > interactionDistance) { // 角色 1 離開互動距離時重置本次互動。
    quizActive = false; // 確保選擇題已關閉。
    questionAsked = false; // 允許下次接近角色一時再次觸發題目。
    answerResult = null; // 讓角色一恢復眨眼動畫。
  } // 結束離開角色一的互動重置判斷。
  const animationSpeed = isRunning ? 90 : 140; // 設定角色 1 跑步較快、站立較慢的影格間隔。
  const roleOneFrameIndex = floor(millis() / animationSpeed) % roleOneFrameCount; // 循環選取角色 1 目前的動畫影格。
  drawSpriteFrame(roleOneSprite, roleOneFrameIndex, roleOneFrameWidth, roleOneFrameHeight, characterX, height - 12, roleOneScale, facingDirection); // 在畫布底部繪製角色 1 的目前影格。
  const characterOneSprite = answerResult === 'correct' ? correctSprite : answerResult === 'wrong' ? wrongSprite : blinkSprite; // 依答題結果選擇角色一的動畫。
  const characterOneFrameCount = answerResult === null ? blinkFrameCount : answerFrameCount; // 依角色一目前動畫選擇影格數。
  const characterOneFrameWidth = characterOneSprite.width / characterOneFrameCount; // 計算角色一每個影格的原始寬度。
  const characterOneFrameIndex = floor(millis() / 120) % characterOneFrameCount; // 循環播放角色一目前動畫的所有影格。
  drawSpriteFrame(characterOneSprite, characterOneFrameIndex, characterOneFrameWidth, characterOneSprite.height, width / 3, height - 12, 2, 1); // 將角色一放大兩倍並放在畫布三分之一位置。
  if (quizActive) drawQuestionPanel(); // 題目有效時在角色前方繪製選擇題方框。
} // 結束每畫格更新函式。

function drawSpriteFrame(sprite, frameIndex, frameWidth, frameHeight, positionX, bottomY, displayScale, direction) { // 繪製精靈圖中的單一影格。
  const displayWidth = frameWidth * displayScale; // 計算目前影格縮放後的寬度。
  const displayHeight = frameHeight * displayScale; // 計算目前影格縮放後的高度。
  const sourceX = frameIndex * frameWidth; // 計算目前影格在精靈圖中的水平起點。
  push(); // 暫存畫布狀態以隔離角色的翻轉設定。
  translate(positionX, bottomY - displayHeight / 2); // 將繪圖原點移至角色水平位置與底部基準線。
  scale(direction, 1); // 依角色朝向決定是否水平翻轉精靈圖。
  image(sprite, 0, 0, displayWidth, displayHeight, sourceX, 0, frameWidth, frameHeight); // 擷取並繪製精靈圖中的指定影格。
  pop(); // 還原畫布狀態以免影響其他圖像。
} // 結束單一精靈影格繪製函式。

function drawQuestionPanel() { // 繪製黃色半透明選擇題與答案按鈕。
  const panelWidth = width / 4; // 將題目方框寬度設定為視窗寬度的四分之一。
  const panelHeight = height / 4; // 將題目方框高度設定為視窗高度的四分之一。
  const panelX = width / 2; // 將題目方框水平置中。
  const panelY = height / 4; // 將題目方框置於畫面上方四分之一處。
  const buttonWidth = panelWidth * 0.27; // 設定每個答案按鈕的寬度。
  const buttonHeight = min(54, panelHeight * 0.24); // 依方框高度限制答案按鈕高度。
  const buttonGap = panelWidth * 0.035; // 設定答案按鈕之間的間距。
  const buttonY = panelY + panelHeight * 0.28; // 將答案按鈕排列在問題文字下方。
  rectMode(CENTER); // 設定方框以中心座標繪製。
  noStroke(); // 移除題目方框與答案按鈕的外框。
  fill(255, 230, 0, 204); // 設定黃色填色並使用約 80% 的透明度。
  rect(panelX, panelY, panelWidth, panelHeight, 12); // 繪製視窗四分之一大小的半透明黃色方框。
  fill(35); // 設定問題文字為深色以提高對比。
  textAlign(CENTER, CENTER); // 將問題文字置中對齊。
  textSize(min(30, panelWidth * 0.09)); // 依方框寬度調整問題文字大小。
  text('想一想：5 + 3 = ?', panelX, panelY - panelHeight * 0.18); // 顯示加法選擇題內容。
  textSize(min(22, panelWidth * 0.065)); // 依方框寬度調整答案按鈕文字大小。
  for (let optionIndex = 0; optionIndex < answerOptions.length; optionIndex += 1) { // 逐一繪製三個答案選項。
    const buttonX = panelX + (optionIndex - 1) * (buttonWidth + buttonGap); // 計算每個答案按鈕的水平座標。
    fill(255, 255, 255, 230); // 設定答案按鈕為半透明白色。
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 8); // 繪製目前的答案按鈕。
    fill(35); // 設定答案文字為深色。
    text(answerOptions[optionIndex], buttonX, buttonY); // 顯示目前答案的選項文字。
  } // 結束答案按鈕繪製迴圈。
  rectMode(CORNER); // 還原一般方框繪製模式。
} // 結束選擇題方框繪製函式。

function submitAnswer(selectedIndex) { // 判斷作答選項並切換角色一的答題動畫。
  if (!quizActive) return; // 題目未顯示時不接受作答。
  answerResult = selectedIndex === correctOptionIndex ? 'correct' : 'wrong'; // 依答案是否正確設定角色一的反應動畫。
  quizActive = false; // 作答後立即關閉題目方框。
} // 結束選擇題作答處理函式。

function mousePressed() { // 處理滑鼠點擊答案選項。
  if (!quizActive) return; // 題目未顯示時忽略滑鼠點擊。
  const panelWidth = width / 4; // 取得題目方框寬度以計算答案按鈕位置。
  const panelHeight = height / 4; // 取得題目方框高度以計算答案按鈕位置。
  const panelX = width / 2; // 取得題目方框水平中心位置。
  const panelY = height / 4; // 取得題目方框垂直中心位置。
  const buttonWidth = panelWidth * 0.27; // 取得答案按鈕寬度。
  const buttonHeight = min(54, panelHeight * 0.24); // 取得答案按鈕高度。
  const buttonGap = panelWidth * 0.035; // 取得答案按鈕間距。
  const buttonY = panelY + panelHeight * 0.28; // 取得答案按鈕垂直中心位置。
  for (let optionIndex = 0; optionIndex < answerOptions.length; optionIndex += 1) { // 逐一檢查滑鼠是否點中答案按鈕。
    const buttonX = panelX + (optionIndex - 1) * (buttonWidth + buttonGap); // 計算目前答案按鈕的水平中心位置。
    const clickedButton = abs(mouseX - buttonX) <= buttonWidth / 2 && abs(mouseY - buttonY) <= buttonHeight / 2; // 判斷滑鼠座標是否落在目前按鈕內。
    if (clickedButton) submitAnswer(optionIndex); // 點中答案按鈕時提交作答選項。
  } // 結束答案按鈕點擊判斷迴圈。
} // 結束滑鼠點擊處理函式。

function keyPressed() { // 處理方向鍵、數字鍵與方向鍵預設行為。
  if (quizActive && key >= '1' && key <= '3') submitAnswer(Number(key) - 1); // 題目顯示時按 1、2、3 也可選擇答案。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) return false; // 攔截左右方向鍵的瀏覽器預設行為。
} // 結束鍵盤按下處理函式。

function windowResized() { // 視窗尺寸改變時同步調整畫布與角色位置。
  resizeCanvas(windowWidth, windowHeight); // 將畫布重新調整為全螢幕大小。
  characterX = constrain(characterX, 1, width - 1); // 調整角色 1 的位置以避免視窗縮小後超出邊界。
} // 結束視窗尺寸變更處理函式。
