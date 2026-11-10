let table
let images = []

// platform info (same order as the CSV)
let platformNames = ['Prime Video', 'Netflix', 'Hulu', 'Peacock']
let platformR = [0, 229, 28, 0]
let platformG = [168, 9, 231, 114]
let platformB = [204, 20, 131, 206]

// which screen we are on
let screen = 'home'
let previousScreen = 'home'
let selectedPlatform = 0

// score
let score = 0
let totalGuessed = 0

// the player's guesses
let ratingGuess = []
let rewatchGuess = []
let submitted = []

// where each of the 4 movies goes 
let posX = [100, 540, 100, 540]
let posY = [120, 120, 420, 420]

async function setup() {
  createCanvas(1000, 750)

   table = await loadTable('js/movieData.csv', ',', 'header')
  // huluTable = await loadTable('js/hulumovies.csv', ',', 'header')

  for (let i = 0; i < table.getRowCount(); i++) {
    images[i] = await loadImage('images/' + table.getString(i, 'image'))

    ratingGuess[i] = 0
    rewatchGuess[i] = ''
    submitted[i] = false
  }
}


function draw() {
  background(25, 30, 42)
  textAlign(CENTER, CENTER)

  // wait until the CSV is loaded
  if (table == undefined) {
    return
  }

  if (screen == 'home') {
    homeScreen()
  } else if (screen == 'platform') {
    platformScreen()
  } else if (screen == 'summary') {
    summaryScreen()
  } else if (screen == 'description') {
    descriptionScreen()
  }

  // pink description button (not shown on the description screen)
  if (screen != 'description') {
    noStroke()
    fill(255, 20, 147)
    rect(790, 20, 185, 45, 10)
    fill(255)
    textSize(16)
    text('My Description', 882, 42)
  }
}

// ---------- HOME SCREEN ----------
function homeScreen() {
  fill(255)
  textSize(32)
  text('Which Streaming Platform Knows Me Best?', width / 2, 80)

  textSize(16)
  fill(180, 190, 210)
  text('Choose a streaming platform and guess my movie taste!', width / 2, 125)

  // draw the 4 platform circles
  for (let i = 0; i < 4; i++) {
    let x = 250 + (i % 2) * 300
    let y = 280 + floor(i / 2) * 190

    fill(platformR[i], platformG[i], platformB[i])
    ellipse(x, y, 140, 140)

    fill(255)
    textSize(20)
    text(platformNames[i], x, y)
  }

  drawButton(390, 650, 220, 45, 'Finish & View Results')
}

// ---------- PLATFORM SCREEN ----------
function platformScreen() {
  fill(255)
  textSize(25)
  text(platformNames[selectedPlatform] + ' - Guess My Movie Taste!', width / 2, 35)

  textSize(15)
  fill(180, 190, 210)
  text('Score: ' + score + ' / ' + totalGuessed, width / 2, 70)

  for (let i = 0; i < 4; i++) {
    let x = posX[i]
    let y = posY[i]
    let index = selectedPlatform * 4 + i // which row of the CSV

    // poster
    image(images[index], x, y, 120, 170)

    // title and genre
    fill(255)
    textSize(17)
    text(table.getString(index, 'title'), x + 245, y + 15, 220)

    textSize(13)
    fill(180, 190, 210)
    text(table.getString(index, 'genre'), x + 245, y + 48)

    // rating question + buttons 1-10
    fill(255)
    textSize(14)
    text('Guess my rating (1-10)', x + 245, y + 80)

    for (let r = 1; r <= 10; r++) {
      let bx = x + 125 + (r - 1) * 23
      let by = y + 105

      if (ratingGuess[index] == r) {
        fill(255, 20, 147)
      } else {
        fill(65, 75, 95)
      }
      rect(bx, by, 21, 27, 4)

      fill(255)
      textSize(11)
      text(r, bx + 10.5, by + 13.5)
    }

    // rewatch question + YES / NO buttons
    fill(255)
    textSize(14)
    text('Would I rewatch it?', x + 245, y + 165)

    if (rewatchGuess[index] == 'YES') {
      fill(28, 190, 110)
    } else {
      fill(65, 75, 95)
    }
    rect(x + 155, y + 185, 75, 30, 6)

    if (rewatchGuess[index] == 'NO') {
      fill(229, 60, 70)
    } else {
      fill(65, 75, 95)
    }
    rect(x + 240, y + 185, 75, 30, 6)

    fill(255)
    textSize(13)
    text('YES', x + 192, y + 200)
    text('NO', x + 277, y + 200)

    // show the real answers once both guesses are made
    if (submitted[index] == true) {
      fill(28, 231, 131)
      textSize(13)
      text('Actual rating: ' + table.getString(index, 'rating') + '/10  |  Rewatch: ' + table.getString(index, 'rewatch'), x + 245, y + 245)
    }
  }

  drawButton(20, 20, 80, 40, 'Back')
}

// ---------- SUMMARY SCREEN ----------
function summaryScreen() {
  fill(255)
  textSize(30)
  text('Which Platform Knows Me Best?', width / 2, 75)

  textSize(18)
  text('Your Guessing Score: ' + score + ' / ' + totalGuessed, width / 2, 130)

  let bestAverage = 0
  let bestPlatform = ''

  for (let p = 0; p < 4; p++) {
    // add up the 4 ratings for this platform
    let total = 0
    for (let i = 0; i < 4; i++) {
      total = total + table.getNum(p * 4 + i, 'rating')
    }
    let average = total / 4

    if (average > bestAverage) {
      bestAverage = average
      bestPlatform = platformNames[p]
    }

    let y = 230 + p * 85

    fill(platformR[p], platformG[p], platformB[p])
    rect(240, y, average * 50, 35, 8)

    fill(255)
    textSize(16)
    text(platformNames[p] + ' - ' + average.toFixed(1) + '/10', 500, y + 50)
  }

  fill(28, 231, 131)
  textSize(21)
  text('My Favorite Platform: ' + bestPlatform, width / 2, 630)

  drawButton(390, 675, 220, 45, 'Back to Home')
}

// ---------- DESCRIPTION SCREEN ----------
function descriptionScreen() {
  fill(255, 20, 147)
  textSize(38)
  text('My Movie Personality', width / 2, 140)

  stroke(255, 20, 147)
  strokeWeight(3)
  line(280, 190, 720, 190)
  noStroke()

  let description =
    'I would describe myself as a nostalgic, comfort-movie watcher. ' +
    'I love comedies, family movies, and fantasy films that remind me of my childhood. ' +
    'I tend to enjoy movies that make me laugh, have a little adventure, and allow me to escape reality. ' +
    'I also love rewatching my favorite movies rather than always choosing something new. ' +
    'Overall, I value nostalgia, humor, and the feeling a movie gives me more than anything else.'

  fill(255)
  textSize(21)
  textLeading(36)
  text(description, 180, 245, 640, 310)

  fill(255, 20, 147)
  rect(390, 620, 220, 50, 12)
  fill(255)
  textSize(18)
  text('Back', 500, 645)
}

// ---------- BUTTON ----------
function drawButton(x, y, w, h, label) {
  noStroke()
  fill(60, 120, 200)
  rect(x, y, w, h, 8)

  fill(255)
  textSize(15)
  text(label, x + w / 2, y + h / 2)
}

// ---------- CLICKING ----------
function mousePressed() {
  // pink description button
  if (screen != 'description') {
    if (mouseX > 790 && mouseX < 975 && mouseY > 20 && mouseY < 65) {
      previousScreen = screen
      screen = 'description'
      return
    }
  }

  if (screen == 'home') {
    clickHome()
  } else if (screen == 'platform') {
    clickPlatform()
  } else if (screen == 'summary') {
    if (mouseX > 390 && mouseX < 610 && mouseY > 675 && mouseY < 720) {
      screen = 'home'
    }
  } else if (screen == 'description') {
    if (mouseX > 390 && mouseX < 610 && mouseY > 620 && mouseY < 670) {
      screen = previousScreen
    }
  }
}

function clickHome() {
  // platform circles
  for (let i = 0; i < 4; i++) {
    let x = 250 + (i % 2) * 300
    let y = 280 + floor(i / 2) * 190

    if (dist(mouseX, mouseY, x, y) < 70) {
      selectedPlatform = i
      screen = 'platform'
    }
  }

  // finish button
  if (mouseX > 390 && mouseX < 610 && mouseY > 650 && mouseY < 695) {
    screen = 'summary'
  }
}

function clickPlatform() {
  // back button
  if (mouseX > 20 && mouseX < 100 && mouseY > 20 && mouseY < 60) {
    screen = 'home'
    return
  }

  for (let i = 0; i < 4; i++) {
    let x = posX[i]
    let y = posY[i]
    let index = selectedPlatform * 4 + i

    // can't change an answer after it's been submitted
    if (submitted[index] == true) {
      continue
    }

    // rating buttons
    for (let r = 1; r <= 10; r++) {
      let bx = x + 125 + (r - 1) * 23
      let by = y + 105

      if (mouseX > bx && mouseX < bx + 21 && mouseY > by && mouseY < by + 27) {
        ratingGuess[index] = r
      }
    }

    // YES button
    if (mouseX > x + 155 && mouseX < x + 230 && mouseY > y + 185 && mouseY < y + 215) {
      rewatchGuess[index] = 'YES'
    }

    // NO button
    if (mouseX > x + 240 && mouseX < x + 315 && mouseY > y + 185 && mouseY < y + 215) {
      rewatchGuess[index] = 'NO'
    }

    checkAnswer(index)
  }
}

// once both guesses are made, lock them in and update the score
function checkAnswer(index) {
  if (ratingGuess[index] != 0 && rewatchGuess[index] != '' && submitted[index] == false) {
    submitted[index] = true

    if (ratingGuess[index] == table.getNum(index, 'rating')) {
      score++
    }
    totalGuessed++

    if (rewatchGuess[index] == table.getString(index, 'rewatch')) {
      score++
    }
    totalGuessed++
  }
}