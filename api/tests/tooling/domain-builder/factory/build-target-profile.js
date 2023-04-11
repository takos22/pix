import { buildSkill } from './build-skill.js';
import { TargetProfile } from '../../../../lib/domain/models/TargetProfile.js';

const buildTargetProfile = function ({
  id = 123,
  name = 'Profil cible super cool',
  imageUrl = 'ImageURL',
  isPublic = true,
  isSimplifiedAccess = false,
  skills = [buildSkill()],
  ownerOrganizationId = 456,
  outdated = false,
  stages = [],
  badges = [],
} = {}) {
  return new TargetProfile({
    id,
    name,
    imageUrl,
    isPublic,
    isSimplifiedAccess,
    skills,
    ownerOrganizationId,
    outdated,
    stages,
    badges,
  });
};

export { buildTargetProfile };
