import Coord from "./Coord";

export default class Position {

  constructor(
    readonly positionId: string,
    coord: Coord,
    date: Date,
  ) { }

}