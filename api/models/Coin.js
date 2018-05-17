/**
 * Coin.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
    },

    symbol: {
      type: 'string',
      required: true,
    },

    cmcid: {
      type: 'number',
      required: true,
    },

    price: {
      type: 'number',
      required: true,
    },

    owner: {
      collection: 'user',
      via: 'favorites',
    }

  },

};

