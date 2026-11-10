let currentPage = "home"
let table
let images = []
let ratingGuess = []
let rewatchGuess = []
let submitted = []

let netflixButton
let huluButton
let peacockButton
let primeButton

let netflixTable

let streamingplatforms = [
  { name: "Netflix",     cls: "button1", dx: -120, y: 250 },
  { name: "Hulu",        cls: "button2", dx:  120, y: 250 },
  { name: "Peacock",     cls: "button3", dx: -120, y: 450 },
  { name: "Prime Video", cls: "button4", dx:  120, y: 450 }
]

async function setup() {
  createCanvas(windowWidth, windowHeight)

  addButtonStyles()
  makeButtons()
  showPage("home")

  table = await loadTable('js/movieData.csv', ',', 'header')
  
  netflixTable = await loadTable('js/movieData.csv', ',', 'header')

  for (let i = 0; i < table.getRowCount(); i++) {
    images[i] = await loadImage('images/' + table.getString(i, 'image'))

    ratingGuess[i] = 0
    rewatchGuess[i] = ''
    submitted[i] = false
  }
}

function draw() {
  background(240, 243, 247)

  if (currentPage === "home") {

    fill(204, 26, 2)
    noStroke()
    circle(width / 2 - 120, 250, 150) // Netflix


    fill(10, 199, 10)
    noStroke()
    circle(width / 2 + 120, 250, 150) // Hulu

    fill(2, 113, 240)
    noStroke()
    circle(width / 2 - 120, 450, 150) // Peacock
    
    fill(242, 125, 7)
    noStroke()
    circle(width / 2 + 120, 450, 150) // Prime Video

    fill(15, 15, 15)
    textAlign(CENTER, CENTER)
    textSize(35)
    textStyle(BOLD)

    text("Which Streaming Platform Knows Me Best?", width / 2, 80)

    textStyle(NORMAL)

   // Names inside circles
    fill(255)
    textAlign(CENTER, CENTER)
    textSize(18)
    textStyle(NORMAL)

    text("Netflix", width / 2 - 120, 250)
    text("Hulu", width / 2 + 120, 250)
    text("Peacock", width / 2 - 120, 450)
    text("Prime Video", width / 2 + 120, 450)

  } else {

    // Back button
    fill(255, 20, 147)
    rect(50, 50, 120, 50, 10)

    fill(255)
    textSize(20)
    text("Back", 110, 75)
  }


  // if (dist(mouseX, mouseY, 600, 250) < 75) {
  //   currentPage = "Hulu"
  // }

  // if (dist(mouseX, mouseY, 400, 450) < 75) {
  //   currentPage = "Peacock"
  // }

  // if (dist(mouseX, mouseY, 600, 450) < 75) {
  //   currentPage = "Prime Video"
  // }

  if(dist(mouseX, mouseY, width / 2 - 120, 250) < 125 && mouseIsPressed){
    
  }
  else {

    // New page for each platform
    fill(255, 20, 147)
    textAlign(CENTER, CENTER)
    textSize(40)

    text(currentPage, 500, 200)

    // Back button
    fill(255, 20, 147)
    rect(50, 50, 120, 50, 10)

    fill(255)
    textSize(20)
    text("Back", 110, 75)
  }
}

function makeButtons() {
  // Netflix
  netflixButton = createButton("Netflix")
  netflixButton.position(width / 2 - 195, 175)
  makeRound(netflixButton, "rgb(204, 26, 2)")
  netflixButton.mousePressed(goNetflix)

  // Hulu
  huluButton = createButton("Hulu")
  huluButton.position(width / 2 + 45, 175)
  makeRound(huluButton, "rgb(10, 199, 10)")
  huluButton.mousePressed(goHulu)

  // Peacock
  peacockButton = createButton("Peacock")
  peacockButton.position(width / 2 - 195, 375)
  makeRound(peacockButton, "rgb(2, 113, 240)")
  peacockButton.mousePressed(goPeacock)

  // Prime Video
  primeButton = createButton("Prime Video")
  primeButton.position(width / 2 + 45, 375)
  makeRound(primeButton, "rgb(242, 125, 7)")
  primeButton.mousePressed(goPrime)

  // Back button
  backButton = createButton("Back")
  backButton.position(50, 50)
  backButton.size(120, 50)
  backButton.style("background-color", "rgb(255, 20, 147)")
  backButton.style("color", "white")
  backButton.style("border", "none")
  backButton.style("border-radius", "10px")
  backButton.style("font-size", "20px")
  backButton.mousePressed(goHome)
}

// makes a button into a colored circle
function makeRound(button, color) {
  button.size(150, 150)
  button.style("background-color", color)
  button.style("color", "white")
  button.style("border", "none")
  button.style("border-radius", "50%")
  button.style("font-size", "18px")
}

// each button runs one of these when clicked
function goNetflix() {
  showPage("Netflix")
}

function goHulu() {
  showPage("Hulu")
}

function goPeacock() {
  showPage("Peacock")
}

function goPrime() {
  showPage("Prime Video")
}

function goHome() {
  showPage("home")
}

// changes the page and shows/hides the right buttons
function showPage(page) {
  currentPage = page

  if (page === "home") {
    netflixButton.show()
    huluButton.show()
    peacockButton.show()
    primeButton.show()
    backButton.hide()
  } else {
    netflixButton.hide()
    huluButton.hide()
    peacockButton.hide()
    primeButton.hide()
    backButton.show()
  }
}