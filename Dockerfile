FROM cypress/browsers:node-22.17.0-chrome-138.0.7204.157-1-ff-140.0.4-edge-138.0.3351.83-1

WORKDIR /app

# install jq (static binary, no apt-get needed)
RUN wget -q -O /usr/local/bin/jq https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux-amd64 && \
  chmod +x /usr/local/bin/jq

# install aws cli v2 (standalone installer, using wget since curl is not available)
RUN wget -q "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -O /tmp/awscliv2.zip && \
  if ! command -v unzip >/dev/null 2>&1; then \
    wget -q http://deb.debian.org/debian/pool/main/u/unzip/unzip_6.0-28_amd64.deb -O /tmp/unzip.deb && \
    dpkg -i /tmp/unzip.deb && rm /tmp/unzip.deb; \
  fi && \
  unzip -q /tmp/awscliv2.zip -d /tmp && \
  /tmp/aws/install && \
  rm -rf /tmp/awscliv2.zip /tmp/aws

# package
COPY package.json package.json
COPY package-lock.json package-lock.json

# npm install
RUN npm install
RUN npx cypress verify

COPY ./test-files.txt ./test-files.txt
COPY ./scripts ./scripts
COPY ./cypress ./cypress
COPY ./cypress.config.ts ./cypress.config.ts
COPY ./tsconfig.json ./tsconfig.json
