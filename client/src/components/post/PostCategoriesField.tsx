import React, { useState } from 'react';
import { TextField, Chip, Box } from "@mui/material";

const PostCategoriesField = ({
  categories,
  setCategories,
}: {
  categories: string[];
  setCategories: (categories: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddCategory = () => {
    if (inputValue && !categories.includes(inputValue)) {
      setCategories([...categories, inputValue]);
      setInputValue("");
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter(category => category !== categoryToDelete));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAddCategory();
    }
  };

return (
  <Box
    sx={{
      border: '1px solid rgba(0, 0, 0, 0.23)',
      padding: '5px',
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft:1,
      marginRight:1,
      marginBottom:1,
      alignItems: 'center',
      width: "100%",
      borderRadius: 1
    }}
  >
    {categories.map((category) => (
      <Chip
        key={category}
        label={category}
        onDelete={() => handleDeleteCategory(category)}
        size="small"
        variant={"outlined"}
        style={{ margin: 1 }}
      />
    ))}
      <TextField
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      size="small"
      variant="standard"
      style={{ flex: 1, margin: 1 }}
      InputProps={{
        disableUnderline: true,
      }}
      placeholder={categories.length < 1 ? "Add Categories": ""}
      onKeyDown={handleKeyDown}
    />

  </Box>
)};

export default PostCategoriesField;
