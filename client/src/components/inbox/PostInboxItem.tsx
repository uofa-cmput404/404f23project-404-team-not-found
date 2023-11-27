import { Button, Grid, Typography } from "@mui/material";
import { Card, CardHeader, Avatar } from "@mui/material";
import { InboxItem } from "../../interfaces/interfaces";

const PostInboxItem = ({ inboxItem }: { inboxItem: InboxItem }) => {

return (
    <Grid container alignItems="center" sx={{ borderBottom: "1px solid #dbd9d9" }}>
        <Grid item xs={6}>
            <Card
            style={{
                margin: "auto",
                width: "100%",
                border: 0,
            }}
            variant="outlined"
            >
            <CardHeader
                avatar={
                <Avatar
                    alt={inboxItem.author.displayName}
                    sx={{
                    cursor: "pointer",
                    }}
                    src={inboxItem.author.profileImage}
                />
                }
                title={`New post from ${inboxItem.author.displayName}`}
            />
            </Card>
        </Grid>
        <Grid container item xs={6} justifyContent="flex-end">
      </Grid>
    </Grid>
  );
};

export default PostInboxItem;
