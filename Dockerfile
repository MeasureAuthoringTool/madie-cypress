FROM cypress/base:22.17.0

WORKDIR /app

# package
COPY package.json package.json
COPY package-lock.json package-lock.json

# npm install
RUN npm install
RUN npx cypress verify

# Install essential packages and dependencies
RUN apt-get update && \
    apt-get install -y \
    wget \
    unzip \
    xvfb \
    libxi6 \
    libgconf-2-4 \
    gnupg \
    curl \
    && rm -rf /var/lib/apt/lists/* \

# install Chrome browser
RUN \
 wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && apt-get install -y gnupg && \
  dbus-x11 google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

# install aws cli
RUN apt-get update && apt-get install -y awscli

COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts
COPY ./tsconfig.json ./tsconfig.json
