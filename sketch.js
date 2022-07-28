
//------windows.onload : web sayfasi acinca oyun Baslatma funksiyonu
window.onload = function(){                                                     //--------- windows(web penceresi)  Hazirlinca gerceklesen function ---
    var canvasWidth = 900;
    var canvasHeight = 450;
    var blockSize = 30;
    var ctx;
    var delay=180;
    var xCoord = 0;
    var yCoord = 0;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeOut;

    init();
    function init(){                                                           //-----------Baslatma funksiyonu--------
        var canvas = document.createElement('canvas');                          //----------Create Canvas element from Html windows docs
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid  #4d0000";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#690051";
        document.body.appendChild(canvas);                                      //-----------canvas body'ya takmak
        ctx = canvas.getContext('2d');                                          //----------- calisma alani elde etme
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");            // ----------snakee Yeni snake nesnesini create etmek
        applee = new Apple([10,10]);                                            //-----------yeni apple nesnesini create etmek
        score= 0;
        refreshCanvas();
    }

    function refreshCanvas(){
                                                                                //---------Canvas Yenileme funksiyonu-------------
        snakee.advance();
        if (snakee.checkCollision()){
            gameOver();
            delay=180;
        } else {
            if (snakee.isEatingApple(applee)){
                score++;
                switch(score) {
                case 5:  delay=150;
                  break;
                case 10:  delay=120;
                  break;
                case 15:  delay=100;
                  break;
                case 20:  delay=80;
                  break;
                case 25:  delay=60;
                  break;
                case 30:  delay=50;
                  break;
                case 35:  delay=30;
                  break;
                default: delay=delay;

                }

                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                } while(applee.isOnSnake(snakee));
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas,delay);
         }
    }

    function gameOver(){                                                        //---------oyun bitirme fonksiyon
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX, centreY - 180);                    //------metnin pozisiyon ayarlamak icin centreX ve centreY kullanildi
        ctx.fillText("Game Over", centreX, centreY - 180);                      //-----metnin pozisiyon ayarlamak icin centreX ve centreY kullanildi
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Space pour rejouer", centreX, centreY - 110);//----------
        ctx.fillText("Appuyer sur la touche Space pour rejouer", centreX, centreY - 110);  //-------
        ctx.restore();
    }

    function restart(){                                                         // --Tekralama Funcksiyonu ---------------
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }
    //---------------END OF RESTAR--------------

  function drawScore(){                                                       //--------------
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();

    }


//------------------END OF drawScore---------------

    function drawBlock(ctx, position){                                          //------Yer Degistirme Funksiyonu----------
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);

    }
//------------------END OF drawBlock-------------

    function Snake(body, direction){                                            //---Snakeleri olusturucu*** new kullanarak yeni snake elde edilebilir
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle="#ff0000";
            for (var i=0 ; i < this.body.length ; i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };

        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections=["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirections=["left","right"];
                    break;
               default:
                    throw("invalid direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
	//-----------End Of Snake Object-------------------------------------------


        this.checkCollision = function(){                                   //----SNAKE KONTROL EDEN FUNCTİON,CANVASTAN CİKAMSİN; CİKİYORSA OYUN BİTER
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCollision = true;

            for (var i=0 ; i<rest.length ; i++){
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }

            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        }

    }

    //------------------------------------------------------------------------------------APPLE Snakelerin Yemegi----

    function Apple(position){                                                   //--------elma olusturucu-----

        this.position = position;                                               // --------burda direk olarak----

        this.draw = function(){
          ctx.save();
          ctx.fillStyle = "#33cc33";
          ctx.beginPath();
          var radius = blockSize/2;
          var x = this.position[0]*blockSize + radius;
          var y = this.position[1]*blockSize + radius;
          ctx.arc(x, y, radius, 0, Math.PI*2, true);
          ctx.fill();
          ctx.restore();
        };

    this.setNewPosition = function(){
        var newX = Math.round(Math.random()*(widthInBlocks-1));
        var newY = Math.round(Math.random()*(heightInBlocks-1));
        this.position = [newX,newY];
        };
        this.isOnSnake = function(snakeToCheck){
        var isOnSnake = false;
        for (var i=0 ; i < snakeToCheck.body.length ; i++){
        if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
        isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

//-------------------------------------------------------------------------------End OF Apple Constructor Function-----

	function myFunction(){
      if(document.getSelection===1){
		  gameOver();
	  }
	}
  //------------------------------------------------------------------------------End------------------------
  document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    };
}


//--------------------------ANİMATİON------------------

let v=0.125;
let x1=10;y1=10;
let x2=40;y2=10;
let x3=10;y3=40;
let x4=40;y4=40;
let anim;

function setup() {
  createCanvas(50, 50).position(440,10);
 anim=new Animation();

}

function draw() {
  background("grey");
  v=v+0.125;
anim.animate();

}

class Animation {
 animate(){
  noSmooth();
  fill("green");
  circle(x1+v,y1+v,10,10);
  fill("yellow");
  circle(x2-v,y2+v,10,10);
  fill("red");
  circle(x3+v,y3-v,10,10);
  fill("blue");
  circle(x4-v,y4-v,10,10);
   if((x1+v)==40){
 v=-0.125;

  }
}
}

//-----------------------END--OF ANİMATİON---------------------------------
