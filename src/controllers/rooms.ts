import express, { Express, Request, Response } from "express";
import { AppDataSource } from "../models/data-source";
import { User } from "../models/User";

import bcrypt from "bcrypt";


const createNewRoom = async (req: Request, res: Response) => {
    res.json({  });
  }


const getRooms =  async (req: Request, res: Response) => {
    return res.json({  });
  }

export {
  createNewRoom,
  getRooms
}
