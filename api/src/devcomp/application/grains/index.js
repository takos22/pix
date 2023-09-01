import Joi from 'joi';
import { grainsController } from './grains-controller.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/grains/{id}',
      config: {
        auth: false,
        handler: grainsController.get,
        validate: {
          params: Joi.object({ id: Joi.number() }),
        },
        notes: ['- Permet de récupérer un grain grâce à son id'],
        tags: ['api', 'grains'],
      },
    },
  ]);
};

const name = 'grains-api';
export { register, name };
