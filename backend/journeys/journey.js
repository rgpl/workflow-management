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

    if (result.body.hits && result.body.hits.hits) {
      for (let i = 0; i < result.body.hits.hits.length; i++) {
        journeyIds.push({id: result.body.hits.hits[i]["_id"]});
      }
    }

    return journeyIds;
  } catch (e) {
    console.log(e);
    throw e
  }
}

const getJourney = async (journeyId) => {
  try {
    const result = await client.get({
      index: INDEX,
      id: journeyId,
    }, {
      ignore: [404],
      maxRetries: 3
    });

    console.log("getJourney");
    console.log(result);
    return result.body["_source"];
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

    console.log(result);
    return result.body["_id"];
  } catch (e) {
    console.error(e.body.error);
    throw e
  }
}

const updateJourney = async (journeyId, payload) => {
  try {
    console.warn("updating journey");
    console.warn(payload.nodes);

    /* const result0 = await client.delete({
      index: INDEX,
      id: journeyId
    }); */


    const result = await client.index({
      index: INDEX,
      id: journeyId,
      body: payload
    });

    return result.body;
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

