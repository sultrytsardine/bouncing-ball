var canvas = document.getElementById("gameCanvas") 
var height = canvas.height;
var width = canvas.width;
var ctx = canvas.getContext("2d");
var x = width / 2;
var y = height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var ballColour = 'red';
var paddleX = (width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

function draw() {
	ctx.clearRect(0, 0, width, height);
	drawPaddle();
	drawBall();
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
	ctx.beginPath()
	ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.closePath();
	calculateNewPaddleCoordinates();
}

function calculateNewBallCoordinates() {
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
	const checkY = y + ballRadius > height - paddleHeight;

	return (x + ballRadius > paddleX && checkY) 
		&& (x - ballRadius < paddleX + paddleWidth && checkY);
}

function detectXEdgeCollision() {
	return x >= width - ballRadius || x <= ballRadius;
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


document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
var run = setInterval(draw, 10);