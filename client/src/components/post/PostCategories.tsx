import React from 'react';
import { Chip, Typography } from "@mui/material";

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
        label={
          <Typography sx={{fontSize: "15px", color: "text.secondary"}}>
            {category}
          </Typography>
        }
        size="small"
        variant="filled"
        style={{ margin: 1.5 }}
      />
    ))}
  </div>
)};

export default PostCategories;