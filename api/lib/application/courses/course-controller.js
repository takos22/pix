import * as courseService from '../../../lib/domain/services/course-service.js';
import { extractUserIdFromRequest } from '../../infrastructure/utils/request-response-utils.js';

const get = function (request, h, dependencies = { courseService }) {
  const courseId = request.params.id;
  const userId = extractUserIdFromRequest(request);

  return dependencies.courseService.getCourse({ courseId, userId }).then(dependencies.courseSerializer.serialize);
};

export { get };
