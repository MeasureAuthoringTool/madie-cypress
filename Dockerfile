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
    openjdk-11-jdk \
    maven \
    wget \
    unzip \
    xvfb \
    libxi6 \
    libgconf-2-4 \
    gnupg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Fetch the latest stable Chrome version and install Chrome and ChromeDriver
RUN CHROME_VERSION=$(curl -sSL https://googlechromelabs.github.io/chrome-for-testing/ | awk -F 'Version:' '/Stable/ {print $2}' | awk '{print $1}' | sed 's/<code>//g; s/<\/code>//g') && \
    CHROME_URL="https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip" && \
    echo "Fetching Chrome version: ${CHROME_VERSION}" && \
    curl -sSL ${CHROME_URL} -o /tmp/chrome-linux64.zip && \
    mkdir -p /opt/google/chrome && \
    mkdir -p /usr/local/bin && \
    unzip -q /tmp/chrome-linux64.zip -d /opt/google/chrome && \
    rm /tmp/chrome-linux64.zip

# install aws cli
RUN apt-get update && apt-get install -y awscli

COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts
COPY ./tsconfig.json ./tsconfig.json
