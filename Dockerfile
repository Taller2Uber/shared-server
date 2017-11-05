FROM node:boron

LABEL version="1.0"
LABEL description="Llevame's shared-server Docker Image"

RUN mkdir -p /home/gustavo/Documentos/facultad/angularProject/shared-server2
WORKDIR /home/gustavo/Documentos/facultad/angularProject/shared-server2

COPY package.json /home/gustavo/Documentos/facultad/angularProject/shared-server2/
RUN npm install

COPY . /home/gustavo/Documentos/facultad/angularProject/shared-server2/

EXPOSE 3000

CMD [ "npm", "start" ]

