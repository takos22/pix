import Component from '@ember/component';

const columns = [
  {
    component:'certification-list-checkbox',
    useFilter:false,
    mayBeHidden:false,
    componentForSortCell:'certification-list-select-all'
  },
  {
    propertyName: 'id',
    title: 'Id',
    routeName: 'authenticated.certifications.single.info',
    sortPrecedence: 1
  },
  {
    propertyName: 'firstName',
    title: 'Prénom'
  },
  {
    propertyName: 'lastName',
    title: 'Nom'
  },
  {
    propertyName: 'status',
    title: 'Statut'
  },
  {
    propertyName: 'pixScore',
    title: 'Score'
  },
  {
    propertyName: 'creationDate',
    title: 'Début'
  },
  {
    propertyName: 'completionDate',
    title: 'Fin'
  }
];

export default Component.extend({
  init() {
    this._super(...arguments);
    this.columns = columns;
  }
});
