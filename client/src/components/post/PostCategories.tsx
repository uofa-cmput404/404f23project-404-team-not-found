import React from 'react';
import { Chip, Typography } from "@mui/material";

const PostCategories = ({
  categories,
}: {
  categories: string[];
}) => {
  // webwizards returns [""] even though there's no categories added on their website,
  // this is to filter it out so that there's no "empty" string category on our UI
  categories = categories.filter((category: string): boolean => category !== "");

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