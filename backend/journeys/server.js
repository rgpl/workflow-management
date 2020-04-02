const Hapi = require('@hapi/hapi');

const  journey = require('./journey');


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
            
            let x = journey.list();
            return x;
        },
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with','set-cookie'],
                credentials:true
            }
        }
    });

    await server.start();

    console.log('server running at: ' + server.info.uri);
};

module.exports = start;