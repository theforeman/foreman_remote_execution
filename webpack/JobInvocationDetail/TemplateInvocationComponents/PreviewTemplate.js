import React from 'react';
import PropTypes from 'prop-types';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { translate as __ } from 'foremanReact/common/I18n';

export const PreviewTemplate = ({ inputValues }) =>
  inputValues.length ? (
    <Table
      ouiaId="template-invocation-preview-table"
      isStriped
      variant="compact"
    >
      <Thead>
        <Tr ouiaId="template-invocation-preview-table-head">
          <Th modifier="fitContent">{__('User input')}</Th>
          <Th modifier="fitContent">{__('Value')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {inputValues.map(({ name, value }, index) => (
          <Tr
            key={index}
            ouiaId={`template-invocation-preview-table-row-${name}`}
          >
            <Td>
              <b>{name}</b>
            </Td>
            <Td>{value}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  ) : (
    <span>{__('No user input')}</span>
  );

PreviewTemplate.propTypes = {
  inputValues: PropTypes.array,
};

PreviewTemplate.defaultProps = {
  inputValues: [],
};
