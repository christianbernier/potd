/**
 * This file is exclusively used for the sync operation. It is used for accessing
 * posts to the v1 blog.
 */

import { env } from '$lib/server/env.js';
import Sequelize, {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes
} from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { Attribute, NotNull, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';

@Table({
	tableName: 'posts',
	timestamps: false
})
export class BlogV1Post extends Model<
	InferAttributes<BlogV1Post>,
	InferCreationAttributes<BlogV1Post>
> {
	@Attribute(DataTypes.STRING(1000))
	@PrimaryKey
	declare id: string;

	@Attribute(DataTypes.STRING(1000))
	@NotNull
	declare title: string;

	@Attribute(DataTypes.STRING(5000))
	@NotNull
	declare caption: string;

	@Attribute(DataTypes.DATEONLY)
	@NotNull
	declare published_on: string;

	@Attribute(DataTypes.STRING(1000))
	@NotNull
	declare image_location: string;
}

export const blogV1Sequelize = new Sequelize({
	dialect: PostgresDialect,
	database: env.OLD_DB_NAME,
	user: env.OLD_DB_USER,
	password: env.OLD_DB_PASSWORD,
	host: env.OLD_DB_URL,
	port: 5432,
	ssl: true,
	clientMinMessages: 'notice',
	models: [BlogV1Post]
});
