let currentScreen = 'home'; // 'home', 'platform', 'summary'
let selectedPlatform = null;
let score = 0;
let totalGuessed = 0;

// Data structure with exact image filenames from your folder
const platformData = {
  "Prime Video": {
    color: [0, 168, 204],
    movies: [
    { genre: "Comedy", title: "The Bachelorette", rating: "9/10", numericRating: 9, rewatch: "YES", 
    imgName: "Bachelorette.jpeg" },
    { genre: "Romance", title: "The Last Sunrise", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "thelastsunrise.jpeg" },
    { genre: "Fantasy", title: "The Princess Bride", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "pirncessbride.jpeg" },
    { genre: "Reality", title: "The Hills", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "thehills.jpeg" }
    ]
  },
  "Netflix": {
    color: [229, 9, 20],
    movies: [
    { genre: "Comedy", title: "21 Jump Street", rating: "8/10", numericRating: 8, rewatch: "YES", imgName: "21jumpstreet.jpeg" },
    { genre: "Romance", title: "He's All That", rating: "3/10", numericRating: 3, rewatch: "NO", imgName: "He'sAllThat.jpeg" },
    { genre: "Fantasy", title: "The School for Good and Evil", rating: "8/10", numericRating: 8, rewatch: "NO", imgName: "theschoolofgoodandevil.jpeg" },
    { genre: "Reality", title: "Love Is Blind", rating: "2/10", numericRating: 2, rewatch: "NO", imgName: "loveisblind.jpeg" }
    ]
  },
  "Hulu": {
    color: [28, 231, 131],
    movies: [
    { genre: "Comedy", title: "Jumanji", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "jumaji.jpeg" },
    { genre: "Romance", title: "No Hard Feelings", rating: "7/10", numericRating: 7, rewatch: "YES", imgName: "nohardfeeling.jpeg" },
    { genre: "Fantasy", title: "Ghostbusters", rating: "8/10", numericRating: 8, rewatch: "YES", imgName: "ghostbusters.jpeg" },
    { genre: "Reality", title: "The Kardashians", rating: "9/10", numericRating: 9, rewatch: "YES", imgName: "keepingupwiththekardashians.jpeg" }
    ]
  },
  "Peacock": {
    color: [0, 114, 206],
    movies: [
    { genre: "Comedy", title: "How the Grinch Stole Christmas", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "thegrinch.jpeg" },
    { genre: "Romance", title: "Reminders of Him", rating: "6/10", numericRating: 6, rewatch: "NO", imgName: "remindersofhim.jpeg" },
    { genre: "Fantasy", title: "Harry Potter", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "harrypotter.jpeg" },
    { genre: "Reality", title: "Love Island", rating: "6/10", numericRating: 6, rewatch: "YES", imgName: "loveisland.jpeg" }
    ]
  }
}

// Scattered layout coordinates for the 4 movie cards across the screen
const scatteredPositions = [
{ x: 120, y: 110 }, // Top-Left
{ x: 540, y: 110 }, // Top-Right
{ x: 120, y: 410 }, // Bottom-Left
{ x: 540, y: 410 }  // Bottom-Right
];

let userAnswers = {};
let loadedImages = {};

function setup() {
  createCanvas(1000, 750);
  textAlign(CENTER, CENTER);

  for (let pName in platformData) {
    loadedImages[pName] = [];

    for (let m of platformData[pName].movies) {
      let img = loadImage(
        "images/" + m.imgName,
        function() {
          // Image loaded successfully
        },
        function() {
          // Image could not be found
        }
      );

      loadedImages[pName].push(img);
    }
  }
}


function draw() {
  background(25, 30, 42);

  if (currentScreen === 'home') {
    drawHomeScreen();
  } else if (currentScreen === 'platform') {
    drawPlatformScreen();
  } else if (currentScreen === 'summary') {
    drawSummaryScreen();
  }
}

// 1. HOME SCREEN
function drawHomeScreen() {
  fill(255);
  textSize(32);
  textStyle(BOLD);
  text("Which Streaming Platform Knows Me Best?", width / 2, 80);
  
  textSize(16);
  textStyle(NORMAL);
  fill(180, 190, 210);
  text("Choose a streaming platform to explore what they think i will like!", width / 2, 125);

  let keys = Object.keys(platformData);
  let startX = 250;
  let startY = 280;
  let spacingX = 300;

  for (let i = 0; i < keys.length; i++) {
    let pName = keys[i];
    let col = platformData[pName].color;
    
    let x = startX + (i % 2) * spacingX;
    let y = startY + Math.floor(i / 2) * 190;

    let d = dist(mouseX, mouseY, x, y);
    let radius = d < 70 ? 150 : 140;

    fill(col[0], col[1], col[2]);
    noStroke();
    ellipse(x, y, radius, radius);

    fill(255);
    textSize(20);
    textStyle(BOLD);
    text(pName, x, y);
    textStyle(NORMAL);
  }

  fill(60, 120, 200);
  rect(width / 2 - 110, 650, 220, 45, 10);
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("Finish & View Results", width / 2, 672);
  textStyle(NORMAL);
}

// 2 & 3. SCATTERED MOVIE & GUESSING SCREEN
function drawPlatformScreen() {
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text(selectedPlatform + " - Scattered Movie Taste", width / 2, 35);

  textSize(15);
  textStyle(NORMAL);
  fill(180, 190, 210);
  text("Score: " + score + " / " + totalGuessed, width / 2, 65);

  let movies = platformData[selectedPlatform].movies;
  let imgList = loadedImages[selectedPlatform];
  let cardWidth = 340;
  let cardHeight = 270;

  for (let i = 0; i < movies.length; i++) {
    let m = movies[i];
    let pos = scatteredPositions[i];
    let x = pos.x;
    let y = pos.y;

    // Card background
    fill(35, 42, 60);
    stroke(60, 70, 95);
    strokeWeight(1);
    rect(x, y, cardWidth, cardHeight, 10);

    // Render local image if successfully loaded, otherwise show fallback box
  
let loadedImg = imgList[i];

if (loadedImg && loadedImg.width > 0) {

  image(
    loadedImg,
    x + 12,
    y + 12,
    110,
    cardHeight - 24
  );

} else {

  fill(50, 60, 80);
  noStroke();
  rect(x + 12, y + 12, 110, cardHeight - 24, 6);

  fill(255);
  textSize(10);
  text(
    "Poster not found",
    x + 67,
    y + cardHeight / 2
  );
}
    // Movie details on the right side of the card
    noStroke();
    fill(255);
    textSize(13);
    textStyle(BOLD);
    text(m.title, x + 230, y + 30);
    
    textStyle(NORMAL);
    textSize(11);
    fill(200, 210, 230);
    text(m.genre + " · Rating: " + m.rating, x + 230, y + 55);

    // Question
    textSize(11);
    fill(255);
    text("Would I watch again?", x + 230, y + 90);

    let ansState = userAnswers[m.title];

    if (!ansState) {
      // YES Button
      fill(46, 204, 113);
      rect(x + 140, y + 120, 85, 35, 6);
      fill(255);
      textStyle(BOLD);
      text("YES", x + 182, y + 138);

      // NO Button
      fill(231, 76, 60);
      rect(x + 238, y + 120, 85, 35, 6);
      fill(255);
      text("NO", x + 280, y + 138);
      textStyle(NORMAL);
    } else {
      if (ansState.correct) {
        fill(46, 204, 113);
        textSize(13);
        textStyle(BOLD);
        text("✓ Correct!", x + 235, y + 137);
      } else {
        fill(231, 76, 60);
        textSize(13);
        textStyle(BOLD);
        text("✗ Incorrect!", x + 235, y + 125);
        textStyle(NORMAL);
        textSize(10);
        fill(220, 220, 220);
        text("Answer: " + m.rewatch, x + 235, y + 150);
      }
    }
  }

  // Back button at bottom center
  fill(100, 110, 130);
  noStroke();
  rect(width / 2 - 90, 690, 180, 42, 10);
  fill(255);
  textSize(14);
  text("← Back to Platforms", width / 2, 711);
}

// 4 & 5. SUMMARY SCREEN
function drawSummaryScreen() {
  fill(255);
  textSize(30);
  textStyle(BOLD);
  text("Final Results & Analysis", width / 2, 65);

  textSize(17);
  textStyle(NORMAL);
  fill(180, 190, 210);
  text("Total Score: " + score + " out of " + totalGuessed + " correct guesses.", width / 2, 105);

  let bestPlatform = "Prime Video";
  let highestAvg = 9.75;

  fill(35, 42, 60);
  stroke(60, 70, 95);
  rect(150, 140, 700, 440, 15);

  let winCol = platformData[bestPlatform].color;
  fill(winCol[0], winCol[1], winCol[2]);
  noStroke();
  rect(150, 140, 700, 60, 15, 15, 0, 0);

  fill(255);
  textSize(22);
  textStyle(BOLD);
  text("🏆 WINNER: " + bestPlatform + " Knows You Best!", width / 2, 170);

  textSize(16);
  fill(210, 220, 240);
  textStyle(NORMAL);
  text("Average Rating: " + highestAvg.toFixed(2) + " / 10   |   Rewatch Rate: 100%", width / 2, 230);

  textSize(14);
  fill(190, 200, 220);
  let summaryText = 
  "How the platforms compare based on your movie data:\n\n" +
  "• Prime Video (Winner): Average rating of 9.75/10 with 100% rewatch interest.\n" +
  "• Hulu: Strong runner-up with an average rating of 8.5/10 and high rewatchability.\n" +
  "• Peacock: Mixed results (7.75/10 average) with specialized favorites like Harry Potter.\n" +
  "• Netflix: Lowest average rating (5.25/10) with the fewest rewatchable titles.\n\n" +
  "Conclusion: Prime Video aligns best with your taste across all genres!";

  text(summaryText, width / 2, 380);

  fill(46, 204, 113);
  rect(width / 2 - 100, 620, 200, 45, 10);
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("Play Again", width / 2, 642);
  textStyle(NORMAL);
}

// MOUSE CLICK HANDLING
function mousePressed() {
  if (currentScreen === 'home') {
    let keys = Object.keys(platformData);
    let startX = 250;
    let startY = 280;
    let spacingX = 300;

    for (let i = 0; i < keys.length; i++) {
      let x = startX + (i % 2) * spacingX;
      let y = startY + Math.floor(i / 2) * 190;
      let d = dist(mouseX, mouseY, x, y);
      
      if (d < 70) {
        selectedPlatform = keys[i];
        currentScreen = 'platform';
      }
    }

    if (mouseX > width / 2 - 110 && mouseX < width / 2 + 110 && mouseY > 650 && mouseY < 695) {
      currentScreen = 'summary';
    }

  } else if (currentScreen === 'platform') {
    if (mouseX > width / 2 - 90 && mouseX < width / 2 + 90 && mouseY > 690 && mouseY < 732) {
      currentScreen = 'home';
      return;
    }

    let movies = platformData[selectedPlatform].movies;

    for (let i = 0; i < movies.length; i++) {
      let m = movies[i];
      let pos = scatteredPositions[i];
      let x = pos.x;
      let y = pos.y;

      if (userAnswers[m.title]) continue;

      if (mouseX >= x + 140 && mouseX <= x + 225 && mouseY >= y + 120 && mouseY <= y + 155) {
        checkAnswer(m, "YES");
      }
      if (mouseX >= x + 238 && mouseX <= x + 323 && mouseY >= y + 120 && mouseY <= y + 155) {
        checkAnswer(m, "NO");
      }
    }

  } else if (currentScreen === 'summary') {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > 620 && mouseY < 665) {
      currentScreen = 'home';
      userAnswers = {};
      score = 0;
      totalGuessed = 0;
    }
  }
}

function checkAnswer(movie, guess) {
  let isCorrect = (guess === movie.rewatch);
  userAnswers[movie.title] = { guessed: guess, correct: isCorrect };
  totalGuessed++;
  if (isCorrect) {
    score++;
  }
}