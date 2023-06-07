FROM nginx

RUN apt update
RUN apt install -y git

RUN git clone "https://github.com/annavasylashko/galcon-client.git"

RUN cp -r ./galcon-client/public/* /usr/share/nginx/html
