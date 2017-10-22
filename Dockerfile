FROM node:8

WORKDIR /src
COPY ./src/package.json .
RUN npm install
ENTRYPOINT ["node"]
CMD ["--version"]
