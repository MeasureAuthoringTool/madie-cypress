FROM cypress/base:16.0.0

WORKDIR /app

# package
COPY package.json package.json
COPY package-lock.json package-lock.json

# npm install
RUN npm install
RUN npx cypress verify

# install Chrome browser
RUN \
 wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y dbus-x11 google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

# install aws cli
RUN \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install

COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts
COPY ./tsconfig.json ./tsconfig.json
