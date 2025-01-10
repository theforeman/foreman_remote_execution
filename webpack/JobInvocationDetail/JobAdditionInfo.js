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

const Schedule = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    concurrency_level,
    scheduling,
    time_to_pickup,
    execution_timeout_interval,
  } = data;
  return (
    <ExpandableSection
      toggleText={__('Schedule')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <DataList isCompact>
        <>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Concurrency level limited to')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {concurrency_level}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Scheduled to start before')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {scheduling?.start_before}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Scheduled to start at')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {scheduling?.start_at}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Timeout to kill after')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {`${execution_timeout_interval} ${__('seconds')}`}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Time to pickup')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {`${time_to_pickup} ${__('seconds')}`}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        </>
      </DataList>
    </ExpandableSection>
  );
};
const Recurring = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { recurrence } = data;

  if (!recurrence) return null;
  return (
    <ExpandableSection
      toggleText={__('Recurring logic')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <DataList isCompact>
        <>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1}>{__('ID')}</DataListCell>,
                  <DataListCell width={4}>
                    <a
                      href={`/foreman_tasks/recurring_logics/${recurrence.id}`}
                    >
                      {recurrence.id}
                    </a>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Cron line')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.cron_line}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          {/* TODO <DataListCell width={1} key={0}>{__('Action')}</DataListCell>
            <DataListCell width={1} key={0}>
              {format_task_input(recurring_logic.tasks.last)}
            </DataListCell> */}
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Last occurrence')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.last_occurrence}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Next occurrence')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.next_occurrence}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Current iteration')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.iteration}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Iteration limit')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.max_iteration}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Repeat until')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.end_time}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          {/* TODO <DataListCell width={1} key={0}>{__('State')}</DataListCell>
            <DataListCell width={1} key={0}>
              {recurring_logic_state(recurring_logic)}
            </DataListCell> */}
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Purpose')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.purpose}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {__('Task count')}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {recurrence.task_count}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        </>
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

  // manual selection using static query
  // execution order
  //
  // TODO is needed? bookmark_id is always null in the wizard, also why is knowing the bookmark relevent?
  // const targetingSelectioning = targeting.bookmark_id ? `{__('Bookmark') ${targeting.bookmark_name}` :  __('Manual selection');
  const type = `${__('Manual selection')} ${__('using ')} \
  ${TARGETING_TYPES[targeting.targeting_type].toLowerCase()}`;
  return (
    <ExpandableSection
      toggleText={__('Target Hosts')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <span>{type}</span>
      <pre>{targeting.search_query}</pre>

      <DataList isCompact>
        <DataListItem>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell width={1} key={0}>
                  {__('Organization')}
                </DataListCell>,
                <DataListCell width={4} key={1}>
                  {organization}
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        <DataListItem>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell width={1} key={0}>
                  {__('Location')}
                </DataListCell>,
                <DataListCell width={4} key={1}>
                  {location}
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
        <DataListItem>
          <DataListItemRow>
            <DataListItemCells
              dataListCells={[
                <DataListCell width={1} key={0}>
                  {__('Execution order')}
                </DataListCell>,
                <DataListCell width={4} key={1}>
                  {targeting.randomized_ordering
                    ? __('Randomized')
                    : __('Alphabetical')}
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
        </DataListItem>
      </DataList>
    </ExpandableSection>
  );
};
const Inputs = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputs =
    data?.template_invocations?.[0]?.template_invocation_input_values;

  // const inputs = TODO get inputs
  // data?.pattern_template_invocations?.[0]?.template_invocation_input_values;
  if (!inputs) return null;
  return (
    <ExpandableSection
      toggleText={__('User Inputs')}
      onToggle={setIsExpanded}
      isExpanded={isExpanded}
    >
      <DataList isCompact>
        {inputs.map(({ template_input_name: name, value }) => (
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key={0}>
                    {name}
                  </DataListCell>,
                  <DataListCell width={4} key={1}>
                    {value}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    </ExpandableSection>
  );
};
export const JobAdditionInfo = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    // <ExpandableSection
    //   toggleText={
    //     isExpanded ? __('Show less information') : __('Show more information')
    //   }
    //   onToggle={setIsExpanded}
    //   isExpanded={isExpanded}
    // >
    <>
      <Recurring data={data} />
      <TargetHosts data={data} />
      <Inputs data={data} />
      <Schedule data={data} />
    </>
    // </ExpandableSection>
  );
};

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
