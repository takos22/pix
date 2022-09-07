class OrganizationForUserAdmin {
  constructor({
    id,
    updatedAt,
    role,
    disabledAt,
    organizationId,
    organizationName,
    organizationType,
    organizationExternalId,
  } = {}) {
    this.id = id;
    this.updatedAt = updatedAt;
    this.role = role;
    this.disabledAt = disabledAt;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.organizationType = organizationType;
    this.organizationExternalId = organizationExternalId;
  }
}

module.exports = OrganizationForUserAdmin;
