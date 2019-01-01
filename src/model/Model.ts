import {Index} from "./Index";
import {validate, ValidationError} from "class-validator";

const values = (object) => Object.keys(object).map(k => object[k]);

export abstract class Model {
     static indexes: {[key: string]: Index} = {};

     async validate(): Promise<void> {
          const invalid: ValidationError[] = await validate(this);

          if (invalid.length) {
               console.log('Invalid model', invalid);
               const message = invalid.map(i => values(i.constraints).join(', ')).join(', ');
               throw new InvalidModel(message);
          }
     }
};

export class InvalidModel extends Error {
     constructor(public message, ...params) {
          super(...params);
     }
}