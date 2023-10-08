import React from 'react';

import {
  Button,
  ButtonGroup,
  ComboBox, 
  Content,
  Dialog,
  Divider, 
  Heading,
  Item,
  Form,
  NumberField,
  TextArea,
  TextField
} from '@adobe/react-spectrum';

import {ToastQueue} from '@react-spectrum/toast';

export function EditRecipeDialog (recipe, setRefresh, close, magazines, categories) {

  const [name, setName] = React.useState(recipe.name || "");
  const isNameValid = React.useMemo(() => name && name.length > 0 ? true : false, [name]);

  const [magazine, setMagazine] = React.useState(recipe.magazine || "");
  const isMagazineValid = React.useMemo(() => magazine && magazine.length > 0 ? true : false, [magazine]);

  const [page, setPage] = React.useState(recipe.page || 0);
  const isPageValid = React.useMemo(() => page && page > 0 ? true : false, [page]);

  const [category, setCategory] = React.useState(recipe.category || "");
  const isCategoryValid = React.useMemo(() => category && category.length > 0 ? true : false, [category]);

  const [notes, setNotes] = React.useState(recipe.notes || "" );

  const [showValidation, setShowValidation] = React.useState(recipe.id ? true : false);
  const isFormValid = React.useMemo(() => {
    return (isNameValid && isMagazineValid && isPageValid && isCategoryValid);
  }, [isNameValid, isMagazineValid, isPageValid, isCategoryValid]);

  const heading = recipe.id ? `Edit Recipe: {recipe.name}` : 'Add Recipe';

  return (
    <Dialog>
      <Heading>{ heading }</Heading>
      <Divider />
      <Content>
        <Form>
          <TextField
            label="Name"
            value={ name }
            onChange={ setName }
            validationState={ showValidation ? (isNameValid ? "valid" : "invalid") : "" }
          />
          <ComboBox
            label="Magazine"
            defaultItems={magazines}
            inputValue={magazine}
            onInputChange={setMagazine}
            allowsCustomValue
            validationState={ showValidation ? (isMagazineValid ? "valid" : "invalid") : "" }
          >
            {item => <Item>{item.name}</Item>}
          </ComboBox>
          <NumberField
            label="Page"
            value={ page }
            onChange={ setPage }
            minValue={ 0 }
            validationState={ showValidation ? (isPageValid ? "valid" : "invalid") : "" }
          />
          <ComboBox
            label="Category"
            defaultItems={categories}
            inputValue={category}
            onInputChange={setCategory}
            allowsCustomValue
            validationState={ showValidation ? (isCategoryValid ? "valid" : "invalid") : "" }
          >
            {item => <Item>{item.name}</Item>}
          </ComboBox>
          <TextArea label="Notes" value={ notes } onChange={ setNotes } />
        </Form>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={close}>Cancel</Button>
        <Button
          variant="accent"
          onPress={async () => {
            
            if (!isFormValid) {
              setShowValidation(true);
              return false;
            }

            const saveRecipe = {
              name: name,
              magazine: magazine,
              page: page,
              category: category,
              notes: notes
            };

            if (recipe.id) {
              await window.api.updateRecipe(recipe.id, saveRecipe)
                .then(() => {
                  ToastQueue.positive("Recipe was saved successfully", {timeout: 3000})  
                }).catch((e) => {
                  console.error(e);
                  ToastQueue.negative("Recipe could not be saved", {timeout: 3000})  
                });
            } else {
              await window.api.addRecipe(saveRecipe)
                .then(() => {
                  ToastQueue.positive("Recipe was added successfully", {timeout: 3000})
                }).catch((e) => {
                  console.error(e);
                  ToastQueue.negative("Recipe could not be added", {timeout: 3000})
                });
            }
            setRefresh(new Date());
            close();
          }}
        >
          Save
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
