'use strict';

class Vector {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    plus(vector){
        if(vector instanceof Vector) {
            return new Vector(this.x + vector.x, this.y + vector.y);
        }
        throw new Error('Можно прибавлять к вектору только вектор типа Vector');    
    }

    times(factor){
        return new Vector(this.x * factor, this.y * factor);
    }
}


/* size = typeof Vector,  position = typeof Vector, speed = typeof Vector*/
class Actor {
    constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
      if(!(position instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)){
        throw new Error('Неверный тип данных, задайте аргументам тип Vector');
      }
      this.pos = position;
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
      return this.pos.y + this.size.y;
  }

    act(){
    }

    //Пересечение объектов
    isIntersect(actor){
      if(!(actor instanceof Actor)  || (actor == undefined)){
        throw new Error('Аргумент должен соответсвовать типу Actor');
      }
      //Если передать тот же объект то вернуть false, Объект не пересекается сам с собой
      if(this === actor){
        return false;
      }  
      return ((this.right > actor.left) && (this.left < actor.right) && (this.top < actor.bottom) && (this.bottom > actor.top));

    }
}

class Level {
  constructor(grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;

    this.player = this.actors.find(actor => actor.type === 'player');

      //Высота поля
      this.height = this.grid.length;

      //Ширина поля
      this.width = this.grid.reduce((sum, current) => {
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
   return ((this.status != null) && (this.finishDelay < 0));
  }

  actorAt(actor) {
    if (!(actor instanceof Actor) || actor === undefined) {
      throw new Error("Неверный тип данных");
    }
    if (this.actors === undefined || this.actors.length < 2) {
      return undefined;
    }
    for (let object of this.actors) if (actor.isIntersect(object)) {
      return object;
    }
    return undefined;
}

  obstacleAt(position, size){
    if(!(position instanceof Vector || size instanceof Vector)) {
      throw new Error("Неверный тип аргументов");
    }

    const leftWall   = Math.floor(position.x);
    const rightWALL = Math.ceil(position.x + size.x);
    const topWall = Math.floor(position.y);
    const bottomWall = Math.ceil(position.y + size.y);
    
    let actor = new Actor(position, size);
    let level = new Actor(new Vector(), new Vector(this.width, this.height));
    if (bottomWall > this.height) {
      return "lava";
    }
    if (leftWall < 0 || rightWALL > this.width || topWall < 0) {
      return "wall";
    }
    for (let y = topWall; y < bottomWall; y++) {
      for (let x = leftWall; x < rightWALL; x++) {
        const fullSize = this.grid[y][x];
        if (fullSize) {
          return fullSize;
        }
      }
    }
  }

  removeActor(actor){
    const index = this.actors.indexOf(actor); //возвращает индекс объекта
    if(index !== -1) {
    this.actors.splice(index, 1);
    }
  }

  noMoreActors(type){
    return !this.actors.some((actor) => actor.type === type)
  }

  playerTouched(type, actor) {
    if (this.status !== null) {
      return;
    }
    if (type === "lava" || type === "fireball") {
     var status = this.status = "lost";
     return status;

    }
    if (type === 'coin' && actor.type == 'coin') {
      this.removeActor(actor);
    }
    if (this.noMoreActors('coin')) {
      this.status = "won";
    }
  }

  
}

class LevelParser {
  //Принимает один аргумент — словарь движущихся объектов игрового поля, объект, ключами которого являются символы из текстового представления уровня, а значениями — конструкторы, с помощью которых можно создать новый объект.
  constructor(library = {}) {
    this.library = library;
  }
  
  actorFromSymbol(symbol) {
    if(symbol === undefined) {
      return undefined;
    }
    return this.library[symbol];
  }

  obstacleFromSymbol(symbol) {
    if(symbol === "x") {
      return 'wall';
    } else if(symbol === "!") {
      return "lava";
    }
  }
 // Игровое поле
  createGrid(strings = []) {
    return strings.map(row => row.split('')).map(row => row.map(row => this.obstacleFromSymbol(row))); 
  }

  
  createActors(strings = []) {
    let actor, actors = [], moovingObj, func;
    for (let y = 0; y < strings.length; y++) {
      for (let x = 0; x < strings[y].length; x++) {
        moovingObj = strings[y][x];
        try {
          func = this.actorFromSymbol(moovingObj);
          actor = new func(new Vector(x, y));
          if (actor instanceof Actor) actors.push(actor);
        } catch (exception) {}
      }
    }
    return actors;
}

  parse(strings) {
    let grid = this.createGrid(strings);
    let actors = this.createActors(strings);
    return new Level(grid, actors);
  }

}

class Fireball extends Actor {
  constructor(position = new Vector(0, 0), speed = new Vector(0, 0)) {
    super(position, new Vector(1, 1), speed);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
    const newPosition = new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
    return newPosition;
  }

  handleObstacle() {
    this.speed = new Vector(-this.speed.x, -this.speed.y);
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
  constructor(position  = new Vector(0, 0)) {
    super(position , new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor(position  = new Vector(0, 0)) {
    super(position , new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  constructor(position  = new Vector(0, 0)) {
    super(position , new Vector(0, 3));
    this.startPos = this.pos;
  }

  handleObstacle() {
    this.pos = new Vector(this.startPos.x, this.startPos.y);
  }
}

class Coin extends Actor {
  constructor(position  = new Vector(0, 0)) {
    super(position .plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
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
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    return this.startPos.plus(this.getSpringVector());
  }

  act(time, level) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(position = new Vector(0, 0)) {
    super(position.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
  }

  get type() {
    return 'player';
  }
}

let levels = [
  [
  '         ',  
  '        o',
  '       xx',
  '      xxx',
  '    o    ',
  '   xxx   ',
  ' @       ',
  'xxx!!!!xx',
  '         '
  ],
  [
  ' ',
  ' @         ',
  ' o         ',
  'xx        o',
  '     o   xx',
  '    xxx    ',
  '           ',
  '!!!!!!!!!!!',
  '           '
  ],
  [
  '', 
  '                                        ',
  ' @               v      v     v         ',
  ' o                                      ',
  'xx           o      o      o           o',
  '     o       x      x      x      xx   x',
  '    xxx                                 ',
  '                                        ',
  '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
  '                                         '
  ]
];
const actorDict = {
  '@': Player,
  'v': FireRain,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball

};
const parser = new LevelParser(actorDict);
runGame(levels, parser, DOMDisplay)
.then(() => alert('RESPECT+'));