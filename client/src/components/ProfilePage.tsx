// import Button from "@mui/material/Button"
// import CssBaseline from "@mui/material/CssBaseline"
import { Typography, CssBaseline, AppBar, Toolbar, Container, Card, Grid, CardMedia, CardContent, CardActions, Button} from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";

const username = "John Doe";
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const useStyles = makeStyles((theme) => ({
    container : {
        backgroundColor: "#FAF8F1",
        padding: theme.spacing(3, 2, 2),
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
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
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
                    <img src={require("./defaultprofile.jpg")} alt="profile-pic" className={classes.picture}/>
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
                                <Typography variant="h5">What is Lorem Ipsum?</Typography>
                                <Typography>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">View</Button>
                                <Button size="small" color="primary">Edit</Button>
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