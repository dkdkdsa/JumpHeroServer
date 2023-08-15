import { dbConfig } from "./Secret";
import mysql from "mysql2/promise";

export const Pool = mysql.createPool(dbConfig);