import Sequelize, { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "@sequelize/core";
import { PostgresDialect } from '@sequelize/postgres';
import { Attribute, AutoIncrement, NotNull, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';
import { env } from "./env.js";

@Table({
  tableName: 'posts',
  timestamps: false,
})
export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.DATEONLY)
  @NotNull
  declare date: string;

  @Attribute(DataTypes.BLOB)
  @NotNull
  declare image: Uint8Array;

  @Attribute(DataTypes.BLOB)
  @NotNull
  declare image_compressed: Uint8Array;

  @Attribute(DataTypes.STRING(500))
  @NotNull
  declare caption: string;
}

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_URL,
  port: 5432,
  ssl: false,
  clientMinMessages: 'notice',
  models: [Post],
});
