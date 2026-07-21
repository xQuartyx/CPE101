let options = ["พิซซ่า", "ส้มตำ", "ซูชิ", "ข้าวมันไก่", "ก๋วยเตี๋ยว", "หมูกระทะ"];
let angle = 0;
let spinning = false;

const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#e67e22"];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("result");
const optInput = document.getElementById("optInput");
const addBtn = document.getElementById("addBtn");
const optList = document.getElementById("optList");
const clearBtn = document.getElementById("clearBtn");

function drawWheel() {
  const size = canvas.width;
  const center = size / 2;
  ctx.clearRect(0, 0, size, size);

  if (options.length === 0) {
    ctx.fillStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#888";
    ctx.font = "28px Tahoma";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ยังไม่มีตัวเลือก", center, center);
    return;
  }

  const segAngle = (Math.PI * 2) / options.length;

  for (let i = 0; i < options.length; i++) {
    const start = angle + i * segAngle;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center, start, start + segAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + segAngle / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 26px Tahoma";
    let label = options[i];
    if (label.length > 12) {
      label = label.slice(0, 11) + "…";
    }
    ctx.fillText(label, center - 25, 0);
    ctx.restore();
  }
}

function spin() {
  if (spinning || options.length < 2) return;

  spinning = true;
  spinBtn.disabled = true;
  resultText.textContent = "";

  const duration = 4000 + Math.random() * 1000;          // เวลาหมุน 4-5 วินาที
  const targetAngle = angle + (Math.PI * 2 * 6) + (Math.random() * Math.PI * 2); // หมุนอย่างน้อย 6 รอบ
  const startAngle = angle;
  const startTime = performance.now();

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animate(now) {
    const t = Math.min((now - startTime) / duration, 1);
    angle = startAngle + (targetAngle - startAngle) * easeOut(t);
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      spinBtn.disabled = false;
      showResult();
    }
  }

  requestAnimationFrame(animate);
}

function showResult() {
  const segAngle = (Math.PI * 2) / options.length;

  let pointerAngle = (1.5 * Math.PI - angle) % (Math.PI * 2);
  pointerAngle = (pointerAngle + Math.PI * 2) % (Math.PI * 2);

  const winnerIndex = Math.floor(pointerAngle / segAngle) % options.length;
  resultText.textContent = "ผลลัพธ์: " + options[winnerIndex];
}
function renderList() {
  optList.innerHTML = "";

  options.forEach(function (opt, i) {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = opt;

    const delBtn = document.createElement("button");
    delBtn.textContent = "ลบ";
    delBtn.addEventListener("click", function () {
      options.splice(i, 1); // ลบตัวเลือกออกจาก array
      renderList();
    });

    li.appendChild(text);
    li.appendChild(delBtn);
    optList.appendChild(li);
  });

  spinBtn.disabled = options.length < 2; // ต้องมีอย่างน้อย 2 ตัวเลือกถึงจะหมุนได้
  drawWheel();
}

function addOption() {
  const value = optInput.value.trim();
  if (value === "") return;

  options.push(value);
  optInput.value = "";
  optInput.focus();
  renderList();
}

spinBtn.addEventListener("click", spin);
addBtn.addEventListener("click", addOption);

optInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addOption();
});

clearBtn.addEventListener("click", function () {
  if (!spinning) {
    options = [];
    resultText.textContent = "";
    renderList();
  }
});

renderList();
