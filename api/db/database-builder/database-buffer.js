const INITIAL_ID = 100000;
const objectsToInsert = [];
const nextId = INITIAL_ID;

const pushInsertable = function ({ tableName, values }) {
  this.objectsToInsert.push({ tableName, values });

  return values;
};

const getNextId = function () {
  return this.nextId++;
};

const purge = function () {
  this.objectsToInsert = [];
};

module.exports = {
  objectsToInsert,
  nextId,
  pushInsertable,
  getNextId,
  purge,
};
