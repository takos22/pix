import { expect, HttpTestServer, sinon } from '../../../test-helper.js';
import { moduleUnderTest } from '../../../../lib/application/courses.js';
import * as courseController from '../../../../lib/application/courses/course-controller.js';

describe('Unit | Router | course-router', function () {
  describe('GET /api/courses/{id}', function () {
    it('should exist', async function () {
      // given
      sinon.stub(courseController, 'get').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/courses/course_id');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
