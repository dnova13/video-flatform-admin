import React, {Component} from "react";
import UploadService from "../utils/upload-files.service";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import Button from "@material-ui/core/Button";

export default class UploadFiles extends Component {

    constructor(props) {

        super(props);

        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            isError: false,
            fileInfos: [],
        };
    }

    componentDidMount() {
        UploadService.getFiles().then((response) => {
            this.setState({
                fileInfos: response.data,
            });
        });
    }

    selectFile(event) {
        this.setState({
            selectedFiles: event.target.files,
        });
    }

    upload() {
        let currentFile = this.state.selectedFiles[0];

        this.setState({
            progress: 0,
            currentFile: currentFile,
        });

        UploadService.upload(currentFile, (event) => {
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            });
        })
            .then((response) => {
                this.setState({
                    result: response
                    // isError: false
                });
                return UploadService.getFiles();
            })
            .then((files) => {
                this.setState({
                    fileInfos: files.data,
                });
            })
            .catch(() => {
                this.setState({
                    progress: 0,
                    message: "Could not upload the file!",
                    currentFile: undefined,
                    isError: true
                });
            });

        setState({
            selectedFiles: undefined,
        });
    }


    render(props) {

        const {classes, history, match} = props
        const [state, setState] = React.useState({});

        const {
            selectedFiles,
            currentFile,
            progress,
            message,
            fileInfos,
            isError
        } = this.state;

        return (
            <Grid container className={clsx(classes.paper, classes.marginTop10)}>
                <Grid item xs={2}> </Grid>
                <Grid item xs={8}>
                    <TextField disabled
                               className={classes.margin}
                               name="name"
                               variant="outlined"
                               id="mui-theme-provider-outlined-input"
                               style={{
                                   backgroundColor:"white",
                                   marginBottom : "20px"
                               }}
                               value={
                                   selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : state['name'] ? state['name'] : ''
                               }
                               fullWidth
                    />
                </Grid>
                <Grid item xs={8}>
                    <label htmlFor="btn-upload">
                        <input
                            id="btn-upload"
                            name="btn-upload"
                            style={{ display: 'none' }}
                            type="file"
                        />
                        <Button
                            className="btn-choose"
                            variant="contained"
                            color="primary"
                            style={{marginRight: '10px' }}
                            component="span" >
                            파일 선택
                        </Button>
                        <span>※ PDF 파일만 업로드 가능합니다.</span>
                    </label>
                </Grid>
            </Grid>
        );
    }
}