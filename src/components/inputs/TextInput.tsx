import React from 'react';
import { action } from 'mobx';

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
}

export class TextInput extends React.Component<TextInputProps> {
  render() {
    return <input {...this.props}
    onChange={action((event) => this.props.onChange(event.target.value))} onKeyPress={action((event) => this.props.onKeyPress && this.props.onKeyPress(event.keyCode))} />;
  }
}