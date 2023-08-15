import {Router, Request, Response} from "express";
import axios from "axios";
import {load, CheerioAPI} from "cheerio";
import iconv from "iconv-lite";
import { Pool } from "./DB";
import {RowDataPacket} from "mysql2/promise"
import { MessageType, ResponseMSG } from "./Type";

export const lunchRouter = Router();

lunchRouter.get("/lunch", async (req :Request, res:Response) => {

    let date:string | undefined = req.query.date as string | undefined;
    const url :string = `https://ggm.hs.kr/lunch.view?date=${date}`;

    if(date == undefined){

        date = "20230703"

    }

    let result = await GetDBData(date);

    if(result !=null){

        let json = {date, menus:JSON.parse(result[0].menu)};
        //let arr2:number[] = process.hrtime();

        //res.render("lunch", json);
        let resPacket:ResponseMSG = {type:MessageType.SUCCESS, message:JSON.stringify(json)};
        res.json(resPacket);
        return;

    }

    let html = await axios({url: url, method:"GET", responseType:"arraybuffer"});
    let data:Buffer = html.data;

    let decoded = iconv.decode(data, "euc-kr");

    const $ : CheerioAPI = load(decoded);

    let text:string = $(".menuName > span").text();
    let menus:string[] = text.split("\n").map(x => x.replace(/[0-9]+\./g, "")).filter(x => x.length > 0);

    const json = {date, menus};

    //res.render("lunch", json);
    let resPacket:ResponseMSG = {type:MessageType.SUCCESS, message:JSON.stringify(json)};
    res.json(resPacket);

    await Pool.execute("INSERT INTO lunch(date, menu) VALUES(?, ?)", [date, JSON.stringify(menus)]);

});

async function GetDBData(date: string){

    const sql:string = "SELECT * FROM lunch WHERE date = ?";
    let [row, col] = await Pool.query(sql, [date]);

    console.log(row);
    console.log(col);

    row = row as RowDataPacket[];

    return row.length > 0 ? row : null;

}