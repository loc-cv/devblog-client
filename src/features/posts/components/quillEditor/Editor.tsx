import { Fragment, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formats, modules, Toolbar } from './Toolbar';

type EditorProps = {
  value?: string;
  onChange?: (...events: any) => void;
  disabled?: boolean;
};

export const Editor = ({ value, onChange, disabled }: EditorProps) => {
  const [text, setText] = useState(value || '');

  return (
    <Fragment>
      <Toolbar />
      <ReactQuill
        readOnly={disabled || false}
        value={text}
        onChange={text => {
          setText(text);
          onChange && onChange(text);
        }}
        theme="snow"
        placeholder={'Write something awesome...'}
        modules={modules}
        formats={formats}
      />
    </Fragment>
  );
};
