import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  passwordHash: string

  async comparePasswords(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  getJWTToken(): string {
    // Generate a JWT token for the new user
    return jwt.sign(
      { 
        sub: this.id,
        username: this.username 
      },
      process.env.JWT_SECRET as string
    );
  }
}
