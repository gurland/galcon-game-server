FROM node:16

RUN apt update
RUN apt install -y git

RUN git clone "https://github.com/annavasylashko/galcon-client.git"

WORKDIR galcon-client
RUN git checkout feature/multihost

RUN npm i

CMD npm run start
