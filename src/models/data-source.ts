import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./User"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Database is initialized");
    })
    .catch((error) => console.log(error))
