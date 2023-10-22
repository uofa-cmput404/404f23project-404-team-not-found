// import Button from "@mui/material/Button"
// import CssBaseline from "@mui/material/CssBaseline"
import { Typography, CssBaseline, AppBar, Toolbar, Container} from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container : {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    }
}));

const username = "John Doe";

const ProfilePage = () => {
    const classes = useStyles();

    return (
    <>
        <CssBaseline />
        <AppBar position="relative">
            <Toolbar>
                <Typography variant="h6">
                Profile Page
                </Typography>
            </Toolbar>
        </AppBar>
        <main>
            <div className={classes.container}>
                <Container maxWidth="sm">
                    <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                        Welcome back, {username}!
                    </Typography>
                </Container>
            </div>
        </main>
    </>
  )
}

export default ProfilePage