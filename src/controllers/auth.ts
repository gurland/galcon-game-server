import express, { Express, Request, Response } from "express";
import { AppDataSource } from "../models/data-source";
import { User } from "../models/User";

import bcrypt from "bcrypt";


const createNewUser = async (req: Request, res: Response) => {
    // Extract the username and password from the request body
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
  
    const newUser = new User()
    newUser.username = username;
    newUser.passwordHash = passwordHash;
  
    try {
      await AppDataSource.manager.save(newUser)
    } catch (error) {
      return res.status(409).json(
        {"message": "User already exists"}
      );
    }
  
    // Send the token back to the client
    res.json({ token: newUser.getJWTToken() });
  }


const authenticateUser =  async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    const user = await AppDataSource.manager.findOneBy(
      User, {username}
    );
  
    if (user === null) {
      return res.status(404).json({"message": "User not found!"});
    }
    
    if (!await user.comparePasswords(password)) {
      return res.status(401).json();
    }
  
    return res.json({ token: user.getJWTToken() });
  }

export {
  createNewUser,
  authenticateUser
}
