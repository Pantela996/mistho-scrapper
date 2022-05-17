FROM node:latest

RUN apt-get update

WORKDIR /src/app

ENV PORT1=3000
ENV PORT2=3001
ENV DB_HOST=mongo
ENV DB_NAME=mistho
ENV DB_PORT=27017
ENV ENV=DEV
ENV URL=http://localhost

# Install x11vnc.
RUN apt-get install -y x11vnc
# Install xvfb.
RUN apt-get install -y xvfb
# Install fluxbox.
RUN apt-get install -y fluxbox
# Install wget.
RUN apt-get install -y wget
# Install wmctrl.
RUN apt-get install -y wmctrl
# Set the Chrome repo.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
# Install Chrome.
RUN apt-get update && apt-get -y install google-chrome-stable

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]