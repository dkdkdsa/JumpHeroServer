import mysql from 'mysql2'

export const dbConfig : mysql.PoolOptions = {

    user: "yy_40119",
    password: "1234",
    database: "yy_40119",
    host: "gondr99.iptime.org",
    port:3306

};

export const JWT_SECRET = "아주길고비밀스럽고매우안전하고강력하지않은비밀키";