const kafka = require('../adapter_helper/kafka')

const producer = kafka.producer()

const { markdown2Html } = require('../../services/markdown');

const topicName = process.env.KAFKA_TOPIC

/*
const kafka_process  = async () => {
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
      topics: [{
          topic: topicName,
          numPartitions: 2,
          replicationFactor: 1
      }
      ],
});
  await admin.disconnect();
};*/



/**Promise
 * Sendings the listings to kafka
 * @param serviceName e.g immowelt
 * @param newListings an array with newly found listings
 * @param jobKey name of the current job that is being executed
 */
exports.send = ({ serviceName, newListings, jobKey }) => {
  const processProducer = async () => {
    await producer.connect();
    newListings.forEach((item) => {
      producer.send({
        topic: topicName,
        messages: [
          {
            key: serviceName,
            value: JSON.stringify(item)
          }
        ],
      });
    });
  };

  processProducer().then(() => {
    console.log('All new listings sent to kafka');
    //kafka_process.exit();
  });

  return [Promise.resolve(console.info(`Found entry from service ${serviceName}, Job: ${jobKey}:`, newListings))];
};

exports.config = {
  id: __filename.slice(__dirname.length + 1, -3),
  name: 'Kafka',
  description: 'This adapter produces messages to kafka.',
  config: {},
  readme: markdown2Html('lib/notification/adapter/kafkaProducer.md'),
};
