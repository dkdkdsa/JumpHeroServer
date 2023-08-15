export enum MessageType{

    ERROR = 1,
    SUCCESS = 2,
    EMPTY = 3

}

export interface ResponseMSG{

    type:MessageType,
    message:string,
    color?:"#000"

}

export interface UserVO 
{
    id:number,
    email:string,
    exp:number,
    name:string
}

export interface TokenUser{

    id:number,
    email:string,
    xp:number,
    name:string

}

export interface ItemVO 
{
    itemCode:number,
    count:number,
    slotNumber:number
}

export interface RankVO 
{

    user_id:number,
    score:number,
    memo:string

}

export interface InventoryVO
{
    count:number,
    list: ItemVO[]
}