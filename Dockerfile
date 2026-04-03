FROM cypress/base:22.17.0

WORKDIR /app

# Fix broken libgcrypt20 in base image.
# apt-get crashes due to corrupted libgcrypt, so we use wget+dpkg
# (which don't depend on libgcrypt) to reinstall the correct package.
RUN wget -q http://deb.debian.org/debian/pool/main/libg/libgcrypt20/libgcrypt20_1.10.1-3_amd64.deb -O /tmp/libgcrypt20.deb && \
  dpkg -i /tmp/libgcrypt20.deb && \
  rm /tmp/libgcrypt20.deb

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

# package
COPY package.json package.json
COPY package-lock.json package-lock.json

# npm install
RUN npm install
RUN npx cypress verify

COPY ./test-files.txt ./test-files.txt
COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts
COPY ./tsconfig.json ./tsconfig.json
