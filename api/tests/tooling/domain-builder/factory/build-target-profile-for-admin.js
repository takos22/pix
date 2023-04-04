import { buildArea } from './build-area.js';
import { buildCompetence } from './build-competence.js';
import { buildThematic } from './build-thematic.js';
import { buildTube } from './build-tube.js';
import { TargetProfileForAdminNewFormat as TargetProfileForAdmin } from '../../../../lib/domain/models/TargetProfileForAdminNewFormat.js';

const buildTargetProfileForAdmin = function ({
  id = 123,
  name = 'Profil cible super cool',
  outdated = false,
  isPublic = true,
  createdAt = new Date('2002-01-01'),
  ownerOrganizationId = null,
  description = 'description',
  comment = 'commentaire',
  imageUrl = 'image/url',
  category = 'some_category',
  isSimplifiedAccess = true,
  badges = [],
  areas = [buildArea({ id: 'recArea' })],
  competences = [buildCompetence({ id: 'recCompetence', area: buildArea({ id: 'recArea' }) })],
  thematics = [buildThematic({ id: 'recThematic', competenceId: 'recCompetence' })],
  tubesWithLevelThematicMobileAndTablet = [
    { ...buildTube(), thematicId: 'recThematic', level: 2, mobile: true, tablet: false },
  ],
} = {}) {
  return new TargetProfileForAdmin({
    id,
    name,
    outdated,
    isPublic,
    createdAt,
    ownerOrganizationId,
    description,
    comment,
    imageUrl,
    category,
    isSimplifiedAccess,
    badges,
    areas,
    competences,
    thematics,
    tubes: tubesWithLevelThematicMobileAndTablet,
  });
};

export { buildTargetProfileForAdmin };
