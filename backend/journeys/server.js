const Hapi = require('@hapi/hapi');

const journey = require('./journey');

const start = async () => {

  const server = Hapi.server({
    port: 4000,
    host: 'localhost'
  });

  /* server.state('accinfo', {
      ttl: null,
      isSecure: false,
      isHttpOnly: false,
      encoding: 'base64json',
      domain:'.localhost',
      path:'/',
      clearInvalid: false,
      strictHeader: false
  }); */

  server.route({
    method: 'GET',
    path: '/journeys',
    handler(req,h) {
      return journey.getJourneyIds();
    },
    config: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with', 'set-cookie'],
        credentials: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/journey/{journeyId}',
    handler(req, h) {
      return journey.getJourney(req.params.journeyId)
    },
    config: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with', 'set-cookie'],
        credentials: true
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/journey',
    handler(req, h) {
      console.log("saving a new journey");
      return journey.addJourney(req.payload)
    },
    config: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with', 'set-cookie'],
        credentials: true
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/journey/{journeyId}',
    handler(req, h) {
      return journey.updateJourney(req.params.journeyId, req.payload)
    },
    config: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with', 'set-cookie'],
        credentials: true
      }
    }
  });

  await server.start();

  console.log('server running at: ' + server.info.uri);
};

module.exports = start;
