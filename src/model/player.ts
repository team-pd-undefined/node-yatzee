export default class Player {
  id: number;
  game:  Array<number>;
  turn: number;

  constructor(id?: number, game?: Array<number>, turn?: number){
    this.id = id || 0;
    this.game = game || [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
    this.turn = turn || 0;
  }
}