import * as courseSerializer from '../../infrastructure/serializers/jsonapi/course-serializer.js';
import * as courseService from '../../../lib/domain/services/course-service.js';
import { extractUserIdFromRequest } from '../../infrastructure/utils/request-response-utils.js';

const get = function (request) {
  const courseId = request.params.id;
  const userId = extractUserIdFromRequest(request);

  return courseService.getCourse({ courseId, userId }).then(courseSerializer.serialize);
};

export { get };
