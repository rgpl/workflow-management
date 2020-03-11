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
import eyeblue from './assets/eyeblue.svg';
import more from './assets/more.svg';
import actionblue from './assets/actionblue.svg';
import timeblue from './assets/timeblue.svg';
import errorblue from './assets/errorblue.svg';
import databaseorange from './assets/databaseorange.svg';
import twitterorange from './assets/twitterorange.svg';
import actionorange from './assets/actionorange.svg';
import logred from './assets/logred.svg';
import errorred from './assets/errorred.svg';

import Flyout from './flyout';
import {Blocks, DraggedBlock, FlowBlock} from './blocks';

type SketchProps = {
    editMode:boolean
};

type SketchState ={
    showSettings:boolean;
    editMode: boolean;
    draggedBlock:any;
    blocks:Array<any>
};

export default class SketchPad extends Component<SketchProps, SketchState> {

    state:SketchState ={
        showSettings: false,
        editMode: this.props.editMode,
        draggedBlock: null,
        blocks:[]
    }
    breadcrumbs:any = [];
    tempblock2:any;
    loaded:boolean;
    blocks:Array<any>;
    blockstemp:Array<any>;
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
    chartData:any;
    aclick:boolean;
    rightcard:boolean;
    tempblock:any;
    editMode:boolean;





    constructor(props:SketchProps){
        super(props);
        this.state ={
            showSettings:false,
            editMode: this.props.editMode,
            draggedBlock:null,
            blocks:[]
        };
        this.breadcrumbs = [];

        this.tempblock2= undefined;
        this.loaded = false;
        this.blocks = [];
        this.blockstemp = [];
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
        this.chartData = '';

        this.aclick = false;
        this.rightcard = false;
        this.tempblock = undefined;
        this.editMode = this.props.editMode;
    }

    componentDidMount(){
        this.flowy(this.canvasRef.current);
    }

    closeSettings = () => {
        if (this.rightcard) {
            this.rightcard = false;
            this.setState({showSettings:false});
            this.tempblock.classList.remove("selectedblock");
        }
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

    blockSnap() {
        let flowBlocks = [
            {
                icon:eyeblue,
                title:'Enter Workflow',
                desc:'When a <span>New User</span> goes to <span>Site 1</span>'
            },
            {
                icon:actionblue,
                title:'Action is performed',
                desc:'When <span>Action 1</span> is performed'
            },
            {
                icon:timeblue,
                title:'Time has passed',
                desc:'When <span>10 seconds</span> have passed'
            },
            {
                icon:errorblue,
                title:'Exit Workflow',
                desc:'When <span>10 seconds</span> have passed'
            },
            {
                icon:databaseorange,
                title:'New database entry',
                desc:'Add <span>Data object</span> to <span>Database 1</span>'
            },
            {
                icon:databaseorange,
                title:'Update database',
                desc:'Update <span>Database 1</span>'
            },
            {
                icon:actionorange,
                title:'Perform an action',
                desc:'Perform <span>Action 1</span>'
            },
            {
                icon:twitterorange,
                title:'Make a tweet',
                desc:'Tweet <span>Query 1</span> with the account <span>@twitter</span>'
            },
            {
                icon:logred,
                title:'Add new log entry',
                desc:'Add new <span>success</span> log entry'
            },
            {
                icon:logred,
                title:'Update logs',
                desc:'Edit <span>Log Entry 1</span>'
            },
            {
                icon:errorred,
                title:'Prompt an error',
                desc:'Trigger <span>Exit</span>'
            }

        ];

        let blockin = this.drag.querySelector(".blockin");
        blockin.parentNode.removeChild(blockin);

        let blockIndex = Number(this.drag.querySelector(".blockelemtype").value);

        let chosenBlock = "<div class='blockyleft'><img width='25' height='25' src="+flowBlocks[(blockIndex-1)].icon+"><p class='blockyname'>"+flowBlocks[(blockIndex-1)].title+"</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>"+flowBlocks[(blockIndex-1)].desc+"</div>";

        this.drag.innerHTML += chosenBlock;

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
        this.blocks = [];
        this.canvas_div.innerHTML = "<div class='indicator invisible'></div>";
    }

    beginDrag = (event:any) => {
        this.aclick = true;
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
            console.log("blockIndex->",blockType);
            let blockId = 0;
           /*  let newNode = event.target.closest(".create-flowy").cloneNode(true);
            event.target.closest(".create-flowy").classList.add("dragnow");
            newNode.classList.add("block");
            newNode.classList.remove("create-flowy"); */
            if (this.blocks.length === 0) {
                blockId=0;
                /* newNode.innerHTML += "<input type='hidden' name='blockid' class='blockid' value='" + this.blocks.length + "'>";
                document.body.appendChild(newNode);
                this.drag = (document.querySelector(".blockid[value='" + this.blocks.length + "']") as HTMLElement).parentNode; */
            } else {
                blockId = (Math.max.apply(Math, this.blocks.map(a => a.id)) + 1);
                /* newNode.innerHTML += "<input type='hidden' name='blockid' class='blockid' value='" + (Math.max.apply(Math, this.blocks.map(a => a.id)) + 1) + "'>";
                document.body.appendChild(newNode);
                this.drag = (document.querySelector(".blockid[value='" + ((Math.max.apply(Math, this.blocks.map(a => a.id))) + 1) + "']") as HTMLElement).parentNode; */
            }
            this.blockGrabbed(event.target.closest(".create-flowy"));
            //this.drag.classList.add("dragging");
            this.active = true;
            this.dragx = this.mouse_x - (event.target.closest(".create-flowy").offsetLeft);
            this.dragy = this.mouse_y - (event.target.closest(".create-flowy").offsetTop);
            /* this.drag.style.left = (this.mouse_x - this.dragx) + "px";
            this.drag.style.top = (this.mouse_y - this.dragy) + "px"; */

            let _left = (this.mouse_x - this.dragx) + "px";
            let _top = (this.mouse_y - this.dragy) + "px";

            this.setState({
                draggedBlock:{
                    type: blockType,
                    id: blockId,
                    style:{
                        left:_left,
                        top:_top
                    }
                }
            });
        }
    }

    touchDone = () => {
        this.dragblock = false;
    }

    endDrag = (event:any) => {
        console.log("drag->",this.drag);

        if (event.type === "mouseup" && this.aclick) {
            if (!this.rightcard && this.hasParentClass(event.target,'block')) {
                this.tempblock = event.target.closest(".block");
                this.rightcard = true;
                this.setState({showSettings:true});
                this.tempblock.classList.add("selectedblock");
            }
        }

        if (event.which !== 3 && (this.active || this.rearrange)) {

            this.dragblock = false;
            this.blockReleased();

            let dBlockId = parseInt(this.drag.querySelector(".blockid").value);
            let dBlock = this.blockstemp.filter( d => d.id === dBlockId)[0];
            let isParent = dBlock ? (dBlock.parent === -1) : false;

            if (!(document.querySelector(".indicator") as HTMLElement).classList.contains("invisible")) {
                (document.querySelector(".indicator") as HTMLElement).classList.add("invisible");
            }
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
                    for (let w = 0; w < this.blockstemp.length; w++) {

                        if (this.blockstemp[w].id !== parseInt(this.drag.querySelector(".blockid").value)) {

                            const blockParent:any = (document.querySelector(".blockid[value='" + this.blockstemp[w].id + "']") as HTMLElement).parentNode;

                            const arrowParent:any = (document.querySelector(".arrowid[value='" + this.blockstemp[w].id + "']") as HTMLElement).parentNode;

                            blockParent.style.left = ((blockParent.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                            blockParent.style.top = ((blockParent.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                            arrowParent.style.left = ((arrowParent.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                            arrowParent.style.top = ((arrowParent.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top + this.canvas_div.scrollTop)) + "px";

                            this.canvas_div.appendChild(blockParent);
                            this.canvas_div.appendChild(arrowParent);

                            this.blockstemp[w].x = (blockParent.getBoundingClientRect().left) + (parseInt(blockParent.offsetWidth) / 2) + this.canvas_div.scrollLeft;

                            this.blockstemp[w].y = (blockParent.getBoundingClientRect().top) + (parseInt(blockParent.offsetHeight) / 2) + this.canvas_div.scrollTop;

                        }
                    }

                    this.blockstemp.filter((a:any) => a.id === dBlock.id)[0].x = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2);

                    this.blockstemp.filter((a:any) => a.id === dBlock.id)[0].y = (this.drag.getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.drag).height) / 2);

                    this.blocks = this.blocks.concat(this.blockstemp);
                    this.blockstemp = [];
                }


            } else if (this.active && !this.link && (this.drag.getBoundingClientRect().top) > (this.canvas_div.getBoundingClientRect().top) && (this.drag.getBoundingClientRect().left) > (this.canvas_div.getBoundingClientRect().left)) {

                console.log("calling here->");

                //this.blockSnap();
                this.active = false;

                let top = ((this.drag.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                let left = ((this.drag.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                const drag = this.state.draggedBlock;

                drag.style = {
                    left,
                    top
                }



                console.log("dragsfer->",this.drag);

                //this.canvas_div.appendChild(this.drag);

                this.blocks.push({
                    parent: -1,
                    childwidth: 0,
                    id: parseInt(this.drag.querySelector(".blockid").value),
                    x: (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft,
                    y: (this.drag.getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop,
                    width: parseInt(window.getComputedStyle(this.drag).width),
                    height: parseInt(window.getComputedStyle(this.drag).height),
                    style:{left,top},
                    type: Number(this.drag.querySelector(".blockelemtype").value)
                });

                this.setState({
                    draggedBlock:null,
                    blocks:this.blocks
                });


            } else if (this.active && this.blocks.length === 0) {

                this.canvas_div.appendChild(document.querySelector(".indicator"));
                this.drag.parentNode.removeChild(this.drag);

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

                        if (!this.rearrange && this.blockSnap()) {

                            this.snap(i, blocko);

                        } else if (this.rearrange) {

                            this.snap(i,blocko);

                        }
                        break;

                    } else if (i === this.blocks.length - 1) {

                        if((this.drag.getBoundingClientRect().top) > (this.canvas_div.getBoundingClientRect().top) && (this.drag.getBoundingClientRect().left) > (this.canvas_div.getBoundingClientRect().left)){

                            this.blockstemp[0].parent = -1;
                            if (this.rearrange) {
                                this.rearrange = false;
                                this.blocks = this.blocks.concat(this.blockstemp);
                                this.blockstemp = [];
                            }

                        } else {
                            this.drag.parentNode.removeChild(this.drag);
                            this.drag = null;
                        }


                        this.rearrange = false;
                        this.active = false;
                        this.canvas_div.appendChild(document.querySelector(".indicator"));
                        break;

                    }
                }
            }
        }
    }

    snap = (i:number, blocko:Array<number>) => {
        if (!this.rearrange) {
            this.canvas_div.appendChild(this.drag);
        }
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

        this.drag.style.left = (this.blocks.filter(id => id.id === blocko[i])[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

        this.drag.style.top = (this.blocks.filter(id => id.id === blocko[i])[0].y + (this.blocks.filter(id => id.id === blocko[i])[0].height / 2) + this.paddingy - (this.canvas_div.getBoundingClientRect().top)) + "px";

        if (this.rearrange) {

            this.blockstemp.filter(a => a.id === parseInt(this.drag.querySelector(".blockid").value))[0].x = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft + this.canvas_div.scrollLeft;

            this.blockstemp.filter(a => a.id === parseInt(this.drag.querySelector(".blockid").value))[0].y = (this.drag.getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop;
            this.blockstemp.filter(a => a.id === parseInt(this.drag.querySelector(".blockid").value))[0].parent = blocko[i];

            for (let w = 0; w < this.blockstemp.length; w++) {

                if (this.blockstemp[w].id !== parseInt(this.drag.querySelector(".blockid").value)) {

                    const blockParent:any = (document.querySelector(".blockid[value='" + this.blockstemp[w].id + "']") as HTMLElement).parentNode;
                    const arrowParent:any = (document.querySelector(".arrowid[value='" + this.blockstemp[w].id + "']") as HTMLElement).parentNode;

                    blockParent.style.left = ((blockParent.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

                    blockParent.style.top = ((blockParent.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                    arrowParent.style.left = ((arrowParent.getBoundingClientRect().left) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft + 20) + "px";

                    arrowParent.style.top = ((arrowParent.getBoundingClientRect().top) - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

                    this.canvas_div.appendChild(blockParent);
                    this.canvas_div.appendChild(arrowParent);

                    this.blockstemp[w].x = (blockParent.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(blockParent).width) / 2) + this.canvas_div.scrollLeft;
                    this.blockstemp[w].y = (blockParent.getBoundingClientRect().top) + (parseInt(window.getComputedStyle(blockParent).height) / 2) + this.canvas_div.scrollTop;

                }
            }
            this.blocks = this.blocks.concat(this.blockstemp);
            this.blockstemp = [];
        } else {
            this.blocks.push({
                childwidth: 0,
                parent: blocko[i],
                id: parseInt(this.drag.querySelector(".blockid").value),
                x: (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft,
                y: (this.drag.getBoundingClientRect().top) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop,
                width: parseInt(window.getComputedStyle(this.drag).width),
                height: parseInt(window.getComputedStyle(this.drag).height)
            });
        }

        let arrowhelp = this.blocks.filter(a => a.id === parseInt(this.drag.querySelector(".blockid").value))[0];

        let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === blocko[i])[0].x + 20;

        let arrowy = parseFloat(arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(id => id.parent === blocko[i])[0].y + (this.blocks.filter(id => id.parent === blocko[i])[0].height / 2)) + this.canvas_div.scrollTop);

        if (arrowx < 0) {

            this.canvas_div.innerHTML += '<div class="arrowblock"><input type="hidden" class="arrowid" value="' + this.drag.querySelector(".blockid").value + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' + (this.blocks.filter(a => a.id === blocko[i])[0].x - arrowhelp.x + 5) + ' 0L' + (this.blocks.filter(a => a.id === blocko[i])[0].x - arrowhelp.x + 5) + ' ' + (this.paddingy / 2) + 'L5 ' + (this.paddingy / 2) + 'L5 ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' + (arrowy - 5) + 'H10L5 ' + arrowy + 'L0 ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg></div>';

            let tArrow:any = document.querySelector('.arrowid[value="' + this.drag.querySelector(".blockid").value + '"]') as HTMLElement;
            tArrow.parentNode.style.left = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

        } else {

            this.canvas_div.innerHTML += '<div class="arrowblock"><input type="hidden" class="arrowid" value="' + this.drag.querySelector(".blockid").value + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' + (this.paddingy / 2) + 'L' + (arrowx) + ' ' + (this.paddingy / 2) + 'L' + arrowx + ' ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' + (arrowx - 5) + ' ' + (arrowy - 5) + 'H' + (arrowx + 5) + 'L' + arrowx + ' ' + arrowy + 'L' + (arrowx - 5) + ' ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg></div>';

            let tArrow:any = document.querySelector('.arrowid[value="' + parseInt(this.drag.querySelector(".blockid").value) + '"]') as HTMLElement;
            tArrow.parentNode.style.left = (this.blocks.filter(a => a.id === blocko[i])[0].x - 20 - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

        }

        let rArrow:any = document.querySelector('.arrowid[value="' + parseInt(this.drag.querySelector(".blockid").value) + '"]') as HTMLElement;
        rArrow.parentNode.style.top = (this.blocks.filter(a => a.id === blocko[i])[0].y + (this.blocks.filter(a => a.id === blocko[i])[0].height / 2)) + "px";

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
            this.drag.classList.remove("dragging");
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
                const r_block:any = (document.querySelector(".blockid[value='" + children.id + "']") as HTMLElement).parentNode;
                const r_array:any = this.blocks.filter(id => id.id === result[z]);
                if(!r_array.length){
                    break;
                }

                r_block.style.top = (r_array.y + this.paddingy) + "px";

                r_array.y = r_array.y + this.paddingy;

                if (children.childwidth > children.width) {

                    r_block.style.left = (r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) - (this.canvas_div.getBoundingClientRect().left))+ "px";

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);

                    totalremove += children.childwidth + this.paddingx;

                } else {

                    r_block.style.left = (r_array[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.width / 2);

                    totalremove += children.width + this.paddingx;

                }

                let arrowhelp = this.blocks.filter(a => a.id === children.id)[0];

                let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === children.parent)[0].x + 20;

                let arrowy = arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(a => a.id === children.parent)[0].y + (this.blocks.filter(a => a.id === children.parent)[0].height / 2));

                let xArrow:any = document.querySelector('.arrowid[value="' + children.id + '"]') as HTMLElement;
                xArrow.parentNode.style.top = (this.blocks.filter(id => id.id === children.parent)[0].y + (this.blocks.filter(id => id.id === children.parent)[0].height / 2) - (this.canvas_div.getBoundingClientRect().top)) + "px";

                if (arrowx < 0) {

                    let yArrow:any = document.querySelector('.arrowid[value="' + children.id + '"]') as HTMLElement;
                    yArrow.parentNode.style.left = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    let y1Arrow:any = document.querySelector('.arrowid[value="' + children.id + '"]') as HTMLElement;
                    y1Arrow.parentNode.innerHTML = '<input type="hidden" class="arrowid" value="' + children.id + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' + (this.blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5) + ' 0L' + (this.blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5) + ' ' + (this.paddingy / 2) + 'L5 ' + (this.paddingy / 2) + 'L5 ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' + (arrowy - 5) + 'H10L5 ' + arrowy + 'L0 ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg>';

                } else {

                    let yArrow:any = document.querySelector('.arrowid[value="' + children.id + '"]') as HTMLElement;
                    yArrow.parentNode.style.left = (this.blocks.filter(id => id.id === children.parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    let y1Arrow:any = document.querySelector('.arrowid[value="' + children.id + '"]') as HTMLElement;
                    y1Arrow.parentNode.innerHTML = '<input type="hidden" class="arrowid" value="' + children.id + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' + (this.paddingy / 2) + 'L' + (arrowx) + ' ' + (this.paddingy / 2) + 'L' + arrowx + ' ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' + (arrowx - 5) + ' ' + (arrowy - 5) + 'H' + (arrowx + 5) + 'L' + arrowx + ' ' + arrowy + 'L' + (arrowx - 5) + ' ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg>';
                }
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

                let oBlock:any = document.querySelector(".blockid[value='" + this.blocks.filter(a => a.id === blocko[w])[0].id + "']") as HTMLElement;
                oBlock.parentNode.style.left = (this.blocks.filter(a => a.id === blocko[w])[0].x - (this.blocks.filter(a => a.id === blocko[w])[0].width / 2) - this.offsetleft + 20) +"px";

                if (this.blocks.filter(a => a.id === blocko[w])[0].parent !== -1) {
                    let arrowhelp = this.blocks.filter(a => a.id === blocko[w])[0];
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x;
                    if (arrowx < 0) {

                        let oArrow:any = document.querySelector('.arrowid[value="' + blocko[w] + '"]') as HTMLElement;
                        oArrow.parentNode.style.left = (arrowhelp.x - this.offsetleft + 20 - 5) + "px";

                    } else {

                        let oArrow:any = document.querySelector('.arrowid[value="' + blocko[w] + '"]') as HTMLElement;
                        oArrow.parentNode.style.left = (this.blocks.filter(id => id.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x - 20 - this.offsetleft + 20) + "px";

                    }
                }
            }

            for (let w = 0; w < this.blocks.length; w++) {

                let tBlock:any = document.querySelector(".blockid[value='" + this.blocks[w].id + "']") as HTMLElement;

                this.blocks[w].x = (tBlock.parentNode.getBoundingClientRect().left) + (this.canvas_div.getBoundingClientRect().left + this.canvas_div.scrollLeft) - (parseInt(window.getComputedStyle(tBlock.parentNode).width) / 2) - 40;

            }

            this.offsetleftold = this.offsetleft;
        }
    }

    touchblock = (event:any) => {
        this.dragblock = false;
        if (this.hasParentClass(event.target, "block")) {
            let theblock = event.target.closest(".block");
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
                        this.drag = theblock;
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
        if (this.dragblock) {

            this.rearrange = true;
            this.drag.classList.add("dragging");
            let blockid = parseInt(this.drag.querySelector(".blockid").value);
            this.blockstemp.push(this.blocks.filter(a => a.id === blockid)[0]);
            this.blockstemp[0].parent = -1;
            this.blocks = this.blocks.filter((e) => {
                return e.id !== blockid
            });

            if (blockid !== 0) {
                let parentArrow:any = document.querySelector(".arrowid[value='" + blockid + "']");
                if(parentArrow) parentArrow.parentNode.remove();
            }

            let layer = this.blocks.filter(a => a.parent === blockid);
            let flag = false;
            let foundids:any = [];
            let allids = [];

            while (!flag) {
                for (let i = 0; i < layer.length; i++) {
                    if (layer[i] !== blockid) {

                        this.blockstemp.push(this.blocks.filter(a => a.id === layer[i].id)[0]);

                        const blockParent:any = (document.querySelector(".blockid[value='" + layer[i].id + "']") as HTMLElement).parentNode;

                        const arrowParent:any = (document.querySelector(".arrowid[value='" + layer[i].id + "']") as HTMLElement).parentNode;

                        blockParent.style.left = ((blockParent.getBoundingClientRect().left) - (this.drag.getBoundingClientRect().left)) + "px";

                        blockParent.style.top = ((blockParent.getBoundingClientRect().top) - (this.drag.getBoundingClientRect().top)) + "px";

                        arrowParent.style.left = ((arrowParent.getBoundingClientRect().left) - (this.drag.getBoundingClientRect().left)) + "px";

                        arrowParent.style.top = ((arrowParent.getBoundingClientRect().top) - (this.drag.getBoundingClientRect().top)) + "px";

                        this.drag.appendChild(blockParent);
                        this.drag.appendChild(arrowParent);

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

            let left = (this.mouse_x - this.dragx) + "px";
            let top = (this.mouse_y - this.dragy) + "px";

            drag.style= {
                left,
                top
            };

            this.setState({
                draggedBlock:drag
            });

        } else if (this.rearrange) {

            this.drag.style.left = (this.mouse_x - this.dragx - (this.canvas_div.getBoundingClientRect().left) + this.canvas_div.scrollLeft) + "px";

            this.drag.style.top = (this.mouse_y - this.dragy - (this.canvas_div.getBoundingClientRect().top) + this.canvas_div.scrollTop) + "px";

            let bsBlock:any = this.blockstemp.filter(a => a.id === parseInt(this.drag.querySelector(".blockid").value));
            bsBlock.x = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

            bsBlock.y = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop;

        }
        if (this.active || this.rearrange) {

            this.aclick = false;

            let xpos = (this.drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

            let ypos = (this.drag.getBoundingClientRect().top) + this.canvas_div.scrollTop;

            let blocko = this.blocks.map(a => a.id);

            for (let i = 0; i < this.blocks.length; i++) {

                if (
                    (xpos >= (this.blocks.filter(a => a.id === blocko[i])[0].x - (this.blocks.filter(a => a.id === blocko[i])[0].width / 2) - this.paddingx))
                    &&
                    (xpos <= (this.blocks.filter(a => a.id === blocko[i])[0].x + (this.blocks.filter(a => a.id === blocko[i])[0].width / 2) + this.paddingx))
                    &&
                    (ypos >= (this.blocks.filter(a => a.id === blocko[i])[0].y - (this.blocks.filter(a => a.id === blocko[i])[0].height / 2)))
                    &&
                    (ypos <= (this.blocks.filter(a => a.id === blocko[i])[0].y + this.blocks.filter(a => a.id === blocko[i])[0].height))
                ) {

                    this.link = true;

                    let linkInd:any = document.querySelector(".indicator") as HTMLElement;
                    let cBlock:any = document.querySelector(".blockid[value='" + blocko[i] + "']") as HTMLElement;

                    cBlock.parentNode.appendChild(linkInd);

                    linkInd.style.left = ((parseInt(window.getComputedStyle(cBlock.parentNode).width) / 2) - 5) + "px";

                    linkInd.style.top = (window.getComputedStyle(cBlock.parentNode).height) + "px";

                    linkInd.classList.remove("invisible");

                    break;
                } else if (i === this.blocks.length - 1) {

                    if (!(document.querySelector(".indicator") as HTMLElement).classList.contains("invisible")) {
                        (document.querySelector(".indicator") as HTMLElement).classList.add("invisible");
                    }
                } else {
                    this.link = false;
                }
            }
        }
    }

    fixOffset = () => {
        if (this.offsetleftold < (this.canvas_div.getBoundingClientRect().left)) {

            this.lastevent = false;
            let blocko = this.blocks.map(a => a.id);
            for (let w = 0; w < this.blocks.length; w++) {

                let offBlock:any = document.querySelector(".blockid[value='" + this.blocks.filter(a => a.id === blocko[w])[0].id + "']") as HTMLElement;

                offBlock.parentNode.style.left = (this.blocks.filter(a => a.id === blocko[w])[0].x - (this.blocks.filter(a => a.id === blocko[w])[0].width / 2) - this.offsetleftold - 20) + "px";

                this.blocks.filter(a => a.id === blocko[w])[0].x = (offBlock.parentNode.getBoundingClientRect().left) + (this.blocks.filter(a => a.id === blocko[w])[0].width / 2);

                if (this.blocks.filter(a => a.id === blocko[w])[0].parent !== -1) {

                    let arrowhelp = this.blocks.filter(a => a.id === blocko[w])[0];
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x;

                    if (arrowx < 0) {

                        let offArrow:any = document.querySelector('.arrowid[value="' + blocko[w] + '"]') as HTMLElement;

                        offArrow.parentNode.style.left = (arrowhelp.x - 5 - (this.canvas_div.getBoundingClientRect().left)) + "px";

                    } else {

                        let offArrow:any = document.querySelector('.arrowid[value="' + blocko[w] + '"]') as HTMLElement;

                        offArrow.parentNode.style.left = (this.blocks.filter(id => id.id === this.blocks.filter(a => a.id === blocko[w])[0].parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left)) + "px";
                    }
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
        this.blocks = [];
        this.blockstemp = [];
        this.canvas_div = canvas;
        this.active = false;
        this.paddingx = spacing_x;
        this.paddingy = spacing_y;
        this.offsetleft = 0;
        this.offsetleftold = 0;
        this.rearrange = false;
        this.lastevent = false;
        this.dragx = 0;
        this.dragy = 0;
        this.original = undefined;
        this.drag = undefined;
        this.mouse_x = 0;
        this.mouse_y = 0;
        this.dragblock = false;
        let el = document.createElement("DIV");
        el.classList.add('indicator');
        el.classList.add('invisible');
        this.canvas_div.appendChild(el);

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

    render() {
        const { draggedBlock, showSettings, editMode, blocks } = this.state;
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

                            {editMode ? <Blocks></Blocks> : null}

                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiPageContent paddingSize="none" >
                                {showSettings? <Flyout closeSettings={this.closeSettings} /> : null}
                                <div className={`canvas ${(editMode ? 'edit-bg' : 'view-bg')}`} ref={this.canvasRef}>
                                    {blocks.length ? (
                                        blocks.map((block, index) => <FlowBlock type={block.type} id={block.id} style={block.style} key={`.${index}`}></FlowBlock>)
                                    ) : null }
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
