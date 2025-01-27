/* eslint-disable max-lines */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ExpandableSection,
  DataList,
  DataListCell,
  DataListItemCells,
  DataListItem,
  DataListItemRow,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { TARGETING_TYPES } from './JobInvocationConstants';

const ItemsParser = ({ items }) => (
  <>
    {items.map(
      ({ title, value, wrappedValue }, index) =>
        value && (
          <DataListItem key={index}>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {title}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {wrappedValue || value}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        )
    )}
  </>
);
const Schedule = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    concurrency_level,
    scheduling,
    time_to_pickup,
    execution_timeout_interval,
  } = data;
  if (
    !concurrency_level &&
    !scheduling &&
    !time_to_pickup &&
    !execution_timeout_interval
  )
    return null;
  const items = [
    { title: __('Concurrency level limited to'), value: concurrency_level },
    { title: __('Scheduled to start before'), value: scheduling?.start_before },
    { title: __('Scheduled to start at'), value: scheduling?.start_at },
    {
      title: __('Timeout to kill after'),
      value: execution_timeout_interval,
      wrappedValue: `${execution_timeout_interval} ${__('seconds')}`,
    },
    {
      title: __('Time to pickup'),
      value: time_to_pickup,
      wrappedValue: `${time_to_pickup} ${__('seconds')}`,
    },
  ];
  return (
    <ExpandableSection
      toggleText={__('Schedule')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <DataList isCompact>
        <ItemsParser items={items} />
      </DataList>
    </ExpandableSection>
  );
};
const Recurring = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { recurrence } = data;

  if (!recurrence) return null;
  const items = [
    {
      title: __('ID'),
      value: recurrence.id,
      wrappedValue: (
        <a href={`/foreman_tasks/recurring_logics/${recurrence.id}`}>
          {recurrence.id}
        </a>
      ),
    },
    { title: __('Cron line'), value: recurrence.cron_line },
    // TODO { title:__('Action') , value: {format_task_input(recurring_logic.tasks.last)} },
    { title: __('Last occurrence'), value: recurrence.last_occurrence },
    { title: __('Next occurrence'), value: recurrence.next_occurrence },
    { title: __('Current iteration'), value: recurrence.iteration },
    { title: __('Iteration limit'), value: recurrence.max_iteration },
    { title: __('Repeat until'), value: recurrence.end_time },
    // TODO { title:__('State') , value: {recurring_logic_state(recurring_logic)}  },
    { title: __('Purpose'), value: recurrence.purpose },
    { title: __('Task count'), value: recurrence.task_count },
  ];
  return (
    <ExpandableSection
      toggleText={__('Recurring logic')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <DataList isCompact>
        <ItemsParser items={items} />
      </DataList>
    </ExpandableSection>
  );
};
const TargetHosts = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    targeting,
    job_location: location,
    job_organization: organization,
  } = data;

  const targetingSelectioning = targeting.bookmark_name
    ? `${__('Bookmark')} ${targeting.bookmark_name}`
    : __('Manual selection');
  const items = [
    {
      title: __('Organization'),
      value: true,
      wrappedValue: organization || __('Any organization'),
    },
    {
      title: __('Location'),
      value: true,
      wrappedValue: location || __('Any location'),
    },
    {
      title: __('Execution order'),
      value: true,
      wrappedValue: targeting.randomized_ordering
        ? __('Randomized')
        : __('Alphabetical'),
    },
  ];
  return (
    <ExpandableSection
      toggleText={__('Target Hosts')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <span>{targetingSelectioning}</span>{' '}
      <span>
        {__('using ')}
        <b>{TARGETING_TYPES[targeting.targeting_type].toLowerCase()}</b>
      </span>
      <pre>{targeting.search_query}</pre>
      <DataList isCompact>
        <ItemsParser items={items} />
      </DataList>
    </ExpandableSection>
  );
};
const Inputs = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputs =
    data?.pattern_template_invocations?.[0]?.template_invocation_input_values;

  if (!inputs) return null;
  return (
    <ExpandableSection
      toggleText={__('User Inputs')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <DataList isCompact>
        <ItemsParser
          items={inputs.map(({ template_input_name: title, value }) => ({
            title,
            value: true,
            wrappedValue: value,
          }))}
        />
      </DataList>
    </ExpandableSection>
  );
};
export const JobAdditionInfo = ({ data }) => (
  <>
    <Recurring data={data} />
    <TargetHosts data={data} />
    <Inputs data={data} />
    <Schedule data={data} />
  </>
);

JobAdditionInfo.propTypes = {
  data: PropTypes.shape({
    recurrence: PropTypes.object,
    targeting: PropTypes.object,
  }).isRequired,
};

Recurring.propTypes = JobAdditionInfo.propTypes;
TargetHosts.propTypes = JobAdditionInfo.propTypes;
Inputs.propTypes = JobAdditionInfo.propTypes;
Schedule.propTypes = JobAdditionInfo.propTypes;

ItemsParser.propTypes = {
  items: PropTypes.array.isRequired,
};
