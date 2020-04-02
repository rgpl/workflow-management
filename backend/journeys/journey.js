const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });



const list = ()=>{
    
    let resp = getJourneys();
    return resp;
}

const getJourneys = async () => {
    try{
        const result = await client.search({
            index: 'journeys'
        }, {
            ignore: [404],
            maxRetries: 3
        });
        console.log("result",result);
        return result.body.hits.hits[0]._source["journeys_list"];
    } catch (e) {
        throw e
    }
}



module.exports = {
    list
};

