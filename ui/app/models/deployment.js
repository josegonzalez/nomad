import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { fragmentArray } from 'ember-data-model-fragments/attributes';
import shortUUIDProperty from '../utils/properties/short-uuid';

const { computed } = Ember;

export default Model.extend({
  shortId: shortUUIDProperty('id'),

  job: belongsTo('job'),
  versionNumber: attr('number'),

  // If any task group is not promoted, the deployment needs promotion
  requiresPromotion: computed('taskGroupSummaries.@each.promoted', function() {
    return this.get('taskGroupSummaries')
      .mapBy('promoted')
      .some(promoted => !promoted);
  }),

  status: attr('string'),
  statusDescription: attr('string'),
  taskGroupSummaries: fragmentArray('task-group-deployment-summary'),

  version: computed('versionNumber', 'job.versions.[]', function() {
    return (this.get('job.versions') || []).findBy('number', this.get('versionNumber'));
  }),

  statusClass: computed('status', function() {
    const classMap = {
      running: 'is-running',
      successful: 'is-primary',
      paused: 'is-light',
      failed: 'is-error',
      cancelled: 'is-cancelled',
    };

    return classMap[this.get('status')] || 'is-dark';
  }),
});
