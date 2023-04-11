import * as tagSerializer from '../../infrastructure/serializers/jsonapi/tag-serializer.js';
import { usecases } from '../../domain/usecases/index.js';

const create = async function (request, h) {
  const tagName = request.payload.data.attributes['name'].toUpperCase();
  const createdTag = await usecases.createTag({ tagName });
  return h.response(tagSerializer.serialize(createdTag)).created();
};

const findAllTags = async function () {
  const organizationsTags = await usecases.findAllTags();
  return tagSerializer.serialize(organizationsTags);
};

const getRecentlyUsedTags = async function (request) {
  const tagId = request.params.id;
  const recentlyUsedTags = await usecases.getRecentlyUsedTags({ tagId });
  return tagSerializer.serialize(recentlyUsedTags);
};

export { create, findAllTags, getRecentlyUsedTags };
