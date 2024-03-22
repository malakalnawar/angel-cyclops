//vars
var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var collectables;
var canyons;
var mountains;
var clouds;
var trees;

var flagpole;

var treePos_y;
var trees_x;

var cameraPosX;

var game_score;
var lives;

var jumpSound;

var enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //sounds
    jumpSound = loadSound('assets/jump-2.mp3');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);

    floorPos_y = height * 3/4;
    
    lives = 3;
    
    startGame(); 
}

function draw()
{
    //////////drawing code//////////
    
    //camera follows character's movement
    if (isLeft == true)
        {
            cameraPosX -= 5;
        }
    if (isRight == true)
        {
            cameraPosX += 5;
        }
    
    //draw blue sky
	background(100,155,255);

    //draw green ground
	noStroke();
	fill(66,106,90);
	rect(0, floorPos_y, width, height - floorPos_y);
            
    //scrolling - start
    push();
    translate(-cameraPosX, 0);
    
    //draw mountains
    for(var i = 0; i < mountains.length; i++)
        {
            mountains[i].draw();
        }
    
    //draw clouds
    for(var i = 0; i < clouds.length; i++)
        {
            clouds[i].draw();
        }
    
    //draw trees
    for(var i = 0; i < trees.length; i++)
        {
            trees[i].draw();
        }
    
    //draw "infinite nothing" sign
    fill(0);
    rect(-1000, floorPos_y - 50, 5, 50);
    rect(-1040, floorPos_y - 80, 80, 30);
    fill(255);
    textSize(9);
    text("infinite nothing", -1030, floorPos_y - 62);
    
    //draw & check the flagpole
    renderFlagpole();
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }
    
	//draw & check the canyon
    for(var i = 0; i < canyons.length; i++)
        {
            canyons[i].draw();
            checkCanyon(canyons[i]);
        }

    //draw & check the collectable
    for(var i = 0; i < collectables.length; i++)
        {
            if(collectables[i].isFound == false)
                {
                    collectables[i].draw();
                    checkCollectable(collectables[i]);
                }
        }
    
	//draw the game character
    drawGameChar();
    
    //draw enemies
    for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].draw();
            
            var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
            
            if(isContact)
                {
                    if(lives > 0)
                        {
                            lives -= 1;
                            startGame();
                            break;
                        }
                }
        }
    
    //scrolling - end
    pop();
    
    //gameover & level complete
    if(gameChar_y > height * 1.5 && lives == 0)
        {
            fill(255);
            noStroke();
            text("Game over. Refresh to play again.", width/2, height/2);
            return
        }
    if(flagpole.isReached == true)
        {    
            fill(255);
            noStroke();
            text("Well done! Refresh to play again.", width/2, height/2);
            text("Your score: " + game_score + "!", width/2, height/2 + 25);
            return
        }
    
	//////////interaction code//////////
    
    //move game character left & right
    if (isLeft == true)
        {
            gameChar_x -= 5;
        }
    if (isRight == true)
        {
            gameChar_x += 5;
        }
    
    //move charcater up - jumping
    if (isFalling == true && gameChar_y <= floorPos_y)
        {
            gameChar_y -= 6;
        }
    
    //move charcater down - falling
    if (isPlummeting == true && gameChar_y != floorPos_y)
        {
            gameChar_y += 2;
            isFalling = false;
        }
    
    //stop falling when charcater returns to floorPos_y
    if (gameChar_y >= floorPos_y)
        {
            isPlummeting = false;
        }
    //jump limit set to 100 pixils above floorPos_y
    else if (gameChar_y <= floorPos_y - 100)
        {
            isFalling = false;
            isPlummeting = true;
        }
    
    //game score
    fill(255);
    noStroke();
    text("score: " + game_score, 20, 20);
    
    //lives counter
    fill(255);
    noStroke();
    text("lives: " + lives, width/2, 20);
    
    //GAMEOVER
    if (gameChar_y > height)
        {
            isLeft = false;
            isRight = false;
        }
    
    //players lives
    checkPlayerDie();
}


function keyPressed()
{
    //left arrow key
    if (keyCode == 37)
        {
            isLeft = true;
        }
    //right arrow key
    if (keyCode == 39)
        {
            isRight = true;
        }
    //up arrow key + no double jumps
    if (keyCode == 38 && isPlummeting == false && gameChar_y == floorPos_y)
        {
            isFalling = true;
            jumpSound.play();
        }
}

function keyReleased()
{
    if (keyCode == 37)
        {
            isLeft = false;
        }
    
    if (keyCode == 39)
        {
            isRight = false;
        }
    
    if (keyCode == 38)
        {
            isFalling = false;
            isPlummeting = true;
        }
}

function drawGameChar()
{
    	if(isLeft && isFalling)
	{
		//jumping-left
        stroke(0);
        strokeWeight(1);
        fill(255, 238, 221);
        ellipse(gameChar_x, gameChar_y - 50, 20, 20);
        fill(255);
        ellipse(gameChar_x - 8, gameChar_y - 50, 3, 6);
        fill(0);
        ellipse(gameChar_x - 9, gameChar_y - 51, 1, 1);
        fill(143, 101, 147);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 27.5);
        fill(255);
        triangle(gameChar_x + 5, gameChar_y - 35, gameChar_x + 20, gameChar_y - 25, gameChar_x + 15, gameChar_y - 45);
        triangle(gameChar_x + 5, gameChar_y - 32.5, gameChar_x + 20, gameChar_y - 22.5, gameChar_x + 15, gameChar_y - 42.5);
        stroke(255, 215, 0);
        noFill();
        ellipse(gameChar_x, gameChar_y - 65, 15, 6);
	}
	else if(isRight && isFalling)
	{
		//jumping-right
        stroke(0);
        strokeWeight(1);
        fill(255, 238, 221);
        ellipse(gameChar_x, gameChar_y - 50, 20, 20);
        fill(255);
        ellipse(gameChar_x + 8, gameChar_y - 50, 3, 6);
        fill(0);
        ellipse(gameChar_x + 9, gameChar_y - 51, 1, 1);
        fill(143, 101, 147);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 27.5);
        fill(255);
        triangle(gameChar_x - 5, gameChar_y - 35, gameChar_x - 20, gameChar_y - 25, gameChar_x - 15, gameChar_y - 45);
        triangle(gameChar_x - 5, gameChar_y - 32.5, gameChar_x - 20, gameChar_y - 22.5, gameChar_x - 15, gameChar_y - 42.5);
        stroke(255, 215, 0);
        noFill();
        ellipse(gameChar_x, gameChar_y - 65, 15, 6);
	}
	else if(isLeft)
	{
		//walking left
        stroke(0);
        strokeWeight(1);
        fill(255, 238, 221);
        ellipse(gameChar_x, gameChar_y - 50, 20, 20);
        fill(255);
        ellipse(gameChar_x - 8, gameChar_y - 50, 3, 6);
        fill(0);
        ellipse(gameChar_x - 9, gameChar_y - 50, 1, 1);
        fill(143, 101, 147);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 27.5);
        fill(255);
        triangle(gameChar_x + 5, gameChar_y - 35, gameChar_x + 20, gameChar_y - 45, gameChar_x + 15, gameChar_y - 25);
        triangle(gameChar_x + 5, gameChar_y - 32.5, gameChar_x + 20, gameChar_y - 42.5, gameChar_x + 15, gameChar_y - 22.5);
        stroke(255, 215, 0);
        noFill();
        ellipse(gameChar_x, gameChar_y - 65, 15, 6);
	}
	else if(isRight)
	{
		//walking right
        stroke(0);
        strokeWeight(1);
        fill(255, 238, 221);
        ellipse(gameChar_x, gameChar_y - 50, 20, 20);
        fill(255);
        ellipse(gameChar_x + 8, gameChar_y - 50, 3, 6);
        fill(0);
        ellipse(gameChar_x + 9, gameChar_y - 50, 1, 1);
        fill(143, 101, 147);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 27.5);
        fill(255);
        triangle(gameChar_x - 5, gameChar_y - 35, gameChar_x - 20, gameChar_y - 45, gameChar_x - 15, gameChar_y - 25);
        triangle(gameChar_x - 5, gameChar_y - 32.5, gameChar_x - 20, gameChar_y - 42.5, gameChar_x - 15, gameChar_y - 22.5);
        stroke(255, 215, 0);
        noFill();
        ellipse(gameChar_x, gameChar_y - 65, 15, 6);
	}
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards
        stroke(0);
        strokeWeight(1);
        fill(255, 238, 221);
        ellipse(gameChar_x, gameChar_y - 50, 20, 20);
        fill(255);
        ellipse(gameChar_x, gameChar_y - 50, 10, 6);
        fill(0);
        ellipse(gameChar_x, gameChar_y - 51, 3, 3);
        fill(143, 101, 147);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 27.5);
        fill(255);
        triangle(gameChar_x + 5, gameChar_y - 35, gameChar_x + 20, gameChar_y - 25, gameChar_x + 15, gameChar_y - 45);
        triangle(gameChar_x - 5, gameChar_y - 35, gameChar_x - 20, gameChar_y - 25, gameChar_x - 15, gameChar_y - 45);
        stroke(255, 215, 0);
        noFill();
        ellipse(gameChar_x, gameChar_y - 65, 15, 6);
	}
	else
	{
		//standing front facing
        stroke(0);
        strokeWeight(1);
        fill(255, 238, 221);
        ellipse(gameChar_x, gameChar_y - 50, 20, 20);
        fill(255);
        ellipse(gameChar_x, gameChar_y - 50, 10, 6);
        fill(0);
        ellipse(gameChar_x, gameChar_y - 50, 3, 3);
        fill(143, 101, 147);
        rect(gameChar_x - 5, gameChar_y - 40, 10, 27.5);
        fill(255);
        triangle(gameChar_x + 5, gameChar_y - 35, gameChar_x + 20, gameChar_y - 45, gameChar_x + 15, gameChar_y - 25);
        triangle(gameChar_x - 5, gameChar_y - 35, gameChar_x - 20, gameChar_y - 45, gameChar_x - 15, gameChar_y - 25);
        stroke(255, 215, 0);
        noFill();
        ellipse(gameChar_x, gameChar_y - 65, 15, 6);
	}
}

function createClouds(z)
{
    cloud = {
        x: 250 + (random(150, 250) * z),
        y: random(0, 220),
        size: random(20, 40),

        draw: function()
        {
            fill(255);
            ellipse(this.x + 15, this.y + 50, this.size + 20);
            ellipse(this.x - 5, this.y + 50, this.size + 10);
            ellipse(this.x - 25, this.y + 50, this.size);
            ellipse(this.x + 35, this.y + 50, this.size + 10);
            ellipse(this.x + 55, this.y + 50, this.size); 
        }
        
    }
    
    return cloud
}

function createMountains(z)
{
    mountain = {
        x: 350 + (random(100, 400) * z),
        size: random(0.5, 30),
        opacity: random(155, 255),
        
        draw: function()
        {
            fill(115, 115, 115, this.opacity);
            triangle((this.x), floorPos_y, //origin point
                    (this.x + 100) + 0.5 * this.size, (floorPos_y - 150) - this.size,
                    (this.x + 200) + this.size, floorPos_y);
        }
    }
    
    return mountain
}

function createTrees(z)
{
    tree = {
        x: 450 + (random(45, 450) * z),
        y: treePos_y,
        
        draw: function()
        {
            fill(100, 50, 15);
            rect(this.x - 14, this.y - 106, 25, 106);
            fill(127, 182, 133);
            triangle(this.x - 60, this.y - 106, this.x, this.y - 196, this.x + 60, this.y + - 106);
            triangle(this.x - 60, this.y - 136, this.x, this.y - 226, this.x + 60, this.y -136);
            triangle(this.x - 60, this.y - 166, this.x, this.y - 286, this.x + 60, this.y - 166);  
        }
    }
    
    return tree
}

function createCanyons(z)
{
    canyon = {
        x: (250 + random(300, 500) * z),
        width: 100,
        
        draw: function()
        {
            fill(155, 118, 83);
            rect(this.x, 432, this.width, 250); 
        }
    }
    
    return canyon
}

function checkCanyon(t_canyon)
{
    //character falls in the canyon
    if (gameChar_x > t_canyon.x && gameChar_x < (t_canyon.x + t_canyon.width) && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
            isFalling = false;
            gameChar_y += 30;
        }
}

function createCollectable(z1, z2)
{
    collectable = {
        x: (500 * z1) - (3000 * z2),
        y: random(412, 312),
        size: 25,
        isFound: false,
        
        draw: function()
        {
            if(this.isFound == false)
                {
                    stroke(255, 215, 0);
                    strokeWeight(3);
                    noFill();
                    ellipse(this.x, this.y, this.size - 10, this.size);
                }
        }
    }
    
    return collectable
}

function checkCollectable(t_collectable)
{
    //character collects halo
    if(dist(gameChar_x, gameChar_y, t_collectable.x, t_collectable.y) < 25)
        {
            t_collectable.isFound = true;
            game_score += 1;
        }
}

function renderFlagpole()
{
    if(flagpole.isReached == true)
        {
            push();
            stroke(116, 119, 107);
            strokeWeight(4);
            line(flagpole.x_pos, floorPos_y, flagpole.x_pos, 200);
            noStroke();
            fill(242, 100, 25);
            rect(flagpole.x_pos - 80, floorPos_y - 232, 80, 50);
            pop();
        }
}

function checkFlagpole()
{
    //character reaches flagpole
    if(dist(gameChar_x, floorPos_y, flagpole.x_pos, floorPos_y) < 25)
        {
            flagpole.isReached = true;
        }
}

function checkPlayerDie()
{
    //restart game when character falls
    if(gameChar_y > height && lives > 0)
        {
            lives -= 1;
            startGame();
        }
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
            
    treePos_y = floorPos_y;
    
    cameraPosX = 0;

    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    //setup flagpole
    flagpole = {
        x_pos: 5000,
        isReached: false,
    }
    
    //setup mountains
    mountains = [];
    for(var i = -2; i < 20; i++)
        {
            mountains.push(createMountains(i));
        }
    
    //setup clouds
    clouds = [];
    for(var i = -2; i < 20; i++)
        {
            clouds.push(createClouds(i));
        }
    
    //setup trees
    trees = [];
    for(var i = -2; i < 20; i++)
        {
            trees.push(createTrees(i));
        }
    
    //setup canyons
    canyons = [];
    for(var i = -2; i < 20; i++)
        {
            canyons.push(createCanyons(i));
        }
    
    //setup collectables
    collectables = [];
    for(var i = -2; i < 20; i++)
        {
            collectables.push(createCollectable(i,0));
        }
    //jackpot collectables
    for(var i = 0; i < 30; i++)
        {
            collectables.push(createCollectable(0,1));
        }
    
    //setup enemies
    enemies = [];
    for(var i = -2; i < 20; i++)
        {
            enemies.push(new Enemy(200 + (i * 400), floorPos_y - random(0, 100), random(200, 400)));
        }
    
    game_score = 0;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 1;
            }
    }
    
    this.draw = function()
    {
        this.update();
        
        if(this.inc == 1)
            {
                //walking right
                stroke(0);
                strokeWeight(1);
                fill(0);
                ellipse(this.currentX, this.y - 50, 20, 20);
                fill(255);
                ellipse(this.currentX + 8, this.y - 50, 3, 6);
                fill(0);
                ellipse(this.currentX + 9, this.y - 50, 1, 1);
                fill(0);
                rect(this.currentX - 5, this.y - 40, 10, 27.5);
                fill(0);
                triangle(this.currentX - 5, this.y - 35, this.currentX - 20, this.y - 45, this.currentX - 15, this.y - 25);
                triangle(this.currentX - 5, this.y - 32.5, this.currentX - 20, this.y - 42.5, this.currentX - 15, this.y - 22.5);
            }
        else if(this.inc == -1)
            {
                //walking left
                stroke(0);
                strokeWeight(1);
                fill(0);
                ellipse(this.currentX, this.y - 50, 20, 20);
                fill(255);
                ellipse(this.currentX - 8, this.y - 50, 3, 6);
                fill(0);
                ellipse(this.currentX - 9, this.y - 50, 1, 1);
                fill(0);
                rect(this.currentX - 5, this.y - 40, 10, 27.5);
                fill(0);
                triangle(this.currentX + 5, this.y - 35, this.currentX + 20, this.y - 45, this.currentX + 15, this.y - 25);
                triangle(this.currentX + 5, this.y - 32.5, this.currentX + 20, this.y - 42.5, this.currentX + 15, this.y - 22.5);
            }
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 20)
            {
                return true;
            }
        else
            {
                return false;
            }
    }
}
