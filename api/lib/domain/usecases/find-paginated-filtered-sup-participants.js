export default function findPaginatedFilteredSupParticipants({
  organizationId,
  filter,
  page,
  sort,
  supOrganizationParticipantRepository,
}) {
  return supOrganizationParticipantRepository.findPaginatedFilteredSupParticipants({
    organizationId,
    filter,
    page,
    sort,
  });
}
