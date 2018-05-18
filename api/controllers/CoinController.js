/**
 * CoinController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const axios = require('axios');
const Twitter = require('twitter');
const ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3');

const watson = new ToneAnalyzer({
  version: '2017-09-21',
  username: sails.config.secrets.watson.username,
  password: sails.config.secrets.watson.password,
});

const twitterClient = new Twitter({
  consumer_key: sails.config.secrets.twitter.consumer_key,
  consumer_secret: sails.config.secrets.twitter.consumer_secret,
  access_token_key: sails.config.secrets.twitter.access_token_key,
  access_token_secret: sails.config.secrets.twitter.access_token_secret,
});

const cmcApiUrl = 'https://api.coinmarketcap.com/v2/ticker';

module.exports = {

  sentiment: async (req, res) => {
    let text = '';
    let positive = 0;
    let negative = 0;
    const twitterOptions = {
      q: req.params.q,
      count: 100,
      lang: 'en',
      result_type: 'popular',
    };
    twitterClient.get('search/tweets', twitterOptions, (err, tweets, response) => {
      tweets.statuses.forEach((tweet) => {
        text += `${tweet.text}. `;
      });
      text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
      const watsonOptions = {
        'tone_input': { text },
        'content_type': 'application/json',
      };
      watson.tone(watsonOptions, (error, analysis) => {
        if (error) {
          return res.json(error);
        } else {
          analysis.document_tone.tones.forEach((tone) => {
            if (tone.tone_id === 'joy') {
              positive += (tone.score - 0.5);
            } else if (tone.tone_id === 'sadness' || tone.tone_id === 'fear' || tone.tone_id === 'anger') {
              negative += (tone.score - 0.5);
            }
          });
          return res.json({
            symbol: req.params.q,
            tones: analysis.document_tone.tones,
            score: 100 * (positive - negative),
          });
        }
      });
    });
  },

  coins: async (req, res) => {
    let limit = 10;
    if (typeof limit !== 'undefined') {
      limit = req.query.limit;
    }
    axios.get(`${cmcApiUrl}/?limit=${limit}`).then((response) => {
      let sortBy = 'rank';
      if (typeof req.query.sort !== 'undefined') {
        sortBy = req.query.sort;
      }
      const data = response.data.data;
      const array = [];
      // Create array from object
      Object.keys(data).forEach((key) => {
        array.push(data[key]);
      });
      // Sort by 
      array.sort((a, b) => a[sortBy] - b[sortBy]);
      return res.json(array);
    }).catch((err) => {
        return res.json(err);
    });
  },

  trend: async (req, res) => {
    axios.get(`${cmcApiUrl}/${req.params.coinId}`).then((response) => {
      const result = {
        name: response.data.data.name,
        symbol: response.data.data.symbol,
        hour: response.data.data.quotes.USD.percent_change_1h,
        day: response.data.data.quotes.USD.percent_change_24h,
        week: response.data.data.quotes.USD.percent_change_7d,
      }
      return res.json(result);
    }).catch((error) => {
      return res.json(error);
    });
  },

};

