import {
    attribute,
    hashKey,
    table,
} from '@aws/dynamodb-data-mapper-annotations';
import {IsEmail, IsUUID, MaxLength, MinLength} from "class-validator";
import {Model} from "../Model";

@table('user_email')
export class UserEmail extends Model {
    @hashKey()
    @IsEmail()
    email: string;

    @IsUUID("4")
    user_id: string;

    @attribute({defaultProvider: () => new Date})
    createdAt: Date;
}