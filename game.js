'use strict';

'use strict';

class Vector {

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(Vector) {
    if (Vector instanceof Vector) {
      return new Vector(this.x + vector.x, this.y + vector.y);
    }
    throw new Error("Можно прибавлять к вектору только вектор типа Vector");
  }
  
  times(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }
}

//Движущийся объект

class Actor {

  constructor(position, size, speed) {
    if (position === undefined) {
      this.pos = new Vector();
    } else if (position instanceof Vector) {
      this.pos = position;
    } else {
      throw new Error("Ошибка в первом аргументе");
    }
    if (size === undefined) {
      this.size = new Vector(1, 1);
    } else if (size instanceof Vector) {
      this.size = size;
    } else {
      throw new Error("Ошибка во втором аргументе");
    }
    if (speed === undefined) {
      this.speed = new Vector();
    } else if (speed instanceof Vector) {
      this.speed = speed;
    } else {
      throw new Error("Посмотрите на спидометр, шофер!");
    }
    Object.defineProperty(this, "type", {configurable: true, value: "actor", writable: false});
    Object.defineProperty(this, "type", {configurable: true, get : () => "actor" });
    this.startPos = new Vector(this.pos.x, this.pos.y);
    Object.defineProperty(this, "left", {configurable: true, get: () => this.pos.x});
    Object.defineProperty(this, "right", {configurable: true, get: () => this.pos.x + this.size.x});
    Object.defineProperty(this, "top", {configurable: true, get: () => this.pos.y});
    Object.defineProperty(this, "bottom", {configurable: true, get: () => this.pos.y + this.size.y});
   
  }

  /**
   * Метод ничего не делает.
   */
  act() {
  }

  /**
   * Метод проверяет, пересекается ли текущий объект с переданным объектом, и если да, возвращает <code>true</code>,
   * иначе <code>false</code>.
   *Принимает один аргумент — движущийся объект типа Actor. Если передать аргумент другого типа или вызвать без аргументов, то метод бросает исключение.
   Если передать в качестве аргумента этот же объект, то всегда возвращает false. Объект не пересекается сам с собой.
   * Объекты, имеющие смежные границы, не пересекаются.
   * @param actor движущийся объект типа Actor.
   */
  isIntersect(actor) {
    if (actor instanceof Actor) {
      if (this === actor) return false;
      let equalX = actor.left === this.left && actor.right === this.right;
      let equalY = actor.top === this.top && actor.bottom === this.bottom;
      let intersectX = (actor.left < this.left && this.left < actor.right) || (this.left < actor.left && actor.left < this.right);
      let intersectY = (actor.top < this.top && this.top < actor.bottom) || (this.top < actor.top && actor.top < this.bottom);
      return (intersectX && intersectY) || (intersectX && equalY) || (intersectY && equalX) || (equalX && equalY);
    } else {
      throw new Error("Я не могу это сравнить!");
    }
  }
}

class Level {

  constructor(grid, actors) {

    /**
     * Сетка игрового поля. Двумерный массив строк.
     */
    this.grid = (grid === undefined) ? [] : grid;

    /**
     * Список движущихся объектов игрового поля, массив объектов Actor.
     */
    this.actors = actors;

    /**
     * Движущийся объект, тип которого — свойство type — равно player.
     * @type {Actor}
     */

    Object.defineProperty(this, "player", {get: function () {
        let player = undefined;
        if (this.actors !== undefined)
          for (let actor of this.actors)
            if (actor.type === "player" || actor.__proto__.type === "player") player = actor;
        return player;
}});