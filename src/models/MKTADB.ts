import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectId } from "mongodb";

@Entity("mktadb")
export class MKTADB {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    feol_account_id!: string;

    @Column()
    feol_account_status!: string;

    @Column()
    RIID!: string;

    @Column()
    customer_id_lv1!: string;

    @Column()
    customer_id_lv2!: string;

    @CreateDateColumn({ type: "timestamp" })
    created_time!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_time!: Date;
}
