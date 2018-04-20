"use strict";

class Vector {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    plus(vector){
        if(vector.instanceOf(Vector)){
            return new Vector(this.x + Vector.x, this.y + Vector.y);
        }
        throw new Error('Можно прибавлять к вектору только вектор типа Vector');    
    }

    times(factor){
        return new Vector(this.x * factor, this.y * factor);
    }
}


/* size = typeof Vector,  location = typeof Vector, speed = typeof Vector*/
class Actor {
    constructor(location = new Vector(), size = new Vector(), speed = new Vector()) {
      if(!(location.instanceOf(Vector)) || (size.instanceOf(Vector)) || speed.instanceOf(Vector)){
        throw new Error('Неверный тип данных, задайте аргументам тип Vector');
      }
      this.pos = location;
      this.size = size;
      this.speed = speed;

    }

    get type() {
      return 'actor';
    }
  
    get left() {//границы объекта по X
      return this.pos.x;
    }
  
    get right() {//границы объекта по X + размер
      return this.pos.x + this.size.x;
    }
  
    get top() { //границы объекта по Y
      return this.pos.y;
    }
  
    get bottom() { //границы объекта по Y + размер
      return this.pos.y + this.size.y
  }

    act(){
    }

    isInterest(actor){
      if(actor != new Actor() || actor == undefined){
        throw new Error('Аргумент должен соответсвовать типу Actor');
      }
      //Если передать тот же объект то вернуть false, Объект не пересекается сам с собой
      if(this === actor){
        return false;
      }  
    }

}

class Level {
  constructor(grid, actors) {
    if(grid != undefined) {
      this.grid = grid.slice();
    } else {
      this.grid = [];
    }
    this.actors = actors;

    this.player = this.actors.find(actor => actor.type === 'player');

      //Высота поля
      this.height = this.grid.length;

      //Ширина поля
      this.width = this.grid.reduce(function(sum, current) {
        if (sum > current.length) {
          return sum;
        } else {
          return current.length;
        }
      }, 0);
    

     ///состояние прохождения уровня, равное null после создания.
    this.status = null;

     //таймаут после окончания игры, равен 1 после создания. Необходим, чтобы после выигрыша или проигрыша игра не завершалась мгновенно.
    this.finishDelay = 1;
  }

  isFinished() {
    ((status != null) || (finishDelay < 0)) ? true : false;
  }

  actorAt(actor) {
    for(let actorObj of Actor) {
      if(actor.isIntersect(actorObj)) {
        return actorObj;
      }
      if(actor == undefined || (!(actor.instanceOf(Actor)))) {
        throw new Error("Передан неверный аргумент");
      }
      if(!(actor.isIntersect(actorObj))){
        return undefined;
      }
      if(actor.isIntersect(actorObj.length > 1)){
        return actor;
      }
    }
  }

  obstacleAt(positionTo, size){
    if(!(positionTo.instanceOf(Vector) || size.instanceOf(Vector))) {
      throw new Error("Неверный тип аргументов");
    }
    let actor = new Actor(positionTo, size);
    let level = new Actor(new Vector(), new Vector(this.width, this.height));
    if (actor.bottom > level.bottom) {
      return "lava";
    }
    if (actor.left < level.left || actor.right > level.right || actor.top < level.top) {
      return "wall";
    }
    return undefined;
  }

  removeActor(actor){
    var index = this.actors.indexOf(actor); //возвращает индекс объекта
    this.actors.splice(index, 1);
    return this.actors;
  }

  noMoreActors(type){
    for(let actorOn of this.actors) {
      if(actorOn.type === type) {
        return false;
      }
      if(actorOn.type !== type) {
        return true;
      }
    }
  }

  playerTouched(type, actor) {
    if (this.status !== null) {
      return;
    }
    if (type === "lava" || type === "fireball") {
      this.status = "lost";
    }
    if (type === 'coin') {
      this.removeActor(actor);
    }
    if (this.noMoreActors("coin")) {
      this.status = "won";
    }
  }

  
}

class LevelParser {
  //Принимает один аргумент — словарь движущихся объектов игрового поля, объект, ключами которого являются символы из текстового представления уровня, а значениями — конструкторы, с помощью которых можно создать новый объект.
  constructor(library) {
    this.library = library;
  }
  
  actorFromSymbol(symbol) {
    if(symbol == undefined) {
      return undefined;
    }
    return this.library[symbol];
  }

  obstacleFromSymbol(symbol) {
    if(symbol = "x") {
      return 'wall';
    } else if(symbol = "!") {
      return "lava";
    }
  }
 // Игровое поле
  createGrid(strings = []) {
  return strings.map(row => row.split('').map(symbol => this.obstacleFromSymbol(symbol)));
}

  
  createActors(strings = []) {
    var actor, actors = [], moovingObj, func;
    for (let y = 0; y < strings.length; y++) {
      for (let x = 0; x < strings[y].length; x++) {
        moovingObj = strings[y][x];
      }
    }
    return actors;
}

  parse(strings) {
    var grid = this.createGrid(strings);
    var actors = this.createActors(strings);
    return new Level(grid, actors);
  }

}

class Fireball extends Actor {
  constructor(pos = new Vector({0:0}), speed = new Vector({0:0})) {
    super(pos, new Vector(1, 1), speed);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
    var newPosition = this.pos + this.speed.times(time);
    return newPosition;
  }

  handleObstacle() {
    this.speed = this.speed.times(-1);
    return this.speed;
  }

  act(time, level) {
    const nextPosition = this.getNextPosition(time);
    if (level.obstacleAt(nextPosition, this.size)) {
      this.handleObstacle();
    } else {
      this.pos = nextPosition;
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(pos = new Vector(0, 0)) {
    super(pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor(pos = new Vector(0, 0)) {
    super(pos, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  constructor(pos = new Vector(0, 0)) {
    super(pos, new Vector(0, 3));
    this.startPos = this.pos;
  }

  handleObstacle() {
    this.pos = this.startPos;
  }
}

class Coin extends Actor {
  constructor(pos = new Vector(0, 0)) {
    super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (Math.PI * 2);
    this.startPos = this.pos;
    
  }

  get type() {
    return 'coin';
  }

  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist)
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    return this.startPos.plus(this.getSpringVector());
  }

  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(pos = new Vector(0, 0)) {
    super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), this.speed = new Vector(0, 0));
  }

  get type() {
    return 'player';
  }
}

