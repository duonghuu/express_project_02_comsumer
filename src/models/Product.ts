import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

@Entity("products")
export class Product {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    name!: string;

    @Column()
    price!: number;

    @Column({ default: true })
    is_active!: boolean;
}
