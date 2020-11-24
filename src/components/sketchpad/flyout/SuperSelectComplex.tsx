import React, {Component, Fragment, useState} from 'react';
import { EuiSuperSelect, EuiText } from '@elastic/eui';

function SuperSelectComplex() {
  let options: Array<any> = [
    {
      value: 'option_one',
      inputDisplay: 'Option one',
      dropdownDisplay: (
        <Fragment>
          <strong>Option one</strong>
          <EuiText size="s" color="subdued">
            <p className="euiTextColor--subdued">
              Has a short description giving more detail to the option.
            </p>
          </EuiText>
        </Fragment>
      ),
    },
    {
      value: 'option_two',
      inputDisplay: 'Option two',
      dropdownDisplay: (
        <Fragment>
          <strong>Option two</strong>
          <EuiText size="s" color="subdued">
            <p className="euiTextColor--subdued">
              Has a short description giving more detail to the option.
            </p>
          </EuiText>
        </Fragment>
      ),
    },
    {
      value: 'option_three',
      inputDisplay: 'Option three',
      dropdownDisplay: (
        <Fragment>
          <strong>Option three</strong>
          <EuiText size="s" color="subdued">
            <p className="euiTextColor--subdued">
              Has a short description giving more detail to the option.
            </p>
          </EuiText>
        </Fragment>
      ),
    },
  ];

  const [value, setValue] = useState('option_one');

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <EuiSuperSelect
      options={options}
      valueOfSelected={value}
      onChange={onChange}
      itemLayoutAlign="top"
      hasDividers
    />
  );
}

export default SuperSelectComplex;
