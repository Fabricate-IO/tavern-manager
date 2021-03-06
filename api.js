const Boom = require('boom');
const Joi = require('joi');

const models = {
  Bar: require('./model/Bar'),
  BarStock: require('./model/BarStock'),
  Friend: require('./model/Friend'),
  Recipe: require('./model/Recipe'),
  StockModel: require('./model/StockModel'),
  StockType: require('./model/StockType'),
  Transaction: require('./model/Transaction'),
  User: require('./model/User'),
};


module.exports = [
/* ===== GENERIC CRUD ===== */
  {
    method: 'DELETE',
    path: '/api/{modelName}/{id}',
    config: {
      auth: 'session',
    },
    handler: (request, reply) => {

      const auth = request.auth.credentials;
      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.params, models[modelName].schema, (err, params) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].deleteOne(auth, params.id, (err, result) => {

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          return reply(result);
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/api/{modelName}/{id}',
    config: {
      auth: 'session',
    },
    handler: (request, reply) => {

      const auth = request.auth.credentials;
      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.params, models[modelName].schema, (err, params) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].readOne(auth, params.id, (err, result) => {

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          request.server.app.db[modelName].hooks.prePublicObject(auth, result, (err, result) => {

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            return reply(result);
          });
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/api/{modelName}',
    config: {
      auth: 'session',
    },
    handler: (request, reply) => {

      const auth = request.auth.credentials;
      const modelName = request.params.modelName;
      delete request.params.modelName;

      const sortableSchema = Joi.object(models[modelName].schema).keys({ order: Joi.string(), orderBy: Joi.string() });

      Joi.validate(request.query, sortableSchema, (err, query) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].read(auth, query, (err, result) => {

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          request.server.app.db[modelName].hooks.prePublicArray(auth, result, (err, result) => {

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            return reply(result);
          });
        });
      });
    },
  },
  {
    method: 'PUT',
    path: '/api/{modelName}/{id}',
    config: {
      auth: 'session',
    },
    handler: (request, reply) => {

      const auth = request.auth.credentials;
      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.params, models[modelName].schema, (err, params) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        Joi.validate(request.payload, models[modelName].schema, (err, payload) => {

          if (err) {
            return reply(Boom.badRequest(err));
          }

          if (params.id != null && payload.id != null && params.id !== payload.id) {
            return reply(Boom.badRequest("IDs in param and payload do not match"));
          }

          request.server.app.db[modelName].updateOne(auth, params.id, payload, (err, result) => {

            if (err) {
              return reply(Boom.badImplementation(err));
            }

            return reply(result);
          });
        });
      });
    },
  },
  {
    method: 'POST',
    path: '/api/{modelName}',
    config: {
      auth: 'session',
    },
    handler: (request, reply) => {

      const auth = request.auth.credentials;
      const modelName = request.params.modelName;
      delete request.params.modelName;

      Joi.validate(request.payload, models[modelName].schema, (err, payload) => {

        if (err) {
          return reply(Boom.badRequest(err));
        }

        request.server.app.db[modelName].createOne(auth, payload, (err, result) => {

          if (err) {
            return reply(Boom.badImplementation(err));
          }

          return reply(result);
        });
      });
    },
  },

/* ===== SPECIAL FUNCTIONS ===== */
  {
    method: 'POST',
    path: '/api/User/{id}/order',
    config: {
      auth: 'session',
      validate: {
        params: {
          id: models.User.schema.id,
        },
        payload: {
          abv: models.StockModel.schema.abv,
          ingredients: models.Transaction.schema.ingredients,
          monetaryValue: Joi.number(),
          recipeId: models.Transaction.schema.recipeId,
        },
      },
    },
    handler: (request, reply) => {

      const auth = request.auth.credentials;
      const Db = request.server.app.db;

      Db.Transaction.createOne(auth, {
        userId: request.params.id,
        type: 'order',
        monetaryValue: request.payload.monetaryValue,
        recipeId: request.payload.recipeId,
        ingredients: request.payload.ingredients,
      }, (err, result) => {

        if (err) {
          return reply(Boom.badImplementation(err));
        }

        return reply(result);
      });
    },
  },
  {
    method: 'POST',
    path: '/api/User/{id}/settle',
    config: {
      auth: 'session',
      validate: {
        params: {
          id: models.User.schema.id,
        },
        payload: {
          platform: Joi.string().allow(['splitwise', 'cash', 'house']),
        },
      },
    },
    handler: (request, reply) => {

      const auth = request.auth.credentials;
      const Db = request.server.app.db;

      Db.User.settle(auth, request.params.id, request.payload.platform, (err, result) => {

        if (err) {
          return reply(Boom.badImplementation(err));
        }

        return reply(result);
      });
    },
  },
];
