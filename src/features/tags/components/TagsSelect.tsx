import { useState } from 'react';
import Select from 'react-select';
import { useGetTagsQuery } from '../tagsApiSlice';

type TagsSelectProps = {
  value?: string[];
  onChange?: (...events: any) => void;
  disabled?: boolean;
};

export const TagsSelect = ({ value, onChange, disabled }: TagsSelectProps) => {
  const { data: tagsQueryResult, isLoading } = useGetTagsQuery({ limit: 9999 });
  const [, setSelected] = useState(value || []);

  const options = tagsQueryResult
    ? tagsQueryResult.data.map(tag => ({
        value: tag.name,
        label: tag.name.toUpperCase(),
      }))
    : [];

  const defaultValues = value
    ? value.map(tagName => ({ value: tagName, label: tagName.toUpperCase() }))
    : [];

  return (
    <Select
      options={options}
      isMulti
      placeholder="Select tags for your post"
      defaultValue={defaultValues}
      onChange={items => {
        setSelected(items.map(item => item.value));
        onChange && onChange(items.map(item => item.value));
      }}
      isDisabled={disabled || false}
      isClearable={true}
      isSearchable={true}
      isLoading={isLoading}
      loadingMessage={() => 'Loading tags...'}
      closeMenuOnSelect={false}
      // noOptionsMessage={() => 'Something went wrong while loading tags...'}
      maxMenuHeight={300}
    />
  );
};
