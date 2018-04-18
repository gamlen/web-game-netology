"use strict";

class Vector {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    plus(Vector){
        if(typeof Vector){
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
      if(typeof location != new Vector() || typeof size != new Vector() || typeof speed != new Vector()){
        throw new Error('Неверный тип данных, задайте аргументам тип Vector');
      }
      this.pos = location;
      this.size = size;
      this.speed = speed;
      this.type = actor;

      Object.defineProperty(this, ['left', 'top', 'right', 'bottom'], {
        enumerable: true,
        configurable: false,
        writable: false,
      });
      Object.defineProperty(this, 'type', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: actor,
      });
    }

    act(){
    }

    isInterest(Actor){
      if(Actor != new Actor() || Actor == undefined){
        throw new Error('Аргумент должен соответсвовать типу Actor');
      }
      //Если передать тот же объект то вернуть false, Объект не пересекается сам с собой
      if(this === Actor){
        return false;
      }  
    }

}

class Level {
  constructor(grid, actors) {
    this.grid = (grid === undefined) ? [] : grid;
    this.actors = actors;

      Object.defineProperty(this, "player", {get: function () {
      let player = undefined;
      if (this.actors !== undefined)
        for (let actor of this.actors)
          if (actor.type === "player" || actor.__proto__.type === "player") player = actor;
      return player;
      }});

      //Высота поля
      this.height = this.grid.length;

      //Ширина поля
      Object.defineProperty(this, "width", {
        get: () => {
          if (this.grid.length === 0) {
            return 0;
          }
          let maxCell = 0;
          for (let i = 0; i < grid.length; i++) {
            if (this.grid[i].length > maxCell) {
               maxCell = this.grid[i].length;
            }
            return maxCell;
          }
        }
  });
    

     ///состояние прохождения уровня, равное null после создания.
    this.status = null;

     //таймаут после окончания игры, равен 1 после создания. Необходим, чтобы после выигрыша или проигрыша игра не завершалась мгновенно.
    this.finishDelay = 1;
  }

  isFinished() {
    ((status != null) || (finishDelay < 0)) ? true : false;
  }

  actorAt(Actor) {
    for(let actorObj of actors) {
      if(Actor.isIntersect(actorObj)) {
        return actorObj;
      }
      if(Actor == undefined || (!(Actor.instanceOf(Actor)))) {
        throw new Error("Передан неверный аргумент");
      }
      if(!(Actor.isIntersect(actorObj))){
        return undefined;
      }
      if(Actor.isIntersect(actorObj.length > 1)){
        return Actor;
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

  removeActor(Actor){
    this.actors = Actor;
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
  createGrid(strings) {
    this.grid = [], row;
    if(strings.length < 1) {
      return [];
    }
    for(let string of strings) {
      //string = "lava" || ;
    }
    //Нужна подсказка.......................
  }
  
  createActors(strings) {
    //Нужна подсказка.............................
  }

  parse(strings) {
    var grid = this.createGrid(strings);
    var actors = this.createActors(strings);
    return new Level(grid, actors);
  }

}

class Fireball extends Actor {
  constructor(coordinates = new Vector({0:0}), speed = new Vector({0:0})) {

  }
}