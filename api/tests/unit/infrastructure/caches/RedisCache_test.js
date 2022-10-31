const Redlock = require('redlock');
const { expect, sinon } = require('../../../test-helper');
const settings = require('../../../../lib/config');
const RedisCache = require('../../../../lib/infrastructure/caches/RedisCache');

describe('Unit | Infrastructure | Cache | redis-cache', function () {
  let stubbedClient;
  let redisCache;

  const REDIS_URL = 'redis_url';
  const CACHE_KEY = 'cache_key';
  const REDIS_CLIENT_ERROR = new Error('A Redis client error');

  beforeEach(function () {
    stubbedClient = {
      lockDisposer: sinon.stub().resolves(() => {
        return;
      }),
    };
    sinon.stub(RedisCache, 'createClient').withArgs(REDIS_URL).returns(stubbedClient);
    redisCache = new RedisCache(REDIS_URL);
  });

  describe('#get', function () {
    beforeEach(function () {
      stubbedClient.get = sinon.stub();
      redisCache.set = sinon.stub();
    });

    context('when the value is already in cache', function () {
      it('should resolve with the existing value', function () {
        // given
        const cachedData = { foo: 'bar' };
        const redisCachedData = JSON.stringify(cachedData);
        stubbedClient.get.withArgs(CACHE_KEY).resolves(redisCachedData);

        // when
        const promise = redisCache.get(CACHE_KEY);

        // then
        return expect(promise).to.have.been.fulfilled.then((result) => {
          expect(result).to.deep.equal(cachedData);
        });
      });
    });

    context('when the value is not in cache', function () {
      beforeEach(function () {
        const cachedObject = { foo: 'bar' };
        const redisCachedValue = JSON.stringify(cachedObject);
        stubbedClient.get.withArgs(CACHE_KEY).onCall(0).resolves(null);
        stubbedClient.get.withArgs(CACHE_KEY).onCall(1).resolves(redisCachedValue);
        redisCache.set.resolves();
      });

      it('should try to lock the cache key', function () {
        // given
        const expectedLockedKey = 'locks:' + CACHE_KEY;
        const handler = sinon.stub().resolves();

        // when
        const promise = redisCache.get(CACHE_KEY, handler);

        // then
        return promise.then(() => {
          return expect(stubbedClient.lockDisposer).to.have.been.calledWith(
            expectedLockedKey,
            settings.caching.redisCacheKeyLockTTL
          );
        });
      });

      context('and the cache key is not already locked', function () {
        it('should add into the cache the value returned by the handler', function () {
          // given
          const dataFromHandler = { name: 'data from learning content' };
          const handler = () => Promise.resolve(dataFromHandler);

          // when
          const promise = redisCache.get(CACHE_KEY, handler);

          // then
          return promise.then(() => {
            return expect(redisCache.set).to.have.been.calledWith(CACHE_KEY, dataFromHandler);
          });
        });

        it('should return the value', function () {
          // given
          const dataFromHandler = { name: 'data from learning content' };
          const handler = () => Promise.resolve(dataFromHandler);
          redisCache.set.resolves(dataFromHandler);

          // when
          const promise = redisCache.get(CACHE_KEY, handler);

          // then
          return promise.then((value) => {
            return expect(value).to.equal(dataFromHandler);
          });
        });
      });

      context('and the cache key is already locked', function () {
        it('should wait and retry to get the value from the cache', function () {
          // given
          stubbedClient.lockDisposer.rejects(new Redlock.LockError());
          const handler = () => {
            return;
          };

          // when
          const promise = redisCache.get(CACHE_KEY, handler);

          // then
          return promise.then(() => {
            expect(stubbedClient.get).to.have.been.calledTwice;
          });
        });
      });
    });

    it('should reject when the Redis cache client throws an error', function () {
      // given

      stubbedClient.get.rejects(REDIS_CLIENT_ERROR);

      // when
      const promise = redisCache.get(CACHE_KEY);

      // then
      return expect(promise).to.have.been.rejectedWith(REDIS_CLIENT_ERROR);
    });

    it('should reject when the previously cached value can not be parsed as JSON', function () {
      // given
      const redisCachedValue = 'Unprocessable JSON object';
      stubbedClient.get.resolves(redisCachedValue);

      // when
      const promise = redisCache.get(CACHE_KEY);

      // then
      return expect(promise).to.have.been.rejectedWith(SyntaxError);
    });
  });

  describe('#set', function () {
    const objectToCache = { foo: 'bar' };

    beforeEach(function () {
      stubbedClient.set = sinon.stub();
    });

    it('should resolve with the object to cache', function () {
      // given
      stubbedClient.set.resolves();

      // when
      const promise = redisCache.set(CACHE_KEY, objectToCache);

      // then
      return expect(promise).to.have.been.fulfilled.then((result) => {
        expect(result).to.deep.equal(objectToCache);
        expect(stubbedClient.set).to.have.been.calledWith(CACHE_KEY, JSON.stringify(objectToCache));
      });
    });

    it('should reject when the Redis cache client throws an error', function () {
      // given
      stubbedClient.set.rejects(REDIS_CLIENT_ERROR);

      // when
      const promise = redisCache.set(CACHE_KEY, objectToCache);

      // then
      return expect(promise).to.have.been.rejectedWith(REDIS_CLIENT_ERROR);
    });
  });

  describe('#flushAll', function () {
    beforeEach(function () {
      stubbedClient.flushAll = sinon.stub();
    });

    it('should resolve', function () {
      // given
      stubbedClient.flushAll.resolves();

      // when
      const promise = redisCache.flushAll();

      // then
      return expect(promise).to.have.been.fulfilled;
    });

    it('should reject when the Redis cache client throws an error', function () {
      // given
      stubbedClient.flushall.rejects(REDIS_CLIENT_ERROR);

      // when
      const promise = redisCache.flushAll();

      // then
      return expect(promise).to.have.been.rejectedWith(REDIS_CLIENT_ERROR);
    });
  });
});
