//Create variables here
var dog, happyDog
var database
var foodS, foodStock, feedPet, addFood, foodObj;
var fedTime, lastFed;

function preload() {

  //load images here
  dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
}

function setup() {
  database = firebase.database();

  createCanvas(500, 500);

  foodObj = new Food();

  dog = createSprite(400,330,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.25;
  
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed The Dog");
  feed.position(500,15);
  feed.mousePressed(feedPet);

  add = createButton("Add Food")
  add.position(400,15)
  add.mousePressed(addFood)
}


function draw() {  
  background(46, 139, 87);

  foodObj.display();

  //add styles here
  fill("blue");
  textSize(15);
  stroke(5);

  text("FOOD REMAINING: " + foodS, 170,60);

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Fed: "+ lastFed%12 + "PM", 350, 30);
  } else if(lastFed===0){
    text("Last Fed: 12AM", 350, 30);
  } else{
    text("Last Fed:"+ lastFed + "AM", 350, 30);
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });


  drawSprites();
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedPet(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  } else {
    x=x-1;
  }

  database.ref('/').update({
    Food: x
  })
}