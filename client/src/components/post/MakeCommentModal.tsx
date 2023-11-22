import { getAuthorId, getUserData } from "../../utils/localStorageUtils";
import React, { useCallback, useEffect, useState } from "react";

import { Modal, Box, TextField, IconButton, Grid, 
	Typography, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { Post, Comment } from "../../interfaces/interfaces";
import { getAuthorIdFromResponse } from "../../utils/responseUtils";
import PostComments from "./comment/PostComments";
import { makeStyles } from "@mui/styles";

const style = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-around",
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "35vw",
	bgcolor: "background.paper",
	boxShadow: 20,
	p: 0.5,
	borderRadius: "8px",
};

const useStyles = makeStyles((theme) => ({
  root: {
    "&::-webkit-scrollbar": {
      width: 7,
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "darkgrey",
      outline: `1px solid slategrey`,
    },
  },
}));

const APP_URI = process.env.REACT_APP_URI;
const MakeCommentModal = ({
    isCmodalOpen,
    post,
    setIsCModalOpen,
}
    : {
        isCmodalOpen: boolean;
        post: Post;
        setIsCModalOpen: (isOpen: boolean) => void;
    }) => {
    const [comment, setComment] = useState("");
    const [contentType, setContentType] = useState("text/plain");
    const handleClose = () => { setIsCModalOpen(false) };
		const authorId = getAuthorIdFromResponse(post.author.id);
		const postId = getAuthorIdFromResponse(post.id);
		const [postComments, setPostComments] = useState<Comment[]>([]);
		const userData = getUserData();
		const [value, setValue] = useState('')
		const [markdownCheckbox, setMarkdownCheckbox] = useState(false);
		const classes = useStyles();

		console.log(userData, authorId);

		const handleMarkdownContent = (event: React.ChangeEvent<HTMLInputElement>) => {
			setMarkdownCheckbox(event.target.checked);
			if (event.target.checked) setContentType("text/markdown");
			else setContentType("text/plain");
		};

		const fetchComments = useCallback(async () => {
			const url = `${APP_URI}authors/${authorId}/posts/${postId}/comments/`
	
			await axios
				.get(url)
				.then((response: any) => {
					setPostComments(response.data["comments"]);
					console.log(response.data["comments"])
				})
				.catch((error) => {
					console.error("Error fetching comments", error)
				})
		}, []);

		const handleClear = () => {
			setValue('')
		};

    const handleSubmit = async (
			comment: string,
			contentType: string,
		) => {
			const data = {
				comment: comment,
				contentType: contentType,
				author: userData
			};

			const url = `${APP_URI}authors/${authorId}/posts/${postId}/comments/`

			await axios
			.post(url, data)
			.then((response: any) => {
				fetchComments();
				handleClear();
				post.count = (post.count + 1);
				if (getAuthorId() !== authorId) {
					sendCommentToInbox(comment, contentType, response.data["id"])
				}
			})
			.catch((error) => {
				console.error("Error posting comment", error)
			})
    };

		const sendCommentToInbox = async (
			comment: string,
			contentType: string,
			id : string
		) => {

			const data = {
				type: "Comment",
				author: userData,
				id: id,
				comment: comment,
				contentType: contentType
			}

			const url = `${APP_URI}authors/${authorId}/inbox/`;

			try {
				await axios.post(url, data);
			} catch (error) {
				console.error("Failed to send comment to inbox")
			}
		};

		useEffect(() => {
			fetchComments();
		}, []);

	return (
		<Modal open={isCmodalOpen} onClose={handleClose}>
			<Box sx={style}>
				<Grid container direction="row">
					<Grid item xs={3}>
						<IconButton
							sx={{
									marginRight: "auto",
							}}
							onClick={() => {
									handleClose();
							}}
						>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Grid>
					<Grid item xs={6} textAlign="center">
                <Typography 
                  variant="h6"
                  sx={{paddingTop:0.2}}
									fontSize="18px"
                >
                  Comments
                </Typography>
            </Grid>
          <Grid item xs={3}></Grid>
				</Grid>
				<Box
				sx={{
					width: "100%",
					overflowY: "auto",
					maxHeight: "40vh",
					display: "flex",
					flexGrow: 1,
					flexDirection: "column",
					paddingX: 1,
					// borderBottom: "1px solid #dbd9d9",
				}}
				className={classes.root}
				>
					<PostComments
						comments={postComments}
					/>
				</Box>
				<Grid sx={{marginLeft: 1}}>
					<FormControlLabel
							control={
								<Checkbox
									size="medium"
									sx={{paddingRight:"0px"}}
									checked={markdownCheckbox}
									onChange={handleMarkdownContent}
								/>
							}
							label={<Typography sx={{ fontSize: "15px", color: "text.secondary"}}>Markdown</Typography>}
						/>
				</Grid>
				<TextField
					size="small"
					label="Write a comment"
					multiline
					value={value}
					sx={{marginX: 1, marginBottom: 1}}
					onChange={(e) => {
							setComment(e.target.value);
							setValue(e.target.value);
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton 
									edge="end" 
									color="primary"
									disabled={value === ''}
									onClick={() => {
										handleSubmit(comment, contentType);
									}}
							>
								<SendIcon/>
							</IconButton>
						</InputAdornment>
					),
				}}
				/>
			</Box>
		</Modal>
	)
};


export default MakeCommentModal;

