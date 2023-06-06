import "reflect-metadata";

import {httpServer} from "./app";


const PORT = process.env.PORT;


httpServer.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
