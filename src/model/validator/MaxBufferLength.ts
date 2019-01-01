import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({ name: "maxBufferLength", async: false })
export class MaxBufferLength implements ValidatorConstraintInterface {
    defaultMessage(args?: ValidationArguments): string {
        return args.targetName + " Buffer is larger than " + args.constraints[0];
    }

    validate(value: Buffer, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return value.length <= validationArguments.constraints[0];
    }
}