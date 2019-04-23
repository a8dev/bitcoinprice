FROM fnproject/node AS build-stage
RUN apk update  
RUN apk add g++ make libjpeg-turbo-dev cairo jpeg-dev pango-dev giflib-dev
WORKDIR /function
ADD package.json /function/
RUN npm install

FROM fnproject/node
WORKDIR /function
ADD . /function/
COPY --from=build-stage /function/node_modules/ /function/node_modules/
COPY --from=build-stage /usr/lib/ /usr/lib/
ENTRYPOINT ["node", "func.js"]
