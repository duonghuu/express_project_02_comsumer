import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

@Entity("responsys")
export class Responsys {
    @ObjectIdColumn()
    id!: ObjectId;

}
