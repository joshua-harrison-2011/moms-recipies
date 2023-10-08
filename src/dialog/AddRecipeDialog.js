import { EditRecipeDialog } from './EditRecipeDialog';

export function AddRecipeDialog (setRefresh, close, magazines, categories) {
  return EditRecipeDialog({}, setRefresh, close, magazines, categories);
}