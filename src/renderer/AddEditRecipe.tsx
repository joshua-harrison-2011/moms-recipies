import React from 'react';
import {
  Form,
  TextField,
  NumberField,
  TextArea,
  Picker,
  Item,
} from '@adobe/react-spectrum';

export default function AddEditRecipe({
  recipe,
  magazineOptions,
  categoryOptions,
}) {
  const [magazine, setMagazine] = React.useState(recipe?.magazine || '');
  const [category, setCategory] = React.useState(recipe?.category || '');

  return (
    <Form maxWidth="size-3600">
      <TextField label="Name" />
      <Picker
        label="Magazine"
        items={magazineOptions}
        onSelectionChange={setMagazine}
      >
        {(item: any) => <Item key={item.id}>{item.name}</Item>}
      </Picker>
      <NumberField label="Page" minValue={0} />
      <Picker
        label="Category"
        items={magazineOptions}
        onSelectionChange={setCategory}
      >
        {(item: any) => <Item key={item.id}>{item.name}</Item>}
      </Picker>
      <TextArea label="Notes" />
    </Form>
  );
}
