import { usecases } from '../../domain/usecases/index.js';
import * as frameworkAreasSerializer from '../../infrastructure/serializers/jsonapi/framework-areas-serializer.js';
import * as frameworkSerializer from '../../infrastructure/serializers/jsonapi/framework-serializer.js';
import { extractLocaleFromRequest } from '../../infrastructure/utils/request-response-utils.js';

const getFrameworks = async function () {
  const frameworks = await usecases.getFrameworks();
  return frameworkSerializer.serialize(frameworks);
};

const getFrameworkAreas = async function (request) {
  const frameworkId = request.params.id;
  const framework = await usecases.getFrameworkAreas({ frameworkId });
  return frameworkAreasSerializer.serialize(framework);
};

const getPixFrameworkAreasWithoutThematics = async function (request) {
  const locale = extractLocaleFromRequest(request);
  const framework = await usecases.getFrameworkAreas({ frameworkName: 'Pix', locale });
  return frameworkAreasSerializer.serialize(framework, { withoutThematics: true });
};

const getFrameworksForTargetProfileSubmission = async function (request) {
  const locale = extractLocaleFromRequest(request);
  const learningContent = await usecases.getLearningContentForTargetProfileSubmission({ locale });
  return frameworkSerializer.serializeDeepWithoutSkills(learningContent.frameworks);
};

export {
  getFrameworks,
  getFrameworkAreas,
  getPixFrameworkAreasWithoutThematics,
  getFrameworksForTargetProfileSubmission,
};
