import React from 'react';
import { action } from 'mobx';
import { Icon, IconSources } from '../Icon';

export interface TextInputProps {
  onChange: (value: string) => void;
  onKeyPress?: (key: number) => void;
  placeholder?: string;
  type?: string;
  value?: string;
  pattern?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  list?: string;
  minLength?: number;
  maxLength?: number;
  hasError?: boolean | string;
  label?: string;
}

export class TextInput extends React.Component<TextInputProps> {
  public textInput: HTMLInputElement | null = null;

  focus(): void {
    this.textInput && this.textInput.focus();
  }
  render() {
    return <div className="textinput-wrapper">
      {this.props.label}
      <input {...this.props} ref={(elem) => {
        if (elem) {
          this.textInput = elem
        }
        }}
        onChange={action((event) => this.props.onChange(event.target.value))}
        onKeyPress={action((event) => this.props.onKeyPress && this.props.onKeyPress(event.keyCode))} />
      {this.props.hasError && <Icon name="exclamation-circle"
        source={IconSources.FONTAWESOME} className="error-icon"
        tooltip={typeof this.props.hasError === "string" ? this.props.hasError : undefined} />}
    </div>;
  }
}