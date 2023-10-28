import React from 'react';
import { Chip } from "@mui/material";

const PostCategories = ({
  categories,
}: {
  categories: string[];
}) => {

return (
  <div>
    {categories.map((category) => (
      <Chip
        key={category}
        label={category}
        size="small"
        variant="outlined"
        style={{ margin: 1.5 }}
      />
    ))}
  </div>
)};

export default PostCategories;