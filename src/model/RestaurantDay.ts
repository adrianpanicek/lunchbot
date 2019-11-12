import {Restaurant} from "@app/model/Restaurant";

export class RestaurantDay {
    readonly restaurant: Restaurant;
    readonly date: Date;

    constructor(restaurant: Restaurant, date: Date) {
        this.restaurant = restaurant;
        this.date = date;
    }

    generateFileName(): string {
        return `${this.restaurant.name}_${this.date.toISOString().slice(0, 10)}.jpg`
    }
}