// import Button from "@mui/material/Button"
// import CssBaseline from "@mui/material/CssBaseline"
import { Typography, CssBaseline, AppBar, Toolbar, Container, Card, Grid, CardMedia, CardContent, CardActions, Button} from "@mui/material"
import { makeStyles } from "@mui/styles";

const username = "John Doe";
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const useStyles = makeStyles((theme) => ({
    container : {
        backgroundColor: "#FAF8F1",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        display: 'flex',
        flexDirection: 'column',
        // borderRadius: 10,
        // width: '50%',
        // margin: theme.spacing(4, 55, 6)
    }, 
    picture :{
        width: '30%',
        height: '30%',
        borderRadius: '50%',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
        marginBottom: '20px' 
    }, 
    cardGrid: {
        paddingTop: "2rem",
        paddingBottom: "2rem",
      },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
}));

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
                    <img src={require("../assets/defaultprofile.jpg")} alt="profile-pic" className={classes.picture}/>
                    <Typography variant="h4" align="center" color="black" >
                        {username}
                    </Typography>
                </Container>
            </div>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    {cards.map((card) => (
                        <Grid item>
                        <Card className={classes.card}>
                            <CardMedia>

                            </CardMedia>
                            <CardContent>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">View</Button>
                                <Button size="small" color="primary">Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            </Container>
        </main>
    </>
  )
}

export default ProfilePage