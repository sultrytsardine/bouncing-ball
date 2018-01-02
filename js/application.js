var canvas = document.getElementById("gameCanvas");
var height = canvas.height;
var width = canvas.width;
var ctx = canvas.getContext("2d");
var x = Math.floor(Math.random() * width) + 1;
var y = 3*(height / 4);
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var ballColour = 'red';
var paddleX = (width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var destroyedBricks = 0;
var bricks = [];

function draw() {
	ctx.clearRect(0, 0, width, height);
	drawPaddle();
	drawBall();
	drawBricks();
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = ballColour;
	ctx.fill();
	ctx.closePath();

	calculateNewBallCoordinates();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.closePath();

	calculateNewPaddleCoordinates();
}

function drawBricks() {
	for (col = 0; col < brickColumnCount; col++) {
		for (row = 0; row < brickRowCount; row++) {
			if (bricks[col][row].status === 1) {
				drawBrick(col, row);
			}
		}
	}
}

function drawBrick(col, row) {
	var brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
	var brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
	bricks[col][row].x = brickX;
	bricks[col][row].y = brickY;

	ctx.beginPath();
	ctx.rect(brickX, brickY, brickWidth, brickHeight);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}

function calculateNewBallCoordinates() {
	if (detectBrickCollision()) {
		ballColour = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
		dy *= -1;
		checkWin();
	}
	if (detectXEdgeCollision()) {
		ballColour = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
		dx *= -1;
	}
	if (detectPaddleCollision() || y <= ballRadius) {
		ballColour = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
		dy *= -1;
	} else if (y >= height - ballRadius) {
		clearInterval(run);
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = 'red';
		ctx.font = "33px sans-serif";
		ctx.fillText('Game over! Click to play again', 10, 50);
		document.addEventListener('click', reloadGame, false);
	}

	x += dx;
	y += dy;
}

function reloadGame() {
	document.location.reload();
}

function detectPaddleCollision() {
	var checkY = y + ballRadius > height - paddleHeight;

	return (x + ballRadius > paddleX && checkY)
        && (x - ballRadius < paddleX + paddleWidth && checkY);
}

function detectXEdgeCollision() {
	return x >= width - ballRadius || x <= ballRadius;
}

function detectBrickCollision() {
	for (col = 0; col < brickColumnCount; col++) {
		for (row = 0; row < brickRowCount; row++) {
			var brick = bricks[col][row];
			if (brick.status === 1) {
				const checkXRightEdge = x + ballRadius > brick.x && x + ballRadius < brick.x + brickWidth;
				const checkXLeftEdge = x - ballRadius < brick.x + brickWidth && x - ballRadius > brick.x;
				const checkYBottom = y + ballRadius > brick.y && y + ballRadius < brick.y + brickHeight;
				const checkYTop = y - ballRadius > brick.y && y - ballRadius < brick.y + brickHeight;

				if ((checkXRightEdge || checkXLeftEdge) && (checkYBottom || checkYTop)) {
					brick.status = 0;
					destroyedBricks++;
					return true;
				}
			}
		}
	}
	return false;
}

function checkWin() {
	if (destroyedBricks === brickColumnCount * brickRowCount) {
        clearInterval(run);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'green';
        ctx.font = "33px sans-serif";
        ctx.fillText('You win! Click to play again', 10, 50);
        document.addEventListener('click', reloadGame, false);
	}
}

function calculateNewPaddleCoordinates() {
	if (rightPressed && paddleX < width - paddleWidth) paddleX += 7;
	else if (leftPressed && paddleX > 0) paddleX -= 7;
}

function keyDownHandler(e) {
	if (e.keyCode === 39) rightPressed = true;
	else if (e.keyCode === 37) leftPressed = true;
}

function keyUpHandler(e) {
	if (e.keyCode === 39) rightPressed = false;
	else if (e.keyCode === 37) leftPressed = false;
}

function setUpBricks() {
	for (col = 0; col < brickColumnCount; col++) {
	bricks[col] = [];
		for(row = 0; row < brickRowCount; row++) {
			bricks[col][row] = {x: 0, y: 0, status: 1};
		}
	}
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

setUpBricks();
var run = setInterval(draw, 10);
