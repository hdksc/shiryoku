const statusEl =
  document.getElementById(
    "status"
  );

const startBtn =
  document.getElementById(
    "startBtn"
  );

const answerPad =
  document.getElementById(
    "answerPad"
  );

const footer =
  document.getElementById(
    "footer"
  );

const answerButtons =
  document.querySelectorAll(
    "#answerPad button"
  );

/* =========================
   検査設定
========================= */

const PASS_COUNT = 1;

const FAIL_COUNT = 2;

/* =========================
   目
========================= */

const eyes = [
  "左目",
  "右目"
];

let eyeIndex = 0;

let rowIndex = 0;

let currentQuestion = null;

let success = 0;

let fail = 0;

/* =========================
   入力ロック
========================= */

let inputLocked = false;

/* =========================
   同じ場所連続防止
========================= */

let lastTargetIndex = -1;

const results = {

  "左目":null,

  "右目":null
};

/* =========================
   段開始
========================= */

function startStage(){

  success = 0;

  fail = 0;

  inputLocked = false;

  lastTargetIndex = -1;

  statusEl.style.fontSize =
    "12px";

  statusEl.style.fontWeight =
    "normal";

  statusEl.innerHTML =
    `
    ${eyes[eyeIndex]}
    ${rows[rowIndex].label}
    正:${success}/${PASS_COUNT}
    誤:${fail}/${FAIL_COUNT}
    `;

  askQuestion();
}

/* =========================
   出題
========================= */

function askQuestion(){

  komyakus.forEach(k=>{

    k.highlight.setAttribute(
      "visibility",
      "hidden"
    );
  });

  let targetIndex;

  while(true){

    const col =
      Math.floor(
        Math.random()
        * cols
      );

    targetIndex =
      rowIndex * cols + col;

    /*
      同じ場所連続禁止
    */

    if(
      targetIndex
      !== lastTargetIndex
    ){
      break;
    }
  }

  lastTargetIndex =
    targetIndex;

  const target =
    komyakus[targetIndex];

  currentQuestion =
    target;

  target.highlight.setAttribute(
    "visibility",
    "visible"
  );

  hop(target);

  /*
    次の入力許可
  */

  inputLocked = false;
}

/* =========================
   回答
========================= */

answerButtons.forEach(btn=>{

  btn.addEventListener(
    "click",
    ()=>{

      if(
        !currentQuestion
        || inputLocked
      ){
        return;
      }

      const exp =
        currentQuestion.exp;

      const correct =
        getDirName(
          exp.dirX,
          exp.dirY
        );

      const answer =
        btn.dataset.dir;

      /*
        入力ロック
      */

      inputLocked = true;

      if(answer === correct){

        success++;

      }else{

        fail++;
      }

      /* =========================
         合格
      ========================= */

      if(success >= PASS_COUNT){

        rowIndex++;

        if(
          rowIndex
          >= rows.length
        ){

          finishEye(
            rows[
              rows.length - 1
            ].label
          );

          return;
        }

        startStage();

        return;
      }

      /* =========================
         不合格
      ========================= */

      if(fail >= FAIL_COUNT){

        const result =

          rowIndex <= 0

          ? "0.0"

          : rows[
              rowIndex - 1
            ].label;

        finishEye(result);

        return;
      }

      /* 続行 */

      statusEl.innerHTML =
        `
        ${eyes[eyeIndex]}
        ${rows[rowIndex].label}
        正:${success}/${PASS_COUNT}
        誤:${fail}/${FAIL_COUNT}
        `;

      askQuestion();

    }
  );

});

/* =========================
   段終了
========================= */

function finishEye(result){

  const eye =
    eyes[eyeIndex];

  results[eye] =
    result;

  komyakus.forEach(k=>{

    k.highlight.setAttribute(
      "visibility",
      "hidden"
    );
  });

  eyeIndex++;

  /* =========================
     両目終了
  ========================= */

  if(eyeIndex >= eyes.length){

    statusEl.style.fontSize =
      "24px";

    statusEl.style.fontWeight =
      "bold";

    statusEl.innerHTML =
      `
      左:${results["左目"]}
      右:${results["右目"]}
      でした！
      `;

    answerPad.style.display =
      "none";

    footer.style.display =
      "block";

    startBtn.style.display =
      "inline-block";

    return;
  }

  /* =========================
     右目へ
  ========================= */

  statusEl.style.fontSize =
    "12px";

  statusEl.style.fontWeight =
    "normal";

  statusEl.innerHTML =
    `
    左:${result}
    次は右目です
    `;

  setTimeout(()=>{

    rowIndex = 0;

    success = 0;

    fail = 0;

    startStage();

  }, 3000);
}

/* =========================
   方向変換
========================= */

function getDirName(x, y){

  if(x === 1 && y === 0)
    return "right";

  if(x === 1 && y === -1)
    return "upright";

  if(x === 0 && y === -1)
    return "up";

  if(x === -1 && y === -1)
    return "upleft";

  if(x === -1 && y === 0)
    return "left";

  if(x === -1 && y === 1)
    return "downleft";

  if(x === 0 && y === 1)
    return "down";

  if(x === 1 && y === 1)
    return "downright";
}

/* =========================
   開始
========================= */

startBtn.addEventListener(
  "click",
  ()=>{

    alert(
`【こみゃく視力検査】

・スマホを腕を伸ばして
  30cmほど離してください

・赤枠の
  こみゃくの向きを答える

・${PASS_COUNT}回正解で次へ

・${FAIL_COUNT}回間違えると
  その一つ前の視力で確定

まずは左目です。
右目を隠してください。`
    );

    /*
      レイアウト安定化
    */

    statusEl.style.fontSize =
      "12px";

    statusEl.style.fontWeight =
      "normal";

    statusEl.innerHTML =
      `
      左目 0.1
      正:0/${PASS_COUNT}
      誤:0/${FAIL_COUNT}
      `;

    startBtn.style.display =
      "none";

    footer.style.display =
      "none";

    answerPad.style.display =
      "grid";

    eyeIndex = 0;

    rowIndex = 0;

    success = 0;

    fail = 0;

    inputLocked = false;

    lastTargetIndex = -1;

    results["左目"] =
      null;

    results["右目"] =
      null;

    requestAnimationFrame(()=>{

      startStage();

    });

  }
);