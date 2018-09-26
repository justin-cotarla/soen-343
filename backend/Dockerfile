FROM node

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/
RUN mkdir logs/

COPY package.json /usr/src/
COPY tsconfig.json /usr/src/
RUN npm install


CMD [ "npm", "run", "dev" ]