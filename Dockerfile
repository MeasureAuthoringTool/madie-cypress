FROM cypress/base:22.17.0

WORKDIR /app

# package
COPY package.json package.json
COPY package-lock.json package-lock.json

# npm install
RUN npm install
RUN npx cypress verify

# install Chrome browser
RUN \
  apt-get update && apt-get install -y gnupg dbus-x11 ca-certificates wget && \
  wget -q -O /usr/share/keyrings/google-chrome.gpg https://dl.google.com/linux/linux_signing_key.pub && \
  echo "deb [signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && apt-get install -y dbus-x11 google-chrome-stable && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# install aws cli and other tools
RUN apt-get update && apt-get install -y awscli jq && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./test-files.txt ./test-files.txt
COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts
COPY ./tsconfig.json ./tsconfig.json
