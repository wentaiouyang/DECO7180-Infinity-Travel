var myGamePiece;
var myObstacles = [];
var myScore;
var poppic = [];
var popdes = [];
var gallerypic = [];
var gallerydes = [];

function startGame() {
    myGamePiece = new component(100, 130,  "./statics/pixcel.png", 120, 120, "image");
    myGamePiece.gravity = 0.3;
    myScore = new component("20px", "Consolas", "black", 1200, 40, "text");
    myBackground = new component(1600, 700, "./statics/background.png", 0, 0, "background");
    myGameArea.start();
    
}

function RestartGame() {
    // reset();
    $(".gameoverbox").removeClass("fail");
    myGameArea.stop();
    myGameArea.clear();
    myGamePiece = {};
    myObstacles = [];
    myscore = {};
    document.getElementById("c").innerHTML = "";
    startGame()
    
}
    


// function reset(){
//     location.reload()
    
// }

var myGameArea = {
    canvas : document.getElementById("c"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        // document.body.insertBefore(this.canvas, document.body.childNodes[4]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (a) {
            myGameArea.key = a.keyCode;
        })
        window.addEventListener('keyup', function (a) {
            myGameArea.key = false;
            accelerate(0.4);
        })
        },

    stop : function() {
        clearInterval(this.interval);
        this.pause = true;
    },
    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    continue : function(){
        this.interval = setInterval(updateGameArea, 20);
        this.pause = false;
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image"||type == "background") {
            this.image = new Image();
            this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } if (type == "image"||type == "background") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
                if (type == "background"){
                    ctx.drawImage(this.image, 
                        this.x + this.width, 
                        this.y, 
                        this.width, 
                        this.height);
                }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
              this.x = 0;
            }
          }
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    this.hitTop = function() {
        var rocktop = 0;
        if (this.y < rocktop) {
            this.y = rocktop;
            this.gravitySpeed = 0.2;
        }
    }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
        
    }
}


function updateGameArea() {
    
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            // game over
            myGameArea.stop();
            console.log("crashed");
            $(".gameoverbox").addClass("fail");
            return;
            
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        // minHeight = 120;
        // maxHeight = 200;
        // height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 250;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(100, 100, "./statics/clock.png", x, 200*Math.random(), type="image"));
        myObstacles.push(new component(100, 100, "./statics/switch.png", x + 1000*Math.random(), 20 + gap, type="image"));
    }
    myBackground.speedX = -40;
    myBackground.newPos();    
    myBackground.update();
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -10;
        myObstacles[i].update();
    }
    if (myGameArea.key && myGameArea.key == 32) { accelerate(-2) }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
    // Every 1000 points, a photo will pop up
    if (myGameArea.frameNo%1000==0){
        myGameArea.stop();
        var picnum = Math.round(Math.random()*poppic.length);
            $(".poppic").addClass("active");
            $(".poppic").append(
                $('<img>').attr("src", poppic[picnum]),
            )
            poppic.pop(poppic[picnum]);
            gallerypic.push(poppic[picnum]);
            gallerydes.push(popdes[picnum]);
            console.log(gallerypic);
    }

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

// #####################################################

function getYear(year) {
	if(year) {
		return year.match(/[\d]{4}/); // This is regex (https://en.wikipedia.org/wiki/Regular_expression)
	}
}

function iterateRecords(data) {

	console.log(data);

	$.each(data.result.records, function(recordKey, recordValue) {

		var recordTitle = recordValue["dc:title"];
		var recordYear = getYear(recordValue["dcterms:temporal"]);
		var recordImage = recordValue["1000_pixel_jpg"];
		var recordDescription = recordValue["dc:description"];

		if(recordTitle && recordYear && recordImage && recordDescription) {

			if(recordYear < 1900) { 
                poppic.push(recordImage);
                popdes.push(recordDescription)
                console.log(poppic);
                console.log("Hi")

			}

        }
        

    });
    

	

}




$(document).ready(function() {

	var data = {
		resource_id: "8a327cf9-cff9-4b34-a461-6f883bdc3a48",
		limit: 1000
	}

	$.ajax({
		url: "https://www.data.qld.gov.au/api/3/action/datastore_search",
		data: data,
		dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
		cache: true,
		success: function(data) {
			iterateRecords(data);
		}
	});

    $(".gallery").click(function(){
        console.log("clicked")
        $(".gameoverbox").removeClass("fail");  
        $(".gallerypic").addClass("active");
        $(".game").addClass("notActive");
        $(".gallery").addClass("btnActive");
        $(".gamebtn").removeClass("btnActive");
        
    })

    $(".gamebtn").click(function(){
        console.log("clicked")
        $(".gameoverbox").removeClass("fail");  
        $(".gallerypic").removeClass("active");
        $(".game").removeClass("notActive");
        $(".gallery").removeClass("btnActive");
        $(".gamebtn").addClass("btnActive");
        $(".poppic img").remove();
        $(".poppic").addClass("notActive");
        $(".poppic").removeClass("active");
        
    })

    $(".poppic").click(function(){
        // click the pop up window to continue
        myGameArea.continue();
        $(".poppic").removeClass("active");
        $(".poppic img").remove();
        console.log(gallerypic[0]);
        $("#pictures").append(
            $('<a class="record strip">').attr("href", gallerypic[gallerypic.length-1])
            .attr( "data-strip-caption", gallerydes[gallerypic.length-1])
            .attr("data-strip-options", "side: 'top'")
            .append(
                $('<img>').attr("src", gallerypic[gallerypic.length-1]),
            )
        )
        })

    
});

// ###############################################

