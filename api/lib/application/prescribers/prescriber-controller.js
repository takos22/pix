import * as prescriberSerializer from '../../infrastructure/serializers/jsonapi/prescriber-serializer.js';

import { usecases } from '../../domain/usecases/index.js';

const get = function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  return usecases
    .getPrescriber({ userId: authenticatedUserId })
    .then((prescriber) => prescriberSerializer.serialize(prescriber));
};

export { get };
