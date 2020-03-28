import React,{ Component } from 'react';
import {
    EuiPage,
    EuiPageBody,
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiFlexItem,
    EuiFlexGroup,
    EuiPageContent,
    EuiHeaderBreadcrumbs,
    EuiButtonEmpty,
    EuiButtonToggle,
    EuiButton
} from '@elastic/eui';
import './sketchpad.css';

import Flyout from './flyout';
import { BlockMenu, DraggedBlock, FlowBlock, Arrow, TempBlock } from './blocks';

import { JourneyStore } from '../store/journeyStore';
import { inject, observer } from 'mobx-react';

type SketchProps = {
    journeyStore: JourneyStore
};

type SketchState ={
    showSettings:boolean;
    draggedBlock:any;
    blocks:Array<any>;
    arrows:Array<any>;
    blocksTemp:Array<any>;
    arrowsTemp:Array<any>;
};

@inject('journeyStore')
@observer
export default class SketchPad extends Component<SketchProps, SketchState> {

    state:SketchState ={
        showSettings: false,
        draggedBlock: null,
        blocks:[],
        arrows:[],
        blocksTemp:[],
        arrowsTemp:[]
    }
    breadcrumbs:any = [];
    tempblock2:any;
    loaded:boolean;
    blocks:Array<any>;
    blocksTemp:Array<any>;
    arrows:Array<any>;
    arrowsTemp:Array<any>;
    canvas_div:any;
    active:boolean;
    paddingx:number;
    paddingy:number;
    offsetleft:any;
    offsetleftold:number;
    rearrange:boolean;
    lastevent:boolean;
    dragx:number;
    dragy:number;
    original:any;
    drag:any;
    dragId:number;
    mouse_x:number;
    mouse_y:number;
    dragblock:boolean;
    link:boolean;
    canvasRef:any;
    flowRef:any;
    chartData:any;
    rightcard:boolean;
    tempblock:any;

    constructor(props:SketchProps){
        super(props);
        this.state ={
            showSettings:false,
            draggedBlock:null,
            blocks:[],
            arrows:[],
            blocksTemp:[],
            arrowsTemp:[]
        };
        this.breadcrumbs = [];

        this.tempblock2= undefined;
        this.loaded = false;
        this.blocks = [];
        this.blocksTemp = [];
        this.arrows =[];
        this.arrowsTemp = [];
        this.canvas_div = undefined;
        this.active = false;
        this.paddingx = 0
        this.paddingy = 0;
        this.offsetleft = 0;
        this.offsetleftold = 0;
        this.rearrange = false;
        this.lastevent = false;
        this.dragx = 0;
        this.dragy = 0;
        this.original = null;
        this.drag = undefined;
        this.dragId=-1;
        this.mouse_x = 0;
        this.mouse_y = 0;
        this.dragblock = false;
        this.link = false;

        this.canvasRef = React.createRef<HTMLDivElement>();
        this.flowRef = {};
        this.chartData = '';

        this.rightcard = false;
        this.tempblock = undefined;
    }

    componentDidMount(){
        this.flowy(this.canvasRef.current);
    }

    openConfigurator = () =>{
        this.setState({showSettings:true});
    }

    closeSettings = () => {
        this.setState({showSettings:false});
    }

    flowy(canvas:HTMLDivElement) {


        let spacing_x:number = 20;


        let spacing_y:number = 60;


        this.load(canvas, spacing_x, spacing_y);

    }

    blockGrabbed = (block:HTMLDivElement) => {
        block.classList.add("blockdisabled");
        this.tempblock2 = block;
    }

    blockReleased() {
        if(this.tempblock2)
            this.tempblock2.classList.remove("blockdisabled");
    }

    blockSnap(det:any) {

        let blocks = this.blocks.slice();

        blocks.push({
            left:det.left,
            top:det.top,
            type:det.type,
            id:det.id,
            link:{
                show:false,
                position:'bottom'
            }
        });

        blocks.forEach((block)=> {
            block.link = {
                show:false,
                position:'bottom'
            }
        });

        this.setState({
            blocks
        });

        return true;
    }

    hideConnector(){
        let blocks = this.blocks.slice();

        blocks.forEach(block=>{
            block.link = {
                link:false,
                position:'bottom'
            }
        });
        this.blocks = blocks;
    }

    import = (output:any) => {
        this.setState({
            blocks: output.blocks.slice(),
            arrows: output.arrows.slice()
        });
    }

    output = () => {
        return {
            blocks:this.blocks.slice(),
            arows: this.arrows.slice()
        }
    }

    clearSketch = () => {
        this.flowRef = {};
        this.blocks = [];
        this.arrows= [];
        this.setState({
            blocks:this.blocks.slice(),
            arrows:this.arrows.slice()
        });
    }

    deleteBlock = (id:number)=> {
        
        this.blocks = this.blocks.filter((e) => {
            return e.id !== id
        });
        
        if (id !== 0) {

            let arrowIndex = this.arrows.findIndex(a=>a.id === id);
            if (arrowIndex > -1) {
                this.arrows.splice(arrowIndex, 1);
            }
        }

        let layer = this.blocks.slice().filter(a => a.parent === id);
            
        let flag = false;
        let foundids:any = [];

        while (!flag) {
            for (let i = 0; i < layer.length; i++) {
                if (layer[i] !== id) {

                    let blockIndex = this.blocks.findIndex(b=>b.id===layer[i].id);
                    let arrIndex = this.arrows.findIndex(a=>a.id===layer[i].id);

                    this.blocks.splice(blockIndex, 1);
                    this.arrows.splice(arrIndex, 1);

                    foundids.push(layer[i].id);

                }
            }
            if (foundids.length === 0) {
                flag = true;
            } else {
                layer = this.blocks.filter(a => foundids.includes(a.parent));
                foundids = [];
            }
        }
        
        if (this.blocks.length > 1) {
            this.rearrangeMe();
        }
        if (this.lastevent) {
            this.fixOffset();
        }
        this.draw();
    }

    beginDrag = (event:any) => {
        
        if (event.targetTouches) {
            this.mouse_x = event.changedTouches[0].clientX;
            this.mouse_y = event.changedTouches[0].clientY;
        } else {
            this.mouse_x = event.clientX;
            this.mouse_y = event.clientY;
        }
        if (event.which !== 3 && event.target.closest(".create-flowy")) {
            this.original = event.target.closest(".create-flowy");
            let blockType = Number(this.original.querySelector(".blockelemtype").value);
            
            let blockId = 0;

            if (this.blocks.length === 0) {
                blockId=0;

            } else {
                blockId = (Math.max.apply(Math, this.blocks.map(a => a.id)) + 1);

            }

            this.dragId = blockId;
            this.blockGrabbed(event.target.closest(".create-flowy"));
            
            this.active = true;
            this.dragx = this.mouse_x - (event.target.closest(".create-flowy").offsetLeft);
            this.dragy = this.mouse_y - (event.target.closest(".create-flowy").offsetTop);

            let left = (this.mouse_x - this.dragx);
            let top = (this.mouse_y - this.dragy);

            this.setState({
                draggedBlock:{
                    type: blockType,
                    id: blockId,
                    left,
                    top
                }
            });
        }
    }

    touchDone = () => {
        this.dragblock = false;
    }

    endDrag = (event:any) => {

        if (event.which !== 3 && (this.active || this.rearrange)) {

            this.dragblock = false;
            this.blockReleased();

            let dBlockId = this.dragId;
            let dBlock = this.blocksTemp.filter( d => d.id === dBlockId)[0];
            let blockType = Number(this.drag.querySelector(".blockelemtype").value);
            let isParent = dBlock ? (dBlock.parent === -1) : false;

            
            if (this.active) {
                this.original.classList.remove("dragnow");
            }
            if (isParent && this.rearrange) {

                if(this.link){

                    let xpos = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

                    let ypos = (this.drag.getBoundingClientRect().top) + this.canvas_div.scrollTop;

                    let blocko = this.blocks.map(a => a.id);


                    for (let i = 0; i < this.blocks.length; i++) {

                        let curBlock:any= this.blocks.filter(a => a.id === blocko[i])[0];

                        if (

                            xpos >= (curBlock.x - (curBlock.width / 2) - this.paddingx)
                            &&
                            xpos <= (curBlock.x + (curBlock.width / 2) + this.paddingx)
                            &&
                            ypos >= (curBlock.y - (curBlock.height / 2))
                            &&
                            ypos <= (curBlock.y + curBlock.height)

                        ) {

                            this.active = false;

                            this.snap(blocko[i]);

                            break;

                        } 
                    }
                    this.link = false;
                }else{

                    this.rearrange = false;

                    let dragBlock = this.blocksTemp.slice()[0];

                    let dragLeft = ((dragBlock.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                    let dragTop = ((dragBlock.top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

                    dragBlock.x = (dragLeft) + (dragBlock.width / 2);

                    dragBlock.y = (dragTop) + (dragBlock.height / 2);

                    this.blocksTemp[0] = dragBlock;

                    for (let w = 0; w < this.blocksTemp.length; w++) {

                        if (this.blocksTemp[w].id !== this.dragId) {

                            let blockInd = this.blocksTemp.findIndex(b=>b.id === this.blocksTemp[w].id);

                            let arrInd = this.arrowsTemp.findIndex(a=>a.id === this.blocksTemp[w].id);

                            let tempBlock = this.blocksTemp.slice()[blockInd];

                            let arrBlock = this.arrowsTemp.slice()[arrInd];

                            let bloLeft = ((tempBlock.left + dragBlock.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                            let bloTop = ((tempBlock.top + dragBlock.top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

                            let arrLeft = ((arrBlock.left + dragBlock.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);
                            
                            let arrTop = ((arrBlock.top + dragBlock.top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

                            let left = ((bloLeft) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

                            let top = ((bloTop) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop);

                            tempBlock.left = left;
                            tempBlock.top = top;

                            let aLeft = ((arrLeft) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

                            let aTop = ((arrTop) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop);

                            arrBlock.left = aLeft;
                            arrBlock.top = aTop;

                            tempBlock.x = ((left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft) + (tempBlock.width / 2) + this.canvas_div.scrollLeft;

                            tempBlock.y = ((top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop) + (tempBlock.height / 2) + this.canvas_div.scrollTop;

                            this.blocksTemp[blockInd] = tempBlock;
                            this.arrowsTemp[arrInd] = arrBlock;

                        }
                    }
                    this.blocks = this.blocks.concat(this.blocksTemp);
                    this.blocksTemp = [];
                    this.arrows = this.arrows.concat(this.arrowsTemp);
                    this.arrowsTemp = [];

                }


            } else if (this.active && !this.link && (this.drag.getBoundingClientRect().top) > (this.canvas_div.getBoundingClientRect().top) && (this.drag.getBoundingClientRect().left) > (this.canvas_div.getBoundingClientRect().left)) {
                
                this.active = false;

                let top = ((this.drag.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop);

                let left = ((this.drag.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

                

                this.setState({
                    draggedBlock:null
                });

                this.blockSnap({left,top,type:blockType,id:dBlockId});

                this.blocks.push({
                    parent: -1,
                    childwidth: 0,
                    id: dBlockId,
                    x: (this.flowRef[dBlockId].getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.flowRef[dBlockId]).width) / 2) + this.canvas_div.scrollLeft,
                    y: (this.flowRef[dBlockId].getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.flowRef[dBlockId]).height) / 2) + this.canvas_div.scrollTop,
                    width: parseInt(window.getComputedStyle(this.flowRef[dBlockId]).width),
                    height: parseInt(window.getComputedStyle(this.flowRef[dBlockId]).height),
                    left,
                    top,
                    type: blockType,
                    link:{
                        show:false,
                        position:'bottom'
                    }
                });

            } else if (this.active || this.rearrange) {

                this.link =false;
                let xpos = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

                let ypos = (this.drag.getBoundingClientRect().top) + this.canvas_div.scrollTop;

                let blocko = this.blocks.map((a:any) => a.id);


                for (let i = 0; i < this.blocks.length; i++) {

                    let curBlock:any = this.blocks.filter((a:any) => a.id === blocko[i])[0];

                    if (

                        xpos >= (curBlock.x - (curBlock.width / 2) - this.paddingx)
                        &&
                        xpos <= (curBlock.x + (curBlock.width / 2) + this.paddingx)
                        &&
                        ypos >= (curBlock.y - (curBlock.height / 2))
                        &&
                        ypos <= (curBlock.y + curBlock.height)

                    ) {

                        this.active = false;

                        if (!this.rearrange) {

                            this.snap(blocko[i]);

                        } else if (this.rearrange) {

                            this.snap(blocko[i]);

                        }
                        break;

                    } else if (i === this.blocks.length - 1) {
                        console.log("DRAG-END_END");
                        if((this.drag.getBoundingClientRect().top) > (this.canvas_div.getBoundingClientRect().top) && (this.drag.getBoundingClientRect().left) > (this.canvas_div.getBoundingClientRect().left)){
                            // todo:check for removal

                        } else {
                            this.setState({
                                draggedBlock:null
                            });

                        }
                        
                        this.rearrange = false;
                        this.active = false;
                        break;

                    }
                }
            }
            this.hideConnector();
            this.draw();
        }
    }

    snap = (snap_id:number) => {

        let blockId = this.dragId;
        let blockType = Number(this.drag.querySelector(".blockelemtype").value);
        let totalwidth = 0;
        let totalremove = 0;

        for (let w = 0; w < this.blocks.filter(id => id.parent === snap_id).length; w++) {

            let children = this.blocks.filter(id => id.parent === snap_id)[w];

            if (children.childwidth > children.width) {
                totalwidth += children.childwidth + this.paddingx;
            } else {
                totalwidth += children.width + this.paddingx;
            }

        }

        totalwidth += parseInt(window.getComputedStyle(this.drag).width);

        for (let w = 0; w < this.blocks.filter(id => id.parent === snap_id).length; w++) {

            let children = this.blocks.filter(id => id.parent === snap_id)[w];

            if (children.childwidth > children.width) {

                let tInd = this.blocks.findIndex(a=>a.id === children.id);
                let tblock:any = this.blocks.slice()[tInd];              

                let left = (this.blocks.filter(a => a.id === snap_id)[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2));

                tblock.left = left;

                this.blocks[tInd] = tblock;

                children.x = this.blocks.filter(id => id.parent === snap_id)[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
                totalremove += children.childwidth + this.paddingx;

            } else {

                let tInd = this.blocks.findIndex(a=>a.id === children.id);

                let tblock:any = this.blocks.slice()[tInd];

                let left = (this.blocks.filter(a => a.id === snap_id)[0].x - (totalwidth / 2) + totalremove);

                tblock.left = left;

                this.blocks[tInd] = tblock;

                children.x = this.blocks.filter(id => id.parent === snap_id)[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
                totalremove += children.width + this.paddingx;
            }
        }

        let left = (this.blocks.filter(id => id.id === snap_id)[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

        let top = (this.blocks.filter(id => id.id === snap_id)[0].y + (this.blocks.filter(id => id.id === snap_id)[0].height / 2) + this.paddingy - (this.canvas_div.getBoundingClientRect().top));

        if (this.rearrange) {

            let dragBlock = this.blocksTemp.slice()[0];
            dragBlock.left = left;
            dragBlock.top = top;

            let dragLeft = ((left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);
            let dragTop = ((top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

            dragBlock.x = (dragLeft) + (dragBlock.width / 2) + this.canvas_div.scrollLeft;

            dragBlock.y = (dragTop) + (dragBlock.height / 2) + this.canvas_div.scrollTop;

            dragBlock.parent = snap_id;

            this.blocksTemp[0] = dragBlock;

            for (let w = 0; w < this.blocksTemp.length; w++) {

                if (this.blocksTemp[w].id !== blockId) {

                    let blockInd = this.blocksTemp.findIndex(b=>b.id === this.blocksTemp[w].id);

                    let arrInd = this.arrowsTemp.findIndex(a=>a.id === this.blocksTemp[w].id);

                    let tempBlock = this.blocksTemp.slice()[blockInd];

                    let arrBlock = this.arrowsTemp.slice()[arrInd];

                    let blockLeft = ((tempBlock.left + dragBlock.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                    let blockTop = ((tempBlock.top + dragBlock.top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

                    let arrowLeft = ((arrBlock.left + dragBlock.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                    let arrowTop = ((arrBlock.top + dragBlock.top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

                    let bleft = ((blockLeft) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

                    let btop = ((blockTop) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop);

                    tempBlock.left = bleft;
                    tempBlock.top = btop;

                    let aLeft = ((arrowLeft) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft + 20);

                    let aTop = ((arrowTop) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop);

                    arrBlock.left = aLeft;
                    arrBlock.top = aTop;
                    

                    tempBlock.x = ((bleft + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft) + (tempBlock.width / 2) + this.canvas_div.scrollLeft;
                    tempBlock.y = ((btop + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop) + (tempBlock.height / 2) + this.canvas_div.scrollTop;

                    this.blocksTemp[blockInd] = tempBlock;
                    this.arrowsTemp[arrInd] = arrBlock;
                }
            }
            this.blocks = this.blocks.concat(this.blocksTemp);
            this.blocksTemp = [];
            this.arrows = this.arrows.concat(this.arrowsTemp);
            this.arrowsTemp = [];

        } else {

            this.setState({
                draggedBlock:null
            });

            this.blockSnap({left,top,type:blockType,id:blockId});

            this.blocks.push({
                childwidth: 0,
                parent: snap_id,
                id: blockId,
                x: (this.flowRef[blockId].getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.flowRef[blockId]).width) / 2) + this.canvas_div.scrollLeft,
                y: (this.flowRef[blockId].getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.flowRef[blockId]).height) / 2) + this.canvas_div.scrollTop,
                width: parseInt(window.getComputedStyle(this.flowRef[blockId]).width),
                height: parseInt(window.getComputedStyle(this.flowRef[blockId]).height),
                left,
                top,
                type: blockType,
                link:{
                    show:false,
                    position:'bottom'
                }
            });

        }

        let arrowhelp = this.blocks.filter(a => a.id === blockId)[0];

        let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === snap_id)[0].x + 20;

        let arrowy = parseFloat(arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(id => id.parent === snap_id)[0].y + (this.blocks.filter(id => id.parent === snap_id)[0].height / 2)) + this.canvas_div.scrollTop);

        let path1="";
        let path2="";
        let aLeft=0;
        let aTop=0;

        if (arrowx < 0) {
    
            path1 = `M ${(this.blocks.filter(a => a.id === snap_id)[0].x - arrowhelp.x + 5)} 0L${(this.blocks.filter(a => a.id === snap_id)[0].x - arrowhelp.x + 5)} ${(this.paddingy / 2)}L5 ${(this.paddingy / 2)}  L5 ${arrowy}`;

            path2 = `M0 ${(arrowy - 5)} H10L5 ${arrowy}L0 ${(arrowy - 5)} Z`;

            aLeft = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

        } else {

            path1 = `M20 0L20 ${(this.paddingy / 2)}L${(arrowx)} ${(this.paddingy / 2)}L${arrowx} ${arrowy}`;

            path2 = `M${(arrowx - 5)} ${(arrowy - 5)}H${(arrowx + 5)}L${arrowx} ${arrowy}L${(arrowx - 5)} ${(arrowy - 5)} Z`;

            aLeft = (this.blocks.filter(a => a.id === snap_id)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

        }

        aTop = (this.blocks.filter(a => a.id === snap_id)[0].y + (this.blocks.filter(a => a.id === snap_id)[0].height / 2));

        this.arrows.push({
            id:blockId,
            path1,
            path2,
            left: aLeft,
            top: aTop
        });

        if (this.blocks.filter(a => a.id === snap_id)[0].parent !== -1) {
            let flag = false;
            let idval = snap_id;
            while (!flag) {
                if (this.blocks.filter(a => a.id === idval)[0].parent === -1) {
                    flag = true;
                } else {
                    let zwidth = 0;
                    for (let w = 0; w < this.blocks.filter(id => id.parent === idval).length; w++) {
                        let children = this.blocks.filter(id => id.parent === idval)[w];
                        if (children.childwidth > children.width) {
                            if (w === this.blocks.filter(id => id.parent === idval).length - 1) {
                                zwidth += children.childwidth;
                            } else {
                                zwidth += children.childwidth + this.paddingx;
                            }
                        } else {
                            if (w === this.blocks.filter(id => id.parent === idval).length - 1) {
                                zwidth += children.width;
                            } else {
                                zwidth += children.width + this.paddingx;
                            }
                        }
                    }
                    this.blocks.filter(a => a.id === idval)[0].childwidth = zwidth;
                    idval = this.blocks.filter(a => a.id === idval)[0].parent;
                }
            }
            this.blocks.filter(id => id.id === idval)[0].childwidth = totalwidth;
        }
        if (this.rearrange) {
            this.rearrange = false;
        }
        this.rearrangeMe();
        this.checkOffset();

    }

    rearrangeMe = () => {
        let result = this.blocks.map(a => a.parent);
        for (let z = 0; z < result.length; z++) {
            if (result[z] === -1) {
                if(z+1 < result.length){
                    z++;
                } else {
                    break;
                }

            }
            let totalwidth = 0;
            let totalremove = 0;
            for (let w = 0; w < this.blocks.filter(id => id.parent === result[z]).length; w++) {
                let children = this.blocks.filter(id => id.parent === result[z])[w];
                if (this.blocks.filter(id => id.parent === children.id).length === 0) {
                    children.childwidth = 0;
                }
                if (children.childwidth > children.width) {
                    if (w === this.blocks.filter(id => id.parent === result[z]).length - 1) {
                        totalwidth += children.childwidth;
                    } else {
                        totalwidth += children.childwidth + this.paddingx;
                    }
                } else {
                    if (w === this.blocks.filter(id => id.parent === result[z]).length - 1) {
                        totalwidth += children.width;
                    } else {
                        totalwidth += children.width + this.paddingx;
                    }
                }
            }
            if (result[z] !== -1) {

                this.blocks.filter(a => a.id === result[z])[0].childwidth = totalwidth;
            }
            for (let w = 0; w < this.blocks.filter(id => id.parent === result[z]).length; w++) {

                let children = this.blocks.filter(id => id.parent === result[z])[w];
                let r_index = this.blocks.findIndex(a => a.id === children.id);
                const r_block:any = this.blocks.slice()[r_index];

                const r_array:any = this.blocks.slice().filter(id => id.id === result[z]);
                if(!r_array.length){
                    break;
                }

                let r_left = 0;

                if (children.childwidth > children.width) {

                    r_left = (r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) - (this.canvas_div.getBoundingClientRect().left));

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);

                    totalremove += children.childwidth + this.paddingx;

                } else {

                    r_left = (r_array[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left));

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.width / 2);

                    totalremove += children.width + this.paddingx;

                }

                r_block.left = r_left;

                this.blocks[r_index]= r_block;

                let arrowhelp = this.blocks.filter(a => a.id === children.id)[0];

                let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === children.parent)[0].x + 20;

                let arrowy = arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(a => a.id === children.parent)[0].y + (this.blocks.filter(a => a.id === children.parent)[0].height / 2));

                let aIndex = this.arrows.findIndex(a => a.id === children.id);

                let top = (this.blocks.filter(id => id.id === children.parent)[0].y + (this.blocks.filter(id => id.id === children.parent)[0].height / 2) - (this.canvas_div.getBoundingClientRect().top));

                let left=0;
                let path1="";
                let path2="";

                if (arrowx < 0) {
    
                    left = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left));

                    path1 = `M${(this.blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5)}  0L${(this.blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5)} ${(this.paddingy / 2)}L5 ${(this.paddingy / 2)}L5 ${arrowy}`;

                    path2 = `M0 ${(arrowy - 5)}H10L5 ${arrowy}L0 ${(arrowy - 5)}Z`;

                } else {

                    left = (this.blocks.filter(id => id.id === children.parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left));

                    path1 = `M20 0L20 ${(this.paddingy / 2)}L${(arrowx)} ${(this.paddingy / 2)}L${arrowx} ${arrowy}`;

                    path2 = `M${(arrowx - 5)} ${(arrowy - 5)}H${(arrowx + 5)}L${arrowx} ${arrowy}L${(arrowx - 5)} ${(arrowy - 5)}Z`;

                }

                this.arrows[aIndex] = {
                    id:children.id,
                    path1,
                    path2,
                    left,
                    top
                };
            }
        }
    }

    checkOffset = () => {

        this.offsetleft = this.blocks.map(a => a.x);
        let widths = this.blocks.map(a => a.width);
        let mathmin = this.offsetleft.map((item:any, index:any) => {
            return item - (widths[index] / 2);
        })
        this.offsetleft = Math.min.apply(Math, mathmin);
        if (this.offsetleft < (this.canvas_div.getBoundingClientRect().left)) {
            this.lastevent = true;
            let blocko = this.blocks.map(a => a.id);
            for (let w = 0; w < this.blocks.length; w++) {

                let oInd = this.blocks.findIndex(a => a.id === blocko[w]);
                let oBlock:any = this.blocks.slice()[oInd];

                let left = (this.blocks.filter(a => a.id === blocko[w])[0].x - (this.blocks.filter(a => a.id === blocko[w])[0].width / 2) - this.offsetleft + 20);

                oBlock.left = left;

                this.blocks[oInd] = oBlock;

                if (this.blocks.filter(a => a.id === blocko[w])[0].parent !== -1) {

                    let arrowhelp = this.blocks.filter(a => a.id === blocko[w])[0];
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x;

                    let aIndex = this.arrows.findIndex(a=>a.id===blocko[w]);
                    let left = 0;

                    if (arrowx < 0) {

                        left = (arrowhelp.x - this.offsetleft + 20 - 5);

                    } else {

                        left = (this.blocks.filter(id => id.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x - 20 - this.offsetleft + 20);

                    }
                    
                    this.arrows[aIndex] = {
                        id:blocko[w],
                        path1:this.arrows[aIndex].path1,
                        path2:this.arrows[aIndex].path2,
                        left,
                        top:this.arrows[aIndex].top
                    };

                }
            }

            for (let w = 0; w < this.blocks.length; w++) {

                
                let tBlock = this.blocks.slice()[w];

                let tLeft = ((tBlock.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                tBlock.x = (tLeft) + (this.canvas_div.getBoundingClientRect().left + this.canvas_div.scrollLeft) - (tBlock.width / 2) - 40;

            }

            this.offsetleftold = this.offsetleft;
        }
    }

    touchblock = (event:any) => {

        this.dragblock = false;
        if (this.hasParentClass(event.target, "block")) {    
            let selectedBlock = event.target.closest(".block");
            let blockId = selectedBlock.querySelector(".blockid").value;
            if (event.targetTouches) {
                this.mouse_x = event.targetTouches[0].clientX;
                this.mouse_y = event.targetTouches[0].clientY;
            } else {
                this.mouse_x = event.clientX;
                this.mouse_y = event.clientY;
            }
            if (event.type !== "mouseup" && this.hasParentClass(event.target, "block")) {
                if (event.which !== 3) {
                    if (!this.active && !this.rearrange) {
                        this.dragblock = true;
                        this.dragId = Number(blockId);
                        this.drag = this.flowRef[blockId];
                        this.dragx = this.mouse_x - (this.drag.getBoundingClientRect().left);
                        this.dragy = this.mouse_y - (this.drag.getBoundingClientRect().top);
                    }
                }
            }
        }
    }

    hasParentClass:any = (element:any, classname:string) => {
        if (element.className) {
            if (element.className.split && element.className.split(' ').indexOf(classname)>=0) return true;
        }
        return element.parentNode && this.hasParentClass(element.parentNode, classname);
    }

    moveBlock = (event:any) => {

        if (event.targetTouches) {
            this.mouse_x = event.targetTouches[0].clientX;
            this.mouse_y = event.targetTouches[0].clientY;
        } else {
            this.mouse_x = event.clientX;
            this.mouse_y = event.clientY;
        }

        let left = (this.mouse_x - this.dragx);
        let top = (this.mouse_y - this.dragy);

        if (this.dragblock) {
            
            this.rearrange = true;
            this.drag.classList.add("dragging");
            let blockid = this.dragId;
            this.blocksTemp.push(this.blocks.slice().filter(a => a.id === blockid)[0]);
            this.blocksTemp[0].parent = -1;

            let dragLeft = ((this.blocksTemp[0].left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);
            let dragTop = ((this.blocksTemp[0].top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

            this.blocks = this.blocks.filter((e) => {
                return e.id !== blockid
            });

            if (blockid !== 0) {

                let arrowIndex = this.arrows.findIndex(a=>a.id === blockid);
                if (arrowIndex > -1) {
                    this.arrows.splice(arrowIndex, 1);
                }
            }

            let layer = this.blocks.slice().filter(a => a.parent === blockid);
            
            let flag = false;
            let foundids:any = [];

            while (!flag) {
                for (let i = 0; i < layer.length; i++) {
                    if (layer[i] !== blockid) {

                        let dragBlock = this.blocks.slice().filter(a => a.id === layer[i].id)[0];

                        let dragArrow = this.arrows.slice().filter(r => r.id === layer[i].id)[0];   
                        
                

                        let blockLeft = ((dragBlock.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                        let blockTop = ((dragBlock.top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);
                        
                        let arrowLeft = ((dragArrow.left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                        let arrowTop = ((dragArrow.top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);
                        
                        let left = (blockLeft - dragLeft);

                        let top = (blockTop - dragTop);

                        let aLeft = (arrowLeft - dragLeft);

                        let aTop = (arrowTop - dragTop);

                        dragBlock.left = left;
                        dragBlock.top = top;
                        
                        dragArrow.left = aLeft;
                        dragArrow.top = aTop;
                        
                        this.blocksTemp.push(dragBlock);
                        this.arrowsTemp.push({...dragArrow});

                        let blockIndex = this.blocks.findIndex(b=>b.id===dragBlock.id);
                        let arrIndex = this.arrows.findIndex(a=>a.id===dragArrow.id);

                        this.blocks.splice(blockIndex, 1);
                        this.arrows.splice(arrIndex, 1);

                        foundids.push(layer[i].id);

                        dragArrow = null;
                        dragBlock = null;
                    }
                }
                if (foundids.length === 0) {
                    flag = true;
                } else {
                    layer = this.blocks.filter(a => foundids.includes(a.parent));
                    foundids = [];
                }
            }
            
            if (this.blocks.length > 1) {
                this.rearrangeMe();
            }
            if (this.lastevent) {
                this.fixOffset();
            }
            this.dragblock = false;
        }

        

        if (this.active) {
            const drag = this.state.draggedBlock;

            drag.left = left;
            drag.top = top;

            this.setState({
                draggedBlock:drag
            });

        } else if (this.rearrange) {
            
            let tBlock = this.blocksTemp.slice()[0];

            let left = (this.mouse_x - this.dragx - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft);

            let top = (this.mouse_y - this.dragy - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop);

            tBlock.left = left;
            tBlock.top = top;

            let bLeft = ((left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

            let bTop = ((top + this.canvas_div.getBoundingClientRect().top) - this.canvas_div.scrollTop);

            tBlock.x = (bLeft) + (tBlock.width / 2) + this.canvas_div.scrollLeft;

            tBlock.y = (bTop) + (tBlock.height / 2) + this.canvas_div.scrollTop; // reminder:left replaced by top

            this.blocksTemp[0] = tBlock; 

        }
        if (this.active || this.rearrange) {

            let xpos = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

            let ypos = (this.drag.getBoundingClientRect().top) + this.canvas_div.scrollTop;

            let blocko = this.blocks.map(a => a.id);

            for (let i = 0; i < this.blocks.length; i++) {

                let curBlock:any = this.blocks.filter((a:any)=> a.id === blocko[i])[0];

                if (
                    (xpos >= (curBlock.x - (curBlock.width / 2) - this.paddingx))
                    &&
                    (xpos <= (curBlock.x + (curBlock.width / 2) + this.paddingx))
                    &&
                    (ypos >= (curBlock.y - (curBlock.height / 2)))
                    &&
                    (ypos <= (curBlock.y + curBlock.height))
                ) {
                    
                    this.link = true;

                    let blockIndex = this.blocks.findIndex(a=>a.id===blocko[i]);

                    let glowBlock = this.blocks.slice()[blockIndex];

                    glowBlock.link = {
                        show:true,
                        position:'bottom'
                    };

                    this.blocks[blockIndex] = glowBlock;

                    break;

                } else {
                    this.link = false;
                    let blockIndex = this.blocks.findIndex(a=>a.id===blocko[i]);

                    let glowBlock = this.blocks.slice()[blockIndex];

                    glowBlock.link = {
                        show:false,
                        position:'bottom'
                    };

                    this.blocks[blockIndex] = glowBlock;

                }

                
            }
        }
        this.draw();
    }

    fixOffset = () => {
        
        if (this.offsetleftold < (this.canvas_div.getBoundingClientRect().left)) {

            this.lastevent = false;
            let blocko = this.blocks.map(a => a.id);
            for (let w = 0; w < this.blocks.length; w++) {

                let offInd = this.blocks.findIndex(a => a.id === blocko[w]);
                let offBlock:any = this.blocks.slice()[offInd];

                let left = (offBlock.x - (offBlock.width / 2) - this.offsetleftold - 20);

                offBlock.left = left;

                let blockLeft = ((left + this.canvas_div.getBoundingClientRect().left) - this.canvas_div.scrollLeft);

                offBlock.x = (blockLeft) + (offBlock.width / 2);

                if (offBlock.parent !== -1) {

                    let arrowhelp = offBlock;
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === offBlock.parent)[0].x;

                    let aIndex = this.arrows.findIndex(a=>a.id===blocko[w]);
                    let aleft = 0;

                    if (arrowx < 0) {

                        aleft = (arrowhelp.x - 5 - (this.canvas_div.getBoundingClientRect().left));

                    } else {
                       
                        aleft = (this.blocks.filter(id => id.id === offBlock.parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left));

                    }

                    let aArrow = this.arrows.slice()[aIndex];

                    aArrow.left = aleft;

                    this.arrows[aIndex] = aArrow;

                }

                this.blocks[offInd] = offBlock;
            }
            this.offsetleftold = 0;
        }
    }

    load (canvas:HTMLDivElement, spacing_x:number, spacing_y:number) {

        const{ editMode } = this.props.journeyStore;

        if (!this.loaded)
            this.loaded = true;
        else
            return;
        this.canvas_div = canvas;
        this.paddingx = spacing_x;
        this.paddingy = spacing_y;

        if(editMode) {
            this.startEdit();
        }

    }

    startEdit = () => {

        const{ editMode, setEditMode } = this.props.journeyStore;

        if(!editMode) {

            setEditMode(true);

            document.addEventListener("mousedown",this.touchblock, false);
            document.addEventListener("touchstart",this.touchblock, false);
            document.addEventListener("mouseup", this.touchblock, false);

            document.addEventListener('mousedown',this.beginDrag);
            document.addEventListener('touchstart',this.beginDrag);

            document.addEventListener("mouseup", this.endDrag, false);
            document.addEventListener("touchend", this.endDrag, false);

            document.addEventListener("mousemove", this.moveBlock, false);
            document.addEventListener("touchmove", this.moveBlock, false);

        }

    }

    exportData= () => {
        this.chartData = JSON.stringify(this.output());
        localStorage.setItem("journey_1",this.chartData);
        this.clearSketch();
    }

    importData = () => {

        this.chartData = localStorage.getItem("journey_1");
        if(this.chartData){
            this.import(JSON.parse(this.chartData));
        }

    }

    setDragRef = (drag:any) => {
        this.drag = drag;
    }

    setFlowRef = (id:number,flow:any) => {
        this.flowRef[id] = flow;
        
    }

    setTempRef = (temp:any) => {

        this.drag = temp[this.dragId];

    }

    draw(){
        this.setState({
            blocks:this.blocks.slice(),
            arrows: this.arrows.slice(),
            blocksTemp: this.blocksTemp.slice(),
            arrowsTemp: this.arrowsTemp.slice()
        });
    } 

    render() {
        const { draggedBlock, showSettings, blocks, arrows, blocksTemp, arrowsTemp } = this.state;
        const { editMode } = this.props.journeyStore;
        const showBlock = blocks.length > 0 ? true: false;
        return(
            <EuiPage className="full-height">
                <EuiPageBody>
                    <EuiHeader>
                        <EuiHeaderSection grow={false} >
                            <EuiHeaderSectionItem border="none">
                                <EuiButtonEmpty
                                    iconType="arrowLeft"
                                >
                                    Back
                                </EuiButtonEmpty >
                            </EuiHeaderSectionItem>
                        </EuiHeaderSection>
                        <EuiHeaderBreadcrumbs breadcrumbs={this.breadcrumbs} />
                        <EuiHeaderSection side="right" className="content-center">

                            <EuiButtonToggle
                                label="Edit"
                                fill={editMode}
                                onChange={this.startEdit}
                                isSelected={editMode}
                                size="s"

                            />

                            <EuiButton
                                fill
                                onClick={this.exportData}
                                size="s"
                                color="secondary"
                                style={{marginLeft:10}}
                            >
                                Save
                            </EuiButton>

                            <EuiButton
                                fill
                                onClick={this.clearSketch}
                                size="s"
                                color="danger"
                                style={{ marginLeft: 10, marginRight: 10 }}
                            >
                                Clear
                            </EuiButton>

                        </EuiHeaderSection>
                    </EuiHeader>
                    <EuiFlexGroup gutterSize="none">
                        <EuiFlexItem grow={false}>

                            {editMode ? <BlockMenu></BlockMenu> : null}

                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiPageContent paddingSize="none" >
                                {showSettings? <Flyout closeSettings={this.closeSettings} /> : null}
                                <div className={`canvas ${(editMode ? 'edit-bg' : 'view-bg')}`} ref={this.canvasRef}>
                                    {
                                        showBlock? (
                                            blocks.map((block, index) => <FlowBlock type={block.type} id={block.id} left={block.left} top={block.top} link={block.link} key={`.${index}`} setFlowRef={this.setFlowRef} openConfigurator={this.openConfigurator} deleteBlock={this.deleteBlock}></FlowBlock>)
                                        ) : null 
                                    }

                                    {
                                        arrows.length ? (
                                            arrows.map((arrow,index) => <Arrow id={arrow.id} path1={arrow.path1} path2={arrow.path2} left={arrow.left} top={arrow.top} key={`_${index}`}></Arrow>)
                                        ) : null
                                    }
                                    {
                                        blocksTemp.length ? (
                                            <TempBlock left={blocksTemp[0].left} top={blocksTemp[0].top} type={blocksTemp[0].type} id={blocksTemp[0].id} blocksTemp={blocksTemp.slice(1)} arrowsTemp={arrowsTemp} setTempRef = {this.setTempRef} ></TempBlock>
                                        ) : null
                                    }
                                </div>
                            </EuiPageContent>
                        </EuiFlexItem>
                        {draggedBlock ? <DraggedBlock type={draggedBlock.type} id={draggedBlock.id} left={draggedBlock.left} top={draggedBlock.top} setDragRef={this.setDragRef}></DraggedBlock> : null}
                    </EuiFlexGroup>
                </EuiPageBody>
            </EuiPage>
        )
    }
}
