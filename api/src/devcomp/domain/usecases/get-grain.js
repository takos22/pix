export function getGrain({ id, grainRepository }) {
  return grainRepository.getById({ id });
}
