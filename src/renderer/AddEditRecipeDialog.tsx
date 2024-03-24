import React from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Form,
  Heading,
  Item,
  NumberField,
  Picker,
  TextArea,
  TextField,
} from '@adobe/react-spectrum';

import { ToastQueue } from '@react-spectrum/toast';

import Recipe from './Recipe';

export default function AddEditRecipeDialog({
  recipe,
  magazineOptions,
  categoryOptions,
  close,
}: {
  recipe: Recipe;
  close: Function;
}) {
  const [name, setName] = React.useState(recipe?.name || '');
  const [magazine, setMagazine] = React.useState(recipe?.magazine || '');
  const [category, setCategory] = React.useState(recipe?.category || '');
  const [page, setPage] = React.useState(recipe?.page || 0);
  const [notes, setNotes] = React.useState(recipe?.notes || '');

  const nameIsValid = React.useMemo(() => name.length > 0, [name]);
  const magazineIsValid = React.useMemo(() => magazine.length > 0, [magazine]);
  const categoryIsValid = React.useMemo(() => category.length > 0, [category]);
  const pageIsValid = React.useMemo(() => page > 0, [page]);

  return (
    <Dialog>
      <Heading>{recipe ? 'Update Recipe' : 'Create Recipe'}</Heading>
      <Divider />
      <Content>
        <Form maxWidth="size-3600">
          <TextField label="Name" value={name} onChange={setName} isRequired />
          <Picker
            label="Magazine"
            items={magazineOptions}
            onSelectionChange={setMagazine}
            selectedKey={magazine}
            isRequired
          >
            {(item: any) => <Item key={item.id}>{item.name}</Item>}
          </Picker>
          <NumberField
            label="Page"
            minValue={0}
            value={page}
            onChange={setPage}
            isRequired
          />
          <Picker
            label="Category"
            items={categoryOptions}
            onSelectionChange={setCategory}
            selectedKey={category}
            isRequired
          >
            {(item: any) => <Item key={item.id}>{item.name}</Item>}
          </Picker>
          <TextArea label="Notes" value={notes} onChange={setNotes} />
        </Form>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
        <Button
          autoFocus
          variant="accent"
          isDisabled={
            !nameIsValid || !magazineIsValid || !categoryIsValid || !pageIsValid
          }
          onPress={() => {
            if (recipe === null) {
              window.electron.recipeApi
                .addRecipe({
                  name,
                  magazine,
                  category,
                  page,
                  notes,
                })
                .then(() =>
                  ToastQueue.positive('The recipe was added.', {
                    timeout: 2000,
                  }),
                )
                .catch((err) => {
                  console.error(err);
                  ToastQueue.negative(
                    'An error occurred when adding the recipe',
                  );
                });
            } else {
              if (!recipe.id) {
                throw Error('Invalid recipe id.');
              }
              window.electron.recipeApi
                .updateRecipe({
                  id: recipe.id,
                  name,
                  magazine,
                  category,
                  page,
                  notes,
                })
                .then(() =>
                  ToastQueue.positive('The recipe was updated.', {
                    timeout: 2000,
                  }),
                )
                .catch((err) => {
                  console.error(err);
                  ToastQueue.negative(
                    'An error occurred when updating the recipe',
                  );
                });
            }
            close();
          }}
        >
          {recipe ? 'Update' : 'Add'}
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

// export default function AddEditRecipe({
//   recipe,
//   magazineOptions,
//   categoryOptions,
// }) {
//   const [magazine, setMagazine] = React.useState(recipe?.magazine || '');
//   const [category, setCategory] = React.useState(recipe?.category || '');

//   return (
    // <Form maxWidth="size-3600">
    //   <TextField label="Name" />
    //   <Picker
    //     label="Magazine"
    //     items={magazineOptions}
    //     onSelectionChange={setMagazine}
    //   >
    //     {(item: any) => <Item key={item.id}>{item.name}</Item>}
    //   </Picker>
    //   <NumberField label="Page" minValue={0} />
    //   <Picker
    //     label="Category"
    //     items={magazineOptions}
    //     onSelectionChange={setCategory}
    //   >
    //     {(item: any) => <Item key={item.id}>{item.name}</Item>}
    //   </Picker>
    //   <TextArea label="Notes" />
    // </Form>
//   );
// }
