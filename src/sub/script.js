const svg =
  document.getElementById("svg");

/* =========================
   SVG生成
========================= */

function el(name){

  return document.createElementNS(
    "http://www.w3.org/2000/svg",
    name
  );
}

/* =========================
   方向
========================= */

const dirs = [

  { x: 1,  y: 0  },
  { x: 1,  y:-1  },
  { x: 0,  y:-1  },
  { x:-1,  y:-1  },
  { x:-1,  y: 0  },
  { x:-1,  y: 1  },
  { x: 0,  y: 1  },
  { x: 1,  y: 1  }

];

/* =========================
   行設定
========================= */

const rows = [

  {
    label:"0.1",
    scale:2.6,
    rowHeight:150
  },

  {
    label:"0.2",
    scale:1.5,
    rowHeight:110
  },

  {
    label:"0.3",
    scale:1.0,
    rowHeight:85
  },

  {
    label:"0.4",
    scale:0.78,
    rowHeight:72
  },

  {
    label:"0.5",
    scale:0.62,
    rowHeight:62
  },

  {
    label:"0.6",
    scale:0.50,
    rowHeight:55
  },

  {
    label:"0.7",
    scale:0.42,
    rowHeight:50
  },

  {
    label:"0.8",
    scale:0.36,
    rowHeight:46
  },

  {
    label:"0.9",
    scale:0.31,
    rowHeight:42
  },

  {
    label:"1.0",
    scale:0.27,
    rowHeight:38
  },

  {
    label:"1.2",
    scale:0.23,
    rowHeight:36
  },

  {
    label:"1.5",
    scale:0.19,
    rowHeight:34
  },

  {
    label:"2.0",
    scale:0.15,
    rowHeight:32
  },

  {
    label:"3.0",
    scale:0.12,
    rowHeight:32
  },

  {
    label:"4.0",
    scale:0.09,
    rowHeight:32
  },

  {
    label:"5.0",
    scale:0.075,
    rowHeight:32
  },

  {
    label:"6.0",
    scale:0.062,
    rowHeight:32
  },

  {
    label:"7.0",
    scale:0.052,
    rowHeight:32
  },

  {
    label:"8.0",
    scale:0.044,
    rowHeight:32
  }

];

/* =========================
   テーブル位置
========================= */

const tableLeft = 320;

const tableRight = 1120;

const cols = 5;

const colWidth =
  (tableRight - tableLeft)
  / (cols - 1);

let currentY = 240;

/* =========================
   全こみゃく
========================= */

const komyakus = [];

/* =========================
   こみゃく生成
========================= */

function createKomyaku(
  x,
  y,
  scale,
  dirX,
  dirY
){

  const group = el("g");

  const exp = {

    dirX,
    dirY,

    blink:0,

    eyeX:0,

    eyeY:0,

    jump:0
  };

  const baseX = 30;

  const baseY = 30;

  const outer = 20;

  const middle = outer / 2;

  const pupil = outer / 5;

  /* 黒 */

  const outerCircle = el("circle");

  outerCircle.setAttribute(
    "cx",
    baseX
  );

  outerCircle.setAttribute(
    "cy",
    baseY
  );

  outerCircle.setAttribute(
    "r",
    outer
  );

  outerCircle.setAttribute(
    "fill",
    "#000"
  );

  group.appendChild(
    outerCircle
  );

  /* 白目 */

  const eyeGroup = el("g");

  const white = el("circle");

  white.setAttribute(
    "cx",
    0
  );

  white.setAttribute(
    "cy",
    0
  );

  white.setAttribute(
    "r",
    middle
  );

  white.setAttribute(
    "fill",
    "#fff"
  );

  eyeGroup.appendChild(
    white
  );

  /* 青目 */

  const blue = el("circle");

  blue.setAttribute(
    "r",
    pupil
  );

  blue.setAttribute(
    "fill",
    "#3d6fb6"
  );

  eyeGroup.appendChild(
    blue
  );

  group.appendChild(
    eyeGroup
  );

  /* 赤枠 */

  const highlight = el("rect");

  highlight.setAttribute(
    "x",
    -6
  );

  highlight.setAttribute(
    "y",
    -6
  );

  highlight.setAttribute(
    "width",
    72
  );

  highlight.setAttribute(
    "height",
    72
  );

  highlight.setAttribute(
    "rx",
    8
  );

  highlight.setAttribute(
    "fill",
    "none"
  );

  highlight.setAttribute(
    "stroke",
    "#ff3030"
  );

  highlight.setAttribute(
    "stroke-width",
    4
  );

  highlight.setAttribute(
    "visibility",
    "hidden"
  );

  group.appendChild(
    highlight
  );

  svg.appendChild(group);

  const k = {

    group,

    eyeGroup,

    blue,

    highlight,

    exp,

    scale,

    x,

    y
  };

  komyakus.push(k);

  redraw(k);

  return k;
}

/* =========================
   再描画
========================= */

function redraw(k){

  const exp = k.exp;

  const offset =
    30 * k.scale;

  k.group.setAttribute(
    "transform",
    `
    translate(
      ${k.x - offset},
      ${k.y - offset - exp.jump}
    )
    scale(${k.scale})
    `
  );

  const outer = 20;

  const eyeOffsetX =
    exp.dirX * outer / 3;

  const eyeOffsetY =
    exp.dirY * outer / 3;

  k.eyeGroup.setAttribute(
    "transform",
    `
    translate(
      ${30 + eyeOffsetX},
      ${30 + eyeOffsetY}
    )
    scale(
      1,
      ${1 - exp.blink}
    )
    `
  );

  const middle =
    outer / 2;

  k.blue.setAttribute(
    "cx",
    exp.dirX * middle / 3
    + exp.eyeX
  );

  k.blue.setAttribute(
    "cy",
    exp.dirY * middle / 3
    + exp.eyeY
  );
}

/* =========================
   アニメ
========================= */

function blink(k){

  let t = 0;

  const id = setInterval(()=>{

    k.exp.blink =
      Math.sin(
        Math.PI * t
      );

    redraw(k);

    t += 0.2;

    if(t >= 1){

      k.exp.blink = 0;

      redraw(k);

      clearInterval(id);
    }

  }, 40);
}

function lookAround(k){

  const seq = [

    [-2,0],

    [2,0],

    [0,2],

    [0,-2],

    [0,0]
  ];

  let i = 0;

  const id = setInterval(()=>{

    k.exp.eyeX =
      seq[i][0];

    k.exp.eyeY =
      seq[i][1];

    redraw(k);

    i++;

    if(i >= seq.length){

      clearInterval(id);
    }

  }, 500);
}

function hop(k){

  let t = 0;

  const id = setInterval(()=>{

    k.exp.jump =
      Math.sin(
        Math.PI * t
      ) * 10;

    redraw(k);

    t += 0.15;

    if(t >= 1){

      k.exp.jump = 0;

      redraw(k);

      clearInterval(id);
    }

  }, 30);
}

function startIdle(k){

  const initialDelay =
    500 + Math.random() * 3000;

  setTimeout(()=>{

    setInterval(()=>{

      const r = Math.random();

      if(r < 0.05){

        blink(k);

      }else if(r < 0.25){

        lookAround(k);

      }else if(r < 0.45){

        hop(k);
      }

    }, 2000 + Math.random() * 4000);

  }, initialDelay);
}

/* =========================
   描画
========================= */

rows.forEach((row)=>{

  const centerY =
    currentY;

  const label = el("text");

  label.setAttribute(
    "x",
    60
  );

  label.setAttribute(
    "y",
    centerY + 12
  );

  label.setAttribute(
    "class",
    "label"
  );

  label.textContent =
    row.label;

  svg.appendChild(label);

  for(
    let col=0;
    col<cols;
    col++
  ){

    const centerX =
      tableLeft
      + col * colWidth;

    const dir =
      dirs[
        Math.floor(
          Math.random()
          * dirs.length
        )
      ];

    const k =
      createKomyaku(
        centerX,
        centerY,
        row.scale,
        dir.x,
        dir.y
      );

    startIdle(k);
  }

  currentY +=
    row.rowHeight;
});

/* =========================
   exam.js用公開
========================= */

window.komyakus =
  komyakus;

window.rows =
  rows;

window.cols =
  cols;

window.hop =
  hop;
  