import { Entity, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("call_responsys")
export class CallResponsys {
    @ObjectIdColumn()
    id!: ObjectId;
}
