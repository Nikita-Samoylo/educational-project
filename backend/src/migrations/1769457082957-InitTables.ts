import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1727000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    
    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" varchar(100) NOT NULL,
            "password" varchar(255) NOT NULL,
            "name" character varying(100) NOT NULL,
            "position" character varying(100) NOT NULL,
            CONSTRAINT "UQ_users_email" UNIQUE ("email"),
            CONSTRAINT "PK_users" PRIMARY KEY ("id")
        );
        CREATE TABLE "products" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(100) NOT NULL,
            "description" text,
            "price" numeric(10,2) NOT NULL,
            CONSTRAINT "PK_products" PRIMARY KEY ("id")
        );

        CREATE TABLE "stores" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(100) NOT NULL,
            "location" character varying(200) NOT NULL,
            "userId" uuid NOT NULL,
            CONSTRAINT "PK_stores" PRIMARY KEY ("id")
        );
    `);
}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "stores";
            DROP TABLE "products";
            DROP TABLE "users";
        `);
    }
}