import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircle, CancelRounded } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutateQuery } from "src/hooks/useMutateQuery";
import { useSnack } from "src/hooks/useSnack";
import { localUserData, queryClient } from "src/utils";
import { noteSchema } from "src/validations";
import { InputField } from "../InputField";
import { ProgressButton } from "../ProgressButton";
import SnackAlert from "../SnackAlert";

export const NoteForm = () => {
	const { snack, setSnack } = useSnack();

	const { isLoading, mutate } = useMutateQuery(
		"student/submitNote",
		"student/submitNote"
	);

	const { handleSubmit, control } = useForm({
		defaultValues: {
			title: "",
			cues: [
				{
					key: "",
					details: "",
				},
			],
			details: "",
		},
		mode: "onSubmit",
		resolver: yupResolver(noteSchema),
	});

	const onSubmit = (data) => {
		console.log(data);
		mutate(
			{
				...data,
				user_id: localUserData.userInfo.id,
			},
			{
				onSuccess: (response) => {
					console.log(response);
					setSnack((prev) => ({
						...prev,
						open: true,
						status: "success",
						title: "Success",
						message: "Note created successfully!",
					}));
					queryClient.invalidateQueries("student/notes");
				},
				onError: (error) => {
					console.log(error);
					setSnack((prev) => ({
						...prev,
						open: true,
						status: "error",
						title: "Failed",
						message: "Something went wrong! Please try again.",
					}));
				},
			}
		);
	};

	const { fields, append, remove } = useFieldArray({
		control,
		name: "cues",
	});

	return (
		<Box
			component="form"
			noValidate
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				mt: 3,
			}}>
			<Grid container spacing={2} justifyContent={"center"}>
				<Grid item xs={12}>
					<InputField id="title" label="Title" control={control} fullWidth />
				</Grid>

				<Grid item xs={12}>
					<InputField
						id="details"
						control={control}
						label="Details"
						fullWidth
						multiline
						rows={2}
					/>
				</Grid>

				{fields.map((item, index) => (
					<Grid
						key={item.id}
						width={"100%"}
						container
						spacing={2}
						marginTop={1}
						marginLeft={0}>
						<Grid item xs={3}>
							<InputField
								id={`cues[${index}].key`}
								control={control}
								fullWidth
								label="Key"
							/>
						</Grid>
						<Grid item xs={7}>
							<InputField
								id={`cues[${index}].details`}
								control={control}
								label="Details"
								fullWidth
								multiline
								rows={1}
							/>
						</Grid>
						<Grid item xs={1}>
							<IconButton
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									mt: 1,
								}}
								color="primary"
								onClick={() => {
									append({
										key: "",
										details: "",
									});
								}}>
								<AddCircle sx={{ fontSize: 25 }} />
							</IconButton>
						</Grid>
						<Grid item xs={1}>
							<IconButton
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									mt: 1,
								}}
								aria-label="delete"
								color="primary"
								disabled={fields.length === 1}
								onClick={() => {
									remove(index);
								}}>
								<CancelRounded
									sx={{
										fontSize: 25,
										color: fields.length === 1 ? "inherit" : "#ff5252",
									}}
								/>
							</IconButton>
						</Grid>
					</Grid>
				))}

				<Grid
					item
					xs={12}
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<ProgressButton loading={isLoading} text={"Create New Note"} />
				</Grid>
			</Grid>
			<SnackAlert
				open={snack.open}
				status={snack.status}
				message={snack.message}
				title={snack.title}
				exit={snack.exit}
				setSnack={setSnack}
			/>
		</Box>
	);
};