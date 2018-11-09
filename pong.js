const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d') //allows methods & properties

// Draw functions
function drawRect(x,y,w,h,color){
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}
function drawCircle(x,y,r,color){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x,y,r,0, Math.PI*2, false);
	ctx.closePath();
	ctx.fill();
}
function drawText(text,x,y,color){
	ctx.fillStyle = color;
	ctx.font = "75px fantasy";
	ctx.fillText(text,x,y);
}

//NO MOVEMENTS NO GAME
// let rectX = 0;

// function render(){
// 	drawRect(0,0,600,400,'black');
// 	drawRect(rectX,100,100,100,'red');
// 	rectX = rectX + 100;
// }

// setInterval(render, 1000); // calls render() every 1sec

//PONG COMPONENTS

//comp and user paddles objects

const user = {
	x: 0,
	y: canvas.height/2 - 50,
	width: 10,
	height: 100,
	color: 'WHITE',
	score: 0
}

const com = {
	x: canvas.width - 10,
	y: canvas.height/2 - 50,
	width: 10,
	height: 100,
	color: 'WHITE',
	score: 0
}

//Drawing the comp and user with drawRect()
// drawRect(user.x, user.y, user.width, user.height, user.color);
// drawRect(com.x, com.y, user.width, user.height, user.color);

//net object

const net = {
	x: canvas.width/2 - 1,
	y: 0,
	width: 2,
	height: 10,
	colr: 'WHITE',
}
function drawNet(){
	for(let i = 0; i <= canvas.height; i += 15){
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

//Create and draw the ball
const ball = {
	x: canvas.width/2,
	y: canvas.height/2,
	radius: 10,
	speed: 5,
	velocityX: 5,
	velocityY: 5,	//velocity = speed + direction
	color: 'WHITE'
}

// drawCircle(ball.x, ball.y, ball.radius, ball.color);

// //Draw the score
// drawText(user.score, canvas.width/4, canvas.height/5, 'WHITE');
// drawText(user.score, 3*canvas.width/4, canvas.height/5, 'WHITE');

//Render the game
function render(){
	drawRect(0, 0, canvas.width, canvas.height, 'BLACK');

	//draw score
	drawText(user.score, canvas.width/4, canvas.height/5, 'WHITE');
	drawText(com.score, 3*canvas.width/4, canvas.height/5, 'WHITE');
	drawNet();

	//draw paddles
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(com.x, com.y, com.width, com.height, com.color);

	//draw the pall
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
	update();
	render();
}

//loop
const framePerSecond = 50; //50fps
setInterval(game, 1000/framePerSecond); //call game() 50 times every 1000ms = 1sec

//Move the ball
function update(){
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	//simple ai to control computer paddle
	//controls difficulty
	let computerLevel = 0.1;
	com.y += (ball.y - (com.y + com.height/2)) * computerLevel;


	if(ball.y + ball.radius > canvas.height ||
		ball.y - ball.radius < 0){
		ball.velocityY = -ball.velocityY;
	}

	let player = (ball.x < canvas.width/2) ? user : com;

	if(collision(ball, player)){

		let collidePoint = (ball.y - (player.y+player.height/2));	//take postion of ball - center of paddle
		collidePoint = collidePoint / (player.height/2)	//normalize range to be -1 to 1 from -50 to 50
		
		let angleRad = (Math.PI/4) * collidePoint;
		let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;


		ball.velocityX = direction * ball.speed * Math.cos(angleRad); // changing velocity of x
		ball.velocityY = 			 ball.speed * Math.sin(angleRad);			// and velocity of y
		ball.speed += 0.1;	//increase ball speed each time it faces a collision
	}

	//updating the score
	if (ball.x - ball.radius < 0){
		com.score++;
		resetBall();
	}
	else if(ball.x + ball.radius > canvas.width){
		user.score++;
		resetBall();
	}
}


//Controlling user paddle - done with a mouse 
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
	let rect = canvas.getBoundingClientRect();	

	user.y = evt.clientY - rect.top - user.height/2; // puts the paddle to be at the middle when following the mouse
}

//collision detection
function collision(b,p){		//b = ball, p = user or com
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width

	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.right = b.x + b.radius; 
	b.left = b.x - b.radius;

	return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}


function resetBall(){
	ball.x = canvas.width/2;
	ball.y = canvas.height/2;
	ball.speed = 5;
	ball.ball.velocityX = -ball.ball.velocityX;
}

