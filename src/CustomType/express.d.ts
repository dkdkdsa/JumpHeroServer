import { UserVO } from "../Type";

declare global{

    namespace Express{
        interface Request{

            user: UserVO | null;
        }

    }

}