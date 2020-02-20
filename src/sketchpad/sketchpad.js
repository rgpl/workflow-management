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
    EuiButtonIcon,
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
import Blocks from './blocks';



export default class SketchPad extends Component {

    constructor(props){
        super(props);
        this.state ={
            showSettings:false,
            editMode: this.props.editMode
        };
        this.breadcrumbs = [];

        this.tempblock2= undefined;
        this.loaded = false;
        this.blocks = [];
        this.blockstemp = [];
        this.canvas_div = undefined;
        this.active = false;
        this.paddingx = undefined
        this.paddingy = undefined;
        this.offsetleft = 0;
        this.offsetleftold = 0;
        this.rearrange = false;
        this.lastevent = false;
        this.dragx = undefined;
        this.dragy = undefined;
        this.original = undefined;
        this.drag = undefined;
        this.mouse_x = undefined;
        this.mouse_y = undefined;
        this.dragblock = false;

        this.canvasRef = React.createRef();
        this.chartData = null;

        this.aclick = false;
        this.rightcard = false;
        this.tempblock = undefined;
        this.editMode = this.props.editMode;
        this.magnifyMax = 1;
        this.magnifyMin = 0.1;
        this.currentScale = 1;
        this.scaleIncrementor = 0.1;
    }

    componentDidMount(){
        this.flowy(this.canvasRef.current);
    }

    closeSettings = (event) => {
        if (this.rightcard) {
            this.rightcard = false;
            this.setState({showSettings:false});
            this.tempblock.classList.remove("selectedblock");
        }
    }

    snapping=(first)=>  {

        let blockin = this.drag.querySelector(".blockin");
        blockin.parentNode.removeChild(blockin);
        if (this.drag.querySelector(".blockelemtype").value == "1") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+eyeblue+"><p class='blockyname'>Enter Workflow</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>When a <span>New User</span> goes to <span>Site 1</span></div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "2") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+actionblue+"><p class='blockyname'>Action is performed</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>When <span>Action 1</span> is performed</div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "3") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+timeblue+"><p class='blockyname'>Time has passed</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>When <span>10 seconds</span> have passed</div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "4") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+errorblue+"><p class='blockyname'>Exit Workflow</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>When <span>Exit</span> is triggered</div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "5") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+databaseorange+"><p class='blockyname'>New database entry</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>Add <span>Data object</span> to <span>Database 1</span></div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "6") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+databaseorange+"><p class='blockyname'>Update database</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>Update <span>Database 1</span></div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "7") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+actionorange+"><p class='blockyname'>Perform an action</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>Perform <span>Action 1</span></div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "8") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+twitterorange+"><p class='blockyname'>Make a tweet</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>Tweet <span>Query 1</span> with the account <span>@alyssaxuu</span></div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "9") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+logred+"><p class='blockyname'>Add new log entry</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>Add new <span>success</span> log entry</div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "10") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+logred+"><p class='blockyname'>Update logs</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>Edit <span>Log Entry 1</span></div>";
        } else if (this.drag.querySelector(".blockelemtype").value == "11") {
            this.drag.innerHTML += "<div class='blockyleft'><img src="+errorred+"><p class='blockyname'>Prompt an error</p></div><div class='blockyright'><img src="+more+"></div><div class='blockydiv'></div><div class='blockyinfo'>Trigger <span>Exit</span></div>";
        }
        return true;
    }

    pull=(block)=> {
        block.classList.add("blockdisabled");
        this.tempblock2 = block;
    }

    release=()=> {
        if(this.tempblock2)
            this.tempblock2.classList.remove("blockdisabled");
    }

    flowy(canvas, spacing_x, spacing_y) {

        if (!spacing_x) {
            spacing_x = 20;
        }
        if (!spacing_y) {
            spacing_y = 80;
        }


        this.load(canvas, spacing_x, spacing_y);

    }

    blockGrabbed = (block) => {
        this.pull(block);
    }

    blockReleased() {
        this.release();
    }

    blockSnap(first, parent) {
        return this.snapping(first, parent);
    }

    import = (output) => {
        this.canvas_div.innerHTML = JSON.parse(output.html);
        this.blocks = output.blockarr;
    }

    output = () => {
        let html_ser = JSON.stringify(this.canvas_div.innerHTML);
        let json_data = {html:html_ser, blockarr:this.blocks, blocks:[]};
        if (this.blocks.length > 0) {
            for (let i = 0; i < this.blocks.length; i++) {
                json_data.blocks.push({
                    id: this.blocks[i].id,
                    parent: this.blocks[i].parent,
                    data: [],
                    attr: []
                });
                let blockParent = document.querySelector(".blockid[value='" + this.blocks[i].id + "']").parentNode;
                blockParent.querySelectorAll("input").forEach((block) => {
                    let json_name = block.getAttribute("name");
                    let json_value = block.value;
                    json_data.blocks[i].data.push({
                        name: json_name,
                        value: json_value
                    });
                });
                Array.prototype.slice.call(blockParent.attributes).forEach((attribute) => {
                    let jsonobj = {};
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

    beginDrag = (event) => {
        this.aclick = true;
        if (event.targetTouches) {
            this.mouse_x = event.changedTouches[0].clientX;
            this.mouse_y = event.changedTouches[0].clientY;
        } else {
            this.mouse_x = event.clientX;
            this.mouse_y = event.clientY;
        }
        if (event.which != 3 && event.target.closest(".create-flowy")) {
            this.original = event.target.closest(".create-flowy");
            let newNode = event.target.closest(".create-flowy").cloneNode(true);
            event.target.closest(".create-flowy").classList.add("dragnow");
            newNode.classList.add("block");
            newNode.classList.remove("create-flowy");
            if (this.blocks.length === 0) {
                newNode.innerHTML += "<input type='hidden' name='blockid' class='blockid' value='" + this.blocks.length + "'>";
                document.body.appendChild(newNode);
                this.drag = document.querySelector(".blockid[value='" + this.blocks.length + "']").parentNode;
            } else {
                newNode.innerHTML += "<input type='hidden' name='blockid' class='blockid' value='" + (Math.max.apply(Math, this.blocks.map(a => a.id)) + 1) + "'>";
                document.body.appendChild(newNode);
                this.drag = document.querySelector(".blockid[value='" + (parseInt(Math.max.apply(Math, this.blocks.map(a => a.id))) + 1) + "']").parentNode;
            }
            this.blockGrabbed(event.target.closest(".create-flowy"));
            this.drag.classList.add("dragging");
            this.active = true;
            this.dragx = this.mouse_x - (event.target.closest(".create-flowy").offsetLeft);
            this.dragy = this.mouse_y - (event.target.closest(".create-flowy").offsetTop);
            this.drag.style.left = (this.mouse_x - this.dragx) + "px";
            this.drag.style.top = (this.mouse_y - this.dragy) + "px";
        }
    }

    touchDone = () => {
        this.dragblock = false;
    }

    endDrag = (event) => {

        if (event.type === "mouseup" && this.aclick) {
            if (!this.rightcard && this.hasParentClass(event.target,'block')) {
                this.tempblock = event.target.closest(".block");
                this.rightcard = true;
                this.setState({showSettings:true});
                this.tempblock.classList.add("selectedblock");
            }
        }

        if (event.which != 3 && (this.active || this.rearrange)) {
            this.dragblock = false;
            this.blockReleased();
            if (!document.querySelector(".indicator").classList.contains("invisible")) {
                document.querySelector(".indicator").classList.add("invisible");
            }
            if (this.active) {
                this.original.classList.remove("dragnow");
                this.drag.classList.remove("dragging");
            }
            if (parseInt(this.drag.querySelector(".blockid").value) === 0 && this.rearrange) {
                this.drag.classList.remove("dragging");
                this.rearrange = false;
                for (let w = 0; w < this.blockstemp.length; w++) {

                    if (this.blockstemp[w].id != parseInt(this.drag.querySelector(".blockid").value)) {

                        const blockParent = document.querySelector(".blockid[value='" + this.blockstemp[w].id + "']").parentNode;

                        const arrowParent = document.querySelector(".arrowid[value='" + this.blockstemp[w].id + "']").parentNode;

                        blockParent.style.left = ((blockParent.getBoundingClientRect().left + window.scrollX) - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

                        blockParent.style.top = ((blockParent.getBoundingClientRect().top + window.scrollY) - (this.canvas_div.getBoundingClientRect().top + window.scrollY) + this.canvas_div.scrollTop) + "px";

                        arrowParent.style.left = ((arrowParent.getBoundingClientRect().left + window.scrollX) - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

                        arrowParent.style.top = ((arrowParent.getBoundingClientRect().top + window.scrollY) - (this.canvas_div.getBoundingClientRect().top + this.canvas_div.scrollTop)) + "px";

                        this.canvas_div.appendChild(blockParent);
                        this.canvas_div.appendChild(arrowParent);

                        this.blockstemp[w].x = (blockParent.getBoundingClientRect().left + window.scrollX) + (parseInt(blockParent.offsetWidth) / 2) + this.canvas_div.scrollLeft;

                        this.blockstemp[w].y = (blockParent.getBoundingClientRect().top + window.scrollY) + (parseInt(blockParent.offsetHeight) / 2) + this.canvas_div.scrollTop;

                    }
                }

                this.blockstemp.filter(a => a.id == 0)[0].x = (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).width) / 2);

                this.blockstemp.filter(a => a.id == 0)[0].y = (this.drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(this.drag).height) / 2);

                this.blocks = this.blocks.concat(this.blockstemp);
                this.blockstemp = [];

            } else if (this.active && this.blocks.length == 0 && (this.drag.getBoundingClientRect().top + window.scrollY) > (this.canvas_div.getBoundingClientRect().top + window.scrollY) && (this.drag.getBoundingClientRect().left + window.scrollX) > (this.canvas_div.getBoundingClientRect().left + window.scrollX)) {

                this.blockSnap(true, undefined);
                this.active = false;
                this.drag.style.top = ((this.drag.getBoundingClientRect().top + window.scrollY) - (this.canvas_div.getBoundingClientRect().top + window.scrollY) + this.canvas_div.scrollTop) + "px";

                this.drag.style.left = ((this.drag.getBoundingClientRect().left + window.scrollX) - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

                this.canvas_div.appendChild(this.drag);

                this.blocks.push({
                    parent: -1,
                    childwidth: 0,
                    id: parseInt(this.drag.querySelector(".blockid").value),
                    x: (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft,
                    y: (this.drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop,
                    width: parseInt(window.getComputedStyle(this.drag).width),
                    height: parseInt(window.getComputedStyle(this.drag).height)
                });
            } else if (this.active && this.blocks.length == 0) {

                this.canvas_div.appendChild(document.querySelector(".indicator"));
                this.drag.parentNode.removeChild(this.drag);

            } else if (this.active || this.rearrange) {

                let xpos = (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

                let ypos = (this.drag.getBoundingClientRect().top + window.scrollY) + this.canvas_div.scrollTop;

                let blocko = this.blocks.map(a => a.id);

                for (let i = 0; i < this.blocks.length; i++) {

                    if (xpos >= this.blocks.filter(a => a.id == blocko[i])[0].x - (this.blocks.filter(a => a.id == blocko[i])[0].width / 2) - this.paddingx && xpos <= this.blocks.filter(a => a.id == blocko[i])[0].x + (this.blocks.filter(a => a.id == blocko[i])[0].width / 2) + this.paddingx && ypos >= this.blocks.filter(a => a.id == blocko[i])[0].y - (this.blocks.filter(a => a.id == blocko[i])[0].height / 2) && ypos <= this.blocks.filter(a => a.id == blocko[i])[0].y + this.blocks.filter(a => a.id == blocko[i])[0].height) {

                        this.active = false;

                        if (!this.rearrange && this.blockSnap(false, this.blocks.filter(id => id.id == blocko[i])[0])) {

                            this.snap(i, blocko);

                        } else if (this.rearrange) {

                            this.snap(i,blocko);

                        }
                        break;

                    } else if (i == this.blocks.length - 1) {
                        if (this.rearrange) {
                            this.rearrange = false;
                            this.blockstemp = [];
                        }
                        this.active = false;
                        this.canvas_div.appendChild(document.querySelector(".indicator"));
                        this.drag.parentNode.removeChild(this.drag);
                    }
                }
            }
        }
    }

    snap = (i, blocko) => {
        if (!this.rearrange) {
            this.canvas_div.appendChild(this.drag);
        }
        let totalwidth = 0;
        let totalremove = 0;
        let maxheight = 0;

        for (let w = 0; w < this.blocks.filter(id => id.parent == blocko[i]).length; w++) {

            let children = this.blocks.filter(id => id.parent == blocko[i])[w];

            if (children.childwidth > children.width) {
                totalwidth += children.childwidth + this.paddingx;
            } else {
                totalwidth += children.width + this.paddingx;
            }

        }

        totalwidth += parseInt(window.getComputedStyle(this.drag).width);

        for (let w = 0; w < this.blocks.filter(id => id.parent == blocko[i]).length; w++) {

            let children = this.blocks.filter(id => id.parent == blocko[i])[w];

            if (children.childwidth > children.width) {

                document.querySelector(".blockid[value='" + children.id + "']").parentNode.style.left = (this.blocks.filter(a => a.id == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2)) + "px";

                children.x = this.blocks.filter(id => id.parent == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
                totalremove += children.childwidth + this.paddingx;
            } else {

                document.querySelector(".blockid[value='" + children.id + "']").parentNode.style.left = (this.blocks.filter(a => a.id == blocko[i])[0].x - (totalwidth / 2) + totalremove) + "px";

                children.x = this.blocks.filter(id => id.parent == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
                totalremove += children.width + this.paddingx;
            }
        }

        this.drag.style.left = (this.blocks.filter(id => id.id == blocko[i])[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

        this.drag.style.top = (this.blocks.filter(id => id.id == blocko[i])[0].y + (this.blocks.filter(id => id.id == blocko[i])[0].height / 2) + this.paddingy - (this.canvas_div.getBoundingClientRect().top + window.scrollY)) + "px";

        if (this.rearrange) {

            this.blockstemp.filter(a => a.id == parseInt(this.drag.querySelector(".blockid").value))[0].x = (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft + this.canvas_div.scrollLeft;

            this.blockstemp.filter(a => a.id == parseInt(this.drag.querySelector(".blockid").value))[0].y = (this.drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop;
            this.blockstemp.filter(a => a.id == this.drag.querySelector(".blockid").value)[0].parent = blocko[i];

            for (let w = 0; w < this.blockstemp.length; w++) {

                if (this.blockstemp[w].id != parseInt(this.drag.querySelector(".blockid").value)) {

                    const blockParent = document.querySelector(".blockid[value='" + this.blockstemp[w].id + "']").parentNode;
                    const arrowParent = document.querySelector(".arrowid[value='" + this.blockstemp[w].id + "']").parentNode;

                    blockParent.style.left = ((blockParent.getBoundingClientRect().left + window.scrollX) - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

                    blockParent.style.top = ((blockParent.getBoundingClientRect().top + window.scrollY) - (this.canvas_div.getBoundingClientRect().top + window.scrollY) + this.canvas_div.scrollTop) + "px";

                    arrowParent.style.left = ((arrowParent.getBoundingClientRect().left + window.scrollX) - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft + 20) + "px";

                    arrowParent.style.top = ((arrowParent.getBoundingClientRect().top + window.scrollY) - (this.canvas_div.getBoundingClientRect().top + window.scrollY) + this.canvas_div.scrollTop) + "px";

                    this.canvas_div.appendChild(blockParent);
                    this.canvas_div.appendChild(arrowParent);

                    this.blockstemp[w].x = (blockParent.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(blockParent).width) / 2) + this.canvas_div.scrollLeft;
                    this.blockstemp[w].y = (blockParent.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(blockParent).height) / 2) + this.canvas_div.scrollTop;

                }
            }
            this.blocks = this.blocks.concat(this.blockstemp);
            this.blockstemp = [];
        } else {
            this.blocks.push({
                childwidth: 0,
                parent: blocko[i],
                id: parseInt(this.drag.querySelector(".blockid").value),
                x: (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft,
                y: (this.drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop,
                width: parseInt(window.getComputedStyle(this.drag).width),
                height: parseInt(window.getComputedStyle(this.drag).height)
            });
        }

        let arrowhelp = this.blocks.filter(a => a.id == parseInt(this.drag.querySelector(".blockid").value))[0];

        let arrowx = arrowhelp.x - this.blocks.filter(a => a.id == blocko[i])[0].x + 20;

        let arrowy = parseFloat(arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(id => id.parent == blocko[i])[0].y + (this.blocks.filter(id => id.parent == blocko[i])[0].height / 2)) + this.canvas_div.scrollTop);

        if (arrowx < 0) {

            this.canvas_div.innerHTML += '<div class="arrowblock"><input type="hidden" class="arrowid" value="' + this.drag.querySelector(".blockid").value + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' + (this.blocks.filter(a => a.id == blocko[i])[0].x - arrowhelp.x + 5) + ' 0L' + (this.blocks.filter(a => a.id == blocko[i])[0].x - arrowhelp.x + 5) + ' ' + (this.paddingy / 2) + 'L5 ' + (this.paddingy / 2) + 'L5 ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' + (arrowy - 5) + 'H10L5 ' + arrowy + 'L0 ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg></div>';

            document.querySelector('.arrowid[value="' + this.drag.querySelector(".blockid").value + '"]').parentNode.style.left = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

        } else {

            this.canvas_div.innerHTML += '<div class="arrowblock"><input type="hidden" class="arrowid" value="' + this.drag.querySelector(".blockid").value + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' + (this.paddingy / 2) + 'L' + (arrowx) + ' ' + (this.paddingy / 2) + 'L' + arrowx + ' ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' + (arrowx - 5) + ' ' + (arrowy - 5) + 'H' + (arrowx + 5) + 'L' + arrowx + ' ' + arrowy + 'L' + (arrowx - 5) + ' ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg></div>';

            document.querySelector('.arrowid[value="' + parseInt(this.drag.querySelector(".blockid").value) + '"]').parentNode.style.left = (this.blocks.filter(a => a.id == blocko[i])[0].x - 20 - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

        }

        document.querySelector('.arrowid[value="' + parseInt(this.drag.querySelector(".blockid").value) + '"]').parentNode.style.top = (this.blocks.filter(a => a.id == blocko[i])[0].y + (this.blocks.filter(a => a.id == blocko[i])[0].height / 2)) + "px";

        if (this.blocks.filter(a => a.id == blocko[i])[0].parent != -1) {
            let flag = false;
            let idval = blocko[i];
            while (!flag) {
                if (this.blocks.filter(a => a.id == idval)[0].parent == -1) {
                    flag = true;
                } else {
                    let zwidth = 0;
                    for (let w = 0; w < this.blocks.filter(id => id.parent == idval).length; w++) {
                        let children = this.blocks.filter(id => id.parent == idval)[w];
                        if (children.childwidth > children.width) {
                            if (w == this.blocks.filter(id => id.parent == idval).length - 1) {
                                zwidth += children.childwidth;
                            } else {
                                zwidth += children.childwidth + this.paddingx;
                            }
                        } else {
                            if (w == this.blocks.filter(id => id.parent == idval).length - 1) {
                                zwidth += children.width;
                            } else {
                                zwidth += children.width + this.paddingx;
                            }
                        }
                    }
                    this.blocks.filter(a => a.id == idval)[0].childwidth = zwidth;
                    idval = this.blocks.filter(a => a.id == idval)[0].parent;
                }
            }
            this.blocks.filter(id => id.id == idval)[0].childwidth = totalwidth;
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
            if (result[z] == -1) {
                z++;
            }
            let totalwidth = 0;
            let totalremove = 0;
            let maxheight = 0;
            for (let w = 0; w < this.blocks.filter(id => id.parent == result[z]).length; w++) {
                let children = this.blocks.filter(id => id.parent == result[z])[w];
                if (this.blocks.filter(id => id.parent == children.id).length == 0) {
                    children.childwidth = 0;
                }
                if (children.childwidth > children.width) {
                    if (w == this.blocks.filter(id => id.parent == result[z]).length - 1) {
                        totalwidth += children.childwidth;
                    } else {
                        totalwidth += children.childwidth + this.paddingx;
                    }
                } else {
                    if (w == this.blocks.filter(id => id.parent == result[z]).length - 1) {
                        totalwidth += children.width;
                    } else {
                        totalwidth += children.width + this.paddingx;
                    }
                }
            }
            if (result[z] != -1) {
                this.blocks.filter(a => a.id == result[z])[0].childwidth = totalwidth;
            }
            for (let w = 0; w < this.blocks.filter(id => id.parent == result[z]).length; w++) {
                let children = this.blocks.filter(id => id.parent == result[z])[w];
                const r_block = document.querySelector(".blockid[value='" + children.id + "']").parentNode;
                const r_array = this.blocks.filter(id => id.id == result[z]);

                r_block.style.top = (r_array.y + this.paddingy) + "px";

                r_array.y = r_array.y + this.paddingy;

                if (children.childwidth > children.width) {

                    r_block.style.left = (r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) - (this.canvas_div.getBoundingClientRect().left + window.scrollX))+ "px";

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);

                    totalremove += children.childwidth + this.paddingx;

                } else {

                    r_block.style.left = (r_array[0].x - (totalwidth / 2) + totalremove - (this.canvas_div.getBoundingClientRect().left + window.scrollX)) + "px";

                    children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.width / 2);

                    totalremove += children.width + this.paddingx;

                }

                let arrowhelp = this.blocks.filter(a => a.id == children.id)[0];

                let arrowx = arrowhelp.x - this.blocks.filter(a => a.id == children.parent)[0].x + 20;

                let arrowy = arrowhelp.y - (arrowhelp.height / 2) - (this.blocks.filter(a => a.id == children.parent)[0].y + (this.blocks.filter(a => a.id == children.parent)[0].height / 2));

                document.querySelector('.arrowid[value="' + children.id + '"]').parentNode.style.top = (this.blocks.filter(id => id.id == children.parent)[0].y + (this.blocks.filter(id => id.id == children.parent)[0].height / 2) - (this.canvas_div.getBoundingClientRect().top + window.scrollY)) + "px";

                if (arrowx < 0) {

                    document.querySelector('.arrowid[value="' + children.id + '"]').parentNode.style.left = ((arrowhelp.x - 5) - (this.canvas_div.getBoundingClientRect().left + window.scrollX)) + "px";

                    document.querySelector('.arrowid[value="' + children.id + '"]').parentNode.innerHTML = '<input type="hidden" class="arrowid" value="' + children.id + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' + (this.blocks.filter(id => id.id == children.parent)[0].x - arrowhelp.x + 5) + ' 0L' + (this.blocks.filter(id => id.id == children.parent)[0].x - arrowhelp.x + 5) + ' ' + (this.paddingy / 2) + 'L5 ' + (this.paddingy / 2) + 'L5 ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' + (arrowy - 5) + 'H10L5 ' + arrowy + 'L0 ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg>';

                } else {

                    document.querySelector('.arrowid[value="' + children.id + '"]').parentNode.style.left = (this.blocks.filter(id => id.id == children.parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left + window.scrollX)) + "px";

                    document.querySelector('.arrowid[value="' + children.id + '"]').parentNode.innerHTML = '<input type="hidden" class="arrowid" value="' + children.id + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' + (this.paddingy / 2) + 'L' + (arrowx) + ' ' + (this.paddingy / 2) + 'L' + arrowx + ' ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' + (arrowx - 5) + ' ' + (arrowy - 5) + 'H' + (arrowx + 5) + 'L' + arrowx + ' ' + arrowy + 'L' + (arrowx - 5) + ' ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/></svg>';
                }
            }
        }
    }

    checkOffset = () => {
        this.offsetleft = this.blocks.map(a => a.x);
        let widths = this.blocks.map(a => a.width);
        let mathmin = this.offsetleft.map((item, index) => {
            return item - (widths[index] / 2);
        })
        this.offsetleft = Math.min.apply(Math, mathmin);
        if (this.offsetleft < (this.canvas_div.getBoundingClientRect().left + window.scrollX)) {
            this.lastevent = true;
            let blocko = this.blocks.map(a => a.id);
            for (let w = 0; w < this.blocks.length; w++) {

                document.querySelector(".blockid[value='" + this.blocks.filter(a => a.id == blocko[w])[0].id + "']").parentNode.style.left = (this.blocks.filter(a => a.id == blocko[w])[0].x - (this.blocks.filter(a => a.id == blocko[w])[0].width / 2) - this.offsetleft + 20) +"px";

                if (this.blocks.filter(a => a.id == blocko[w])[0].parent != -1) {
                    let arrowhelp = this.blocks.filter(a => a.id == blocko[w])[0];
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id == this.blocks.filter(a => a.id == blocko[w])[0].parent)[0].x;
                    if (arrowx < 0) {
                        document.querySelector('.arrowid[value="' + blocko[w] + '"]').parentNode.style.left = (arrowhelp.x - this.offsetleft + 20 - 5) + "px";
                    } else {
                        document.querySelector('.arrowid[value="' + blocko[w] + '"]').parentNode.style.left = (this.blocks.filter(id => id.id == this.blocks.filter(a => a.id == blocko[w])[0].parent)[0].x - 20 - this.offsetleft + 20) + "px";
                    }
                }
            }
            for (let w = 0; w < this.blocks.length; w++) {

                this.blocks[w].x = (document.querySelector(".blockid[value='" + this.blocks[w].id + "']").parentNode.getBoundingClientRect().left + window.scrollX) + (this.canvas_div.getBoundingClientRect().left + this.canvas_div.scrollLeft) - (parseInt(window.getComputedStyle(document.querySelector(".blockid[value='" + this.blocks[w].id + "']").parentNode).width) / 2) - 40;

            }
            this.offsetleftold = this.offsetleft;
        }
    }

    touchblock = (event) => {
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
                if (event.which != 3) {
                    if (!this.active && !this.rearrange) {
                        this.dragblock = true;
                        this.drag = theblock;
                        this.dragx = this.mouse_x - (this.drag.getBoundingClientRect().left + window.scrollX);
                        this.dragy = this.mouse_y - (this.drag.getBoundingClientRect().top + window.scrollY);
                    }
                }
            }
        }
    }

    hasParentClass = (element, classname) => {
        if (element.className) {
            if (element.className.split(' ').indexOf(classname)>=0) return true;
        }
        return element.parentNode && this.hasParentClass(element.parentNode, classname);
    }

    moveBlock = (event) => {

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
            this.blockstemp.push(this.blocks.filter(a => a.id == blockid)[0]);
            this.blocks = this.blocks.filter((e) => {
                return e.id != blockid
            });
            if (blockid != 0) {
                document.querySelector(".arrowid[value='" + blockid + "']").parentNode.remove();
            }
            let layer = this.blocks.filter(a => a.parent == blockid);
            let flag = false;
            let foundids = [];
            let allids = [];
            while (!flag) {
                for (let i = 0; i < layer.length; i++) {
                    if (layer[i] != blockid) {

                        this.blockstemp.push(this.blocks.filter(a => a.id == layer[i].id)[0]);

                        const blockParent = document.querySelector(".blockid[value='" + layer[i].id + "']").parentNode;

                        const arrowParent = document.querySelector(".arrowid[value='" + layer[i].id + "']").parentNode;

                        blockParent.style.left = ((blockParent.getBoundingClientRect().left + window.scrollX) - (this.drag.getBoundingClientRect().left + window.scrollX)) + "px";

                        blockParent.style.top = ((blockParent.getBoundingClientRect().top + window.scrollY) - (this.drag.getBoundingClientRect().top + window.scrollY)) + "px";

                        arrowParent.style.left = ((arrowParent.getBoundingClientRect().left + window.scrollX) - (this.drag.getBoundingClientRect().left + window.scrollX)) + "px";

                        arrowParent.style.top = ((arrowParent.getBoundingClientRect().top + window.scrollY) - (this.drag.getBoundingClientRect().top + window.scrollY)) + "px";

                        this.drag.appendChild(blockParent);
                        this.drag.appendChild(arrowParent);

                        foundids.push(layer[i].id);
                        allids.push(layer[i].id);
                    }
                }
                if (foundids.length == 0) {
                    flag = true;
                } else {
                    layer = this.blocks.filter(a => foundids.includes(a.parent));
                    foundids = [];
                }
            }
            for (let i = 0; i < this.blocks.filter(a => a.parent == blockid).length; i++) {
                let blocknumber = this.blocks.filter(a => a.parent == blockid)[i];
                this.blocks = this.blocks.filter((e) => {
                    return e.id != blocknumber
                });
            }
            for (let i = 0; i < allids.length; i++) {
                let blocknumber = allids[i];
                this.blocks = this.blocks.filter((e) => {
                    return e.id != blocknumber
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

            this.drag.style.left = (this.mouse_x - this.dragx) + "px";
            this.drag.style.top = (this.mouse_y - this.dragy) + "px";

        } else if (this.rearrange) {

            this.drag.style.left = (this.mouse_x - this.dragx - (this.canvas_div.getBoundingClientRect().left + window.scrollX) + this.canvas_div.scrollLeft) + "px";

            this.drag.style.top = (this.mouse_y - this.dragy - (this.canvas_div.getBoundingClientRect().top + window.scrollY) + this.canvas_div.scrollTop) + "px";

            this.blockstemp.filter(a => a.id == parseInt(this.drag.querySelector(".blockid").value)).x = (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;

            this.blockstemp.filter(a => a.id == parseInt(this.drag.querySelector(".blockid").value)).y = (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).height) / 2) + this.canvas_div.scrollTop;

        }
        if (this.active || this.rearrange) {

            this.aclick = false;

            let xpos = (this.drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(this.drag).width) / 2) + this.canvas_div.scrollLeft;
            let ypos = (this.drag.getBoundingClientRect().top + window.scrollY) + this.canvas_div.scrollTop;
            let blocko = this.blocks.map(a => a.id);
            for (let i = 0; i < this.blocks.length; i++) {
                if (xpos >= this.blocks.filter(a => a.id == blocko[i])[0].x - (this.blocks.filter(a => a.id == blocko[i])[0].width / 2) - this.paddingx && xpos <= this.blocks.filter(a => a.id == blocko[i])[0].x + (this.blocks.filter(a => a.id == blocko[i])[0].width / 2) + this.paddingx && ypos >= this.blocks.filter(a => a.id == blocko[i])[0].y - (this.blocks.filter(a => a.id == blocko[i])[0].height / 2) && ypos <= this.blocks.filter(a => a.id == blocko[i])[0].y + this.blocks.filter(a => a.id == blocko[i])[0].height) {

                    document.querySelector(".blockid[value='" + blocko[i] + "']").parentNode.appendChild(document.querySelector(".indicator"));

                    document.querySelector(".indicator").style.left = ((parseInt(window.getComputedStyle(document.querySelector(".blockid[value='" + blocko[i] + "']").parentNode).width) / 2) - 5) + "px";

                    document.querySelector(".indicator").style.top = (window.getComputedStyle(document.querySelector(".blockid[value='" + blocko[i] + "']").parentNode).height) + "px";

                    document.querySelector(".indicator").classList.remove("invisible");

                    break;
                } else if (i == this.blocks.length - 1) {
                    if (!document.querySelector(".indicator").classList.contains("invisible")) {
                        document.querySelector(".indicator").classList.add("invisible");
                    }
                }
            }
        }
    }

    fixOffset = () => {
        if (this.offsetleftold < (this.canvas_div.getBoundingClientRect().left + window.scrollX)) {

            this.lastevent = false;
            let blocko = this.blocks.map(a => a.id);
            for (let w = 0; w < this.blocks.length; w++) {

                document.querySelector(".blockid[value='" + this.blocks.filter(a => a.id == blocko[w])[0].id + "']").parentNode.style.left = (this.blocks.filter(a => a.id == blocko[w])[0].x - (this.blocks.filter(a => a.id == blocko[w])[0].width / 2) - this.offsetleftold - 20) + "px";

                this.blocks.filter(a => a.id == blocko[w])[0].x = (document.querySelector(".blockid[value='" + this.blocks.filter(a => a.id == blocko[w])[0].id + "']").parentNode.getBoundingClientRect().left + window.scrollX) + (this.blocks.filter(a => a.id == blocko[w])[0].width / 2);

                if (this.blocks.filter(a => a.id == blocko[w])[0].parent != -1) {

                    let arrowhelp = this.blocks.filter(a => a.id == blocko[w])[0];
                    let arrowx = arrowhelp.x - this.blocks.filter(a => a.id == this.blocks.filter(a => a.id == blocko[w])[0].parent)[0].x;

                    if (arrowx < 0) {

                        document.querySelector('.arrowid[value="' + blocko[w] + '"]').parentNode.style.left = (arrowhelp.x - 5 - (this.canvas_div.getBoundingClientRect().left + window.scrollX)) + "px";

                    } else {

                        document.querySelector('.arrowid[value="' + blocko[w] + '"]').parentNode.style.left = (this.blocks.filter(id => id.id == this.blocks.filter(a => a.id == blocko[w])[0].parent)[0].x - 20 - (this.canvas_div.getBoundingClientRect().left + window.scrollX)) + "px";
                    }
                }
            }
            this.offsetleftold = 0;
        }
    }

    load (canvas, spacing_x, spacing_y) {
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
        this.dragx = undefined;
        this.dragy = undefined;
        this.original = undefined;
        this.drag = undefined;
        this.mouse_x = undefined;
        this.mouse_y = undefined;
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

    exportData= e => {
        this.chartData = JSON.stringify(this.output());
        localStorage.setItem("journey_1",this.chartData);
        this.deleteBlocks();
    }

    importData = e => {

        this.chartData = localStorage.getItem("journey_1");
        if(this.chartData){
            this.import(JSON.parse(this.chartData));
        }

    }

    zoomIn = e => {

    }

    zoomOut = e => {

    }

    render() {
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
                                fill={this.state.editMode}
                                onChange={this.startEdit}
                                isSelected={this.state.editMode}
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

                            {this.state.editMode ? <Blocks></Blocks> : null}

                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiPageContent paddingSize="none" >
                                {this.state.showSettings? <Flyout closeSettings={this.closeSettings} /> : null}
                                <div id="canvas" className={this.state.editMode ? 'edit-bg' : 'view-bg'} ref={this.canvasRef}></div>
                            </EuiPageContent>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageBody>
            </EuiPage>
        )
    }
}
