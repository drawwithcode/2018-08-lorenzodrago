var balls = [];
var bg, ballImg;
function preload() {
  bg = loadImage('bg.png');
  ballImg = loadImage('ball.png');
  shadow = loadImage('shadow.png');
}
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    noStroke();
    strokeWeight(1);
    rectMode(CENTER);
    setShakeThreshold(30);
    var ballNumber = 20;
    for (i=0;i<ballNumber;i++) {
        var newBall = new Ball(random(100,width-100),random(100,height-100),random(-3,3),random(-3,3),0,0,random(20,80));
        balls.push(newBall);

    }
    mouseX = width/2;
    mouseY = height/2;
    angleMode(DEGREES);
    colorMode(HSB);

}
var posX, posY, gravX, gravY;
var rectSize = 100;
var tutOver = false;
var shaken = false;
function draw() {
    shaken = false;
    background(200,30,30);
    image(bg,0,0, width, height);
    fill(50);
    gravX = map(rotationY, -90, 90, -0.5, 0.5);
    gravY = map(rotationX, -90, 90, -0.5, 0.5)
    push();
    noFill()
    stroke(200);
    //ellipse(width/2,height/2,70);
    translate(width/2,height/2);
    rotate(acos(gravX/gravY));
    //line(0,0,70,0);
    pop();

    for(j=0;j<balls.length;j++){
        var gravity = createVector(gravX*balls[j].mass,gravY*balls[j].mass);

        balls[j].applyForce(gravity);
        balls[j].update();

        if (shaken) {
            fill(200);
            balls[j].velocity.x += random(-3,3);
            balls[j].velocity.y += random(-3,3);
            tutOver=true;
        }
        balls[j].display();
        balls[j].checkEdges();

    }
    noStroke();
    textSize(20);
    textAlign(CENTER);
    if (!tutOver) {
      fill(0);
      fill(255);
      text('Tilt to affect gravity.', width/2, height*0.9-30);
      text('Shake to scatter.', width/2, height*0.9);
    }


}

function Ball(x,y,velX,velY,accX,accY,diameter) {
    this.color = [random(0,255), 80,90,1];
    this.diameter = diameter;
    this.position = createVector(x,y);
    this.velocity = createVector(velX,velY);
    this.acceleration = createVector(accX,accY);
    this.mass = this.diameter^2/1000;
    this.display = function() {
        noStroke();
        fill(200,30,20,0.5);
        //ellipse(this.position.x+gravX*40,this.position.y+gravY*40,this.diameter);
        image(shadow,this.position.x-this.diameter+gravX*40, this.position.y-this.diameter+gravY*40, this.diameter*2, this.diameter*2);
        fill(this.color);
        //stroke(255);
        ellipse(this.position.x,this.position.y,this.diameter);
        image(ballImg,this.position.x-this.diameter/2, this.position.y-this.diameter/2, this.diameter, this.diameter);
        //fill(255, 1);
        //ellipse(this.position.x-this.diameter/6,this.position.y-this.diameter/6,this.diameter/3);
    }
}

Ball.prototype.applyForce = function(force) {
  var f = p5.Vector.div(force,this.mass);
  this.acceleration.add(f);
};

Ball.prototype.update = function() {
  // Velocity changes according to acceleration
  this.velocity.add(this.acceleration);
  // position changes by velocity
  this.position.add(this.velocity);
  // We must clear acceleration each frame
  this.acceleration.mult(0);
};
var dampFactor = -0.8;
Ball.prototype.checkEdges = function() {
  if (this.position.y > (height - this.diameter/2)) {
    // A little dampening when hitting the bottom
    this.velocity.y *= dampFactor;
    this.velocity.x *= 0.99;
    this.position.y = (height - this.diameter/2);
  }
  if (this.position.x > (width - this.diameter/2)) {
    // A little dampening when hitting the bottom
    this.velocity.x *= dampFactor;
    this.velocity.y *= 0.99;
    this.position.x = (width - this.diameter/2);
  }
  if (this.position.y < (this.diameter/2)) {
    // A little dampening when hitting the bottom
    this.velocity.y *= dampFactor;
    this.velocity.x *= 0.99;
    this.position.y = (this.diameter/2);
  }
  if (this.position.x < (this.diameter/2)) {
    // A little dampening when hitting the bottom
    this.velocity.x *= dampFactor;
    this.velocity.y *= 0.99;
    this.position.x = (this.diameter/2);
  }


};
function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function deviceShaken() {
  shaken = true;
  //rect(100,100,100,100);
}
function mousePressed() {
    var fs = fullscreen();
    fullscreen(!fs);
}
