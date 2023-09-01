import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

function serialize(grain) {
  return new Serializer('grain', {
    attributes: ['title', 'description'],
  }).serialize(grain);
}

export { serialize };
