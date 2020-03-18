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
import {BlockMenu, DraggedBlock, FlowBlock, Arrow, TempBlock } from './blocks';

type SketchProps = {
    editMode:boolean
};

type SketchState ={
    showSettings:boolean;
    editMode: boolean;
    draggedBlock:any;
    blocks:Array<any>;
    arrows:Array<any>;
    blocksTemp:Array<any>;
    arrowsTemp:Array<any>;
};

export default class SketchPad extends Component<SketchProps, SketchState> {

    state:SketchState ={
        showSettings: false,
        editMode: this.props.editMode,
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
    mouse_x:number;
    mouse_y:number;
    dragblock:boolean;
    link:boolean;
    canvasRef:any;
    flowRef:any;
    arrowRef:any;
    chartData:any;
    rightcard:boolean;
    tempblock:any;
    editMode:boolean;

    constructor(props:SketchProps){
        super(props);
        this.state ={
            showSettings:false,
            editMode: this.props.editMode,
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
        this.mouse_x = 0;
        this.mouse_y = 0;
        this.dragblock = false;
        this.link = false;

        this.canvasRef = React.createRef<HTMLDivElement>();
        this.flowRef = {};
        this.arrowRef = {};
        this.chartData = '';

        this.rightcard = false;
        this.tempblock = undefined;
        this.editMode = this.props.editMode;
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
            style:det.style,
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

    import = (output:any) => {
        this.canvas_div.innerHTML = JSON.parse(output.html);
        this.blocks = output.blockarr;
    }

    output = () => {
        let html_ser:string = JSON.stringify(this.canvas_div.innerHTML);
        let json_data:any = {html:html_ser, blockarr:this.blocks, blocks:[]};
        if (this.blocks.length > 0) {
            for (let i = 0; i < this.blocks.length; i++) {
                json_data.blocks.push({
                    id: this.blocks[i].id,
                    parent: this.blocks[i].parent,
                    data: [],
                    attr: []
                });
                let blockParent:any = (document.querySelector(".blockid[value='" + this.blocks[i].id + "']")as HTMLElement).parentNode;
                blockParent.querySelectorAll("input").forEach((block:any) => {
                    let json_name = block.getAttribute("name");
                    let json_value = block.value;
                    json_data.blocks[i].data.push({
                        name: json_name,
                        value: json_value
                    });
                });
                Array.prototype.slice.call(blockParent.attributes).forEach((attribute) => {
                    let jsonobj:any = {};
                    jsonobj[attribute.name] = attribute.value;
                    json_data.blocks[i].attr.push(jsonobj);
                });
            }
            return json_data;
        }
    }

    deleteBlocks = () => {
        this.flowRef = {};
        this.blocks = [];
        this.arrows= [];
        this.setState({
            blocks:this.blocks.slice(),
            arrows:this.arrows.slice()
        });
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
            this.blockGrabbed(event.target.closest(".create-flowy"));
            //this.drag.classList.add("dragging");
            this.active = true;
            this.dragx = this.mouse_x - (event.target.closest(".create-flowy").offsetLeft);
            this.dragy = this.mouse_y - (event.target.closest(".create-flowy").offsetTop);

            let left = (this.mouse_x - this.dragx) + "px";
            let top = (this.mouse_y - this.dragy) + "px";

            this.setState({
                draggedBlock:{
                    type: blockType,
                    id: blockId,
                    style:{
                        left,
                        top
                    }
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

            let dBlockId = parseInt(this.drag.querySelector(".blockid").value);
            let dBlock = this.blocksTemp.filter( d => d.id === dBlockId)[0];
            let blockType = Number(this.drag.querySelector(".blockelemtype").value);
            let isParent = dBlock ? (dBlock.parent === -1) : false;

            
            if (this.active) {
                this.original.classList.remove("dragnow");
                this.drag.classList.remove("dragging");
            }
            if (isParent && this.rearrange) {

                this.drag.classList.remove("dragging");

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

                            this.snap(i,blocko);

                            break;

                        }
                    }
                    this.link =false;
                }else{
                    this.rearrange = false;
                    for (let w = 0; w < this.blocksTemp.length; w++) {

                        if (this.blocksTemp[w].id !== parseInt(this.drag.querySelector(".blockid").value)) {

                            const blockParent:any = (document.querySelector(".blockid[value='" + this.blocksTemp[w].id + "']") as HTMLElement).parentNode;

                            const arrowParent:any = (document.querySelector(".arrowid[value='" + this.blocksTemp[w].id + "']") as HTMLElement).parentNode;

                            blockParent.style.left = ((blockParent.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                            blockParent.style.top = ((blockParent.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                            arrowParent.style.left = ((arrowParent.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                            arrowParent.style.top = ((arrowParent.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top + this.canvas_div.scrollTop)) + "px";

                            this.canvas_div.appendChild(blockParent);
                            this.canvas_div.appendChild(arrowParent);

                            this.blocksTemp[w].x = (blockParent.getBoundingClientRect().left) + (parseInt(blockParent.offsetWidth) / 2) + this.canvas_div.scrollLeft;

                            this.blocksTemp[w].y = (blockParent.getBoundingClientRect().top) + (parseInt(blockParent.offsetHeight) / 2) + this.canvas_div.scrollTop;

                        }
                    }

                    this.blocksTemp.filter((a:any) => a.id === dBlock.id)[0].x = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2);

                    this.blocksTemp.filter((a:any) => a.id === dBlock.id)[0].y = (this.drag.getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.drag).height) / 2);

                    this.blocks = this.blocks.concat(this.blocksTemp);
                    this.blocksTemp = [];
                }


            } else if (this.active && !this.link && (this.drag.getBoundingClientRect().top) > (this.canvas_div.getBoundingClientRect().top) && (this.drag.getBoundingClientRect().left) > (this.canvas_div.getBoundingClientRect().left)) {

                this.active = false;

                let top = ((this.drag.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                let left = ((this.drag.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                let style = {
                    left,
                    top
                };

                this.setState({
                    draggedBlock:null
                });

                this.blockSnap({style,type:blockType,id:dBlockId});

                this.blocks.push({
                    parent: -1,
                    childwidth: 0,
                    id: dBlockId,
                    x: (this.flowRef[dBlockId].getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.flowRef[dBlockId]).width) / 2) + this.canvas_div.scrollLeft,
                    y: (this.flowRef[dBlockId].getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.flowRef[dBlockId]).height) / 2) + this.canvas_div.scrollTop,
                    width: parseInt(window.getComputedStyle(this.flowRef[dBlockId]).width),
                    height: parseInt(window.getComputedStyle(this.flowRef[dBlockId]).height),
                    style:{left,top},
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

                            this.snap(i, blocko);

                        } else if (this.rearrange) {

                            this.snap(i,blocko);

                        }
                        break;

                    } else if (i === this.blocks.length - 1) {

                        if((this.drag.getBoundingClientRect().top) > (this.canvas_div.getBoundingClientRect().top) && (this.drag.getBoundingClientRect().left) > (this.canvas_div.getBoundingClientRect().left)){

                            this.blocksTemp[0].parent = -1;
                            if (this.rearrange) {
                                this.rearrange = false;
                                this.blocks = this.blocks.concat(this.blocksTemp);
                                this.blocksTemp = [];
                            }

                        } else {
                            this.setState({
                                draggedBlock:null
                            })

                        }


                        this.rearrange = false;
                        this.active = false;
                        break;

                    }
                }
            }
        }
    }

    snap = (i:number, blocko:Array<number>) => {

        let blockId = Number(this.drag.querySelector(".blockid").value);
        let blockType = Number(this.drag.querySelector(".blockelemtype").value);
        let totalwidth = 0;
        let totalremove = 0;

        for (let w = 0; w < this.blocks.filter(id => id.parent === blocko[i]).length; w++) {

            let children = this.blocks.filter(id => id.parent === blocko[i])[w];

            if (children.childwidth > children.width) {
                totalwidth += children.childwidth + this.paddingx;
            } else {
                totalwidth += children.width + this.paddingx;
            }

        }

        totalwidth += parseInt(window.getComputedStyle(this.drag).width);

        for (let w = 0; w < this.blocks.filter(id => id.parent === blocko[i]).length; w++) {

            let children = this.blocks.filter(id => id.parent === blocko[i])[w];

            if (children.childwidth > children.width) {

                let tblock:any = (document.querySelector(".blockid[value='" + children.id + "']") as HTMLElement);

                tblock.parentNode.style.left = (this.blocks.filter(a => a.id === blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2)) + "px";

                children.x = this.blocks.filter(id => id.parent === blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
                totalremove += children.childwidth + this.paddingx;

            } else {

                let tblock:any = (document.querySelector(".blockid[value='" + children.id + "']") as HTMLElement);
                tblock.parentNode.style.left = (this.blocks.filter(a => a.id === blocko[i])[0].x - (totalwidth / 2) + totalremove) + "px";

                children.x = this.blocks.filter(id => id.parent === blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
                totalremove += children.width + this.paddingx;
            }
        }

        let left = (this.blocks.filter(id => id.id === blocko[i])[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

        let top = (this.blocks.filter(id => id.id === blocko[i])[0].y + (this.blocks.filter(id => id.id === blocko[i])[0].height / 2) + this.paddingy - (this.canvas_div.getBoundingClientRect().top)) + "px";

        let style = {
            left,
            top
        };


        if (this.rearrange) {

            this.blocksTemp[0].style = style;

            this.blocksTemp[0].x = (left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft + this.canvas_div.scrollLeft;

            this.blocksTemp[0].y = (top) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop;
            this.blocksTemp[0].parent = blocko[i];

            for (let w = 0; w < this.blocksTemp.length; w++) {

                if (this.blocksTemp[w].id !== blockId) {

                    /* const blockParent:any = (document.querySelector(".blockid[value='" + this.blocksTemp[w].id + "']") as HTMLElement).parentNode;
                    const arrowParent:any = (document.querySelector(".arrowid[value='" + this.blocksTemp[w].id + "']") as HTMLElement).parentNode; */

                    let bLeft = ((this.blocksTemp[w].left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                    let bTop = ((this.blocksTemp[w].top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                    this.blocksTemp[w].left = bLeft;
                    this.blocksTemp[w].top = bTop;

                    if(this.arrowsTemp[w]) {
                        
                        let aLeft = ((this.arrowsTemp[w].left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft + 20) + "px";

                        let aTop = ((this.arrowsTemp[w].top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                        

                        this.arrowsTemp[w].left = aLeft;
                        this.arrowsTemp[w].top = aTop;
                    }

                    

                    /* this.canvas_div.appendChild(blockParent);
                    this.canvas_div.appendChild(arrowParent); */

                    this.blocksTemp[w].x = (bLeft) + (parseInt(this.blocksTemp[w].width) / 2) + this.canvas_div.scrollLeft;
                    this.blocksTemp[w].y = (bTop) + (parseInt(this.blocksTemp[w].height) / 2) + this.canvas_div.scrollTop;

                }
            }
            this.blocks = this.blocks.concat(this.blocksTemp);
            this.arrows = this.arrows.concat(this.arrowsTemp);
            this.blocksTemp = [];
            this.arrowsTemp = [];

            this.setState({
                blocks: this.blocks.slice(),
                arrows: this.arrows.slice(),
                blocksTemp: this.blocksTemp.slice(),
                arrowsTemp: this.arrowsTemp.slice()
            });
        } else {

            this.setState({
                draggedBlock:null
            });

            this.blockSnap({style,type:blockType,id:blockId});

            this.blocks.push({
                childwidth: 0,
                parent: blocko[i],
                id: blockId,
                x: (this.flowRef[blockId].getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.flowRef[blockId]).width) / 2) + this.canvas_div.scrollLeft,
                y: (this.flowRef[blockId].getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.flowRef[blockId]).height) / 2) + this.canvas_div.scrollTop,
                width: parseInt(window.getComputedStyle(this.flowRef[blockId]).width),
                height: parseInt(window.getComputedStyle(this.flowRef[blockId]).height),
                style:{left,top},
                type: blockType,
                link:{
                    show:false,
                    position:'bottom'
                }
            });

        }

        let arrowhelp = this.blocks.filter(a => a.id === blockId)[0];

        let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === blocko[i])[0].x + 20;

        let arrowy = parseFloat(arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(id => id.parent === blocko[i])[0].y + (this.blocks.filter(id => id.parent === blocko[i])[0].height / 2)) + this.canvas_div.scrollTop);

        let path1="";
        let path2="";
        let aLeft="";
        let aTop="";

        if (arrowx < 0) {
    
            path1 = `M ${(this.blocks.filter(a => a.id === blocko[i])[0].x - arrowhelp.x + 5)} 0L${(this.blocks.filter(a => a.id === blocko[i])[0].x - arrowhelp.x + 5)} ${(this.paddingy / 2)}L5 ${(this.paddingy / 2)}  L5 ${arrowy}`;

            path2 = `M0 ${(arrowy - 5)} H10L5 ${arrowy}L0 ${(arrowy - 5)} Z`;

            aLeft = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

        } else {

            path1 = `M20 0L20 ${(this.paddingy / 2)}L${(arrowx)} ${(this.paddingy / 2)}L${arrowx} ${arrowy}`;

            path2 = `M${(arrowx - 5)} ${(arrowy - 5)}H${(arrowx + 5)}L${arrowx} ${arrowy}L${(arrowx - 5)} ${(arrowy - 5)} Z`;

            aLeft = (this.blocks.filter(a => a.id === blocko[i])[0].x - 20 - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

        }

        aTop = (this.blocks.filter(a => a.id === blocko[i])[0].y + (this.blocks.filter(a => a.id === blocko[i])[0].height / 2)) + "px";

        this.arrows.push({
            id:blockId,
            path1,
            path2,
            style:{
                left:aLeft,
                top:aTop
            }
        });

        this.setState({
            arrows:this.arrows.slice()
        });

        if (this.blocks.filter(a => a.id === blocko[i])[0].parent !== -1) {
            let flag = false;
            let idval = blocko[i];
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

                const r_array:any = this.blocks.filter(id => id.id === result[z]);
                if(!r_array.length){
                    break;
                }

                let r_left = "";
                
                r_array.y = r_array.y + this.paddingy;

                if (children.childwidth > children.width) {

                    r_left = (r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) - (this.canvas_div.getBoundingClientRect().left))+ "px";

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);

                    totalremove += children.childwidth + this.paddingx;

                } else {

                    r_left = (r_array[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.width / 2);

                    totalremove += children.width + this.paddingx;

                }

                r_block.style ={
                    left: r_left,
                    top: r_block.style.top
                };

                console.log("r_block",r_block);

                this.blocks[r_index]= r_block;

                this.setState({
                    blocks: this.blocks.slice()
                });

                let arrowhelp = this.blocks.filter(a => a.id === children.id)[0];

                let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === children.parent)[0].x + 20;

                let arrowy = arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(a => a.id === children.parent)[0].y + (this.blocks.filter(a => a.id === children.parent)[0].height / 2));

                let aIndex = this.arrows.findIndex(a => a.id === children.id);

                let top = (this.blocks.filter(id => id.id === children.parent)[0].y + (this.blocks.filter(id => id.id === children.parent)[0].height / 2) - (this.canvas_div.getBoundingClientRect().top)) + "px";

                let left="";
                let path1="";
                let path2="";

                if (arrowx < 0) {
    
                    left = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    path1 = `M${(this.blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5)}  0L${(this.blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5)} ${(this.paddingy / 2)}L5 ${(this.paddingy / 2)}L5 ${arrowy}`;

                    path2 = `M0 ${(arrowy - 5)}H10L5 ${arrowy}L0 ${(arrowy - 5)}Z`;

                } else {

                    left = (this.blocks.filter(id => id.id === children.parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    path1 = `M20 0L20 ${(this.paddingy / 2)}L${(arrowx)} ${(this.paddingy / 2)}L${arrowx} ${arrowy}`;

                    path2 = `M${(arrowx - 5)} ${(arrowy - 5)}H${(arrowx + 5)}L${arrowx} ${arrowy}L${(arrowx - 5)} ${(arrowy - 5)}Z`;

                }

                this.arrows[aIndex] = {
                    id:children.id,
                    path1,
                    path2,
                    style:{
                        left,
                        top
                    }
                };
                this.setState({arrows:this.arrows.slice()});
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

                let left = (this.blocks.filter(a => a.id === blocko[w])[0].x - (this.blocks.filter(a => a.id === blocko[w])[0].width / 2) - this.offsetleft + 20) +"px";

                oBlock.style = {
                    left,
                    top:oBlock.style.top
                }

                this.blocks[oInd] = oBlock;

                this.setState({
                    blocks: this.blocks.slice()
                });

                if (this.blocks.filter(a => a.id === blocko[w])[0].parent !== -1) {

                    let arrowhelp = this.blocks.filter(a => a.id === blocko[w])[0];
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x;

                    let aIndex = this.arrows.findIndex(a=>a.id===blocko[w]);
                    let left = "";

                    if (arrowx < 0) {

                        left = (arrowhelp.x - this.offsetleft + 20 - 5) + "px";

                    } else {

                        left = (this.blocks.filter(id => id.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x - 20 - this.offsetleft + 20) + "px";

                    }
                    
                    this.arrows[aIndex] = {
                        id:blocko[w],
                        path1:this.arrows[aIndex].path1,
                        path2:this.arrows[aIndex].path2,
                        style:{
                            left,
                            top:this.arrows[aIndex].style.top
                        }
                    };

                    this.setState({arrows:this.arrows.slice()});
                }
            }

            for (let w = 0; w < this.blocks.length; w++) {

                let tBlock:any = this.flowRef[this.blocks[w].id];

                this.blocks[w].x = (tBlock.getBoundingClientRect().left) + (this.canvas_div.getBoundingClientRect().left + this.canvas_div.scrollLeft) - (parseInt(window.getComputedStyle(tBlock).width) / 2) - 40;

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
            if (element.className.split(' ').indexOf(classname)>=0) return true;
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

        let left = (this.mouse_x - this.dragx) + "px";
        let top = (this.mouse_y - this.dragy) + "px";

        if (this.dragblock) {

            this.rearrange = true;
            this.drag.classList.add("dragging");
            let blockid = parseInt(this.drag.querySelector(".blockid").value);
            this.blocksTemp.push(this.blocks.filter(a => a.id === blockid)[0]);
            this.blocksTemp[0].parent = -1;

            this.blocks = this.blocks.filter((e) => {
                return e.id !== blockid
            });

            console.log("popped-array",this.blocksTemp.slice(1),"--this.blovkstemp->",this.blocksTemp);

            /* this.setState({
                blocks:this.blocks.slice(),
                blocksTemp:this.blocksTemp.slice()
            }); */

            if (blockid !== 0) {

                let arrowIndex = this.arrows.findIndex(a=>a.id === blockid);
                if (arrowIndex > -1) {
                    this.arrows.splice(arrowIndex, 1);

                    this.setState({arrows:this.arrows.slice()});
                  }
            }

            let layer = this.blocks.filter(a => a.parent === blockid);
            let flag = false;
            let foundids:any = [];
            let allids = [];

            while (!flag) {
                for (let i = 0; i < layer.length; i++) {
                    if (layer[i] !== blockid) {

                        this.blocksTemp.push(this.blocks.filter(a => a.id === layer[i].id)[0]);

                        this.arrowsTemp.push(this.arrows.filter(r => r.id === layer[i].id)[0]);

                        const blockParent:any = this.flowRef[layer[i].id];
                    
                        const arrowParent:any = this.arrowRef[layer[i].id];

                        let left = ((blockParent.getBoundingClientRect().left) - (this.drag.getBoundingClientRect().left)) + "px";

                        let top = ((blockParent.getBoundingClientRect().top) - (this.drag.getBoundingClientRect().top)) + "px";

                        let aLeft = ((arrowParent.getBoundingClientRect().left) - (this.drag.getBoundingClientRect().left)) + "px";

                        let aTop = ((arrowParent.getBoundingClientRect().top) - (this.drag.getBoundingClientRect().top)) + "px";

                        let bIndex = this.blocksTemp.findIndex(b=>b.id===layer[i].id);
                        let aIndex = this.arrowsTemp.findIndex(a=>a.id===layer[i].id);

                        let tBlock = this.blocksTemp.slice()[bIndex];
                        tBlock.style = {
                            left,
                            top
                        }

                        let tArrow = this.arrowsTemp.slice()[aIndex];
                        tArrow.style ={
                            left:aLeft,
                            top:aTop
                        };
                        this.blocksTemp[bIndex] = tBlock;
                        this.arrowsTemp[aIndex] = tArrow;

                        /* this.drag.appendChild(blockParent);
                        this.drag.appendChild(arrowParent); */

                        foundids.push(layer[i].id);
                        allids.push(layer[i].id);
                    }
                }
                if (foundids.length === 0) {
                    flag = true;
                } else {
                    layer = this.blocks.filter(a => foundids.includes(a.parent));
                    foundids = [];
                }
            }
            for (let i = 0; i < this.blocks.filter(a => a.parent === blockid).length; i++) {
                let blocknumber = this.blocks.filter(a => a.parent === blockid)[i];
                this.blocks = this.blocks.filter((e) => {
                    return e.id !== blocknumber
                });
            }
            for (let i = 0; i < allids.length; i++) {
                let blocknumber = allids[i];
                this.blocks = this.blocks.filter((e) => {
                    return e.id !== blocknumber
                });
                this.arrows = this.arrows.filter((r)=>{
                    return r.id !== blocknumber
                });
            }

            this.setState({
                blocks:this.blocks.slice(),
                arrows: this.arrows.slice(),
                blocksTemp: this.blocksTemp.slice(),
                arrowsTemp: this.arrowsTemp.slice()
            });

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

            drag.style= {
                left,
                top
            };

            this.setState({
                draggedBlock:drag
            });

        } else if (this.rearrange) {

            let tBlock = this.blocksTemp.slice()[0];

            let left = (this.mouse_x - this.dragx - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

            let top = (this.mouse_y - this.dragy - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

            tBlock.style = {
                left,
                top
            };

            this.blocksTemp[0] = tBlock;

            this.setState({
                blocksTemp:this.blocksTemp.slice()
            });

            let bsBlock:any = this.blocksTemp.slice()[0];

            bsBlock.x = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

            bsBlock.y = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop;

            this.blocksTemp[0] = bsBlock; 

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
                    console.log("linking");

                    let blockIndex = this.blocks.findIndex(a=>a.id===blocko[i]);

                    this.blocks[blockIndex] = {
                        childwidth: curBlock.childwidth,
                        parent: curBlock.parent,
                        id: curBlock.id,
                        x: curBlock.x,
                        y: curBlock.y,
                        width: curBlock.width,
                        height: curBlock.height,
                        style:curBlock.style,
                        type: curBlock.type,
                        link:{
                            show:true,
                            position:'bottom'
                        }
                    };

                    this.setState({blocks:this.blocks.slice()});

                    break;
                } else {
                    this.link = false;
                    let blockIndex = this.blocks.findIndex(a=>a.id===blocko[i]);

                    this.blocks[blockIndex] = {
                        childwidth: curBlock.childwidth,
                        parent: curBlock.parent,
                        id: curBlock.id,
                        x: curBlock.x,
                        y: curBlock.y,
                        width: curBlock.width,
                        height: curBlock.height,
                        style:curBlock.style,
                        type: curBlock.type,
                        link:{
                            show:false,
                            position:'bottom'
                        }
                    };

                    this.setState({blocks:this.blocks.slice()});
                }

                
            }
        }
    }

    fixOffset = () => {
        if (this.offsetleftold < (this.canvas_div.getBoundingClientRect().left)) {

            this.lastevent = false;
            let blocko = this.blocks.map(a => a.id);
            for (let w = 0; w < this.blocks.length; w++) {

                let offInd = this.blocks.findIndex(a => a.id === blocko[w]);
                let offBlock:any = this.blocks.slice()[offInd];

                let left = (this.blocks.filter(a => a.id === blocko[w])[0].x - (this.blocks.filter(a => a.id === blocko[w])[0].width / 2) - this.offsetleftold - 20) + "px";

                offBlock.style = {
                    left,
                    top:offBlock.style.top
                };

                this.blocks[offInd] = offBlock;

                this.setState({
                    blocks: this.blocks.slice()
                });

                this.blocks.filter(a => a.id === blocko[w])[0].x = (left) + (this.blocks.filter(a => a.id === blocko[w])[0].width / 2);

                if (this.blocks.filter(a => a.id === blocko[w])[0].parent !== -1) {

                    let arrowhelp = this.blocks.filter(a => a.id === blocko[w])[0];
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x;

                    let aIndex = this.arrows.findIndex(a=>a.id===blocko[w]);
                    let left = "";

                    if (arrowx < 0) {

                        left = (arrowhelp.x - 5 - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    } else {

                        left = (this.blocks.filter(id => id.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left)) + "px";
                    }

                    this.arrows[aIndex] = {
                        id:blocko[w],
                        path1:this.arrows[aIndex].path1,
                        path2:this.arrows[aIndex].path2,
                        style:{
                            left,
                            top:this.arrows[aIndex].style.top
                        }
                    };

                    this.setState({arrows:this.arrows.slice()});
                }
            }
            this.offsetleftold = 0;
        }
    }

    load (canvas:HTMLDivElement, spacing_x:number, spacing_y:number) {
        if (!this.loaded)
            this.loaded = true;
        else
            return;
        this.canvas_div = canvas;
        this.paddingx = spacing_x;
        this.paddingy = spacing_y;

        if(this.editMode) {
            this.startEdit();
        }

    }

    startEdit = () => {

        if(!this.editMode) {

            this.editMode = true;

            this.setState({editMode:true});

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
        this.deleteBlocks();
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

    setArrowRef = (id:number,arrow:any) => {
        this.arrowRef[id] = arrow;
    }

    setTempRef = (temp:any) => {
        this.drag = temp;
    }

    render() {
        const { draggedBlock, showSettings, editMode, blocks, arrows, blocksTemp, arrowsTemp } = this.state;
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
                                onClick={this.deleteBlocks}
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
                                            blocks.map((block, index) => <FlowBlock type={block.type} id={block.id} style={block.style} link={block.link} key={`.${index}`} setFlowRef={this.setFlowRef} openConfigurator={this.openConfigurator}></FlowBlock>)
                                        ) : null 
                                    }

                                    {
                                        arrows.length ? (
                                            arrows.map((arrow,index) => <Arrow id={arrow.id} path1={arrow.path1} path2={arrow.path2} style={arrow.style} setArrowRef={this.setArrowRef} key={`_${index}`}></Arrow>)
                                        ) : null
                                    }
                                    {
                                        blocksTemp.length ? (
                                            <TempBlock style={blocksTemp[0].style} type={blocksTemp[0].type} id={blocksTemp[0].id} blocksTemp={blocksTemp.slice(1)} arrowsTemp={arrowsTemp} setTempRef = {this.setTempRef}></TempBlock>
                                        ) : null
                                    }
                                </div>
                            </EuiPageContent>
                        </EuiFlexItem>
                        {draggedBlock ? <DraggedBlock type={draggedBlock.type} id={draggedBlock.id} style={draggedBlock.style} setDragRef={this.setDragRef}></DraggedBlock> : null}
                    </EuiFlexGroup>
                </EuiPageBody>
            </EuiPage>
        )
    }
}
