/* eslint-disable react/prop-types */
import React from 'react';

import {
  ActionButton,
  Cell,
  Column,
  DialogTrigger,
  Flex,
  Item,
  Picker,
  Row,
  SearchField,
  TableView,
  TableBody,
  TableHeader,
  Tooltip,
  TooltipTrigger,
} from '@adobe/react-spectrum';

import Edit from '@spectrum-icons/workflow/Edit';
import Note from '@spectrum-icons/workflow/Note';
import Recipe from './Recipe';
import AddEditRecipeDialog from './AddEditRecipeDialog';

const columns = [
  //  { name: 'Id', uid: 'id', width: '10%' },
  { name: 'Name', uid: 'name', width: '45%' },
  { name: 'Category', uid: 'category' },
  { name: 'Magazine', uid: 'magazine' },
  { name: 'Page', uid: 'page', width: '10%' },
  { name: 'Notes', uid: 'notes', width: '10%' },
  // { name: 'Actions', uid: 'actions', hideHeader: true },
];

// eslint-disable-next-line react/prop-types
export default function RecipeList({
  recipes,
  categoryOptions,
  magazineOptions,
  triggerRecipeRefresh,
}) {
  const [height, setHeight] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState(null);
  const [magazine, setMagazine] = React.useState(null);

  const filteredRecipes = React.useMemo(() => {
    const searchLower = search.toLocaleLowerCase();

    // eslint-disable-next-line react/prop-types
    return recipes.filter((recipe: Recipe) => {
      if (
        searchLower &&
        recipe.name.toLocaleLowerCase().indexOf(searchLower) === -1
      ) {
        return false;
      }
      if (category && category !== recipe.category) {
        return false;
      }
      if (magazine && magazine !== recipe.magazine) {
        return false;
      }
      return true;
    });
  }, [recipes, category, magazine, search]);

  const recalculateHeight = React.useCallback(() => {
    setHeight(window.innerHeight - document.getElementById("recipe-table").offsetTop - 30);
  }, []);

  React.useEffect(() => {
    recalculateHeight();
    window.addEventListener('resize', recalculateHeight);
    return () => window.removeEventListener('resize', recalculateHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction="column" width="100%" gap="size-100" marginTop="size-200">
      <Flex direction="row" gap="size-225">
        <SearchField label="Search" value={search} onChange={setSearch} />
        <Picker
          label="Category"
          items={categoryOptions}
          selectedKey={category}
          onSelectionChange={setCategory}
        >
          {(item: any) => <Item key={item.id}>{item.name}</Item>}
        </Picker>
        <Picker
          label="Magazine"
          items={magazineOptions}
          selectedKey={magazine}
          onSelectionChange={setMagazine}
        >
          {(item: any) => <Item key={item.id}>{item.name}</Item>}
        </Picker>
        <ActionButton
          alignSelf="end"
          onPress={() => {
            setSearch('');
            setMagazine(null);
            setCategory(null);
          }}
        >
          Reset
        </ActionButton>
      </Flex>
      <TableView
        aria-label="Recipes"
        width="100%"
        height={height}
        id="recipe-table"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              key={column.uid}
              hideHeader={column.hideHeader}
              width={column.width}
            >
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={filteredRecipes}>
          {(item: Recipe) => {
            return (
              <Row>
                {(columnKey) => {
                  if (columnKey === 'notes') {
                    if (item[columnKey]) {
                      return (
                        <Cell>
                          <TooltipTrigger delay={0}>
                            <ActionButton isQuiet>
                              <Note />
                            </ActionButton>
                            <Tooltip>{item[columnKey]}</Tooltip>
                          </TooltipTrigger>
                        </Cell>
                      );
                    }
                    return (
                      <Cell>
                        <span />
                      </Cell>
                    );
                  }
                  if (columnKey === 'actions') {
                    return (
                      <Cell>
                        <DialogTrigger type="modal">
                          <ActionButton isQuiet>
                            <Edit />
                          </ActionButton>
                          {(close) => (
                            <AddEditRecipeDialog
                              recipe={item}
                              close={() => {
                                triggerRecipeRefresh();
                                close();
                              }}
                              categoryOptions={categoryOptions}
                              magazineOptions={magazineOptions}
                            />
                          )}
                        </DialogTrigger>
                      </Cell>
                    );
                  }
                  return <Cell>{item[columnKey]}</Cell>;
                }}
              </Row>
            );
          }}
        </TableBody>
      </TableView>

    </Flex>
  );
}
