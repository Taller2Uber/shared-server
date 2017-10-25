FROM node:boron

RUN mkdir -p /home/gustavo/Documentos/facultad/taller2/shared-server
WORKDIR /home/gustavo/Documentos/facultad/taller2/shared-server

COPY package.json /home/gustavo/Documentos/facultad/taller2/shared-server/
RUN npm install

COPY . /home/gustavo/Documentos/facultad/taller2/shared-server/

EXPOSE 3000

CMD [ "npm", "start" ]

