import {Restaurant} from "@app/model/Restaurant";

export enum RestaurantKey {
    CLOCK_BLOCK
}

export const restaurants = {
    [RestaurantKey.CLOCK_BLOCK]: new Restaurant('ClockBlock', 'Clock Block')
};