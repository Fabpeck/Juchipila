import React from 'react';
import { observable, action } from 'mobx';

import './Dialog.css';
import { observer } from 'mobx-react';
import { Icon, IconSources } from '../Icon';

export interface DialogProps {
    key: string;
    title?: string;
    onClose?: () => void;
    content?: React.ReactElement;
    className?: string;
}

interface DialogCmpProps extends DialogProps {
    controller: DialogController;
}

@observer
class DialogCmp extends React.Component<DialogCmpProps> {
    render() {
        return this.props.controller.open ? <div className={"dialog " + this.props.className}
            style={{ left: this.props.controller.left + "px", top: this.props.controller.top + "px" }}
            ref={(ref) => this.props.controller.dialogDiv = ref || undefined}>
            <div className="dialog-header" draggable onDragStart={(event) => this.props.controller.onDragStart(event)}
                onDragEnd={(event) => this.props.controller.onDragEnd(event)}>
                <div>
                    {this.props.title}
                </div>
                <Icon source={IconSources.FONTAWESOME} name="times" onClick={action(() => {
                    this.props.onClose && this.props.onClose();
                    this.props.controller.open = false;
                })}/>
            </div>
            <div className="dialog-content">
                {this.props.content}
            </div>
        </div> : null;
    }
}

class DialogController {
    @observable open: boolean = true;
    @observable top: number | undefined;
    @observable left: number | undefined;
    dialogDiv: HTMLDivElement | undefined;

    initialY: number = 0;
    initialX: number = 0;

    onDragStart(event: React.DragEvent<HTMLDivElement>) {
        this.initialX = event.pageX;
        this.initialY = event.pageY;
    }

    @action
    onDragEnd(event: React.DragEvent<HTMLDivElement>) {
        if (this.dialogDiv) {
            this.left = (this.dialogDiv.offsetLeft || 0) + event.pageX - this.initialX;
            this.top = (this.dialogDiv.offsetTop || 0) + event.pageY - this.initialY;
        }
    }
}

function Dialog(props: DialogProps) {
    return <DialogCmp {...props} controller={new DialogController()} />
}

export default Dialog;