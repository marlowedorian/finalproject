
let currentScreen = 'home';
let previousScreen = 'home';
let selectedPlatform = null;

let score = 0;
let totalGuessed = 0;

let userAnswers = {};
let loadedImages = {};

// DESCRIPTION BUTTON
let descriptionButtonX = 790;
let descriptionButtonY = 20;

// ANIMATIONS
let confetti = [];
let thumbsDown = [];


const platformData = {
  "Prime Video": {
    color: [0, 168, 204],
    movies: [
      { genre: "Comedy", title: "The Bachelorette", rating: "9/10", numericRating: 9, rewatch: "YES", imgName: "Bachelorette.jepg" },
      { genre: "Romance", title: "The Last Sunrise", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "thelastsunrise.jpeg" },
      { genre: "Fantasy", title: "The Princess Bride", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "pirncessbride.jpg" },
      { genre: "Reality", title: "The Hills", rating: "10/10", numericRating: 10, rewatch: "YES", imgName: "thehills.jpeg" }
    ]
  },

  "Netflix": {
    color: [229, 9, 20],
    movies: [
      { genre: "Comedy", title: "21 Jump Street", rating: "8/10", numericRating: 8, rewatch: "YES", imgName: "21jumpstreet.jpeg" },
      { genre: "Romance", title: "He's All That", rating: "3/10", numericRating: 3, rewatch: "NO", imgName: "He's_All_That.jpeg" },
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
};

// MOVIE POSITIONS
const scatteredPositions = [
  { x: 100, y: 120 },
  { x: 540, y: 120 },
  { x: 100, y: 420 },
  { x: 540, y: 420 }
];

// SETUP
function setup() {
  createCanvas(1000, 750);
  textAlign(CENTER, CENTER);

  for (let pName in platformData) {
    loadedImages[pName] = [];

    for (let m of platformData[pName].movies) {
      let imagePath = 'images/' + m.imgName;

      let img = loadImage(
        imagePath,
        () => console.log("SUCCESS: " + imagePath),
        () => console.error("IMAGE NOT FOUND: " + imagePath)
      );

      loadedImages[pName].push(img);
    }
  }
}

// DRAW
function draw() {
  background(25, 30, 42);
  textAlign(CENTER, CENTER);

  if (currentScreen === 'home') {
    drawHomeScreen();
  } else if (currentScreen === 'platform') {
    drawPlatformScreen();
  } else if (currentScreen === 'summary') {
    drawSummaryScreen();
  } else if (currentScreen === 'description') {
    drawDescriptionScreen();
  }

  // HOT PINK DESCRIPTION BUTTON
  if (currentScreen !== 'description') {
    noStroke();
    fill(255, 20, 147);
    rect(descriptionButtonX, descriptionButtonY, 185, 45, 10);

    fill(255);
    textStyle(BOLD);
    textSize(16);
    text(
      "My Description",
      descriptionButtonX + 92.5,
      descriptionButtonY + 22.5
    );
    textStyle(NORMAL);
  }

  // ANIMATIONS
  drawConfetti();
  drawThumbsDown();
}

// HOME SCREEN
function drawHomeScreen() {
  fill(255);
  noStroke();
  textStyle(BOLD);
  textSize(32);
  text(
    "Which Streaming Platform Knows Me Best?",
    width / 2,
    80
  );

  textStyle(NORMAL);
  textSize(16);
  fill(180, 190, 210);
  text(
    "Choose a streaming platform and guess my movie taste!",
    width / 2,
    125
  );

  let keys = Object.keys(platformData);

  for (let i = 0; i < keys.length; i++) {
    let pName = keys[i];
    let col = platformData[pName].color;

    let x = 250 + (i % 2) * 300;
    let y = 280 + Math.floor(i / 2) * 190;

    let hovering = dist(mouseX, mouseY, x, y) < 75;

    fill(col[0], col[1], col[2]);
    ellipse(x, y, hovering ? 150 : 140);

    fill(255);
    textSize(20);
    textStyle(BOLD);
    text(pName, x, y);
  }

  drawButton(390, 650, 220, 45, "Finish & View Results");
}

// MOVIE SCREEN
function drawPlatformScreen() {
  let movies = platformData[selectedPlatform].movies;
  let imgList = loadedImages[selectedPlatform];

  fill(255);
  noStroke();
  textStyle(BOLD);
  textSize(25);
  text(
    selectedPlatform + " - Guess My Movie Taste!",
    width / 2,
    35
  );

  textStyle(NORMAL);
  textSize(15);
  fill(180, 190, 210);
  text(
    "Score: " + score + " / " + totalGuessed,
    width / 2,
    70
  );

  for (let i = 0; i < movies.length; i++) {
    let m = movies[i];
    let pos = scatteredPositions[i];

    let x = pos.x;
    let y = pos.y;

    let key = selectedPlatform + "-" + i;
    let answer = userAnswers[key];

    let loadedImg = imgList[i];

    // MOVIE POSTER
    if (loadedImg && loadedImg.width > 0) {
      imageMode(CORNER);
      image(loadedImg, x, y, 120, 170);
    } else {
      fill(65, 75, 95);
      noStroke();
      rect(x, y, 120, 170, 5);

      fill(255);
      textSize(12);
      text("No Image", x + 60, y + 85);
    }

    // MOVIE TITLE
    fill(255);
    noStroke();
    textStyle(BOLD);
    textSize(17);
    text(m.title, x + 245, y + 15, 220);

    textStyle(NORMAL);
    textSize(13);
    fill(180, 190, 210);
    text(m.genre, x + 245, y + 48);

    // RATING QUESTION
    fill(255);
    textSize(14);
    text("Guess my rating (1-10)", x + 245, y + 80);

    // RATING BUTTONS
    for (let r = 1; r <= 10; r++) {
      let bx = x + 125 + (r - 1) * 23;
      let by = y + 105;

      let chosen = answer && answer.rating === r;

      fill(
        chosen
          ? color(255, 20, 147)
          : color(65, 75, 95)
      );

      noStroke();
      rect(bx, by, 21, 27, 4);

      fill(255);
      textSize(11);
      text(r, bx + 10.5, by + 13.5);
    }

    // REWATCH QUESTION
    fill(255);
    textSize(14);
    text("Would I rewatch it?", x + 245, y + 165);

    let yesSelected = answer && answer.rewatch === "YES";
    let noSelected = answer && answer.rewatch === "NO";

    fill(
      yesSelected
        ? color(28, 190, 110)
        : color(65, 75, 95)
    );
    rect(x + 155, y + 185, 75, 30, 6);

    fill(255);
    textSize(13);
    text("YES", x + 192, y + 200);

    fill(
      noSelected
        ? color(229, 60, 70)
        : color(65, 75, 95)
    );
    rect(x + 240, y + 185, 75, 30, 6);

    fill(255);
    text("NO", x + 277, y + 200);

    // REVEAL ANSWERS
    if (answer && answer.submitted) {
      fill(28, 231, 131);
      textSize(13);
      text(
        "Actual rating: " + m.rating +
        " | Rewatch: " + m.rewatch,
        x + 245,
        y + 245
      );
    }
  }

  drawButton(20, 20, 80, 40, "Back");
}

// SUMMARY SCREEN
function drawSummaryScreen() {
  fill(255);
  noStroke();
  textStyle(BOLD);
  textSize(30);
  text("Which Platform Knows Me Best?", width / 2, 75);

  textStyle(NORMAL);
  textSize(18);
  text(
    "Your Guessing Score: " + score + " / " + totalGuessed,
    width / 2,
    130
  );

  let keys = Object.keys(platformData);
  let bestPlatform = "";
  let bestAverage = -1;

  for (let i = 0; i < keys.length; i++) {
    let pName = keys[i];
    let movies = platformData[pName].movies;

    let total = 0;

    for (let m of movies) {
      total += m.numericRating;
    }

    let average = total / movies.length;

    if (average > bestAverage) {
      bestAverage = average;
      bestPlatform = pName;
    }

    let y = 230 + i * 85;
    let col = platformData[pName].color;

    fill(col[0], col[1], col[2]);
    rect(240, y, average * 50, 35, 8);

    fill(255);
    textSize(16);
    textStyle(NORMAL);
    text(
      pName + " - " + average.toFixed(1) + "/10",
      500,
      y + 50
    );
  }

  fill(28, 231, 131);
  textSize(21);
  textStyle(BOLD);
  text(
    "My Favorite Platform: " + bestPlatform,
    width / 2,
    630
  );

  drawButton(390, 675, 220, 45, "Back to Home");
}

// MY DESCRIPTION SCREEN
function drawDescriptionScreen() {
  background(25, 30, 42);

  fill(255, 20, 147);
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(38);
  text("My Movie Personality", width / 2, 140);

  stroke(255, 20, 147);
  strokeWeight(3);
  line(280, 190, 720, 190);
  noStroke();

  let description =
    "I would describe myself as a nostalgic, comfort-movie watcher. " +
    "I love comedies, family movies, and fantasy films that remind me of my childhood. " +
    "I tend to enjoy movies that make me laugh, have a little adventure, and allow me to escape reality. " +
    "I also love rewatching my favorite movies rather than always choosing something new. " +
    "Overall, I value nostalgia, humor, and the feeling a movie gives me more than anything else.";

  fill(255);
  textStyle(NORMAL);
  textSize(21);
  textLeading(36);
  text(description, 180, 245, 640, 310);

  fill(255, 20, 147);
  rect(390, 620, 220, 50, 12);

  fill(255);
  textSize(18);
  textStyle(BOLD);
  text("Back", 500, 645);
  textStyle(NORMAL);
}

// BUTTON DRAWING
function drawButton(x, y, w, h, label) {
  noStroke();
  fill(60, 120, 200);
  rect(x, y, w, h, 8);

  fill(255);
  textStyle(NORMAL);
  textSize(15);
  text(label, x + w / 2, y + h / 2);
}

// CLICKING
function mousePressed() {

  // DESCRIPTION BUTTON
  if (currentScreen !== 'description') {
    if (
      mouseX >= descriptionButtonX &&
      mouseX <= descriptionButtonX + 185 &&
      mouseY >= descriptionButtonY &&
      mouseY <= descriptionButtonY + 45
    ) {
      previousScreen = currentScreen;
      currentScreen = 'description';
      return;
    }
  }

  // DESCRIPTION BACK BUTTON
  if (currentScreen === 'description') {
    if (
      mouseX >= 390 && mouseX <= 610 &&
      mouseY >= 620 && mouseY <= 670
    ) {
      currentScreen = previousScreen;
      return;
    }
  }

  // HOME SCREEN
  if (currentScreen === 'home') {
    let keys = Object.keys(platformData);

    for (let i = 0; i < keys.length; i++) {
      let x = 250 + (i % 2) * 300;
      let y = 280 + Math.floor(i / 2) * 190;

      if (dist(mouseX, mouseY, x, y) < 75) {
        selectedPlatform = keys[i];
        currentScreen = 'platform';
        return;
      }
    }

    if (
      mouseX > 390 && mouseX < 610 &&
      mouseY > 650 && mouseY < 695
    ) {
      currentScreen = 'summary';
      return;
    }
  }

  // PLATFORM SCREEN
  if (currentScreen === 'platform') {

    // BACK BUTTON
    if (
      mouseX > 20 && mouseX < 100 &&
      mouseY > 20 && mouseY < 60
    ) {
      currentScreen = 'home';
      selectedPlatform = null;
      return;
    }

    let movies = platformData[selectedPlatform].movies;

    for (let i = 0; i < movies.length; i++) {
      let m = movies[i];
      let pos = scatteredPositions[i];

      let x = pos.x;
      let y = pos.y;

      let key = selectedPlatform + "-" + i;

      if (!userAnswers[key]) {
        userAnswers[key] = {
          rating: null,
          rewatch: null,
          submitted: false,
          animationShown: false
        };
      }

      let answer = userAnswers[key];

      if (answer.submitted) {
        continue;
      }

      // RATING BUTTONS
      for (let r = 1; r <= 10; r++) {
        let bx = x + 125 + (r - 1) * 23;
        let by = y + 105;

        if (
          mouseX >= bx && mouseX <= bx + 21 &&
          mouseY >= by && mouseY <= by + 27
        ) {
          answer.rating = r;
          checkAnswer(key, m);
          return;
        }
      }

      // YES BUTTON
      if (
        mouseX >= x + 155 && mouseX <= x + 230 &&
        mouseY >= y + 185 && mouseY <= y + 215
      ) {
        answer.rewatch = "YES";

        if (!answer.animationShown) {
          if (answer.rewatch === m.rewatch) {
            makeConfetti();
          } else {
            makeThumbsDown();
          }
          answer.animationShown = true;
        }

        checkAnswer(key, m);
        return;
      }

      // NO BUTTON
      if (
        mouseX >= x + 240 && mouseX <= x + 315 &&
        mouseY >= y + 185 && mouseY <= y + 215
      ) {
        answer.rewatch = "NO";

        if (!answer.animationShown) {
          if (answer.rewatch === m.rewatch) {
            makeConfetti();
          } else {
            makeThumbsDown();
          }
          answer.animationShown = true;
        }

        checkAnswer(key, m);
        return;
      }
    }
  }

  // SUMMARY SCREEN
  if (currentScreen === 'summary') {
    if (
      mouseX > 390 && mouseX < 610 &&
      mouseY > 675 && mouseY < 720
    ) {
      currentScreen = 'home';
      return;
    }
  }
}

// CHECK ANSWERS AND UPDATE SCORE
function checkAnswer(key, movie) {
  let answer = userAnswers[key];

  if (answer.rating === null || answer.rewatch === null) {
    return;
  }

  if (answer.submitted) {
    return;
  }

  answer.submitted = true;

  if (answer.rating === movie.numericRating) {
    score++;
  }
  totalGuessed++;

  if (answer.rewatch === movie.rewatch) {
    score++;
  }
  totalGuessed++;
}

// CREATE CONFETTI
function makeConfetti() {
  for (let i = 0; i < 180; i++) {
    confetti.push({
      x: random(width),
      y: random(-350, -10),
      speed: random(3, 9),
      size: random(5, 12),
      drift: random(-1.5, 1.5),
      rotation: random(TWO_PI),
      spin: random(-0.1, 0.1),
      pieceColor: color(
        random(100, 255),
        random(50, 255),
        random(100, 255)
      )
    });
  }
}

// DRAW CONFETTI
function drawConfetti() {
  for (let i = confetti.length - 1; i >= 0; i--) {
    let c = confetti[i];

    push();
    translate(c.x, c.y);
    rotate(c.rotation);

    noStroke();
    fill(c.pieceColor);
    rect(0, 0, c.size, c.size * 0.6);

    pop();

    c.y += c.speed;
    c.x += c.drift;
    c.rotation += c.spin;

    if (c.y > height + 20) {
      confetti.splice(i, 1);
    }
  }
}

// CREATE THUMBS-DOWN EMOJIS
function makeThumbsDown() {
  for (let i = 0; i < 35; i++) {
    thumbsDown.push({
      x: random(width),
      y: random(-400, -20),
      speed: random(2, 6),
      size: random(25, 45),
      drift: random(-1, 1),
      rotation: random(-0.3, 0.3)
    });
  }
}

// DRAW FALLING THUMBS-DOWN EMOJIS
function drawThumbsDown() {
  for (let i = thumbsDown.length - 1; i >= 0; i--) {
    let t = thumbsDown[i];

    push();
    translate(t.x, t.y);
    rotate(t.rotation);

    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    textSize(t.size);
    fill(255);
    text("👎", 0, 0);

    pop();

    t.y += t.speed;
    t.x += t.drift;

    if (t.y > height + 50) {
      thumbsDown.splice(i, 1);
    }
  }
}
