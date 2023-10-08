import React from 'react';

import {
  defaultTheme,
  ActionButton,
  AlertDialog,
  Cell,
  Column,
  DialogTrigger,
  Flex,
  Heading,
  Provider,
  Row,
  SearchField,
  TableBody,
  TableHeader,
  TableView,
  Text,
  View,
} from '@adobe/react-spectrum';

import { ToastContainer, ToastQueue } from '@react-spectrum/toast';

import { AddRecipeDialog } from './dialog/AddRecipeDialog';
import { EditRecipeDialog } from './dialog/EditRecipeDialog';

import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';

import './App.css';


function App() {

  const [allowEdits, setAllowEdits] = React.useState(false);

  const columns = React.useMemo(() => {
    if (allowEdits) {
      return [
        {uuid: 'name', name: 'Name', width: '40%'},
        {uuid: 'magazine', name: 'Magazine', width: '25%'},
        {uuid: 'category', name: 'Category', width: '25%'},
        {uuid: 'edit', name: 'Edit', width: '10%', hideHeader: true}
      ];
    } else {
      return [
        {uuid: 'name', name: 'Name', width: '40%'},
        {uuid: 'magazine', name: 'Magazine', width: '30%'},
        {uuid: 'category', name: 'Category', width: '30%'},
      ];
    }
  }, [allowEdits]);
  

  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [refresh, setRefresh] = React.useState(new Date());


  const triggerRefresh = () => {
    setRefresh(new Date());
  }

  React.useEffect(() => {
    (async () => {
      // console.log("inside async")
      // const x = await window.api.ping();
      // console.log("ping?")
      // console.dir(x);

      setRows(await window.api.getAllRecipies());
    })();
  }, [refresh]);

  const magazines = React.useMemo(() => {
    return Array.from(
      new Set(rows.map((row) => row.magazine))
    ).map(magazine => ({id: magazine, name: magazine}));
  }, [rows]);

  const categories = React.useMemo(() => {
    return Array.from(
      new Set(rows.map((row) => row.category))
    ).map(category => ({id: category, name: category}));
  }, [rows]);

  const searchedRows = React.useMemo(() => {
    return rows.filter((row) => {
      if (!search) {
        return true;
      }

      const searchLower = search.toLowerCase();
      if (
        row["name"].toLowerCase().indexOf(searchLower) !== -1
        || row["magazine"].toLowerCase().indexOf(searchLower) !== -1
        || row["category"].toLowerCase().indexOf(searchLower) !== -1
      ) {
        return true;
      }

      return false;
    })
  }, [search, rows]);


  return (
    <Provider theme={defaultTheme} id="app">
      <Flex direction="row">
        <View height="100%" width="2%" />
        <ToastContainer />
        <Flex height="100vh" width="96%" direction="column" gap="size-150" aria-label="Recipies">
          <Flex direction="row" width="100%" justifyContent={"space-between"}>
            <Heading level={2} aria-label="Title">Mom's Recipies</Heading>
            <Flex alignSelf={"center"}>
              {!allowEdits && 
                <ActionButton
                  aria-label="Allow Editing"
                  onPress={ () => setAllowEdits(true)} 
                >Allow Editing</ActionButton>
              }
            </Flex>
          </Flex>
          <Flex direction="row" width="100%" justifyContent={"space-between"}>
            <Flex direction="row" gap="size-150" alignItems={"center"}>
              <SearchField
                value={search}
                onChange={setSearch}
                aria-label="Search"
              />
              <Text>{searchedRows.length} / {rows.length}</Text>
            </Flex>
            { allowEdits &&
            <DialogTrigger>
              <ActionButton aria-label="Add">Add</ActionButton>
              { (close) => AddRecipeDialog(setRefresh, close, magazines, categories) }
            </DialogTrigger>
            }
          </Flex>
          <TableView width="100%" flex>
            <TableHeader columns={columns}>
              {column => (
                <Column key={column.uuid} width={column.width} hideHeader={column.hideHeader}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={searchedRows}>
            {/* <TableBody items={[]} loadingState="loading"> */}
              {item => (
                <Row key={item.id}>
                  {columnKey => {
                    if (allowEdits && columnKey === "edit") {
                      return (
                        <Cell>
                          <DialogTrigger>
                            <ActionButton isQuiet><Edit /></ActionButton>
                            { (close) => EditRecipeDialog(item, setRefresh, close, magazines, categories) }
                          </DialogTrigger>
                          <DialogTrigger>
                            <ActionButton isQuiet><Delete /></ActionButton>
                            <AlertDialog
                              variant="confirmation"
                              title="Confirm Delete"
                              primaryActionLabel="Delete"
                              cancelLabel="Cancel"
                              onPrimaryAction={async () => {
                                await window.api.deleteRecipe(item.id)
                                  .then(() => {
                                    ToastQueue.positive("Recipe successfully deleted", {timeout: 3000})
                                  }).catch((e) => {
                                    console.error(e);
                                    ToastQueue.negative("Recipe could not be deleted", {timeout: 3000})
                                  });
                                triggerRefresh()
                              }}
                            >
                              Are you sure you want to delete the recipe '{item.name}'?
                            </AlertDialog>
                          </DialogTrigger>
                        </Cell>
                      );
                    } else {
                      return <Cell>{item[columnKey]}</Cell>
                    }
                  }}
                </Row>
              )}
            </TableBody>
          </TableView>
          <View height="5" width="100%" />
        </Flex>
        <View height="100%" width="2%" />
      </Flex>
    </Provider>
  );
}

export default App;
