let seaweeds = [];
let bubbles = [];
const seaweedColors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化 50 根水草
  for (let i = 0; i < 50; i++) {
    // 均衡分佈在視窗寬度內，加入一點亂數偏移
    let targetX = (width / 50) * i + random(-10, 10);
    
    // 隨機選取顏色並加上透明度 (150/255)
    let c = color(random(seaweedColors));
    c.setAlpha(180);

    seaweeds.push({
      baseX: targetX,
      h: random(height * 0.2, height * 0.66), // 不超過視窗 2/3
      w: random(30, 60),                      // 寬度 30 到 60
      color: c,
      freq: random(0.01, 0.03),               // 搖擺頻率
      phase: random(TWO_PI),                  // 初始相位（讓方向不一樣）
      swayDist: random(40, 80)                // 搖擺距離
    });
  }

  // 初始化兩個十元硬幣大小的泡泡
  for (let i = 0; i < 2; i++) {
    bubbles.push(new Bubble(i));
  }
}

function draw() {
  drawOceanGradient();
  
  // 設定混合模式
  blendMode(BLEND);

  // 繪製水草
  for (let s of seaweeds) {
    drawSeaweed(s);
  }

  // 繪製泡泡
  for (let b of bubbles) {
    b.update();
    b.display();
  }
}

function drawOceanGradient() {
  noFill();
  for (let y = 0; y <= height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color('#0077b6'), color('#001219'), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawSeaweed(s) {
  stroke(s.color);
  strokeWeight(s.w);
  strokeCap(ROUND);
  noFill();

  // 計算搖擺位移
  let sway = sin(frameCount * s.freq + s.phase) * s.swayDist;

  beginShape();
  // 使用 curveVertex 建立圓滑曲線
  // 第一個與最後一個點為控制點，不直接繪出
  curveVertex(s.baseX, height + 100); 
  curveVertex(s.baseX, height);                   // 底部固定
  curveVertex(s.baseX + sway * 0.3, height - s.h * 0.3); // 中下
  curveVertex(s.baseX + sway * 0.7, height - s.h * 0.7); // 中上
  curveVertex(s.baseX + sway, height - s.h);      // 頂端
  curveVertex(s.baseX + sway, height - s.h - 50); // 結束控制點
  endShape();
}

class Bubble {
  constructor(i) {
    this.i = i; // 用來區分兩個泡泡的水平位置
    this.reset();
  }

  reset() {
    // 將泡泡固定在畫面中間
    this.baseX = width / 2 + (this.i === 0 ? -110 : 110); // 加大間距避免重疊
    this.baseY = height / 2;
    this.size = 120; // 再次加大泡泡尺寸
    this.label = this.i === 0 ? "第一周作業" : "第二周作業";
    this.shakeSpeed = random(0.03, 0.06); // 抖動頻率
    this.shakeAmp = random(20, 40);       // 抖動幅度
  }

  update() {
    // 上下抖動效果
    this.y = this.baseY + sin(frameCount * this.shakeSpeed) * this.shakeAmp;
    // 左右微幅偏移，增加自然感
    this.x = this.baseX + cos(frameCount * this.shakeSpeed * 0.5) * 10;
  }

  display() {
    stroke(255, 100);
    strokeWeight(1.5);
    fill(255, 30);
    circle(this.x, this.y, this.size);
    // 泡泡高光
    noStroke();
    fill(255, 80);
    circle(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.2); // 高光隨比例縮放

    // 顯示文字
    fill(255);
    noStroke();
    textSize(20); // 隨泡泡尺寸放大字體
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新計算泡泡的基準位置，確保它們維持在中間
  for (let b of bubbles) {
    b.reset();
  }
}