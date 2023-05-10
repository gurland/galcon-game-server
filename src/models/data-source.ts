import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./User"
import bcrypt from "bcrypt";

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
  .then(async () => {
    console.log("Database is initialized");
    try {
      const newUser = new User()
      newUser.username = "test";
      newUser.passwordHash = await bcrypt.hash("test", 10);

      await AppDataSource.manager.save(newUser)
      console.log("Seeded new test:test user!");
    } catch (error) {
      console.log("Skipping seeding test user!");
    }
  })
  .catch((error) => console.log(error))
