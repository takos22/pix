require('dotenv').config();

const challengeRepository = require("../../lib/infrastructure/repositories/challenge-repository");


(async () => {

  await challengeRepository.get("recLt9uwa2dR3IYpi");

  console.time("PERFORMANCE");

  for (let i = 0; i < 500; i++) {
    await challengeRepository.get("recLt9uwa2dR3IYpi");
  }

  console.timeEnd("PERFORMANCE");

})();

