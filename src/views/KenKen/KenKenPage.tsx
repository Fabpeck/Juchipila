import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { DialogManager } from '../../components/dialog/AppOverlay';
import { Icon, IconSources } from '../../components/Icon';
import { TextInput } from '../../components/inputs/TextInput';

@observer
export class KenKenPage extends React.Component<{mx: KenKenMachine}> {
    static displayDialog() {
        let mx = new KenKenMachine(9);
        DialogManager.getManager().openDialog({title: "Ken Ken", className: "converter-dlg", content: <KenKenPage mx={mx}/>, key: "kenken"})
    }
    public textInput: TextInput | null = null;

    render() {        
        return <div tabIndex={0} onKeyDown={(event) => {
            if (event.ctrlKey) {
                return;
            }
            if (event.key === "Enter") {
                this.props.mx.selected.length > 0 && this.props.mx.makeCage();
                return;
            }
            this.textInput && this.textInput.focus()
        }} 
            style={{outline: "none"}}>
            <Icon source={IconSources.FONTAWESOME} name="trash" onClick={() => this.props.mx.deletecage()} style={{color: !this.props.mx.cageSelected ? "gray" : "black", 
            pointerEvents: !this.props.mx.cageSelected ? "none" : "auto"}}/>
            <Icon source={IconSources.FONTAWESOME} name="plus" onClick={() => this.props.mx.makeCage()} style={{color: this.props.mx.selected.length === 0 ? "gray" : "black", 
            pointerEvents: this.props.mx.selected.length === 0 ? "none" : "auto"}}/>
            <TextInput ref={(ref) => {
                this.textInput = ref;
            }} value={this.props.mx.calc} onChange={action((newVal: string) => this.props.mx.calc = newVal)}/>
            <div className="grid-container" style={{display: "flex", flexDirection: "column"}}>
                {this.props.mx.cageMembershipGrid.map((row: number[], rowIndex: number) => {
                    return <div style={{display: "flex", pointerEvents: "none"}}> {row.map((cellcage: number, columnIndex: number) => {
                        let info = cellcage ? this.props.mx.cages.get(cellcage) && this.props.mx.getcageBorder(cellcage, {x: rowIndex, y: columnIndex}) : null;
                        return <div className={"grid-cell " + (cellcage ? "disabled" : "enabled")} 
                        style={{backgroundColor: this.props.mx.isCellSelected(rowIndex, columnIndex) || (cellcage && this.props.mx.cageSelected === cellcage) ? "lightblue" : "white", 
                        borderColor: this.props.mx.isCellSelected(rowIndex, columnIndex) ? "dodgerblue" : (cellcage && this.props.mx.cageSelected === cellcage) ? 
                        (info && info.top ? "dodgerblue " : "black ") + (info && info.right ? "dodgerblue " : "black ") + (info && info.bottom ? "dodgerblue " : "black ") +(info && info.left ? "dodgerblue " : "black ") : "black",
                        borderWidth: (info && info.top ? "3px " : "1px ") + (info && info.right ? "3px " : "1px ") + (info && info.bottom ? "3px " : "1px ") +(info && info.left ? "3px " : "1px "),
                        borderStyle: "solid",
                        height: 50 - (info ? (info.top + info.bottom) * 2 : 0), width: 50 - (info ? (info.right + info.left) * 2 : 0), pointerEvents: "all"}}
                        onClick={action((event: React.MouseEvent) => {
                            !cellcage && this.props.mx.selectCell(event, {x: rowIndex, y: columnIndex});
                            this.props.mx.cageSelected = cellcage;
                            cellcage && this.props.mx.clearCellSelection();
                        })}>{info && info.calc && this.props.mx.cages.get(cellcage)!.calc}</div>})}
                        </div>
                    })
                }
             </div></div>;
    }
}

export class KenKenMachine {
    @observable public cageMembershipGrid: number[][];
    @observable public selected: {x:number, y:number}[] = [];
    @observable cageSelected: number = 0;
    @observable calc: string = "";
    cages: Map<number, {coords: {x:number, y:number}[], calc?: string}> = new Map();
    cageIndex = 1;

    constructor(dimension: number) {
        let dataArray = [];
        for (var i: number = 0; i < dimension; i++) {
            dataArray.push(new Array<number>(dimension));
        }
        this.cageMembershipGrid = dataArray;
    }

    isCellSelected(x: number, y: number): boolean {
        return this.selected.some((item) => item.x === x && item.y ===y);
    }
    
    @action
    makeCage(): void {
        this.selected.forEach(action((coord: {x:number, y: number}) => {
            this.cageMembershipGrid[coord.x][coord.y] = this.cageIndex;
        }));
        this.cages.set(this.cageIndex, {coords: this.selected.slice(), calc: this.calc});
        this.cageIndex++;
        this.selected = [];
        this.calc = "";
    }

    deletecage(): void {
        let cage = this.cages.get(this.cageSelected);
        cage && cage.coords.forEach(action((coord: {x:number, y: number}) => {
            this.cageMembershipGrid[coord.x][coord.y] = 0;
        }));
        this.cages.delete(this.cageSelected);
    }

    @action
    selectCell(event: React.MouseEvent, coord: {x: number, y:number}): void {
        if (event.ctrlKey) {
            this.selected.push(coord);
        } else {
            this.selected = [coord];
        }
        this.cageSelected = 0;
    }

    @action
    clearCellSelection(): void {
        this.selected = [];
    }

    getcageBorder(cageId: number, cell: {x: number, y: number}): any {
        let top: boolean = false;
        let bottom: boolean = false;
        let left: boolean = false;
        let right: boolean = false;
        let calc: boolean = false;
        const members = this.cages.get(cageId);;
        if (members) {
            top = !members.coords.some((item) => item.x < cell.x && item.y === cell.y);
            bottom = !members.coords.some((item) => item.x > cell.x && item.y === cell.y);
            left = !members.coords.some((item) => item.y < cell.y && item.x === cell.x);
            right = !members.coords.some((item) => item.y > cell.y && item.x === cell.x);
            calc = top && left && !members.coords.some((item) => item.x < cell.x);
        }
        return {calc: calc, top: top, bottom: bottom, left: left, right: right}
    }
}