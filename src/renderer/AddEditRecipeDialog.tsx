import React from 'react';
import {
  ActionButton,
  Button,
  ButtonGroup,
  ComboBox,
  Content,
  Dialog,
  Divider,
  Flex,
  Form,
  Heading,
  Item,
  Link,
  NumberField,
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
  const [newMagazine, setNewMagazine] = React.useState('');
  const [category, setCategory] = React.useState(recipe?.category || '');
  const [newCategory, setNewCategory] = React.useState('');
  const [page, setPage] = React.useState(recipe?.page || 0);
  const [notes, setNotes] = React.useState(recipe?.notes || '');

  const nameIsValid = React.useMemo(() => name.length > 0, [name]);
  const magazineIsValid = React.useMemo(
    () => magazine && magazine.length > 0,
    [magazine],
  );
  const [magazineIsNew, setMagazineIsNew] = React.useState(false);
  const newMagazineIsValid = React.useMemo(
    () => newMagazine && newMagazine.length > 0,
    [newMagazine],
  );

  const categoryIsValid = React.useMemo(
    () => category && category.length > 0,
    [category],
  );
  const [categoryIsNew, setCategoryIsNew] = React.useState(false);
  const newCategoryIsValid = React.useMemo(
    () => newCategory && newCategory.length > 0,
    [newCategory],
  );
  const pageIsValid = React.useMemo(() => page > 0, [page]);

  return (
    <Dialog>
      <Heading>{recipe ? 'Update Recipe' : 'Create Recipe'}</Heading>
      <Divider />
      <Content>
        <Form maxWidth="size-4600">
          <TextField label="Name" value={name} onChange={setName} isRequired />
          <Flex direction="row" gap="size-200">
            {magazineIsNew && (
              <>
                <TextField
                  label="New Magazine"
                  value={newMagazine}
                  onChange={setNewMagazine}
                  isRequired
                  flexGrow={1}
                />
                <ActionButton
                  isQuiet
                  alignSelf="end"
                  onPress={() => setMagazineIsNew(false)}
                >
                  Use Existing
                </ActionButton>
              </>
            )}
            {!magazineIsNew && (
              <>
                <ComboBox
                  label="Magazine"
                  defaultItems={magazineOptions}
                  onSelectionChange={setMagazine}
                  selectedKey={magazine}
                  isRequired
                  flexGrow={1}
                >
                  {(item: any) => <Item key={item.id}>{item.name}</Item>}
                </ComboBox>
                <ActionButton
                  isQuiet
                  alignSelf="end"
                  onPress={() => setMagazineIsNew(true)}
                >
                  Add New
                </ActionButton>
              </>
            )}
          </Flex>
          <NumberField
            label="Page"
            minValue={0}
            value={page}
            onChange={setPage}
            isRequired
          />
          <Flex direction="row" gap="size-200">
            {categoryIsNew && (
              <>
                <TextField
                  label="New Category"
                  value={newCategory}
                  onChange={setNewCategory}
                  isRequired
                  flexGrow={1}
                />
                <ActionButton
                  isQuiet
                  alignSelf="end"
                  onPress={() => setCategoryIsNew(false)}
                >
                  Use Existing
                </ActionButton>
              </>
            )}
            {!categoryIsNew && (
              <>
                <ComboBox
                  label="Category"
                  defaultItems={categoryOptions}
                  onSelectionChange={setCategory}
                  selectedKey={category}
                  isRequired
                  flexGrow={1}
                >
                  {(item: any) => <Item key={item.id}>{item.name}</Item>}
                </ComboBox>
                <ActionButton
                  isQuiet
                  alignSelf="end"
                  onPress={() => setCategoryIsNew(true)}
                >
                  Add New
                </ActionButton>
              </>
            )}
          </Flex>
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
            !nameIsValid ||
            (magazine && !magazineIsValid) ||
            (newMagazine && !newMagazineIsValid) ||
            !categoryIsValid ||
            (newCategory && !newCategoryIsValid) ||
            !pageIsValid
          }
          onPress={() => {
            if (recipe === null) {
              window.electron.recipeApi
                .addRecipe({
                  name,
                  magazine: magazineIsNew ? newMagazine : magazine,
                  category: categoryIsNew ? newCategory : category,
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
                  magazine: magazineIsNew ? newMagazine : magazine,
                  category: categoryIsNew ? newCategory : category,
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
