import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


export default (props) => {

    const {open, handleClose, text, fn} = props
    return (
        <div>
            <Dialog
                open={open}
            >
                <DialogTitle id="alert-dialog-title">{text}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => {
                        fn()
                    }} color="primary" autoFocus>
                        예
                    </Button>
                    <Button onClick={() => handleClose()} style={{color: "#787878"}}>
                        아니오
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export function AlertText(props){
    const {open, handleClose, classes, text} = props
    return(
        <div>
            <Dialog
                BackdropProps={{
                    classes: {
                        root: classes.dialogBackDrop
                    }
                }}
                PaperProps={{
                    classes: {
                        root: classes.dialogColor
                    }
                }}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-title">{text}</DialogTitle>
            </Dialog>
        </div>
    )

}