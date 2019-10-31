export class Coordinates {
    private readonly _x: number;
    private readonly _y: number;

    public constructor(x: number, y: number) {
        this._x = Math.floor(x); // Ensure integers
        this._y = Math.floor(y);
    }

    get y(): number {
        return this._y;
    }
    get x(): number {
        return this._x;
    }
}