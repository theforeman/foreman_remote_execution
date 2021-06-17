import React, { useState } from 'react';
import { Title, Button, Form } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { ScheduleType } from './ScheduleType';
import { RepeatOn } from './RepeatOn';
import { QueryType } from './QueryType';
import { StartEndDates } from './StartEndDates';
import { repeatTypes } from '../../JobWizardConstants';

const Schedule = () => {
  const [repeatType, setRepeatType] = useState(repeatTypes.noRepeat);
  const [repeatAmount, setRepeatAmount] = useState('');
  const [starts, setStarts] = useState('');
  const [ends, setEnds] = useState('');

  return (
    <Form className="schedule-tab">
      <Title headingLevel="h2">{__('Schedule')}</Title>
      <ScheduleType />

      <RepeatOn
        repeatType={repeatType}
        setRepeatType={setRepeatType}
        repeatAmount={repeatAmount}
        setRepeatAmount={setRepeatAmount}
      />
      <StartEndDates
        starts={starts}
        setStarts={setStarts}
        ends={ends}
        setEnds={setEnds}
      />
      <Button variant="link" className="advanced-scheduling-button" isInline>
        {__('Advanced scheduling')}
      </Button>
      <QueryType />
    </Form>
  );
};

export default Schedule;
