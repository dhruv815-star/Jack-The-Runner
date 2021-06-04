var jack, jackAnimation, jackJump, jackEnd, edges;
var desert, desrtImg,bg,bgImg;
var invisibleblock1,invisibleblock2, invisibleblock3;
var cloudImg,land1Img,land2Img,land3Img,cactus1Img,cactus2Img;

var bottle, bottleImg, coin, coinImg, playSound, playSoundA,stopSoundA;

var waterLeft=30;
var coins=0;
var score=0;

var PLAY=1;
var END=0;
var gameState=PLAY;

var bgSound, bonusSound;

function preload()
{
    jackAnimation= loadAnimation("manrun/0001.png","manrun/0002.png","manrun/0003.png","manrun/0004.png","manrun/0005.png",
    "manrun/0006.png","manrun/0007.png","manrun/0008.png","manrun/0009.png","manrun/0010.png","manrun/0011.png",
    "manrun/0012.png","manrun/0013.png","manrun/0014.png","manrun/0015.png","manrun/0016.png","manrun/0017.png",
    "manrun/0018.png","manrun/0019.png");

    jackJump= loadAnimation("manrun/0008.png");
    jackEnd= loadAnimation("gameover.png");

    desertImg= loadImage("DesertLand.png");
    bgImg= loadImage("sky.png");

    cloudImg= loadImage("cloud.png");
    land1Img= loadImage("upLand1.png");
    land2Img= loadImage("upLand2.png");
    land3Img= loadImage("upLand3.png");
    cactus1Img= loadImage("cactus1.png");
    cactus2Img= loadImage("cactus2.png");

    bottleImg=loadImage("bottle.png");
    coinImg= loadImage("coin.png");
    playSoundA= loadAnimation("playSound.png");
    stopSoundA= loadAnimation("stopSound.png");

    //bgSound=loadSound("bgSound.mp3");
    bonusSound=loadSound("bonusSound.mp3");
}

function setup()
{
    createCanvas(800,800);
    
    bg= createSprite(400,1000);
    bg.addImage(bgImg);
    bg.scale=2;

    edges= createEdgeSprites();

    //creating jack.
    jack=createSprite(100,700);
    jack.addAnimation("boy", jackAnimation);
    jack.addAnimation("jump", jackJump);
    jack.addAnimation("end", jackEnd);
    jack.scale=0.3;

    jack.setCollider("rectangle",0,0,200,jack.height+460);
    jack.debug= false;

    //creating ground.
    desert= createSprite(500,800);
    desert.addImage("ground", desertImg);
    desert.scale= 2;
    //desert.velocityX=-2;
    
    //Bottle icon of water score
    bottle= createSprite(50,100);
    bottle.addImage(bottleImg);
    bottle.scale=0.5;

    //coin icon of coin score
    coin= createSprite(50,180);
    coin.addImage(coinImg);
    coin.scale=0.03;

    //creating sound icon.
    //playSound=createSprite(50,40);
    //playSound.addAnimation("play", playSoundA);
    //playSound.addAnimation("stop", stopSoundA);
    //playSound.scale=0.03;

    invisibleblock1= createSprite(100,770,800,20);
    invisibleblock1.visible= false;

    //creating all groups.
    cloudG= new Group();
    landG= new Group();
    iBlockG= new Group();
    iBlockG3= new Group();
    cactusG= new Group();
    bottle1G= new Group();
    coin1G= new Group();
    reloadG= new Group();
}

function draw()
{

    console.log("this is gameState "+ gameState);

    if(gameState === PLAY)
    {
        background("white");

        //score Increment.
        score = Math.round(frameCount/5);

        //infinite background
        desert.velocityX= -( 4 + score/300);

        if(desert.x < 200)
        {
           desert.x = desert.width/2;
        }
        
        //seeming to jump from ground.
        jack.collide(invisibleblock1);
        jack.collide(iBlockG);
        jack.collide(edges);

        //motion of jack.
        if(keyDown("space"))
        {
            jack.velocityY = -12;
            jack.changeAnimation("jump", jackJump);
        }
        else
        {
            jack.changeAnimation("boy", jackAnimation);
        }

        jack.velocityY += 0.8;

        //jack touching bottle and coins.
        if(bottle1G.isTouching(jack))
        {
            bottle1G.destroyEach();
            waterLeft += 10;
            bonusSound.play();
        }

        if(coin1G.isTouching(jack))
        {
            coin1G.destroyEach();
            coins += 20;
            bonusSound.play();
        }

        //jack touching cactus.
        if(cactusG.isTouching(jack))
        {
            waterLeft -= 20;
            cactusG.destroyEach();
        }

        //jack touching bottom of the lands
        if(iBlockG3.isTouching(jack)||waterLeft <= 0)
        {
            gameState=END;
            waterLeft=0;
        }

        spawnClouds();
        spawnLand();
        spawnObstacle();
        spawnCoins();
    }

    //game state end.

    if(gameState === END)
    {
        jack.changeAnimation("end", jackEnd);
        jack.x=400;
        jack.y=400;
        jack.setVelocity(0,0);
        jack.scale=1.5;

        desert.velocityX=0;

        //destroying all groups.
        cloudG.destroyEach();
        landG.destroyEach();
        bottle1G.destroyEach();
        coin1G.destroyEach();
        cactusG.destroyEach();
        iBlockG.destroyEach();
        iBlockG3.destroyEach();

    }

    //pressing reload icon.
    if(keyDown("R") && gameState===END)
    {
        gameState= PLAY;
        score=0;
        waterLeft=30;
        coins=0;

        jack.changeAnimation("boy", jackAnimation);
        jack.x=100;
        jack.y=700;
        jack.scale=0.3;

        frameCount = 0;
    }
    

    drawSprites();

    //waterLeft score.
    fill("black");
    textSize(20);
    text(waterLeft, 80,120);

    //coin score.
    fill("yellow");
    textSize(20);
    text(coins, 90,180);

    //distance score.
    fill("black");
    textSize(20);
    text("Distance: "+ score, 600,100);

    if(gameState===END)
    {
        fill("red");
        textSize(20);
        text("Press R to replay", 300,500);
    }

}

function spawnClouds()
{
    if(frameCount % 100 === 0)
    {
        var cloud= createSprite(800,400);
        cloud.addImage(cloudImg);
        cloud.y= Math.round(random(200,400));
        cloud.scale=0.1;
        cloud.velocityX= -(4+ score/300);
        cloud.lifetime=200;
        cloudG.add(cloud);

        jack.depth= cloud.depth;
        jack.depth += 1;
    }
}

function spawnLand()
{
    if(frameCount % 170 === 0)
    {
        var land= createSprite(800,400);
        land.y= Math.round(random(500,600));
        land.velocityX=-(4+ score/300);
        land.lifetime=200;

        landG.add(land);

        invisibleblock2= createSprite(800,400);
        invisibleblock3= createSprite(800,600);
        

        var rnd= Math.round(random(1,3));

        switch(rnd)
        {
            case 1 : land.addImage(land1Img);
                     land.scale=0.5;
                     invisibleblock2.y = land.y-20;
                     invisibleblock2.width= land.width-120;

                     invisibleblock3.width= land.width-150;
                     invisibleblock3.y = land.y+20;

                     
                     //creating bottle on the small land.
                     var bottle1 = createSprite(800,200);
                     bottle1.addImage(bottleImg);
                     bottle1.y= land.y -40;
                     bottle1.velocityX= -(4 + score/300);
                     bottle1.scale=0.5;
                     bottle1G.add(bottle1);
                    break;
            case 2 : land.addImage(land2Img);
                     land.scale=0.6;
                     invisibleblock2.y = land.y-30;
                     invisibleblock2.width= land.width-100;

                     invisibleblock3.y = land.y+30;
                     invisibleblock3.width= land.width-180;
                    break; 
            case 3 : land.addImage(land3Img);
                     land.scale=0.4;
                     invisibleblock2.y = land.y-30;
                     invisibleblock2.width= land.width-170;

                     invisibleblock3.y = land.y+30;
                     invisibleblock3.width= land.width- 220;
                    break; 
            default : break;           
        }

        invisibleblock2.velocityX= -(4+ score/300);
        invisibleblock2.debug = false;
        invisibleblock2.height=2;
        invisibleblock2.lifetime=200;
        invisibleblock2.visible=false;
        iBlockG.add(invisibleblock2);

        invisibleblock3.velocityX= -(4+ score/300);
        invisibleblock3.debug = false;
        invisibleblock3.visible=false;
        invisibleblock3.height=2;
        invisibleblock3.lifetime=200;
        iBlockG3.add(invisibleblock3);
    }
}

function spawnObstacle()
{
    if(frameCount % 300 === 0)
    {
        var cactus= createSprite(800,750);
        cactus.velocityX= -(4+ score/300);
        cactus.lifetime=200;

        cactusG.add(cactus);
        cactus.setCollider("rectangle",0,0,50,cactus.height);
        cactus.debug=false;

        var rd= Math.round(random(1,2));

        switch(rd)
        {
            case 1 : cactus.addImage(cactus1Img);
                     cactus.scale=0.8;
                     cactus.y= 740;
                    break;
            case 2 : cactus.addImage(cactus2Img);
                     cactus.scale=0.3;
                    break;
            default : break;
        }
    }
}

function spawnCoins()
{
    if(frameCount % 400 === 0)
    {
        for (var i=800; i<840; i=i+40)
        {
            var coin1= createSprite(i,750);
            coin1.addImage(coinImg);
            coin1.scale=0.02;
            coin1.velocityX= -(4+ score/300);

            coin1G.add(coin1);
        }
    }
}