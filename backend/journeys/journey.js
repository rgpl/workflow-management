const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const INDEX = 'journeys';

const getJourneyIds = async () => {
  try {
    const result = await client.search({
      index: INDEX
    }, {
      ignore: [404],
      maxRetries: 3
    });

    let journeyIds = [];

    for (let i = 0; i < result.body.hits.hits.length; i++) {
      journeyIds.push({ id: result.body.hits.hits[i]["_id"] });
    }

    return journeyIds;
  } catch (e) {
    console.log(e);
    throw e
  }
}

const getJourney = async (journeyId) => {
  try {
    const result = await client.search({
      index: INDEX,
      body: {_id: journeyId},
    }, {
      ignore: [404],
      maxRetries: 3
    });

    return result.body.hits.hits[0]["_source"];
  } catch (e) {
    console.log(e);
    throw e
  }
}


const addJourney = async (payload) => {
  try {
    console.warn("adding journey");
    const result = await client.index({
      index: INDEX,
      body: payload,
    });

    console.log(result.body);
    return result.body;
  } catch (e) {
    console.log(e);
    throw e
  }
}

const updateJourney = async (journeyId, payload) => {
  try {
    console.warn("updating journey");

    const result = await client.update({
      index: INDEX,
      id: journeyId,
      body: {
        doc: payload,
      },
    });

    console.warn(result);

    return result.statusCode;
  } catch (e) {
    console.error(e.body.error);
    throw e
  }
}


module.exports = {
  getJourney,
  getJourneyIds,
  addJourney,
  updateJourney
};

