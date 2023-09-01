import modulixDatasource from '../datasources/modulix-datasource.json' assert { type: 'json' };
import { Grain } from '../../domain/models/Grain.js';
import { NotFoundError } from '../../../shared/domain/errors.js';

export async function getById({ id }) {
  const datasourceGrain = modulixDatasource.grain.find((grain) => grain.id === id);
  if (!datasourceGrain) throw new NotFoundError();
  return new Grain(datasourceGrain);
}
