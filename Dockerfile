FROM cypress/base:22.17.0


WORKDIR /app

# package
COPY package.json package.json
COPY package-lock.json package-lock.json

# npm install
RUN npm install
RUN npx cypress verify

# install deps
RUN wget https://mirrors.edge.kernel.org/ubuntu/pool/main/g/gcc-10/gcc-10-base_10-20200411-0ubuntu1_amd64.deb && dpkg -i gcc-10-base_10-20200411-0ubuntu1_amd64.deb
RUN wget https://mirrors.edge.kernel.org/ubuntu/pool/main/g/gcc-10/libgcc-s1_10-20200411-0ubuntu1_amd64.deb && dpkg -i libgcc-s1_10-20200411-0ubuntu1_amd64.deb

# install Chrome browser
RUN \
  apt-get update && \
  apt-get install -y gnupg && \
  apt-get install -y dbus && \
 wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y dbus-x11 google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

# install aws cli
RUN \
  apt-get install -y awscli

COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts
COPY ./tsconfig.json ./tsconfig.json
