    //canvas
    var canvas;
    var canvasContext;

    //ball
    var ballX = 50;
    var ballY = 50;
    var ballSpeedX = 5;
    var ballSpeedY = 2;

    //score
    var player1Score = 0;
    var player2Score = 0;
    const WINNING_SCORE = 11;
    var isShowingWinScreen = false;

    //paddles
    var paddle1Y = 250;
    var paddle2Y = 250;
    const PADDLE_HEIGHT = 100;
    const PADDLE_THICKNESS = 10;

    //bools
    var Boolean, isWinPlayed = false;
    var Boolean, isLosePlayed = false;

    //SFX
    const SFX_WIN = new Audio("audio/gamewin.wav");
    const SFX_LOSE = new Audio("audio/gameover.wav");
    const SFX_HIT = new Audio("audio/hit.wav");
    const SFX_HIT2 = new Audio("audio/hit2.wav");
    const SFX_dead = new Audio("audio/dead.wav");
    const SFX_POINT = new Audio("audio/point.wav");
    const AUDIO_BACKGROUND = new Audio("audio/bgs.mp3");

    //Calculates position of the cursor.
    function calculateMousePos(evt) {
      var rect = canvas.getBoundingClientRect();
      var root = document.documentElement;
      var mouseX = evt.clientX - rect.left - root.scrollLeft;
      var mouseY = evt.clientY - rect.top - root.scrollTop;
      return {
        x: mouseX,
        y: mouseY,
      };
    }

    function handleMouseClick(evt) {
      if (isShowingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        isShowingWinScreen = false;
      }
    }

    window.onload = function () {
      canvas = document.getElementById("gameCanvas");
      canvasContext = canvas.getContext("2d");
      var fps = 60;
      setInterval(function () {
        movement();
        drawEverything();
      }, 1000 / fps);

      canvas.addEventListener("mousedown", handleMouseClick);

      canvas.addEventListener("mousemove", function (evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
        if((mousePos.x < 810 && mousePos.x > 1) && (mousePos.y < 610 && mousePos.y > 1)) {
            AUDIO_BACKGROUND.volume = 0.01;
            AUDIO_BACKGROUND.play();
        } else {
            AUDIO_BACKGROUND.pause();
        }
      });
    };

    //Resets ball on score
    function ballReset() {
      if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        isShowingWinScreen = true;
        isWinPlayed = false;
        isLosePlayed = false;
      }
      ballSpeedX = -ballSpeedX;
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
    }

    //AI movement
    function computerMovement() {
      var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
      if (paddle2YCenter < ballY - 35) {
        paddle2Y += 5;
      } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 5;
      }
    }

    // Mainly controls the movement of the ball.
    function movement() {
      if (isShowingWinScreen) {
        return;
      }

      computerMovement();

      ballX += ballSpeedX;
      ballY += ballSpeedY;
      if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
      }
      if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
      }
      if (ballX < 25) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
          ballSpeedX = -ballSpeedX;
          SFX_HIT.volume = 0.5;
          SFX_HIT.play();

          var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
          ballSpeedY = deltaY * 0.2;
        } else {
          SFX_dead.play();
          player2Score++;
          ballReset();
        }
      }
      if (ballX > canvas.width - 25) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
          ballSpeedX = -ballSpeedX;
          SFX_HIT2.volume = 0.5;
          SFX_HIT2.play();
          
          var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
          ballSpeedY = deltaY * 0.2;
        } else {
          SFX_POINT.volume = 0.5;
          SFX_POINT.play();
          player1Score++;
          ballReset();
        }
      }
    }

    // Draws the line in the middle (net)
    function drawNet() {
      colorRect(canvas.width / 2 - 1, 0, 5, canvas.height, "darkgreen");
    }

    function drawEverything() {
      // Adds black canvas
      colorRect(0, 0, canvas.width, canvas.height, "lightgreen");

      if (isShowingWinScreen) {
        canvasContext.fillStyle = "black";

        if (player1Score >= WINNING_SCORE) {
          canvasContext.fillText("You won!", 370, 250);
          if(!isWinPlayed) {
            SFX_WIN.play();
            isWinPlayed = true;
          }
        } else if (player2Score >= WINNING_SCORE) {
          canvasContext.fillText("You lost!", 365, 250);
          if(!isLosePlayed) {
            SFX_LOSE.play();
            isLosePlayed = true;
          }
        }
        canvasContext.fillText("Click to continue", 350, 450);
        return;
      }
      drawNet();
      // Draws the pokeball in the middle.
      colorCircle(400, 290, 50, "white");
      canvasContext.fillStyle = "red";
      canvasContext.beginPath();
      canvasContext.arc(400, 290, 50, 0, Math.PI, true);
      canvasContext.fill();
      colorRect(400 - 50, 290, 100, 4, "black");
      colorCircle(400, 290, 15, "black");
      colorCircle(400, 290, 10, "white");

      // Adds left padle
      colorRect(10, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "blue");

      // Adds right padle
      colorRect(
        canvas.width - PADDLE_THICKNESS - 10,
        paddle2Y,
        PADDLE_THICKNESS,
        PADDLE_HEIGHT,
        "red"
      );

      // Adds moveable ball
      colorCircle(ballX, ballY, 10, "white");
      canvasContext.fillStyle = "red";
      canvasContext.beginPath();
      canvasContext.arc(ballX, ballY, 10, 0, Math.PI, true);
      canvasContext.fill();
      colorRect(ballX - 10, ballY - 2, 20, 4, "black");
      colorCircle(ballX, ballY, 4, "black");
      colorCircle(ballX, ballY, 2, "white");

      canvasContext.fillStyle = "black";
      canvasContext.fillText(player1Score, 100, 100);
      canvasContext.fillText(player2Score, canvas.width - 100, 100);
    }

    function colorCircle(centerX, centerY, radius, drawColor) {
      canvasContext.fillStyle = drawColor;
      canvasContext.beginPath();
      canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      canvasContext.fill();
    }

    function colorRect(leftX, topY, width, height, drawColor) {
      canvasContext.fillStyle = drawColor;
      canvasContext.fillRect(leftX, topY, width, height);
    }