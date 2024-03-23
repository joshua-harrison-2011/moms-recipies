import React from 'react';

import {
  Cell,
  Column,
  Item,
  Picker,
  Row,
  SearchField,
  TableView,
  TableBody,
  TableHeader,

  Flex,
  ActionButton,
  Tooltip,
  TooltipTrigger,
} from '@adobe/react-spectrum';

import Edit from '@spectrum-icons/workflow/Edit';
import Note from '@spectrum-icons/workflow/Note';
import Recipe from './Recipe';

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Category', uid: 'category' },
  { name: 'Magazine', uid: 'magazine' },
  { name: 'Page', uid: 'page' },
  { name: 'Notes', uid: 'notes' },
  { name: 'Actions', uid: 'actions', hideHeader: true}
];

// eslint-disable-next-line react/prop-types
export default function RecipeList({
  recipes,
  categoryOptions,
  magazineOptions,
}) {
  const [height, setHeight] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState(null);
  const [magazine, setMagazine] = React.useState(null);

  const filteredRecipes = React.useMemo(() => {
    // eslint-disable-next-line react/prop-types
    return recipes.filter((recipe: Recipe) => {
      if (category && category !== recipe.category) {
        return false;
      }
      if (magazine && magazine !== recipe.magazine) {
        return false;
      }
      return true;
    });
  }, [recipes, category, magazine]);

  const recalculateHeight = React.useCallback(() => {
    setHeight(window.innerHeight - document.getElementById("recipe-table").offsetTop - 30);
  }, []);

  React.useEffect(() => {
    recalculateHeight();
    window.addEventListener("resize", recalculateHeight);
    return () => window.removeEventListener(recalculateHeight);
  }, []);

  return (
    <Flex direction="column" width="100%" gap="size-100" marginTop="size-200">
      <Flex direction="row" gap="size-225">
        <SearchField
          label="Search"
          value={search}
          onChange={setSearch}
          onSubmit={() => console.log('submitting')}
          onFocusChange={() => console.log('focus')}
        />
        <Picker
          label="Category"
          items={categoryOptions}
          selectedKey={category}
          onSelectionChange={setCategory}
        >
          <Item key="">All</Item>
          {(item: any) => <Item key={item.id}>{item.name}</Item>}
        </Picker>
        <Picker
          label="Magazine"
          items={magazineOptions}
          selectedKey={magazine}
          onSelectionChange={setMagazine}
        >
          <Item key="">All</Item>
          {(item: any) => <Item key={item.id}>{item.name}</Item>}
        </Picker>
      </Flex>
      <TableView
        aria-label="Recipes"
        width="100%"
        height={height}
        id="recipe-table"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column key={column.uid} hideHeader={column.hideHeader}>
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
                    return <Cell><span /></Cell>;
                  }
                  if (columnKey === 'actions') {
                    return (
                      <Cell>
                        <ActionButton isQuiet>
                          <Edit />
                        </ActionButton>
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
