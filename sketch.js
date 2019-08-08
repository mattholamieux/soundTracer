// tracer

let spr;
let scl = 50;
let lines;
let trigs;
let ticks;
let sounds = [];
let synths = [];
let notes = ["A2", "B2", "C2", "D2", "E2", "G2", "A3", "B3", "C3", "D3", "E3", "G3"];
let open = true;
let glow = 0;
let grow = 1;

function setup() {
  frameRate(64);
  createCanvas(800, 600);
  spr = createSprite((8 * scl - scl / 2), (6 * scl - scl / 2), scl / 1.5, scl / 1.5);
  spr.shapeColor = color(100, 200, 250, 90);
  lines = new Group();
  trigs = new Group();
  ticks = new Group();
  for (i = 0; i < 17; i++) {
    let l = createSprite(i * scl, height / 2, 1, height);
    let w = createSprite(width / 2, i * scl, width, 1);
    l.shapeColor = color(255, 90);
    w.shapeColor = color(255, 90);
    lines.add(l);
    lines.add(w);
  }
  reverb = new p5.Reverb();
  for (i = 0; i < lines.length; i++) {
    synths[i] = new p5.MonoSynth();
    reverb.process(synths[i], 3, 2);
  }
}

function draw() {
  background(0);
  touchStarted();
  drawSprites();
  if (open) {
    openScreen();
  } else {
    // drawSprites();
    nav();
    sproutTrigs();
    sproutTicks();
    tick();
    trigs.overlap(ticks, playSound);
    removeTrigs();
    removeTicks();
    shift();
    if (keyWentDown(32)) {
      open = true;
    }
  }
}

function sproutTrigs() {
  if (keyWentDown('x')) {
    let trig = createSprite(spr.position.x, spr.position.y, scl / 1.5, scl / 1.5);
    trig.shapeColor = color(255, 90);
    trigs.add(trig);
  }
}

function removeTrigs() {
  if (keyWentDown('z')) {
    for (i = 0; i < trigs.length; i++) {
      if (spr.overlap(trigs[i])) {
        trigs[i].remove();
      }
    }
  }
}

function playSound(a, b) {
  if (frameCount % 8 == 0) {
    for (i = 1; i < lines.length; i++) {
      if (a.position.y == i * scl - scl / 2) {
        synths[i].play(notes[i - 1], 0.5, 0, 1 / 8);
        b.shapeColor = color(random(255), random(255), random(255));
      }
    }
  }
}

function sproutTicks() {
  if (keyWentDown('c')) {
    let tick = createSprite(spr.position.x, spr.position.y, scl/1.2, scl/1.2);
    tick.shapeColor = color(200, 60);
    tick.setCollider("rectangle", 0, 0, 5, 5)
    ticks.add(tick);
  }
}

function tick() {
  if (frameCount % 8 == 0) {
    for (i = 0; i < ticks.length; i++) {
      ticks[i].position.x += scl;
      if (ticks[i].position.x > width) {
        ticks[i].position.x = scl / 2;
      }
      ticks[i].shapeColor = color(255, 60);
    }
  }
}

function removeTicks() {
  if (keyIsDown(86)) {
    for (i = 0; i < ticks.length; i++) {
      if (spr.overlap(ticks[i])) {
        ticks[i].remove();
      }
    }
  }
}


function shift() {
  if (keyWentDown('d')) {
    for (i = 0; i < ticks.length; i++) {
      ticks[i].position.y += scl;
      if (ticks[i].position.y > height) {
        ticks[i].position.y = scl / 2;
      }
    }
  } else if (keyWentDown('s')) {
    for (i = 0; i < ticks.length; i++) {
      ticks[i].position.y -= scl;
      if (ticks[i].position.y < 0) {
        ticks[i].position.y = height - scl / 2;
      }
    }
  }
}

function nav() {
  if (keyWentDown(LEFT_ARROW)) {
    spr.position.x -= scl;
  } else if (keyWentDown(RIGHT_ARROW)) {
    spr.position.x += scl;
  } else if (keyWentDown(UP_ARROW)) {
    spr.position.y -= scl;
  } else if (keyWentDown(DOWN_ARROW)) {
    spr.position.y += scl;
  }
  spr.position.x = constrain(spr.position.x, 0+scl/2, width -scl/2);
spr.position.y = constrain(spr.position.y, 0+scl/2, height - scl/2);
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function openScreen() {
  let f = 100;
  let directions = ['soundTracer', 'x places trig', 'z removes trig', 'c starts tick', 'v removes tick', 's shifts all trigs up', 'd shifts all trigs down', 'arrows navigate','space pauses', 'click anywhere to begin'];
  textSize(18);
  textLeading(scl);
  textFont('serif');
  for (i = 0; i < directions.length; i++) {
    fill(f);
    text(directions[i], scl+scl/10, scl * [i] + scl/1.1);
    f += 15;
  }
  fill(color(100, 200, 150, glow));
  rect((8 * scl - scl+2), (6 * scl - scl+2), scl/1.1, scl/1.1);
  glow+=grow;
  if (glow>100 || glow<0){
    grow *= -1;
  }
  if (mouseIsPressed || keyWentDown(32)) {
    open = false;
  }
}
