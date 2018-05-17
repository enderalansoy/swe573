/**
 * CoinController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


const axios = require('axios');
const ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3');

const toneAnalyzer = new ToneAnalyzer({
    version: '2017-09-21',
    username: sails.config.secrets.watsonUsername,
    password: sails.config.secrets.watsonPassword,
  });

const cmcApiUrl = 'https://api.coinmarketcap.com/v2/ticker';

module.exports = {

  getTrends: async (req, res) => {
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

  getSentiment: async (req, res) => {
    var text = `

    `;

    var toneParams = {
      'tone_input': { 'text': text },
      'content_type': 'application/json',
    };

toneAnalyzer.tone(toneParams, (error, analysis) => {
    if (error) {
      return res.json(error);
    } else { 
      return res.json(analysis);
    }
  }); 0;
},

};

